import { useState, useRef, useCallback, lazy, Suspense } from 'react'
import { ArrowUpRight, Network, Eye, Terminal, Fish, Waves } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const LabModal = lazy(() => import('./LabModal'))

export const labsData = [
  {
    id: 1,
    icon: Network,
    title: 'Enterprise Multi-VLAN Segmentation',
    category: 'Network Design',
    status: 'Complete',
    description:
      'Designed a scalable enterprise topology dengan segmentasi VLAN multi-departemen — IT, HR, Finance, dan Management — menggunakan Inter-VLAN Routing via Layer 3 Switch dan ACL berbasis kebijakan keamanan antar segmen.',
    tags: ['Cisco Packet Tracer', 'Inter-VLAN', 'ACL', 'STP', 'OSPF'],
    accentColor: 'blue',
    writeup: {
      objective:
        'Membangun topologi jaringan enterprise dengan minimal 4 VLAN berbeda, mengimplementasikan inter-VLAN routing via L3 switch, dan membatasi komunikasi antar departemen menggunakan ACL.',
      topology:
        'Core L3 Switch (SW-CORE) → Access Layer Switches (SW-IT, SW-HR, SW-FIN) → End Devices per VLAN\nVLAN 10: IT (192.168.10.0/24)\nVLAN 20: HR (192.168.20.0/24)\nVLAN 30: Finance (192.168.30.0/24)\nVLAN 99: Management (192.168.99.0/24)',
      commands: `! Configure VLAN on Core Switch
vlan 10
 name IT
vlan 20
 name HR
vlan 30
 name Finance
!
! SVIs for Inter-VLAN Routing
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
! ACL – Block HR to Finance
ip access-list extended BLOCK_HR_FINANCE
 deny ip 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255
 permit ip any any
!
interface vlan 20
 ip access-group BLOCK_HR_FINANCE in`,
      verification: [
        'ping 192.168.10.1 dari host IT → Success (VLAN 10 reachable)',
        'ping 192.168.30.x dari host HR → Request Timeout (ACL blocking)',
        'show vlan brief → semua VLAN active di switch',
        'show ip route → routing table menunjukkan semua SVI network',
        'traceroute antar VLAN menunjukkan L3 switch sebagai next-hop',
      ],
    },
  },
  {
    id: 2,
    icon: Eye,
    title: 'Packet Stream & Credential Inspection',
    category: 'Security Analysis',
    status: 'Complete',
    description:
      'Melakukan capture dan analisis mendalam terhadap aliran paket jaringan menggunakan Wireshark. Membandingkan transmisi credential plaintext pada protokol HTTP/FTP vs enkripsi TLS pada HTTPS/SFTP.',
    tags: ['Wireshark', 'TLS Analysis', 'HTTP/FTP', 'Display Filters', 'pcapng'],
    accentColor: 'violet',
    writeup: {
      objective:
        'Mendemonstrasikan risiko keamanan pada protokol plaintext dan perbedaan fundamental antara HTTP vs HTTPS pada level packet capture untuk meningkatkan security awareness.',
      topology:
        'Attacker Machine (Wireshark) ←[Promiscuous Mode]→ Network Switch\n→ Victim Machine A: HTTP/FTP Client\n→ Victim Machine B: HTTPS/SFTP Client\nKedua mesin terhubung ke switch yang sama (shared segment)',
      commands: `# Wireshark Display Filter – Tangkap HTTP POST
http.request.method == "POST"

# Filter credential di FTP
ftp.request.command == "PASS"

# Follow TCP Stream di HTTP login
# Right-click packet → Follow → TCP Stream
# Hasil: username=admin&password=rahasia123 (plaintext!)

# Filter TLS Handshake
tls.handshake.type == 1

# Verifikasi enkripsi TLS
tls.record.content_type == 23
# Application Data → encrypted, tidak terbaca`,
      verification: [
        'HTTP POST login → credential visible in plaintext: "password=rahasia123"',
        'FTP PASS command → password exposed: "PASS s3cr3tpassword"',
        'HTTPS traffic → hanya terlihat TLS Application Data (encrypted)',
        'Certificate chain HTTPS terverifikasi via TLS handshake capture',
        'Kesimpulan: HTTP/FTP BUKAN untuk transmisi data sensitif',
      ],
    },
  },
  {
    id: 3,
    icon: Terminal,
    title: 'Linux Network Firewall & Homelab Service',
    category: 'Linux & Homelab',
    status: 'Complete',
    description:
      'Membangun homelab berbasis Arch Linux dengan konfigurasi firewall UFW/iptables yang ketat, local DNS server dengan Pi-hole, dan layanan monitoring jaringan internal.',
    tags: ['Arch Linux', 'UFW', 'iptables', 'Pi-hole', 'Local DNS'],
    accentColor: 'green',
    writeup: {
      objective:
        'Membangun lingkungan homelab yang aman dengan firewall multi-layer, ad-blocking DNS, dan monitoring traffic internal menggunakan tools open-source di Arch Linux.',
      topology:
        'ISP Router → [Arch Linux Gateway]\n├── UFW Firewall (stateful)\n├── Pi-hole DNS Server (port 53)\n├── Monitoring: ntopng / vnstat\n└── LAN Clients (192.168.1.0/24)',
      commands: `# Update & Install
sudo pacman -Syu
sudo pacman -S ufw pihole-standalone nmap

# UFW Firewall Setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 53/udp  # DNS
sudo ufw enable

# iptables – Block specific range
sudo iptables -A INPUT -s 10.0.0.0/8 -j DROP
sudo iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT

# Pi-hole DNS
pihole -a setdns 1.1.1.1,8.8.8.8
sudo systemctl enable pihole-FTL
sudo systemctl start pihole-FTL

# Verify firewall
sudo ufw status verbose
sudo iptables -L -n -v`,
      verification: [
        'ufw status → Active, default deny incoming confirmed',
        'nmap -sV localhost → hanya port yang diizinkan terbuka (22, 80, 443)',
        'dig @192.168.1.1 example.com → DNS Pi-hole responding',
        'Pi-hole dashboard → query logging aktif, ads blocked',
        'vnstat → monitoring bandwidth berjalan normal per interface',
      ],
    },
  },
]

