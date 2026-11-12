import { useState, useRef, useEffect } from 'react'
import {
  ArrowUpRight,
  Fish,
  Terminal as TerminalIcon,
  Activity,
  Shield,
  Network,
  Globe,
  Database,
  Monitor,
  Calculator,
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { skillGroups, toolsData } from '../data/skillsData'
import { site } from '../data/site'
import { calculateSubnet } from '../utils/subnetCalculator'
import { playWaterBubble } from '../utils/audio'

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

const TABS = [
  { id: 'topology', num: '01', label: 'Topologi', icon: Network },
  { id: 'subnet', num: '02', label: 'Kalkulator subnet', icon: Calculator },
  { id: 'cli', num: '03', label: 'Terminal', icon: TerminalIcon },
]

const PRESETS = ['192.168.10.0/24', '192.168.20.0/26', '10.0.0.0/27', '172.16.0.0/29']

const usedTools = toolsData.filter((t) => t.used).map((t) => t.label)

export default function Hero() {
  const [activeTab, setActiveTab] = useState('topology')
  const [selectedId, setSelectedId] = useState('core')
  const [subnetInput, setSubnetInput] = useState('192.168.10.0/26')
  const [subnetResult, setSubnetResult] = useState(() => calculateSubnet('192.168.10.0/26'))
  const [avatarOk, setAvatarOk] = useState(false)

  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: 'Terminal FizhTank. Ketik help untuk melihat perintah.' },
  ])
  const [cliInput, setCliInput] = useState('')
  const terminalBodyRef = useRef(null)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [benchRef, benchVisible] = useScrollReveal({ threshold: 0.08 })

  // Foto hanya ditampilkan jika file-nya ada; jika tidak, kartu menampilkan inisial
  useEffect(() => {
    if (!site.avatarUrl) return
    const probe = new Image()
    probe.onload = () => setAvatarOk(true)
    probe.src = site.avatarUrl
  }, [])

  useEffect(() => {
    if (activeTab === 'cli' && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalHistory, activeTab])

  const selected = NODES.find((n) => n.id === selectedId) || NODES[0]
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

  const handleCalculateSubnet = (value) => {
    setSubnetInput(value)
    setSubnetResult(calculateSubnet(value))
  }

  const handleFeed = () => window.dispatchEvent(new CustomEvent('fizhtank-feed'))

  const handleRunCommand = (e) => {
    e.preventDefault()
    const trimmed = cliInput.trim()
    if (!trimmed) return

    const lower = trimmed.toLowerCase()
    const next = [...terminalHistory, { type: 'cmd', text: trimmed }]

    if (lower === 'help') {
      next.push({
        type: 'out',
        text: [
          'whoami          profil singkat',
          'labs            daftar lab yang direncanakan',
          'skills          ringkasan skill dan levelnya',
          'subnet <ip/n>   hitung subnet, contoh: subnet 10.0.0.0/24',
          'contact         cara menghubungi saya',
          'feed            beri makan ikan di tank',
          'clear           bersihkan layar',
        ].join('\n'),
      })
    } else if (lower === 'whoami') {
      next.push({
        type: 'out',
        text: `Hafidz Sirajuddin (Siraj)\n${site.subtitle}\n${site.jobTitle}\n${site.location}`,
      })
    } else if (lower === 'labs') {
      next.push({
        type: 'out',
        text: labsData.map((l) => `${String(l.id).padStart(2, '0')}  ${l.title}  [${l.status}]`).join('\n'),
      })
    } else if (lower === 'skills') {
      next.push({
        type: 'out',
        text: skillGroups
          .map((g) => `${g.label}\n${g.skills.map((s) => `  - ${s.name} (${s.level})`).join('\n')}`)
          .join('\n\n'),
      })
    } else if (lower === 'contact') {
      next.push({ type: 'out', text: `Email   ${site.email}\nGitHub  github.com/Fizhkan` })
    } else if (lower.startsWith('subnet')) {
      const arg = trimmed.split(/\s+/)[1]
      if (!arg) {
        next.push({ type: 'err', text: 'Pemakaian: subnet <ip/cidr>, contoh: subnet 192.168.1.0/26' })
      } else {
        const res = calculateSubnet(arg)
        if (res.error) {
          next.push({ type: 'err', text: res.error })
        } else {
          next.push({
            type: 'out',
            text: `Network    ${res.network}${res.cidr}\nNetmask    ${res.netmask}\nBroadcast  ${res.broadcast}\nHost       ${res.usableRange} (${res.totalUsable} host)`,
          })
          setSubnetInput(arg)
          setSubnetResult(res)
        }
      }
    } else if (lower === 'feed') {
      handleFeed()
      next.push({ type: 'sys', text: 'Makanan dijatuhkan ke tank. Lihat ikan-ikan mengejarnya.' })
    } else if (lower === 'clear') {
      setTerminalHistory([])
      setCliInput('')
      return
    } else {
      next.push({ type: 'err', text: `Perintah tidak dikenal: ${trimmed}. Ketik help untuk daftar perintah.` })
    }

    setTerminalHistory(next)
    setCliInput('')
  }

  const reveal = (visible, offset = 20) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: 'opacity 550ms cubic-bezier(0.23, 1, 0.32, 1), transform 550ms cubic-bezier(0.23, 1, 0.32, 1)',
  })

  return (
    <section id="hero" className="relative mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40">
      <div
        ref={headerRef}
        className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12"
        style={reveal(headerVisible)}
      >
        {/* Editorial Typography Lead — Dibuka lapang di atas air */}
        <div className="lg:col-span-8">
          <p className="eyebrow">Log 00 // Permukaan — Surabaya, Indonesia</p>

          <h1 className="on-water mt-5 font-display text-[3.15rem] leading-[0.98] tracking-[-0.025em] text-white sm:text-[4.5rem] lg:text-[5.5rem]">
            Belajar membangun <em className="italic text-aqua">&amp; mengamankan</em> jaringan.
          </h1>

          <p className="lede on-water mt-7 max-w-xl text-[1.0625rem]">
            Halo, saya <strong className="font-semibold text-white">Siraj</strong>, mahasiswa D3 Teknik Informatika.
            Situs ini adalah catatan lab jaringan, keamanan, dan Linux—dirancang seperti jendela observasi akuarium:
            klik area air yang kosong untuk memberi makan ikan.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#labs" className="btn btn-primary">
              <span>Lihat rencana lab</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi saya
            </a>
            <button type="button" onClick={handleFeed} className="btn btn-ghost">
              <Fish size={16} className="text-coral-text" aria-hidden="true" />
              <span>Beri makan ikan</span>
            </button>
          </div>

          <div className="mt-10 border-t border-aqua/15 pt-5">
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

        {/* Field Specimen Dossier — Menggantikan kartu foto bulat generik */}
        <div className="flex justify-start lg:col-span-4 lg:justify-end">
          <figure className="specimen-panel reticle w-full max-w-[20rem] overflow-hidden">
            <div className="flex items-center justify-between border-b border-aqua/15 px-3.5 py-2 font-mono text-[0.6875rem] tracking-wider">
              <span className="text-aqua">SPECIMEN // 001</span>
              <span className="flex items-center gap-1.5 text-kelp">
                <span className="h-1.5 w-1.5 rounded-full bg-kelp" aria-hidden="true" />
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

      {/* Konsol Meja Kerja — Hairline Instrumentation Frame */}
      <div ref={benchRef} className="mt-20 sm:mt-24" style={reveal(benchVisible, 24)}>
        <div className="specimen-panel reticle overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-aqua/15 px-5 py-4 sm:px-7">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-widest text-aqua uppercase">
                Bench // Modul Interaktif
              </p>
              <h2 className="mt-0.5 text-3xl text-white">Meja kerja</h2>
            </div>

            <div role="tablist" aria-label="Alat di meja kerja" className="flex flex-wrap border border-aqua/20 bg-deep/60">
              {TABS.map((tab, i) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      playWaterBubble()
                      setActiveTab(tab.id)
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors duration-150 active:scale-[0.98] ${
                      i > 0 ? 'border-l border-aqua/15' : ''
                    } ${
                      active ? 'bg-aqua text-deep font-semibold' : 'text-mist hover:bg-aqua/10 hover:text-white'
                    }`}
                  >
                    <span className={`font-mono text-[0.6875rem] ${active ? 'text-deep/75' : 'text-aqua/75'}`}>
                      {tab.num}
                    </span>
                    <Icon size={14} aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {activeTab === 'topology' && (
            <div role="tabpanel" className="grid grid-cols-1 items-center gap-8 p-5 sm:p-8 lg:grid-cols-12">
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
                        <line
                          key={`${a}-${b}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={hot ? '#5eead4' : 'rgba(165, 205, 210, 0.35)'}
                          strokeWidth={hot ? 0.8 : 0.5}
                          vectorEffect="non-scaling-stroke"
                          strokeDasharray={hot ? undefined : '3 3'}
                        />
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
                        onClick={() => {
                          playWaterBubble()
                          setSelectedId(node.id)
                        }}
                        aria-pressed={active}
                        aria-label={node.label}
                        className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-[2px] border transition-transform duration-150 active:scale-[0.95] sm:h-11 sm:w-11 ${
                            active
                              ? 'scale-105 border-aqua bg-aqua text-deep'
                              : 'border-aqua/30 bg-water text-aqua group-hover:border-aqua'
                          }`}
                        >
                          <Icon size={18} aria-hidden="true" />
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

              <div className="lg:col-span-5">
                <div className="specimen-inset divide-y divide-aqua/12" aria-live="polite">
                  <div className="p-5">
                    <p className="font-mono text-[0.6875rem] tracking-wider text-aqua uppercase">
                      Rancangan topologi homelab
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
                </div>

                <p className="mt-3 px-1 font-mono text-xs text-mist/80">
                  * Semua perangkat di diagram ini masih rancangan lab, belum berjalan.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'subnet' && (
            <div role="tabpanel" className="grid grid-cols-1 items-start gap-8 p-5 sm:p-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-[0.9375rem] leading-relaxed text-mist">
                  Hitung blok network, netmask, rentang host, dan broadcast dari alamat IPv4 dengan prefix CIDR.
                </p>

                <label htmlFor="cidr-input" className="label mt-5">
                  Alamat IP dengan prefix
                </label>
                <input
                  id="cidr-input"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={subnetInput}
                  onChange={(e) => handleCalculateSubnet(e.target.value)}
                  placeholder="192.168.10.0/26"
                  className="field font-mono"
                />

                <p className="mt-4 mb-2 font-mono text-[0.6875rem] tracking-wider text-mist uppercase">
                  Contoh cepat
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleCalculateSubnet(preset)}
                      className="chip kbd-line cursor-pointer transition-colors hover:border-aqua/65 hover:text-aqua active:scale-[0.97]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7" aria-live="polite">
                {subnetResult && !subnetResult.error ? (
                  <div className="specimen-inset overflow-hidden">
                    <div className="flex items-center justify-between border-b border-aqua/15 px-5 py-3.5">
                      <span className="kbd-line text-base font-semibold text-white">
                        {subnetResult.network}
                        {subnetResult.cidr}
                      </span>
                      <span className="chip kbd-line text-aqua">{subnetResult.totalUsable} host</span>
                    </div>

                    <dl className="grid grid-cols-2 divide-x divide-y divide-aqua/10">
                      {[
                        ['Netmask', subnetResult.netmask],
                        ['Wildcard', subnetResult.wildcard],
                        ['Network', subnetResult.network],
                        ['Broadcast', subnetResult.broadcast],
                      ].map(([k, v]) => (
                        <div key={k} className="p-4 sm:px-5">
                          <dt className="font-mono text-[0.6875rem] text-mist/80 uppercase">{k}</dt>
                          <dd className="kbd-line mt-1 text-[0.9375rem] text-white">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="border-t border-aqua/15 px-5 py-4">
                      <p className="font-mono text-[0.6875rem] text-mist/80 uppercase">
                        Rentang host yang bisa dipakai
                      </p>
                      <p className="kbd-line mt-1 text-[0.9375rem] text-aqua">{subnetResult.usableRange}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2px] border border-coral/50 bg-coral/10 p-5">
                    <p className="font-semibold text-white">Format belum sesuai</p>
                    <p className="mt-1 text-[0.9375rem] text-coral-text">
                      {subnetResult?.error || 'Contoh yang valid: 192.168.1.0/24 atau 10.0.0.0/26'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cli' && (
            <div role="tabpanel" className="flex h-[26rem] flex-col p-5 sm:p-7">
              <div
                ref={terminalBodyRef}
                className="terminal-scroll kbd-line flex-1 space-y-2 overflow-y-auto pr-2 leading-relaxed"
                tabIndex={0}
                aria-label="Output terminal"
              >
                {terminalHistory.map((item, idx) => (
                  <div key={idx}>
                    {item.type === 'sys' && <p className="text-aqua">{item.text}</p>}
                    {item.type === 'cmd' && (
                      <p className="text-foam">
                        <span className="text-kelp">siraj@fizhtank:~$</span> {item.text}
                      </p>
                    )}
                    {item.type === 'out' && (
                      <pre className="my-1 border-l border-aqua/25 pl-4 font-[inherit] whitespace-pre-wrap text-mist">
                        {item.text}
                      </pre>
                    )}
                    {item.type === 'err' && <p className="pl-4 text-coral-text">{item.text}</p>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRunCommand} className="mt-4 flex items-center gap-2 border-t border-aqua/15 pt-4">
                <label htmlFor="cli-input" className="kbd-line shrink-0 text-kelp">
                  siraj@fizhtank:~$
                </label>
                <input
                  id="cli-input"
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="ketik help"
                  className="min-w-0 flex-1 bg-transparent font-mono text-base text-white placeholder:text-mist/60 focus:outline-none sm:text-sm"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
