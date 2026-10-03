// ── Skills Data: Honest Learning & Exploration Status ──
// Tidak menggunakan persentase semu atau klaim produksi.
// Level: 'Belajar' | 'Dasar' | 'Rencana Lab'

export const skillGroups = [
  {
    id: 'networking',
    label: 'Networking Core & Protocols',
    accent: { text: '#60a5fa', bg: 'rgba(37,99,235,0.08)', border: 'rgba(59,130,246,0.25)' },
    description: 'Konsep dasar routing paket, segmentasi VLAN, dan switching Layer 2/3',
    skills: [
      {
        name: 'IPv4 Subnetting & CIDR',
        level: 'Dasar',
        context: 'Perhitungan VLSM, pembagian blok subnet /24 hingga /30 untuk kebutuhan alokasi host.',
      },
      {
        name: 'Routing Protocols (OSPF, Static)',
        level: 'Belajar',
        context: 'Eksplorasi single-area OSPF dan penentuan rute statis pada simulasi Cisco IOS.',
      },
      {
        name: 'VLAN & Trunking (802.1Q)',
        level: 'Belajar',
        context: 'Pemisahan segmen jaringan, trunking 802.1Q, dan konfigurasi SVI inter-VLAN.',
      },
      {
        name: 'DHCP & DNS Core Services',
        level: 'Dasar',
        context: 'Pengaturan relay DHCP serta pengujian local DNS server pada jaringan lab.',
      },
      {
        name: 'Cisco IOS CLI & Packet Tracer',
        level: 'Belajar',
        context: 'Latihan perancangan topologi, eksekusi command dasar show/debug di simulator.',
      },
    ],
    tags: ['IPv4', 'VLAN 802.1Q', 'OSPF', 'STP', 'Inter-VLAN', 'NAT/PAT'],
  },
  {
    id: 'linux',
    label: 'Linux & Systems Engineering',
    accent: { text: '#34d399', bg: 'rgba(5,150,105,0.08)', border: 'rgba(16,185,129,0.25)' },
    description: 'Penggunaan harian sistem operasi Linux, eksplorasi shell script, dan manajemen servis',
    skills: [
      {
        name: 'Arch Linux & EndeavourOS',
        level: 'Dasar',
        context: 'Penggunaan sistem operasi berbasis Arch untuk workstation belajar dan eksplorasi terminal.',
      },
      {
        name: 'Bash Scripting & Automation',
        level: 'Belajar',
        context: 'Latihan pembuatan skrip automasi sederhana dan pemrosesan teks via bash.',
      },
      {
        name: 'Systemd & Service Management',
        level: 'Dasar',
        context: 'Memahami pengelolaan daemon servis, status inspeksi journalctl, dan startup unit.',
      },
      {
        name: 'Package Management (pacman)',
        level: 'Dasar',
        context: 'Operasi instalasi paket, pemeliharaan dependensi, dan manajemen repositori sistem.',
      },
      {
        name: 'SSH & Remote Access',
        level: 'Dasar',
        context: 'Konfigurasi koneksi remote berbasis key-pair Ed25519 dan pengaturan port server.',
      },
    ],
    tags: ['Arch Linux', 'Bash', 'systemd', 'pacman', 'SSH', 'cron'],
  },
  {
    id: 'security',
    label: 'Security & Traffic Analysis',
    accent: { text: '#a78bfa', bg: 'rgba(109,40,217,0.1)', border: 'rgba(139,92,246,0.25)' },
    description: 'Eksplorasi analisis aliran paket, inspeksi protokol, dan dasar filtering traffic',
    skills: [
      {
        name: 'Wireshark & Packet Inspection',
        level: 'Belajar',
        context: 'Eksplorasi pembacaan capture paket, analisis TCP stream, dan pengenalan handshake protokol.',
      },
      {
        name: 'Nmap Network Scanning',
        level: 'Belajar',
        context: 'Latihan scanning port dasar (-sT, -sS) untuk identifikasi servis yang berjalan di lab.',
      },
      {
        name: 'Firewall (UFW & iptables)',
        level: 'Belajar',
        context: 'Pengaturan rule penyaringan paket dasar, penutupan port tidak terpakai, dan policy default.',
      },
      {
        name: 'Plaintext vs TLS Analysis',
        level: 'Belajar',
        context: 'Mempelajari perbedaan visibilitas payload pada protokol HTTP/FTP vs enkripsi TLS.',
      },
      {
        name: 'Network Access Control (ACL)',
        level: 'Rencana Lab',
        context: 'Rencana implementasi Standard dan Extended ACL untuk memfilter traffic antar VLAN.',
      },
    ],
    tags: ['Wireshark', 'Nmap', 'iptables', 'UFW', 'ACL', 'TLS'],
  },
]
