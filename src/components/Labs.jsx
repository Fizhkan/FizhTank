import { useState, lazy, Suspense } from 'react'
import { ArrowUpRight, Network, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { playWaterBubble } from '../utils/audio'

const LabModal = lazy(() => import('./LabModal'))

const STATUS_LABEL = {
  planned: 'Direncanakan',
  'in-progress': 'Sedang dikerjakan',
  complete: 'Selesai',
}

const LAB_ICONS = { 1: Network, 2: ShieldCheck, 3: Cpu }

// Diagram rancangan tiap lab. Semuanya rencana, bukan hasil pengujian.
function Diagram({ labId }) {
  if (labId === 1) {
    return (
      <div className="glass-inset p-4 sm:p-5">
        <p className="text-sm text-mist">Rancangan topologi</p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-aqua/50 bg-aqua/10 px-4 py-2 text-[0.9375rem] font-medium text-white">
            <Network size={16} className="text-aqua" aria-hidden="true" />
            Core L3 switch (SVI)
          </div>
          <div className="relative h-5 w-px bg-aqua/50" aria-hidden="true" />
          <p className="-mt-1 text-xs text-mist">trunk 802.1Q</p>
          <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
            {[
              ['VLAN 10', 'IT', '192.168.10.0/24'],
              ['VLAN 20', 'HR', '192.168.20.0/24'],
              ['VLAN 30', 'Finance', '192.168.30.0/24'],
            ].map(([vlan, name, net]) => (
              <div key={vlan} className="rounded-lg border border-white/15 bg-white/5 p-2.5 text-center">
                <p className="text-sm font-semibold text-white">{vlan}</p>
                <p className="text-sm text-mist">{name}</p>
                <p className="mt-1 font-mono text-[0.6875rem] text-mist/80 sm:text-xs">{net}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 border-t border-white/10 pt-3 text-sm text-mist">
          Rencana ACL: akses dari VLAN 20 (HR) ke VLAN 30 (Finance) diblokir.
        </p>
      </div>
    )
  }

  if (labId === 2) {
    return (
      <div className="glass-inset p-4 sm:p-5">
        <p className="text-sm text-mist">Yang akan diamati di Wireshark</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-coral/40 bg-coral/10 p-3">
            <p className="font-semibold text-white">HTTP dan FTP (plaintext)</p>
            <p className="mt-0.5 text-[0.9375rem] text-mist">Username dan password diperkirakan terbaca di payload.</p>
          </div>
          <div className="rounded-lg border border-kelp/40 bg-kelp/10 p-3">
            <p className="font-semibold text-white">HTTPS (TLS 1.3)</p>
            <p className="mt-0.5 text-[0.9375rem] text-mist">Payload setelah handshake diperkirakan hanya terlihat sebagai data terenkripsi.</p>
          </div>
        </div>
        <p className="mt-4 border-t border-white/10 pt-3 text-sm text-mist">
          Filter yang akan dipakai: <code className="font-mono text-aqua">tcp.port == 443 || http</code>
        </p>
      </div>
    )
  }

  return (
    <div className="glass-inset p-4 sm:p-5">
      <p className="text-sm text-mist">Rancangan gateway homelab</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/15 bg-white/5 p-3">
          <p className="font-semibold text-white">Firewall UFW</p>
          <p className="mt-0.5 text-[0.9375rem] text-mist">Deny incoming, allow outgoing. SSH hanya dengan key-pair.</p>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/5 p-3">
          <p className="font-semibold text-white">Pi-hole</p>
          <p className="mt-0.5 text-[0.9375rem] text-mist">DNS lokal di port 53 untuk memblokir domain iklan.</p>
        </div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-sm text-mist">
        Target pengecekan: Nmap dari mesin lain tidak menemukan port terbuka yang tidak diperlukan.
      </p>
    </div>
  )
}

export default function Labs() {
  const [activeLabId, setActiveLabId] = useState(1)
  const [modalLab, setModalLab] = useState(null)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.08 })

  const currentLab = labsData.find((l) => l.id === activeLabId) || labsData[0]

  const reveal = (visible, offset = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="labs" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div ref={headerRef} className="mb-12 max-w-2xl transition-all duration-700" style={reveal(headerVisible)}>
        <p className="eyebrow">Lab</p>
        <h2 className="section-title on-water mt-4">Lab yang sedang saya rancang</h2>
        <p className="lede on-water mt-4">
          Ketiga lab ini belum saya kerjakan. Di sini ada tujuan, rencana topologi, dan langkah-langkahnya.
          Write-up lengkap menyusul setelah labnya selesai.
        </p>
      </div>

      <div
        ref={contentRef}
        className="grid grid-cols-1 items-start gap-6 transition-all duration-700 lg:grid-cols-12"
        style={reveal(contentVisible, 28)}
      >
        <article className="glass p-6 sm:p-8 lg:col-span-7" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">Lab 0{currentLab.id}</span>
            <span className="chip">{currentLab.category}</span>
            <span className="chip border-aqua/40 text-aqua">{STATUS_LABEL[currentLab.status] || currentLab.status}</span>
          </div>

          <h3 className="mt-5 text-3xl text-white sm:text-4xl">{currentLab.title}</h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-mist">{currentLab.description}</p>

          <div className="mt-6">
            <Diagram labId={currentLab.id} />
          </div>

          <div className="mt-6">
            <h4 className="text-lg text-white">Tujuan</h4>
            <p className="mt-1.5 leading-relaxed text-mist">{currentLab.writeup.objective}</p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg text-white">Langkah awal</h4>
            <ol className="mt-3 space-y-2.5">
              {currentLab.writeup.plannedSteps.slice(0, 3).map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-mist">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-aqua/50 text-xs font-semibold text-aqua">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <ul className="flex flex-wrap gap-2">
              {currentLab.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                playWaterBubble()
                setModalLab(currentLab)
              }}
              className="btn btn-primary"
            >
              <span>Lihat semua langkah</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </article>

        <div className="flex flex-col gap-3 lg:col-span-5">
          <p className="px-1 text-sm text-mist">Pilih lab ({labsData.length})</p>

          {labsData.map((lab) => {
            const selected = lab.id === activeLabId
            const Icon = LAB_ICONS[lab.id] || Cpu
            return (
              <button
                key={lab.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  playWaterBubble()
                  setActiveLabId(lab.id)
                }}
                className={`glass group w-full p-5 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.99] ${
                  selected ? 'border-aqua/70! bg-water/90!' : 'hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      selected ? 'bg-aqua text-deep' : 'border border-white/20 text-aqua'
                    }`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-mist">
                      Lab 0{lab.id} · {lab.category}
                    </span>
                    <span className="mt-0.5 block font-display text-xl leading-snug font-semibold text-white">
                      {lab.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-[0.9375rem] leading-relaxed text-mist">
                      {lab.description}
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className={`mt-1 shrink-0 transition-transform ${selected ? 'text-aqua' : 'text-mist/60 group-hover:translate-x-0.5'}`}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {modalLab && (
        <Suspense fallback={null}>
          <LabModal lab={modalLab} onClose={() => setModalLab(null)} />
        </Suspense>
      )}
    </section>
  )
}
