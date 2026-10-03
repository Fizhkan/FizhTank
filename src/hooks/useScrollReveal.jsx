import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Fade-in / slide-up when element enters viewport.
 * Returns [ref, isVisible]
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = options
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin])

  return [ref, isVisible]
}

/**
 * Animated counter — counts from 0 to `end` when `active` is true.
 */
export function useAnimatedCounter(end, active, duration = 1800) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!active || hasRun.current) return
    hasRun.current = true

    const numericEnd = parseInt(String(end).replace(/\D/g, ''), 10)
    if (isNaN(numericEnd) || numericEnd === 0) {
      requestAnimationFrame(() => setCount(numericEnd || 0))
      return
    }

    let start = 0
    const startTime = performance.now()

    function step(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * numericEnd)
      setCount(start)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, active, duration])

  return count
}

/**
 * 3D tilt effect on hover. Returns { ref, style, handlers }
 */
export function useTilt(intensity = 8) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTransform(
        `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02,1.02,1.02)`
      )
    },
    [intensity]
  )

  const onMouseLeave = useCallback(() => {
    setTransform('')
  }, [])

  return {
    ref,
    style: { transform, transition: transform ? 'transform 0.1s ease' : 'transform 0.5s ease' },
    handlers: { onMouseMove, onMouseLeave },
  }
}

/**
 * Parallax offset based on scroll position.
 * Returns a CSS `transform` string.
 */
export function useParallax(speed = 0.15) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          setOffset(window.scrollY * speed)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return `translateY(${offset}px)`
}

/**
 * Mouse-following glow (for a section / container).
 * Returns { ref, glowStyle }
 */
export function useCursorGlow() {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: -200, y: -200 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function handler(e) {
      const rect = el.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    el.addEventListener('mousemove', handler)
    return () => el.removeEventListener('mousemove', handler)
  }, [])

  const glowStyle = {
    position: 'absolute',
    left: pos.x - 150,
    top: pos.y - 150,
    width: 300,
    height: 300,
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'left 0.15s ease, top 0.15s ease',
    zIndex: 0,
  }

  return { ref, glowStyle }
}
