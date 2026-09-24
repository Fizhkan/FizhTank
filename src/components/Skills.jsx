import { useEffect, useRef, useState } from 'react'
import {
  Network, Server, Shield, Terminal, Wifi, Globe,
  Database, Lock, Eye, Layers, Cpu, HardDrive
} from 'lucide-react'

const skillGroups = [
  {
    id: 'networking',
    icon: Network,
    label: 'Networking Core',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
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
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
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
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
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
            <div className="h-px w-8 bg-violet-500/50" />
            <span className="text-violet-400 font-mono text-sm">02. skills</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 section-title">
            Core Skills Matrix
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl">
            The filter & ecosystem — every tool in the tank serving a specific purpose.
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
                  <div className={`w-10 h-10 rounded-lg ${group.bgColor} border ${group.borderColor} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={group.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{group.label}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{group.description}</p>
                  </div>
                </div>

                {/* Skill Bars */}
                <div className="space-y-3">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-zinc-400">{skill.name}</span>
                        <span className="text-xs text-zinc-600 font-mono">{skill.level}%</span>
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
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
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
          <p className="text-xs text-zinc-500 font-mono mb-4">// Toolchain & Environment</p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Globe, label: 'Cisco Packet Tracer' },
              { icon: Eye, label: 'Wireshark' },
              { icon: Wifi, label: 'Nmap' },
              { icon: Server, label: 'Pi-hole' },
              { icon: Database, label: 'pfSense' },
              { icon: Lock, label: 'UFW / iptables' },
              { icon: Layers, label: 'VirtualBox' },
              { icon: Cpu, label: 'Arch Linux' },
              { icon: HardDrive, label: 'Proxmox' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/30 transition-colors group"
              >
                <Icon size={14} className="text-zinc-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
