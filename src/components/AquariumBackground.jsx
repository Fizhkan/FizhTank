import { useMemo, useState, useEffect, useCallback } from 'react'
import {
  FishDefs,
  NeonTetra,
  BettaVeil,
  AbyssalRay,
  DeepSeaAngler,
  BioJellyfish,
  CyberPuffer,
} from './FishAssets'

// ── Fish Ecosystem Data with Depths & Species (Optimized for 60 FPS) ──
const FISH_ECOSYSTEM = [
  // ── SURFACE / PHOTIC ZONE (Moonlit Shallows: 8% - 22%) ──
  {
    id: 'tetra-1',
    species: 'tetra',
    y: 9,
    scale: 0.95,
    dur: 26,
    delay: 0,
    baseOp: 0.8,
    flip: false,
    bobDur: 2.8,
  },
  {
    id: 'betta-1',
    species: 'betta',
    y: 18,
    scale: 1.05,
    dur: 34,
    delay: -12,
    baseOp: 0.85,
    flip: true,
    bobDur: 3.6,
  },

  // ── MIDWATER / TWILIGHT ZONE (28% - 52%) ──
  {
    id: 'puffer-1',
    species: 'puffer',
    y: 28,
    scale: 0.85,
    dur: 24,
    delay: -6,
    baseOp: 0.8,
    flip: false,
    bobDur: 2.6,
  },
  {
    id: 'ray-1',
    species: 'ray',
    y: 40,
    scale: 1.15,
    dur: 42,
    delay: -8,
    baseOp: 0.75,
    flip: true,
    bobDur: 4.8,
  },
  {
    id: 'jelly-1',
    species: 'jelly',
    y: 50,
    scale: 1.0,
    dur: 36,
    delay: -18,
    baseOp: 0.7,
    flip: false,
    bobDur: 4.2,
  },

  // ── ABYSSAL ZONE (Deep Trenches & Hadal: 66% - 82%) ──
  {
    id: 'angler-1',
    species: 'angler',
    y: 68,
    scale: 1.1,
    dur: 32,
    delay: -4,
    baseOp: 0.85,
    flip: false,
    bobDur: 3.2,
  },
  {
    id: 'ray-2',
    species: 'ray',
    y: 82,
    scale: 0.9,
    dur: 46,
    delay: -22,
    baseOp: 0.65,
    flip: false,
    bobDur: 5.0,
  },
]

// ── Ambient glow orbs (zero-cost radial gradients without CSS blur filters) ──
const ORBS = [
  { left: '15%', top: '20%', size: 180, color: 'rgba(109,40,217,0.12)', dur: '22s' },
  { left: '75%', top: '35%', size: 220, color: 'rgba(6,182,212,0.10)',  dur: '26s' },
  { left: '40%', top: '65%', size: 260, color: 'rgba(91,33,182,0.14)',  dur: '24s' },
  { left: '60%', top: '10%', size: 140, color: 'rgba(6,182,212,0.10)',  dur: '18s' },
]

// ── Bubble streams (streamlined from 12 to 6 columns) ──
const BUBBLES = [
  { left: '8%',  delay: 0,   dur: 9  },
  { left: '26%', delay: 2.5, dur: 12 },
  { left: '45%', delay: 1.0, dur: 8  },
  { left: '64%', delay: 3.5, dur: 11 },
  { left: '82%', delay: 1.8, dur: 10 },
  { left: '94%', delay: 4.2, dur: 9  },
]

