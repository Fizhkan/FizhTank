import { useState, useEffect } from 'react'
import { Fish, Terminal, Menu, X, Waves, Anchor } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const pct = Math.min(100, Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100))
      setDepth(pct)
    }
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
        scrolled
          ? 'backdrop-blur-xl border-b'
          : 'bg-transparent'
      }`}
      style={
        scrolled
          ? {
              background: 'rgba(4,6,15,0.85)',
              borderColor: 'rgba(99,102,241,0.15)',
            }
          : {}
      }
    >
      {/* Depth progress bar */}
      <div
        className="absolute bottom-0 left-0 h-px transition-all duration-300"
        style={{
          width: `${depth}%`,
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          boxShadow: '0 0 6px rgba(6,182,212,0.6)',
        }}
      />

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
            {/* bubble deco */}
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
          <span className="hidden sm:flex items-center gap-1 ml-0.5 font-mono text-xs" style={{ color: 'rgba(6,182,212,0.5)' }}>
            <Anchor size={9} />
            <span>v2.0</span>
          </span>
        </a>

        {/* Status Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
          style={{
            background: 'rgba(8,12,28,0.7)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}
        >
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
            🫧 Swimming in Packets&nbsp;·&nbsp;Open to Work
          </span>
        </div>

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
          style={{
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a1a1aa',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b py-4 px-6 flex flex-col gap-4"
          style={{
            background: 'rgba(4,6,15,0.95)',
            borderColor: 'rgba(99,102,241,0.15)',
          }}
        >
          <div className="flex items-center gap-2 py-1">
            <span className="relative flex h-2 w-2">
              <span className="blink absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#06b6d4' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#0891b2' }} />
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
