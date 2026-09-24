import { useEffect, useRef } from 'react'

// SVG Fish paths (multiple styles)
const FISH_SHAPES = [
  // Small tropical fish
  `M0,0 C8,-4 18,-4 24,0 C18,4 8,4 0,0 Z M24,0 L30,-5 L30,5 Z`,
  // Slimmer fish
  `M0,0 C6,-3 16,-3 20,0 C16,3 6,3 0,0 Z M20,0 L26,-4 L26,4 Z`,
  // Rounder fish (pufferfish-ish)
  `M2,0 C4,-6 14,-6 18,0 C14,6 4,6 2,0 Z M18,0 L25,-5 L25,5 Z M-2,-2 L2,-2 L2,2 L-2,2 Z`,
]

const FISH_DATA = [
  { id: 1, y: 12, scale: 0.6, duration: 28, delay: 0,    opacity: 0.18, shape: 0, flip: false },
  { id: 2, y: 28, scale: 1.0, duration: 22, delay: -8,   opacity: 0.22, shape: 1, flip: true  },
  { id: 3, y: 48, scale: 0.7, duration: 35, delay: -15,  opacity: 0.15, shape: 2, flip: false },
  { id: 4, y: 65, scale: 1.3, duration: 18, delay: -5,   opacity: 0.20, shape: 0, flip: true  },
  { id: 5, y: 80, scale: 0.5, duration: 42, delay: -22,  opacity: 0.12, shape: 1, flip: false },
  { id: 6, y: 38, scale: 0.8, duration: 30, delay: -12,  opacity: 0.16, shape: 2, flip: true  },
]

const SEAWEED_COUNT = 12
const BUBBLE_GROUPS = [
  { left: '8%',  delay: 0,   duration: 9  },
  { left: '18%', delay: 2.5, duration: 12 },
  { left: '32%', delay: 1,   duration: 8  },
  { left: '47%', delay: 4,   duration: 11 },
  { left: '60%', delay: 0.5, duration: 10 },
  { left: '73%', delay: 3,   duration: 7  },
  { left: '85%', delay: 1.8, duration: 13 },
  { left: '93%', delay: 5,   duration: 9  },
]

export default function AquariumBackground() {
  return (
    <div className="aquarium-bg" aria-hidden="true">
      {/* ── Caustic light rays from surface ── */}
      <div className="caustic-layer">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="caustic-ray"
            style={{
              left: `${8 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + (i % 3)}s`,
              width: `${40 + (i % 4) * 20}px`,
              opacity: 0.04 + (i % 3) * 0.015,
            }}
          />
        ))}
      </div>

      {/* ── Depth fog / water layers ── */}
      <div className="depth-fog top-layer" />
      <div className="depth-fog mid-layer" />
      <div className="depth-fog bottom-layer" />

      {/* ── Swimming fish ── */}
      <div className="fish-layer">
        {FISH_DATA.map((fish) => (
          <div
            key={fish.id}
            className={`fish-wrapper ${fish.flip ? 'fish-flip' : ''}`}
            style={{
              top: `${fish.y}%`,
              animationDuration: `${fish.duration}s`,
              animationDelay: `${fish.delay}s`,
              opacity: fish.opacity,
            }}
          >
            <svg
              width={60 * fish.scale}
              height={30 * fish.scale}
              viewBox="-5 -8 40 16"
              style={{ transform: `scale(${fish.scale})`, transformOrigin: 'center' }}
            >
              {/* Body */}
              <path d={FISH_SHAPES[fish.shape]} fill="#a78bfa" />
              {/* Eye */}
              <circle cx="5" cy="-1" r="1.5" fill="#0a0a0f" />
              <circle cx="4.5" cy="-1.5" r="0.5" fill="white" opacity="0.8" />
              {/* Fin */}
              <path
                d="M8,-4 C10,-8 14,-8 14,-4"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* ── Floating particles (plankton) ── */}
      <div className="plankton-layer">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="plankton"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* ── Bubbles ── */}
      <div className="bubbles-layer">
        {BUBBLE_GROUPS.map((b, i) => (
          <div key={i} className="bubble-stream" style={{ left: b.left }}>
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="aqua-bubble"
                style={{
                  animationDelay: `${b.delay + j * (b.duration / 3)}s`,
                  animationDuration: `${b.duration}s`,
                  width: `${3 + j * 2}px`,
                  height: `${3 + j * 2}px`,
                  marginLeft: `${j * 6 - 6}px`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Seaweed / Kelp at bottom ── */}
      <div className="seaweed-layer">
        {[...Array(SEAWEED_COUNT)].map((_, i) => (
          <div
            key={i}
            className="kelp"
            style={{
              left: `${(i / SEAWEED_COUNT) * 100 + (i % 3) * 2}%`,
              height: `${60 + (i % 4) * 25}px`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${2.5 + (i % 3) * 0.8}s`,
              opacity: 0.25 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* ── Seafloor gradient ── */}
      <div className="seafloor" />
    </div>
  )
}
