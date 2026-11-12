import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import { site } from '../data/site'
import { SPRING_CRIT, SPRING_SNAP, VIEWPORT_ONCE, revealUp, revealCard } from '../utils/motion'

const DEFAULT_ROADMAP = [
  {
    name: 'Linux & Homelab Administration',
    issuer: 'Independent Study',
    status: 'In Progress',
    date: 'Active Track',
    focus: 'EndeavourOS / Arch Linux administration, UFW perimeter hardening, and Bash automation.',
  },
  {
    name: 'Cisco Certified Network Associate (CCNA 200-301)',
    issuer: 'Cisco',
    status: 'Planned',
    date: 'Target 2026–2027',
    focus: 'OSPF routing, VLAN switching, IP services, and enterprise network access security.',
  },
  {
    name: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    status: 'Planned',
    date: 'Target 2026–2027',
    focus: 'Threat landscape, vulnerability defense, security architecture, and operations.',
  },
]

const STATUS = {
  Completed: { label: 'Completed', cls: 'border-kelp/50 bg-kelp/10 text-kelp' },
  Selesai: { label: 'Completed', cls: 'border-kelp/50 bg-kelp/10 text-kelp' },
  'In Progress': { label: 'In Progress', cls: 'border-aqua/60 bg-aqua/12 text-aqua' },
  Planned: { label: 'Planned', cls: 'border-mist/30 bg-white/5 text-mist' },
}

export default function Certifications() {
  const active = (site.certifications || []).filter((cert) => {
    const name = cert.name || cert.nama
    return Boolean(name && name.trim() !== '' && !name.includes('[ISI'))
  })

  const hasCv = Boolean(site.cvUrl && site.cvUrl.trim() !== '' && !site.cvUrl.includes('[ISI'))
  const list = active.length > 0 ? active : DEFAULT_ROADMAP

  const featuredIndex = list.findIndex((i) => i.status === 'In Progress')
  const featured = featuredIndex >= 0 ? list[featuredIndex] : list[0]
  const remaining = list.filter((_, idx) => idx !== (featuredIndex >= 0 ? featuredIndex : 0))

  const featuredStatus = STATUS[featured.status] || STATUS.Planned

  return (
    <section id="certifications" className="relative mx-auto max-w-7xl px-5 pt-6 pb-20 sm:px-8 sm:pt-8 sm:pb-24">
      <motion.div
        className="mb-8 flex flex-col justify-between gap-6 border-b border-aqua/15 pb-6 sm:mb-9 sm:flex-row sm:items-end sm:pb-7"
        initial={revealUp.initial}
        whileInView={revealUp.animate}
        viewport={VIEWPORT_ONCE}
        transition={SPRING_CRIT}
      >
        <div className="max-w-2xl">
          <p className="eyebrow">03 // Certification Track</p>
          <h2 className="section-title on-water mt-4">
            Upcoming <em className="italic text-aqua">milestones</em>
          </h2>
          <p className="lede on-water mt-4">
            Structured certification roadmap guiding hands-on lab progression and security fundamentals.
          </p>
        </div>

        {hasCv && (
          <a href={site.cvUrl} download="CV_Hafidz.pdf" className="btn btn-ghost shrink-0">
            <Download size={16} aria-hidden="true" />
            <span>Download CV (PDF)</span>
          </a>
        )}
      </motion.div>

      {/* Asymmetric 5 : 7 Expedition Layout */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <motion.article
          initial={revealCard.initial}
          whileInView={revealCard.animate}
          viewport={VIEWPORT_ONCE}
          transition={SPRING_CRIT}
          className="specimen-panel reticle flex flex-col justify-between border-t-2 border-t-aqua p-6 sm:p-8 lg:col-span-5"
        >
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-aqua/15 pb-4 font-mono text-xs">
              <span className="text-aqua">PRIMARY TRACK // 01</span>
              <span className={`rounded-[2px] border px-2 py-0.5 text-[0.6875rem] font-medium ${featuredStatus.cls}`}>
                {featuredStatus.label}
              </span>
            </div>

            <p className="mt-5 font-mono text-xs text-sand uppercase">{featured.issuer}</p>
            <h3 className="mt-2 text-3xl leading-tight text-white sm:text-4xl">{featured.name}</h3>

            {featured.focus && <p className="mt-4 leading-relaxed text-mist">{featured.focus}</p>}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-aqua/15 pt-4 font-mono text-xs text-mist">
            <span>Timeline</span>
            <span className="text-foam">{featured.date || 'Active'}</span>
          </div>
        </motion.article>

        <motion.div
          initial={revealCard.initial}
          whileInView={revealCard.animate}
          viewport={VIEWPORT_ONCE}
          transition={{ ...SPRING_CRIT, delay: 0.08 }}
          className="specimen-panel divide-y divide-aqua/15 lg:col-span-7"
        >
          <div className="flex items-center justify-between px-6 py-3.5 font-mono text-[0.6875rem] tracking-widest text-mist uppercase">
            <span>Certification Queue</span>
            <span className="text-aqua">0{remaining.length} Milestones</span>
          </div>

          {remaining.map((item, idx) => {
            const name = item.name || item.nama
            const issuer = item.issuer || item.penerbit
            const s = STATUS[item.status] || STATUS.Planned
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, transform: 'translateX(-10px)' }}
                whileInView={{ opacity: 1, transform: 'translateX(0px)' }}
                viewport={VIEWPORT_ONCE}
                transition={{ ...SPRING_SNAP, delay: 0.1 + idx * 0.07 }}
                className="flex flex-col justify-between gap-4 p-6 transition-colors hover:bg-aqua/[0.03] sm:flex-row sm:items-start"
              >
                <div className="max-w-lg">
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                    <span className="text-aqua">TARGET // 0{idx + 2}</span>
                    {issuer && (
                      <>
                        <span className="text-aqua/30" aria-hidden="true">/</span>
                        <span className="text-sand uppercase">{issuer}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-2 text-2xl leading-snug text-white">{name}</h3>
                  {item.focus && <p className="mt-2 text-sm leading-relaxed text-mist">{item.focus}</p>}
                </div>

                <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
                  <span className={`rounded-[2px] border px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium ${s.cls}`}>
                    {s.label}
                  </span>
                  {item.date && <span className="font-mono text-xs text-mist">{item.date}</span>}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
