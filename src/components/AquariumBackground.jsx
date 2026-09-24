import { useMemo } from 'react'

// ── Fish SVG shapes ──────────────────────────────────────────
const FISH_SHAPES = [
  // slim torpedo
  { body: 'M0,0 C8,-3 18,-3 22,0 C18,3 8,3 0,0 Z M22,0 L28,-4 L28,4 Z', eye: [5, -0.5], fin: 'M7,-3 C9,-7 13,-7 13,-3' },
  // rounder
  { body: 'M0,0 C6,-5 17,-5 21,0 C17,5 6,5 0,0 Z M21,0 L28,-5 L28,5 Z', eye: [6, -1], fin: 'M8,-4 C10,-8 15,-8 15,-4' },
  // tiny dart
  { body: 'M0,0 C5,-2 13,-2 16,0 C13,2 5,2 0,0 Z M16,0 L21,-3 L21,3 Z', eye: [4, -0.5], fin: 'M5,-2 C7,-5 10,-5 10,-2' },
  // fat puffer-ish
  { body: 'M2,0 C3,-6 15,-6 19,0 C15,6 3,6 2,0 Z M19,0 L26,-5 L26,5 Z M-1,-2 L2,-2 L2,2 L-1,2 Z', eye: [6, -1.5], fin: 'M8,-5 C10,-9 14,-9 14,-5' },
]

// ── Generate fish data once ───────────────────────────────────
const FISH = [
  { id:1,  y:8,  scale:0.55, dur:32, delay:0,    op:0.20, shape:0, flip:false, color:'#a78bfa' },
  { id:2,  y:18, scale:0.90, dur:24, delay:-9,   op:0.25, shape:1, flip:true,  color:'#7c3aed' },
  { id:3,  y:31, scale:0.65, dur:38, delay:-18,  op:0.18, shape:2, flip:false, color:'#c4b5fd' },
  { id:4,  y:44, scale:1.10, dur:20, delay:-6,   op:0.22, shape:0, flip:true,  color:'#8b5cf6' },
  { id:5,  y:55, scale:0.50, dur:45, delay:-25,  op:0.15, shape:3, flip:false, color:'#a78bfa' },
  { id:6,  y:63, scale:0.80, dur:29, delay:-14,  op:0.20, shape:1, flip:true,  color:'#6d28d9' },
  { id:7,  y:74, scale:0.60, dur:36, delay:-3,   op:0.17, shape:2, flip:false, color:'#c4b5fd' },
  { id:8,  y:22, scale:1.20, dur:18, delay:-11,  op:0.14, shape:3, flip:true,  color:'#7c3aed' },
  { id:9,  y:40, scale:0.45, dur:50, delay:-30,  op:0.13, shape:0, flip:false, color:'#818cf8' },
  { id:10, y:69, scale:0.70, dur:27, delay:-7,   op:0.18, shape:1, flip:true,  color:'#a78bfa' },
  { id:11, y:85, scale:0.55, dur:40, delay:-20,  op:0.16, shape:2, flip:false, color:'#c4b5fd' },
  { id:12, y:12, scale:0.38, dur:55, delay:-35,  op:0.12, shape:3, flip:true,  color:'#8b5cf6' },
]

// ── Ambient glow orbs ─────────────────────────────────────────
const ORBS = [
  { left:'15%', top:'20%', size:180, color:'rgba(109,40,217,0.04)', dur:'18s' },
  { left:'75%', top:'35%', size:220, color:'rgba(6,182,212,0.03)',  dur:'24s' },
  { left:'40%', top:'65%', size:260, color:'rgba(91,33,182,0.05)',  dur:'20s' },
  { left:'60%', top:'10%', size:140, color:'rgba(6,182,212,0.04)',  dur:'15s' },
  { left:'25%', top:'80%', size:200, color:'rgba(124,58,237,0.04)', dur:'22s' },
]


// ── Bubble streams ────────────────────────────────────────────
const BUBBLES = [
  { left:'4%',  delay:0,   dur:9  },
  { left:'12%', delay:2.5, dur:12 },
  { left:'20%', delay:1.0, dur:8  },
  { left:'29%', delay:4.0, dur:11 },
  { left:'38%', delay:0.5, dur:10 },
  { left:'47%', delay:3.2, dur:7  },
  { left:'56%', delay:1.8, dur:13 },
  { left:'65%', delay:5.0, dur:9  },
  { left:'72%', delay:2.0, dur:11 },
  { left:'80%', delay:0.8, dur:8  },
  { left:'88%', delay:3.5, dur:12 },
  { left:'95%', delay:1.3, dur:9  },
]

