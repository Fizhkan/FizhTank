// Level skill ditulis apa adanya, tanpa persentase:
//   'Dasar'       sudah cukup nyaman dipakai
//   'Belajar'     masih berlatih
//   'Rencana Lab' belum dipraktikkan, sudah masuk rencana

export const levelNotes = {
  Dasar: 'Sudah cukup nyaman dipakai',
  Belajar: 'Masih berlatih',
  'Rencana Lab': 'Belum dipraktikkan, sudah ada di rencana lab',
}

export const skillGroups = [
  {
    id: 'networking',
    short: 'Jaringan',
    label: 'Jaringan',
    description: 'Dasar routing paket, segmentasi VLAN, dan switching Layer 2/3.',
    skills: [
      {
        name: 'IPv4 Subnetting dan CIDR',
        level: 'Dasar',
        context: 'Menghitung VLSM dan membagi blok subnet dari /24 sampai /30 sesuai kebutuhan host.',
      },
      {
        name: 'Routing (OSPF dan static)',
        level: 'Belajar',
        context: 'Mencoba OSPF single-area dan rute statis di simulasi Cisco IOS.',
      },
      {
        name: 'VLAN dan trunking 802.1Q',
        level: 'Belajar',
        context: 'Memisahkan segmen jaringan, mengatur trunk 802.1Q, dan konfigurasi SVI untuk inter-VLAN.',
      },
      {
        name: 'DHCP dan DNS',
        level: 'Dasar',
        context: 'Mengatur DHCP relay dan mencoba DNS server lokal di jaringan lab.',
      },
      {
        name: 'Cisco IOS CLI dan Packet Tracer',
        level: 'Belajar',
        context: 'Merancang topologi dan memakai perintah show/debug dasar di simulator.',
      },
    ],
    tags: ['IPv4', 'VLAN 802.1Q', 'OSPF', 'STP', 'Inter-VLAN', 'NAT/PAT'],
  },
  {
    id: 'linux',
    short: 'Linux',
    label: 'Linux dan sistem',
    description: 'Pemakaian harian Linux, shell script, dan pengelolaan service.',
    skills: [
      {
        name: 'Arch Linux dan EndeavourOS',
        level: 'Dasar',
        context: 'Dipakai sebagai workstation belajar dan tempat berlatih terminal.',
      },
      {
        name: 'Bash scripting',
        level: 'Belajar',
        context: 'Membuat skrip otomasi sederhana dan mengolah teks lewat bash.',
      },
      {
        name: 'systemd dan service',
        level: 'Dasar',
        context: 'Mengelola daemon, membaca log dengan journalctl, dan mengatur unit startup.',
      },
      {
        name: 'Package management (pacman)',
        level: 'Dasar',
        context: 'Memasang paket, merawat dependensi, dan mengelola repositori.',
      },
      {
        name: 'SSH dan akses remote',
        level: 'Dasar',
        context: 'Koneksi remote dengan key-pair Ed25519 dan pengaturan port server.',
      },
    ],
    tags: ['Arch Linux', 'Bash', 'systemd', 'pacman', 'SSH', 'cron'],
  },
  {
    id: 'security',
    short: 'Keamanan',
    label: 'Keamanan dan analisis traffic',
    description: 'Membaca aliran paket, memeriksa protokol, dan dasar penyaringan traffic.',
    skills: [
      {
        name: 'Wireshark dan inspeksi paket',
        level: 'Belajar',
        context: 'Membaca capture paket, menelusuri TCP stream, dan mengenali handshake protokol.',
      },
      {
        name: 'Pemindaian dengan Nmap',
        level: 'Belajar',
        context: 'Latihan scan port dasar (-sT, -sS) untuk melihat service yang berjalan di lab.',
      },
      {
        name: 'Firewall (UFW dan iptables)',
        level: 'Belajar',
        context: 'Menulis aturan filter dasar, menutup port yang tidak dipakai, dan mengatur policy default.',
      },
      {
        name: 'Plaintext vs TLS',
        level: 'Belajar',
        context: 'Membandingkan apa yang terlihat di payload HTTP/FTP dengan yang terenkripsi TLS.',
      },
      {
        name: 'Access Control List (ACL)',
        level: 'Rencana Lab',
        context: 'Rencana memakai Standard dan Extended ACL untuk menyaring traffic antar VLAN.',
      },
    ],
    tags: ['Wireshark', 'Nmap', 'iptables', 'UFW', 'ACL', 'TLS'],
  },
]

// Tool yang sudah dipakai (used: true) dan yang masih rencana (used: false)
export const toolsData = [
  { label: 'Cisco Packet Tracer', used: true },
  { label: 'Wireshark', used: true },
  { label: 'Nmap', used: true },
  { label: 'UFW / iptables', used: true },
  { label: 'Arch Linux', used: true },
  { label: 'Pi-hole', used: false },
  { label: 'pfSense', used: false },
  { label: 'VirtualBox', used: false },
  { label: 'Proxmox', used: false },
]
