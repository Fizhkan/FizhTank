import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Target, ListOrdered, ExternalLink, ShieldCheck, Network, Cpu, Info, FileText } from 'lucide-react'

export default function LabModal({ lab, onClose }) {
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
  const accent = colorMap[lab.accentColor] || colorMap.blue

  const modalIcon = lab.id === 1 ? Network : lab.id === 2 ? ShieldCheck : Cpu

  const isPlanned = lab.status === 'planned'
  const isComplete = lab.status === 'complete'

  // Valid optional links (only render if filled and not a placeholder)
  const validRepoUrl =
    lab.repoUrl && !lab.repoUrl.includes('[ISI') && lab.repoUrl.trim() !== '' ? lab.repoUrl : null
  const validReportUrl =
    lab.reportUrl && !lab.reportUrl.includes('[ISI') && lab.reportUrl.trim() !== '' ? lab.reportUrl : null
  const validTopologyImage =
    lab.topologyImage && !lab.topologyImage.includes('[ISI') && lab.topologyImage.trim() !== ''
      ? lab.topologyImage
      : null

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
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl"
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
              {modalIcon && <modalIcon size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] text-cyan-300 font-mono font-semibold tracking-wider block">
                  {lab.category}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.2 rounded-full border bg-zinc-800/80 text-zinc-300 border-zinc-700/60 uppercase">
                  {lab.status}
                </span>
              </div>
              <h2 id="lab-modal-title" className="text-xl sm:text-2xl font-bold font-display text-zinc-50 leading-tight">
                {lab.title}
              </h2>
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
            <p className="text-zinc-200 text-[14.5px] sm:text-base leading-relaxed">
              {lab.writeup?.objective}
            </p>
          </Section>

          {/* Planned Steps (Rencana Langkah) */}
          {lab.writeup?.plannedSteps && (
            <Section
              icon={ListOrdered}
              title="Rencana Langkah Pengerjaan"
              iconClass="text-cyan-400"
              visible={sectionsRevealed}
              delay={1}
            >
              <div className="space-y-2.5">
                {lab.writeup.plannedSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[13.5px] text-zinc-200 leading-relaxed font-sans"
                    style={{
                      opacity: sectionsRevealed ? 1 : 0,
                      transform: sectionsRevealed ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `all 0.4s ease ${0.3 + i * 0.08}s`,
                    }}
                  >
                    <span className="w-6 h-6 rounded-lg bg-violet-950/60 border border-violet-500/30 text-violet-300 font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-zinc-300">{step}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Optional Topology Image (Only rendered if filled) */}
          {validTopologyImage && (
            <Section
              icon={Target}
              title="Topologi"
              iconClass="text-blue-400"
              visible={sectionsRevealed}
              delay={2}
            >
              <img
                src={validTopologyImage}
                alt={lab.topologyAlt || `Topologi untuk ${lab.title}`}
                className="w-full rounded-xl border border-zinc-800"
              />
            </Section>
          )}

          {/* Planned Status Notice */}
          {isPlanned && (
            <div
              className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/25 flex items-center gap-3 text-zinc-300 text-sm font-sans"
              style={{
                opacity: sectionsRevealed ? 1 : 0,
                transition: 'opacity 0.5s ease 0.4s',
              }}
            >
              <Info size={18} className="text-cyan-400 shrink-0" />
              <p className="leading-relaxed">
                Write-up ditambahkan setelah lab selesai.
              </p>
            </div>
          )}

          {/* Completed Lab Sections (Only if complete) */}
          {isComplete && lab.writeup?.commands && (
            <Section
              icon={Target}
              title="Key Configuration Commands"
              iconClass="text-violet-400"
              visible={sectionsRevealed}
              delay={2}
            >
              <div className="code-block group hover:border-violet-500/30 transition-colors duration-300 font-mono text-xs">
                {lab.writeup.commands}
              </div>
            </Section>
          )}

          {isComplete && lab.writeup?.verification && (
            <Section
              icon={Target}
              title="Hasil Verifikasi"
              iconClass="text-green-400"
              visible={sectionsRevealed}
              delay={3}
            >
              <div className="space-y-2">
                {lab.writeup.verification.map((v, i) => (
                  <p key={i} className="text-zinc-300 text-xs font-mono">
                    • {v}
                  </p>
                ))}
              </div>
            </Section>
          )}

          {/* Bottom Bar: Tags & Optional Links */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {lab.tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {validReportUrl && (
                <a
                  href={validReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 hover:text-white text-xs font-mono font-medium transition-all"
                >
                  <FileText size={13} />
                  <span>Report</span>
                </a>
              )}

              {validRepoUrl && (
                <a
                  href={validRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-200 hover:text-white hover:bg-violet-600/30 text-xs font-mono font-medium transition-all"
                >
                  <ExternalLink size={13} />
                  <span>Repository</span>
                </a>
              )}
            </div>
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
