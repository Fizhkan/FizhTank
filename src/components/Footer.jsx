import { Fish } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Bottom Kelp (anchored strictly to the bottom edge of the page) ──
const KELP_STALKS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i / 20) * 98 + (i % 3) * 0.7}%`,
  height: 45 + (i % 5) * 12,
  delay: `${(i * 0.35) % 3}s`,
  duration: `${2.5 + (i % 4) * 0.5}s`,
  opacity: 0.28 + (i % 4) * 0.08,
  swayType: i % 2 === 0 ? 'kelp-sway-left' : 'kelp-sway-right',
  hue: i % 3 === 0 ? '#059669' : i % 3 === 1 ? '#047857' : '#065f46',
}))

function BottomKelp() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: '75px', zIndex: 0 }}
      aria-hidden="true"
    >
      {/* seafloor thin edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, #021a10 0%, #042f1a 50%, #021a10 100%)',
        }}
      />
      {KELP_STALKS.map((s, i) => (
        <div
          key={i}
          className={i % 2 !== 0 ? 'hidden sm:block' : ''}
          style={{
            position: 'absolute',
            bottom: '2px',
            left: s.left,
            width: '8px',
            height: `${s.height}px`,
            background: `linear-gradient(0deg, ${s.hue} 0%, #059669 60%, #34d399 100%)`,
            borderRadius: '5px 5px 2px 2px',
            transformOrigin: 'bottom center',
            animation: `${s.swayType} ${s.duration} ease-in-out ${s.delay} infinite`,
            opacity: s.opacity,
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          {/* subtle leaf left */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '-7px',
              width: '10px',
              height: '6px',
              background: 'rgba(5,150,105,0.6)',
              borderRadius: '50% 0 50% 0',
              transform: 'rotate(-20deg)',
            }}
          />
          {/* subtle leaf right */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '-7px',
              width: '9px',
              height: '5px',
              background: 'rgba(4,120,87,0.5)',
              borderRadius: '0 50% 0 50%',
              transform: 'rotate(16deg)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function Footer() {
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.3 })

  return (
    <footer
      className="relative pt-8 pb-12 px-6 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={footerRef}
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-zinc-400 font-mono relative z-10"
          style={{
            borderColor: 'rgba(99,102,241,0.1)',
            opacity: footerVisible ? 1 : 0,
            transform: footerVisible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div className="flex items-center gap-2">
            <Fish size={14} className="text-violet-400" />
            <span className="text-zinc-300">FizhTank &copy; {new Date().getFullYear()}</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400">Environment ready</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Built with React 19 + Tailwind v4 + Vite</span>
            <span className="text-zinc-500">|</span>
            <a
              href="https://github.com/Fizhkan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Fizhkan
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Kelp at Bottom */}
      <BottomKelp />
    </footer>
  )
}
