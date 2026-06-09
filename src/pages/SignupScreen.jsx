import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProcessedLogo from '../components/ProcessedLogo'
import { useAuth } from '../context/AuthContext'

export default function SignupScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { signup } = useAuth()
  const navigate   = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await signup(email, password)
      navigate('/onboarding/name')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen bg-dark-bg overflow-y-auto">
      <div className="screen-inner px-7 pb-10">

        <div className="flex flex-col items-center gap-2 pt-14 pb-8">
          <ProcessedLogo size={68} />
          <div className="text-white font-serif text-[22px] font-extrabold tracking-tight">Splitwork</div>
          <div className="text-mint text-[11px] font-medium tracking-[1px] uppercase">Fair chores. Happy homes.</div>
        </div>

        <div className="w-full bg-white/5 rounded-[24px] border border-white/8 px-6 py-7 backdrop-blur-sm">
          <div className="text-white text-xl font-bold mb-1">Create account</div>
          <div className="text-white/45 text-[13px] mb-6">Join your household today</div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-white/55 text-[11px] font-semibold tracking-[0.6px] uppercase mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>
            <div>
              <label className="block text-white/55 text-[11px] font-semibold tracking-[0.6px] uppercase mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>
            <div>
              <label className="block text-white/55 text-[11px] font-semibold tracking-[0.6px] uppercase mb-1.5">Confirm Password</label>
              <input type="password" placeholder="••••••••" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="input-field text-white placeholder:text-white/30"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-teal mt-1.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0CC5B9, #05A3C0)' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-7 text-center text-white/40 text-[13px]">
          Already have an account?{' '}
          <Link to="/login" className="text-teal font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
