import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Activity,
  Shield,
  Network,
  Globe,
  Database,
  Monitor,
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { toolsData } from '../data/skillsData'
import { site } from '../data/site'

// Topologi homelab yang direncanakan. Alamat hanya contoh rancangan, bukan perangkat yang sedang berjalan.
const NODES = [
  { id: 'wan', label: 'Internet', x: 50, y: 11, icon: Globe, role: 'Jalur keluar ke ISP', addr: 'DHCP dari ISP', note: 'Semua traffic masuk dan keluar melewati titik ini lebih dulu.' },
  { id: 'fw', label: 'Gateway Arch Linux', x: 50, y: 32, icon: Shield, role: 'Firewall UFW / iptables', addr: '10.0.0.1', note: 'Kebijakan default deny untuk traffic masuk. Dirancang di Lab 03.', lab: 3 },
  { id: 'core', label: 'Core L3 Switch', x: 50, y: 54, icon: Network, role: 'Inter-VLAN routing (SVI)', addr: '192.168.10.1, .20.1, .30.1', note: 'Merutekan antar VLAN dan menjalankan ACL antar departemen. Dirancang di Lab 01.', lab: 1 },
  { id: 'tap', label: 'Wireshark tap', x: 16, y: 54, icon: Activity, role: 'Pengamat paket', addr: 'mode promiscuous', note: 'Tempat mengamati traffic HTTP dan HTTPS. Dipakai di Lab 02.', lab: 2 },
  { id: 'dns', label: 'Pi-hole', x: 84, y: 54, icon: Database, role: 'DNS resolver lokal', addr: '192.168.20.53', note: 'Memblokir domain iklan di level DNS. Bagian dari Lab 03.', lab: 3 },
  { id: 'v10', label: 'VLAN 10 IT', x: 20, y: 83, icon: Monitor, role: 'Segmen departemen IT', addr: '192.168.10.0/24', note: 'Segmen untuk perangkat tim IT.', lab: 1 },
  { id: 'v20', label: 'VLAN 20 HR', x: 50, y: 83, icon: Monitor, role: 'Segmen departemen HR', addr: '192.168.20.0/24', note: 'Akses ke VLAN Finance rencananya diblokir dengan Extended ACL.', lab: 1 },
  { id: 'v30', label: 'VLAN 30 Finance', x: 80, y: 83, icon: Monitor, role: 'Segmen departemen Finance', addr: '192.168.30.0/24', note: 'Segmen yang dilindungi ACL dari VLAN lain.', lab: 1 },
]

const LINKS = [
  ['wan', 'fw'],
  ['fw', 'core'],
  ['core', 'tap'],
  ['core', 'dns'],
  ['core', 'v10'],
  ['core', 'v20'],
  ['core', 'v30'],
]

const usedTools = toolsData.filter((t) => t.used).map((t) => t.label)

