import React from 'react'

/**
 * ═══════════════════════════════════════════════════════════════
 *  BIOLUMINESCENT CYBER AQUARIUM FISH ASSETS (FizhTank Portfolio)
 *  Rich SVG vectors with glowing gradients, animated tails, fins,
 *  and cybernetic lateral lines.
 * ═══════════════════════════════════════════════════════════════
 */

// Global SVG Gradients & Filters defs for all fish
export function FishDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* Glow Filters */}
        <filter id="bio-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bio-glow-violet" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bio-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tetra Gradients */}
        <linearGradient id="tetra-body" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="tetra-belly" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="tetra-fin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
        </linearGradient>

        {/* Betta Gradients */}
        <linearGradient id="betta-body" x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="betta-tail-1" x1="100%" y1="50%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="betta-tail-2" x1="100%" y1="50%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
        </linearGradient>

        {/* Manta Ray Gradients */}
        <linearGradient id="manta-top" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#0c1322" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="manta-wings" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
        </linearGradient>

        {/* Anglerfish Gradients */}
        <linearGradient id="angler-body" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#090d16" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#18182b" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="angler-lure" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>

        {/* Jellyfish Gradients */}
        <radialGradient id="jelly-bell" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="jelly-tentacle" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
        </linearGradient>

        {/* Cyber Puffer Gradients */}
        <radialGradient id="puffer-body" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#0ea5e9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.95" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/**
 * 1. NEON CYBER TETRA / DARTFISH
 * Sleek, swift schooling fish with illuminated fiber-optic lateral line and translucent waving fins.
 */
export function NeonTetra({ glow = false, scale = 1 }) {
  return (
    <svg
      width={70 * scale}
      height={32 * scale}
      viewBox="-5 -2 125 50"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 10px rgba(6,182,212,0.9))' : 'drop-shadow(0 0 4px rgba(6,182,212,0.4))' }}
    >
      {/* Dorsal Fin */}
      <path
        d="M 50 14 C 62 1, 76 2, 73 17 C 65 17, 56 16, 50 14 Z"
        fill="url(#tetra-fin)"
        opacity="0.8"
      />
      <path d="M 54 14 Q 65 5 70 16" stroke="#67e8f9" strokeWidth="0.8" fill="none" opacity="0.7" />

      {/* Ventral & Pectoral Fin */}
      <g className="fish-fin">
        <path
          d="M 68 26 C 60 34, 52 38, 58 28 Z"
          fill="url(#tetra-fin)"
          opacity="0.85"
        />
      </g>
      <path
        d="M 38 33 C 48 42, 60 39, 54 31 Z"
        fill="url(#tetra-fin)"
        opacity="0.75"
      />

      {/* Tail / Caudal Fin with Wag Animation */}
      <g className="fish-tail">
        <path
          d="M 16 23 L -4 8 C 4 16, 5 30, -4 38 L 16 25 Z"
          fill="url(#tetra-fin)"
        />
        {/* Tail fin ray accents */}
        <path d="M 14 24 L -1 12 M 14 24 L 1 24 M 14 24 L -1 34" stroke="#67e8f9" strokeWidth="0.7" opacity="0.6" />
      </g>

      {/* Main Fish Torpedo Body */}
      <path
        d="M 15 24 C 28 11, 62 10, 88 20 C 98 23, 102 24, 104 24 C 98 25, 78 37, 46 36 C 26 36, 18 30, 15 24 Z"
        fill="url(#tetra-body)"
      />
      {/* Lower Belly Shadow */}
      <path
        d="M 16 24 C 28 28, 55 37, 85 27 C 75 36, 45 36, 20 31 Z"
        fill="url(#tetra-belly)"
      />

      {/* Bioluminescent Cyber Lateral Line (Optical Nerve) */}
      <path
        d="M 22 23 C 45 20, 70 19, 94 22"
        stroke="#22d3ee"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        className="bio-optic-line"
      />
      {/* Secondary subtle glow trace */}
      <path
        d="M 28 26 C 48 24, 68 23, 85 24"
        stroke="#c084fc"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />

      {/* Cyber Gill Slit */}
      <path d="M 80 18 C 77 23, 77 28, 81 31" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.75" />

      {/* Optic Cyber Eye */}
      <circle cx="94" cy="22" r="3.8" fill="#030712" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="94" cy="22" r="2.2" fill="#06b6d4" />
      <circle cx="93.2" cy="21.2" r="0.9" fill="#ffffff" />
    </svg>
  )
}