// (Kelp is rendered in Seafloor at the bottom of the page)

// ── Main Component ────────────────────────────────────────────
export default function AquariumBackground() {
  const plankton = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      left: `${Math.sin(i * 47.3) * 50 + 50}%`,
      top:  `${Math.sin(i * 31.7) * 50 + 50}%`,
      delay: `${(i * 0.41) % 8}s`,
      dur:   `${4 + (i % 5)}s`,
      size:  1 + (i % 3),
    })),
  [])

  return (
    <>
      {/* ── Fixed full-screen ocean ── */}
      <div className="aquarium-bg" aria-hidden="true">

        {/* Deep abyss gradient */}
        <div style={{
          position:'absolute', inset:0,
          background: 'linear-gradient(180deg, #04060f 0%, #060b18 15%, #070d1e 35%, #06101c 60%, #040c14 85%, #030810 100%)'
        }} />

        {/* Ambient glow orbs */}
        {ORBS.map((o, i) => (
          <div key={i} style={{
            position:'absolute',
            left: o.left, top: o.top,
            width: o.size, height: o.size,
            background: o.color,
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: `plankton-drift ${o.dur} ease-in-out ${i * 2}s infinite`,
            pointerEvents: 'none',
          }} />
        ))}


        {/* Top & mid depth fog */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:'30%',
          background:'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(91,33,182,0.10), transparent)',
          pointerEvents:'none',
        }} />
        <div style={{
          position:'absolute', top:'30%', left:0, right:0, height:'40%',
          background:'radial-gradient(ellipse 100% 60% at 30% 50%, rgba(16,26,60,0.28), transparent 70%)',
          pointerEvents:'none',
        }} />

        {/* ── Fish ── */}
        {FISH.map((f) => {
          const s = FISH_SHAPES[f.shape % FISH_SHAPES.length]
          return (
            <div
              key={f.id}
              style={{
                position: 'absolute',
                top: `${f.y}%`,
                left: f.flip ? undefined : '-150px',
                right: f.flip ? '-150px' : undefined,
                opacity: f.op,
                animation: `${f.flip ? 'fish-swim-reverse' : 'fish-swim'} ${f.dur}s linear ${f.delay}s infinite`,
                pointerEvents: 'none',
              }}
            >
              <svg
                width={60 * f.scale}
                height={30 * f.scale}
                viewBox="-4 -8 36 16"
                style={{ animation: `fish-bob ${2.8 + (f.id % 3) * 0.6}s ease-in-out infinite` }}
              >
                <path d={s.body} fill={f.color} />
                <circle cx={s.eye[0]} cy={s.eye[1]} r="1.5" fill="#080c18" />
                <circle cx={s.eye[0] - 0.5} cy={s.eye[1] - 0.6} r="0.5" fill="white" opacity="0.8" />
                <path d={s.fin} fill="none" stroke={f.color} strokeWidth="1.5" opacity="0.5" />
              </svg>
            </div>
          )
        })}

        {/* ── Plankton ── */}
        {plankton.map((p, i) => (
          <div key={i} style={{
            position:'absolute',
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: 'rgba(167,139,250,0.55)',
            borderRadius: '50%',
            filter: 'blur(0.4px)',
            animation: `plankton-drift ${p.dur} ease-in-out ${p.delay} infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Bubbles ── */}
        {BUBBLES.map((b, i) => (
          <div key={i} style={{ position:'absolute', bottom:0, left: b.left, pointerEvents:'none' }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{
                position:'absolute',
                bottom: 0,
                marginLeft: `${j * 7 - 7}px`,
                width: `${3 + j * 2}px`,
                height: `${3 + j * 2}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(139,92,246,0.2))',
                border: '1px solid rgba(167,139,250,0.35)',
                animation: `bubble-rise ${b.dur}s ease-in ${b.delay + j * (b.dur / 3)}s infinite`,
              }} />
            ))}
          </div>
        ))}

        {/* Bottom fade — blends with kelp */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'20%',
          background:'linear-gradient(0deg, rgba(2,4,10,0.9) 0%, transparent 100%)',
          pointerEvents:'none',
        }} />
      </div>
    </>
  )
}
