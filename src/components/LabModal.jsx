import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Target, Map, Terminal, CheckCircle2, ExternalLink, ShieldCheck, Network, Cpu } from 'lucide-react'

// ── SVG Topology Visualizers ──────────────────────────────────
function EnterpriseVlanTopology({ alt }) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 sm:p-4 mb-3">
      <svg
        viewBox="0 0 600 240"
        className="w-full h-auto text-zinc-100"
        role="img"
        aria-label={alt}
      >
        <title>{alt}</title>
        <defs>
          <linearGradient id="coreGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="vlanGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Connection lines from Core to Access */}
        <path d="M 300 65 L 100 155" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M 300 65 L 300 155" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M 300 65 L 500 155" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 2" />

        {/* Trunk Labels */}
        <text x="180" y="105" fill="#93c5fd" fontSize="10" fontFamily="monospace">802.1Q Trunk</text>
        <text x="310" y="115" fill="#67e8f9" fontSize="10" fontFamily="monospace">802.1Q Trunk</text>
        <text x="410" y="105" fill="#d8b4fe" fontSize="10" fontFamily="monospace">802.1Q Trunk</text>

        {/* SW-CORE Node */}
        <rect x="210" y="20" width="180" height="48" rx="8" fill="url(#coreGlow)" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="300" y="42" fill="#eff6ff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SW-CORE (L3 Switch)</text>
        <text x="300" y="58" fill="#93c5fd" fontSize="10" fontFamily="monospace" textAnchor="middle">SVI Routing Engine</text>

        {/* Access Switch SW-IT */}
        <rect x="20" y="155" width="160" height="60" rx="8" fill="url(#vlanGlow)" stroke="#3b82f6" strokeWidth="1.2" />
        <text x="100" y="178" fill="#eff6ff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SW-IT (Access)</text>
        <text x="100" y="194" fill="#60a5fa" fontSize="9.5" fontFamily="monospace" textAnchor="middle">VLAN 10: IT Dept</text>
        <text x="100" y="207" fill="#93c5fd" fontSize="9" fontFamily="monospace" textAnchor="middle">192.168.10.0/24</text>

        {/* Access Switch SW-HR */}
        <rect x="220" y="155" width="160" height="60" rx="8" fill="url(#vlanGlow)" stroke="#06b6d4" strokeWidth="1.2" />
        <text x="300" y="178" fill="#eff6ff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SW-HR (Access)</text>
        <text x="300" y="194" fill="#22d3ee" fontSize="9.5" fontFamily="monospace" textAnchor="middle">VLAN 20: HR Dept</text>
        <text x="300" y="207" fill="#67e8f9" fontSize="9" fontFamily="monospace" textAnchor="middle">192.168.20.0/24 [ACL]</text>

        {/* Access Switch SW-FIN */}
        <rect x="420" y="155" width="160" height="60" rx="8" fill="url(#vlanGlow)" stroke="#a855f7" strokeWidth="1.2" />
        <text x="500" y="178" fill="#eff6ff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SW-FIN (Access)</text>
        <text x="500" y="194" fill="#c084fc" fontSize="9.5" fontFamily="monospace" textAnchor="middle">VLAN 30: Finance</text>
        <text x="500" y="207" fill="#d8b4fe" fontSize="9" fontFamily="monospace" textAnchor="middle">192.168.30.0/24</text>
      </svg>
    </div>
  )
}

