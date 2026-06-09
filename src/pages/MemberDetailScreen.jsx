import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function MemberDetailScreen() {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const { members, getMemberStats, DAY_NAMES } = useApp()

  const member = members.find(m => m.id === memberId)
  if (!member) {
    return (
      <div className="screen bg-[#F4F7F6]">
        <div className="screen-inner p-5 flex flex-col items-center justify-center">
          <div className="text-2xl mb-2">😕</div>
          <div className="text-[#7F8A94] text-sm">Member not found</div>
          <button onClick={() => navigate(-1)} className="mt-4 text-[#0CC5B9] font-bold text-sm">Go back</button>
        </div>
      </div>
    )
  }

  const { memberChores, turnsThisMonth, choreBreakdown } = getMemberStats(memberId)
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Member</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">{member.name}</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Back</button>
        </div>

        {/* Profile card */}
        <div className="mt-5 bg-white rounded-[22px] p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0CC5B9] text-white flex items-center justify-center text-2xl font-bold">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-[#25303D] font-extrabold text-lg">{member.name}</div>
            <div className="text-[#7F8A94] text-sm">{member.phone || 'No phone'}</div>
          </div>
        </div>

        {/* Month stats */}
        <div className="mt-4 bg-white rounded-[22px] p-5 shadow-sm border border-slate-100">
          <div className="text-[#3D4B5A] text-[13px] font-semibold mb-1">{currentMonth}</div>
          <div className="flex items-end gap-6 mt-3">
            <div>
              <div className="text-3xl font-extrabold text-[#0CC5B9]">{turnsThisMonth.length}</div>
              <div className="text-[#7F8A94] text-xs mt-1">turns completed</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#25303D]">{memberChores.length}</div>
              <div className="text-[#7F8A94] text-xs mt-1">active chores</div>
            </div>
          </div>
          <div className="text-[#A0A8B0] text-xs mt-3">History auto-clears after 1 month</div>
        </div>

        {/* Chore breakdown */}
        {Object.keys(choreBreakdown).length > 0 && (
          <div className="mt-4 bg-white rounded-[22px] p-5 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Turns per chore</div>
            <div className="space-y-2">
              {Object.entries(choreBreakdown).map(([title, count]) => (
                <div key={title} className="flex items-center justify-between rounded-xl bg-[#F4F7F6] px-4 py-3">
                  <span className="text-[#25303D] font-semibold text-sm">{title}</span>
                  <span className="text-[#0CC5B9] font-bold text-sm">{count} {count === 1 ? 'turn' : 'turns'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned chores */}
        <div className="mt-4 bg-white rounded-[22px] p-5 shadow-sm border border-slate-100">
          <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Assigned chores</div>
          {memberChores.length === 0 ? (
            <div className="text-[#A0A8B0] text-sm text-center py-4">No chores assigned</div>
          ) : (
            <div className="space-y-2">
              {memberChores.map(chore => (
                <div key={chore.id} className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#25303D] font-semibold text-sm">{chore.title}</span>
                    {chore.rotation?.length > 1 && <span className="text-[#0CC5B9] text-xs font-bold">↻ cycle</span>}
                  </div>
                  {chore.due_day != null && (
                    <div className="text-[#A0A8B0] text-xs mt-1">{DAY_NAMES[chore.due_day]}</div>
                  )}
                  {chore.rotation?.length > 1 && (
                    <div className="text-[#7F8A94] text-xs mt-1">
                      Shared with: {chore.rotation
                        .filter(id => id !== memberId)
                        .map(id => members.find(m => m.id === id)?.name ?? '?')
                        .join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent history */}
        {turnsThisMonth.length > 0 && (
          <div className="mt-4 bg-white rounded-[22px] p-5 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Recent history</div>
            <div className="space-y-2">
              {turnsThisMonth.slice(0, 10).map(h => (
                <div key={h.id} className="flex items-center justify-between rounded-xl bg-[#F4F7F6] px-4 py-2.5">
                  <span className="text-[#25303D] text-sm">{h.choreTitle}</span>
                  <span className="text-[#A0A8B0] text-xs">
                    {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
