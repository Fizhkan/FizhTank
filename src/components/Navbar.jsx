import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight, Volume2, VolumeX, Fish } from 'lucide-react'
import FishMark from './FishMark'
import { toggleAudio, isAudioActive, playWaterBubble } from '../utils/audio'

const NAV_LINKS = [
  { label: 'Lab', href: '#labs', id: 'labs' },
  { label: 'Skill', href: '#skills', id: 'skills' },
  { label: 'Sertifikasi', href: '#certifications', id: 'certifications' },
  { label: 'Kontak', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [audioActive, setAudioActive] = useState(() => isAudioActive())

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['hero', 'labs', 'skills', 'certifications', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleAudioToggle = () => setAudioActive(toggleAudio())
  const handleFeed = () => window.dispatchEvent(new CustomEvent('fizhtank-feed'))

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-deep/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#hero" className="flex items-center gap-3" aria-label="FizhTank, kembali ke atas">
          <FishMark size={38} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-semibold tracking-tight text-white">FizhTank</span>
            <span className="text-xs text-mist">Portofolio Siraj</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                  isActive ? 'bg-white/12 text-white' : 'text-mist hover:text-white'
                }`}
              >
                {link.label}
              </a>
            )
          })}

          <span className="mx-2 h-6 w-px bg-white/15" aria-hidden="true" />

          <button
            type="button"
            onClick={handleFeed}
            className="btn btn-ghost min-h-10! px-4! py-2! text-sm"
            title="Jatuhkan makanan ke tank"
          >
            <Fish size={16} aria-hidden="true" />
            <span>Beri makan</span>
          </button>

          <button
            type="button"
            onClick={handleAudioToggle}
            aria-pressed={audioActive}
            aria-label={audioActive ? 'Matikan suara air' : 'Nyalakan suara air'}
            title={audioActive ? 'Matikan suara air' : 'Nyalakan suara air'}
            onMouseEnter={playWaterBubble}
            className={`ml-1 flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              audioActive
                ? 'border-aqua/60 bg-aqua/15 text-aqua'
                : 'border-white/20 text-mist hover:border-white/40 hover:text-white'
            }`}
          >
            {audioActive ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <a
            href="https://github.com/Fizhkan"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 px-4 text-sm font-medium text-foam transition-colors hover:border-white/40 hover:bg-white/8"
          >
            <span>GitHub</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-pressed={audioActive}
            aria-label={audioActive ? 'Matikan suara air' : 'Nyalakan suara air'}
            className={`flex h-11 w-11 items-center justify-center rounded-full border ${
              audioActive ? 'border-aqua/60 bg-aqua/15 text-aqua' : 'border-white/20 text-mist'
            }`}
          >
            {audioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-foam"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-b border-white/10 bg-deep/95 px-5 pt-2 pb-6 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col" aria-label="Navigasi seluler">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/8 py-3.5 text-lg font-medium text-foam"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                handleFeed()
                setMobileOpen(false)
              }}
              className="btn btn-primary"
            >
              <Fish size={16} aria-hidden="true" />
              <span>Beri makan ikan</span>
            </button>
            <a
              href="https://github.com/Fizhkan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <span>GitHub</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