function PacketInspectionTopology({ alt }) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 sm:p-4 mb-3">
      <svg
        viewBox="0 0 600 240"
        className="w-full h-auto text-zinc-100"
        role="img"
        aria-label={alt}
      >
        <title>{alt}</title>
        {/* Attacker Tap */}
        <rect x="200" y="15" width="200" height="48" rx="8" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5" />
        <text x="300" y="37" fill="#faf5ff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Wireshark Tap Workstation</text>
        <text x="300" y="52" fill="#d8b4fe" fontSize="9.5" fontFamily="monospace" textAnchor="middle">Promiscuous Mode / SPAN</text>

        {/* Tap line */}
        <path d="M 300 63 L 300 100" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" />
        <text x="305" y="85" fill="#c084fc" fontSize="9.5" fontFamily="monospace">Port Mirror</text>

        {/* Switch */}
        <rect x="180" y="100" width="240" height="38" rx="6" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.2" />
        <text x="300" y="124" fill="#ecfeff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Managed Switch (Shared L2 Segment)</text>

        {/* Branch Lines */}
        <path d="M 230 138 L 100 175" stroke="#ef4444" strokeWidth="1.8" />
        <path d="M 370 138 L 500 175" stroke="#10b981" strokeWidth="1.8" />

        {/* HTTP Target */}
        <rect x="20" y="175" width="170" height="52" rx="8" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="1.2" />
        <text x="105" y="196" fill="#fee2e2" fontSize="10.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">HTTP Client (192.168.1.50)</text>
        <text x="105" y="213" fill="#fca5a5" fontSize="9" fontFamily="monospace" textAnchor="middle">Cleartext POST / Pass Exposed</text>

        {/* HTTPS Target */}
        <rect x="410" y="175" width="170" height="52" rx="8" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1.2" />
        <text x="495" y="196" fill="#ecfdf5" fontSize="10.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">HTTPS Client (192.168.1.51)</text>
        <text x="495" y="213" fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle">TLS 1.3 Encrypted Stream</text>
      </svg>
    </div>
  )
}

function LinuxHomelabTopology({ alt }) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 sm:p-4 mb-3">
      <svg
        viewBox="0 0 600 240"
        className="w-full h-auto text-zinc-100"
        role="img"
        aria-label={alt}
      >
        <title>{alt}</title>
        {/* WAN Node */}
        <rect x="220" y="15" width="160" height="42" rx="6" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.2" />
        <text x="300" y="35" fill="#eff6ff" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">WAN / ISP Gateway</text>
        <text x="300" y="49" fill="#93c5fd" fontSize="9" fontFamily="monospace" textAnchor="middle">192.168.0.1</text>

        <path d="M 300 57 L 300 90" stroke="#10b981" strokeWidth="2" />

        {/* Arch Gateway */}
        <rect x="150" y="90" width="300" height="65" rx="8" fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1.5" />
        <text x="300" y="112" fill="#ecfdf5" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Arch Linux Gateway & DNS (192.168.1.254)</text>
        <text x="300" y="128" fill="#6ee7b7" fontSize="9.5" fontFamily="monospace" textAnchor="middle">UFW Firewall (Stateful) | Pi-hole FTL (Port 53)</text>
        <text x="300" y="142" fill="#a7f3d0" fontSize="9" fontFamily="monospace" textAnchor="middle">Hardened SSH (Port 2222, Ed25519 Only)</text>

        <path d="M 300 155 L 300 185" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

        {/* LAN Clients */}
        <rect x="180" y="185" width="240" height="42" rx="6" fill="rgba(99,102,241,0.1)" stroke="#818cf8" strokeWidth="1.2" />
        <text x="300" y="204" fill="#e0e7ff" fontSize="10.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LAN Clients Subnet (192.168.1.0/24)</text>
        <text x="300" y="218" fill="#a5b4fc" fontSize="9" fontFamily="monospace" textAnchor="middle">Workstations, IoT, Ad-free DNS Resolvers</text>
      </svg>
    </div>
  )
}

function TopologySchematic({ lab }) {
  const type = lab.writeup.topologyDiagramType
  const alt = lab.writeup.topologyAlt || 'Network topology diagram'

  switch (type) {
    case 'enterprise-vlan':
      return <EnterpriseVlanTopology alt={alt} />
    case 'packet-inspection':
      return <PacketInspectionTopology alt={alt} />
    case 'linux-homelab':
      return <LinuxHomelabTopology alt={alt} />
    default:
      return null
  }
}

