import { useState } from 'react'
import { ArrowUpRight, Network, Eye, Terminal, Shield, Layers, Wifi } from 'lucide-react'
import LabModal from './LabModal'

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

export default function Labs() {
  const [selectedLab, setSelectedLab] = useState(null)

  return (
    <section id="labs" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-violet-500/50" />
            <span className="text-violet-400 font-mono text-sm">03. labs</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 section-title">
            Featured Labs
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl">
            The Tank Showcase — real-world network & security labs with full write-ups.
          </p>
        </div>

        {/* Bento Lab Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {labsData.map((lab) => (
            <LabCard key={lab.id} lab={lab} onClick={() => setSelectedLab(lab)} />
          ))}
        </div>

        {/* Large feature card */}
        <div className="mt-6 bento-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={16} className="text-violet-400" />
              <span className="text-xs font-mono text-violet-400">Methodology</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Lab Write-up Framework</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Setiap lab mengikuti format standar: Objective → Architecture/Topology → Key Commands → Verification Result. Pendekatan ini memastikan reproduktivitas dan dokumentasi yang jelas untuk setiap skenario.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {['📌 Define Objective', '🗺️ Map Topology', '⚙️ Configure & Run', '✅ Verify Results'].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLab && (
        <LabModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
      )}
    </section>
  )
}

function LabCard({ lab, onClick }) {
  const Icon = lab.icon
  const colorMap = {
    blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    violet: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30', icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
    green: { badge: 'bg-green-500/10 text-green-300 border-green-500/30', icon: 'bg-green-500/10 border-green-500/20 text-green-400' },
  }
  const colors = colorMap[lab.accentColor]

  return (
    <div
      className="bento-card p-6 flex flex-col gap-4 cursor-pointer group"
      onClick={onClick}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colors.icon}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${colors.badge}`}>
            {lab.status}
          </span>
          <ArrowUpRight
            size={16}
            className="text-zinc-600 group-hover:text-violet-400 transition-colors"
          />
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <span className="text-xs text-zinc-500 font-mono mb-1 block">{lab.category}</span>
        <h3 className="font-bold text-zinc-100 mb-2 group-hover:text-violet-300 transition-colors leading-snug">
          {lab.title}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{lab.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/60">
        {lab.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="tech-badge">{tag}</span>
        ))}
        {lab.tags.length > 4 && (
          <span className="tech-badge">+{lab.tags.length - 4}</span>
        )}
      </div>

      {/* CTA */}
      <button
        className="w-full text-center text-sm text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 rounded-lg py-2.5 font-medium transition-all mt-1"
        onClick={onClick}
      >
        View Lab Write-up →
      </button>
    </div>
  )
}
