// ── Skills Data with Honest Competency Levels & Real-world Usage Context ──
// No arbitrary percentages — each skill states its actual application environment.

export const skillGroups = [
  {
    id: 'networking',
    label: 'Networking Core & Protocols',
    accent: { text: '#60a5fa', bg: 'rgba(37,99,235,0.08)', border: 'rgba(59,130,246,0.25)' },
    description: 'Fondasi arsitektur routing paket, segmentasi VLAN, dan switching Layer 2/3',
    skills: [
      {
        name: 'IPv4 Subnetting & CIDR',
        level: 'Produksi / Mahir',
        context: 'Perhitungan VLSM presisi, alokasi prefiks /24 hingga /30 untuk inter-switch link & host pools.',
      },
      {
        name: 'Routing Protocols (OSPF, Static)',
        level: 'Lab Enterprise',
        context: 'Implementasi Single-area OSPF, penetapan cost, router ID, dan reditribusi rute pada Cisco IOS.',
      },
      {
        name: 'VLAN & Trunking (802.1Q)',
        level: 'Lab Enterprise',
        context: 'Segmentasi multi-departemen, 802.1Q trunk encapsulation, Native VLAN hardening, dan SVI inter-VLAN.',
      },
      {
        name: 'DHCP & DNS Core Services',
        level: 'Daily Driver / Homelab',
        context: 'DHCP relay configuration pada L3 gateway dan authoritative local DNS server via Pi-hole FTL.',
      },
      {
        name: 'Cisco IOS CLI & Packet Tracer',
        level: 'Simulasi Enterprise',
        context: 'Perancangan topologi, verifikasi command show/debug, dan troubleshooting konektivitas end-to-end.',
      },
    ],
    tags: ['IPv4', 'VLAN 802.1Q', 'OSPF', 'STP', 'Inter-VLAN', 'NAT/PAT'],
  },
  {
    id: 'linux',
    label: 'Linux & Systems Engineering',
    accent: { text: '#34d399', bg: 'rgba(5,150,105,0.08)', border: 'rgba(16,185,129,0.25)' },
    description: 'Administrasi sistem harian, automasi skrip, dan hardening pada platform berbasis Arch',
    skills: [
      {
        name: 'Arch Linux & EndeavourOS',
        level: 'Daily Driver (Utama)',
        context: 'Sistem operasi harian untuk workstation & homelab server, manajemen rolling-release.',
      },
      {
        name: 'Bash Scripting & Automation',
        level: 'Praktik Rutin',
        context: 'Skrip automasi backup berkala, healthcheck port monitoring, dan parsing log sistem.',
      },
      {
        name: 'Systemd & Service Hardening',
        level: 'Administrasi Sistem',
        context: 'Penyusunan unit files kustom, restart timers, journalctl inspection, dan pengelolaan daemon.',
      },
      {
        name: 'Package & Toolchain Management',
        level: 'Produksi / Mahir',
        context: 'Manajemen paket pacman/AUR, kompilasi driver kernel jaringan, dan isolasi environment.',
      },
      {
        name: 'SSH & Remote Access Hardening',
        level: 'Produksi',
        context: 'Autentikasi berbasis Ed25519 key-pair, port knocking, non-root login policy, dan fail2ban.',
      },
    ],
    tags: ['Arch Linux', 'Bash', 'systemd', 'pacman', 'SSH Ed25519', 'cron'],
  },
  {
    id: 'security',
    label: 'Security & Traffic Forensics',
    accent: { text: '#a78bfa', bg: 'rgba(109,40,217,0.1)', border: 'rgba(139,92,246,0.25)' },
    description: 'Inspeksi transmisi paket, reconnaissance jaringan, dan penegakan firewall stateful',
    skills: [
      {
        name: 'Wireshark & Packet Inspection',
        level: 'Investigasi Forensik',
        context: 'Deep packet inspection (DPI), rekonstruksi TCP stream, analisis 3-way handshake, dan audit SSL/TLS.',
      },
      {
        name: 'Nmap Network Scanning',
        level: 'Audit & Reconnaissance',
        context: 'SYN stealth scan (-sS), service banner detection (-sV), vulnerability enumeration via NSE scripts.',
      },
      {
        name: 'Firewall (UFW & iptables)',
        level: 'Defensif / Homelab',
        context: 'Penerapan rule stateful packet filtering, blocking unauthorized subnets, dan port forwarding.',
      },
      {
        name: 'Plaintext vs TLS Risk Analysis',
        level: 'Analisis Protokol',
        context: 'Demonstrasi sniffing credential HTTP/FTP plaintext vs payload verification TLS 1.3.',
      },
      {
        name: 'Network Access Control (ACL)',
        level: 'Lab Enterprise',
        context: 'Standard dan Extended ACL pada interface Cisco IOS untuk mengisolasi traffic antar departemen.',
      },
    ],
    tags: ['Wireshark', 'Nmap', 'iptables', 'UFW', 'ACL Extended', 'TLS 1.3'],
  },
]