function LabCard({ lab, onClick, visible, cardIdx }) {
  const Icon = lab.icon
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const colorMap = {
    blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400', glow: 'rgba(59,130,246,0.12)' },
    violet: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30', icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400', glow: 'rgba(139,92,246,0.12)' },
    green: { badge: 'bg-green-500/10 text-green-300 border-green-500/30', icon: 'bg-green-500/10 border-green-500/20 text-green-400', glow: 'rgba(34,197,94,0.12)' },
  }
  const colors = colorMap[lab.accentColor]

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
      className="bento-card p-6 flex flex-col gap-4 cursor-pointer group relative overflow-hidden"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + cardIdx * 0.15}s`,
      }}
    >
      {/* Mouse-following spotlight */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: mousePos.x - 120,
          top: mousePos.y - 120,
          width: 240,
          height: 240,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          borderRadius: '50%',
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
        }}
      />

      {/* Top Row */}
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colors.icon}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11.5px] px-2.5 py-0.5 rounded-full border font-mono font-medium ${colors.badge}`}
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${0.4 + cardIdx * 0.1}s`,
            }}
          >
            {lab.status}
          </span>
          <ArrowUpRight
            size={16}
            className="text-zinc-400 group-hover:text-violet-300 transition-all duration-300"
            style={{
              transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
            }}
          />
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative z-10">
        <span className="text-[12px] text-cyan-300 font-mono font-semibold tracking-wider mb-1.5 block">{lab.category}</span>
        <h3 className="font-bold text-lg sm:text-[19px] text-zinc-50 mb-2.5 group-hover:text-violet-200 transition-colors leading-snug font-display">
          {lab.title}
        </h3>
        <p className="text-[14px] text-zinc-300 leading-relaxed line-clamp-3">{lab.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/60 relative z-10">
        {lab.tags.slice(0, 4).map((tag, tagIdx) => (
          <span
            key={tag}
            className="tech-badge transition-all duration-200 hover:scale-105"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              transition: `all 0.4s ease ${0.5 + cardIdx * 0.1 + tagIdx * 0.06}s`,
            }}
          >
            {tag}
          </span>
        ))}
        {lab.tags.length > 4 && (
          <span className="tech-badge">+{lab.tags.length - 4}</span>
        )}
      </div>

      {/* CTA */}
      <button
        className="w-full text-center text-[13.5px] font-semibold text-violet-300 border border-violet-500/35 hover:bg-violet-500/15 hover:text-white rounded-lg py-2.5 transition-all mt-1 relative z-10 active:scale-[0.98] hover:border-violet-500/55 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        onClick={onClick}
      >
        View Lab Write-up →
      </button>
    </div>
  )
}

export default function Labs() {
  const [selectedLab, setSelectedLab] = useState(null)
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [cardsRef, cardsVisible] = useScrollReveal({ threshold: 0.1 })
  const [methodRef, methodVisible] = useScrollReveal({ threshold: 0.2 })

  return (
    <section id="labs" className="py-24 px-6">
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
            <span className="font-mono text-sm font-semibold tracking-wide text-cyan-300">03. labs</span>
            <Fish size={14} style={{ color: 'rgba(167,139,250,0.7)' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
            Featured Labs
          </h2>
          <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
            The Tank Showcase — real-world network &amp; security experiments with full write-ups.
          </p>
        </div>

        {/* Bento Lab Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {labsData.map((lab, idx) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onClick={() => setSelectedLab(lab)}
              visible={cardsVisible}
              cardIdx={idx}
            />
          ))}
        </div>

        {/* Large feature card */}
        <div
          ref={methodRef}
          className="mt-6 bento-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          style={{
            opacity: methodVisible ? 1 : 0,
            transform: methodVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.7s ease 0.2s',
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Waves size={16} style={{ color: '#06b6d4' }} />
              <span className="text-[12px] font-mono font-semibold text-cyan-300 tracking-wider">// Methodology</span>
            </div>
            <h3 className="text-xl font-bold font-display text-zinc-50 mb-2">Lab Write-up Framework</h3>
            <p className="text-zinc-300 text-[14.5px] leading-relaxed">
              Setiap lab mengikuti format standar: Objective → Architecture/Topology → Key Commands → Verification Result.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0">
            {['📌 Define Objective', '🗺️ Map Topology', '⚙️ Configure & Run', '✅ Verify Results'].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2.5 text-[13.5px] text-zinc-200 font-mono font-medium"
                style={{
                  opacity: methodVisible ? 1 : 0,
                  transform: methodVisible ? 'translateX(0)' : 'translateX(20px)',
                  transition: `all 0.5s ease ${0.4 + i * 0.12}s`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
                    boxShadow: methodVisible ? `0 0 6px ${i % 2 === 0 ? 'rgba(124,58,237,0.5)' : 'rgba(6,182,212,0.5)'}` : 'none',
                  }}
                />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLab && (
        <Suspense fallback={null}>
          <LabModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
        </Suspense>
      )}
    </section>
  )
}
