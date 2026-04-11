import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EnterNameScreen() {
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const { setLocalProfile } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    setLocalProfile({ name: name.trim(), phone: phone.trim() || null })
    navigate('/dashboard')
  }

  return (
    <div className="screen bg-[#F4F7F6]">
      <div className="screen-inner p-6">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="pt-6">
            <div className="text-[#0CC5B9] text-sm font-bold tracking-[0.16em] uppercase mb-3">Splitwork</div>
            <div className="text-[#25303D] text-[28px] font-extrabold leading-tight">Let&apos;s get started</div>
            <p className="text-[#7F8A94] text-sm mt-2">Enter your name to continue.</p>
          </div>

          <div className="mt-7 bg-white rounded-[20px] p-5 shadow-lg">
            <label className="block text-[#3D4B5A] text-[13px] font-semibold mb-2">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Sharjun"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none focus:ring-2 focus:ring-[#0CC5B9]/30 mb-4 placeholder:text-[#848F98]"
              autoFocus
            />
            <label className="block text-[#3D4B5A] text-[13px] font-semibold mb-2">Phone number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+1 602 555 0148"
              className="bg-[#E8EEED] rounded-xl px-4 py-3 text-[#25303D] text-[15px] w-full outline-none focus:ring-2 focus:ring-[#0CC5B9]/30 mb-4 placeholder:text-[#848F98]"
            />
            {error && <div className="text-red-500 text-[13px] mb-3">{error}</div>}
            <button type="submit" className="w-full mt-2 bg-[#0CC5B9] text-white rounded-[14px] py-3.5 font-bold text-[16px] shadow-lg">
              Continue
            </button>
          </div>

          <div className="flex-1" />
          <div className="flex justify-center pb-8">
            <div className="text-[#A0A8B0] text-xs">Step 2 of 2</div>
          </div>
        </form>
      </div>
    </div>
  )
}
