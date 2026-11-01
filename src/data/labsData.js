// Rencana lab. Semua berstatus 'planned' karena belum dikerjakan; write-up lengkap
// ditambahkan setelah lab selesai. Isi repoUrl / reportUrl / topologyImage jika sudah ada
// (tombol dan gambar hanya tampil jika terisi).
//
// status: 'planned' | 'in-progress' | 'complete'
// Untuk lab 'complete', tambahkan writeup.commands (string) dan writeup.verification (array string).

export const labsData = [
  {
    id: 1,
    title: 'Segmentasi Multi-VLAN untuk Jaringan Enterprise',
    category: 'Desain jaringan',
    status: 'planned',
    description:
      'Merancang topologi enterprise dengan beberapa VLAN departemen (IT, HR, Finance, Management), inter-VLAN routing lewat Layer 3 switch, dan ACL untuk membatasi akses antar segmen.',
    tags: ['Cisco Packet Tracer', 'Inter-VLAN', 'ACL', 'STP', 'OSPF'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana topologi: core switch Layer 3 terhubung ke tiga access switch untuk segmen IT, HR, dan Finance.',
    reportUrl: '',
    writeup: {
      objective:
        'Belajar merancang jaringan enterprise dengan minimal 4 VLAN, mengatur inter-VLAN routing lewat SVI di Layer 3 switch, dan membatasi akses antar departemen dengan Extended ACL.',
      plannedSteps: [
        'Rancang skema alamat IP VLSM untuk 4 segmen (IT, HR, Finance, Management).',
        'Bangun topologi di Cisco Packet Tracer: core L3 switch dan access switch.',
        'Konfigurasi trunking 802.1Q dan tetapkan port access untuk tiap VLAN.',
        'Buat SVI di core switch untuk routing antar VLAN.',
        'Susun Extended ACL yang memblokir akses HR ke Finance.',
        'Uji konektivitas end-to-end dan pastikan traffic antar segmen terisolasi sesuai aturan.',
      ],
    },
  },
  {
    id: 2,
    title: 'Membaca Paket: Plaintext vs TLS',
    category: 'Analisis keamanan',
    status: 'planned',
    description:
      'Menganalisis aliran paket dengan Wireshark untuk membandingkan credential yang terkirim dalam plaintext (HTTP/FTP) dengan payload yang terenkripsi TLS (HTTPS).',
    tags: ['Wireshark', 'TLS', 'HTTP/FTP', 'Display filter', 'pcapng'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana pengamatan: Wireshark menangkap traffic HTTP dan HTTPS dari client ke server.',
    reportUrl: '',
    writeup: {
      objective:
        'Memahami risiko mengirim data tanpa enkripsi, cara kerja TCP 3-way handshake, dan bagaimana TLS 1.3 melindungi payload, lewat packet capture langsung.',
      plannedSteps: [
        'Siapkan lab virtual dengan client dan server yang melayani HTTP dan HTTPS.',
        'Tangkap traffic login HTTP POST dan FTP dengan Wireshark.',
        'Gunakan TCP stream reassembly untuk melihat username dan password yang terekspos.',
        'Tangkap traffic HTTPS di port 443 dan amati TLS handshake.',
        'Dokumentasikan perbedaan keamanan payload antara HTTP dan HTTPS.',
      ],
    },
  },
  {
    id: 3,
    title: 'Firewall Linux dan Layanan Homelab',
    category: 'Linux dan homelab',
    status: 'planned',
    description:
      'Menyiapkan homelab berbasis Arch Linux dengan firewall stateful UFW/iptables, DNS sinkhole Pi-hole, dan pengecekan port yang terbuka.',
    tags: ['Arch Linux', 'UFW', 'iptables', 'Pi-hole', 'DNS lokal', 'Hardening'],
    repoUrl: '',
    topologyImage: '',
    topologyAlt:
      'Diagram rencana homelab: gateway Arch Linux menghubungkan WAN ke LAN client.',
    reportUrl: '',
    writeup: {
      objective:
        'Belajar dasar administrasi jaringan Linux: membangun gateway homelab, menerapkan firewall default deny, dan memblokir domain iklan lewat DNS resolver lokal.',
      plannedSteps: [
        'Pasang dan konfigurasi dasar Arch Linux di perangkat homelab atau VM.',
        'Atur UFW dengan kebijakan deny incoming dan allow outgoing.',
        'Pasang Pi-hole untuk filter DNS lokal di port 53.',
        'Uji akses SSH dari jarak jauh memakai autentikasi key-pair.',
        'Periksa port yang terbuka dengan Nmap dari mesin lain di jaringan lokal.',
      ],
    },
  },
]
