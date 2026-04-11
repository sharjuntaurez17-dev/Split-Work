import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import ChoreCard from '../components/ChoreCard'
import PretextText from '../lib/PretextText'

const FILTERS = ['All', 'Pending', 'Done']

export default function TasksScreen() {
  const [filter, setFilter] = useState('All')
  const { chores, pendingChores, doneChores, loading } = useApp()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const filteredChores = filter === 'All'
    ? chores
    : filter === 'Pending'
    ? pendingChores
    : doneChores

  const totalChores  = chores.length
  const doneCount    = doneChores.length

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <PretextText
          text={`Hi ${profile?.name?.split(' ')[0] ?? 'there'} 👋`}
          font="26px DM Sans"
          lineHeight={1.3}
          className="text-[26px] font-extrabold text-navy"
        />
        <button
          onClick={() => navigate('/add-chore')}
          className="w-10 h-10 rounded-full bg-teal flex items-center justify-center shadow-card"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="text-muted text-[13px] mb-5">Here's what needs to get done</div>

      {/* Progress */}
      {totalChores > 0 && (
        <div className="card mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-slate">Chores completed</span>
            <span className="text-teal font-bold text-[14px]">{doneCount} / {totalChores}</span>
          </div>
          <div className="h-2 bg-field-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all duration-500"
              style={{ width: totalChores > 0 ? `${(doneCount / totalChores) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
              filter === f
                ? 'bg-teal text-white shadow-sm'
                : 'bg-white text-muted border border-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chore list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="flex gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-teal"
                style={{ animation: `dot-bounce 1.2s ${i*0.2}s infinite ease-in-out` }}/>
            ))}
          </div>
        </div>
      ) : filteredChores.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="text-4xl">✨</div>
          <PretextText
            text={filter === 'Done' ? 'No completed chores yet' : 'No chores here!'}
            font="16px DM Sans"
            lineHeight={1.5}
            className="text-[16px] font-semibold text-slate text-center"
          />
          <p className="text-muted text-[13px] text-center">
            {filter === 'All' ? 'Tap + to add your first chore' : ''}
          </p>
        </div>
      ) : (
        <div>
          {filteredChores.map(chore => (
            <ChoreCard key={chore.id} chore={chore} />
          ))}
        </div>
      )}
    </div>
  )
}
