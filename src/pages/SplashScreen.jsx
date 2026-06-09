import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SparklesText } from '../components/ui/sparkles-text'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 120)
    const t2 = setTimeout(() => navigate('/onboarding/name'), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [navigate])

  return (
    <div className="screen bg-[#4CBB9B] relative overflow-hidden items-center justify-center">
      <div
        className="flex flex-col items-center justify-center px-6 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.78) translateY(22px)',
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <SparklesText
          text="Splitwork"
          colors={{ first: '#ffffff', second: '#25303D' }}
          sparklesCount={14}
          className="text-white text-5xl font-extrabold tracking-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        />
        <div className="text-white/90 text-[12px] font-semibold tracking-[0.22em] mt-4">
          FAIR CHORES. HAPPY HOMES.
        </div>
        <div className="w-11 h-[3px] rounded-full bg-[#25303D]/40 mx-auto mt-4" />
      </div>

      <div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '0.5s' }}
      >
        <div className="w-2 h-2 rounded-full bg-white/60" />
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white/60" />
      </div>
    </div>
  )
}
