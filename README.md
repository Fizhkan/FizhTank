<div align="center">

# 🐟 FizhTank

**Personal Portfolio & Interactive Aquarium Experience for an Aspiring Network & Security Engineer**

*Navigating packets, filtering streams, and securing the deep ecosystem.*

[![CI Pipeline](https://github.com/Fizhkan/FizhTank/actions/workflows/ci.yml/badge.svg)](https://github.com/Fizhkan/FizhTank/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tested-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Arch Linux](https://img.shields.io/badge/Arch_Linux-Homelab-1793D1?style=for-the-badge&logo=archlinux)](https://archlinux.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

[Live Demo](https://fizhtank.vercel.app/) • [Explore Labs](#-featured-labs) • [Core Skills](#-core-skills) • [Interactive Terminal](#-interactive-terminal-commands)

</div>

---

## 🌊 Overview

**FizhTank** adalah portfolio personal Siraj, mahasiswa D3 Teknik Informatika yang mendokumentasikan proses belajar di bidang jaringan dan keamanan sistem, dibalut dengan konsep visual **akuarium cyberpunk bioluminescent**.

Portfolio ini dirancang untuk memetakan roadmap belajar teknis:
- **Eksplorasi Jaringan & Keamanan**: Perencanaan topologi lab, segmentasi VLAN, firewall, dan packet analysis.
- **Homelab Linux**: Eksplorasi administrasi Linux (Arch/EndeavourOS) dan virtualisasi.
- **Terminal CLI Demo**: Antarmuka terminal interaktif dengan simulasi perintah diagnostik dan telemetri ekosistem.

---

## ✨ Key Features

### 1. 🪸 Dynamic Aquarium Ecosystem
- **Depth-Layered Water Column**: Seamless gradient transitioning from shallow sunlit water (surface caustics) down through the twilight zone to the hadal abyss (2600m depth).
- **Oceanic Depth Gauge HUD (`DepthMeter.jsx`)**: Real-time floating depth indicator tracking user scroll depth (0m to 2600m) categorized into ecological zones: *Sunlit Shallows (0–200m)*, *Twilight Zone (200–1000m)*, *Abyssal Plain (1000–2000m)*, and *Hadal Trench (>2000m)* with animated sonar pings.
- **6 Handcrafted SVG Marine Species**:
  - `Neon Tetra`: High-speed schooling packets.
  - `Betta Veil`: Elegant flowing fins with bioluminescent trailing edges.
  - `Abyssal Ray`: Majestic seabed glider with organic wing flexing.
  - `Deep-Sea Angler`: Bioluminescent lure pulsating in the dark.
  - `Bio Jellyfish`: Translucent bell contractions and undulating tentacles.
  - `Cyber Puffer`: Responsive spiny defender.
- **Interactive Tank Feeding**: Click anywhere or type `feed` in the CLI terminal to drop nutrient flakes that attract marine life.

### 2. 💻 Arch Linux Interactive Terminal
- Embedded terminal (`fizhtank@arch:~$`) with simulated CLI commands:
  - `help` — Menampilkan daftar perintah yang tersedia.
  - `whoami` — Profil dan fokus belajar.
  - `skills` — Ringkasan kompetensi dasar dan skill yang sedang dipelajari.
  - `projects` / `labs` — Roadmap dan status lab.
  - `subnet <ip/cidr>` — **IPv4 VLSM Calculator** (menghitung Network ID, Broadcast, Subnet Mask, Wildcard Mask, usable host range, dan total host untuk prefix `/1` s.d. `/32`).
  - `traceroute <target>` — **Network Hop Tracer** simulator dari L3 Switch $\rightarrow$ pfSense $\rightarrow$ Edge ISP $\rightarrow$ Target.
  - `cat cv.txt` — Ringkasan CV dan kredensial.
  - `contact` — Informasi kontak dan tautan sosial.
  - `ping [target]` — Simulasi telemetri paket ICMP.
  - `nmap` — Simulasi pemindaian port untuk demo lab.
  - `cat /etc/ocean.conf` — Konfigurasi demo tema ekosistem.
  - `feed` — Memberi pakan organisme akuarium (+100 XP toast).
  - `clear` — Membersihkan layar terminal.
- Fitur auto-wrapping tanpa scroll horizontal, command history, Tab autocomplete, dan chip perintah cepat.

### 3. 🛡️ Core Skills Matrix & Roadmap
- **Bento Grid Architecture**: Terkategori dalam *Routing & Switching*, *Security Fundamentals*, dan *Linux & Systems*.
- **Level Kemampuan Jujur**: Menggunakan badge status konkret ("Belajar", "Dasar", "Rencana Lab") tanpa klaim produksi berlebihan.
- **Toolchain**: Wireshark, Cisco Packet Tracer, Nmap, pfSense, Pi-hole, UFW/iptables, VirtualBox, Proxmox, dan Arch Linux.

### 4. 🔬 Lab Roadmap & Planned Experiments
- **Rencana Lab Terstruktur**:
  1. 📌 **Objective**: Sasaran dan konsep jaringan yang dipelajari.
  2. 🗺️ **Rencana Topologi**: Rencana segmentasi VLAN, subnetting, dan gateway.
  3. ⚙️ **Rencana Langkah**: Tahapan konfigurasi yang akan dipraktikkan.
  4. 📝 **Dokumentasi & Write-up**: Catatan hasil nyata dan verifikasi akan ditambahkan setelah lab selesai dipraktikkan.

### 5. 🔒 Anti-Spam Security & Quota Guard
- **Honeypot Trap (`_gotcha`)**: Hidden field yang tak terlihat oleh user manusia namun menjebak bot web scraping untuk melindungi kuota bulanan Formspree.
- **Rate-Limiting Cooldown**: Timer cooldown 30 detik pada form transmisi pesan untuk mencegah accidental spam atau rapid packet flood.

### 6. 🔤 Refined Modern Typography
- **Headings**: **Plus Jakarta Sans** — crisp geometric clarity for high-impact display.
- **Body**: **Inter** — optimized OpenType features (`cv02`, `cv03`, `cv04`, `cv11`) with WCAG-compliant dark-mode contrast.
- **Telemetry & CLI**: **JetBrains Mono** — high-legibility developer typeface for code blocks and telemetry badges.

### 7. ⚡ Live Packet Ticker & Navigation
- Real-time animated ticker showing transmitted packets (`pkt`), round-trip latency (`lat` ms), and connection status.
- Section observer tracking active scroll positions.
- Floating circular scroll-to-top button with circular SVG progress indicator.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Component architecture, state management & hooks |
| **Build Tool** | [Vite 8](https://vite.dev/) | Instant HMR, lightning-fast ES module bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first styling with `@theme` |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector icon set |
| **Typography** | Google Fonts | Plus Jakarta Sans, Inter, JetBrains Mono |
| **Code Quality** | [Oxlint](https://oxc.rs/) | High-speed Rust-based JavaScript/JSX linter |

---

## 📁 Project Structure

```text
Fizhtank/
├── index.html                   # Entry HTML with preconnected typography CDN
├── package.json                 # Project dependencies and npm scripts
├── vite.config.js               # Vite 8 config with Tailwind 4 plugin
├── public/
│   └── fish.svg                 # Bioluminescent fish favicon
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application composition
    ├── index.css                # Global theme, animations, scrollbars & keyframes
    ├── hooks/
    │   └── useScrollReveal.jsx  # Custom hooks: ScrollReveal, AnimatedCounter, CursorGlow, etc.
    └── components/
        ├── AquariumBackground.jsx # Multi-depth marine ecosystem & particle engine
        ├── DepthMeter.jsx         # Real-time oceanic depth HUD (0m - 2600m)
        ├── FishAssets.jsx         # Custom SVG fish definitions & anatomy animations
        ├── Navbar.jsx             # Glassmorphic header with live packet ticker
        ├── Hero.jsx               # Bento hero, typewriter headline & interactive CLI
        ├── Skills.jsx             # Categorized skill matrix & toolchain badges
        ├── Labs.jsx               # Featured lab projects & methodology framework
        ├── LabModal.jsx           # Technical lab write-up reader with code blocks
        ├── Contact.jsx            # Social cards, honeypot-protected packet dispatch form
        └── ScrollToTop.jsx        # Floating progress-ring back-to-top button
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fizhkan/FizhTank.git
   cd FizhTank
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run unit tests (Vitest):**
   ```bash
   npm run test
   ```

5. **Build for production (Client + SSR Prerender):**
   ```bash
   npm run build
   ```
   Outputs optimized static assets to the `dist/` directory.

6. **Linting (Oxlint):**
   ```bash
   npm run lint
   ```

---

## ⌨️ Interactive Terminal Commands

You can test these commands directly in the hero terminal:

| Command | Action |
|---|---|
| `help` | Lists all available console commands |
| `whoami` | Displays identity and academic background |
| `skills` | Prints technical proficiencies and networking stack |
| `projects` / `labs` | Lists networking and security lab roadmap |
| `subnet <ip/cidr>` | **IPv4 VLSM Calculator** (e.g. `subnet 192.168.1.0/26`, `subnet 10.0.0.0/23`) |
| `traceroute [target]` | **Network hop tracer** simulation through L3 switch & firewall |
| `ping` / `ping 8.8.8.8` | Sends simulated ICMP packets and measures RTT |
| `nmap` | Runs port scan across local gateway services |
| `cat cv.txt` | Displays brief resume/CV overview |
| `contact` | Communication matrix & social channels |
| `cat /etc/ocean.conf` | Prints system depth telemetry and VLAN configuration |
| `feed` | Dispenses nutrient flakes to feed the aquarium (+100 XP) |
| `clear` | Clears the terminal output history |

---

## 👤 Author

**Siraj / Fizhkan**
- **Status**: Mahasiswa D3 Teknik Informatika · Aspiring Network & Security Engineer
- **GitHub**: [@Fizhkan](https://github.com/Fizhkan)
- **Fokus Belajar**: Dasar Arsitektur Jaringan, Segmentasi VLAN, Packet Analysis (Wireshark), Firewall/ACL, Homelab Arch Linux

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for your own portfolio!
