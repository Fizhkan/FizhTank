import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

const ZONES = [
  { min: 0, max: 200, name: 'EPIPELAGIC (SUNLIT)', color: '#22d3ee', temp: '22°C', pressure: '1-20 ATM' },
  { min: 200, max: 1000, name: 'MESOPELAGIC (TWILIGHT)', color: '#38bdf8', temp: '8°C', pressure: '20-100 ATM' },
  { min: 1000, max: 4000, name: 'BATHYPELAGIC (MIDNIGHT)', color: '#818cf8', temp: '4°C', pressure: '100-400 ATM' },
  { min: 4000, max: 6000, name: 'ABYSSOPELAGIC (ABYSS)', color: '#a78bfa', temp: '2°C', pressure: '400-600 ATM' },
  { min: 6000, max: 11000, name: 'HADOPELAGIC (TRENCH)', color: '#c084fc', temp: '1°C', pressure: '>600 ATM' },
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
          // Map scroll progress to 0m - 2,800m
          const computedDepth = Math.round(progress * 2800)
          setDepth(computedDepth)

          const zone = ZONES.find((z) => computedDepth <= z.max) || ZONES[ZONES.length - 1]
          setCurrentZone(zone)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <aside
      aria-label="Bathymetric Ocean Depth Instrumentation"
      className="fixed bottom-6 right-6 z-40 select-none pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-950/85 border border-white/10 backdrop-blur-2xl shadow-[0_15px_30px_rgba(0,0,0,0.7)] text-xs font-mono transition-all duration-300">
        {/* Depth Meter Node */}
        <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ backgroundColor: currentZone.color }}
          />
          <Activity size={14} style={{ color: currentZone.color, position: 'relative' }} />
        </div>

        {/* Readout */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[11px]">
            <span style={{ color: currentZone.color }}>DEPTH:</span>
            <span className="text-white tabular-nums">{depth.toLocaleString()} M</span>
          </div>
          <span className="text-[10px] text-slate-400 tracking-tight hidden sm:inline">
            {currentZone.name.split(' ')[0]} // {currentZone.temp}
          </span>
        </div>

        {/* Vertical Depth Column Progress Bar */}
        <div className="w-1 h-7 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
          <div
            className="w-full rounded-full transition-all duration-200"
            style={{
              height: `${Math.max(6, (depth / 2800) * 100)}%`,
              backgroundColor: currentZone.color,
            }}
          />
        </div>
      </div>
    </aside>
  )
}
