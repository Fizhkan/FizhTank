import { useState } from 'react'
import { Network, Terminal, Shield, Layers } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skillGroups, toolsData } from '../data/skillsData'
import { playWaterBubble } from '../utils/audio'

const groupIcons = {
  networking: Network,
  linux: Terminal,
  security: Shield,
}

// OSI Stack Model for Interactive Inspection
const OSI_LAYERS = [
  { layer: 'L7 Application', protocols: 'HTTP/HTTPS, DNS, SSH, DHCP', focus: 'Port 80/443, 53, 22 inspection & cleartext credential analysis' },
  { layer: 'L4 Transport', protocols: 'TCP, UDP', focus: 'TCP 3-way handshake (SYN, SYN-ACK, ACK), window sizing, UDP stream capture' },
  { layer: 'L3 Network', protocols: 'IPv4, ICMP, OSPF, ARP', focus: 'CIDR subnetting, VLSM allocation, SVI routing, IP header TTL inspection' },
  { layer: 'L2 Data Link', protocols: 'Ethernet II, 802.1Q, STP', focus: 'VLAN tagging, trunking encapsulation, MAC address table learning, PVST+' },
]

export default function Skills() {
  const [activeTab, setActiveTab] = useState('networking') // 'networking' | 'linux' | 'security' | 'osi'
  const [activeOsiLayer, setActiveOsiLayer] = useState(0)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [bodyRef, bodyVisible] = useScrollReveal({ threshold: 0.1 })

  const currentGroup = skillGroups.find((g) => g.id === activeTab)

  const handleTabChange = (tabId) => {
    playWaterBubble()
    setActiveTab(tabId)
  }

  return (
    <section id="skills" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* ── Architectural Header ── */}
      <div
        ref={headerRef}
        className="mb-14 sm:mb-18 transition-all duration-700"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 flex items-center gap-2">
          <span>// 003</span>
          <span className="w-8 h-px bg-cyan-500/40" />
          <span>Technical Competencies &amp; Protocols</span>
        </p>

        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] leading-tight text-white font-display uppercase">
              Station Protocols &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
                Core Competencies.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              Eksplorasi berbasis pemahaman fundamental, tanpa persentase semu. Setiap kompetensi diuji lewat simulasi lab Packet Tracer dan administrasi sistem secara langsung.
            </p>
          </div>
        </div>
      </div>

      {/* ── Interactive Competency Console ── */}
      <div
        ref={bodyRef}
        className="transition-all duration-700 rounded-2xl apple-glass shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        style={{
          opacity: bodyVisible ? 1 : 0,
          transform: bodyVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        {/* Module Switcher Tab Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3.5 bg-white/[0.02] gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
            <span className="font-semibold tracking-wider uppercase">PROTOCOL DOMAIN SELECTOR</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs">
            {skillGroups.map((group, idx) => {
              const isSelected = activeTab === group.id
              const Icon = groupIcons[group.id] || Network

              return (
                <button
                  key={group.id}
                  onClick={() => handleTabChange(group.id)}
                  data-cursor="MODULE"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={13} />
                  <span>0{idx + 1} {group.label.split(' ')[0].toUpperCase()}</span>
                </button>
              )
            })}

            <button
              onClick={() => handleTabChange('osi')}
              data-cursor="INSPECT"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'osi'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers size={13} />
              <span>OSI STACK</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        {currentGroup && activeTab !== 'osi' && (
          <div className="p-6 sm:p-10">
            {/* Domain Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  DOMAIN SPECIFICATION // {currentGroup.id.toUpperCase()}
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  {currentGroup.label}
                </h3>
                <p className="mt-1 text-slate-400 text-sm max-w-2xl leading-relaxed">
                  {currentGroup.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {currentGroup.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Competency Dossiers Grid */}
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentGroup.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase shrink-0 border ${
                          skill.level === 'Dasar'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : skill.level === 'Belajar'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed font-normal">
                      {skill.context}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>VERIFICATION</span>
                    <span className="text-slate-400 font-medium">SIMULATION LAB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: OSI Stack Protocol Explorer */}
        {activeTab === 'osi' && (
          <div className="p-6 sm:p-10">
            <div className="pb-6 border-b border-white/10">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                LAYER-BY-LAYER ARCHITECTURE // TCP/IP &amp; OSI MODEL
              </span>
              <h3 className="text-2xl font-bold font-display text-white">
                Interactive Protocol Stack Breakdown
              </h3>
              <p className="mt-1 text-slate-400 text-sm max-w-2xl leading-relaxed">
                Inspeksi mekanisme enkapsulasi paket dari Layer 7 Application hingga Layer 2 Data Link yang dianalisis dalam simulasi lab dan Wireshark.
              </p>
            </div>

            <div className="mt-8 grid lg:grid-cols-12 gap-6 items-start">
              {/* Stack Layers (Left, 5 cols) */}
              <div className="lg:col-span-5 space-y-2.5 font-mono text-xs">
                {OSI_LAYERS.map((layer, idx) => {
                  const isSelected = activeOsiLayer === idx
                  return (
                    <button
                      key={layer.layer}
                      onClick={() => {
                        playWaterBubble()
                        setActiveOsiLayer(idx)
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400/60 bg-cyan-950/40 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40'
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span className={isSelected ? 'text-cyan-300' : 'text-slate-200'}>
                          {layer.layer}
                        </span>
                        <span className="text-[10px] opacity-75">STACK 0{4 - idx}</span>
                      </div>
                      <span className="mt-1 block text-slate-400 text-xs">
                        {layer.protocols}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Layer Inspector Detail (Right, 7 cols) */}
              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-slate-900/60 p-6 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">
                    {OSI_LAYERS[activeOsiLayer].layer} INSPECTION
                  </span>
                  <span className="text-emerald-400 font-semibold">DEEP PACKET FOCUS</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block uppercase font-bold">PROTOCOLS IN SCOPE:</span>
                    <span className="text-white text-sm font-semibold">{OSI_LAYERS[activeOsiLayer].protocols}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block uppercase font-bold">LAB INVESTIGATION:</span>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1">
                      {OSI_LAYERS[activeOsiLayer].focus}
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-cyan-300">
                    <span className="text-slate-500 block mb-1">PACKET CAPTURE SNIPPET:</span>
                    <code>Frame 142: {OSI_LAYERS[activeOsiLayer].layer.split(' ')[0]} Frame Length: 1514 bytes on wire</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Verified Tooling & Ecosystem Ribbon ── */}
        <div className="border-t border-white/10 p-6 sm:px-10 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4 font-mono text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">LAB TOOLS &amp; WORKSTATION ECOSYSTEM</span>
            <span className="text-[11px] text-slate-500">HONEST EXPERIENCED VS ROADMAP</span>
          </div>

          <div className="flex flex-wrap gap-2.5 font-mono text-xs">
            {toolsData.map((tool) => (
              <div
                key={tool.label}
                className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                  tool.used
                    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-medium'
                    : 'border-white/10 bg-white/[0.02] text-slate-500 opacity-60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    tool.used ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
                <span>{tool.label}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  {tool.used ? '[ACTIVE]' : '[ROADMAP]'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
