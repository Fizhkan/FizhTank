import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'

const RADIUS = 18

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const sync = () => setShow(window.scrollY > 360)
    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        sync()
        ticking = false
      })
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="scroll-to-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, transform: 'translateY(24px) scale(0.84)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          exit={{ opacity: 0, transform: 'translateY(24px) scale(0.84)' }}
          whileHover={{ transform: 'translateY(-2px) scale(1.04)' }}
          whileTap={{ transform: 'translateY(0px) scale(0.95)' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.36 }}
          className="specimen-panel fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-[2px] text-aqua shadow-[0_10px_28px_rgba(1,10,16,0.55)] transition-[border-color,color] duration-150 hover:border-aqua/65 hover:text-foam sm:right-7 sm:bottom-6"
        >
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              stroke="rgba(94, 234, 212, 0.14)"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
            />
          </svg>
          <ArrowUp size={16} className="relative z-10" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
