import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import PretextText from '../lib/PretextText'

export default function ActivityScreen() {
  const { chores, pendingChores, doneChores, loading } = useApp()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const totalChores = chores.length
  const doneCount = doneChores.length

  const assignedChores = chores.slice(0, 5)

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Dashboard</div>
          <div className="text-[#22313F] text-[24px] font-extrabold mt-1">
            Hi, {profile?.name?.split(' ')[0] ?? 'there'}
          </div>
        </div>
        <div className="w-11 h-11 rounded-full bg-[#0CC5B9] text-white flex items-center justify-center font-bold text-lg">
          {profile?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
      </div>

      {/* Progress card */}
      <div className="mt-5 rounded-[22px] bg-[#0CC5B9] text-white p-5 shadow-lg">
        <div className="text-sm opacity-90">Today&apos;s progress</div>
        <div className="text-3xl font-extrabold mt-2">{doneCount} / {totalChores || 0}</div>
        <div className="mt-4 w-full h-2 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: totalChores > 0 ? `${(doneCount / totalChores) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Assigned chores */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-[#22313F] font-bold text-[16px]">Assigned chores</div>
        <button onClick={() => navigate('/dashboard/tasks')} className="text-[#0CC5B9] text-sm font-semibold">
          View all
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#0CC5B9]"
                  style={{ animation: `dot-bounce 1.2s ${i*0.2}s infinite ease-in-out` }}/>
              ))}
            </div>
          </div>
        ) : assignedChores.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <div className="text-3xl">✨</div>
            <div className="text-[#7F8A94] text-sm">No chores yet. Add your first!</div>
          </div>
        ) : (
          assignedChores.map(chore => (
            <div key={chore.id} className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <PretextText text={chore.title} font="15px DM Sans" lineHeight={1.4}
                    className="text-[#25303D] font-bold text-[15px]" />
                  <div className="text-[#7F8A94] text-sm mt-1">
                    Assigned to {chore.assignee?.name ?? 'anyone'}
                  </div>
                </div>
                <div className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  chore.status === 'done'
                    ? 'bg-[#E9FAF8] text-[#0AA99E]'
                    : chore.status === 'pending'
                    ? 'bg-[#FFF8E1] text-[#F59E0B]'
                    : 'bg-[#E9FAF8] text-[#0AA99E]'
                }`}>
                  {chore.status === 'done' ? 'Done' : chore.status === 'pending' ? 'Pending' : 'Today'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
