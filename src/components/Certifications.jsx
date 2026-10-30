import { Download } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { site } from '../data/site'

const DEFAULT_ROADMAP = [
  {
    name: 'Cisco Certified Network Associate (CCNA 200-301)',
    issuer: 'Cisco Systems',
    status: 'Planned',
    focus: 'Routing protocols (OSPF), VLAN switching, IP services, and network access security',
  },
  {
    name: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    status: 'Planned',
    focus: 'General security concepts, threats, vulnerabilities, and security architecture operations',
  },
  {
    name: 'Linux Professional & Homelab Administration',
    issuer: 'Self-Directed / Linux Foundation',
    status: 'In Progress',
    focus: 'EndeavourOS / Arch Linux administration, UFW firewalling, bash automation',
  },
]

export default function Certifications() {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [timelineRef, timelineVisible] = useScrollReveal({ threshold: 0.1 })

  // Active certs from site.js (filter out blank placeholders)
  const activeCertifications = (site.certifications || []).filter((cert) => {
    const name = cert.name || cert.nama
    return Boolean(name && name.trim() !== '' && !name.includes('[ISI'))
  })

  const hasCv = Boolean(site.cvUrl && site.cvUrl.trim() !== '' && !site.cvUrl.includes('[ISI'))

  const displayList = activeCertifications.length > 0 ? activeCertifications : DEFAULT_ROADMAP

  return (
    <section id="certifications" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div
        ref={headerRef}
        className="mb-14 sm:mb-18 transition-all duration-700"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 flex items-center gap-2">
          <span>// 004</span>
          <span className="w-8 h-px bg-cyan-500/40" />
          <span>Exploration Log &amp; Qualifications</span>
        </p>

        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] leading-tight text-white font-display uppercase">
              Certifications &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
                Learning Roadmap.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3">
            <p className="text-slate-400 text-sm leading-relaxed font-normal">
              Continuous learning roadmap — komitmen penguasaan standar industri formal dan verifikasi kompetensi jaringan.
            </p>

            {hasCv && (
              <a
                href={site.cvUrl}
                download="CV_Siraj.pdf"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                <Download size={14} />
                <span>Download CV Dossier (PDF)</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div
        ref={timelineRef}
        className="grid md:grid-cols-3 gap-6 transition-all duration-700"
        style={{
          opacity: timelineVisible ? 1 : 0,
          transform: timelineVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        {displayList.map((item, idx) => {
          const isComplete = item.status === 'Completed' || item.status === 'Selesai'
          const isInProgress = item.status === 'In Progress'

          return (
            <div
              key={idx}
              className="rounded-2xl apple-glass p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/30"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
                  <span className="text-slate-400">0{idx + 1} // TRACK</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                      isComplete
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isInProgress
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : 'bg-white/[0.04] text-slate-300 border-white/10'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="text-[11px] font-mono text-cyan-400/80 block uppercase tracking-wider mb-1">
                    {item.issuer}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-snug">
                    {item.name}
                  </h3>
                </div>

                {item.focus && (
                  <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {item.focus}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-500">
                <span>{item.date || 'Target 2026/2027'}</span>
                <span className="text-cyan-400/60">ROADMAP VERIFIED</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
