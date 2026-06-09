import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function AddChoreScreen() {
  const [title, setTitle]         = useState('')
  const [area, setArea]           = useState('')
  const [selectedPeople, setSelectedPeople] = useState([])
  const [twoTogether, setTwoTogether]       = useState(false)
  const { members } = useApp()
  const navigate = useNavigate()

  function togglePerson(userId) {
    setSelectedPeople(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  function handleSchedule() {
    if (!title.trim()) return
    navigate('/add-chore/schedule', {
      state: { title: title.trim(), selectedPeople, twoTogether, area }
    })
  }

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Create Chore</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">New task</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Back</button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          {/* Chore name */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Chore name</div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Clean bathroom"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none placeholder:text-[#848F98]"
              autoFocus
            />
          </div>

          {/* Select people */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Select people</div>
            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <button key={m.id} type="button" onClick={() => togglePerson(m.id)}
                  className={`px-3 py-2 rounded-full text-sm font-semibold border ${
                    selectedPeople.includes(m.id)
                      ? 'bg-[#0CC5B9] text-white border-[#0CC5B9]'
                      : 'bg-[#F4F7F6] text-[#66727D] border-slate-200'
                  }`}>
                  {m.name ?? 'Member'}
                </button>
              ))}
              {members.length === 0 && (
                <div className="text-[#848F98] text-sm">No members yet</div>
              )}
            </div>

            {/* Two people toggle */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F4F7F6] px-3 py-3">
              <div>
                <div className="text-[#25303D] text-sm font-semibold">Two people together</div>
                <div className="text-[#7F8A94] text-xs mt-1">Allow 2 members to do one chore on the same day</div>
              </div>
              <button onClick={() => setTwoTogether(!twoTogether)}
                className={`w-11 h-6 rounded-full relative transition-colors ${twoTogether ? 'bg-[#0CC5B9]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${twoTogether ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Schedule */}
          <button onClick={handleSchedule}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100 w-full text-left">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Schedule</div>
            <div className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#66727D] text-[15px]">Open weekly schedule setup</div>
          </button>

          {/* House area */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">House area</div>
            <input type="text" value={area} onChange={e => setArea(e.target.value)}
              placeholder="Bathroom"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none placeholder:text-[#848F98]"
            />
          </div>
        </div>

        <div className="pt-4 pb-5">
          <button onClick={handleSchedule} disabled={!title.trim()}
            className="w-full bg-[#0CC5B9] text-white rounded-[18px] py-3.5 font-bold text-[16px] shadow-lg disabled:opacity-40">
            Create chore
          </button>
        </div>
      </div>
    </div>
  )
}
