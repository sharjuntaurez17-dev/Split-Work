import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import MemberAvatar from '../components/MemberAvatar'

const MENU_ITEMS = [
  { icon: '➕', label: 'Add Chore',    route: '/add-chore' },
  { icon: '👥', label: 'Add People',   route: '/add-people' },
  { icon: '⚙️', label: 'Settings',     route: '/settings' },
]

export default function AccountScreen() {
  const { profile, logout } = useAuth()
  const { chores, house }   = useApp()
  const navigate = useNavigate()

  const myChores = chores.filter(c => c.assignee_id === profile?.user_id)
  const myActive = myChores.filter(c => c.status === 'pending').length
  const myDone   = myChores.filter(c => c.status === 'done').length

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Profile card */}
      <div className="card flex items-center gap-4 mb-5">
        <MemberAvatar name={profile?.name ?? 'You'} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="text-[18px] font-extrabold text-navy truncate">{profile?.name ?? '—'}</div>
          {profile?.phone && <div className="text-[13px] text-muted">{profile.phone}</div>}
          {house && <div className="text-[12px] text-teal font-semibold mt-0.5">{house.name}</div>}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card text-center">
          <div className="text-[28px] font-extrabold text-teal">{myActive}</div>
          <div className="text-[12px] text-muted font-semibold">Active chores</div>
        </div>
        <div className="card text-center">
          <div className="text-[28px] font-extrabold text-navy">{myDone}</div>
          <div className="text-[12px] text-muted font-semibold">Completed</div>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-2 mb-6">
        {MENU_ITEMS.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.route)}
            className="bg-white rounded-card px-4 py-4 flex items-center gap-3.5 shadow-sm w-full text-left active:scale-[0.98] transition-transform"
          >
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <span className="flex-1 text-[15px] font-semibold text-navy">{item.label}</span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="#7E8A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={() => { logout(); navigate('/login') }}
        className="w-full py-3.5 rounded-[14px] border border-red-200 text-red-500 text-[15px] font-semibold bg-red-50 active:scale-[0.98] transition-transform"
      >
        Sign Out
      </button>
    </div>
  )
}
