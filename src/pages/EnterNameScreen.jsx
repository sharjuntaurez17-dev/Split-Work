import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { CanvasRevealEffect } from '../components/ui/canvas-reveal-effect'
import { SparklesText } from '../components/ui/sparkles-text'

export default function EnterNameScreen() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('name')
  const { setLocalProfile } = useAuth()
  const navigate = useNavigate()

  function handleNameNext(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your name.'); return }
    setError('')
    setStep('phone')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLocalProfile({ name: name.trim(), phone: phone.trim() || null })
    navigate('/dashboard')
  }

  function handleBack() {
    setStep('name')
    setError('')
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Dot matrix background */}
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[12, 197, 185], [78, 205, 196]]}
          dotSize={5}
          reverse={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.7)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {step === 'name' ? (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <SparklesText
                  text="Splitwork"
                  colors={{ first: '#0CC5B9', second: '#ffffff' }}
                  sparklesCount={8}
                  className="text-[#0CC5B9] text-lg font-bold tracking-widest uppercase justify-center"
                />
                <h1 className="text-[2.2rem] font-bold leading-tight tracking-tight text-white">
                  What's your name?
                </h1>
                <p className="text-white/50 text-base font-light">
                  Let's get you set up
                </p>
              </div>

              <form onSubmit={handleNameNext} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setError('') }}
                    placeholder="Your name"
                    className="w-full backdrop-blur-sm bg-white/5 text-white border border-white/10 rounded-full py-3.5 px-5 focus:outline-none focus:border-[#0CC5B9]/50 text-center text-base placeholder:text-white/30"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 text-white w-10 h-10 flex items-center justify-center rounded-full bg-[#0CC5B9]/20 hover:bg-[#0CC5B9]/40 transition-colors group overflow-hidden"
                  >
                    <span className="relative w-full h-full block overflow-hidden">
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                        &rarr;
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                        &rarr;
                      </span>
                    </span>
                  </button>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </form>

              <p className="text-xs text-white/30 pt-8">
                Step 1 of 2
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="phone-step"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-[2.2rem] font-bold leading-tight tracking-tight text-white">
                  Hi, {name}!
                </h1>
                <p className="text-white/50 text-base font-light">
                  Add your phone number (optional)
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 602 555 0148"
                  className="w-full backdrop-blur-sm bg-white/5 text-white border border-white/10 rounded-full py-3.5 px-5 focus:outline-none focus:border-[#0CC5B9]/50 text-center text-base placeholder:text-white/30"
                  autoFocus
                />

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="rounded-full bg-white/10 text-white font-medium px-6 py-3 hover:bg-white/20 transition-colors border border-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 rounded-full bg-[#0CC5B9] text-white font-bold py-3 hover:bg-[#0BB5AA] transition-colors shadow-lg shadow-[#0CC5B9]/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Let's go!
                  </motion.button>
                </div>
              </form>

              <p className="text-xs text-white/30 pt-8">
                Step 2 of 2
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
