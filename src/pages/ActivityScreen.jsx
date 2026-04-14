import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import PretextText from '../lib/PretextText'

export default function ActivityScreen() {
  const { chores, members, turnHistory, loading } = useApp()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const todayNum = new Date().getDay()
  const todayStr = new Date().toDateString()

  // Chores due today
  const todayChores = chores.filter(c =>
    c.due_day === todayNum || (c.recurrence_days && c.recurrence_days.includes(todayNum))
  )

  // Count unique chores completed today
  const todayTurns = turnHistory.filter(h =>
    new Date(h.date).toDateString() === todayStr
  )
  const uniqueChoresDoneToday = new Set(todayTurns.map(h => h.choreId))
  const doneTodayCount = Math.min(uniqueChoresDoneToday.size, todayChores.length)

  const totalToday = todayChores.length
  const progress = totalToday > 0 ? Math.min((doneTodayCount / totalToday) * 100, 100) : 0

  const assignedChores = chores.slice(0, 5)
  const pendingTodayCount = todayChores.filter(c => !turnHistory.some(h => h.choreId === c.id && new Date(h.date).toDateString() === todayStr)).length

  // Build notifications list
  const notifications = chores.map(chore => {
    const assigneeName = chore.assignee?.name ?? members.find(m => m.id === chore.assignee_id)?.name ?? 'Anyone'
    const isDueToday = chore.due_day === todayNum || (chore.recurrence_days && chore.recurrence_days.includes(todayNum))
    const wasDoneToday = turnHistory.some(h => h.choreId === chore.id && new Date(h.date).toDateString() === todayStr)

    return {
      id: chore.id,
      title: chore.title,
      assigneeName,
      isDueToday,
      wasDoneToday,
      hasRotation: chore.rotation?.length > 1,
      message: wasDoneToday
        ? `${chore.title} - completed`
        : isDueToday
        ? `${assigneeName}, it's your turn for ${chore.title}!`
        : `${chore.title} - ${assigneeName}'s turn next`,
    }
  })

  function NotifRow({ n }) {
    return (
      <div className={`rounded-xl px-4 py-3 ${
        n.wasDoneToday ? 'bg-[#E9FAF8] border border-[#BDEFEA]'
          : n.isDueToday ? 'bg-[#FFF8E1] border border-[#FFE082]'
          : 'bg-[#F4F7F6] border border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          {n.wasDoneToday ? (
            <span className="text-[#0AA99E]">✓</span>
          ) : n.isDueToday ? (
            <span className="text-[#F59E0B]">!</span>
          ) : (
            <span className="text-[#A0A8B0]">-</span>
          )}
          <div className="flex-1">
            <div className="text-[#25303D] text-sm font-semibold">{n.message}</div>
            {n.hasRotation && !n.wasDoneToday && (
              <div className="text-[#7F8A94] text-xs mt-0.5">Rotation cycle active</div>
            )}
          </div>
        </div>
      </div>
    )
  }

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
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button onClick={() => navigate('/notifications')} className="relative">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#25303D]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {pendingTodayCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {pendingTodayCount}
              </div>
            )}
          </button>
          <div className="w-11 h-11 rounded-full bg-[#0CC5B9] text-white flex items-center justify-center font-bold text-lg">
            {profile?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>

      {/* Progress card */}
      <div className="mt-5 rounded-[22px] bg-[#0CC5B9] text-white p-5 shadow-lg">
        <div className="text-sm opacity-90">Today&apos;s progress</div>
        <div className="text-3xl font-extrabold mt-2">{doneTodayCount} / {todayChores.length || 0}</div>
        <div className="text-sm opacity-75 mt-1">{doneTodayCount} chore{doneTodayCount !== 1 ? 's' : ''} done out of {todayChores.length} today</div>
        <div className="mt-3 w-full h-2 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Last 3 notifications always visible */}
      {notifications.length > 0 && (
        <div className="mt-5">
          <div className="text-[#22313F] font-bold text-[16px] mb-3">Notifications</div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(n => <NotifRow key={n.id} n={n} />)}
          </div>
          <button onClick={() => navigate('/notifications')}
            className="w-full mt-3 text-[#0CC5B9] text-sm font-semibold text-center py-2">
            See all notifications
          </button>
        </div>
      )}

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
          assignedChores.map(chore => {
            const isDueToday = chore.due_day === todayNum ||
              (chore.recurrence_days && chore.recurrence_days.includes(todayNum))
            const wasDoneToday = turnHistory.some(h =>
              h.choreId === chore.id && new Date(h.date).toDateString() === todayStr
            )

            return (
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
                    wasDoneToday
                      ? 'bg-[#E9FAF8] text-[#0AA99E]'
                      : isDueToday
                      ? 'bg-[#FFF8E1] text-[#F59E0B]'
                      : 'bg-[#F4F7F6] text-[#7F8A94]'
                  }`}>
                    {wasDoneToday ? 'Done' : isDueToday ? 'Today' : 'Upcoming'}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
