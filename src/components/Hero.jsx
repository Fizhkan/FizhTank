import { useState, useRef, useEffect } from 'react'
import {
  ArrowUpRight,
  Radio,
  Terminal as TerminalIcon,
  Activity,
  Layers,
  Shield,
  Network,
  Waves,
} from 'lucide-react'
import { useScrollReveal, useAnimatedCounter } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { site } from '../data/site'
import { calculateSubnet } from '../utils/subnetCalculator'
import { playWaterBubble, playSonarPing } from '../utils/audio'

// Interactive Sonar Nodes representing our network ecosystem
const SONAR_NODES = [
  { id: 'core-l3', label: 'CORE-L3-ROUTER', x: 50, y: 48, ip: '192.168.10.1', type: 'Core Switch / SVI', status: 'ACTIVE', latency: '0.4ms', icon: Network },
  { id: 'edge-fw', label: 'EDGE-FIREWALL', x: 26, y: 28, ip: '10.0.0.1', type: 'Stateful Packet Filter', status: 'FILTERING', latency: '1.2ms', icon: Shield },
  { id: 'dns-sink', label: 'PIHOLE-SINKHOLE', x: 74, y: 32, ip: '192.168.20.53', type: 'Local DNS Resolver', status: 'BLOCKING', latency: '0.8ms', icon: Layers },
  { id: 'packet-tap', label: 'WIRESHARK-TAP', x: 30, y: 72, ip: '0.0.0.0 (Promisc)', type: 'Raw Packet Monitor', status: 'SNIFFING', latency: '0.1ms', icon: Activity },
  { id: 'uplink-wan', label: 'SURFACE-GATEWAY', x: 72, y: 70, ip: '203.0.113.1', type: 'WAN BGP Peering', status: 'ESTABLISHED', latency: '4.8ms', icon: Radio },
]