export default function Hero() {
  const [selectedId, setSelectedId] = useState('core')
  const [avatarOk, setAvatarOk] = useState(false)
  const [benchRef, benchVisible] = useScrollReveal({ threshold: 0.08 })

  // Foto hanya ditampilkan jika file-nya ada; jika tidak, kartu menampilkan inisial
  useEffect(() => {
    if (!site.avatarUrl) return
    const probe = new Image()
    probe.onload = () => setAvatarOk(true)
    probe.src = site.avatarUrl
  }, [])

  const selected = NODES.find((n) => n.id === selectedId) || NODES[0]
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

  const reveal = (visible, offset = 20) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: 'opacity 550ms cubic-bezier(0.23, 1, 0.32, 1), transform 550ms cubic-bezier(0.23, 1, 0.32, 1)',
  })

  return (
    <section id="hero" className="relative mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40">
      <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
        {/* Editorial Typography Lead — Dibuka lapang di atas air */}
        <div className="lg:col-span-8">
          <p className="eyebrow hero-stagger" style={{ '--stagger': 0 }}>
            Log 00 // Permukaan — Surabaya, Indonesia
          </p>

          <h1
            className="on-water hero-stagger mt-5 font-display text-[3.15rem] leading-[0.98] tracking-[-0.025em] text-white sm:text-[4.5rem] lg:text-[5.5rem]"
            style={{ '--stagger': 1 }}
          >
            Belajar membangun <em className="italic text-aqua">&amp; mengamankan</em> jaringan.
          </h1>

          <p className="lede on-water hero-stagger mt-7 max-w-xl text-[1.0625rem]" style={{ '--stagger': 2 }}>
            Halo, saya <strong className="font-semibold text-white">Siraj</strong>, mahasiswa D3 Teknik Informatika.
            Situs ini berisi catatan lab jaringan, keamanan, dan Linux—dengan latar akuarium interaktif: klik area
            air yang kosong untuk memberi makan ikan.
          </p>

          <div className="hero-stagger mt-9 flex flex-wrap items-center gap-3" style={{ '--stagger': 3 }}>
            <a href="#labs" className="btn btn-primary">
              <span>Lihat rencana lab</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi saya
            </a>
          </div>

          <div className="hero-stagger mt-10 border-t border-aqua/15 pt-5" style={{ '--stagger': 4 }}>
            <p className="mb-2.5 font-mono text-[0.6875rem] tracking-widest text-mist/85 uppercase">
              Perangkat yang sedang dipelajari
            </p>
            <ul className="flex flex-wrap gap-2">
              {usedTools.map((tool) => (
                <li key={tool} className="chip">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Field Specimen Dossier */}
        <div className="hero-stagger flex justify-start lg:col-span-4 lg:justify-end" style={{ '--stagger': 3 }}>
          <figure className="specimen-panel reticle w-full max-w-[20rem] overflow-hidden">
            <div className="flex items-center justify-between border-b border-aqua/15 px-3.5 py-2 font-mono text-[0.6875rem] tracking-wider">
              <span className="text-aqua">SPECIMEN // 001</span>
              <span className="flex items-center gap-1.5 text-kelp">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kelp opacity-65" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-kelp" />
                </span>
                AKTIF
              </span>
            </div>

            <div className="p-3">
              <div className={`relative overflow-hidden border border-aqua/15 bg-lagoon ${avatarOk ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
                {avatarOk ? (
                  <img
                    src={site.avatarUrl}
                    alt="Foto Siraj"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#0d5f70,#063342_62%,#021822)]">
                    <span className="font-display text-[5rem] leading-none text-white/90 italic" aria-hidden="true">
                      S
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/65 via-transparent to-transparent" />
              </div>
            </div>

            <figcaption className="divide-y divide-aqua/12 border-t border-aqua/15 font-mono text-xs">
              <div className="flex items-baseline justify-between gap-2 px-3.5 py-2.5">
                <span className="text-[0.6875rem] text-mist/75 uppercase">Subjek</span>
                <span className="font-sans text-sm font-semibold text-white">Hafidz Sirajuddin</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 px-3.5 py-2.5">
                <span className="text-[0.6875rem] text-mist/75 uppercase">Studi</span>
                <span className="font-sans text-xs text-foam">{site.subtitle}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 px-3.5 py-2.5">
                <span className="text-[0.6875rem] text-mist/75 uppercase">Lokasi</span>
                <span className="text-xs text-sand">{site.location}</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Arsitektur Topologi Homelab yang Direncanakan */}
      <div ref={benchRef} className="mt-20 sm:mt-24" style={reveal(benchVisible, 24)}>
        <div className="specimen-panel reticle overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aqua/15 px-5 py-4 sm:px-7">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-widest text-aqua uppercase">
                Arsitektur // Topologi Interaktif
              </p>
              <h2 className="mt-0.5 text-3xl text-white">Rancangan homelab</h2>
            </div>
            <p className="font-mono text-xs text-mist">Pilih perangkat pada diagram untuk melihat perannya</p>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 p-5 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="specimen-inset relative mx-auto aspect-[4/3] w-full max-w-[34rem]">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  {LINKS.map(([a, b]) => {
                    const from = byId[a]
                    const to = byId[b]
                    const hot = selectedId === a || selectedId === b
                    return (
                      <g key={`${a}-${b}`}>
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={hot ? 'rgba(94, 234, 212, 0.32)' : 'rgba(165, 205, 210, 0.28)'}
                          strokeWidth={hot ? 0.75 : 0.45}
                          vectorEffect="non-scaling-stroke"
                          strokeDasharray={hot ? undefined : '3 3'}
                        />
                        {hot && (
                          <line
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            stroke="#5eead4"
                            strokeWidth={1.15}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            strokeDasharray="4 8"
                            className="packet-flow"
                          />
                        )}
                      </g>
                    )
                  })}
                </svg>

                {NODES.map((node) => {
                  const Icon = node.icon
                  const active = node.id === selectedId
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      aria-pressed={active}
                      aria-label={node.label}
                      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <span
                        className={`relative flex h-10 w-10 items-center justify-center rounded-[2px] border transition-transform duration-100 active:scale-[0.95] sm:h-11 sm:w-11 ${
                          active
                            ? 'border-aqua text-deep'
                            : 'border-aqua/30 bg-water text-aqua group-hover:border-aqua'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="topology-node-bg"
                            transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
                            className="absolute inset-0 -z-0 bg-aqua"
                            aria-hidden="true"
                          />
                        )}
                        <Icon size={18} className="relative z-10" aria-hidden="true" />
                      </span>
                      <span
                        className={`hidden whitespace-nowrap font-mono text-[0.6875rem] leading-none sm:block ${
                          active ? 'font-semibold text-white' : 'text-mist'
                        }`}
                      >
                        {node.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-5" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, transform: 'translateY(6px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(-4px)' }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
                  className="specimen-inset divide-y divide-aqua/12"
                >
                  <div className="p-5">
                    <p className="font-mono text-[0.6875rem] tracking-wider text-aqua uppercase">
                      Spesifikasi Node
                    </p>
                    <h3 className="mt-1.5 text-3xl text-white">{selected.label}</h3>
                  </div>

                  <dl className="divide-y divide-aqua/10 text-sm">
                    <div className="flex flex-col gap-1 px-5 py-3">
                      <dt className="font-mono text-[0.6875rem] text-mist/80 uppercase">Peran</dt>
                      <dd className="text-white">{selected.role}</dd>
                    </div>
                    <div className="flex flex-col gap-1 px-5 py-3">
                      <dt className="font-mono text-[0.6875rem] text-mist/80 uppercase">Alamat contoh</dt>
                      <dd className="kbd-line text-sand">{selected.addr}</dd>
                    </div>
                  </dl>

                  <div className="p-5">
                    <p className="text-[0.9375rem] leading-relaxed text-mist">{selected.note}</p>
                    {selected.lab && (
                      <a
                        href="#labs"
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-aqua hover:text-white"
                      >
                        <span>Lihat Lab 0{selected.lab}</span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <p className="mt-3 px-1 font-mono text-xs text-mist/80">
                * Semua perangkat di diagram ini masih rancangan lab, belum berjalan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
