import PretextText from '../lib/PretextText'
import { useApp } from '../context/AppContext'

const STATUS_STYLES = {
  pending:    { bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  label: 'Pending' },
  done:       { bg: 'bg-teal-light', text: 'text-teal-dark',   dot: 'bg-teal',        label: 'Done' },
  skipped:    { bg: 'bg-gray-100',   text: 'text-muted',       dot: 'bg-gray-400',    label: 'Skipped' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-600',   dot: 'bg-blue-400',    label: 'In progress' },
}

export default function ChoreCard({ chore }) {
  const { updateChoreStatus, DAY_NAMES } = useApp()

  const s = STATUS_STYLES[chore.status] ?? STATUS_STYLES.pending
  const assigneeName = chore.assignee?.name ?? 'Unassigned'
  const dueLabel = chore.due_day != null ? DAY_NAMES[chore.due_day] ?? '' : ''

  function toggleDone() {
    updateChoreStatus(chore.id, chore.status === 'done' ? 'pending' : 'done')
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-card px-4 py-3.5 shadow-sm mb-2.5">
      {/* Checkbox */}
      <button
        onClick={toggleDone}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          chore.status === 'done'
            ? 'bg-teal border-teal'
            : 'border-gray-300 hover:border-teal'
        }`}
        aria-label="Toggle done"
      >
        {chore.status === 'done' && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <PretextText
          text={chore.title}
          font="15px DM Sans"
          lineHeight={1.4}
          className={`font-semibold text-[15px] leading-snug ${chore.status === 'done' ? 'line-through text-muted' : 'text-navy'}`}
        />
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[12px] text-muted">{assigneeName}</span>
          {dueLabel && (
            <>
              <span className="text-muted text-[10px]">·</span>
              <span className="text-[12px] text-muted">{dueLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} flex-shrink-0`}>
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
        <span className={`text-[11px] font-semibold ${s.text}`}>{s.label}</span>
      </div>
    </div>
  )
}
