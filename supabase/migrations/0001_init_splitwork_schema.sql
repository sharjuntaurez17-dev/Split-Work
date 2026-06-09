-- Splitwork initial schema: houses, profiles, chores
-- Derived from app usage in src/context/AppContext.jsx and src/context/AuthContext.jsx
-- Security model: a profile belongs to one auth user and (optionally) one house.
-- Members of a house can read/manage that house's profiles and chores.

create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.houses (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique
                default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  created_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  house_id   uuid references public.houses(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.chores (
  id              uuid primary key default gen_random_uuid(),
  house_id        uuid not null references public.houses(id) on delete cascade,
  title           text not null,
  -- FK name is intentionally the Postgres default `chores_assignee_id_fkey`,
  -- which the app relies on for the embedded join:
  --   .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
  assignee_id     uuid references public.profiles(id) on delete set null,
  due_day         int,
  recurrence_days int,
  status          text not null default 'pending' check (status in ('pending', 'done')),
  created_at      timestamptz not null default now()
);

create index if not exists chores_house_id_idx     on public.chores(house_id);
create index if not exists chores_assignee_id_idx   on public.chores(assignee_id);
create index if not exists profiles_house_id_idx    on public.profiles(house_id);

-- ── Helper: current user's house_id ──────────────────────────────────────────
-- SECURITY DEFINER so RLS policies on `profiles` can reference the caller's
-- house without recursively triggering profiles RLS. It only ever returns the
-- caller's OWN house (filtered by auth.uid()), so it leaks nothing.

create or replace function public.current_house_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select house_id from public.profiles where user_id = auth.uid()
$$;

-- ── Auto-create a profile row when a new auth user signs up ──────────────────
-- The app's signup() only calls supabase.auth.signUp and never inserts a
-- profile, so we create one here.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table public.houses   enable row level security;
alter table public.profiles enable row level security;
alter table public.chores   enable row level security;

-- houses: any authenticated user may look up a house (needed so joinHouse can
-- resolve an invite_code for a house they are not yet a member of) and create one.
drop policy if exists houses_select on public.houses;
create policy houses_select on public.houses
  for select to authenticated using (true);

drop policy if exists houses_insert on public.houses;
create policy houses_insert on public.houses
  for insert to authenticated with check (true);

drop policy if exists houses_update on public.houses;
create policy houses_update on public.houses
  for update to authenticated
  using (id = public.current_house_id())
  with check (id = public.current_house_id());

-- profiles: see your own profile or anyone in your house; edit only your own.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or house_id = public.current_house_id());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- chores: full access scoped to the caller's house.
drop policy if exists chores_select on public.chores;
create policy chores_select on public.chores
  for select to authenticated using (house_id = public.current_house_id());

drop policy if exists chores_insert on public.chores;
create policy chores_insert on public.chores
  for insert to authenticated with check (house_id = public.current_house_id());

drop policy if exists chores_update on public.chores;
create policy chores_update on public.chores
  for update to authenticated
  using (house_id = public.current_house_id())
  with check (house_id = public.current_house_id());

drop policy if exists chores_delete on public.chores;
create policy chores_delete on public.chores
  for delete to authenticated using (house_id = public.current_house_id());

-- ── Data API grants (in case hardened Data API settings don't auto-grant) ────
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.houses, public.profiles, public.chores to authenticated;

-- ── Realtime: app subscribes to postgres_changes on public.chores ────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chores'
  ) then
    alter publication supabase_realtime add table public.chores;
  end if;
end $$;
