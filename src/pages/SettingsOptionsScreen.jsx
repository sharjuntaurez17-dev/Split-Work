import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const NOTIFICATION_OPTIONS = ['Task reminders', 'Weekly summary', 'House activity']

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem('splitwork_notif_prefs') || '{}') }
  catch { return {} }
}

export default function SettingsOptionsScreen() {
  const navigate = useNavigate()
  const { option } = useParams()
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [prefs, setPrefs] = useState(loadPrefs)

  useEffect(() => {
    localStorage.setItem('splitwork_notif_prefs', JSON.stringify(prefs))
  }, [prefs])

  if (option !== 'notifications') {
    return (
      <div className="screen bg-[#F7FAF9] items-center justify-center gap-3">
        <div className="text-3xl">⚙️</div>
        <div className="text-[#7F8A94] text-sm">Setting not found</div>
        <button onClick={() => navigate('/settings')} className="text-[#0CC5B9] font-semibold text-sm mt-2">Back</button>
      </div>
    )
  }

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Settings</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">Options</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Edit</button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          {/* Update profile row */}
          <button onClick={() => navigate('/settings')}
            className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100 flex items-center justify-between w-full text-left">
            <div>
              <div className="text-[#25303D] font-bold text-[15px]">Update profile</div>
              <div className="text-[#7F8A94] text-sm mt-1">Change your name and phone number</div>
            </div>
            <div className="text-[#0CC5B9] font-bold">›</div>
          </button>

          {/* Notifications with toggle + items */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#25303D] font-bold text-[15px]">Notifications</div>
                <div className="text-[#7F8A94] text-sm mt-1">Manage app alerts and reminders</div>
              </div>
              <button onClick={() => setNotifEnabled(!notifEnabled)}
                className={`w-11 h-6 rounded-full relative transition-colors ${notifEnabled ? 'bg-[#0CC5B9]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {notifEnabled && (
              <div className="mt-4 space-y-2">
                {NOTIFICATION_OPTIONS.map(item => (
                  <div key={item} className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3 text-[#25303D] text-sm">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 pb-5">
          <button className="w-full bg-[#0CC5B9] text-white rounded-[18px] py-3.5 font-bold text-[16px] shadow-lg">
            Save settings
          </button>
        </div>
      </div>
    </div>
  )
}