export default function LabModal({ lab, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sectionsRevealed, setSectionsRevealed] = useState(false)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }, [onClose])

  // Save previous focused trigger and restore on unmount
  useEffect(() => {
    triggerRef.current = document.activeElement
    return () => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [])

  // Animate in on mount and focus close button
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true)
        closeButtonRef.current?.focus()
      })
    })
    const timer = setTimeout(() => setSectionsRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Close on Escape & Tab Focus Trapping
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
  }
  const accent = colorMap[lab.accentColor] || colorMap.blue

  const modalIcon = lab.id === 1 ? Network : lab.id === 2 ? ShieldCheck : Cpu

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        backdropFilter: isOpen ? 'blur(10px)' : 'blur(0px)',
        background: isOpen ? 'rgba(4, 6, 15, 0.85)' : 'rgba(4, 6, 15, 0)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-modal-title"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '0 0 60px rgba(0,0,0,0.8), 0 0 120px rgba(109,40,217,0.1)' : 'none',
        }}
      >
        {/* Animated top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 30%, rgba(6,182,212,0.5) 70%, transparent 100%)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}
              style={{
                transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(-10deg) scale(0.8)',
                transition: 'all 0.5s ease 0.2s',
              }}
            >
              {modalIcon && <modalIcon size={18} />}
            </div>
            <div>
              <span className="text-[12px] text-cyan-300 font-mono font-semibold tracking-wider block mb-0.5">{lab.category}</span>
              <h2 id="lab-modal-title" className="text-xl sm:text-2xl font-bold font-display text-zinc-50 leading-tight">{lab.title}</h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Tutup dialog detail lab"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-all ml-4 shrink-0 hover:rotate-90 active:scale-90"
            style={{ transition: 'all 0.3s ease' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <Section
            icon={Target}
            title="Objective"
            iconClass="text-amber-400"
            visible={sectionsRevealed}
            delay={0}
          >
            <p className="text-zinc-200 text-[14.5px] sm:text-base leading-relaxed">{lab.writeup.objective}</p>
          </Section>

          {/* Topology */}
          <Section
            icon={Map}
            title="Architecture & Topologi (SVG Schematic)"
            iconClass="text-blue-400"
            visible={sectionsRevealed}
            delay={1}
          >
            {/* Embedded Responsive SVG Topology with Alt Text */}
            <TopologySchematic lab={lab} />

            {/* Topology Text Spec */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group">
              <pre className="relative text-[12.5px] sm:text-[13px] text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap">
                {lab.writeup.topologyText || lab.writeup.topology}
              </pre>
            </div>
          </Section>

          {/* Key Commands */}
          <Section
            icon={Terminal}
            title="Key Configuration Commands"
            iconClass="text-violet-400"
            visible={sectionsRevealed}
            delay={2}
          >
            <div className="code-block group hover:border-violet-500/30 transition-colors duration-300">
              {lab.writeup.commands}
            </div>
          </Section>

          {/* Verification */}
          <Section
            icon={CheckCircle2}
            title="Hasil Verifikasi & Output Diagnostik"
            iconClass="text-green-400"
            visible={sectionsRevealed}
            delay={3}
          >
            <div className="space-y-2.5">
              {lab.writeup.verification.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm group/verify"
                  style={{
                    opacity: sectionsRevealed ? 1 : 0,
                    transform: sectionsRevealed ? 'translateX(0)' : 'translateX(-15px)',
                    transition: `all 0.4s ease ${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover/verify:bg-green-500/25 group-hover/verify:border-green-500/50 transition-all duration-300">
                    <span className="text-green-300 text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed font-mono text-[12.5px] sm:text-[13px] group-hover/verify:text-white transition-colors duration-300">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Write-up / Repository Link & Tags */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {lab.tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={lab.repoUrl && lab.repoUrl.startsWith('http') ? lab.repoUrl : 'https://github.com/Fizhkan'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-200 hover:text-white hover:bg-violet-600/30 text-[13px] font-mono font-medium transition-all"
            >
              <ExternalLink size={14} />
              <span>Buka Write-up / Repo Lab</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, iconClass, children, visible = true, delay = 0 }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${0.15 + delay * 0.12}s`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className={iconClass} />
        <h3 className="text-[14.5px] font-bold font-display text-zinc-100 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  )
}
