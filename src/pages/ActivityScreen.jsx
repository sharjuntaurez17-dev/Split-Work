import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function ActivityScreen() {
  const { chores, DAY_NAMES } = useApp()
  const { profile } = useAuth()

  const recentDone = chores.filter(c => c.status === 'done').slice(0, 10)

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="text-[26px] font-extrabold text-navy mb-1">Activity</div>
      <div className="text-muted text-[13px] mb-5">Recent completed chores</div>

      {recentDone.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="text-4xl">📋</div>
          <div className="text-[16px] font-semibold text-slate">No activity yet</div>
          <p className="text-muted text-[13px] text-center">Complete chores to see them here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recentDone.map(chore => (
            <div key={chore.id} className="bg-white rounded-card px-4 py-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center flex-shrink-0">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                  <path d="M1 5.5L5 9.5L13 1.5" stroke="#0CC5B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-navy truncate">{chore.title}</div>
                <div className="text-[12px] text-muted">
                  {chore.assignee?.name ?? 'Unknown'}{chore.due_day != null ? ` · ${DAY_NAMES[chore.due_day]}` : ''}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">Done</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
