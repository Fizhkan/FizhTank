import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Network, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'

const LabModal = lazy(() => import('./LabModal'))

const STATUS_LABEL = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  complete: 'Completed',
}

const LAB_ICONS = { 1: Network, 2: ShieldCheck, 3: Cpu }

function Diagram({ labId }) {
  if (labId === 1) {
    return (
      <div className="specimen-inset p-4 sm:p-5">
        <p className="font-mono text-[0.6875rem] tracking-wider text-aqua uppercase">Topology Blueprint</p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 rounded-[2px] border border-aqua/50 bg-aqua/10 px-4 py-2 font-mono text-xs font-medium text-white">
            <Network size={15} className="text-aqua" aria-hidden="true" />
            Core L3 Switch (SVI)
          </div>
          <div className="relative h-5 w-px bg-aqua/50" aria-hidden="true" />
          <p className="-mt-1 font-mono text-[0.6875rem] text-mist">802.1Q Trunk</p>
          <div className="grid w-full grid-cols-3 gap-px border border-aqua/15 bg-aqua/15">
            {[
              ['VLAN 10', 'IT', '192.168.10.0/24'],
              ['VLAN 20', 'HR', '192.168.20.0/24'],
              ['VLAN 30', 'Finance', '192.168.30.0/24'],
            ].map(([vlan, name, net]) => (
              <div key={vlan} className="bg-deep/90 p-2.5 text-center">
                <p className="font-mono text-xs font-semibold text-white">{vlan}</p>
                <p className="text-xs text-mist">{name}</p>
                <p className="mt-1 font-mono text-[0.6875rem] text-sand sm:text-xs">{net}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 border-t border-aqua/12 pt-3 text-sm text-mist">
          ACL Policy: deny cross-VLAN traffic from VLAN 20 (HR) to VLAN 30 (Finance).
        </p>
      </div>
    )
  }

  if (labId === 2) {
    return (
      <div className="specimen-inset p-4 sm:p-5">
        <p className="font-mono text-[0.6875rem] tracking-wider text-aqua uppercase">Wireshark Capture Scope</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="border border-coral/40 bg-coral/10 p-3">
            <p className="font-semibold text-white">HTTP &amp; FTP (Cleartext)</p>
            <p className="mt-1 text-sm text-mist">Credentials remain readable inside raw TCP streams.</p>
          </div>
          <div className="border border-kelp/40 bg-kelp/10 p-3">
            <p className="font-semibold text-white">HTTPS (TLS 1.3)</p>
            <p className="mt-1 text-sm text-mist">Application payload is encrypted post-handshake.</p>
          </div>
        </div>
        <p className="mt-4 border-t border-aqua/12 pt-3 text-sm text-mist">
          Display filter: <code className="font-mono text-aqua">tcp.port == 443 || http</code>
        </p>
      </div>
    )
  }

  return (
    <div className="specimen-inset p-4 sm:p-5">
      <p className="font-mono text-[0.6875rem] tracking-wider text-aqua uppercase">Homelab Gateway Architecture</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="border border-aqua/15 bg-deep/70 p-3">
          <p className="font-semibold text-white">UFW Stateful Firewall</p>
          <p className="mt-1 text-sm text-mist">Default-deny ingress, allow egress, key-only SSH.</p>
        </div>
        <div className="border border-aqua/15 bg-deep/70 p-3">
          <p className="font-semibold text-white">Pi-hole Resolver</p>
          <p className="mt-1 text-sm text-mist">Local DNS sinkhole filtering telemetry on port 53.</p>
        </div>
      </div>
      <p className="mt-4 border-t border-aqua/12 pt-3 text-sm text-mist">
        Verification: external Nmap sweep confirms zero unintended open ports.
      </p>
    </div>
  )
}

export default function Labs({ onModalOpenChange }) {
  const [activeLabId, setActiveLabId] = useState(1)
  const [modalLab, setModalLab] = useState(null)

  useEffect(() => {
    onModalOpenChange?.(Boolean(modalLab))
    return () => onModalOpenChange?.(false)
  }, [modalLab, onModalOpenChange])

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.08 })

  const currentLab = labsData.find((l) => l.id === activeLabId) || labsData[0]

  const reveal = (visible, offset = 20) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: 'opacity 550ms cubic-bezier(0.23, 1, 0.32, 1), transform 550ms cubic-bezier(0.23, 1, 0.32, 1)',
  })

  return (
    <section id="labs" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div
        ref={headerRef}
        className="mb-12 flex flex-col justify-between gap-6 border-b border-aqua/15 pb-8 lg:flex-row lg:items-end"
        style={reveal(headerVisible)}
      >
        <div className="max-w-2xl">
          <p className="eyebrow">01 // Lab Archive — Mesopelagic</p>
          <h2 className="section-title on-water mt-4">
            Engineering <em className="italic text-aqua">labs</em>
          </h2>
        </div>
        <p className="lede on-water max-w-md text-base">
          Network topologies, security baselines, and verification plans queued for execution.
        </p>
      </div>

      <div
        ref={contentRef}
        className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
        style={reveal(contentVisible, 24)}
      >
        {/* Master Lab Ledger */}
        <div className="lg:col-span-5">
          <div className="specimen-panel divide-y divide-aqua/15">
            <div className="flex items-center justify-between px-5 py-3 font-mono text-[0.6875rem] tracking-widest text-mist uppercase">
              <span>Lab Index</span>
              <span className="text-aqua">0{labsData.length} Specs</span>
            </div>

            {labsData.map((lab) => {
              const selected = lab.id === activeLabId
              const Icon = LAB_ICONS[lab.id] || Cpu
              return (
                <button
                  key={lab.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveLabId(lab.id)}
                  className={`group relative w-full p-5 text-left transition-colors duration-150 active:scale-[0.99] ${
                    selected ? 'bg-water/80' : 'hover:bg-water/35'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="lab-active-bar"
                      transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
                      className="absolute inset-y-0 left-0 w-0.5 bg-aqua"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border font-mono text-xs ${
                        selected ? 'border-aqua bg-aqua text-deep' : 'border-aqua/25 text-aqua'
                      }`}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 font-mono text-[0.6875rem] tracking-wider uppercase">
                        <span className={selected ? 'text-aqua' : 'text-mist/80'}>
                          LAB 0{lab.id} · {lab.category}
                        </span>
                      </span>
                      <span className="mt-1 block font-display text-2xl leading-snug text-white">
                        {lab.title}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-mist">
                        {lab.description}
                      </span>
                    </span>

                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className={`mt-1 shrink-0 transition-transform duration-150 ${
                        selected ? 'translate-x-0.5 text-aqua' : 'text-mist/50 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Lab Blueprint Detail */}
        <article className="specimen-panel reticle p-6 sm:p-8 lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentLab.id}
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(-6px)' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aqua/15 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip text-aqua">SPEC // LAB 0{currentLab.id}</span>
                  <span className="chip">{currentLab.category}</span>
                </div>
                <span className="chip border-aqua/40 text-sand">
                  {STATUS_LABEL[currentLab.status] || currentLab.status}
                </span>
              </div>

              <h3 className="mt-6 text-3xl text-white sm:text-4xl">{currentLab.title}</h3>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mist">{currentLab.description}</p>

              <div className="mt-6">
                <Diagram labId={currentLab.id} />
              </div>

              <div className="mt-6 border-t border-aqua/12 pt-5">
                <h4 className="font-mono text-xs tracking-widest text-aqua uppercase">Objective</h4>
                <p className="mt-2 leading-relaxed text-foam">{currentLab.writeup.objective}</p>
              </div>

              <div className="mt-6 border-t border-aqua/12 pt-5">
                <h4 className="font-mono text-xs tracking-widest text-aqua uppercase">Execution Plan</h4>
                <ol className="mt-3 space-y-2.5">
                  {currentLab.writeup.plannedSteps.slice(0, 3).map((step, idx) => (
                    <li key={step} className="flex items-start gap-3 text-mist">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border border-aqua/40 font-mono text-[0.6875rem] font-semibold text-aqua">
                        0{idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-aqua/15 pt-6">
                <ul className="flex flex-wrap gap-2">
                  {currentLab.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setModalLab(currentLab)}
                  className="btn btn-primary"
                >
                  <span>Inspect Full Plan</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </article>
      </div>

      <AnimatePresence>
        {modalLab && (
          <Suspense fallback={null}>
            <LabModal key={modalLab.id} lab={modalLab} onClose={() => setModalLab(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  )
}
