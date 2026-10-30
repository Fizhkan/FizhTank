import { useEffect, useState, useRef } from 'react'

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FIZHTANK — AWWWARDS CUSTOM MAGNETIC LERP CURSOR
 * ══════════════════════════════════════════════════════════════════════════════
 * - Fluid dual-stage lerp follower (precision inner dot + elastic outer ring)
 * - Contextual morphology: adapts size and label over links, buttons, and canvas
 * - Non-intrusive: strictly auto-disabled on touch/coarse pointers
 * - 60 FPS requestAnimationFrame with hardware-accelerated transforms
 * ══════════════════════════════════════════════════════════════════════════════
 */

export default function CustomCursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const [cursorText, setCursorText] = useState('')
  const [cursorVariant, setCursorVariant] = useState('default') // 'default' | 'hover' | 'canvas' | 'click'

  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (mouse)
    if (typeof window === 'undefined') return
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFinePointer) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isVisible = false
    let isPressed = false
    let animId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }
    }

    const onMouseDown = () => {
      isPressed = true
      setCursorVariant('click')
    }

    const onMouseUp = () => {
      isPressed = false
      setCursorVariant('default')
    }

    const onMouseLeave = () => {
      isVisible = false
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    // Interactive target detection via event delegation
    const onMouseOver = (e) => {
      const target = e.target
      if (!target || !(target instanceof HTMLElement)) return

      const interactive = target.closest('button, a, input, [role="button"], canvas, [data-cursor]')
      if (!interactive) {
        setCursorVariant(isPressed ? 'click' : 'default')
        setCursorText('')
        return
      }

      if (interactive.tagName === 'CANVAS') {
        setCursorVariant('canvas')
        setCursorText('PING')
      } else if (interactive.getAttribute('data-cursor')) {
        setCursorVariant('hover')
        setCursorText(interactive.getAttribute('data-cursor'))
      } else {
        setCursorVariant('hover')
        setCursorText('')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseover', onMouseOver, { passive: true })

    // Physics render loop: smooth 0.18 lerp interpolation
    const render = () => {
      const lerp = 0.18
      ringX += (mouseX - ringX) * lerp
      ringY += (mouseY - ringY) * lerp

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  if (!enabled) return null

  // Ring dimensions and styles according to variant
  let ringClasses = 'w-9 h-9 border border-cyan-400/40'
  if (cursorVariant === 'hover') {
    ringClasses = 'w-14 h-14 border-cyan-400/80 bg-cyan-400/[0.08] backdrop-blur-[2px]'
  } else if (cursorVariant === 'canvas') {
    ringClasses = 'w-20 h-20 border-cyan-300/80 bg-cyan-400/[0.12] backdrop-blur-[2px]'
  } else if (cursorVariant === 'click') {
    ringClasses = 'w-7 h-7 border-cyan-300 bg-cyan-400/30'
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Precision Center Pinpoint Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] transition-opacity duration-300 opacity-0 pointer-events-none will-change-transform z-50"
      />

      {/* Lagging Elastic Halo Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-[50%] -mt-[50%] rounded-full flex items-center justify-center font-mono text-[9px] font-bold text-cyan-200 tracking-wider uppercase transition-[width,height,background-color,border-color] duration-200 ease-out opacity-0 pointer-events-none will-change-transform z-40 ${ringClasses}`}
        style={{
          transformOrigin: 'center center',
          margin: 0,
          left: 0,
          top: 0,
          marginLeft: cursorVariant === 'canvas' ? -40 : cursorVariant === 'hover' ? -28 : cursorVariant === 'click' ? -14 : -18,
          marginTop: cursorVariant === 'canvas' ? -40 : cursorVariant === 'hover' ? -28 : cursorVariant === 'click' ? -14 : -18,
        }}
      >
        {cursorText && (
          <span className="animate-in fade-in zoom-in-75 duration-150 select-none">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  )
}
