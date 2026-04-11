import { NavLink } from 'react-router-dom'

function TaskIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="3" width="18" height="16" rx="3" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8"/>
      <path d="M6 8h10M6 12h7" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function PeopleIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8.5" cy="8" r="3" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8"/>
      <path d="M2 18c0-3.314 2.91-6 6.5-6" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="15" cy="8" r="3" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8"/>
      <path d="M20 18c0-3.314-2.91-6-5-6" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function ActivityIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <polyline points="2,14 6,9 10,13 14,6 18,10 20,8" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function AccountIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="4" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8"/>
      <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={active ? '#0CC5B9' : '#7E8A93'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

const tabs = [
  { to: '/dashboard/tasks',   label: 'Tasks',    Icon: TaskIcon },
  { to: '/dashboard/friends', label: 'People',   Icon: PeopleIcon },
  { to: '/dashboard/activity',label: 'Activity', Icon: ActivityIcon },
  { to: '/dashboard/account', label: 'Account',  Icon: AccountIcon },
]

export default function BottomNav() {
  return (
    <nav className="bg-white shadow-nav border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive ? 'bg-teal-light' : ''
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className={`text-[11px] font-semibold ${isActive ? 'text-teal' : 'text-muted'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
