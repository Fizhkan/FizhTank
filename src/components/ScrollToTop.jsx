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
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className="specimen-panel fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-[2px] text-aqua transition-[opacity,transform,border-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-aqua/60 hover:text-foam active:scale-[0.97] sm:right-7 sm:bottom-6"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={17} aria-hidden="true" />
    </button>
  )
}
