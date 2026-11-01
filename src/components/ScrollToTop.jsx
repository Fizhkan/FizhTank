import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        setShow(window.scrollY > 600)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas"
      tabIndex={show ? 0 : -1}
      className="glass fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-aqua transition-all duration-300 hover:text-white active:scale-95 sm:right-7 sm:bottom-6"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}
