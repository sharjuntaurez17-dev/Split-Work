import { NavLink } from 'react-router-dom'

function TaskTabIcon({ active }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shadow-sm ${
        active ? 'bg-[#20B8AE]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`relative w-7 h-7 ${active ? 'text-white' : 'text-[#4B8FF7]'}`}>
          <div className="absolute inset-0 rounded-full border-[4px] border-current" />
          <div className="absolute left-[7px] top-[6px] w-[11px] h-[6px] rotate-[-45deg] border-l-[4px] border-b-[4px] border-current" />
        </div>
      </div>
    </div>
  )
}

function PeopleTabIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-8 h-8 ${active ? 'text-[#16A085]' : 'text-[#5B616B]'}`}
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ActivityTabIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-8 h-8 ${active ? 'text-[#16A085]' : 'text-[#5B616B]'}`}
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 13h3l2-4 3 7 2-3" />
    </svg>
  )
}

function AccountTabIcon({ active }) {
  return (
    <div className={`w-9 h-9 rounded-full border-[3px] ${
      active ? 'border-[#3D4048]' : 'border-[#C9CDD3]'
    } overflow-hidden bg-white`}>
      <div className="w-full h-1/2 bg-[#F7D0C7]" />
      <div className="w-full h-1/2 bg-gradient-to-r from-[#FF6A3D] to-[#F12612]" />
    </div>
  )
}

const tabs = [
  { to: '/dashboard/activity', key: 'activity', label: 'Activity', Icon: ActivityTabIcon },
  { to: '/dashboard/tasks',    key: 'tasks',    label: 'Tasks',    Icon: TaskTabIcon },
  { to: '/dashboard/friends',  key: 'friends',  label: 'Friends',  Icon: PeopleTabIcon },
  { to: '/dashboard/account',  key: 'account',  label: 'Account',  Icon: AccountTabIcon },
]

export default function BottomNav() {
  return (
    <div className="bg-white border-t border-slate-300 px-2 pt-2 pb-5 flex justify-around safe-area-bottom">
      {tabs.map(({ to, key, label, Icon }) => (
        <NavLink key={to} to={to} className="relative flex flex-col items-center min-w-[64px] pt-3">
          {({ isActive }) => (
            <>
              <div className={`absolute top-0 h-[4px] w-16 rounded-full ${isActive ? 'bg-[#16A085]' : 'bg-transparent'}`} />
              <Icon active={isActive} />
              <div className={`mt-3 text-[11px] font-semibold ${isActive ? 'text-[#16A085]' : 'text-[#5B616B]'}`}>
                {label}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
