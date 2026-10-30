import { useState, useEffect } from 'react'
import { Radio, Menu, X, Waves, ArrowUpRight, Volume2, VolumeX } from 'lucide-react'
import { toggleAudio, isAudioActive, playWaterBubble, playSonarPing } from '../utils/audio'

const NAV_LINKS = [
  { label: 'Labs', index: '01', href: '#labs' },
  { label: 'Protocols', index: '02', href: '#skills' },
  { label: 'Credentials', index: '03', href: '#certifications' },
  { label: 'Uplink', index: '04', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [packets, setPackets] = useState(1482)
  const [latency, setLatency] = useState(0.8)
  const [audioActive, setAudioActive] = useState(() => isAudioActive())

  // Track scroll depth for navbar blur
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return
      setPackets((prev) => prev + Math.floor(Math.random() * 12 + 3))
      setLatency(+(Math.random() * 0.8 + 0.4).toFixed(1))
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  // Section observer for active link
  useEffect(() => {
    const sections = ['hero', 'skills', 'labs', 'certifications', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleAudioToggle = () => {
    const active = toggleAudio()
    setAudioActive(active)
  }

  const handleSonarPing = () => {
    playSonarPing()
    window.dispatchEvent(new CustomEvent('fizhtank-feed'))
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand / Station Call-sign */}
        <a
          href="#"
          onMouseEnter={playWaterBubble}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Radio size={16} />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold font-display tracking-tight text-white text-base uppercase">
              FizhTank
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
              ABYSSAL STATION
            </span>
          </div>
        </a>

        {/* Live Hydro-Acoustic Telemetry Pill (Center) */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md font-mono text-xs text-slate-300 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400 font-medium">ACOUSTIC:</span>
          </span>
          <span className="font-semibold text-white tabular-nums">{packets.toLocaleString()} PKT</span>
          <span className="text-slate-600">//</span>
          <span className="text-slate-400">RTT:</span>
          <span className="font-semibold text-emerald-400 tabular-nums">{latency}ms</span>
          <span className="text-slate-600">//</span>
          <button
            onClick={handleSonarPing}
            onMouseEnter={playWaterBubble}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
            title="Kirim gelombang sonar akustik ke kedalaman samudra"
          >
            <Waves size={12} />
            <span>SONAR PING</span>
          </button>
        </div>

        {/* Desktop Navigation Links & Controls */}
        <nav className="hidden md:flex items-center gap-2 font-mono text-xs">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            aria-label={audioActive ? 'Mute oceanic hydro-synth audio' : 'Unmute oceanic hydro-synth audio'}
            title={audioActive ? 'Matikan audio drone samudra (52Hz)' : 'Aktifkan audio synthesizer drone samudra'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              audioActive
                ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            {audioActive ? (
              <>
                <Volume2 size={13} className="text-cyan-300 shrink-0" />
                <span className="text-[10px] font-bold tracking-wider uppercase">AUDIO [ON]</span>
                {/* 4 Animated Equalizer Wave Bars */}
                <span className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2.5" />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="shrink-0" />
                <span className="text-[10px] tracking-wider uppercase">AUDIO [OFF]</span>
              </>
            )}
          </button>

          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={playWaterBubble}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/[0.08] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className="text-cyan-400/70 text-[10px] font-bold">{link.index}</span>
                <span>{link.label}</span>
              </a>
            )
          })}

          <a
            href="https://github.com/Fizhkan"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playWaterBubble}
            className="ml-2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all cursor-pointer font-mono text-xs"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} className="text-slate-400" />
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleAudioToggle}
            aria-label={audioActive ? 'Mute audio' : 'Unmute audio'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
              audioActive
                ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                : 'border-white/10 bg-white/[0.04] text-slate-400'
            }`}
          >
            {audioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 font-mono text-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
            <span>STATION TELEMETRY</span>
            <span className="text-emerald-400 font-semibold">{latency}ms // {packets} PKT</span>
          </div>

          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 flex items-center justify-between text-slate-200 hover:text-cyan-400 transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-xs text-cyan-400 font-bold">{link.index}</span>
              </a>
            ))}

            <button
              onClick={() => {
                handleSonarPing()
                setMobileOpen(false)
              }}
              className="py-2.5 flex items-center justify-between text-cyan-400 hover:text-cyan-300 transition-colors text-left"
            >
              <span>TRIGGER SONAR PING</span>
              <Waves size={14} />
            </button>

            <a
              href="https://github.com/Fizhkan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 flex items-center justify-between text-slate-200 hover:text-cyan-400 transition-colors"
            >
              <span>GitHub / Fizhkan</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
