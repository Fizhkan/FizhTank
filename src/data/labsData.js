// ── Labs Data: Planned & In-Progress Learning Roadmap ──
// Kejujuran konten: status diset 'planned' karena lab belum selesai dikerjakan secara nyata.
// Placeholders [ISI DI SINI: ...] dipertahankan untuk diisi saat project telah selesai.

export const labsData = [
  {
    id: 1,
    title: 'Enterprise Multi-VLAN Segmentation',
    category: 'Network Design',
    status: 'planned', // 'planned' | 'in-progress' | 'complete'
    description:
      'Merencanakan simulasi topologi enterprise dengan segmentasi VLAN multi-departemen — IT, HR, Finance, dan Management — menggunakan Inter-VLAN Routing via Layer 3 Switch dan pengujian ACL antar segmen.',
    tags: ['Cisco Packet Tracer', 'Inter-VLAN', 'ACL', 'STP', 'OSPF'],
    accentColor: 'blue',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Packet Tracer PKT Lab 1]',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana topologi enterprise memperlihatkan rencana Core Switch Layer 3 terhubung ke 3 Access Switch untuk segmen IT, HR, dan Finance.',
    reportUrl: '',
    writeup: {
      objective:
        'Mempelajari perancangan topologi jaringan enterprise dengan minimal 4 VLAN berbeda, merencanakan konfigurasi inter-VLAN routing via Layer 3 Switch (SVI), dan membatasi akses antar departemen menggunakan Extended ACL.',
      plannedSteps: [
        '1. Perancangan skema pengalamatan IP VLSM untuk 4 segmen (IT, HR, Finance, Management).',
        '2. Pembuatan topologi perangkat di Cisco Packet Tracer (Core L3 Switch & Access Switches).',
        '3. Konfigurasi 802.1Q trunking dan penetapan port access per VLAN.',
        '4. Konfigurasi SVI (Switch Virtual Interface) pada Core Switch untuk routing antar VLAN.',
        '5. Penyusunan Extended ACL untuk memblokir akses HR ke Finance.',
        '6. Pengujian konektivitas end-to-end dan validasi isolasi traffic.',
      ],
    },
  },
  {
    id: 2,
    title: 'Packet Stream & Credential Inspection',
    category: 'Security Analysis',
    status: 'planned',
    description:
      'Mempelajari analisis aliran paket jaringan menggunakan Wireshark. Membandingkan transmisi credential plaintext pada protokol HTTP/FTP vs enkripsi payload TLS pada HTTPS/SFTP.',
    tags: ['Wireshark', 'TLS Analysis', 'HTTP/FTP', 'Display Filters', 'pcapng'],
    accentColor: 'violet',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Sample PCAP File Lab 2]',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana tap Wireshark untuk observasi traffic dari client HTTP dan HTTPS ke gateway server.',
    reportUrl: '',
    writeup: {
      objective:
        'Mempelajari risiko keamanan transmisi data tanpa enkripsi, memahami cara kerja TCP 3-way handshake, dan menganalisis proteksi payload pada sesi TLS 1.3 melalui packet capture.',
      plannedSteps: [
        '1. Persiapan environment lab virtual dengan client HTTP dan HTTPS.',
        '2. Pengambilan sampel traffic login cleartext HTTP POST dan FTP menggunakan Wireshark.',
        '3. Analisis TCP stream reassembly untuk mengidentifikasi eksposur username dan password.',
        '4. Pengambilan sampel traffic HTTPS pada port 443 dan observasi TLS handshake record.',
        '5. Dokumentasi perbandingan keamanan payload antara HTTP vs HTTPS.',
      ],
    },
  },
  {
    id: 3,
    title: 'Linux Network Firewall & Homelab Service',
    category: 'Linux & Homelab',
    status: 'planned',
    description:
      'Merencanakan setup homelab berbasis Arch Linux dengan konfigurasi firewall stateful UFW/iptables, local DNS sinkhole dengan Pi-hole, dan evaluasi port filtering.',
    tags: ['Arch Linux', 'UFW', 'iptables', 'Pi-hole', 'Local DNS', 'Hardening'],
    accentColor: 'green',
    repoUrl: '[ISI DI SINI: Link GitHub Repo / Dotfiles Homelab Lab 3]',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana homelab dengan gateway Arch Linux yang menghubungkan WAN ke LAN client.',
    reportUrl: '',
    writeup: {
      objective:
        'Mempelajari dasar administrasi jaringan Linux dengan membangun gateway homelab mandiri, menerapkan aturan default-deny firewall, dan memblokir domain iklan via DNS resolver lokal.',
      plannedSteps: [
        '1. Instalasi dan konfigurasi dasar Arch Linux pada perangkat homelab/VM.',
        '2. Konfigurasi firewall UFW dengan kebijakan default deny incoming dan allow outgoing.',
        '3. Setup Pi-hole FTL untuk local DNS filtering pada port 53.',
        '4. Pengujian akses remote SSH menggunakan autentikasi key-pair.',
        '5. Verifikasi port eksposur menggunakan Nmap dari mesin lain dalam jaringan lokal.',
      ],
    },
  },
]
