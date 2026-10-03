import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setShow(scrollTop > 400)
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 group"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {/* Progress ring */}
      <svg width="48" height="48" className="absolute inset-0 -rotate-90">
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="rgba(99,102,241,0.15)"
          strokeWidth="2"
        />
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="url(#scroll-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 20}`}
          strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
          style={{ transition: 'stroke-dashoffset 0.15s ease' }}
        />
        <defs>
          <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center border transition-all group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
        style={{
          background: 'rgba(8,12,28,0.9)',
          borderColor: 'rgba(139,92,246,0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <ArrowUp
          size={18}
          className="text-violet-400 group-hover:text-cyan-400 transition-all"
          style={{
            transform: show ? 'translateY(0)' : 'translateY(4px)',
            transition: 'all 0.3s ease',
          }}
        />
      </div>
    </button>
  )
}
