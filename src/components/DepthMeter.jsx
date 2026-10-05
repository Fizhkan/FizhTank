import { useState, useEffect } from 'react'
import { Activity, Compass } from 'lucide-react'

// Zone mappings based on oceanographic depths (0m to 2600m)
const ZONES = [
  { max: 350, name: 'SUNLIT SHALLOWS', color: '#22d3ee' },
  { max: 1100, name: 'TWILIGHT ZONE', color: '#818cf8' },
  { max: 1950, name: 'ABYSSAL PLAIN', color: '#a78bfa' },
  { max: 2600, name: 'HADAL TRENCH', color: '#c084fc' },
]

export default function DepthMeter() {
  const [depth, setDepth] = useState(0)
  const [currentZone, setCurrentZone] = useState(ZONES[0])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
          const computedDepth = Math.round(progress * 2600)
          setDepth(computedDepth)

          const zone = ZONES.find((z) => computedDepth <= z.max) || ZONES[ZONES.length - 1]
          setCurrentZone(zone)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial run

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <aside
      aria-label="Telemetri Kedalaman Ekosistem Akuarium"
      className="fixed right-3 sm:right-6 bottom-24 z-40 select-none pointer-events-none"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-300 group"
        style={{
          background: 'rgba(5, 9, 22, 0.85)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(109, 40, 217, 0.15)',
        }}
        title="Indikator Kedalaman Navigasi Akuarium"
      >
        {/* Pulsing Sonar Node */}
        <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: currentZone.color }}
          />
          <Activity size={14} style={{ color: currentZone.color, position: 'relative' }} />
        </div>

        {/* Telemetry Readout */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
            <span style={{ color: currentZone.color }}>DEPTH:</span>
            <span className="text-zinc-100 tabular-nums font-bold">
              {depth.toLocaleString()} m
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-400">
            <Compass size={10} className="text-violet-400" />
            <span>{currentZone.name}</span>
          </div>
        </div>

        {/* Vertical Depth Progress Bar */}
        <div className="w-1 h-7 bg-zinc-800 rounded-full overflow-hidden flex flex-col justify-end">
          <div
            className="w-full rounded-full transition-all duration-200"
            style={{
              height: `${Math.max(4, (depth / 2600) * 100)}%`,
              background: `linear-gradient(180deg, #22d3ee, ${currentZone.color})`,
            }}
          />
        </div>
      </div>
    </aside>
  )
}
