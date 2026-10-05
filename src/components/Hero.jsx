import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight,
  Mail,
  Shield,
  Network,
  Terminal as TerminalIcon,
  Waves,
  Radio,
  Activity,
  RotateCcw,
  Fish,
} from 'lucide-react'
import { useScrollReveal, useAnimatedCounter, useCursorGlow } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { site } from '../data/site'

// IPv4 VLSM Subnet Calculator Engine
function calculateSubnet(cidrInput) {
  const trimmed = cidrInput.trim()
  const parts = trimmed.split('/')
  if (parts.length !== 2) {
    return { error: 'Format salah! Gunakan: subnet <IP>/<CIDR>\nContoh: subnet 192.168.1.0/26' }
  }

  const ipStr = parts[0].trim()
  const maskBits = parseInt(parts[1].trim(), 10)

  if (isNaN(maskBits) || maskBits < 1 || maskBits > 32) {
    return { error: 'Prefix CIDR tidak valid! Masukkan angka antara /1 dan /32.' }
  }

  const octets = ipStr.split('.').map((o) => parseInt(o, 10))
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    return { error: 'Alamat IPv4 tidak valid! Gunakan format dotted-decimal (misal: 192.168.1.0).' }
  }

  const ipInt = (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  const maskInt = maskBits === 0 ? 0 : ((0xffffffff << (32 - maskBits)) >>> 0)
  const wildcardInt = (~maskInt) >>> 0

  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  const intToIp = (val) => [
    (val >>> 24) & 0xff,
    (val >>> 16) & 0xff,
    (val >>> 8) & 0xff,
    val & 0xff,
  ].join('.')

  let usableCount = 0
  let hostRange = ''

  if (maskBits === 32) {
    usableCount = 1
    hostRange = `${intToIp(networkInt)} (Single Host)`
  } else if (maskBits === 31) {
    usableCount = 2
    hostRange = `${intToIp(networkInt)} — ${intToIp(broadcastInt)} (RFC 3021 Point-to-Point)`
  } else {
    usableCount = Math.pow(2, 32 - maskBits) - 2
    const firstHost = (networkInt + 1) >>> 0
    const lastHost = (broadcastInt - 1) >>> 0
    hostRange = `${intToIp(firstHost)} — ${intToIp(lastHost)}`
  }

  return {
    ip: ipStr,
    cidr: `/${maskBits}`,
    netmask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    usableRange: hostRange,
    totalUsable: usableCount.toLocaleString(),
  }
}

// Initial terminal history (simulasi demo telemetri)
const INITIAL_TERMINAL_LOGS = [
  { type: 'cmd', text: 'whoami' },
  { type: 'output', text: `fizhtank — ${site.jobTitle.toLowerCase()}`, color: 'text-zinc-200' },
  { type: 'cmd', text: 'cat /etc/ocean.conf' },
  { type: 'output', text: '# /etc/ocean.conf (simulasi demo)', color: 'text-cyan-400' },
  { type: 'output', text: '  theme   = cyberpunk-aquarium-demo', color: 'text-violet-400' },
  { type: 'output', text: '  focus   = learning-network-and-security', color: 'text-violet-400' },
  { type: 'output', text: '  status  = DEMO_ENVIRONMENT_READY', color: 'text-violet-400' },
  { type: 'cmd', text: 'ping -c1 demo.gateway' },
  { type: 'output', text: '64 bytes from demo.gateway: icmp_seq=1 ttl=64 time=1.2ms (simulasi)', color: 'text-emerald-400' },
  { type: 'cmd', text: 'nmap -sS -p 22,80,443 192.168.1.1' },
  { type: 'output', text: 'PORT   STATE SERVICE (simulasi)\n22/tcp open  ssh\n80/tcp open  http\n443/tcp open  https\nScan demo selesai. (simulasi telemetri demo)', color: 'text-cyan-300' },
]

