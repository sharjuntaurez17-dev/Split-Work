import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function AddChoreScreen() {
  const [title, setTitle]         = useState('')
  const [assigneeId, setAssigneeId] = useState(null)
  const { members } = useApp()
  const navigate = useNavigate()

  function handleNext(e) {
    e.preventDefault()
    if (!title.trim()) return
    navigate('/add-chore/schedule', { state: { title: title.trim(), assigneeId } })
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
          <span className="text-[18px] font-extrabold text-navy flex-1">Add Chore</span>
        </div>

        <form onSubmit={handleNext} className="flex flex-col flex-1 px-6">
          {/* Title */}
          <div className="mb-5">
            <label className="block text-slate text-[12px] font-semibold tracking-wide uppercase mb-2">Chore Name</label>
            <input
              type="text"
              placeholder="e.g. Clean bathroom"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input-field text-[17px]"
              autoFocus
            />
          </div>

          {/* Assignee */}
          {members.length > 0 && (
            <div className="mb-5">
              <label className="block text-slate text-[12px] font-semibold tracking-wide uppercase mb-3">Assign To</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAssigneeId(null)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                    assigneeId === null ? 'bg-teal text-white' : 'bg-white text-slate border border-gray-200'
                  }`}
                >
                  Anyone
                </button>
                {members.map(m => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setAssigneeId(m.user_id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                      assigneeId === m.user_id ? 'bg-teal text-white' : 'bg-white text-slate border border-gray-200'
                    }`}
                  >
                    {m.name ?? m.user_id?.slice(0, 6)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1"/>
          <div className="pb-10">
            <button
              type="submit"
              disabled={!title.trim()}
              className="btn-teal disabled:opacity-40"
            >
              Next — Set Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
