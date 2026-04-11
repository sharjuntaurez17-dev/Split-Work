import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PretextText from '../lib/PretextText'

const FILTERS = ['All', 'Today', 'Done']

export default function TasksScreen() {
  const [filter, setFilter] = useState('All')
  const { chores, pendingChores, doneChores, members, updateChoreStatus, loading, DAY_NAMES } = useApp()
  const navigate = useNavigate()

  const filteredChores = filter === 'All'
    ? chores
    : filter === 'Today'
    ? pendingChores
    : doneChores

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Tasks</div>
          <div className="text-[#22313F] text-[24px] font-extrabold mt-1">Your chores</div>
        </div>
        <button onClick={() => navigate('/add-chore')}
          className="w-10 h-10 rounded-2xl bg-[#E9FAF8] text-[#0CC5B9] flex items-center justify-center font-bold text-xl">
          +
        </button>
      </div>

      {/* Filter chips */}
      <div className="mt-5 flex gap-2 text-xs font-semibold">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-full ${
              filter === f
                ? 'bg-[#0CC5B9] text-white'
                : 'bg-white text-[#7F8A94] border border-slate-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#0CC5B9]"
                  style={{ animation: `dot-bounce 1.2s ${i*0.2}s infinite ease-in-out` }}/>
              ))}
            </div>
          </div>
        ) : filteredChores.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <div className="text-3xl">✨</div>
            <div className="text-[#7F8A94] text-sm">No chores here</div>
          </div>
        ) : (
          filteredChores.map(chore => (
            <div key={chore.id} className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <PretextText text={chore.title} font="15px DM Sans" lineHeight={1.4}
                    className={`font-bold text-[15px] ${chore.status === 'done' ? 'text-[#7F8A94] line-through' : 'text-[#25303D]'}`} />
                  <div className="text-[#7F8A94] text-sm mt-1">
                    {chore.assignee?.name ?? members.find(m => m.id === chore.assignee_id)?.name ?? 'Anyone'}
                  </div>
                  <div className="text-[#A0A8B0] text-xs mt-2">
                    {chore.due_day != null ? DAY_NAMES[chore.due_day] : ''}
                  </div>
                </div>
                <button onClick={() => updateChoreStatus(chore.id, chore.status === 'done' ? 'pending' : 'done')}
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                    chore.status === 'done' ? 'bg-[#0CC5B9] border-[#0CC5B9]' : 'border-[#0CC5B9]'
                  }`}>
                  {chore.status === 'done' && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
