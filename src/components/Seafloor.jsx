import { useMemo } from 'react'
import { Anchor, Activity, Wifi } from 'lucide-react'

// Background Kelp layer (darker, slower, smaller)
const BG_KELP_COUNT = 16
// Foreground Kelp layer (taller, lush leaves, vibrant)
const FG_KELP_COUNT = 20

// Vent bubble origins on the seafloor
const SEABED_BUBBLES = [
  { left: '8%', delay: 0.5, dur: 4.5 },
  { left: '22%', delay: 2.1, dur: 5.2 },
  { left: '38%', delay: 1.2, dur: 4.8 },
  { left: '55%', delay: 3.0, dur: 5.5 },
  { left: '71%', delay: 0.8, dur: 4.2 },
  { left: '86%', delay: 2.5, dur: 5.0 },
]

export default function Seafloor() {
  const bgKelp = useMemo(
    () =>
      Array.from({ length: BG_KELP_COUNT }, (_, i) => ({
        left: `${(i / BG_KELP_COUNT) * 100 + (i % 3) * 1.2}%`,
        height: 110 + (i % 5) * 20,
        delay: `${(i * 0.45) % 4}s`,
        duration: `${3.6 + (i % 3) * 0.8}s`,
        opacity: 0.25 + (i % 3) * 0.08,
        swayType: i % 2 === 0 ? 'kelp-sway-left' : 'kelp-sway-right',
        hue: i % 2 === 0 ? '#04432b' : '#065f46',
      })),
    []
  )

  const fgKelp = useMemo(
    () =>
      Array.from({ length: FG_KELP_COUNT }, (_, i) => ({
        left: `${(i / FG_KELP_COUNT) * 98 + ((i * 3) % 4) * 0.7}%`,
        height: 140 + (i % 6) * 22,
        delay: `${(i * 0.38) % 3.5}s`,
        duration: `${2.8 + (i % 4) * 0.6}s`,
        opacity: 0.45 + (i % 3) * 0.15,
        swayType: i % 2 === 0 ? 'kelp-sway-right' : 'kelp-sway-left',
        hue: i % 3 === 0 ? '#059669' : i % 3 === 1 ? '#047857' : '#10b981',
      })),
    []
  )

  return (
    <div
      className="relative w-full overflow-hidden select-none pointer-events-none"
      style={{
        marginTop: '-30px',
        paddingTop: '60px',
        minHeight: '260px',
      }}
      aria-hidden="true"
    >
      {/* ── Abyss depth gradient fade ── */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(4, 8, 20, 0.7) 100%)',
        }}
      />

      {/* ── Submarine Fiber Optic Cable (Network Theme) ── */}
      <div className="relative max-w-6xl mx-auto px-6 mb-4 z-20">
        <div
          className="flex items-center justify-between gap-4 py-2 px-4 rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(6, 14, 30, 0.75)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Anchor size={13} className="text-cyan-400" />
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wide">
                BENTHIC ZONE // SEAFLOOR
              </span>
              <span className="hidden sm:inline text-zinc-600 font-mono text-xs">•</span>
              <span className="font-mono text-[11px] text-zinc-400">
                Depth: <span className="text-emerald-400">10,928m</span> (Mariana Trench)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline font-mono text-[11px] text-emerald-300">
                Undersea Cable Link: 100 Gbps
              </span>
            </div>
            <Activity size={12} className="text-cyan-400" />
          </div>
        </div>

        {/* Cable graphic with travelling light packet */}
        <div className="relative w-full h-1 mt-2 rounded-full overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
          <div
            className="absolute inset-y-0 w-full"
            style={{
              background: 'linear-gradient(90deg, #059669 0%, #06b6d4 50%, #8b5cf6 100%)',
              opacity: 0.35,
            }}
          />
          {/* Moving packet pulse */}
          <div
            className="absolute top-0 bottom-0 w-24 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #06b6d4, #a78bfa, transparent)',
              animation: 'cable-packet 3.2s linear infinite',
            }}
          />
        </div>
      </div>

      {/* ── Seabed Vent Bubbles ── */}
      {SEABED_BUBBLES.map((b, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{
            bottom: '25px',
            left: b.left,
          }}
        >
          {[0, 1, 2].map((j) => (
            <div
              key={j}
              style={{
                position: 'absolute',
                bottom: 0,
                marginLeft: `${j * 6 - 6}px`,
                width: `${4 + j * 2}px`,
                height: `${4 + j * 2}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7), rgba(6,182,212,0.3))',
                border: '1px solid rgba(52,211,153,0.4)',
                animation: `bubble-rise ${b.dur}s ease-in ${b.delay + j * 1.3}s infinite`,
              }}
            />
          ))}
        </div>
      ))}

      {/* ── KELP FOREST CONTAINER ── */}
      <div
        className="relative w-full"
        style={{
          height: '210px',
        }}
      >
        {/* Layer 1: Background Kelp (darker, denser, slower sway) */}
        <div className="absolute inset-0 z-0">
          {bgKelp.map((s, i) => (
            <div
              key={`bg-${i}`}
              style={{
                position: 'absolute',
                bottom: '22px',
                left: s.left,
                width: '8px',
                height: `${s.height}px`,
                background: `linear-gradient(0deg, #022c1b 0%, ${s.hue} 60%, #059669 100%)`,
                borderRadius: '6px 6px 2px 2px',
                transformOrigin: 'bottom center',
                animation: `${s.swayType} ${s.duration} ease-in-out ${s.delay} infinite`,
                opacity: s.opacity,
                filter: 'blur(0.4px)',
              }}
            >
              {/* Left blade */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '-10px',
                  width: '14px',
                  height: '8px',
                  background: 'rgba(4, 67, 43, 0.65)',
                  borderRadius: '60% 0 60% 0',
                  transform: 'rotate(-25deg)',
                }}
              />
              {/* Right blade */}
              <div
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '-10px',
                  width: '12px',
                  height: '7px',
                  background: 'rgba(4, 67, 43, 0.55)',
                  borderRadius: '0 60% 0 60%',
                  transform: 'rotate(20deg)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Layer 2: Foreground Kelp (vibrant emerald with bioluminescent tips) */}
        <div className="absolute inset-0 z-10">
          {fgKelp.map((s, i) => (
            <div
              key={`fg-${i}`}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: s.left,
                width: '10px',
                height: `${s.height}px`,
                background: `linear-gradient(0deg, #042f1a 0%, ${s.hue} 60%, #34d399 100%)`,
                borderRadius: '8px 8px 3px 3px',
                transformOrigin: 'bottom center',
                animation: `${s.swayType} ${s.duration} ease-in-out ${s.delay} infinite`,
                opacity: s.opacity,
                boxShadow: i % 4 === 0 ? '0 0 12px rgba(52, 211, 153, 0.35)' : undefined,
              }}
            >
              {/* Bioluminescent tip spore */}
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#6ee7b7',
                  boxShadow: '0 0 8px #34d399',
                  opacity: 0.8,
                }}
              />

              {/* Staggered leaves along stalk */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '-12px',
                  width: '15px',
                  height: '10px',
                  background: 'rgba(5, 150, 105, 0.8)',
                  borderRadius: '60% 0 60% 0',
                  transform: 'rotate(-22deg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '32px',
                  right: '-12px',
                  width: '14px',
                  height: '9px',
                  background: 'rgba(16, 185, 129, 0.75)',
                  borderRadius: '0 60% 0 60%',
                  transform: 'rotate(18deg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '56px',
                  left: '-11px',
                  width: '13px',
                  height: '8px',
                  background: 'rgba(4, 120, 87, 0.75)',
                  borderRadius: '60% 0 60% 0',
                  transform: 'rotate(-16deg)',
                }}
              />
              {s.height > 170 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '80px',
                    right: '-10px',
                    width: '12px',
                    height: '8px',
                    background: 'rgba(5, 150, 105, 0.7)',
                    borderRadius: '0 60% 0 60%',
                    transform: 'rotate(15deg)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Seabed Terrain Dunes & Reef Silhouette ── */}
        <div className="absolute bottom-0 inset-x-0 z-20">
          {/* Back seabed dune */}
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            className="w-full h-12 block -mb-4 opacity-75"
            preserveAspectRatio="none"
          >
            <path
              d="M0,35 C180,15 320,45 500,25 C680,5 820,40 1000,20 C1180,38 1320,18 1440,30 L1440,60 L0,60 Z"
              fill="#031f14"
            />
          </svg>

          {/* Front rocky seabed with sand texture */}
          <svg
            viewBox="0 0 1440 45"
            fill="none"
            className="w-full h-10 block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C140,8 260,30 420,15 C580,0 720,25 880,12 C1040,28 1200,8 1440,18 L1440,45 L0,45 Z"
              fill="#02140d"
            />
          </svg>

          {/* Seafloor solid bedrock base */}
          <div
            className="w-full h-5"
            style={{
              background: 'linear-gradient(180deg, #02140d 0%, #010a06 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
