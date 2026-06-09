import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const { chores, members, turnHistory } = useApp()

  // Group turn history by date (last 1 month, already auto-cleaned in AppContext)
  const grouped = {}
  turnHistory.forEach(h => {
    const dateKey = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(h)
  })

  // Also add today's pending chores as notifications
  const todayNum = new Date().getDay()
  const todayStr = new Date().toDateString()
  const todayKey = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const pendingToday = chores.filter(c => {
    const isDueToday = c.due_day === todayNum || (c.recurrence_days && c.recurrence_days.includes(todayNum))
    const wasDone = turnHistory.some(h => h.choreId === c.id && new Date(h.date).toDateString() === todayStr)
    return isDueToday && !wasDone
  })

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Notifications</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">All updates</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Back</button>
        </div>

        <div className="text-[#A0A8B0] text-xs mt-2">Auto-erased after 1 month</div>

        {/* Pending today */}
        {pendingToday.length > 0 && (
          <div className="mt-5">
            <div className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-2">Pending today</div>
            <div className="space-y-2">
              {pendingToday.map(chore => {
                const assigneeName = chore.assignee?.name ?? members.find(m => m.id === chore.assignee_id)?.name ?? 'Anyone'
                return (
                  <div key={chore.id} className="rounded-xl px-4 py-3 bg-[#FFF8E1] border border-[#FFE082]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F59E0B] font-bold">!</span>
                      <div className="flex-1">
                        <div className="text-[#25303D] text-sm font-semibold">
                          {assigneeName}, it&apos;s your turn for {chore.title}!
                        </div>
                        {chore.rotation?.length > 1 && (
                          <div className="text-[#7F8A94] text-xs mt-0.5">Rotation cycle active</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* History grouped by date */}
        {Object.keys(grouped).length === 0 && pendingToday.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-2">
            <div className="text-3xl">🔔</div>
            <div className="text-[#7F8A94] text-sm">No notifications yet</div>
          </div>
        ) : (
          Object.entries(grouped).map(([dateKey, entries]) => (
            <div key={dateKey} className="mt-5">
              <div className="text-[#7E8A93] text-xs font-bold uppercase tracking-wider mb-2">
                {dateKey === todayKey ? 'Today' : dateKey}
              </div>
              <div className="space-y-2">
                {entries.map(h => (
                  <div key={h.id} className="rounded-xl px-4 py-3 bg-[#E9FAF8] border border-[#BDEFEA]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#0AA99E]">✓</span>
                      <div className="flex-1">
                        <div className="text-[#25303D] text-sm font-semibold">
                          {h.memberName} completed {h.choreTitle}
                        </div>
                        <div className="text-[#7F8A94] text-xs mt-0.5">
                          {new Date(h.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
