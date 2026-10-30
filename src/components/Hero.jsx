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
  Camera,
  CheckCircle2,
} from 'lucide-react'
import { useScrollReveal, useAnimatedCounter } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { site } from '../data/site'
import { calculateSubnet } from '../utils/subnetCalculator'
import { playWaterBubble, playSonarPing } from '../utils/audio'
import heroFallback from '../assets/hero.png'

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
  const [avatarSrc, setAvatarSrc] = useState(() => site.avatarUrl || heroFallback)

  // CLI state
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: `FIZHTANK KERNEL // v2.8 (AQUARIUM SHELL)` },
    { type: 'sys', text: `OPERATOR: Hafidz Sirajuddin (Siraj) [${site.jobTitle}]` },
    { type: 'cmd', text: 'cat /etc/station.manifest' },
    { type: 'out', text: `ROLE      : ${site.jobTitle}\nACADEMIC  : ${site.subtitle}\nTANK ECO  : 450 Liters // 25.4°C // 7.2 pH\nMISSION   : ${site.tagline}` },
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
        text: 'Available Commands:\n  whoami      - Station operator credentials\n  subnet <ip> - Compute VLSM CIDR block (e.g. subnet 10.0.0.0/24)\n  radar       - Switch station view to Hydro-Acoustic Radar\n  vlsm        - Switch station view to VLSM Matrix\n  feed        - Trigger water ripple in aquarium canvas\n  clear       - Purge terminal buffer',
      })
    } else if (lower === 'whoami') {
      nextLogs.push({
        type: 'out',
        text: `Hafidz Sirajuddin (Siraj)\n${site.jobTitle}\n${site.subtitle}\nContact: ${site.email}`,
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
      nextLogs.push({ type: 'sys', text: 'Water ripple generated. Fish swimming along current.' })
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
  const countVolume = useAnimatedCounter(450, statsVisible, 1800)

  return (
    <section className="relative pt-32 sm:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
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
            <span className="text-slate-200 font-semibold tracking-wider uppercase">FIZHTANK AQUARIUM LAB</span>
            <span className="text-slate-600">//</span>
            <span className="text-cyan-400/90 font-medium">TANK-01 [SURABAYA, ID]</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WATER: <strong className="text-cyan-300">25.4°C</strong> // <strong className="text-emerald-400">7.2 pH</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">VOLUME: 450L</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-emerald-400/90 font-medium">60 FPS CAUSTICS</span>
          </div>
        </div>

        {/* ── Monumental Display Headline & Operator Profile (Awwwards Style) ── */}
        <div className="mt-8 sm:mt-12">
          <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 sm:mb-4 flex items-center gap-2">
            <span>// 001</span>
            <span className="w-8 h-px bg-cyan-500/40" />
            <span>Aquarium Network Laboratory &amp; Security Engineering</span>
          </p>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Monumental Typography & Actions (8 cols) */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.04em] leading-[0.96] text-white font-display uppercase">
                Cultivating <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
                  Resilient Networks.
                </span>
              </h1>

              <p className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                Catatan laboratorium dan observasi teknis <strong className="text-white font-semibold">Siraj (Fizhkan)</strong> — Mahasiswa D3 Teknik Informatika yang mendalami perancangan topologi enterprise, segmentasi VLAN multi-departemen, inspeksi aliran paket Wireshark, dan mitigasi keamanan stateful dalam ekosistem akuarium digital.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
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

            {/* Right: Operator Portrait Frame (4 cols) ── Wadah Foto Fisik Siraj */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] rounded-3xl apple-glass p-3 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group">
                {/* Photo Frame Container with Acrylic Bevel */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900/90 border border-white/10 shadow-inner flex items-center justify-center">
                  <img
                    src={avatarSrc}
                    alt="Hafidz Sirajuddin (Siraj)"
                    onError={() => setAvatarSrc(heroFallback)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle water caustics gradient reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top Live Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-md text-cyan-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ONLINE</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 text-[9px] uppercase font-bold">
                      ARCHITECT
                    </span>
                  </div>

                  {/* Bottom Nameplate Over Photo */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-left">
                    <div className="flex items-center gap-1.5 text-white font-bold text-sm font-display">
                      <span>Hafidz Sirajuddin</span>
                      <CheckCircle2 size={13} className="text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300/90 block mt-0.5">
                      @Fizhkan · Siraj
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-sans leading-tight">
                      D3 Teknik Informatika
                    </span>
                  </div>
                </div>

                {/* Helpful Instruction Tip for user to drop photo */}
                <div className="mt-2.5 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400/90">
                    <Camera size={11} />
                    <span>FOTO PROFIL</span>
                  </span>
                  <span className="text-slate-500 text-[9px]">public/profile.jpg</span>
                </div>
              </div>
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
              </div>

              {/* Node Inspector Telemetry Panel */}
              <div className="lg:col-span-5 flex flex-col justify-between font-mono text-xs space-y-4">
                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">
                      NODE TELEMETRY // {selectedNode.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {selectedNode.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">DESIGNATION</span>
                      <span className="text-white text-sm font-semibold">{selectedNode.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">IP ENDPOINT</span>
                        <span className="text-cyan-300 text-xs font-bold">{selectedNode.ip}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">RTT LATENCY</span>
                        <span className="text-emerald-400 text-xs font-bold">{selectedNode.latency}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">FUNCTION</span>
                      <span className="text-slate-300 text-xs">{selectedNode.type}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400 animate-pulse" />
                    <span className="text-slate-300 text-[11px]">WATER ACOUSTIC FEED:</span>
                  </div>
                  <button
                    onClick={() => {
                      playSonarPing()
                      window.dispatchEvent(new CustomEvent('fizhtank-feed'))
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Waves size={12} />
                    <span>EMIT RIPPLE</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: VLSM Matrix Analyzer */}
          {activeTab === 'vlsm' && (
            <div className="p-4 sm:p-8 grid lg:grid-cols-12 gap-8 items-start min-h-[440px]">
              <div className="lg:col-span-6 space-y-4 font-mono text-xs">
                <div>
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    VLSM SEGMENTATION BENCH
                  </span>
                  <p className="text-slate-400 text-[11px] font-sans">
                    Kalkulator alokasi subnet IPv4 real-time. Hitung blok network, netmask biner, usable host range, dan broadcast address tanpa reload.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 block text-[11px] font-semibold">
                    ENTER CIDR BLOCK:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={subnetInput}
                      onChange={(e) => handleCalculateSubnet(e.target.value)}
                      placeholder="192.168.10.0/26"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-cyan-400 transition-colors text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-slate-500 text-[10px] block uppercase mb-1.5">
                    SAMPLE ENTERPRISE PRESETS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['192.168.10.0/24', '192.168.20.0/26', '10.0.0.0/27', '172.16.0.0/29'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleCalculateSubnet(preset)}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-300 text-[11px] transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* VLSM Result Card */}
              <div className="lg:col-span-6 font-mono text-xs">
                {subnetResult && !subnetResult.error ? (
                  <div className="p-5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-white font-bold">{subnetResult.cidr}</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        /{subnetResult.prefix}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px] block">NETMASK</span>
                        <span className="text-slate-200 font-semibold">{subnetResult.netmask}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">USABLE HOSTS</span>
                        <span className="text-emerald-400 font-bold">{subnetResult.usableHosts.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">NETWORK ADDR</span>
                        <span className="text-slate-200 font-semibold">{subnetResult.networkAddress}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">BROADCAST ADDR</span>
                        <span className="text-slate-200 font-semibold">{subnetResult.broadcastAddress}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <span className="text-slate-500 text-[10px] block mb-1">USABLE HOST RANGE</span>
                      <div className="p-2 rounded bg-black/40 text-cyan-300 text-[11px] flex items-center justify-between">
                        <span>{subnetResult.firstUsable}</span>
                        <span className="text-slate-600">-&gt;</span>
                        <span>{subnetResult.lastUsable}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300">
                    <span className="font-bold block mb-1">Invalid CIDR format</span>
                    <span className="text-[11px] text-slate-400">Contoh format valid: 192.168.1.0/24 atau 10.0.0.0/26</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Station Interactive CLI Shell */}
          {activeTab === 'cli' && (
            <div className="p-4 sm:p-6 font-mono text-xs flex flex-col h-[440px]">
              <div
                ref={terminalBodyRef}
                className="flex-1 overflow-y-auto space-y-2 pr-2 terminal-scroll"
              >
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {item.type === 'sys' && (
                      <span className="text-cyan-400 font-semibold">{item.text}</span>
                    )}
                    {item.type === 'cmd' && (
                      <div className="text-slate-300 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">siraj@fizhtank:~$</span>
                        <span>{item.text}</span>
                      </div>
                    )}
                    {item.type === 'out' && (
                      <pre className="text-slate-400 whitespace-pre-wrap font-mono pl-4 border-l border-white/10 my-1">
                        {item.text}
                      </pre>
                    )}
                    {item.type === 'err' && (
                      <div className="text-rose-400 pl-4">{item.text}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* CLI Input Prompt */}
              <form onSubmit={handleRunCommand} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="text-emerald-400 font-bold shrink-0">siraj@fizhtank:~$</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="ketik 'help' untuk daftar command (whoami, subnet, feed, clear)..."
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600 font-mono text-xs"
                />
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── Metric Telemetry Bar (Bottom) ── */}
      <div
        ref={statsRef}
        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs transition-all duration-700"
        style={{
          opacity: statsVisible ? 1 : 0,
          transform: statsVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="p-4 rounded-xl apple-glass">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">LAB DOSSIERS</span>
          <span className="text-2xl font-bold text-white tabular-nums">{countPlanned}</span>
          <span className="text-cyan-400 text-[10px] block mt-0.5 font-medium">PLANNED SPECIMENS</span>
        </div>

        <div className="p-4 rounded-xl apple-glass">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">CORE PROTOCOLS</span>
          <span className="text-2xl font-bold text-white tabular-nums">{countProtocols}+</span>
          <span className="text-cyan-400 text-[10px] block mt-0.5 font-medium">EXPLORED &amp; VERIFIED</span>
        </div>

        <div className="p-4 rounded-xl apple-glass">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">TANK VOLUME</span>
          <span className="text-2xl font-bold text-white tabular-nums">{countVolume}L</span>
          <span className="text-emerald-400 text-[10px] block mt-0.5 font-medium">AQUARIUM ECOSYSTEM</span>
        </div>

        <div className="p-4 rounded-xl apple-glass">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">SIMULATION TOOLS</span>
          <span className="text-2xl font-bold text-white tabular-nums">4</span>
          <span className="text-cyan-400 text-[10px] block mt-0.5 font-medium">ACTIVE LAB SUITE</span>
        </div>
      </div>
    </section>
  )
}
