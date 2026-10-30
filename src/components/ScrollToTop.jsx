import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShow(window.scrollY > 500)
          ticking = false
        })
        ticking = true
      }
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
      aria-label="Kembali ke permukaan"
      className="fixed bottom-20 right-6 z-40 group touch-manipulation select-none cursor-pointer p-2.5 rounded-full border border-white/10 bg-slate-950/80 backdrop-blur-xl text-slate-400 hover:text-white hover:border-cyan-400/50 hover:bg-slate-900 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] active:scale-95"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.85)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={16} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  )
}
