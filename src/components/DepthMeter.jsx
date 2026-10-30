import { useState, useEffect } from 'react'
import { Droplets, Activity, Thermometer, Sparkles } from 'lucide-react'
import { site } from '../data/site'

export default function DepthMeter() {
  const [clarity, setClarity] = useState(99.4)
  const [pulse, setPulse] = useState(false)

  // Gentle micro-telemetry fluctuations to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return
      setClarity(+(99.2 + Math.random() * 0.6).toFixed(1))
      setPulse(true)
      setTimeout(() => setPulse(false), 300)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const aq = site.aquarium || {
    waterTemp: '25.4°C',
    phLevel: '7.2 pH',
    tankVolume: '450 LITERS',
    filtration: 'Canister 1,200 L/H',
  }

  return (
    <aside
      aria-label="Aquarium Tank Ecosystem Telemetry"
      className="fixed bottom-6 right-6 z-40 select-none pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-3.5 px-4 py-2.5 rounded-2xl apple-glass shadow-[0_20px_40px_rgba(0,0,0,0.7)] text-xs font-mono transition-all duration-300">
        {/* Animated Aerator Node */}
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
          <span
            className={`absolute inset-0 rounded-full bg-cyan-400 transition-opacity duration-300 ${
              pulse ? 'opacity-80 scale-125' : 'opacity-25 scale-100'
            }`}
          />
          <Droplets size={14} className="text-cyan-300 relative z-10" />
        </div>

        {/* Readout */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold tracking-wider text-[11px]">
            <span className="text-cyan-300 flex items-center gap-1">
              <Thermometer size={11} />
              <span>{aq.waterTemp}</span>
            </span>
            <span className="text-slate-600">//</span>
            <span className="text-emerald-400 font-semibold">{aq.phLevel}</span>
          </div>

          <span className="text-[10px] text-slate-400 tracking-tight hidden sm:flex items-center gap-1 mt-0.5">
            <Sparkles size={9} className="text-cyan-400" />
            <span>TANK: {aq.tankVolume} // {clarity}% CLARITY</span>
          </span>
        </div>

        {/* Status Indicator */}
        <div className="pl-1 border-l border-white/10 hidden md:flex items-center gap-1.5 text-[10px] text-slate-400">
          <Activity size={11} className="text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">ECOSYSTEM BALANCED</span>
        </div>
      </div>
    </aside>
  )
}
