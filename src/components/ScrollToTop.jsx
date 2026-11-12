import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { smoothScrollTo } from '../utils/scroll'

const RADIUS = 21

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
          onClick={() => smoothScrollTo(0, { hash: '#hero' })}
          aria-label="Back to top"
          initial={{ opacity: 0, transform: 'translateY(28px) scale(0.75)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          exit={{ opacity: 0, transform: 'translateY(28px) scale(0.75)' }}
          whileHover={{ transform: 'translateY(-2px) scale(1.05)' }}
          whileTap={{ transform: 'translateY(0px) scale(0.95)' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="fixed right-5 bottom-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-deep/75 text-aqua shadow-[0_10px_28px_rgba(1,10,16,0.55)] backdrop-blur-md transition-colors duration-150 hover:bg-water/85 hover:text-foam sm:right-7 sm:bottom-6"
        >
          <svg
            viewBox="0 0 48 48"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="rgba(94, 234, 212, 0.16)"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
            />
          </svg>
          <ArrowUp size={17} className="relative z-10" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
