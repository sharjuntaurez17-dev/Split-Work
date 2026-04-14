import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function FriendsScreen() {
  const { members, chores, turnHistory } = useApp()
  const navigate = useNavigate()

  function getChoreCount(memberId) {
    return chores.filter(c =>
      c.assignee_id === memberId || (c.rotation && c.rotation.includes(memberId))
    ).length
  }

  function getTurnCount(memberId) {
    return turnHistory.filter(h => h.memberId === memberId).length
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Friends</div>
          <div className="text-[#22313F] text-[24px] font-extrabold mt-1">House friends</div>
        </div>
        <button onClick={() => navigate('/add-people')}
          className="w-10 h-10 rounded-2xl bg-[#E9FAF8] text-[#0CC5B9] flex items-center justify-center font-bold text-xl">
          +
        </button>
      </div>

      {/* Total members card */}
      <div className="mt-5 rounded-[22px] bg-white p-4 shadow-sm border border-slate-100">
        <div className="text-[#22313F] font-bold text-[15px]">Total members</div>
        <div className="text-3xl font-extrabold text-[#0CC5B9] mt-2">{members.length}</div>
        <div className="text-[#7F8A94] text-sm mt-1">Everyone in the shared house</div>
      </div>

      {/* Member list — tap to see details */}
      <div className="mt-4 space-y-3">
        {members.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <div className="text-3xl">🏠</div>
            <div className="text-[#7F8A94] text-sm">No housemates yet</div>
          </div>
        ) : (
          members.map(member => (
            <button key={member.id}
              onClick={() => navigate(`/member/${member.id}`)}
              className="w-full bg-white rounded-[18px] p-4 shadow-sm border border-slate-100 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0CC5B9] text-white flex items-center justify-center font-bold">
                  {(member.name ?? '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[#25303D] font-bold text-[15px]">{member.name ?? 'Unknown'}</div>
                  <div className="text-[#7F8A94] text-sm">
                    {getTurnCount(member.id)} turns this month
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#25303D] font-bold text-sm">{getChoreCount(member.id)}</div>
                <div className="text-[#A0A8B0] text-xs">chores</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