/**
 * 2. BIOLUMINESCENT ROYAL BETTA / VEIL FISH
 * Elegant, flowing layered fins with ethereal wave ripples.
 */
export function BettaVeil({ glow = false, scale = 1 }) {
  return (
    <svg
      width={85 * scale}
      height={48 * scale}
      viewBox="-15 -5 145 68"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 12px rgba(168,85,247,0.95))' : 'drop-shadow(0 0 5px rgba(168,85,247,0.45))' }}
    >
      {/* Crown Dorsal Fin */}
      <g className="fish-veil">
        <path
          d="M 52 17 C 62 0, 94 2, 88 23 C 78 22, 64 21, 52 17 Z"
          fill="url(#betta-tail-1)"
          opacity="0.85"
        />
        <path d="M 58 17 Q 70 5 84 15 M 65 18 Q 78 7 86 21" stroke="#f472b6" strokeWidth="0.8" fill="none" opacity="0.65" />
      </g>

      {/* Long Flowing Ventral Threads */}
      <path
        d="M 76 38 C 66 52, 54 62, 45 58 C 52 50, 62 45, 72 37 Z"
        fill="url(#betta-tail-2)"
        opacity="0.8"
      />
      <path d="M 77 38 C 70 54, 58 65, 48 64" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.75" />

      {/* Layered Flowing Veil Tail */}
      <g className="fish-veil">
        {/* Layer 1: Large outer fin */}
        <path
          d="M 35 30 C 15 10, -8 -2, -14 18 C 2 30, -12 46, -15 54 C -4 60, 20 48, 35 34 Z"
          fill="url(#betta-tail-1)"
          opacity="0.75"
        />
        {/* Layer 2: Inner vibrant fin */}
        <path
          d="M 35 31 C 18 18, 0 12, -6 28 C 6 32, -2 44, -7 48 C 8 50, 24 40, 35 33 Z"
          fill="url(#betta-tail-2)"
          opacity="0.85"
        />
        {/* Shimmering fin vein rays */}
        <path
          d="M 33 31 C 12 18, -4 14, -10 20 M 33 32 C 10 28, -6 32, -12 36 M 33 33 C 12 38, -2 46, -9 50"
          stroke="#fbcfe8"
          strokeWidth="0.8"
          fill="none"
          opacity="0.65"
        />
      </g>

      {/* Betta Body */}
      <path
        d="M 35 32 C 46 19, 78 18, 102 28 C 112 32, 114 36, 104 40 C 78 47, 46 44, 35 32 Z"
        fill="url(#betta-body)"
      />

      {/* Bioluminescent Scales Pattern */}
      <g opacity="0.7">
        <circle cx="55" cy="27" r="1.2" fill="#38bdf8" />
        <circle cx="63" cy="25" r="1.4" fill="#67e8f9" />
        <circle cx="71" cy="26" r="1.3" fill="#f472b6" />
        <circle cx="79" cy="28" r="1.5" fill="#38bdf8" />
        <circle cx="60" cy="33" r="1.3" fill="#c084fc" />
        <circle cx="68" cy="34" r="1.4" fill="#38bdf8" />
        <circle cx="76" cy="34" r="1.2" fill="#f472b6" />
      </g>

      {/* Pectoral Fin Flutter */}
      <g className="fish-fin">
        <path
          d="M 85 32 C 78 40, 68 44, 74 34 Z"
          fill="url(#betta-tail-1)"
          opacity="0.9"
        />
      </g>

      {/* Eye */}
      <circle cx="98" cy="28" r="3.2" fill="#0f172a" stroke="#ec4899" strokeWidth="1" />
      <circle cx="98" cy="28" r="1.8" fill="#f43f5e" />
      <circle cx="97.3" cy="27.3" r="0.7" fill="#ffffff" />
    </svg>
  )
}

/**
 * 3. ABYSSAL MANTA RAY
 * Majestic, stealthy creature gliding smoothly through deep twilight waters.
 */
