import { useState, useEffect, useRef } from 'react'
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
      className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg font-mono text-xs backdrop-blur-sm select-none"
      style={{
        background: 'rgba(4,10,25,0.7)',
        border: '1px solid rgba(6,182,212,0.18)',
        color: 'rgba(6,182,212,0.65)',
      }}
    >
      {/* Sonar pulse icon */}
      <span className="relative flex items-center justify-center w-4 h-4">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(6,182,212,0.15)',
            animation: 'depth-ping 2.2s ease-out infinite',
          }}
        />
        <Activity size={10} style={{ color: '#06b6d4', position: 'relative' }} />
      </span>

      {/* Packet count */}
      <span>
        <span style={{ color: 'rgba(167,139,250,0.7)' }}>pkt</span>
        <span className="ml-1" style={{ color: '#e4e4f0' }}>
          {pkts.toLocaleString()}
        </span>
      </span>

      <span style={{ color: 'rgba(99,102,241,0.3)' }}>|</span>

      {/* Latency */}
      <span>
        <span style={{ color: 'rgba(167,139,250,0.7)' }}>lat</span>
        <span
          className="ml-1"
          style={{ color: lat < 1.5 ? '#34d399' : lat < 2.2 ? '#fbbf24' : '#f87171' }}
        >
          {lat}ms
        </span>
      </span>

      <span style={{ color: 'rgba(99,102,241,0.3)' }}>|</span>

      {/* Status */}
      <span className="flex items-center gap-1">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full blink"
          style={{ background: active ? '#34d399' : '#f87171' }}
        />
        <span style={{ color: active ? 'rgba(52,211,153,0.7)' : 'rgba(248,113,113,0.7)' }}>
          {active ? 'LIVE' : 'WAIT'}
        </span>
      </span>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Labs', href: '#labs' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all bio-glow"
            style={{
              background: 'rgba(109,40,217,0.12)',
              border: '1px solid rgba(139,92,246,0.35)',
            }}
          >
            <Fish size={17} className="text-violet-400 group-hover:text-cyan-400 transition-colors" />
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full blink"
              style={{ background: 'rgba(6,182,212,0.6)' }}
            />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-zinc-100">Fizh</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #06b6d4)' }}
            >
              Tank
            </span>
          </span>
          <span
            className="hidden sm:flex items-center gap-1 ml-0.5 font-mono text-xs"
            style={{ color: 'rgba(6,182,212,0.5)' }}
          >
            <Anchor size={9} />
            <span>v2.0</span>
          </span>
        </a>

        {/* Live Packet Ticker — replaces progress bar */}
        <PacketTicker />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all"
          style={{ border: '1px solid rgba(99,102,241,0.25)', color: '#a1a1aa' }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b py-4 px-6 flex flex-col gap-4"
          style={{ background: 'rgba(4,6,15,0.95)', borderColor: 'rgba(99,102,241,0.15)' }}
        >
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
            <span className="text-xs font-mono" style={{ color: 'rgba(167,139,250,0.8)' }}>
              🫧 Swimming in Packets · Open to Work
            </span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-zinc-300 hover:text-violet-400 font-medium transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
