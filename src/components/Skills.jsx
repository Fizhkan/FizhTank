import { useEffect, useRef, useState } from 'react'
import {
  Network, Terminal, Shield, Wifi, Globe,
  Database, Lock, Eye, Layers, Cpu, HardDrive, Fish
} from 'lucide-react'

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

export default function Skills() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            <span className="font-mono text-sm" style={{ color: 'rgba(6,182,212,0.7)' }}>02. skills</span>
            <Fish size={14} style={{ color: 'rgba(167,139,250,0.5)' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 section-title">
            Core Skills Matrix
          </h2>
          <p className="text-zinc-500 mt-5 max-w-xl">
            The Filter &amp; Ecosystem — every tool in the tank serving a specific purpose in the deep network.
          </p>
        </div>

        {/* Skill Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.id} className="bento-card p-6 flex flex-col gap-5">
                {/* Card Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: group.accent.bg, border: `1px solid ${group.accent.border}` }}
                  >
                    <Icon size={18} style={{ color: group.accent.text }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{group.label}</h3>
                    <p className="text-xs text-zinc-600 mt-0.5">{group.description}</p>
                  </div>
                </div>

                {/* Skill Bars */}
                <div className="space-y-3.5">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-zinc-400">{skill.name}</span>
                        <span className="text-xs font-mono" style={{ color: 'rgba(167,139,250,0.6)' }}>{skill.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{ width: visible ? `${skill.level}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
                  {group.tags.map((tag) => (
                    <span key={tag} className="tech-badge">{tag}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tools Row */}
        <div className="mt-6 bento-card p-6">
          <p className="text-xs font-mono mb-4" style={{ color: 'rgba(6,182,212,0.5)' }}>
            // Toolchain &amp; Ecosystem
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Globe, label: 'Cisco Packet Tracer' },
              { icon: Eye, label: 'Wireshark' },
              { icon: Wifi, label: 'Nmap' },
              { icon: Database, label: 'Pi-hole' },
              { icon: Database, label: 'pfSense' },
              { icon: Lock, label: 'UFW / iptables' },
              { icon: Layers, label: 'VirtualBox' },
              { icon: Cpu, label: 'Arch Linux' },
              { icon: HardDrive, label: 'Proxmox' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all group cursor-default"
                style={{
                  background: 'rgba(8,12,28,0.6)',
                  border: '1px solid rgba(99,102,241,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(6,182,212,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <Icon size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xs text-zinc-500 group-hover:text-zinc-200 transition-colors font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