export default function Hero() {
  const [activeTab, setActiveTab] = useState('radar') // 'radar' | 'vlsm' | 'cli'
  const [selectedNode, setSelectedNode] = useState(SONAR_NODES[0])
  const [subnetInput, setSubnetInput] = useState('192.168.10.0/26')
  const [subnetResult, setSubnetResult] = useState(() => calculateSubnet('192.168.10.0/26'))

  // CLI state
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: `FIZHTANK STATION KERNEL // v2.6.4 (OCEANOGRAPHIC SHELL)` },
    { type: 'sys', text: `OPERATOR: ${site.title.split('|')[0].trim()} [${site.jobTitle}]` },
    { type: 'cmd', text: 'cat /etc/station.manifest' },
    { type: 'out', text: `ROLE      : ${site.jobTitle}\nACADEMIC  : ${site.subtitle}\nPROTOCOL  : IPv4 / VLSM / 802.1Q / OSPFv2 / TLS 1.3\nMISSION   : ${site.tagline}` },
    { type: 'cmd', text: 'status --quick' },
    { type: 'out', text: `[✓] Hydro-Acoustic Radar Online\n[✓] VLSM Segmentation Engine Active\n[✓] 3 Planned Research Dossiers Loaded` },
  ])
  const [cliInput, setCliInput] = useState('')
  const terminalBodyRef = useRef(null)

  // Section reveals
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [instrumentRef, instrumentVisible] = useScrollReveal({ threshold: 0.1 })
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.15 })

  // Auto-scroll CLI terminal
  useEffect(() => {
    if (activeTab === 'cli' && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalHistory, activeTab])

  // Handle VLSM Calculation
  const handleCalculateSubnet = (inputStr) => {
    setSubnetInput(inputStr)
    const res = calculateSubnet(inputStr)
    setSubnetResult(res)
  }

  // Handle CLI Command Execution
  const handleRunCommand = (e) => {
    e.preventDefault()
    const trimmed = cliInput.trim()
    if (!trimmed) return

    const lower = trimmed.toLowerCase()
    const nextLogs = [...terminalHistory, { type: 'cmd', text: trimmed }]

    if (lower === 'help') {
      nextLogs.push({
        type: 'out',
        text: 'Available Commands:\n  whoami      - Station operator credentials\n  subnet <ip> - Compute VLSM CIDR block (e.g. subnet 10.0.0.0/24)\n  radar       - Switch station view to Hydro-Acoustic Radar\n  vlsm        - Switch station view to VLSM Matrix\n  feed        - Trigger acoustic sonar bloom in ocean canvas\n  clear       - Purge terminal buffer',
      })
    } else if (lower === 'whoami') {
      nextLogs.push({
        type: 'out',
        text: `${site.jobTitle}\n${site.subtitle}\nContact: ${site.email}`,
      })
    } else if (lower.startsWith('subnet')) {
      const arg = trimmed.split(' ')[1]
      if (!arg) {
        nextLogs.push({ type: 'err', text: 'Usage: subnet <ip/cidr> (e.g. subnet 192.168.1.0/26)' })
      } else {
        const res = calculateSubnet(arg)
        if (res.error) {
          nextLogs.push({ type: 'err', text: `Calculation Error: ${res.error}` })
        } else {
          nextLogs.push({
            type: 'out',
            text: `CIDR: ${res.cidr} [/${res.prefix}]\nNetmask: ${res.netmask}\nNetwork: ${res.networkAddress}\nUsable : ${res.firstUsable} - ${res.lastUsable} (${res.usableHosts} hosts)\nBcast  : ${res.broadcastAddress}`,
          })
          setSubnetInput(arg)
          setSubnetResult(res)
        }
      }
    } else if (lower === 'radar') {
      setActiveTab('radar')
      nextLogs.push({ type: 'sys', text: 'Switched viewport to Hydro-Acoustic Radar Matrix.' })
    } else if (lower === 'vlsm') {
      setActiveTab('vlsm')
      nextLogs.push({ type: 'sys', text: 'Switched viewport to VLSM Matrix Analyzer.' })
    } else if (lower === 'feed') {
      playSonarPing()
      window.dispatchEvent(new CustomEvent('fizhtank-feed'))
      nextLogs.push({ type: 'sys', text: 'Acoustic bloom triggered. Bioluminescent plume dispersing.' })
    } else if (lower === 'clear') {
      setTerminalHistory([])
      setCliInput('')
      return
    } else {
      nextLogs.push({
        type: 'err',
        text: `Command not recognized: '${trimmed}'. Type 'help' for station manual.`,
      })
    }

    setTerminalHistory(nextLogs)
    setCliInput('')
  }

  // Stat Counters
  const plannedLabs = labsData.length
  const countPlanned = useAnimatedCounter(plannedLabs, statsVisible, 1200)
  const countProtocols = useAnimatedCounter(12, statsVisible, 1500)
  const countDepth = useAnimatedCounter(2400, statsVisible, 1800)

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* ── Top Masthead Bar ── */}
      <div
        ref={headerRef}
        className="mb-8 sm:mb-12 transition-all duration-700"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 font-mono text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-slate-200 font-semibold tracking-wider uppercase">STATION FIZHTANK</span>
            <span className="text-slate-600">//</span>
            <span className="text-cyan-400/90 font-medium">07°14'S, 112°45'E</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>BATHYAL DEPTH: <strong className="text-slate-100">2,400M</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-emerald-400/90 font-medium">TELEMETRY: 60 FPS</span>
          </div>
        </div>

        {/* ── Monumental Display Headline (Awwwards Style) ── */}
        <div className="mt-8 sm:mt-12">
          <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 sm:mb-4 flex items-center gap-2">
            <span>// 001</span>
            <span className="w-8 h-px bg-cyan-500/40" />
            <span>Abyssal Network Laboratory &amp; Security Engineering</span>
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-extrabold tracking-[-0.04em] leading-[0.95] text-white font-display uppercase">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
              Resilient Networks.
            </span>
          </h1>

          <div className="mt-6 sm:mt-8 grid lg:grid-cols-12 gap-6 items-baseline">
            <p className="lg:col-span-8 text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Catatan riset dan laboratorium <strong className="text-white font-semibold">Siraj (Fizhkan)</strong> — Mahasiswa D3 Teknik Informatika yang mendalami perancangan topologi enterprise, segmentasi VLAN multi-departemen, inspeksi aliran paket Wireshark, dan mitigasi keamanan stateful.
            </p>

            <div className="lg:col-span-4 flex flex-wrap sm:flex-nowrap items-center gap-3">
              <a
                href="#labs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm hover:bg-cyan-300 transition-all duration-200 active:scale-95 shadow-[0_0_25px_rgba(34,211,238,0.3)] cursor-pointer"
              >
                <span>Explore Specimen</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.03] text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.06] font-semibold text-sm backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Initialize Uplink</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Centerpiece Installation (Awwwards Grade) ── */}
      <div
        ref={instrumentRef}
        className="mt-8 transition-all duration-700"
        style={{
          opacity: instrumentVisible ? 1 : 0,
          transform: instrumentVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        <div className="relative rounded-2xl apple-glass shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Header Bar with Mode Selectors */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3.5 bg-white/[0.02]">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="font-semibold tracking-wider uppercase">HYDRO-ACOUSTIC TELEMETRY BENCH</span>
            </div>

            {/* Mode Switch Tabs with Instant Apple Feedback */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
              <button
                onClick={() => {
                  playWaterBubble()
                  setActiveTab('radar')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'radar'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio size={13} />
                <span>SONAR RADAR</span>
              </button>

              <button
                onClick={() => {
                  playWaterBubble()
                  setActiveTab('vlsm')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'vlsm'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers size={13} />
                <span>VLSM MATRIX</span>
              </button>

              <button
                onClick={() => {
                  playWaterBubble()
                  setActiveTab('cli')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'cli'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon size={13} />
                <span>STATION CLI</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Sonar Radar Matrix */}
          {activeTab === 'radar' && (
            <div className="p-4 sm:p-8 grid lg:grid-cols-12 gap-8 items-center min-h-[440px]">
              {/* Radar Scope Viewport */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[380px] aspect-square rounded-full border border-cyan-500/20 bg-slate-950/80 p-2 shadow-[inset_0_0_60px_rgba(6,182,212,0.06)] overflow-hidden">
                  {/* Concentric Sonar Distance Rings */}
                  <div className="absolute inset-4 rounded-full border border-cyan-500/15 border-dashed" />
                  <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-28 rounded-full border border-cyan-500/15" />
                  <div className="absolute inset-40 rounded-full border border-cyan-500/10" />

                  {/* Crosshairs */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />

                  {/* Rotating Sweeper Beam */}
                  <div
                    className="absolute inset-0 origin-center pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, transparent 310deg, rgba(6, 182, 212, 0.28) 360deg)',
                      animation: 'radar-sweep 5s linear infinite',
                    }}
                  />

                  {/* Sonar Network Nodes */}
                  {SONAR_NODES.map((node) => {
                    const isSelected = selectedNode.id === node.id
                    const Icon = node.icon
                    return (
                      <button
                        key={node.id}
                        onClick={() => {
                          playWaterBubble()
                          setSelectedNode(node)
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 scale-125 z-20 shadow-[0_0_20px_#22d3ee]'
                            : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40 hover:scale-110 z-10'
                        }`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        title={`${node.label} (${node.ip})`}
                      >
                        <Icon size={14} />
                        <span className="sr-only">{node.label}</span>

                        {/* Ping Ripple */}
                        {isSelected && (
                          <span className="absolute inset-0 rounded-xl bg-cyan-400 animate-ping opacity-40 pointer-events-none" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>ACOUSTIC SWEEP ACTIVE</span>
                  </span>
                  <span>//</span>
                  <span>CLICK NODES TO INSPECT TELEMETRY</span>
                </div>
              </div>

              {/* Node Telemetry Specimen Card */}
              <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-xl p-5 sm:p-6 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-cyan-400 font-semibold tracking-wider">// TELEMETRY INSPECTOR</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    {selectedNode.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3.5 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Node Identity</span>
                    <span className="text-slate-100 font-bold text-sm tracking-wide">{selectedNode.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">IP Address</span>
                      <span className="text-cyan-300 font-semibold">{selectedNode.ip}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">RTT Latency</span>
                      <span className="text-emerald-400 font-semibold">{selectedNode.latency}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Network Function</span>
                    <span className="text-slate-200">{selectedNode.type}</span>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-slate-400 text-[11px] leading-relaxed">
                    Node ini adalah bagian dari simulasi topologi jaringan FizhTank, bertugas memvalidasi routing paket antar-VLAN dan inspeksi keamanan perimeter.
                  </div>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('fizhtank-feed'))
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Waves size={13} />
                    <span>Ping Node &amp; Emit Sonar Wave</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Live VLSM Subnet Calculator */}
          {activeTab === 'vlsm' && (
            <div className="p-4 sm:p-8 min-h-[440px]">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      Interactive VLSM Subnet Engine
                    </h3>
                    <p className="text-slate-400 text-xs font-mono mt-0.5">
                      Hitung alokasi blok IPv4, network boundary, dan usable host range secara real-time.
                    </p>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-500 text-[11px] mr-1 hidden sm:inline">PRESETS:</span>
                    {['192.168.10.0/26', '10.0.0.0/22', '172.16.8.0/28'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleCalculateSubnet(preset)}
                        className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                          subnetInput === preset
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                        }`}
                      >
                        {preset.split('/')[1] ? `/${preset.split('/')[1]}` : preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subnet Input Field */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={subnetInput}
                      onChange={(e) => handleCalculateSubnet(e.target.value)}
                      placeholder="e.g. 192.168.1.0/24"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                {/* Output Breakdown Cards */}
                {subnetResult && !subnetResult.error ? (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] text-slate-500 uppercase block">Network Address</span>
                        <span className="text-cyan-300 font-bold text-sm sm:text-base">{subnetResult.networkAddress}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] text-slate-500 uppercase block">Subnet Mask</span>
                        <span className="text-slate-200 font-bold text-sm sm:text-base">{subnetResult.netmask}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] text-slate-500 uppercase block">Usable Host Range</span>
                        <span className="text-slate-200 font-bold text-xs sm:text-xs leading-tight block mt-1">
                          {subnetResult.firstUsable} <br />— {subnetResult.lastUsable}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Usable Hosts</span>
                        <span className="text-emerald-400 font-bold text-sm sm:text-base tabular-nums">
                          {subnetResult.usableHosts.toLocaleString()} hosts
                        </span>
                      </div>
                    </div>

                    {/* Visual IP Block Range Bar */}
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                        <span>BLOCK SEGMENTATION VISUALIZER:</span>
                        <span className="text-cyan-400">/{subnetResult.prefix}</span>
                      </div>
                      <div className="h-4 w-full bg-slate-800 rounded-lg overflow-hidden flex">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-l-lg transition-all duration-300"
                          style={{ width: '85%' }}
                          title="Usable Allocation"
                        />
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: '15%' }}
                          title="Broadcast & Network IDs"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
                        <span>NET: {subnetResult.networkAddress}</span>
                        <span>BROADCAST: {subnetResult.broadcastAddress}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
                    Input CIDR format tidak valid. Contoh format yang benar: 192.168.1.0/24 atau 10.0.0.0/16
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Station CLI Terminal */}
          {activeTab === 'cli' && (
            <div className="p-4 sm:p-6 min-h-[440px] flex flex-col font-mono text-xs">
              <div
                ref={terminalBodyRef}
                className="flex-1 max-h-[340px] overflow-y-auto space-y-2 pr-2 text-slate-300 terminal-scroll"
              >
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.type === 'sys' && <p className="text-cyan-400/90 font-medium">{line.text}</p>}
                    {line.type === 'cmd' && (
                      <p className="text-slate-100 flex items-center gap-1.5">
                        <span className="text-violet-400 font-bold">&gt;</span>
                        <span>{line.text}</span>
                      </p>
                    )}
                    {line.type === 'out' && <pre className="text-slate-300 whitespace-pre-wrap pl-3">{line.text}</pre>}
                    {line.type === 'err' && <p className="text-red-400 pl-3">{line.text}</p>}
                  </div>
                ))}
              </div>

              {/* Command Input Bar */}
              <form onSubmit={handleRunCommand} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">&gt;&gt;</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Ketik 'help' untuk daftar command..."
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs transition-all cursor-pointer"
                >
                  Run
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── Station Telemetry Spec Panels (Quick Stats) ── */}
      <div
        ref={statsRef}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs transition-all duration-700"
        style={{
          opacity: statsVisible ? 1 : 0,
          transform: statsVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="p-5 rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">SPECIMEN RESEARCH LABS</span>
            <span className="text-2xl font-extrabold text-white font-display mt-0.5 block tabular-nums">
              0{countPlanned} DOSSIERS
            </span>
            <span className="text-cyan-400 text-[11px]">VLAN · TLS · Firewall</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers size={18} />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">CORE PROTOCOLS EXPLORED</span>
            <span className="text-2xl font-extrabold text-white font-display mt-0.5 block tabular-nums">
              {countProtocols}+ PROTOCOLS
            </span>
            <span className="text-emerald-400 text-[11px]">802.1Q · OSPF · Wireshark</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Network size={18} />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">MAXIMUM LAB DEPTH</span>
            <span className="text-2xl font-extrabold text-white font-display mt-0.5 block tabular-nums">
              {countDepth.toLocaleString()} M
            </span>
            <span className="text-violet-400 text-[11px]">Mariana Abyssal Sim</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Activity size={18} />
          </div>
        </div>
      </div>
    </section>
  )
}
