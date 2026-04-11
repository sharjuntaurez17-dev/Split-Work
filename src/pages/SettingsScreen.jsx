import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()
  const [name, setName]     = useState(profile?.name ?? '')
  const [phone, setPhone]   = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError(''); setSaved(false)
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() || null })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="screen bg-[#F7FAF9]">
      <div className="screen-inner p-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-[#7E8A93] text-xs font-semibold uppercase tracking-[0.18em]">Settings</div>
            <div className="text-[#22313F] text-[24px] font-extrabold mt-1">Update profile</div>
          </div>
          <button onClick={() => navigate(-1)} className="text-[#0CC5B9] font-bold text-sm">Back</button>
        </div>

        <div className="mt-5 space-y-4 flex-1">
          {/* Profile fields */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Name</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#66727D] text-[15px] w-full outline-none mb-4"
            />
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-2">Phone number</div>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+1 602 555 0148"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#66727D] text-[15px] w-full outline-none placeholder:text-[#848F98]"
            />
          </div>

          {/* Settings options */}
          <div className="bg-white rounded-[18px] p-4 shadow-sm border border-slate-100">
            <div className="text-[#3D4B5A] text-[13px] font-semibold mb-3">Settings options</div>
            <div className="space-y-2 text-sm">
              <button onClick={() => {}} className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3 text-[#25303D] w-full text-left">
                Update profile
              </button>
              <button onClick={() => navigate('/settings/notifications')}
                className="rounded-xl bg-[#F4F7F6] border border-slate-200 px-4 py-3 text-[#25303D] w-full text-left">
                Notifications
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-[13px] text-center">{error}</div>}
          {saved && <div className="text-[#0AA99E] text-[13px] text-center">Settings saved!</div>}
        </div>

        <div className="pt-4 pb-5">
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-[#0CC5B9] text-white rounded-[18px] py-3.5 font-bold text-[16px] shadow-lg disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
