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
  const { addChore, members } = useApp()

  const { title, selectedPeople = [], twoTogether } = location.state ?? {}

  const selectedMembers = members.filter(m => selectedPeople.includes(m.id))

  function toggleDay(val) {
    setSelectedDays(prev =>
      prev.includes(val) ? prev.filter(d => d !== val) : [...prev, val]
    )
  }

  const selectedLabels = DAYS.filter(d => selectedDays.includes(d.value)).map(d => d.label)

  // Build rotation preview: cycle through selected people across days
  function getRotation() {
    if (selectedMembers.length === 0) return selectedLabels.map(day => ({ day, name: 'Anyone' }))
    return selectedLabels.map((day, i) => ({
      day,
      name: twoTogether && selectedMembers.length >= 2
        ? `${selectedMembers[i % selectedMembers.length].name} & ${selectedMembers[(i + 1) % selectedMembers.length].name}`
        : selectedMembers[i % selectedMembers.length].name
    }))
  }

  async function handleSave() {
    if (!title) { navigate('/add-chore'); return }
    setLoading(true); setError('')
    try {
      const sortedDays = [...selectedDays].sort((a, b) => a - b)
      const rotation = selectedMembers.map(m => m.id)
      await addChore({
        title,
        assigneeId: rotation[0] ?? null,
        dueDays: sortedDays[0] ?? null,
        recurrenceDays: sortedDays.length > 0 ? sortedDays : null,
        rotation,
      })
      navigate('/dashboard/tasks')
    } catch (err) {
      setError(err.message); setLoading(false)
    }
  }

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Schedule</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">Pick days of week</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Done</button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          {/* Day grid */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Select days</div>
            <div className="grid grid-cols-4 gap-2 text-center text-sm font-semibold">
              {DAYS.map(day => (
                <button key={day.value} type="button" onClick={() => toggleDay(day.value)}
                  className={`rounded-xl py-3 transition-all ${
                    selectedDays.includes(day.value)
                      ? 'bg-[#0CC5B9] text-white'
                      : 'bg-[#F4F7F6] text-[#66727D] border border-slate-200'
                  }`}>
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Repeat rule */}
          {selectedDays.length > 0 && (
            <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
              <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Repeat rule</div>
              <div className="rounded-xl bg-[#E9FAF8] px-4 py-4 border border-[#BDEFEA]">
                <div className="text-[#0AA99E] font-bold text-sm">
                  {selectedMembers.length > 1 ? 'Rotates between members' : 'Repeats every week'}
                </div>
                <div className="text-[#66727D] text-sm mt-1">Selected days: {selectedLabels.join(', ')}</div>
              </div>
            </div>
          )}

          {/* Preview with rotation */}
          {selectedDays.length > 0 && (
            <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
              <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Preview</div>
              <div className="space-y-2 text-sm">
                {getRotation().map(({ day, name }) => (
                  <div key={day} className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3 flex items-center justify-between">
                    <span className="text-[#25303D]">{day}</span>
                    <span className="text-[#0CC5B9] font-semibold">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-[13px] text-center">{error}</div>}
        </div>

        <div className="pt-4 pb-5">
          <button onClick={handleSave} disabled={loading}
            className="w-full bg-[#0CC5B9] text-white rounded-[18px] py-3.5 font-bold text-[16px] shadow-lg disabled:opacity-50">
            {loading ? 'Saving…' : 'Save weekly schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}
