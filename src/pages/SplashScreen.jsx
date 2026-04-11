import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SplitworkLogo from '../components/SplitworkLogo'

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
        <div className="mb-7">
          <SplitworkLogo size={132} />
        </div>
        <div className="text-center">
          <div className="text-white text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Splitwork
          </div>
          <div className="text-white/90 text-[12px] font-semibold tracking-[0.22em] mt-3">
            FAIR CHORES. HAPPY HOMES.
          </div>
          <div className="w-11 h-[3px] rounded-full bg-[#25303D]/40 mx-auto mt-4" />
        </div>
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
