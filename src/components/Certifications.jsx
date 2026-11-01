import { Download } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { site } from '../data/site'

const DEFAULT_ROADMAP = [
  {
    name: 'Cisco Certified Network Associate (CCNA 200-301)',
    issuer: 'Cisco',
    status: 'Planned',
    focus: 'Routing OSPF, VLAN switching, IP services, dan keamanan akses jaringan.',
  },
  {
    name: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    status: 'Planned',
    focus: 'Konsep keamanan umum, ancaman dan kerentanan, serta arsitektur dan operasi keamanan.',
  },
  {
    name: 'Administrasi Linux dan homelab',
    issuer: 'Belajar mandiri',
    status: 'In Progress',
    focus: 'Administrasi EndeavourOS / Arch Linux, firewall UFW, dan otomasi dengan bash.',
  },
]

const STATUS = {
  Completed: { label: 'Selesai', cls: 'border-kelp/50 bg-kelp/10 text-kelp' },
  Selesai: { label: 'Selesai', cls: 'border-kelp/50 bg-kelp/10 text-kelp' },
  'In Progress': { label: 'Sedang berjalan', cls: 'border-aqua/50 bg-aqua/10 text-aqua' },
  Planned: { label: 'Direncanakan', cls: 'border-white/25 bg-white/5 text-mist' },
}

export default function Certifications() {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [listRef, listVisible] = useScrollReveal({ threshold: 0.08 })

  const active = (site.certifications || []).filter((cert) => {
    const name = cert.name || cert.nama
    return Boolean(name && name.trim() !== '' && !name.includes('[ISI'))
  })

  const hasCv = Boolean(site.cvUrl && site.cvUrl.trim() !== '' && !site.cvUrl.includes('[ISI'))
  const list = active.length > 0 ? active : DEFAULT_ROADMAP

  const reveal = (visible, offset = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="certifications" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div
        ref={headerRef}
        className="mb-12 flex flex-col justify-between gap-6 transition-all duration-700 sm:flex-row sm:items-end"
        style={reveal(headerVisible)}
      >
        <div className="max-w-2xl">
          <p className="eyebrow">Sertifikasi</p>
          <h2 className="section-title on-water mt-4">Target belajar berikutnya</h2>
          <p className="lede on-water mt-4">
            Belum ada sertifikat yang saya pegang. Ini daftar yang sedang saya tuju, supaya arah belajarnya jelas.
          </p>
        </div>

        {hasCv && (
          <a href={site.cvUrl} download="CV_Siraj.pdf" className="btn btn-ghost shrink-0">
            <Download size={16} aria-hidden="true" />
            <span>Unduh CV (PDF)</span>
          </a>
        )}
      </div>

      <ul
        ref={listRef}
        className="grid gap-5 transition-all duration-700 md:grid-cols-3"
        style={reveal(listVisible, 28)}
      >
        {list.map((item, idx) => {
          const status = STATUS[item.status] || STATUS.Planned
          return (
            <li key={item.name} className="glass flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-mist">{item.issuer}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.cls}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl leading-snug text-white">{item.name}</h3>

                {item.focus && <p className="mt-3 leading-relaxed text-mist">{item.focus}</p>}
              </div>

              <p className="mt-6 border-t border-white/10 pt-4 text-sm text-mist">
                {item.date || (idx < 2 ? 'Target 2026/2027' : 'Berjalan sekarang')}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
