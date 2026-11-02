# FizhTank

Portofolio Siraj (Hafidz Sirajuddin), mahasiswa D3 Teknik Informatika yang belajar jaringan, keamanan, dan Linux. Latarnya akuarium yang bisa diberi makan.

[![CI](https://github.com/Fizhkan/FizhTank/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Fizhkan/FizhTank/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald)](LICENSE)

**[Lihat demo](https://fizhtank.vercel.app/)** • **[Buka FizhWiki](https://fizhwiki.vercel.app/)**

## Isi situs

- **Hero**: profil singkat, terminal interaktif, dan kalkulator subnet IPv4.
- **Labs**: rencana lab jaringan, keamanan, dan homelab. Semua masih berstatus *planned*; write-up ditambahkan setelah lab dikerjakan.
- **Skills**: skill beserta level jujurnya (belajar, dasar, rencana lab).
- **Sertifikasi**: roadmap sertifikasi. Kartu asli muncul otomatis begitu `site.certifications` diisi.
- **Kontak**: email, GitHub, dan formulir (Formspree) dengan honeypot dan jeda 30 detik antar kirim.
- **Akuarium**: latar canvas berisi clownfish, blue tang, angelfish, neon tetra, dan corydoras. Klik di mana saja atau ketik `feed` untuk menjatuhkan makanan.

### Perintah terminal

| Perintah | Fungsi |
|---|---|
| `help` | Daftar perintah |
| `whoami` | Profil singkat |
| `labs` | Daftar lab beserta statusnya |
| `skills` | Skill dan levelnya |
| `subnet <ip/n>` | Hitung subnet, contoh `subnet 10.0.0.0/24` |
| `contact` | Email dan GitHub |
| `feed` | Beri makan ikan |
| `clear` | Bersihkan layar |

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev        # http://localhost:5173
npm run test       # unit test kalkulator subnet (Vitest)
npm run lint       # Oxlint
npm run build      # build client + prerender HTML statis ke dist/
```

## Mengubah konten

Semua teks ada di `src/data/`, tanpa perlu menyentuh komponen:

| File | Isi |
|---|---|
| `site.js` | Nama, deskripsi, email, endpoint formulir, CV, LinkedIn, sertifikasi |
| `labsData.js` | Daftar lab dan write-up |
| `skillsData.js` | Grup skill dan level |
| `contactData.js` | Tautan kontak |

Judul dan deskripsi di `site.js` otomatis disinkronkan ke `<title>`, meta, Open Graph, dan JSON-LD saat `npm run build`.

## Struktur

```text
src/
├── App.jsx
├── index.css
├── components/   Navbar, Hero, Labs, LabModal, Skills, Certifications,
│                 Contact, Footer, AquariumCanvas, TankInfo, ScrollToTop
├── data/         konten situs
├── hooks/        useScrollReveal
└── utils/        subnetCalculator (+ tes), audio
scripts/prerender.js   prerender statis dan sinkronisasi metadata
```

## Stack

React 19, Vite 8, Tailwind CSS v4, Lucide, Vitest, Oxlint. Di-deploy ke Vercel.

## Lisensi

[MIT](LICENSE)
