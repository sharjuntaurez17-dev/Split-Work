import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProcessedLogo from '../components/ProcessedLogo'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 120)
    const t2 = setTimeout(() => navigate('/login'), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [navigate])

  return (
    <div className="screen bg-teal-bg relative overflow-hidden items-center justify-center">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Logo + wordmark */}
      <div
        className="flex flex-col items-center gap-7 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.78) translateY(22px)',
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Logo with glow */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(12,197,185,0.22) 0%, transparent 70%)',
              filter: 'blur(16px)',
              margin: '-22px',
            }}
          />
          <div className="relative z-10">
            <ProcessedLogo size={130} />
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <div className="text-white font-serif text-4xl font-extrabold tracking-tight leading-none">
            Splitwork
          </div>
          <div className="text-white/80 text-[12px] font-medium tracking-[1.2px] uppercase mt-2.5">
            Fair chores. Happy homes.
          </div>
          <div className="w-11 h-[3px] rounded-full bg-navy/50 mx-auto mt-2.5"/>
        </div>
      </div>

      {/* Loading dots */}
      <div
        className="absolute bottom-14 flex gap-2.5 transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '0.5s' }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 1 ? '#25303D' : '#2A7A62',
              animation: `dot-bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