export function AbyssalRay({ glow = false, scale = 1 }) {
  return (
    <svg
      width={100 * scale}
      height={55 * scale}
      viewBox="-10 -5 160 85"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 14px rgba(6,182,212,0.9))' : 'drop-shadow(0 0 5px rgba(99,102,241,0.4))' }}
    >
      {/* Broad Wings with Gentle Glide Wave */}
      <g className="ray-wings">
        {/* Main Diamond Wing Body */}
        <path
          d="M 125 38 C 110 26, 75 0, 50 2 C 55 18, 52 30, 40 38 C 52 46, 55 58, 50 74 C 75 76, 110 50, 125 38 Z"
          fill="url(#manta-top)"
          stroke="rgba(6,182,212,0.3)"
          strokeWidth="1"
        />
        {/* Wing Tip Gradient Highlights */}
        <path
          d="M 50 2 C 70 12, 105 28, 125 38 C 105 48, 70 64, 50 74 C 60 55, 62 25, 50 2 Z"
          fill="url(#manta-wings)"
          opacity="0.6"
        />

        {/* Bioluminescent Wing Edges */}
        <path d="M 50 2 C 75 8, 108 26, 125 38" stroke="#06b6d4" strokeWidth="1.6" fill="none" opacity="0.8" />
        <path d="M 50 74 C 75 68, 108 50, 125 38" stroke="#06b6d4" strokeWidth="1.6" fill="none" opacity="0.8" />

        {/* Dorsal Bioluminescent Constellation Nodes */}
        <g opacity="0.85">
          <circle cx="85" cy="38" r="1.8" fill="#22d3ee" className="animate-pulse" />
          <circle cx="75" cy="30" r="1.4" fill="#a78bfa" />
          <circle cx="75" cy="46" r="1.4" fill="#a78bfa" />
          <circle cx="65" cy="24" r="1.2" fill="#38bdf8" />
          <circle cx="65" cy="52" r="1.2" fill="#38bdf8" />
          <circle cx="95" cy="34" r="1.3" fill="#67e8f9" />
          <circle cx="95" cy="42" r="1.3" fill="#67e8f9" />
          {/* Subtle connecting circuit traces */}
          <path d="M 65 24 L 75 30 L 85 38 L 75 46 L 65 52 M 85 38 L 95 34 M 85 38 L 95 42" stroke="#06b6d4" strokeWidth="0.6" fill="none" opacity="0.4" />
        </g>

        {/* Cephalic Horns (Front Flippers) */}
        <path d="M 125 34 C 132 32, 136 30, 138 33 C 136 36, 130 36, 124 36 Z" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="0.8" />
        <path d="M 125 42 C 132 44, 136 46, 138 43 C 136 40, 130 40, 124 40 Z" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="0.8" />
      </g>

      {/* Long Sensor Whip Tail with Data Packet Nodes */}
      <g>
        <path
          d="M 40 38 C 20 38, 0 37, -15 38"
          stroke="#38bdf8"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Moving data packet indicators */}
        <circle cx="25" cy="38" r="2" fill="#22d3ee" className="animate-ping" style={{ animationDuration: '2s' }} />
        <circle cx="10" cy="37.5" r="1.6" fill="#a855f7" />
        <circle cx="-5" cy="38" r="1.4" fill="#38bdf8" />
      </g>

      {/* Cyber Eyes on Outer Margin */}
      <circle cx="118" cy="27" r="1.8" fill="#06b6d4" />
      <circle cx="118" cy="49" r="1.8" fill="#06b6d4" />
    </svg>
  )
}

/**
 * 4. DEEP-SEA ANGLERFISH
 * The iconic sentinel of the abyssal zone with a glowing beacon lure.
 */
