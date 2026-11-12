import { useEffect, useCallback, useRef } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import { X, Target, ListOrdered, ExternalLink, ShieldCheck, Network, Cpu, Info, FileText, CheckCircle2 } from 'lucide-react'

const STATUS_LABEL = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  complete: 'Completed',
}

const hasValue = (v) => Boolean(v && v.trim() !== '' && !v.includes('[ISI'))

// Rumus rubber-band Apple (§9): hambatan progresif saat ditarik melewati batas atas
function rubberband(overshoot, dimension = 220, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

// Rumus momentum projection Apple (§6): memproyeksikan titik henti dari kecepatan jari saat dilepas
function projectMomentum(velocityPxPerSec, decelerationRate = 0.99) {
  return ((velocityPxPerSec / 1000) * decelerationRate) / (1 - decelerationRate)
}

function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, transform: 'translateY(8px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.34, delay: 0.04 + delay * 0.035 }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-aqua" aria-hidden="true" />
        <h3 className="font-mono text-xs tracking-widest text-foam uppercase">{title}</h3>
      </div>
      {children}
    </motion.section>
  )
}

export default function LabModal({ lab, onClose }) {
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Tracking gestur 1:1 dengan Pointer Events & riwayat kecepatan untuk velocity handoff (§2, §5, §6)
  const dragY = useMotionValue(0)
  const backdropOpacity = useMotionValue(1)
  const dragStateRef = useRef({ active: false, pointerId: null, startY: 0, history: [] })
  const isClosingRef = useRef(false)

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    animate(backdropOpacity, 0, { duration: 0.2 })
    onClose()
  }, [backdropOpacity, onClose])

  useEffect(() => {
    triggerRef.current = document.activeElement
    closeButtonRef.current?.focus()
    return () => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  const onHeaderPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    if (e.target.closest('button, a, input, select, textarea')) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startY: e.clientY - dragY.get(),
      history: [{ y: e.clientY, t: performance.now() }],
    }
  }

  const onHeaderPointerMove = (e) => {
    const st = dragStateRef.current
    if (!st.active || st.pointerId !== e.pointerId) return
    const rawDelta = e.clientY - st.startY
    const mappedY = rawDelta >= 0 ? rawDelta : rubberband(rawDelta, 220, 0.55)
    dragY.set(mappedY)
    backdropOpacity.set(Math.max(0.25, 1 - Math.max(0, mappedY) / 420))

    const now = performance.now()
    st.history.push({ y: e.clientY, t: now })
    if (st.history.length > 5) st.history.shift()
  }

  const onHeaderPointerUp = (e) => {
    const st = dragStateRef.current
    if (!st.active || st.pointerId !== e.pointerId) return
    st.active = false

    const now = performance.now()
    const recent = st.history.find((pt) => now - pt.t <= 100) || st.history[0]
    const dtSec = Math.max(0.016, (now - recent.t) / 1000)
    const velocityY = (e.clientY - recent.y) / dtSec
    const currentY = dragY.get()
    const projectedY = currentY + projectMomentum(velocityY, 0.99)

    if ((projectedY > 150 && velocityY >= -80) || currentY > 180) {
      isClosingRef.current = true
      animate(backdropOpacity, 0, { duration: 0.22 })
      animate(dragY, Math.max(360, window.innerHeight * 0.55), {
        type: 'spring',
        bounce: 0,
        duration: 0.34,
        velocity: Math.max(0, velocityY),
      }).then(() => onClose())
    } else {
      animate(backdropOpacity, 1, { duration: 0.2 })
      animate(dragY, 0, {
        type: 'spring',
        bounce: velocityY < -120 ? 0.14 : 0,
        duration: 0.38,
        velocity: velocityY,
      })
    }
  }

  const ModalIcon = lab.id === 1 ? Network : lab.id === 2 ? ShieldCheck : Cpu
  const isPlanned = lab.status === 'planned'
  const isComplete = lab.status === 'complete'

  const repoUrl = hasValue(lab.repoUrl) ? lab.repoUrl : null
  const reportUrl = hasValue(lab.reportUrl) ? lab.reportUrl : null
  const topologyImage = hasValue(lab.topologyImage) ? lab.topologyImage : null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        backdropFilter: 'blur(10px)',
        background: 'rgba(2, 18, 24, 0.78)',
        opacity: backdropOpacity,
      }}
    >
      {/* Materialize enter/exit (scale + blur + spring) dengan jalur simetris (§7 & §12) */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-modal-title"
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.36 }}
        style={{ y: dragY, background: 'rgba(3, 29, 40, 0.98)' }}
        className="specimen-panel reticle relative max-h-[92vh] w-full max-w-2xl overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
      >
        <div
          onPointerDown={onHeaderPointerDown}
          onPointerMove={onHeaderPointerMove}
          onPointerUp={onHeaderPointerUp}
          onPointerCancel={onHeaderPointerUp}
          className="sticky top-0 z-10 cursor-grab border-b border-aqua/15 bg-[#031d28]/98 px-5 pt-2.5 pb-5 select-none active:cursor-grabbing sm:px-6 sm:pb-6"
        >
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-aqua/25" aria-hidden="true" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] border border-aqua/35 bg-aqua/10 text-aqua">
                <ModalIcon size={20} aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs tracking-widest text-aqua uppercase">{lab.category}</span>
                  <span className="chip">{STATUS_LABEL[lab.status] || lab.status}</span>
                </div>
                <h2 id="lab-modal-title" className="mt-1.5 text-2xl leading-tight text-foam sm:text-3xl">
                  {lab.title}
                </h2>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close lab blueprint"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-aqua/25 text-mist transition-[border-color,color,transform] duration-100 hover:border-aqua/60 hover:text-foam active:scale-[0.95]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-7 p-5 sm:p-6">
          <Section icon={Target} title="Objective" delay={0}>
            <p className="leading-relaxed text-mist">{lab.writeup?.objective}</p>
          </Section>

          {lab.writeup?.plannedSteps && (
            <Section icon={ListOrdered} title="Execution Plan" delay={1}>
              <ol className="space-y-2.5">
                {lab.writeup.plannedSteps.map((step, i) => (
                  <li key={step} className="specimen-inset flex items-start gap-3 p-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border border-aqua/40 font-mono text-xs font-semibold text-aqua">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed text-foam">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {topologyImage && (
            <Section icon={Network} title="Topology" delay={2}>
              <img
                src={topologyImage}
                alt={lab.topologyAlt || `Topology diagram for ${lab.title}`}
                className="w-full rounded-[2px] border border-aqua/20"
              />
            </Section>
          )}

          {isPlanned && (
            <div className="flex items-center gap-3 rounded-[2px] border border-aqua/25 bg-aqua/8 p-4 text-[0.9375rem] text-foam">
              <Info size={18} className="shrink-0 text-aqua" aria-hidden="true" />
              <p>Verification logs and full configuration write-up will be published upon completion.</p>
            </div>
          )}

          {isComplete && lab.writeup?.commands && (
            <Section icon={Target} title="Key Commands" delay={2}>
              <pre className="specimen-inset overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-foam">
                {lab.writeup.commands}
              </pre>
            </Section>
          )}

          {isComplete && lab.writeup?.verification && (
            <Section icon={CheckCircle2} title="Verification Results" delay={3}>
              <ul className="space-y-2 text-mist">
                {lab.writeup.verification.map((v) => (
                  <li key={v} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-kelp" aria-hidden="true" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
            <ul className="flex flex-wrap gap-2">
              {lab.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              {reportUrl && (
                <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10! px-4! py-2! text-sm">
                  <FileText size={15} aria-hidden="true" />
                  <span>Report</span>
                </a>
              )}
              {repoUrl && (
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10! px-4! py-2! text-sm">
                  <ExternalLink size={15} aria-hidden="true" />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
