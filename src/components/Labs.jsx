import { useState, lazy, Suspense } from 'react'
import { ArrowUpRight, Network, ShieldCheck, Cpu } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'
import { playWaterBubble } from '../utils/audio'

const LabModal = lazy(() => import('./LabModal'))

// ── Interactive Architectural SVG Schematics for each Specimen ──
function SpecimenBlueprint({ labId }) {
  if (labId === 1) {
    return (
      <div className="w-full h-56 sm:h-64 rounded-xl bg-slate-950/90 border border-cyan-500/20 p-4 font-mono text-[11px] relative overflow-hidden flex flex-col justify-between shadow-[inset_0_0_30px_rgba(6,182,212,0.05)]">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2 relative z-10">
          <span className="text-cyan-400 font-semibold tracking-wider">TOPOLOGY: CISCO INTER-VLAN (802.1Q)</span>
          <span className="text-emerald-400 font-bold">STATUS: PLANNED ARCHITECTURE</span>
        </div>

        {/* Schematic diagram */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-4">
          {/* Core Switch Node */}
          <div className="px-4 py-2 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Network size={14} className="text-cyan-400" />
            <span>CORE-L3-SWITCH // SVI ROUTING [OSPF]</span>
          </div>

          {/* Trunk Lines */}
          <div className="w-48 sm:w-64 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-slate-950 px-1.5 text-slate-500">
              802.1Q TRUNK
            </span>
          </div>

          {/* 3 Department VLANs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
            <div className="p-2 rounded border border-white/10 bg-white/[0.02] text-center">
              <span className="text-cyan-400 font-bold block text-[10px]">VLAN 10</span>
              <span className="text-slate-300 text-[10px]">IT OPS</span>
              <span className="text-slate-500 text-[9px] block">192.168.10.0/24</span>
            </div>
            <div className="p-2 rounded border border-amber-500/30 bg-amber-500/5 text-center">
              <span className="text-amber-400 font-bold block text-[10px]">VLAN 20</span>
              <span className="text-slate-300 text-[10px]">HR DEPT</span>
              <span className="text-slate-500 text-[9px] block">192.168.20.0/24</span>
            </div>
            <div className="p-2 rounded border border-purple-500/30 bg-purple-500/5 text-center relative">
              <span className="absolute -top-1.5 -right-1.5 px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[8px] font-bold">
                ACL LOCK
              </span>
              <span className="text-purple-400 font-bold block text-[10px]">VLAN 30</span>
              <span className="text-slate-300 text-[10px]">FINANCE</span>
              <span className="text-slate-500 text-[9px] block">192.168.30.0/24</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5 relative z-10">
          <span>EXTENDED ACL: DENY VLAN 20 -&gt; VLAN 30</span>
          <span>STP: RAPID-PVST+ ENABLED</span>
        </div>
      </div>
    )
  }

  if (labId === 2) {
    return (
      <div className="w-full h-56 sm:h-64 rounded-xl bg-slate-950/90 border border-violet-500/20 p-4 font-mono text-[11px] relative overflow-hidden flex flex-col justify-between shadow-[inset_0_0_30px_rgba(139,92,246,0.05)]">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2 relative z-10">
          <span className="text-violet-400 font-semibold tracking-wider">TAP: WIRESHARK PACKET SNIFFER</span>
          <span className="text-cyan-400 font-bold">STREAM REASSEMBLY</span>
        </div>

        {/* Packet Stream Matrix */}
        <div className="relative z-10 flex flex-col gap-2 my-auto">
          <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-rose-300 font-bold">HTTP / FTP (CLEARTEXT)</span>
            </div>
            <span className="text-rose-400/90 text-[10px]">EXPOSED CREDENTIALS IN PAYLOAD</span>
          </div>

          <div className="flex items-center justify-center my-0.5">
            <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
              VS // CRYPTOGRAPHIC MITIGATION
            </span>
          </div>

          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-bold">TLS 1.3 / HTTPS (AEAD CIPHER)</span>
            </div>
            <span className="text-emerald-400/90 text-[10px]">ECDHE KEY EXCHANGE ENCRYPTED</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5 relative z-10">
          <span>PCAP DISPLAY FILTER: tcp.port == 443 || http</span>
          <span>TCP 3-WAY HANDSHAKE OBSERVED</span>
        </div>
      </div>
    )
  }

  // Lab 3
  return (
    <div className="w-full h-56 sm:h-64 rounded-xl bg-slate-950/90 border border-emerald-500/20 p-4 font-mono text-[11px] relative overflow-hidden flex flex-col justify-between shadow-[inset_0_0_30px_rgba(16,185,129,0.05)]">
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2 relative z-10">
        <span className="text-emerald-400 font-semibold tracking-wider">GATEWAY: ARCH LINUX HOMELAB</span>
        <span className="text-cyan-400 font-bold">STATEFUL UFW / PI-HOLE</span>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-3">
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="p-2 rounded bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 text-[10px] block font-bold mb-1">UFW FIREWALL POLICY</span>
            <span className="text-rose-400 block text-[10px] font-semibold">DEFAULT: DENY (INCOMING)</span>
            <span className="text-emerald-400 block text-[10px] font-semibold">ALLOW: 2202/TCP (SSH KEY)</span>
          </div>

          <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20">
            <span className="text-emerald-400 text-[10px] block font-bold mb-1">PI-HOLE DNS SINKHOLE</span>
            <span className="text-slate-300 block text-[10px]">PORT 53 (UDP/TCP)</span>
            <span className="text-cyan-400 block text-[10px] font-semibold">BLOCKLIST: 140,000+ DOMAINS</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/90 border border-white/10 w-full flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">NMAP AUDIT RESULT:</span>
          <span className="text-slate-200 text-[10px] font-bold">0 UNWANTED OPEN PORTS DETECTED</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5 relative z-10">
        <span>IPTABLES FORWARDING: ESTABLISHED,RELATED</span>
        <span>ARCH LINUX // SYSTEMD-RESOLVED</span>
      </div>
    </div>
  )
}

export default function Labs() {
  const [activeLabId, setActiveLabId] = useState(1)
  const [modalLab, setModalLab] = useState(null)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.1 })

  const currentLab = labsData.find((l) => l.id === activeLabId) || labsData[0]

  const handleSelectLab = (id) => {
    playWaterBubble()
    setActiveLabId(id)
  }

  return (
    <section id="labs" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* ── Editorial Header Bar ── */}
      <div
        ref={headerRef}
        className="mb-14 sm:mb-18 transition-all duration-700"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 flex items-center gap-2">
          <span>// 002</span>
          <span className="w-8 h-px bg-cyan-500/40" />
          <span>Research Dossiers &amp; Lab Architecture</span>
        </p>

        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] leading-tight text-white font-display uppercase">
              Network Specimen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
                &amp; Lab Blueprints.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              Eksplorasi arsitektur jaringan virtual dan keamanan siber. Setiap spesimen dilengkapi rancangan topologi, parameter simulasi, dan rencana pengujian terperinci.
            </p>
          </div>
        </div>
      </div>

      {/* ── Asymmetric Exhibition Layout ── */}
      <div
        ref={contentRef}
        className="grid lg:grid-cols-12 gap-8 items-start transition-all duration-700"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        {/* Left: Active Specimen Showcase & Topology Blueprint (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl apple-glass p-6 sm:p-8 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Blueprint Canvas Display */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-white font-bold tracking-wider">
                  SPECIMEN DOSSIER 0{currentLab.id}
                </span>
                <span className="text-slate-600">//</span>
                <span className="text-cyan-400">{currentLab.category}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                {currentLab.status}
              </span>
            </div>

            {/* Specimen Title & Abstract */}
            <div className="mt-6">
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white leading-tight">
                {currentLab.title}
              </h3>

              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {currentLab.description}
              </p>
            </div>

            {/* Interactive Architecture Schematic */}
            <div className="mt-6">
              <SpecimenBlueprint labId={currentLab.id} />
            </div>

            {/* Research Objective Preview */}
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold block mb-1.5 uppercase tracking-wider text-[11px]">
                OBJECTIVE &amp; VERIFICATION FOCUS:
              </span>
              <p className="leading-relaxed text-slate-300">
                {currentLab.writeup.objective}
              </p>
            </div>

            {/* Planned Milestones (First 3) */}
            <div className="mt-4 space-y-1.5 font-mono text-xs text-slate-400">
              {currentLab.writeup.plannedSteps.slice(0, 3).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">{`[${idx + 1}]`}</span>
                  <span className="text-slate-300">{step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {currentLab.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                playWaterBubble()
                setModalLab(currentLab)
              }}
              data-cursor="INSPECT"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-95"
            >
              <span>INSPECT FULL DOSSIER</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Specimen Selector Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-2">
            <span>INDEX OF SPECIMENS</span>
            <span className="text-cyan-400 font-bold">{labsData.length} TOTAL DOSSIERS</span>
          </div>

          {labsData.map((lab) => {
            const isSelected = lab.id === activeLabId
            const Icon = lab.id === 1 ? Network : lab.id === 2 ? ShieldCheck : Cpu

            return (
              <div
                key={lab.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectLab(lab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectLab(lab.id)
                  }
                }}
                data-cursor="SELECT"
                className={`p-6 rounded-2xl border transition-all duration-300 text-left cursor-pointer group select-none ${
                  isSelected
                    ? 'border-cyan-400/60 bg-slate-900/90 shadow-[0_10px_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                    : 'border-white/10 bg-slate-950/60 hover:bg-slate-900/50 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold text-sm">0{lab.id}</span>
                    <span className="text-slate-500">//</span>
                    <span className="text-slate-300 font-medium">{lab.category}</span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {lab.status}
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 scale-105'
                        : 'bg-white/[0.04] border border-white/10 text-cyan-400 group-hover:scale-105'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-base font-bold font-display transition-colors line-clamp-1 ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'
                      }`}
                    >
                      {lab.title}
                    </h4>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lab.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono pt-3 border-t border-white/5">
                  <span className="text-slate-500 text-[11px]">{lab.tags.slice(0, 3).join(' • ')}</span>
                  <span
                    className={`font-semibold transition-colors text-[11px] ${
                      isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    {isSelected ? 'ACTIVE VIEWPORT' : 'CLICK TO VIEW'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Modal Dialog for Deep Research Dossier Inspection ── */}
      {modalLab && (
        <Suspense fallback={null}>
          <LabModal lab={modalLab} onClose={() => setModalLab(null)} />
        </Suspense>
      )}
    </section>
  )
}
