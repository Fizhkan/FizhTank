/**
 * Pusat teks, profil, dan metadata FizhTank.
 * Judul dan deskripsi di sini otomatis disinkronkan ke <title>, meta, Open Graph,
 * dan JSON-LD oleh scripts/prerender.js saat build.
 */

export const site = {
  title: 'FizhTank | Portofolio Siraj, Aspiring Network & Security Engineer',

  jobTitle: 'Aspiring Network & Security Engineer',

  subtitle: 'Mahasiswa D3 Teknik Informatika',

  tagline: 'Belajar membangun dan mengamankan jaringan, satu lab dalam satu waktu.',

  // Foto profil: taruh file di public/profile.jpg. Jika belum ada, kartu profil menampilkan inisial.
  avatarUrl: '/profile.jpg',

  description:
    'Portofolio Siraj (Hafidz Sirajuddin), mahasiswa D3 Teknik Informatika yang belajar jaringan, keamanan, dan Linux. Berisi rencana lab, catatan skill, dan akuarium yang bisa diberi makan.',

  availability: 'Terbuka untuk diskusi teknis dan magang',

  location: 'Surabaya, Indonesia',

  // Kosongkan jika belum ada; tombol CV hanya tampil jika terisi
  cvUrl: '',

  // Kosongkan jika belum ada; kartu LinkedIn hanya tampil jika terisi
  linkedinUrl: '',

  email: 'hafidzsirajuddin99@gmail.com',

  // Endpoint formulir kontak (Formspree)
  formspreeEndpoint: 'https://formspree.io/f/mrpegvge',

  // Angka dekoratif untuk kartu info tank
  aquarium: {
    waterTemp: '25,4°C',
    phLevel: '7,2',
  },

  // Sertifikasi. Kartu hanya tampil jika 'name' terisi; jika kosong, roadmap bawaan dipakai.
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
