import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EnterNameScreen() {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [step, setStep]       = useState('name') // 'name' | 'house'
  const [houseName, setHouseName]   = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { updateProfile, createHouse, joinHouse } = useAuth()
  const navigate = useNavigate()

  async function handleNameNext(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    setError('')
    await updateProfile({ name: name.trim(), phone: phone.trim() || null })
    setStep('house')
  }

  async function handleCreateHouse(e) {
    e.preventDefault()
    if (!houseName.trim()) { setError('Please enter a house name.'); return }
    setLoading(true)
    setError('')
    try {
      await createHouse(houseName.trim())
      navigate('/dashboard/tasks')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinHouse(e) {
    e.preventDefault()
    if (!inviteCode.trim()) { setError('Please enter an invite code.'); return }
    setLoading(true)
    setError('')
    try {
      await joinHouse(inviteCode.trim())
      navigate('/dashboard/tasks')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen bg-app-bg">
      <div className="screen-inner px-6">

        {step === 'name' ? (
          <form onSubmit={handleNameNext} className="flex flex-col flex-1">
            <div className="pt-16 pb-8">
              <div className="text-[28px] font-extrabold text-navy leading-tight">
                What's your name?
              </div>
              <div className="text-muted text-[14px] mt-1.5">
                Let your housemates know who you are
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="block text-slate text-[12px] font-semibold tracking-wide uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharjun Ahmed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-slate text-[12px] font-semibold tracking-wide uppercase mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 602 555 0148"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input-field"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-2.5">{error}</div>
              )}
            </div>

            <div className="pb-10 pt-6">
              <button type="submit" className="btn-teal">Next →</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="pt-16 pb-8">
              <div className="text-[28px] font-extrabold text-navy leading-tight">Set up your house</div>
              <div className="text-muted text-[14px] mt-1.5">Create a new house or join an existing one</div>
            </div>

            <div className="flex flex-col gap-5 flex-1">
              {/* Create house */}
              <div className="card">
                <div className="text-navy font-bold text-[15px] mb-3">Create a new house</div>
                <form onSubmit={handleCreateHouse} className="flex flex-col gap-3">
                  <input type="text" placeholder="e.g. The Green House" value={houseName}
                    onChange={e => setHouseName(e.target.value)}
                    className="input-field"
                  />
                  <button type="submit" disabled={loading} className="btn-teal disabled:opacity-50">
                    {loading ? 'Creating…' : 'Create House'}
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200"/>
                <span className="text-muted text-[13px]">or</span>
                <div className="flex-1 h-px bg-gray-200"/>
              </div>

              {/* Join house */}
              <div className="card">
                <div className="text-navy font-bold text-[15px] mb-3">Join an existing house</div>
                <form onSubmit={handleJoinHouse} className="flex flex-col gap-3">
                  <input type="text" placeholder="Enter invite code" value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    className="input-field font-mono tracking-widest"
                  />
                  <button type="submit" disabled={loading} className="btn-teal disabled:opacity-50">
                    {loading ? 'Joining…' : 'Join House'}
                  </button>
                </form>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-2.5">{error}</div>
              )}
            </div>

            <div className="pb-8"/>
          </div>
        )}
      </div>
    </div>
  )
}