export function DeepSeaAngler({ glow = false, scale = 1 }) {
  return (
    <svg
      width={78 * scale}
      height={48 * scale}
      viewBox="-5 -5 130 75"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 15px rgba(34,211,238,0.95))' : 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
    >
      {/* Illicium (Stalk) and Glowing Esca (Lure) */}
      <g>
        {/* Flexible stalk arching forward */}
        <path
          d="M 78 24 C 88 4, 108 4, 114 16"
          stroke="#38bdf8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Glow Lure Bulb */}
        <circle cx="114" cy="16" r="6" fill="url(#angler-lure)" className="lure-light" />
        <circle cx="114" cy="16" r="2.8" fill="#ffffff" />
        {/* Radiating beacon beams */}
        <line x1="114" y1="8" x2="114" y2="4" stroke="#67e8f9" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="122" y1="16" x2="126" y2="16" stroke="#67e8f9" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="120" y1="10" x2="124" y2="6" stroke="#67e8f9" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Dorsal Spine Ridge */}
      <path d="M 45 23 L 42 16 M 55 21 L 53 14 M 65 21 L 64 15" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Caudal Fin with Wag */}
      <g className="fish-tail">
        <path
          d="M 22 38 L 4 24 C 10 32, 10 44, 4 52 L 22 40 Z"
          fill="#4338ca"
          opacity="0.85"
        />
        <path d="M 20 39 L 6 30 M 20 39 L 6 39 M 20 39 L 6 48" stroke="#818cf8" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* Bulky Deep-Sea Body */}
      <path
        d="M 22 39 C 32 20, 65 18, 90 28 C 98 32, 102 44, 94 56 C 75 66, 40 58, 22 39 Z"
        fill="url(#angler-body)"
        stroke="#4f46e5"
        strokeWidth="1.2"
      />

      {/* Bioluminescent Ventral Patches */}
      <ellipse cx="50" cy="46" rx="6" ry="2.5" fill="#06b6d4" opacity="0.4" />
      <ellipse cx="66" cy="48" rx="7" ry="3" fill="#8b5cf6" opacity="0.4" />

      {/* Huge Jaw & Sharp Needle Teeth */}
      <path d="M 96 38 C 88 42, 85 48, 92 54" stroke="#6366f1" strokeWidth="1.8" fill="none" />
      {/* Upper teeth */}
      <path d="M 94 37 L 93 42 M 91 38 L 90 43 M 88 40 L 87 44" stroke="#e0e7ff" strokeWidth="1" strokeLinecap="round" />
      {/* Lower teeth */}
      <path d="M 92 53 L 93 48 M 89 51 L 90 46 M 86 48 L 87 45" stroke="#e0e7ff" strokeWidth="1" strokeLinecap="round" />

      {/* Glowing Abyssal Eye */}
      <circle cx="86" cy="30" r="3.6" fill="#030712" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="86" cy="30" r="2" fill="#06b6d4" />
      <circle cx="85.3" cy="29.3" r="0.7" fill="#ffffff" />
    </svg>
  )
}

/**
 * 5. BIOLUMINESCENT JELLYFISH
 * Hypnotic ambient creature that pulses vertically and drifts gracefully.
 */
export function BioJellyfish({ glow = false, scale = 1 }) {
  return (
    <svg
      width={55 * scale}
      height={75 * scale}
      viewBox="-5 -2 85 110"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 14px rgba(192,132,252,0.9))' : 'drop-shadow(0 0 6px rgba(192,132,252,0.5))' }}
    >
      {/* Pulsing Bell / Umbrella */}
      <g className="jelly-bell">
        <path
          d="M 12 42 C 12 12, 68 12, 68 42 C 60 46, 52 40, 40 44 C 28 40, 20 46, 12 42 Z"
          fill="url(#jelly-bell)"
          stroke="#c084fc"
          strokeWidth="1.2"
        />

        {/* Inner Luminous Core */}
        <ellipse cx="40" cy="30" rx="16" ry="12" fill="#818cf8" opacity="0.4" />
        <ellipse cx="40" cy="28" rx="8" ry="6" fill="#38bdf8" opacity="0.6" />

        {/* Radial Nerve Ribs */}
        <path d="M 40 14 Q 40 32 40 44" stroke="#e9d5ff" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M 40 14 Q 24 25 22 42" stroke="#a5f3fc" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M 40 14 Q 56 25 58 42" stroke="#a5f3fc" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Rim Margin Glow Nodes */}
        <circle cx="16" cy="42" r="1.5" fill="#38bdf8" />
        <circle cx="28" cy="41" r="1.5" fill="#c084fc" />
        <circle cx="40" cy="44" r="1.8" fill="#38bdf8" />
        <circle cx="52" cy="41" r="1.5" fill="#c084fc" />
        <circle cx="64" cy="42" r="1.5" fill="#38bdf8" />
      </g>

      {/* Sinuous Trailing Tentacles & Frilly Oral Arms */}
      <g className="jelly-tentacles">
        {/* Oral arm central ruffle */}
        <path
          d="M 36 44 C 34 58, 44 72, 38 90 C 35 98, 38 104, 37 108"
          stroke="url(#jelly-tentacle)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 44 44 C 46 58, 36 72, 42 90 C 45 98, 42 104, 43 108"
          stroke="url(#jelly-tentacle)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Delicate outer stinging tentacles */}
        <path
          d="M 22 42 C 18 56, 26 70, 20 85 C 16 95, 22 102, 18 106"
          stroke="#38bdf8"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 58 42 C 62 56, 54 70, 60 85 C 64 95, 58 102, 62 106"
          stroke="#38bdf8"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 30 42 C 28 60, 34 78, 29 96"
          stroke="#c084fc"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 50 42 C 52 60, 46 78, 51 96"
          stroke="#c084fc"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  )
}

