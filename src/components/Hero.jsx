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
  { id: 'topology', label: 'Topologi', icon: Network },
  { id: 'subnet', label: 'Kalkulator subnet', icon: Calculator },
  { id: 'cli', label: 'Terminal', icon: TerminalIcon },
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

  const reveal = (visible, offset = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="hero" className="relative mx-auto max-w-7xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
      <div
        ref={headerRef}
        className="grid grid-cols-1 items-center gap-12 transition-all duration-700 lg:grid-cols-12"
        style={reveal(headerVisible)}
      >
        <div className="lg:col-span-7">
          <p className="eyebrow">Jaringan · Keamanan · Linux</p>

          <h1 className="on-water mt-5 text-[2.75rem] leading-[1.04] text-white sm:text-6xl lg:text-7xl">
            Belajar membangun dan mengamankan jaringan.
          </h1>

          <p className="lede on-water mt-7 max-w-xl text-lg">
            Halo, saya <strong className="font-semibold text-white">Siraj</strong>, mahasiswa D3 Teknik Informatika.
            Di sini saya mencatat lab jaringan, keamanan, dan Linux yang sedang saya pelajari. Situs ini saya buat
            seperti akuarium: klik bagian air yang kosong untuk memberi makan ikan.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#labs" className="btn btn-primary">
              <span>Lihat lab</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi saya
            </a>
            <button type="button" onClick={handleFeed} className="btn btn-ghost">
              <Fish size={17} aria-hidden="true" />
              <span>Beri makan ikan</span>
            </button>
          </div>

          <div className="mt-10">
            <p className="mb-2.5 text-sm text-mist">Tool yang sedang saya pelajari</p>
            <ul className="flex flex-wrap gap-2">
              {usedTools.map((tool) => (
                <li key={tool} className="chip">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <figure className="glass w-full max-w-[19rem] rotate-0 p-3 sm:max-w-[21rem]">
            <div
                          className={`relative overflow-hidden rounded-[0.875rem] bg-lagoon ${avatarOk ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}
                        >
              {avatarOk ? (
                <img
                  src={site.avatarUrl}
                  alt="Foto Siraj"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#14879a,#0a4a5c_60%,#05303e)]">
                  <span className="font-display text-[5.5rem] font-semibold leading-none text-white/90" aria-hidden="true">
                    S
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
            </div>

            <figcaption className="px-2 pt-4 pb-2">
              <p className="font-display text-2xl font-semibold text-white">Hafidz Sirajuddin</p>
              <p className="mt-0.5 text-[0.9375rem] text-mist">{site.subtitle}</p>
              <p className="mt-0.5 text-sm text-mist/80">{site.location}</p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Meja kerja */}
      <div ref={benchRef} className="mt-24 transition-all duration-700" style={reveal(benchVisible, 28)}>
        <div className="glass overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
            <div>
              <h2 className="text-2xl text-white">Meja kerja</h2>
              <p className="mt-0.5 text-sm text-mist">Tiga alat kecil untuk berlatih. Coba langsung.</p>
            </div>

            <div role="tablist" aria-label="Alat di meja kerja" className="flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
              {TABS.map((tab) => {
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
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-aqua text-deep' : 'text-mist hover:text-white'
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {activeTab === 'topology' && (
            <div role="tabpanel" className="grid grid-cols-1 items-center gap-8 p-5 sm:p-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="glass-inset relative mx-auto aspect-[4/3] w-full max-w-[34rem]">
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
                          stroke={hot ? '#6fe3d3' : 'rgba(172, 208, 212, 0.4)'}
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
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all sm:h-11 sm:w-11 ${
                            active
                              ? 'scale-110 border-aqua bg-aqua text-deep'
                              : 'border-white/25 bg-water text-aqua group-hover:border-aqua/70'
                          }`}
                        >
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span
                          className={`hidden whitespace-nowrap text-[0.6875rem] leading-none sm:block ${
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
                <div className="glass-inset p-5" aria-live="polite">
                  <p className="text-sm text-aqua">Rancangan topologi homelab</p>
                  <h3 className="mt-1 text-2xl text-white">{selected.label}</h3>

                  <dl className="mt-4 space-y-3 text-[0.9375rem]">
                    <div>
                      <dt className="text-sm text-mist">Peran</dt>
                      <dd className="text-white">{selected.role}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-mist">Alamat contoh</dt>
                      <dd className="kbd-line text-white">{selected.addr}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-mist">{selected.note}</p>

                  {selected.lab && (
                    <a
                      href="#labs"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua hover:text-white"
                    >
                      <span>Lihat Lab 0{selected.lab}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>

                <p className="mt-3 px-1 text-sm text-mist/80">
                  Semua perangkat di diagram ini masih rancangan untuk lab, belum berjalan.
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

                <p className="mt-4 mb-2 text-sm text-mist">Contoh cepat</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleCalculateSubnet(preset)}
                      className="chip kbd-line cursor-pointer transition-colors hover:border-aqua/60 hover:text-aqua"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7" aria-live="polite">
                {subnetResult && !subnetResult.error ? (
                  <div className="glass-inset p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="kbd-line text-base font-semibold text-white">
                        {subnetResult.network}
                        {subnetResult.cidr}
                      </span>
                      <span className="chip kbd-line">{subnetResult.totalUsable} host</span>
                    </div>

                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[
                        ['Netmask', subnetResult.netmask],
                        ['Wildcard', subnetResult.wildcard],
                        ['Network', subnetResult.network],
                        ['Broadcast', subnetResult.broadcast],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-sm text-mist">{k}</dt>
                          <dd className="kbd-line text-[0.9375rem] text-white">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-sm text-mist">Rentang host yang bisa dipakai</p>
                      <p className="kbd-line mt-1 text-[0.9375rem] text-aqua">{subnetResult.usableRange}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[0.875rem] border border-coral/40 bg-coral/10 p-5">
                    <p className="font-semibold text-white">Format belum sesuai</p>
                    <p className="mt-1 text-[0.9375rem] text-mist">
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
                      <pre className="my-1 border-l border-white/15 pl-4 font-[inherit] whitespace-pre-wrap text-mist">
                        {item.text}
                      </pre>
                    )}
                    {item.type === 'err' && <p className="pl-4 text-coral">{item.text}</p>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRunCommand} className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
                <label htmlFor="cli-input" className="kbd-line shrink-0 text-kelp">
                  siraj@fizhtank:~$
                </label>
                <input
                  id="cli-input"
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="ketik help"
                  className="min-w-0 flex-1 bg-transparent font-mono text-base text-white placeholder:text-mist/60 focus:outline-none sm:text-[0.8125rem]"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

