export const SPRING_CRIT = { type: 'spring', bounce: 0, duration: 0.44 }
export const SPRING_SNAP = { type: 'spring', bounce: 0, duration: 0.32 }

export const VIEWPORT_ONCE = { once: true, amount: 0.12 }

export const revealUp = {
  initial: { opacity: 0, transform: 'translateY(18px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
}

export const revealCard = {
  initial: { opacity: 0, transform: 'translateY(14px) scale(0.985)' },
  animate: { opacity: 1, transform: 'translateY(0px) scale(1)' },
}
