import { animate } from 'motion/react'

let activeScrollAnim = null
let lockObserverUntil = 0

export function isProgrammaticScrolling() {
  return typeof performance !== 'undefined' && performance.now() < lockObserverUntil
}

export function stopSmoothScroll() {
  if (activeScrollAnim) {
    activeScrollAnim.stop()
    activeScrollAnim = null
  }
  lockObserverUntil = 0
}

/**
 * Smoothly glide the viewport to a Y coordinate or element ID using Motion's
 * rAF-driven animator, remaining 100% interruptible on user input.
 */
export function smoothScrollTo(target, { offset = 76, hash } = {}) {
  if (typeof window === 'undefined') return

  stopSmoothScroll()

  const startY = window.scrollY
  let destY = 0

  if (typeof target === 'number') {
    destY = Math.max(0, target)
  } else if (target) {
    const id = typeof target === 'string' ? target.replace(/^#/, '') : ''
    const el = typeof target === 'string' ? document.getElementById(id) : target
    if (!el) return
    const rect = el.getBoundingClientRect()
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    destY = Math.min(maxScroll, Math.max(0, startY + rect.top - offset))
  }

  const distance = Math.abs(destY - startY)
  if (distance < 2) {
    if (hash) window.history.replaceState(null, '', hash)
    return
  }

  const duration = Math.min(0.95, Math.max(0.55, 0.44 + distance / 3600))
  lockObserverUntil = performance.now() + duration * 1000 + 80

  const onKeyCancel = (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space', ' '].includes(e.key)) {
      cancelOnUserInput()
    }
  }

  const cleanupListeners = () => {
    window.removeEventListener('wheel', cancelOnUserInput)
    window.removeEventListener('touchstart', cancelOnUserInput)
    window.removeEventListener('pointerdown', cancelOnUserInput)
    window.removeEventListener('keydown', onKeyCancel)
  }

  const cancelOnUserInput = () => {
    stopSmoothScroll()
    cleanupListeners()
  }

  window.addEventListener('wheel', cancelOnUserInput, { passive: true })
  window.addEventListener('touchstart', cancelOnUserInput, { passive: true })
  window.addEventListener('pointerdown', cancelOnUserInput, { passive: true })
  window.addEventListener('keydown', onKeyCancel)

  if (hash) {
    window.history.replaceState(null, '', hash)
  }

  activeScrollAnim = animate(startY, destY, {
    duration,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (latest) => {
      window.scrollTo({ top: latest, behavior: 'instant' })
    },
    onComplete: () => {
      activeScrollAnim = null
      lockObserverUntil = 0
      cleanupListeners()
    },
  })
}
