import { useState, useEffect } from 'react'
import { Fish, Terminal, Menu, X, Waves } from 'lucide-react'

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
        scrolled
          ? 'backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/30 group-hover:border-violet-500/60 group-hover:bg-violet-500/20 transition-all">
            <Fish size={16} className="text-violet-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-zinc-100">Fizh</span>
            <span className="text-violet-400">Tank</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 ml-1 font-mono text-xs text-zinc-500">
            <Terminal size={10} />
            <span>v2.0</span>
          </span>
        </a>

        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/50">
          <span className="relative flex h-2 w-2">
            <span className="blink absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-xs text-zinc-400 font-mono">🫧 Swimming in Packets&nbsp;·&nbsp;Open to Work</span>
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
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-violet-500/50 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 py-4 px-6 flex flex-col gap-4">
          {/* Mobile Status */}
          <div className="flex items-center gap-2 py-2">
            <span className="relative flex h-2 w-2">
              <span className="blink absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs text-zinc-400 font-mono">🫧 Swimming in Packets · Open to Work</span>
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
