import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import MemberAvatar from '../components/MemberAvatar'

export default function FriendsScreen() {
  const { members, chores, house } = useApp()
  const { profile } = useAuth()
  const navigate = useNavigate()

  function getActiveChorCount(memberId) {
    return chores.filter(c => c.assignee_id === memberId && c.status === 'pending').length
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-[26px] font-extrabold text-navy">Housemates</div>
        <button
          onClick={() => navigate('/add-people')}
          className="w-10 h-10 rounded-full bg-teal flex items-center justify-center shadow-card"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {house && (
        <div className="text-muted text-[13px] mb-5">{house.name}</div>
      )}

      {/* Members grid */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="text-4xl">🏠</div>
          <div className="text-[16px] font-semibold text-slate">No housemates yet</div>
          <p className="text-muted text-[13px] text-center">Invite people using your house code</p>
          <button
            onClick={() => navigate('/add-people')}
            className="mt-2 btn-teal"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            Invite Someone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-2">
          {members.map(member => (
            <div key={member.id} className="flex flex-col items-center bg-white rounded-card shadow-sm py-4 px-2">
              <MemberAvatar
                name={member.name ?? member.user_id?.slice(0, 6)}
                size="lg"
                activeChores={getActiveChorCount(member.user_id)}
              />
              {member.user_id === profile?.user_id && (
                <span className="mt-1.5 text-[10px] font-semibold text-teal bg-teal-light px-2 py-0.5 rounded-full">You</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Invite code card */}
      {house?.invite_code && (
        <div className="card mt-6 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-muted uppercase tracking-wide mb-0.5">Invite Code</div>
            <div className="text-[20px] font-extrabold text-navy font-mono tracking-widest">{house.invite_code}</div>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(house.invite_code)}
            className="px-3 py-2 bg-teal-light text-teal rounded-xl text-[13px] font-semibold"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  )
}
