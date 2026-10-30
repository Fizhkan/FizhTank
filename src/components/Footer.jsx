import { Radio, ArrowUp } from 'lucide-react'
import { site } from '../data/site'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative py-12 px-4 sm:px-6 border-t border-white/10 font-mono text-xs text-slate-400 z-10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Station Identity */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio size={14} />
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider block">
              FIZHTANK STATION
            </span>
            <span className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} Siraj (Fizhkan). Engineered with React &amp; Tailwind.
            </span>
          </div>
        </div>

        {/* Center: Mission motto */}
        <div className="text-center text-[11px] text-slate-500 hidden md:block max-w-md">
          {site.tagline}
        </div>

        {/* Right: Elevation to Surface (Scroll to Top) */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer text-xs"
        >
          <span>SURFACE ASCENT</span>
          <ArrowUp size={13} className="text-cyan-400" />
        </button>
      </div>
    </footer>
  )
}