// ── Typewriter hook: SSR renders full text immediately for crawlers ────────
function useTypewriter(text, speed = 50, startDelay = 600) {
  const [displayed, setDisplayed] = useState(() => (typeof window === 'undefined' ? text : text))
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    let interval
    const timeout = setTimeout(() => {
      setDisplayed('')
      interval = setInterval(() => {
        idx++
        setDisplayed(text.slice(0, idx))
        if (idx >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}

// ── Typing indicator for terminal output ──
function TypingIndicator() {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-violet-400"
          style={{
            animation: `blink-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  )
}

export default function Hero() {
  const [terminalHistory, setTerminalHistory] = useState(INITIAL_TERMINAL_LOGS)
  const [inputVal, setInputVal] = useState('')
  const [tankFed, setTankFed] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [commandHistory, setCommandHistory] = useState([])
  const [historyPointer, setHistoryPointer] = useState(-1)
  const inputRef = useRef(null)
  const terminalBodyRef = useRef(null)

  // Scroll reveal for the section
  const [sectionRef, sectionVisible] = useScrollReveal({ threshold: 0.05 })
  // Stats reveal
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.2 })
  // Cursor glow for the hero card
  const { ref: glowRef, glowStyle } = useCursorGlow()

  // Typewriter headline
  const { displayed: typewriterText, done: typewriterDone } = useTypewriter(
    'Network Ecosystems',
    45,
    800
  )

  // Auto-scroll terminal to bottom when new logs arrive
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalHistory])

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    // Save to command history
    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryPointer(-1)

    // Show typing indicator briefly
    setIsTyping(true)

    const newLogs = [...terminalHistory, { type: 'cmd', text: trimmed }]
    const lower = trimmed.toLowerCase()

    const respond = () => {
      const responseLogs = [...newLogs]

      if (lower === 'help') {
        responseLogs.push({
          type: 'output',
          text:
            'Available commands:\n  whoami      - Identity & professional background\n  skills      - Core competencies & tech stack\n  projects    - Featured enterprise networking & security labs\n  labs        - Overview of featured lab write-ups\n  subnet <ip> - IPv4 VLSM calculator (e.g. subnet 192.168.1.0/26)\n  traceroute  - Network packet hop tracer (e.g. traceroute 8.8.8.8)\n  ping <ip>   - ICMP diagnostic transmission\n  nmap        - Stealth network port reconnaissance\n  contact     - Communication matrix & channels\n  cat cv.txt  - Quick terminal summary of CV\n  feed        - [Easter Egg] Feed bioluminescent tank\n  clear       - Wipe terminal history',
          color: 'text-zinc-300',
        })
      } else if (lower.startsWith('subnet')) {
        const cidrArg = trimmed.split(' ')[1]
        if (!cidrArg) {
          responseLogs.push({
            type: 'output',
            text: 'Usage: subnet <IPv4>/<CIDR>\nContoh: subnet 192.168.1.0/26\n        subnet 10.20.0.0/23',
            color: 'text-amber-300',
          })
        } else {
          const res = calculateSubnet(cidrArg)
          if (res.error) {
            responseLogs.push({
              type: 'output',
              text: `[Error] ${res.error}`,
              color: 'text-red-400',
            })
          } else {
            const table = [
              '┌─── [IPv4 VLSM SUBNET CALCULATOR] ──────────────────┐',
              `  Target IP       : ${res.ip} ${res.cidr}`,
              `  Subnet Mask     : ${res.netmask}`,
              `  Wildcard Mask   : ${res.wildcard}`,
              `  Network ID      : ${res.network}`,
              `  Broadcast IP    : ${res.broadcast}`,
              `  Usable Host IP  : ${res.usableRange}`,
              `  Total Usable    : ${res.totalUsable} hosts`,
              '└────────────────────────────────────────────────────┘',
            ].join('\n')
            responseLogs.push({
              type: 'output',
              text: table,
              color: 'text-cyan-300',
            })
          }
        }
      } else if (lower.startsWith('traceroute') || lower.startsWith('trace')) {
        const target = trimmed.split(' ')[1] || '8.8.8.8'
        responseLogs.push({
          type: 'output',
          text: [
            `traceroute to ${target} (${target}), 30 hops max, 60 byte packets (simulasi)`,
            ` 1  gw.fizhtank.local (192.168.1.1)        0.842 ms  [L3 Core Switch]`,
            ` 2  pfsense.security.lan (10.10.1.1)       1.314 ms  [Firewall / NAT]`,
            ` 3  edge-upstream.isp.net (203.0.113.1)    4.652 ms  [ISP Border Router]`,
            ` 4  target-host (${target})                11.238 ms [Target Resolved]`,
            `Trace complete. 0% packet loss.`,
          ].join('\n'),
          color: 'text-emerald-400',
        })
      } else if (lower === 'whoami') {
        responseLogs.push({
          type: 'output',
          text: `fizhtank // Siraj\nStatus      : ${site.jobTitle}\nPendidikan  : ${site.subtitle}\nFokus Belajar : Cisco IOS, Packet Tracer, Wireshark, Arch Linux`,
          color: 'text-cyan-300',
        })
      } else if (lower === 'projects') {
        responseLogs.push({
          type: 'output',
          text:
            '=== LAB ROADMAP & EKSPLORASI ===\n1. Enterprise Multi-VLAN Segmentation (Rencana Lab)\n2. Packet Stream & Credential Inspection (Rencana Lab)\n3. Linux Network Firewall & Homelab Service (Rencana Lab)\nKetik "labs" atau scroll ke section #labs untuk melihat rencana langkah pengerjaan.',
          color: 'text-emerald-300',
        })
      } else if (lower === 'contact') {
        const contactMatrix = [
          '=== CONTACT MATRIX ===',
          `Email    : ${site.email}`,
          'GitHub   : https://github.com/Fizhkan',
          ...(site.linkedinUrl && !site.linkedinUrl.includes('[ISI') ? [`LinkedIn : ${site.linkedinUrl}`] : []),
          'Form     : Langsung isi form di section #contact di bawah.',
        ].join('\n')
        responseLogs.push({
          type: 'output',
          text: contactMatrix,
          color: 'text-blue-300',
        })
      } else if (lower === 'cat cv.txt' || lower === 'cv.txt' || lower === 'cv') {
        const activeCertNames = (site.certifications || [])
          .filter((c) => (c.name || c.nama) && !(c.name || c.nama).includes('[ISI'))
          .map((c) => c.name || c.nama)
        const certSummary = activeCertNames.length > 0 ? activeCertNames.join(', ') : 'Belum dipublikasikan (studi mandiri & lab)'
        const cvStatus = site.cvUrl && !site.cvUrl.includes('[ISI')
          ? 'Tersedia untuk diunduh di section Credentials.'
          : 'Belum tersedia untuk diunduh (dalam persiapan).'

        const cvSummaryText = [
          '================================================',
          'CURRICULUM VITAE - SIRAJ (FIZHTANK)',
          '================================================',
          `Role           : ${site.jobTitle}`,
          `Pendidikan     : ${site.subtitle}`,
          'Fokus Belajar  : Jaringan & Keamanan Komputer',
          `Sertifikasi    : ${certSummary}`,
          `Status CV      : ${cvStatus}`,
          '================================================',
        ].join('\n')

        responseLogs.push({
          type: 'output',
          text: cvSummaryText,
          color: 'text-violet-300',
        })
      } else if (lower === 'skills') {
        responseLogs.push({
          type: 'output',
          text:
            '[NETWORKING] : IPv4 Subnetting (Dasar), OSPF, VLAN 802.1Q (Belajar)\n[SYSTEMS]    : Arch Linux, Bash Scripting, systemd (Dasar)\n[SECURITY]   : Wireshark, Nmap, Firewall UFW/iptables (Belajar)',
          color: 'text-violet-300',
        })
      } else if (lower === 'labs') {
        responseLogs.push({
          type: 'output',
          text:
            '1. [Network Design]   Enterprise Multi-VLAN Segmentation (Status: Planned)\n2. [Security Analysis] Packet Stream & Credential Inspection (Status: Planned)\n3. [Linux Homelab]    Linux Network Firewall & Homelab Service (Status: Planned)\nScroll down ke #labs untuk melihat rencana langkah tiap lab.',
          color: 'text-emerald-300',
        })
      } else if (lower.startsWith('ping')) {
        const target = trimmed.split(' ')[1] || 'gateway.fizhtank.internal'
        responseLogs.push(
          {
            type: 'output',
            text: `PING ${target} (56 data bytes) (simulasi):\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.98ms (simulasi)\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.12ms (simulasi)\n--- ${target} ping statistics (simulasi): 0% packet loss ---`,
            color: 'text-emerald-400',
          }
        )
      } else if (lower.startsWith('nmap')) {
        responseLogs.push({
          type: 'output',
          text:
            'Starting Nmap 7.94 ( https://nmap.org ) (simulasi demo)\nNmap scan report for homelab-demo.lan (192.168.1.1)\nHost is up (0.00042s latency).\nPORT     STATE SERVICE (simulasi)\n22/tcp   open  ssh\n53/tcp   open  domain\n80/tcp   open  http\n443/tcp  open  https\nScan demo selesai (simulasi lab).',
          color: 'text-cyan-300',
        })
      } else if (lower === 'feed') {
        setTankFed(true)
        window.dispatchEvent(new CustomEvent('fizhtank-feed'))
        setTimeout(() => setTankFed(false), 5000)
        responseLogs.push({
          type: 'output',
          text:
            '🐟 [ECOSYSTEM EVENT] Bioluminescent nutrient flakes dropped!\n✨ Fish organisms are actively gathering near surface caustics.\nTank parameters: Water clarity 99.8% | Depth 2600m | Oxygen 98.4%',
          color: 'text-amber-300',
        })
      } else if (lower === 'clear') {
        setTerminalHistory([])
        setInputVal('')
        setIsTyping(false)
        return
      } else if (lower.startsWith('cat')) {
        responseLogs.push({
          type: 'output',
          text:
            '# /etc/ocean.conf (simulasi demo)\n[theme]\nprofile = cyberpunk-aquarium-demo\nfocus = learning-network-and-security\nstatus = DEMO_ACTIVE',
          color: 'text-violet-300',
        })
      } else {
        responseLogs.push({
          type: 'output',
          text: `bash: ${trimmed}: command not found. Type 'help' for available commands.`,
          color: 'text-red-400',
        })
      }

      setTerminalHistory(responseLogs)
      setIsTyping(false)
    }

    // Add command immediately, show response after a brief "processing" delay
    setTerminalHistory(newLogs)
    setInputVal('')
    setTimeout(respond, 350 + Math.random() * 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const nextPointer = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1)
      setHistoryPointer(nextPointer)
      setInputVal(commandHistory[nextPointer] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyPointer === -1) return
      const nextPointer = historyPointer + 1
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(-1)
        setInputVal('')
      } else {
        setHistoryPointer(nextPointer)
        setInputVal(commandHistory[nextPointer] || '')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = [
        'help',
        'whoami',
        'subnet 192.168.1.0/26',
        'traceroute 8.8.8.8',
        'skills',
        'projects',
        'labs',
        'contact',
        'cat cv.txt',
        'ping 8.8.8.8',
        'nmap',
        'feed',
        'clear',
      ].find(
        (c) => c.startsWith(inputVal.trim().toLowerCase()) && c !== inputVal.trim().toLowerCase()
      )
      if (match) {
        setInputVal(match)
      }
    }
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const quickCommands = [
    'help',
    'whoami',
    'subnet 192.168.1.0/26',
    'traceroute 8.8.8.8',
    'skills',
    'projects',
    'cat cv.txt',
    'contact',
    'feed',
    'clear',
  ]

  // Stats derived honestly from lab roadmap data
  const plannedCount = labsData.filter((l) => l.status === 'planned').length
  const inProgressCount = labsData.filter((l) => l.status === 'in-progress').length
  const completedCount = labsData.filter((l) => l.status === 'complete').length

  const stats = [
    {
      icon: Network,
      label: 'Planned Labs',
      val: `${plannedCount}`,
      numericVal: plannedCount,
      suffix: '',
      desc: 'Topologi & roadmap belajar',
      color: 'text-violet-400',
      borderGlow: 'rgba(124,58,237,0.25)',
      bg: 'rgba(109,40,217,0.08)',
    },
    {
      icon: Shield,
      label: 'In-Progress Labs',
      val: `${inProgressCount}`,
      numericVal: inProgressCount,
      suffix: '',
      desc: 'Eksperimen sedang dikerjakan',
      color: 'text-cyan-400',
      borderGlow: 'rgba(6,182,212,0.25)',
      bg: 'rgba(6,182,212,0.08)',
    },
    {
      icon: TerminalIcon,
      label: 'Completed Labs',
      val: `${completedCount}`,
      numericVal: completedCount,
      suffix: '',
      desc: 'Selesai dengan hasil verifikasi',
      color: 'text-emerald-400',
      borderGlow: 'rgba(16,185,129,0.25)',
      bg: 'rgba(16,185,129,0.08)',
    },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden"
    >
      {/* Ambient shallow-water radial glow — matches bright surface zone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 70% at 50% -5%, rgba(6,182,212,0.22) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91,33,182,0.28) 0%, transparent 55%), ' +
            'radial-gradient(ellipse 60% 40% at 20% 80%, rgba(6,182,212,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* ── Surface Caustic Light Rays (Optimized) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { left: '12%', w: 90,  dur: '6.2s', delay: '0s',   op: 0.18 },
          { left: '38%', w: 120, dur: '7.5s', delay: '1.2s', op: 0.22 },
          { left: '65%', w: 95,  dur: '6.8s', delay: '0.6s', op: 0.18 },
          { left: '84%', w: 80,  dur: '7.2s', delay: '1.8s', op: 0.15 },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: r.left,
              width: `${r.w}px`,
              height: '75%',
              background:
                'linear-gradient(180deg, rgba(139,92,246,0.75) 0%, rgba(6,182,212,0.28) 45%, transparent 100%)',
              borderRadius: '0 0 50% 50%',
              transformOrigin: 'top center',
              animation: `caustic-sway ${r.dur} ease-in-out ${r.delay} infinite`,
              filter: 'blur(4px)',
              opacity: r.op,
              transform: 'translateZ(0)',
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 max-w-6xl mx-auto w-full"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Top badge with Sonar ping */}
        <div
          className="flex justify-center mb-8"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0) scale(1)' : 'translateY(-15px) scale(0.95)',
            transition: 'all 0.6s ease 0.2s',
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-950/60 border border-violet-500/35 text-violet-300 text-sm font-mono backdrop-blur-md shadow-[0_0_20px_rgba(109,40,217,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="blink absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            </span>
            <span className="text-zinc-100 font-semibold tracking-wide text-[13px] sm:text-sm">{site.jobTitle}</span>
            <span className="text-zinc-500">|</span>
            <span className="text-cyan-300 text-[12px] sm:text-xs font-mono font-medium flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse text-cyan-400" />
              Belajar OSI Layer 1-7
            </span>
          </div>
        </div>

        {/* Main Bento Hero Card */}
        <div
          ref={glowRef}
          className="bento-card p-8 md:p-12 mb-6 relative overflow-hidden border border-violet-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          {/* Cursor-following glow */}
          <div style={glowStyle} />

          {/* Subtle top edge gradient highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 30%, rgba(6,182,212,0.5) 70%, transparent 100%)',
            }}
          />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left: Headline & Bio (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div
                className="flex items-center gap-2 mb-2"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.7s ease 0.5s',
                }}
              >
                <span className="font-mono text-xs font-semibold tracking-wide text-cyan-300">about</span>
                <span className="text-zinc-600">·</span>
                <Waves size={14} className="text-cyan-400 bio-glow shrink-0" />
                <span className="text-[12px] sm:text-xs uppercase tracking-wider font-mono font-semibold text-cyan-300/80">
                  // Depth 2600m • Abyss Architecture
                </span>
              </div>

              {/* Subtitle */}
              <div
                className="text-xs sm:text-[13px] font-mono text-violet-300/90 mb-3"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateX(0)' : 'translateX(-15px)',
                  transition: 'all 0.7s ease 0.55s',
                }}
              >
                {site.subtitle}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold leading-[1.18] mb-5 tracking-tight font-display">
                <span
                  className="text-zinc-50 inline-block"
                  style={{
                    opacity: sectionVisible ? 1 : 0,
                    transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.7s ease 0.6s',
                  }}
                >
                  Designing Secure
                </span>
                <br />
                <span
                  className="bg-clip-text text-transparent text-bio-shimmer inline-block whitespace-nowrap"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, #c4b5fd 0%, #60a5fa 30%, #22d3ee 70%, #c4b5fd 100%)',
                  }}
                >
                  {typewriterText}
                  {!typewriterDone && (
                    <span
                      className="inline-block w-[3px] h-[1em] ml-1 align-middle"
                      style={{
                        background: 'linear-gradient(180deg, #a78bfa, #06b6d4)',
                        animation: 'blink-dot 1s step-end infinite',
                      }}
                    />
                  )}
                </span>
              </h1>

              <p
                className="text-zinc-200 text-base sm:text-[17px] leading-relaxed mb-3.5 font-normal"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s ease 0.9s',
                }}
              >
                Belajar merancang jaringan, segmentasi VLAN, dan dasar keamanan lewat lab simulasi.
              </p>
              <p
                lang="en"
                className="font-mono text-[13px] sm:text-[14px] mb-8 text-cyan-300 font-medium flex items-center gap-2"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s ease 1s',
                }}
              >
                <span className="text-violet-400 font-bold">&gt;&gt;</span>
                {site.tagline}
              </p>

              {/* Action Buttons */}
              <div
                className="flex flex-wrap items-center gap-4"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s ease 1.1s',
                }}
              >
                <a
                  href="#labs"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] transition-all group text-white shadow-lg relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    boxShadow: '0 0 25px rgba(124,58,237,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.65)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(124,58,237,0.4)'
                    e.currentTarget.style.transform = ''
                  }}
                >
                  {/* Shimmer sweep effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                      backgroundSize: '250% 100%',
                      animation: 'shimmer-sweep 3s ease-in-out infinite',
                    }}
                  />
                  <Waves size={16} className="relative z-10" />
                  <span className="relative z-10 font-semibold tracking-wide">Explore Labs</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
                </a>
                <a
                  href="#contact"
                  className="flex items-center gap-2 px-6 py-3 border rounded-xl font-semibold text-[15px] transition-all text-zinc-200 hover:text-cyan-200 backdrop-blur-sm tracking-wide"
                  style={{
                    borderColor: 'rgba(6,182,212,0.3)',
                    background: 'rgba(6,182,212,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'
                    e.currentTarget.style.background = 'rgba(6,182,212,0.1)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'
                    e.currentTarget.style.background = 'rgba(6,182,212,0.05)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <Mail size={16} />
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right: Interactive Terminal with Radar Scope Header (6 cols) */}
            <div
              className="lg:col-span-6 relative"
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateX(0) rotateY(0deg)' : 'translateX(40px) rotateY(-5deg)',
                transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
              }}
            >
              {/* ── Glowing Sonar Scope Backdrop Decor ── */}
              <div
                className="absolute -top-10 -right-8 w-44 h-44 rounded-full border border-cyan-500/15 pointer-events-none hidden sm:flex items-center justify-center overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
                }}
              >
                {/* Sonar sweep cone */}
                <div
                  className="radar-sweep-beam absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 310deg, rgba(6,182,212,0.28) 360deg)',
                  }}
                />
                {/* Concentric rings */}
                <div className="w-32 h-32 rounded-full border border-cyan-500/15" />
                <div className="w-20 h-20 rounded-full border border-cyan-500/20" />
                <div className="w-8 h-8 rounded-full border border-violet-500/30" />
                {/* Crosshairs */}
                <div className="absolute top-0 bottom-0 w-px bg-cyan-500/15" />
                <div className="absolute left-0 right-0 h-px bg-cyan-500/15" />
                {/* Blips */}
                <div
                  className="radar-blip absolute w-2 h-2 rounded-full bg-cyan-400"
                  style={{ top: '28%', left: '68%' }}
                  title="Gateway Switch Active"
                />
                <div
                  className="radar-blip absolute w-1.5 h-1.5 rounded-full bg-violet-400"
                  style={{ top: '70%', left: '35%', animationDelay: '1.2s' }}
                  title="Wireshark Capture Tap"
                />
              </div>

              {/* ── Interactive Terminal Frame ── */}
              <div
                onClick={focusInput}
                className="relative rounded-2xl overflow-hidden cursor-text transition-all duration-300 terminal-float"
                style={{
                  background: 'rgba(3, 7, 18, 0.94)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  boxShadow:
                    '0 0 50px rgba(109, 40, 217, 0.18), 0 20px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                {/* Terminal Window Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b select-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(8,12,28,0.95) 100%)',
                    borderColor: 'rgba(99,102,241,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.5)] hover:bg-red-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_6px_rgba(234,179,8,0.5)] hover:bg-yellow-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_6px_rgba(34,197,94,0.5)] hover:bg-green-400 transition-colors cursor-pointer" />
                    <span className="ml-2 text-xs sm:text-[13px] text-zinc-300 font-mono font-medium flex items-center gap-1.5">
                      <TerminalIcon size={12} className="text-violet-400" />
                      fizhtank@arch: ~
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                      <Activity size={10} className="text-cyan-400 animate-pulse" />
                      INTERACTIVE
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTerminalHistory([])
                      }}
                      title="Clear terminal"
                      aria-label="Bersihkan riwayat terminal"
                      className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800/60 transition-colors"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                {/* Terminal Body Logs */}
                <div
                  ref={terminalBodyRef}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                  aria-label="Riwayat output terminal fizhtank"
                  className="p-4 sm:p-5 font-mono text-[13px] sm:text-[13.5px] space-y-2.5 h-[270px] sm:h-[290px] overflow-y-auto overflow-x-hidden terminal-scroll"
                >
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="leading-relaxed animate-terminal-line"
                      style={{ animationDelay: `${idx * 0.02}s` }}
                    >
                      {item.type === 'cmd' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-violet-400 shrink-0 font-bold text-[13px] sm:text-[13.5px]">fizhtank@arch:~$</span>
                          <span className="text-zinc-100 font-medium text-[13px] sm:text-[13.5px]">{item.text}</span>
                        </div>
                      ) : (
                        <div
                          className={`pl-4 border-l border-zinc-700/60 whitespace-pre-wrap break-words leading-relaxed text-[12.5px] sm:text-[13px] ${item.color || 'text-zinc-300'}`}
                        >
                          {item.text}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 pl-4 text-zinc-400 text-xs sm:text-[13px]">
                      <span>Processing</span>
                      <TypingIndicator />
                    </div>
                  )}

                  {/* Active Input Line */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-violet-400 font-bold shrink-0 text-[13px] sm:text-[13.5px]">fizhtank@arch:~$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="type 'help' or click commands below..."
                      aria-label="Input baris perintah terminal"
                      className="bg-transparent text-cyan-300 outline-none w-full placeholder:text-zinc-400 font-mono text-[13px] sm:text-[13.5px]"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                </div>

                {/* Quick-command suggestions toolbar */}
                <div
                  className="px-3 sm:px-4 py-2 border-t flex flex-wrap items-center gap-1.5 overflow-hidden select-none"
                  style={{
                    background: 'rgba(6, 10, 24, 0.95)',
                    borderColor: 'rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider font-semibold mr-1 hidden sm:inline">
                    Commands:
                  </span>
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd}
                      onClick={(e) => {
                        e.stopPropagation()
                        executeCommand(cmd)
                      }}
                      className="px-2 py-0.5 rounded text-[11px] sm:text-[11.5px] font-mono font-medium transition-all border border-violet-500/30 text-zinc-200 hover:text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-500/15 active:scale-95"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tank Fed Celebration Toast */}
              {tankFed && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-amber-400/40 text-amber-300 text-xs font-mono shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-md z-20 flex items-center gap-2"
                  style={{
                    background: 'rgba(20, 15, 5, 0.95)',
                    animation: 'toast-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                  }}
                >
                  <Fish size={14} className="text-amber-400" />
                  <span className="font-semibold">Tank Fed! Bioluminescence active (+100 XP)</span>
                </div>
              )}

              {/* Ambient bottom glow under terminal */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)',
                  filter: 'blur(16px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Row with Animated Counters & Stagger */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} statsVisible={statsVisible} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, statsVisible, idx }) {
  const Icon = stat.icon
  const count = useAnimatedCounter(stat.numericVal, statsVisible, 1500)

  return (
    <div
      className="bento-card p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 group"
      style={{
        borderColor: stat.borderGlow,
        opacity: statsVisible ? 1 : 0,
        transform: statsVisible ? 'translateY(0)' : 'translateY(25px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + idx * 0.15}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)'
        e.currentTarget.style.boxShadow = `0 8px 30px ${stat.bg}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = stat.borderGlow
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-300"
        style={{ background: stat.bg, borderColor: stat.borderGlow }}
      >
        <Icon size={22} className={stat.color} />
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-50 tracking-tight tabular-nums">
          {count}{stat.suffix}
        </p>
        <p className="text-[13.5px] font-semibold text-zinc-200 mt-0.5">{stat.label}</p>
        <p className="text-[12px] text-zinc-400 font-mono mt-0.5">{stat.desc}</p>
      </div>
    </div>
  )
}

