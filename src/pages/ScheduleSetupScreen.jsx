import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DAYS = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
]

export default function ScheduleSetupScreen() {
  const [selectedDays, setSelectedDays] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const navigate  = useNavigate()
  const location  = useLocation()
  const { addChore } = useApp()

  const { title, assigneeId } = location.state ?? {}

  function toggleDay(val) {
    setSelectedDays(prev =>
      prev.includes(val) ? prev.filter(d => d !== val) : [...prev, val]
    )
  }

  async function handleSave() {
    if (!title) { navigate('/add-chore'); return }
    setLoading(true)
    setError('')
    try {
      await addChore({
        title,
        assigneeId: assigneeId ?? null,
        dueDays: selectedDays[0] ?? null,
        recurrenceDays: selectedDays.length > 0 ? selectedDays : null,
      })
      navigate('/dashboard/tasks')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="screen bg-app-bg">
      <div className="screen-inner">
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path d="M8 1L1 8l7 7" stroke="#25303D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1">
            <span className="text-[18px] font-extrabold text-navy">Set Schedule</span>
            {title && <div className="text-[13px] text-muted mt-0.5 truncate">"{title}"</div>}
          </div>
        </div>

        <div className="flex flex-col flex-1 px-6">
          <div className="text-[14px] text-slate mb-4">
            Which days should this chore repeat? (optional)
          </div>

          {/* Day pills */}
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {DAYS.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`py-3 rounded-xl text-[14px] font-bold transition-all ${
                  selectedDays.includes(day.value)
                    ? 'bg-teal text-white shadow-sm'
                    : 'bg-white text-navy border border-gray-100'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {selectedDays.length > 0 && (
            <div className="card mb-5">
              <div className="text-[13px] text-muted mb-1">Repeats on</div>
              <div className="text-[15px] font-semibold text-navy">
                {DAYS.filter(d => selectedDays.includes(d.value)).map(d => d.label).join(', ')}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <div className="flex-1"/>
          <div className="pb-10 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-teal disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save Chore'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-3 text-[14px] font-semibold text-muted"
            >
              Skip — save without schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
