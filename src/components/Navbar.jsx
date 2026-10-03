import { useState, useEffect } from 'react'
import { Fish, Menu, X, Anchor, Activity } from 'lucide-react'

// Live "network stats" ticker — purely decorative random values
function PacketTicker() {
  const [pkts, setPkts] = useState(1247)
  const [lat, setLat] = useState(1.2)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setPkts((p) => p + Math.floor(Math.random() * 18 + 2))
      setLat(+(Math.random() * 2.8 + 0.4).toFixed(1))
      setActive((a) => !a || Math.random() > 0.15)
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-lg font-mono text-[12px] font-medium backdrop-blur-sm select-none"
      style={{
        background: 'rgba(4,10,25,0.75)',
        border: '1px solid rgba(6,182,212,0.25)',
        color: 'rgba(6,182,212,0.8)',
      }}
      title="Simulasi telemetri jaringan"
      aria-label="Simulasi telemetri jaringan"
    >
      {/* Sonar pulse icon */}
      <span className="relative flex items-center justify-center w-4 h-4">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(6,182,212,0.2)',
            animation: 'depth-ping 2.2s ease-out infinite',
          }}
        />
        <Activity size={11} style={{ color: '#06b6d4', position: 'relative' }} />
      </span>

      {/* Packet count */}
      <span>
        <span className="text-violet-300 font-medium">pkt</span>
        <span
          className="ml-1 tabular-nums font-semibold text-zinc-100"
        >
          {pkts.toLocaleString()}
        </span>
      </span>

      <span style={{ color: 'rgba(99,102,241,0.3)' }}>|</span>

      {/* Latency */}
      <span>
        <span className="text-violet-300 font-medium">lat</span>
        <span
          className="ml-1 tabular-nums font-semibold"
          style={{
            color: lat < 1.5 ? '#34d399' : lat < 2.2 ? '#fbbf24' : '#f87171',
            transition: 'color 0.3s ease',
          }}
        >
          {lat}ms
        </span>
      </span>

      <span style={{ color: 'rgba(99,102,241,0.3)' }}>|</span>

      {/* Status */}
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full blink"
          style={{
            background: active ? '#34d399' : '#f87171',
            transition: 'background 0.3s',
          }}
        />
        <span
          className="font-semibold tracking-wide"
          style={{
            color: active ? '#34d399' : '#f87171',
            transition: 'color 0.3s',
          }}
        >
          {active ? 'DEMO' : 'WAIT'}
        </span>
      </span>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const sections = ['about', 'skills', 'labs', 'certifications', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -60% 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Labs', href: '#labs' },
    { label: 'Credentials', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl border-b' : 'bg-transparent'
      }`}
      style={
        scrolled
          ? { background: 'rgba(4,6,15,0.85)', borderColor: 'rgba(99,102,241,0.15)' }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all bio-glow group-hover:scale-110"
            style={{
              background: 'rgba(109,40,217,0.12)',
              border: '1px solid rgba(139,92,246,0.35)',
              transition: 'all 0.3s ease',
            }}
          >
            <Fish size={17} className="text-violet-400 group-hover:text-cyan-400 transition-colors duration-300" />
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full blink"
              style={{ background: 'rgba(6,182,212,0.6)' }}
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight font-display">
            <span className="text-zinc-50">Fizh</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #c4b5fd, #22d3ee)' }}
            >
              Tank
            </span>
          </span>
          <span
            className="hidden sm:flex items-center gap-1 ml-1 font-mono text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30"
          >
            <Anchor size={10} className="text-cyan-400" />
            <span>v2.0</span>
          </span>
        </a>

        {/* Live Packet Ticker — replaces progress bar */}
        <PacketTicker />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeSection === sectionId
            return (
              <a
                key={link.label}
                href={link.href}
                className="nav-link relative"
                style={{
                  color: isActive ? '#e4e4f0' : undefined,
                }}
              >
                {link.label}
                {/* Active indicator dot */}
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(0)',
                    transition: 'all 0.3s ease',
                  }}
                />
              </a>
            )
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all relative overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.25)', color: '#a1a1aa' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Tutup navigasi utama' : 'Buka navigasi utama'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-menu"
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: mobileOpen ? 0 : 1,
              transform: mobileOpen ? 'rotate(90deg) scale(0.5)' : 'rotate(0) scale(1)',
            }}
          >
            <Menu size={18} />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.5)',
            }}
          >
            <X size={18} />
          </div>
        </button>
      </div>

      {/* Mobile Menu — Animated Slide-down */}
      <div
        id="mobile-navigation-menu"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b overflow-hidden ${
          !mobileOpen ? 'pointer-events-none' : ''
        }`}
        style={{
          background: 'rgba(4,6,15,0.95)',
          borderColor: 'rgba(99,102,241,0.15)',
          maxHeight: mobileOpen ? '300px' : '0',
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.4s',
        }}
      >
        <div className="py-4 px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 py-1">
            <span className="relative flex h-2 w-2">
              <span
                className="blink absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#06b6d4' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: '#0891b2' }}
              />
            </span>
            <span className="text-[12.5px] font-mono font-medium text-purple-300">
              🫧 Swimming in Packets · [ISI DI SINI: Status]
            </span>
          </div>
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              tabIndex={mobileOpen ? 0 : -1}
              className="text-zinc-100 hover:text-cyan-300 font-display font-semibold text-base transition-all py-1.5"
              onClick={() => setMobileOpen(false)}
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-15px)',
                transition: `all 0.3s ease ${0.1 + idx * 0.07}s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
