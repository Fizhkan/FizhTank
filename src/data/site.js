/**
 * ============================================================================
 * FIZHTANK - SINGLE SOURCE OF TRUTH (SITE DATA & STATUS)
 * ============================================================================
 * File ini adalah pusat konfigurasi teks, profil, status, dan metadata FizhTank.
 * Semua komponen (Hero, Terminal, Navbar, Credentials, Contact), SEO (<title>, meta,
 * OG/Twitter, JSON-LD), dan skrip prerender merujuk ke file ini sebagai satu-satunya sumber data.
 *
 * JANGAN MENGARANG ISI: Jika data belum ada (CV, LinkedIn, sertifikasi resmi),
 * biarkan bernilai string kosong ('') atau array dengan nama kosong.
 *
 * ----------------------------------------------------------------------------
 * 📘 PANDUAN CARA UPGRADE STATUS & PROFIL:
 * ----------------------------------------------------------------------------
 * 1. KETIKA LAB SELESAI (Lab Selesai):
 *    - Buka file `src/data/labsData.js`.
 *    - Ubah properti `status: 'planned'` menjadi `status: 'complete'`.
 *    - Isi link `repoUrl` (URL repository GitHub atau file .pkt) dan `reportUrl` (dokumentasi write-up).
 *    - Tambahkan ringkasan verifikasi/hasil tes nyata pada objek `writeup`.
 *    - Stat card di hero (Planned, In-Progress, Completed) akan otomatis menghitung
 *      dan menampilkan jumlah lab terbaru secara real-time tanpa edit angka manual.
 *
 * 2. KETIKA SERTIFIKASI LULUS (Sertifikasi Lulus):
 *    - Buka file `src/data/site.js` ini.
 *    - Di dalam array `certifications`, isi atau tambahkan objek baru:
 *      {
 *        name: 'Cisco Certified Network Associate (CCNA 200-301)',
 *        issuer: 'Cisco Systems',
 *        date: 'Mei 2026',
 *        status: 'Completed', // 'Completed' | 'In Progress' | 'Planned'
 *      }
 *    - Kartu sertifikasi akan otomatis muncul di section Credentials dan di terminal
 *      `cat cv.txt` tanpa menampilkan placeholder kosong.
 *
 * 3. KETIKA MULAI MAGANG ATAU BEKERJA (Mulai Magang/Kerja):
 *    - Buka file `src/data/site.js` ini.
 *    - Update `jobTitle`: misalnya 'Network Engineer Intern' atau 'Junior SOC Analyst'.
 *    - Update `availability`: misalnya 'Magang di [Nama Perusahaan]' atau 'Tersedia untuk Peluang Full-Time'.
 *    - Update `subtitle` atau `tagline` jika ada perubahan deskripsi peran atau keahlian.
 *    - Masukkan `cvUrl`: misalnya '/cv.pdf' (setelah file ditaruh di folder `public/`).
 *    - Masukkan `linkedinUrl`: URL profil LinkedIn asli (misal: 'https://linkedin.com/in/hafidzsirajuddin').
 *    - Seluruh tampilan UI (Hero, tombol CV, kartu LinkedIn, Terminal, Meta SEO, Prerender)
 *      akan langsung ter-update secara otomatis dan konsisten.
 * ============================================================================
 */

export const site = {
  // Identitas & SEO Title
  title: 'FizhTank | Aspiring Network & Security Engineer',

  // Peran / Jabatan (digunakan di Hero badge, JSON-LD, Terminal whoami)
  jobTitle: 'Aspiring Network & Security Engineer',

  // Subtitle Hero (identitas akademis & proses belajar)
  subtitle: 'Mahasiswa D3 Teknik Informatika · belajar jaringan & keamanan',

  // Tagline (prinsip / motto teknis ekosistem)
  tagline: 'Navigating packets, filtering streams, securing the deep ecosystem.',

  // Meta Description (SEO, OG, Twitter, JSON-LD)
  description:
    'Portfolio Siraj (FizhTank): mahasiswa D3 Teknik Informatika yang belajar jaringan dan keamanan. Catatan belajar dan lab yang sedang dikerjakan.',

  // Status Ketersediaan (kosongkan jika belum ada status ketersediaan/kontrak resmi)
  availability: '',

  // Link file CV (kosongkan jika belum tersedia; tombol CV hanya tampil jika terisi)
  cvUrl: '',

  // Link profil LinkedIn (kosongkan jika belum ada; kartu LinkedIn hanya tampil jika terisi)
  linkedinUrl: '',

  // Email kontak aktif
  email: 'hafidzsirajuddin99@gmail.com',

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