/**
 * 6. CYBER PUFFERFISH
 * Playful, spherical bioluminescent organism with defensive glowing nodes.
 */
export function CyberPuffer({ glow = false, scale = 1 }) {
  return (
    <svg
      width={65 * scale}
      height={42 * scale}
      viewBox="-5 -5 100 65"
      className="overflow-visible"
      style={{ filter: glow ? 'drop-shadow(0 0 10px rgba(45,212,191,0.9))' : 'drop-shadow(0 0 4px rgba(45,212,191,0.4))' }}
    >
      {/* Rapid Little Tail */}
      <g className="fish-tail-fast">
        <path d="M 22 28 L 6 18 C 10 24, 10 32, 6 38 L 22 30 Z" fill="#0284c7" opacity="0.8" />
        <path d="M 20 29 L 8 22 M 20 29 L 8 34" stroke="#67e8f9" strokeWidth="0.7" opacity="0.6" />
      </g>

      {/* Tiny Dorsal and Anal Fin */}
      <path d="M 40 12 C 45 4, 55 5, 52 14 Z" fill="#06b6d4" opacity="0.75" />
      <path d="M 40 44 C 45 52, 55 51, 52 42 Z" fill="#06b6d4" opacity="0.75" />

      {/* Main Round Spherical Body */}
      <circle cx="50" cy="28" r="22" fill="url(#puffer-body)" />

      {/* Glowing Bio Spines */}
      <g stroke="#67e8f9" strokeWidth="1.2" strokeLinecap="round">
        <line x1="36" y1="12" x2="33" y2="7" />
        <line x1="48" y1="9" x2="48" y2="4" />
        <line x1="60" y1="11" x2="63" y2="6" />
        <line x1="70" y1="18" x2="75" y2="15" />
        <line x1="72" y1="38" x2="77" y2="42" />
        <line x1="60" y1="46" x2="63" y2="51" />
        <line x1="48" y1="48" x2="48" y2="53" />
        <line x1="36" y1="45" x2="33" y2="50" />
      </g>

      {/* Cyber Pectoral Fin Flutter */}
      <g className="fish-fin">
        <path d="M 52 28 C 45 36, 40 37, 44 29 Z" fill="#38bdf8" opacity="0.85" />
      </g>

      {/* Bioluminescent Dot Matrix */}
      <circle cx="42" cy="24" r="1.4" fill="#a7f3d0" />
      <circle cx="50" cy="22" r="1.6" fill="#67e8f9" />
      <circle cx="58" cy="24" r="1.4" fill="#a7f3d0" />
      <circle cx="44" cy="32" r="1.5" fill="#67e8f9" />
      <circle cx="52" cy="34" r="1.8" fill="#f0abfc" />

      {/* Big Expressive Eye */}
      <circle cx="64" cy="24" r="4.5" fill="#022c22" stroke="#2dd4bf" strokeWidth="1.2" />
      <circle cx="64" cy="24" r="2.8" fill="#14b8a6" />
      <circle cx="63" cy="23" r="1" fill="#ffffff" />
    </svg>
  )
}
