import { useRef, useState, useCallback } from 'react'
import {
  Network, Terminal, Shield, Wifi, Globe,
  Database, Lock, Eye, Layers, Cpu, HardDrive, Fish
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const skillGroups = [
  {
    id: 'networking',
    icon: Network,
    label: 'Networking Core',
    accent: { text: '#60a5fa', bg: 'rgba(37,99,235,0.08)', border: 'rgba(59,130,246,0.25)' },
    description: 'Foundation of packet routing and layer 2/3 design',
    skills: [
      { name: 'IPv4 Subnetting & CIDR', level: 90 },
      { name: 'Routing & Switching (OSPF, RIP)', level: 82 },
      { name: 'VLAN & Trunking (802.1Q)', level: 85 },
      { name: 'DHCP / DNS Configuration', level: 88 },
      { name: 'Cisco Packet Tracer', level: 80 },
    ],
    tags: ['IPv4', 'VLAN', 'OSPF', 'STP', 'NAT/PAT'],
  },
  {
    id: 'linux',
    icon: Terminal,
    label: 'Linux & Systems',
    accent: { text: '#34d399', bg: 'rgba(5,150,105,0.08)', border: 'rgba(16,185,129,0.25)' },
    description: 'System administration and automation on Arch-based distros',
    skills: [
      { name: 'EndeavourOS / Arch Linux', level: 85 },
      { name: 'Bash Scripting', level: 75 },
      { name: 'System Administration', level: 80 },
      { name: 'Package Management (pacman/yay)', level: 90 },
      { name: 'Systemd & Service Management', level: 78 },
    ],
    tags: ['Arch', 'Bash', 'systemd', 'pacman', 'cron'],
  },
  {
    id: 'security',
    icon: Shield,
    label: 'Security & Analysis',
    accent: { text: '#a78bfa', bg: 'rgba(109,40,217,0.1)', border: 'rgba(139,92,246,0.25)' },
    description: 'Traffic inspection, recon, and access control enforcement',
    skills: [
      { name: 'Wireshark & Packet Analysis', level: 85 },
      { name: 'Nmap Network Scanning', level: 80 },
      { name: 'Firewall & ACL (UFW/iptables)', level: 78 },
      { name: 'TLS vs Plaintext Analysis', level: 75 },
      { name: 'Network Threat Assessment', level: 70 },
    ],
    tags: ['Wireshark', 'Nmap', 'iptables', 'ACL', 'IDS'],
  },
]

// ── Animated Skill Bar ──────────────────────────────────────
function AnimatedSkillBar({ name, level, visible, delay, accentColor }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group/bar"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <span className="text-[13.5px] font-medium text-zinc-200 group-hover/bar:text-zinc-50 transition-colors duration-300">
          {name}
        </span>
        <span
          className="text-[13px] font-mono font-semibold transition-all duration-300"
          style={{
            color: hovered ? accentColor : 'rgba(196,181,253,0.9)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {level}%
        </span>
      </div>
      <div className="skill-bar-track relative overflow-hidden">
        <div
          className="skill-bar-fill"
          style={{
            width: visible ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
        {/* Animated pulse on the fill edge */}
        {visible && (
          <div
            className="absolute top-0 bottom-0 w-3 rounded-full"
            style={{
              left: `${level}%`,
              transform: 'translateX(-100%)',
              background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent)',
              opacity: hovered ? 0.8 : 0,
              transition: 'opacity 0.3s ease',
              filter: 'blur(2px)',
            }}
          />
        )}
      </div>
    </div>
  )
}

// ── Interactive Skill Card ──────────────────────────────────
function SkillCard({ group, visible, cardIdx }) {
  const Icon = group.icon
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className="bento-card p-6 flex flex-col gap-5 relative overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(35px) scale(0.97)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + cardIdx * 0.15}s`,
      }}
    >
      {/* Mouse-following highlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: mousePos.x - 100,
          top: mousePos.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${group.accent.bg.replace('0.08', '0.15').replace('0.1', '0.18')} 0%, transparent 70%)`,
          borderRadius: '50%',
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
        }}
      />

      {/* Card Header */}
      <div className="flex items-start gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          style={{
            background: group.accent.bg,
            border: `1px solid ${group.accent.border}`,
            boxShadow: isHovered ? `0 0 20px ${group.accent.bg}` : 'none',
          }}
        >
          <Icon
            size={18}
            style={{
              color: group.accent.text,
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'rotate(-10deg)' : 'rotate(0deg)',
            }}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-zinc-100 font-display group-hover:text-white transition-colors">{group.label}</h3>
          <p className="text-[13px] text-zinc-300 mt-1 leading-relaxed">{group.description}</p>
        </div>
      </div>

      {/* Skill Bars */}
      <div className="space-y-3.5 relative z-10">
        {group.skills.map((skill, skillIdx) => (
          <AnimatedSkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            visible={visible}
            delay={200 + cardIdx * 150 + skillIdx * 100}
            accentColor={group.accent.text}
          />
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-3 border-t relative z-10" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        {group.tags.map((tag, tagIdx) => (
          <span
            key={tag}
            className="tech-badge hover:scale-105 active:scale-95 transition-transform cursor-default"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.4s ease ${0.6 + cardIdx * 0.1 + tagIdx * 0.05}s`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Tool Item with hover ripple ──────────────────────────────
function ToolItem({ icon: Icon, label, idx, visible }) {
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-all group/tool cursor-default relative overflow-hidden"
      style={{
        background: 'rgba(8,12,28,0.7)',
        border: '1px solid rgba(99,102,241,0.15)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `all 0.4s ease ${0.3 + idx * 0.06}s, border-color 0.2s, box-shadow 0.2s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'
        e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.12)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <Icon size={15} className="text-cyan-400 group-hover/tool:text-cyan-300 transition-colors duration-300 shrink-0" />
      <span className="text-[13px] text-zinc-200 group-hover/tool:text-white transition-colors duration-300 font-mono font-medium">{label}</span>
    </div>
  )
}

