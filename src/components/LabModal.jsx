import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Target, Map, Terminal, CheckCircle2 } from 'lucide-react'

export default function LabModal({ lab, onClose }) {
  const Icon = lab.icon
  const [isOpen, setIsOpen] = useState(false)
  const [sectionsRevealed, setSectionsRevealed] = useState(false)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }, [onClose])

  // Save previous focused trigger and restore on unmount
  useEffect(() => {
    triggerRef.current = document.activeElement
    return () => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [])

  // Animate in on mount and focus close button
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true)
        closeButtonRef.current?.focus()
      })
    })
    const timer = setTimeout(() => setSectionsRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Close on Escape & Tab Focus Trapping
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

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
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

  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
  }
  const accent = colorMap[lab.accentColor]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        backdropFilter: isOpen ? 'blur(10px)' : 'blur(0px)',
        background: isOpen ? 'rgba(4, 6, 15, 0.85)' : 'rgba(4, 6, 15, 0)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-modal-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '0 0 60px rgba(0,0,0,0.8), 0 0 120px rgba(109,40,217,0.1)' : 'none',
        }}
      >
        {/* Animated top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 30%, rgba(6,182,212,0.5) 70%, transparent 100%)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}
              style={{
                transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(-10deg) scale(0.8)',
                transition: 'all 0.5s ease 0.2s',
              }}
            >
              <Icon size={18} />
            </div>
            <div>
              <span className="text-[12px] text-cyan-300 font-mono font-semibold tracking-wider block mb-0.5">{lab.category}</span>
              <h2 id="lab-modal-title" className="text-xl sm:text-2xl font-bold font-display text-zinc-50 leading-tight">{lab.title}</h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Tutup dialog detail lab"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-all ml-4 shrink-0 hover:rotate-90 active:scale-90"
            style={{ transition: 'all 0.3s ease' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <Section
            icon={Target}
            title="Objective"
            iconClass="text-amber-400"
            visible={sectionsRevealed}
            delay={0}
          >
            <p className="text-zinc-200 text-[14.5px] sm:text-base leading-relaxed">{lab.writeup.objective}</p>
          </Section>

          {/* Topology */}
          <Section
            icon={Map}
            title="Architecture / Topology"
            iconClass="text-blue-400"
            visible={sectionsRevealed}
            delay={1}
          >
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 relative overflow-hidden group">
              {/* Decorative grid */}
              <div
                className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #8b5cf6 0, #8b5cf6 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 1px, transparent 0, transparent 50%)',
                  backgroundSize: '24px 24px',
                }}
              />
              <pre className="relative text-[12.5px] sm:text-[13px] text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap">
                {lab.writeup.topology}
              </pre>
            </div>
          </Section>

          {/* Key Commands */}
          <Section
            icon={Terminal}
            title="Key Commands / Config"
            iconClass="text-violet-400"
            visible={sectionsRevealed}
            delay={2}
          >
            <div className="code-block group hover:border-violet-500/30 transition-colors duration-300">
              {lab.writeup.commands}
            </div>
          </Section>

          {/* Verification */}
          <Section
            icon={CheckCircle2}
            title="Verification Results"
            iconClass="text-green-400"
            visible={sectionsRevealed}
            delay={3}
          >
            <div className="space-y-2.5">
              {lab.writeup.verification.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm group/verify"
                  style={{
                    opacity: sectionsRevealed ? 1 : 0,
                    transform: sectionsRevealed ? 'translateX(0)' : 'translateX(-15px)',
                    transition: `all 0.4s ease ${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover/verify:bg-green-500/25 group-hover/verify:border-green-500/50 transition-all duration-300">
                    <span className="text-green-300 text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed font-mono text-[12.5px] sm:text-[13px] group-hover/verify:text-white transition-colors duration-300">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            {lab.tags.map((tag, i) => (
              <span
                key={tag}
                className="tech-badge hover:scale-105 transition-all duration-200"
                style={{
                  opacity: sectionsRevealed ? 1 : 0,
                  transform: sectionsRevealed ? 'translateY(0)' : 'translateY(8px)',
                  transition: `all 0.3s ease ${0.7 + i * 0.06}s`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, iconClass, children, visible = true, delay = 0 }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${0.15 + delay * 0.12}s`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className={iconClass} />
        <h3 className="text-[14.5px] font-bold font-display text-zinc-100 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  )
}
