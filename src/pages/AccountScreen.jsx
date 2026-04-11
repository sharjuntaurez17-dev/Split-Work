import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountScreen() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Add chores', desc: 'Create new chores for the house', icon: '+', route: '/add-chore' },
    { label: 'Add people in the house', desc: 'Invite or add house members', icon: '+', route: '/add-people' },
    { label: 'Settings', desc: 'Manage notifications, house rules, and preferences', icon: '⚙', route: '/settings' },
  ]

  return (
    <div className="p-5">
      {/* Profile header */}
      <div className="flex flex-col items-center pt-3">
        <div className="w-20 h-20 rounded-full bg-[#0CC5B9] text-white flex items-center justify-center text-3xl font-bold shadow-lg">
          {profile?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
        <div className="text-[#22313F] text-[22px] font-extrabold mt-4">{profile?.name ?? 'User'}</div>
        <div className="text-[#7F8A94] text-sm mt-1">House admin</div>
      </div>

      {/* Menu items */}
      <div className="mt-5 space-y-3">
        {menuItems.map(item => (
          <button key={item.label} onClick={() => navigate(item.route)}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100 flex items-center justify-between w-full text-left">
            <div>
              <div className="text-[#25303D] font-bold text-[15px]">{item.label}</div>
              <div className="text-[#7F8A94] text-sm mt-1">{item.desc}</div>
            </div>
            <div className="text-[#0CC5B9] font-bold">{item.icon}</div>
          </button>
        ))}

        {/* Sign out */}
        <button onClick={() => { logout(); navigate('/') }}
          className="bg-white rounded-[18px] p-4 shadow-sm border border-red-100 flex items-center justify-between w-full text-left mt-4">
          <div>
            <div className="text-red-500 font-bold text-[15px]">Sign out</div>
            <div className="text-[#7F8A94] text-sm mt-1">Log out of your account</div>
          </div>
          <div className="text-red-400 font-bold">→</div>
        </button>
      </div>
    </div>
  )
}
