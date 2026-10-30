/**
 * ============================================================================
 * FIZHTANK - SINGLE SOURCE OF TRUTH (SITE DATA & STATUS)
 * ============================================================================
 * File ini adalah pusat konfigurasi teks, profil, status, dan metadata FizhTank.
 * Tema: High-End Planted & Marine Aquarium (Akuarium) Tank Laboratory.
 * ============================================================================
 */

export const site = {
  // Identitas & SEO Title
  title: 'FizhTank | Aspiring Network & Security Engineer',

  // Peran / Jabatan
  jobTitle: 'Aspiring Network & Security Engineer',

  // Subtitle Hero (identitas akademis & proses belajar)
  subtitle: 'Mahasiswa D3 Teknik Informatika · Rekayasa Jaringan & Keamanan Sistem',

  // Tagline (prinsip / motto teknis ekosistem akuarium)
  tagline: 'Cultivating network topologies, packet filtering, and resilient systems within the tank ecosystem.',

  // Foto Profil / Avatar Operator:
  // Tempat menaruh foto fisik Anda:
  // 1. Simpan file foto Anda di folder 'public/profile.jpg' (atau format .png)
  // 2. Atau ubah nilai 'avatarUrl' di bawah ini ke nama file foto Anda.
  avatarUrl: '/profile.jpg',

  // Meta Description (SEO, OG, Twitter, JSON-LD)
  description:
    'Portfolio & Laboratorium Siraj (FizhTank): Mahasiswa D3 Teknik Informatika yang mendalami arsitektur jaringan, Packet Tracer, Wireshark, dan keamanan Linux.',

  // Status Ketersediaan (kosongkan jika belum ada status ketersediaan/kontrak resmi)
  availability: 'Open to Technical Inquiries & Internship',

  // Link file CV (kosongkan jika belum tersedia; tombol CV hanya tampil jika terisi)
  cvUrl: '',

  // Link profil LinkedIn (kosongkan jika belum ada; kartu LinkedIn hanya tampil jika terisi)
  linkedinUrl: '',

  // Email kontak aktif
  email: 'hafidzsirajuddin99@gmail.com',

  // Endpoint backend formulir kontak (Formspree)
  formspreeEndpoint: 'https://formspree.io/f/mrpegvge',

  // Parameter Akuarium Fisik (Tank Ecosystem Telemetry)
  aquarium: {
    tankName: 'FIZHTANK TANK-01',
    waterTemp: '25.4°C',
    phLevel: '7.2 pH',
    tdsPurity: '142 PPM',
    tankVolume: '450 LITERS',
    filtration: 'Canister Filtration Active (1,200 L/H)',
    lighting: 'Full-Spectrum High-PAR Aquascape (6500K)',
  },

  // Daftar Sertifikasi (tanpa persentase; kartu hanya tampil jika 'name' terisi)
  certifications: [
    {
      name: '',
      issuer: '',
      date: '',
      status: 'Planned', // 'Completed' | 'In Progress' | 'Planned'
    },
  ],
}

export default site
