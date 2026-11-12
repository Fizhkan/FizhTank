import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import FishMark from './FishMark'
import { smoothScrollTo, isProgrammaticScrolling } from '../utils/scroll'

const NAV_LINKS = [
  { num: '01', label: 'Labs', href: '#labs', id: 'labs' },
  { num: '02', label: 'Skills', href: '#skills', id: 'skills' },
  { num: '03', label: 'Targets', href: '#certifications', id: 'certifications' },
  { num: '04', label: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

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
        if (isProgrammaticScrolling()) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-28% 0px -58% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleAnchorClick = (e, id, href, offset = 76) => {
    e.preventDefault()
    setActiveSection(id)
    setMobileOpen(false)
    smoothScrollTo(id === 'hero' ? 0 : id, { offset, hash: href })
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-200 ${
        scrolled
          ? 'bg-deep/78 shadow-[0_12px_32px_rgba(1,10,16,0.45)] backdrop-blur-xl'
          : 'bg-deep/20 backdrop-blur-sm'
      }`}
    >
      {/* Scroll edge fade lembut (menggantikan batas garis keras saat konten menggulir di bawah navbar) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-b from-deep/45 to-transparent transition-opacity duration-200 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, 'hero', '#hero', 0)}
          className="group flex items-center gap-3 transition-transform duration-100 active:scale-[0.97]"
          aria-label="FizhTank, back to top"
        >
          <FishMark size={34} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-tight text-white">FizhTank</span>
            <span className="mt-0.5 font-mono text-[0.6875rem] tracking-wider text-mist uppercase">
              Portfolio // Hafidz
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.id, link.href)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative flex items-baseline gap-1.5 rounded-[2px] px-3.5 py-2 text-sm font-medium transition-[color,transform] duration-150 active:scale-[0.97] ${
                  isActive ? 'text-white' : 'text-mist hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    className="absolute inset-0 -z-10 rounded-[2px] bg-aqua/12"
                    aria-hidden="true"
                  />
                )}
                <span className={`font-mono text-[0.6875rem] ${isActive ? 'text-aqua' : 'text-mist/60'}`}>
                  {link.num}
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-line"
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    className="absolute right-3.5 bottom-0 left-3.5 h-[1.5px] bg-aqua"
                    aria-hidden="true"
                  />
                )}
              </a>
            )
          })}

          <span className="mx-2.5 h-5 w-px bg-aqua/20" aria-hidden="true" />

          <a
            href="https://github.com/Fizhkan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-aqua/20 px-3.5 font-mono text-xs font-medium text-foam transition-[border-color,background-color,transform] duration-150 hover:border-aqua/55 hover:bg-aqua/10 active:scale-[0.97]"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-aqua/25 text-foam transition-transform duration-100 active:scale-[0.95]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — simetris masuk & keluar dari atas, mendukung swipe ke atas untuk menutup */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, transform: 'translateY(-14px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-14px)' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.4, bottom: 0.08 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -45 || info.velocity.y < -280) {
                setMobileOpen(false)
              }
            }}
            className="border-b border-aqua/20 bg-deep/95 px-5 pt-2 pb-5 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col divide-y divide-aqua/12" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.id, link.href)}
                  className="flex items-baseline gap-3 py-3.5 text-lg font-medium text-foam active:opacity-75"
                >
                  <span className="font-mono text-xs text-aqua">{link.num}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            <div className="mt-5">
              <a
                href="https://github.com/Fizhkan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost w-full"
              >
                <span>GitHub</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>

            <div className="mt-4 flex justify-center" aria-hidden="true">
              <span className="h-1 w-9 rounded-full bg-aqua/25" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