export default function Skills() {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 })
  const [toolsRef, toolsVisible] = useScrollReveal({ threshold: 0.2 })

  const tools = [
    { icon: Globe, label: 'Cisco Packet Tracer' },
    { icon: Eye, label: 'Wireshark' },
    { icon: Wifi, label: 'Nmap' },
    { icon: Database, label: 'Pi-hole' },
    { icon: Database, label: 'pfSense' },
    { icon: Lock, label: 'UFW / iptables' },
    { icon: Layers, label: 'VirtualBox' },
    { icon: Cpu, label: 'Arch Linux' },
    { icon: HardDrive, label: 'Proxmox' },
  ]

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px transition-all duration-700"
              style={{
                width: headerVisible ? '32px' : '0px',
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              }}
            />
            <span className="font-mono text-sm font-semibold tracking-wide text-cyan-300">02. skills</span>
            <Fish
              size={14}
              style={{
                color: 'rgba(167,139,250,0.7)',
                transform: headerVisible ? 'translateX(0) rotate(0deg)' : 'translateX(-10px) rotate(-20deg)',
                transition: 'all 0.5s ease 0.3s',
              }}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
            Core Skills Matrix
          </h2>
          <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
            The Filter &amp; Ecosystem — every tool in the tank serving a specific purpose in the deep network.
          </p>
        </div>

        {/* Skill Grid */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group, idx) => (
            <SkillCard key={group.id} group={group} visible={gridVisible} cardIdx={idx} />
          ))}
        </div>

        {/* Tools Row */}
        <div
          ref={toolsRef}
          className="mt-6 bento-card p-6 relative overflow-hidden"
          style={{
            opacity: toolsVisible ? 1 : 0,
            transform: toolsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}
        >
          <p
            className="text-xs sm:text-[13px] font-mono font-semibold mb-4 text-cyan-300 tracking-wider"
          >
            // Toolchain &amp; Ecosystem
          </p>
          <div className="flex flex-wrap gap-3">
            {tools.map(({ icon, label }, idx) => (
              <ToolItem key={label} icon={icon} label={label} idx={idx} visible={toolsVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
