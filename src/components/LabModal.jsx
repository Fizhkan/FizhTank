import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Target, ListOrdered, ExternalLink, ShieldCheck, Network, Cpu, Info, FileText, CheckCircle2 } from 'lucide-react'

const STATUS_LABEL = {
  planned: 'Direncanakan',
  'in-progress': 'Sedang dikerjakan',
  complete: 'Selesai',
}

const hasValue = (v) => Boolean(v && v.trim() !== '' && !v.includes('[ISI'))

function Section({ icon: Icon, title, children, visible = true, delay = 0 }) {
  return (
    <section
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ease ${0.1 + delay * 0.1}s, transform 0.5s ease ${0.1 + delay * 0.1}s`,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} className="text-aqua" aria-hidden="true" />
        <h3 className="text-lg text-white">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export default function LabModal({ lab, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(onClose, 250)
  }, [onClose])

  useEffect(() => {
    triggerRef.current = document.activeElement
    return () => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true)
        closeButtonRef.current?.focus()
      })
    })
    const timer = setTimeout(() => setRevealed(true), 250)
    return () => clearTimeout(timer)
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

  const ModalIcon = lab.id === 1 ? Network : lab.id === 2 ? ShieldCheck : Cpu
  const isPlanned = lab.status === 'planned'
  const isComplete = lab.status === 'complete'

  const repoUrl = hasValue(lab.repoUrl) ? lab.repoUrl : null
  const reportUrl = hasValue(lab.reportUrl) ? lab.reportUrl : null
  const topologyImage = hasValue(lab.topologyImage) ? lab.topologyImage : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        backdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
        background: isOpen ? 'rgba(2, 18, 24, 0.78)' : 'rgba(2, 18, 24, 0)',
        transition: 'background 0.25s ease, backdrop-filter 0.25s ease',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-modal-title"
        className="glass relative max-h-[92vh] w-full max-w-2xl overflow-y-auto"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(4, 38, 50, 0.96)',
        }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[rgba(4,38,50,0.98)] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-aqua/40 bg-aqua/10 text-aqua">
              <ModalIcon size={20} aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-aqua">{lab.category}</span>
                <span className="chip">{STATUS_LABEL[lab.status] || lab.status}</span>
              </div>
              <h2 id="lab-modal-title" className="mt-1 text-2xl leading-tight text-white sm:text-3xl">
                {lab.title}
              </h2>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Tutup detail lab"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-mist transition-colors hover:border-white/50 hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-7 p-5 sm:p-6">
          <Section icon={Target} title="Tujuan" visible={revealed} delay={0}>
            <p className="leading-relaxed text-mist">{lab.writeup?.objective}</p>
          </Section>

          {lab.writeup?.plannedSteps && (
            <Section icon={ListOrdered} title="Rencana langkah" visible={revealed} delay={1}>
              <ol className="space-y-2.5">
                {lab.writeup.plannedSteps.map((step, i) => (
                  <li
                    key={step}
                    className="glass-inset flex items-start gap-3 p-3.5"
                    style={{
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? 'translateX(0)' : 'translateX(-10px)',
                      transition: `opacity 0.4s ease ${0.25 + i * 0.07}s, transform 0.4s ease ${0.25 + i * 0.07}s`,
                    }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-aqua/50 text-xs font-semibold text-aqua">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-foam">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {topologyImage && (
            <Section icon={Network} title="Topologi" visible={revealed} delay={2}>
              <img
                src={topologyImage}
                alt={lab.topologyAlt || `Topologi untuk ${lab.title}`}
                className="w-full rounded-xl border border-white/15"
              />
            </Section>
          )}

          {isPlanned && (
            <div
              className="flex items-center gap-3 rounded-xl border border-aqua/30 bg-aqua/10 p-4 text-[0.9375rem] text-foam"
              style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.5s ease 0.4s' }}
            >
              <Info size={18} className="shrink-0 text-aqua" aria-hidden="true" />
              <p>Write-up hasil lab ditambahkan setelah lab selesai dikerjakan.</p>
            </div>
          )}

          {isComplete && lab.writeup?.commands && (
            <Section icon={Target} title="Perintah kunci" visible={revealed} delay={2}>
              <pre className="glass-inset overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-foam">
                {lab.writeup.commands}
              </pre>
            </Section>
          )}

          {isComplete && lab.writeup?.verification && (
            <Section icon={CheckCircle2} title="Hasil verifikasi" visible={revealed} delay={3}>
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
                  <span>Laporan</span>
                </a>
              )}
              {repoUrl && (
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10! px-4! py-2! text-sm">
                  <ExternalLink size={15} aria-hidden="true" />
                  <span>Repositori</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
