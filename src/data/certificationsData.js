// ── Certifications & Learning Progress Timeline Data ──
// Placeholders [ISI DI SINI: ...] ensure no fabricated credentials.

export const cvDownloadConfig = {
  filePath: '/cv.pdf',
  fileName: 'CV_Siraj_Network_Engineer.pdf',
  lastUpdated: '[ISI DI SINI: Bulan Tahun, misal: Maret 2026]',
  available: false, // Set to true after putting cv.pdf in /public
}

export const certificationsTimeline = [
  {
    id: 'cert-1',
    title: '[ISI DI SINI: Nama Sertifikasi 1, misal: Cisco Certified Network Associate (CCNA 200-301)]',
    issuer: '[ISI DI SINI: Cisco / Badan Penerbit]',
    issueDate: '[ISI DI SINI: Tanggal / Tahun Kelulusan]',
    expiryDate: '[ISI DI SINI: Tanggal Kedaluwarsa atau "No Expiration"]',
    credentialId: '[ISI DI SINI: ID Sertifikat / Credential ID]',
    credentialUrl: '[ISI DI SINI: Link Verifikasi Sertifikat (Credly / Cisco)]',
    status: 'In Progress', // 'Completed' | 'In Progress' | 'Planned'
    progressPercent: 75,
    summary:
      '[ISI DI SINI: Ringkasan fokus materi atau lab yang sedang/telah dikuasai, misal: IP connectivity, IP services, security fundamentals, automasi jaringan].',
    skills: ['Cisco IOS', 'OSPFv2', 'VLAN 802.1Q', 'ACL', 'Subnetting', 'STP'],
    accentColor: 'cyan',
  },
  {
    id: 'cert-2',
    title: '[ISI DI SINI: Nama Sertifikasi 2, misal: MikroTik Certified Network Associate (MTCNA)]',
    issuer: '[ISI DI SINI: MikroTik / Training Center]',
    issueDate: '[ISI DI SINI: Tanggal / Tahun Kelulusan]',
    expiryDate: '[ISI DI SINI: Tanggal Kedaluwarsa]',
    credentialId: '[ISI DI SINI: ID Sertifikat / No. Registrasi]',
    credentialUrl: '[ISI DI SINI: Link Verifikasi Sertifikat]',
    status: 'Planned',
    progressPercent: 40,
    summary:
      '[ISI DI SINI: Ringkasan silabus target sertifikasi, misal: RouterOS fundamentals, firewall filter & NAT, bandwidth management].',
    skills: ['RouterOS', 'Firewall NAT', 'Queues', 'Wireless & Bridging'],
    accentColor: 'violet',
  },
  {
    id: 'cert-3',
    title: '[ISI DI SINI: Nama Pelatihan / Sertifikasi 3, misal: CompTIA Security+ / Linux Professional (LPIC-1)]',
    issuer: '[ISI DI SINI: CompTIA / LPI / Coursera]',
    issueDate: '[ISI DI SINI: Tanggal / Periode]',
    expiryDate: '[ISI DI SINI: Status Masa Berlaku]',
    credentialId: '[ISI DI SINI: ID Kredensial]',
    credentialUrl: '[ISI DI SINI: Link Verifikasi]',
    status: 'Planned',
    progressPercent: 25,
    summary:
      '[ISI DI SINI: Catatan studi mandiri atau target roadmap berikutnya di bidang Linux sistem & keamanan jaringan].',
    skills: ['Linux Kernel', 'Threat Mitigation', 'Network Security Protocols'],
    accentColor: 'emerald',
  },
]
