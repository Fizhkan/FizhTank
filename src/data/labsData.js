// ── Labs Data with Complete Topology Schematics, Key Configs, & Verifications ──
// Data placeholder [ISI DI SINI: ...] provided where user-specific write-up links apply.

export const labsData = [
  {
    id: 1,
    title: 'Enterprise Multi-VLAN Segmentation',
    category: 'Network Design',
    status: 'Complete',
    description:
      'Designed a scalable enterprise topology dengan segmentasi VLAN multi-departemen — IT, HR, Finance, dan Management — menggunakan Inter-VLAN Routing via Layer 3 Switch dan ACL berbasis kebijakan keamanan antar segmen.',
    tags: ['Cisco Packet Tracer', 'Inter-VLAN', 'ACL', 'STP', 'OSPF'],
    accentColor: 'blue',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Packet Tracer PKT Lab 1]',
    writeup: {
      objective:
        'Membangun topologi jaringan enterprise dengan minimal 4 VLAN berbeda, mengimplementasikan inter-VLAN routing via Layer 3 Switch (SVI), dan membatasi komunikasi antar departemen menggunakan Extended ACL.',
      topologyText:
        'Core L3 Switch (SW-CORE) → 802.1Q Trunks → Access Switches (SW-IT, SW-HR, SW-FIN)\n• VLAN 10 (IT Management) : 192.168.10.0/24 (SVI .1)\n• VLAN 20 (Human Resources) : 192.168.20.0/24 (SVI .1)\n• VLAN 30 (Finance & Billing): 192.168.30.0/24 (SVI .1)\n• VLAN 99 (Out-of-band Mgmt): 192.168.99.0/24 (SVI .1)',
      topologyAlt:
        'Diagram topologi jaringan enterprise yang memperlihatkan SW-CORE Layer 3 terhubung melalui 802.1Q trunk ke 3 Access Switch untuk VLAN 10 IT, VLAN 20 HR, dan VLAN 30 Finance.',
      topologyDiagramType: 'enterprise-vlan',
      commands: `! Configure VLAN Database & SVIs on Core L3 Switch
vlan 10
 name IT_DEPT
vlan 20
 name HR_DEPT
vlan 30
 name FINANCE_DEPT
vlan 99
 name NATIVE_MGMT
!
ip routing
!
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
!
interface vlan 30
 ip address 192.168.30.1 255.255.255.0
 no shutdown
!
! Extended ACL: Block HR Subnet from accessing Finance Subnet
ip access-list extended BLOCK_HR_TO_FINANCE
 deny ip 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255
 permit ip any any
!
interface vlan 20
 ip access-group BLOCK_HR_TO_FINANCE in`,
      verification: [
        'ping 192.168.10.1 dari workstation IT (192.168.10.15) → Success (0% packet loss, RTT <1ms)',
        'ping 192.168.30.10 (Finance Server) dari host HR (192.168.20.12) → Destination Host Unreachable (ACL Block verified)',
        'ping 192.168.30.10 dari host IT (192.168.10.15) → Success (IT memiliki hak akses inter-VLAN penuh)',
        'show vlan brief → Semua VLAN berstatus ACTIVE pada trunk port GigabitEthernet0/1 - 0/3',
        "show ip route → Routing table menampilkan rute direct connected 'C' untuk semua prefix /24",
      ],
    },
  },
  {
    id: 2,
    title: 'Packet Stream & Credential Inspection',
    category: 'Security Analysis',
    status: 'Complete',
    description:
      'Melakukan capture dan analisis mendalam terhadap aliran paket jaringan menggunakan Wireshark. Membandingkan transmisi credential plaintext pada protokol HTTP/FTP vs enkripsi payload TLS 1.3 pada HTTPS/SFTP.',
    tags: ['Wireshark', 'TLS Analysis', 'HTTP/FTP', 'Display Filters', 'pcapng'],
    accentColor: 'violet',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Sample PCAP File Lab 2]',
    writeup: {
      objective:
        'Mendemonstrasikan risiko keamanan transmisi credential pada protokol cleartext (HTTP/FTP), menganalisis 3-way handshake TCP, dan membuktikan proteksi kerahasiaan data menggunakan TLS 1.3 session encryption.',
      topologyText:
        'Audit Workstation (Wireshark Promiscuous Tap)\n       │\n[Mirroring Port / SPAN Switch]\n  ├── Client A (HTTP/FTP User): 192.168.1.50\n  ├── Client B (HTTPS/TLS User): 192.168.1.51\n  └── Web & File Gateway Server : 192.168.1.1',
      topologyAlt:
        'Diagram tap capture Wireshark menunjukkan workstation analis terhubung ke port mirror switch untuk memonitor traffic dari Client HTTP dan HTTPS ke Gateway Server.',
      topologyDiagramType: 'packet-inspection',
      commands: `# Wireshark Display Filter: Tangkap form submission HTTP POST
http.request.method == "POST"

# Filter identifikasi credential FTP pada cleartext port 21
ftp.request.command == "USER" || ftp.request.command == "PASS"

# Filter TCP Handshake (SYN, SYN-ACK, ACK)
tcp.flags.syn == 1 && tcp.flags.ack == 0

# Verifikasi TLS 1.3 Handshake (Client Hello / Server Hello)
tls.handshake.type == 1 || tls.handshake.type == 2

# Verifikasi enkripsi Application Data
tls.record.content_type == 23`,
      verification: [
        'TCP Stream Reassembly HTTP → Parameter form "username=admin&password=[ISI DI SINI: Contoh Credential]" terbaca jelas tanpa dekripsi',
        'FTP Stream 21 → Command "USER analyst" dan "PASS SecretPass123" terexpose dalam raw payload',
        'HTTPS / TLS Stream 443 → Seluruh isi packet header HTTP terenkripsi sepenuhnya dalam TLS Application Data Record',
        'Server Certificate Verification → Validasi x509 cipher suite TLS_AES_256_GCM_SHA384 berhasil teridentifikasi',
        'Rekomendasi mitigasi: Nonaktifkan protokol port 80/21, wajibkan HSTS dan enkripsi end-to-end',
      ],
    },
  },
  {
    id: 3,
    title: 'Linux Network Firewall & Homelab Service',
    category: 'Linux & Homelab',
    status: 'Complete',
    description:
      'Membangun homelab berbasis Arch Linux dengan konfigurasi firewall stateful UFW/iptables yang ketat, local DNS sinkhole dengan Pi-hole FTL, dan audit monitoring eksposur port menggunakan Nmap.',
    tags: ['Arch Linux', 'UFW', 'iptables', 'Pi-hole', 'Local DNS', 'Hardening'],
    accentColor: 'green',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Dotfiles Homelab Lab 3]',
    writeup: {
      objective:
        'Membangun lingkungan gateway homelab yang hardened menggunakan Arch Linux, menerapkan kebijakan default-deny firewall, memblokir telemetry iklan via sinkhole DNS internal, dan memvalidasi perimeter keamanan dengan port scan Nmap.',
      topologyText:
        'WAN / Internet Router (192.168.0.1)\n       │\n[Arch Linux Gateway & DNS Sinkhole - 192.168.1.254]\n  ├── UFW Stateful Firewall (Default Deny Incoming)\n  ├── Pi-hole DNS Resolver (Port 53 TCP/UDP)\n  ├── SSH Server (Port 2222, Ed25519 Keys Only)\n  └── LAN Subnet Clients (192.168.1.0/24)',
      topologyAlt:
        'Diagram arsitektur Linux Homelab memperlihatkan gateway Arch Linux berada di antara WAN dan LAN client dengan proteksi firewall UFW, DNS Pi-hole, dan remote SSH terisolasi.',
      topologyDiagramType: 'linux-homelab',
      commands: `# Instalasi dependensi di Arch Linux
sudo pacman -Syu ufw nmap bind-tools

# Konfigurasi kebijakan dasar firewall UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Izinkan DNS lokal dan SSH port custom
sudo ufw allow 53/tcp comment 'Pi-hole DNS TCP'
sudo ufw allow 53/udp comment 'Pi-hole DNS UDP'
sudo ufw allow from 192.168.1.0/24 to any port 2222 proto tcp comment 'Secure LAN SSH'
sudo ufw enable

# Audit keamanan perimeter dari mesin eksternal
nmap -sS -sV -p- -T4 192.168.1.254`,
      verification: [
        'sudo ufw status verbose → Menunjukkan status active dengan default deny incoming dan logging level medium',
        'dig @192.168.1.254 tracker.ads.example.com → Merespons 0.0.0.0 (Sinkhole Pi-hole aktif)',
        'dig @192.168.1.254 homelab.local → Resolusi ke IP privat 192.168.1.x berhasil dalam waktu 2ms',
        'Nmap full port scan dari segmen luar → Port yang tidak diizinkan berstatus "filtered", tidak ada kebocoran port 22 biasa',
        'Sistem berjalan stabil pada kernel rolling Arch Linux dengan utilisasi RAM homelab <350MB',
      ],
    },
  },
]
