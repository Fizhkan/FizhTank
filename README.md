<div align="center">

# 🐟 FizhTank

**Personal Portfolio & Interactive Aquarium Experience for a Network & Security Engineer**

*Navigating packets, filtering streams, and securing the deep ecosystem.*

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Arch Linux](https://img.shields.io/badge/Arch_Linux-Homelab-1793D1?style=for-the-badge&logo=archlinux)](https://archlinux.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Explore Labs](#-featured-labs) • [Core Skills](#-core-skills) • [Interactive Terminal](#-interactive-terminal-commands)

</div>

---

## 🌊 Overview

**FizhTank** is a high-performance personal portfolio built around a **bioluminescent deep-ocean & aquarium cyberpunk aesthetic**. Designed specifically for a **Network & Security Engineer**, it bridges technical homelab experiments, enterprise networking topologies, and cybersecurity packet analysis with an immersive underwater simulation.

Every visual element represents a component of the digital ecosystem:
- **Packets as schooling fish** moving across depth zones.
- **Firewalls and ACLs** as bio-filtering layers.
- **Terminal CLI** running simulated network diagnostics and tank controls.

---

## ✨ Key Features

### 1. 🪸 Dynamic Aquarium Ecosystem
- **Depth-Layered Water Column**: Seamless gradient transitioning from shallow sunlit water (surface caustics) down through the twilight zone to the hadal abyss (2600m depth).
- **6 Handcrafted SVG Marine Species**:
  - `Neon Tetra`: High-speed schooling packets.
  - `Betta Veil`: Elegant flowing fins with bioluminescent trailing edges.
  - `Abyssal Ray`: Majestic seabed glider with organic wing flexing.
  - `Deep-Sea Angler`: Bioluminescent lure pulsating in the dark.
  - `Bio Jellyfish`: Translucent bell contractions and undulating tentacles.
  - `Cyber Puffer`: Responsive spiny defender.
- **Interactive Tank Feeding**: Click anywhere or type `feed` in the CLI terminal to drop nutrient flakes that attract marine life.

### 2. 💻 Arch Linux Interactive Terminal
- Fully functional embedded terminal (`fizhtank@arch:~$`) with simulated CLI commands:
  - `help` — Lists all available commands.
  - `skills` — Displays network & security proficiencies.
  - `ping [target]` — Simulates ICMP packet telemetry with realistic latency.
  - `nmap` — Port scanner simulation reporting open enterprise services.
  - `cat /etc/ocean.conf` — Dumps network ecosystem topology and VLAN assignments.
  - `feed` — Dispatches event to feed the tank ecosystem (+100 XP celebration toast).
  - `clear` — Resets the terminal screen buffer.
- Features zero horizontal scroll, automatic wrapping, command history, and quick-command suggestion chips.

### 3. 🛡️ Core Skills Matrix & Toolchain
- **Bento Grid Architecture**: Categorized into *Enterprise Routing & Switching*, *Infrastructure & Threat Defense*, and *Systems & Homelab Architecture*.
- **Interactive Mastery Bars**: Hover-triggered percentages with animated edge pulses.
- **Ecosystem Toolchain**: Quick badges for Wireshark, Cisco Packet Tracer, Nmap, pfSense, Pi-hole, UFW/iptables, VirtualBox, Proxmox, and Arch Linux.

### 4. 🔬 Featured Labs & Comprehensive Write-ups
- **Interactive Modal Viewer**: Detailed technical documentation for homelab and enterprise networking projects.
- **Standardized Methodology**:
  1. 📌 **Objective**: Business and operational goals.
  2. 🗺️ **Architecture & Topology**: Multi-tier VLAN/subnet maps.
  3. ⚙️ **Key Commands & Config**: Syntax-highlighted Cisco IOS and Linux configurations.
  4. ✅ **Verification Results**: Ping tests, traceroutes, Wireshark packet captures, and state checks.

### 5. 🔤 Refined Modern Typography
- **Headings**: **Plus Jakarta Sans** — crisp geometric clarity for high-impact display.
- **Body**: **Inter** — optimized OpenType features (`cv02`, `cv03`, `cv04`, `cv11`) with WCAG-compliant dark-mode contrast.
- **Telemetry & CLI**: **JetBrains Mono** — high-legibility developer typeface for code blocks and telemetry badges.

### 6. ⚡ Live Packet Ticker & Navigation
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
        ├── FishAssets.jsx         # Custom SVG fish definitions & anatomy animations
        ├── Navbar.jsx             # Glassmorphic header with live packet ticker
        ├── Hero.jsx               # Bento hero, typewriter headline & interactive CLI
        ├── Skills.jsx             # Categorized skill matrix & toolchain badges
        ├── Labs.jsx               # Featured lab projects & methodology framework
        ├── LabModal.jsx           # Technical lab write-up reader with code blocks
        ├── Contact.jsx            # Social link cards, packet dispatch form & footer
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

4. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs optimized static assets to the `dist/` directory.

5. **Linting:**
   ```bash
   npx oxlint
   ```

---

## ⌨️ Interactive Terminal Commands

You can test these commands directly in the hero terminal:

| Command | Action |
|---|---|
| `help` | Lists all available console commands |
| `skills` | Prints technical proficiencies and networking stack |
| `ping` / `ping 8.8.8.8` | Sends simulated ICMP packets and measures RTT |
| `nmap` | Runs port scan across local gateway services |
| `cat /etc/ocean.conf` | Prints system depth telemetry and VLAN configuration |
| `feed` | Dispenses nutrient flakes to feed the aquarium |
| `clear` | Clears the terminal output history |

---

## 👤 Author

**Siraj / Fizhkan**
- **Role**: Network & Security Engineer
- **GitHub**: [@Fizhkan](https://github.com/Fizhkan)
- **Specializations**: Enterprise Networks, VLAN Segmentation, Firewalls, Threat Mitigation, Arch Linux Homelabs

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for your own portfolio!
