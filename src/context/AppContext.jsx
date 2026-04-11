import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

const MEMBERS_KEY = 'splitwork_members'
const CHORES_KEY = 'splitwork_chores'

function loadLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] }
  catch { return [] }
}

export function AppProvider({ children }) {
  const { profile } = useAuth()
  const [chores, setChores] = useState(() => loadLocal(CHORES_KEY))
  const [members, setMembers] = useState(() => loadLocal(MEMBERS_KEY))
  const [house, setHouse] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile?.house_id) {
      // In local-only mode, keep localStorage data
      setChores(loadLocal(CHORES_KEY))
      setMembers(loadLocal(MEMBERS_KEY))
      setHouse(null)
      return
    }

    setLoading(true)
    Promise.all([
      supabase.from('chores').select('*, assignee:profiles!chores_assignee_id_fkey(name)').eq('house_id', profile.house_id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('house_id', profile.house_id),
      supabase.from('houses').select('*').eq('id', profile.house_id).single(),
    ]).then(([{ data: c }, { data: m }, { data: h }]) => {
      setChores(c ?? [])
      setMembers(m ?? [])
      setHouse(h)
      setLoading(false)
    })

    // Realtime subscription
    const channel = supabase
      .channel(`chores-${profile.house_id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'chores', filter: `house_id=eq.${profile.house_id}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // fetch with assignee join
            const { data } = await supabase
              .from('chores')
              .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
              .eq('id', payload.new.id)
              .single()
            if (data) setChores(c => [data, ...c])
          }
          if (payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('chores')
              .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
              .eq('id', payload.new.id)
              .single()
            if (data) setChores(c => c.map(x => x.id === data.id ? data : x))
          }
          if (payload.eventType === 'DELETE') {
            setChores(c => c.filter(x => x.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile?.house_id])

  async function addChore({ title, assigneeId, dueDays, recurrenceDays }) {
    // If Supabase house is set, use remote
    if (profile?.house_id) {
      const { data, error } = await supabase
        .from('chores')
        .insert({
          house_id: profile.house_id,
          title,
          assignee_id: assigneeId || null,
          due_day: dueDays ?? null,
          recurrence_days: recurrenceDays ?? null,
          status: 'pending',
        })
        .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
        .single()
      if (error) throw error
      return data
    }
    // Local-only mode
    const assignee = members.find(m => m.id === assigneeId)
    const chore = {
      id: crypto.randomUUID(),
      title,
      assignee_id: assigneeId || null,
      assignee: assignee ? { name: assignee.name } : null,
      due_day: dueDays ?? null,
      recurrence_days: recurrenceDays ?? null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    setChores(c => {
      const updated = [chore, ...c]
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
    return chore
  }

  async function updateChoreStatus(id, status) {
    if (profile?.house_id) {
      const { error } = await supabase
        .from('chores')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    }
    setChores(c => {
      const updated = c.map(x => x.id === id ? { ...x, status } : x)
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  async function deleteChore(id) {
    if (profile?.house_id) {
      await supabase.from('chores').delete().eq('id', id)
    }
    setChores(c => {
      const updated = c.filter(x => x.id !== id)
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function addMember({ name, phone }) {
    const member = { id: crypto.randomUUID(), name, phone }
    setMembers(m => {
      const updated = [...m, member]
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updated))
      return updated
    })
    return member
  }

  function removeMember(id) {
    setMembers(m => {
      const updated = m.filter(x => x.id !== id)
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const pendingChores = chores.filter(c => c.status === 'pending')
  const doneChores = chores.filter(c => c.status === 'done')

  return (
    <AppContext.Provider value={{
      chores,
      pendingChores,
      doneChores,
      members,
      house,
      loading,
      addChore,
      updateChoreStatus,
      deleteChore,
      addMember,
      removeMember,
      DAY_NAMES,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