export default function AquariumBackground() {
  const [isFed, setIsFed] = useState(false)
  const [foodFlakes, setFoodFlakes] = useState([])
  const [isTabActive, setIsTabActive] = useState(true)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  )

  // Listen for tab visibility, viewport resize, and reduced-motion preference
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const mobileQuery = window.matchMedia('(max-width: 768px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleMobileChange = (e) => setIsMobile(e.matches)
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches)

    mobileQuery.addEventListener('change', handleMobileChange)
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      mobileQuery.removeEventListener('change', handleMobileChange)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Filter fish ecosystem based on device mode
  const activeFishList = useMemo(() => {
    if (isMobile) {
      // Pick 3 distinct species across water depths on mobile to minimize GPU load
      return [
        FISH_ECOSYSTEM[0], // tetra (surface)
        FISH_ECOSYSTEM[3], // ray (midwater)
        FISH_ECOSYSTEM[5], // angler (abyssal)
      ]
    }
    return FISH_ECOSYSTEM
  }, [isMobile])

  // Reduced bubble streams on mobile
  const activeBubbles = useMemo(() => {
    return isMobile ? BUBBLES.slice(0, 2) : BUBBLES
  }, [isMobile])

  // Lightweight plankton generation (6 on mobile, 14 on desktop)
  const plankton = useMemo(() => {
    const count = isMobile ? 6 : 14
    return Array.from({ length: count }, (_, i) => ({
      left: `${Math.sin(i * 47.3) * 50 + 50}%`,
      top: `${Math.sin(i * 31.7) * 50 + 50}%`,
      delay: `${(i * 0.41) % 8}s`,
      dur: `${4 + (i % 5)}s`,
      size: 1 + (i % 3),
    }))
  }, [isMobile])

  // Trigger nutrient flakes drop
  const triggerFeeding = useCallback((originX = null) => {
    setIsFed(true)
    const newFlakes = Array.from({ length: 22 }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      left: originX !== null
        ? `${Math.max(2, Math.min(98, originX + (Math.random() * 20 - 10)))}%`
        : `${Math.random() * 92 + 4}%`,
      delay: `${Math.random() * 1.5}s`,
      dur: `${5 + Math.random() * 4}s`,
      size: `${3 + Math.random() * 4}px`,
      color: idx % 3 === 0 ? '#f59e0b' : idx % 3 === 1 ? '#22d3ee' : '#a855f7',
    }))

    setFoodFlakes((prev) => [...prev, ...newFlakes])

    setTimeout(() => {
      setIsFed(false)
    }, 6000)

    setTimeout(() => {
      setFoodFlakes((prev) => prev.filter((f) => !newFlakes.includes(f)))
    }, 10000)
  }, [])

  // Listen for terminal "feed" command event
  useEffect(() => {
    const handleFeedEvent = () => triggerFeeding()
    window.addEventListener('fizhtank-feed', handleFeedEvent)
    return () => window.removeEventListener('fizhtank-feed', handleFeedEvent)
  }, [triggerFeeding])

  // Helper to render the appropriate SVG fish component
  const renderFishComponent = (species, scale, glow) => {
    switch (species) {
      case 'tetra':
        return <NeonTetra scale={scale} glow={glow} />
      case 'betta':
        return <BettaVeil scale={scale} glow={glow} />
      case 'ray':
        return <AbyssalRay scale={scale} glow={glow} />
      case 'angler':
        return <DeepSeaAngler scale={scale} glow={glow} />
      case 'jelly':
        return <BioJellyfish scale={scale} glow={glow} />
      case 'puffer':
        return <CyberPuffer scale={scale} glow={glow} />
      default:
        return <NeonTetra scale={scale} glow={glow} />
    }
  }

  return (
    <>
      {/* ── Global SVG Gradients & Filters definitions ── */}
      <FishDefs />

      {/* ── Fixed full-screen ocean ── */}
      <div
        className={`aquarium-bg select-none ${!isTabActive || prefersReducedMotion ? 'anim-paused' : ''}`}
        aria-hidden="true"
        onClick={(e) => {
          const xPercent = (e.clientX / window.innerWidth) * 100
          triggerFeeding(xPercent)
        }}
      >
        {/* Depth gradient — matches CSS aquarium-bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #0b1a35 0%, #081428 10%, #060f20 22%, #050d1a 38%, #030a14 55%, #02070e 72%, #010508 88%, #000304 100%)',
          }}
        />

        {/* Surface zone — sunlight/moonlight penetrating from above */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '35%',
            background:
              'radial-gradient(ellipse 110% 60% at 50% -10%, rgba(6,182,212,0.18) 0%, transparent 65%), ' +
              'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Mid-water light scatter — twilight zone caustics */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: 0,
            right: 0,
            height: '30%',
            background:
              'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(6,182,212,0.07) 0%, transparent 70%), ' +
              'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(91,33,182,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient glow orbs (zero-cost radial gradients) */}
        {ORBS.map((o, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: o.left,
              top: o.top,
              width: o.size,
              height: o.size,
              background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
              borderRadius: '50%',
              animation: `plankton-drift ${o.dur} ease-in-out ${i * 2}s infinite`,
              pointerEvents: 'none',
              transform: 'translateZ(0)',
            }}
          />
        ))}

        {/* Depth darkening overlay — reinforces abyss from 45% down */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(180deg, transparent 0%, rgba(0,2,4,0.45) 50%, rgba(0,1,3,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Feeding Flakes (Active when tank is fed or clicked) ── */}
        {foodFlakes.map((f) => (
          <div
            key={f.id}
            className="food-flake"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              background: `radial-gradient(circle, #ffffff 10%, ${f.color} 80%)`,
              boxShadow: `0 0 8px ${f.color}, 0 0 16px ${f.color}`,
              animationDuration: f.dur,
              animationDelay: f.delay,
            }}
          />
        ))}

        {/* ── High-Fidelity Bioluminescent Fish Organisms ── */}
        {activeFishList.map((f, idx) => {
          const currentOpacity = isFed ? Math.min(1, f.baseOp + 0.25) : f.baseOp
          const animSpeed = isFed ? f.dur * 0.75 : f.dur

          // Static ambient positioning for prefers-reduced-motion
          const staticLeft = `${(idx * 20 + 8) % 82}%`

          return (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                top: `${f.y}%`,
                left: prefersReducedMotion ? staticLeft : (f.flip ? undefined : '-180px'),
                right: prefersReducedMotion ? undefined : (f.flip ? '-180px' : undefined),
                opacity: currentOpacity,
                animation: prefersReducedMotion
                  ? 'none'
                  : `${f.flip ? 'fish-swim-reverse' : 'fish-swim'} ${animSpeed}s linear ${f.delay}s infinite`,
                pointerEvents: 'none',
                transition: 'opacity 0.6s ease',
                zIndex: 2,
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  animation: prefersReducedMotion ? 'none' : `fish-bob ${f.bobDur}s ease-in-out infinite`,
                  transition: 'transform 0.3s ease',
                }}
              >
                {renderFishComponent(f.species, f.scale, isFed)}
              </div>
            </div>
          )
        })}

        {/* ── Plankton (Hardware-accelerated) ── */}
        {!prefersReducedMotion &&
          plankton.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: 'rgba(167,139,250,0.5)',
                borderRadius: '50%',
                animation: `plankton-drift ${p.dur} ease-in-out ${p.delay} infinite`,
                pointerEvents: 'none',
                transform: 'translateZ(0)',
              }}
            />
          ))}

        {/* ── Bubbles ── */}
        {!prefersReducedMotion &&
          activeBubbles.map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: 0,
                left: b.left,
                pointerEvents: 'none',
              }}
            >
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  marginLeft: `${j * 7 - 7}px`,
                  width: `${3 + j * 2}px`,
                  height: `${3 + j * 2}px`,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), rgba(139,92,246,0.25))',
                  border: '1px solid rgba(167,139,250,0.4)',
                  boxShadow: '0 0 4px rgba(6,182,212,0.2)',
                  animation: `bubble-rise ${b.dur}s ease-in ${b.delay + j * (b.dur / 3)}s infinite`,
                }}
              />
            ))}
          </div>
        ))}

        {/* Bottom fade — blends with kelp */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'linear-gradient(0deg, rgba(2,4,10,0.92) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  )
}
