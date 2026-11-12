import { useEffect, useRef } from 'react'

/**
 * Tank akuarium yang menjadi latar seluruh halaman.
 *
 * Isi tank:
 *  - air dengan permukaan bergelombang dan berkas cahaya dari atas
 *  - pasir, batu, tanaman, dan airstone yang mengeluarkan gelembung
 *  - clownfish, blue tang, angelfish, sekawanan neon tetra, dan corydoras di dasar
 *  - makanan ikan: klik area air kosong (atau tombol "Beri makan") dan ikan akan mengejarnya
 *
 * Animasi sepenuhnya terpisah dari scroll, jadi tidak ter-reset saat halaman digulir.
 */

const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const OUTLINE = 'rgba(3, 22, 30, 0.7)'

// Ikan selalu digambar tegak (tidak pernah terbalik): arah kiri/kanan lewat cermin horizontal,
// naik/turun lewat kemiringan hidung.
const pitchOf = (angle) => clamp(Math.atan2(Math.sin(angle), Math.abs(Math.cos(angle))), -1, 1) * 0.85
const SURFACE_Y = 15

// Tinggi permukaan pasir di posisi x (dipakai bersama oleh pasir, batu, tanaman, dan ikan dasar)
const sandSurface = (x, top) => top + Math.sin(x * 0.006 + 1) * 6 + Math.sin(x * 0.017) * 3

// ── Gambar ikan (koordinat lokal, kepala menghadap +x) ─────────────────────

function drawClownfish(ctx, L, wag, fin) {
  const H = L * 0.52

  ctx.beginPath()
  ctx.moveTo(-L * 0.45, 0)
  ctx.quadraticCurveTo(-L * 0.7, -H * 0.55 + wag, -L * 0.82, -H * 0.5 + wag)
  ctx.quadraticCurveTo(-L * 0.72, wag, -L * 0.82, H * 0.5 + wag)
  ctx.quadraticCurveTo(-L * 0.7, H * 0.55 + wag, -L * 0.45, 0)
  ctx.closePath()
  ctx.fillStyle = '#ea580c'
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.2
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(-L * 0.78, wag, H * 0.35, -Math.PI * 0.5, Math.PI * 0.5)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(L * 0.5, 0)
  ctx.bezierCurveTo(L * 0.35, -H * 0.65, -L * 0.2, -H * 0.65, -L * 0.45, 0)
  ctx.bezierCurveTo(-L * 0.2, H * 0.65, L * 0.35, H * 0.65, L * 0.5, 0)
  ctx.closePath()
  const body = ctx.createLinearGradient(0, -H * 0.6, 0, H * 0.6)
  body.addColorStop(0, '#fdba74')
  body.addColorStop(0.4, '#f97316')
  body.addColorStop(1, '#c2410c')
  ctx.fillStyle = body
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.2
  ctx.fill()
  ctx.stroke()

  const stripe = (cx, topW, botW, curve) => {
    ctx.beginPath()
    ctx.moveTo(cx - topW * 0.5, -H * 0.55)
    ctx.quadraticCurveTo(cx + curve, 0, cx - botW * 0.5, H * 0.55)
    ctx.lineTo(cx + botW * 0.5, H * 0.55)
    ctx.quadraticCurveTo(cx + curve + topW * 0.5, 0, cx + topW * 0.5, -H * 0.55)
    ctx.closePath()
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = OUTLINE
    ctx.lineWidth = 1.4
    ctx.fill()
    ctx.stroke()
  }
  stripe(L * 0.22, L * 0.14, L * 0.12, L * 0.04)
  stripe(-L * 0.05, L * 0.16, L * 0.14, L * 0.08)
  stripe(-L * 0.35, L * 0.1, L * 0.08, 0)

  ctx.beginPath()
  ctx.moveTo(L * 0.15, -H * 0.5)
  ctx.quadraticCurveTo(-L * 0.05, -H * 0.95, -L * 0.25, -H * 0.45)
  ctx.fillStyle = '#f97316'
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.2
  ctx.fill()
  ctx.stroke()

  ctx.save()
  ctx.translate(L * 0.08, H * 0.1)
  ctx.rotate(Math.sin(fin * 1.5) * 0.3)
  ctx.beginPath()
  ctx.ellipse(0, 0, L * 0.16, H * 0.25, 0.4, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(251, 146, 60, 0.85)'
  ctx.lineWidth = 1
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  ctx.beginPath()
  ctx.arc(L * 0.36, -H * 0.12, L * 0.07, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(L * 0.38, -H * 0.14, L * 0.025, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

function drawTang(ctx, L, wag) {
  const H = L * 0.56

  ctx.beginPath()
  ctx.moveTo(-L * 0.42, 0)
  ctx.lineTo(-L * 0.8, -H * 0.45 + wag)
  ctx.lineTo(-L * 0.72, wag)
  ctx.lineTo(-L * 0.8, H * 0.45 + wag)
  ctx.closePath()
  ctx.fillStyle = '#facc15'
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.2
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(L * 0.48, 0)
  ctx.bezierCurveTo(L * 0.3, -H * 0.65, -L * 0.25, -H * 0.65, -L * 0.45, 0)
  ctx.bezierCurveTo(-L * 0.25, H * 0.65, L * 0.3, H * 0.65, L * 0.48, 0)
  ctx.closePath()
  const body = ctx.createLinearGradient(0, -H * 0.6, 0, H * 0.6)
  body.addColorStop(0, '#60a5fa')
  body.addColorStop(0.5, '#2563eb')
  body.addColorStop(1, '#1e3a8a')
  ctx.fillStyle = body
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(L * 0.1, -H * 0.4)
  ctx.bezierCurveTo(-L * 0.25, -H * 0.5, -L * 0.4, -H * 0.2, -L * 0.42, 0)
  ctx.bezierCurveTo(-L * 0.4, H * 0.2, -L * 0.25, H * 0.5, L * 0.1, H * 0.4)
  ctx.bezierCurveTo(-L * 0.05, H * 0.2, -L * 0.15, 0, -L * 0.05, -H * 0.2)
  ctx.closePath()
  ctx.fillStyle = '#0a1220'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(-L * 0.12, 0)
  ctx.lineTo(-L * 0.38, -H * 0.15)
  ctx.lineTo(-L * 0.38, H * 0.15)
  ctx.closePath()
  ctx.fillStyle = '#facc15'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(L * 0.32, -H * 0.14, L * 0.065, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(L * 0.34, -H * 0.16, L * 0.025, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

function drawAngel(ctx, S, sway, phase = 0) {
  const L = S
  const H = S * 0.7
  const wag = Math.sin(phase * 0.9) * 2.8

  // 1. Ekor (Caudal Fin) - Melebar anggun seperti kipas sutra transparan
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(-L * 0.36, 0)
  ctx.bezierCurveTo(-L * 0.54, -H * 0.44 + wag, -L * 0.72, -H * 0.54 + wag, -L * 0.8, -H * 0.46 + wag)
  ctx.quadraticCurveTo(-L * 0.66, wag * 0.4, -L * 0.8, H * 0.46 + wag)
  ctx.bezierCurveTo(-L * 0.72, H * 0.54 + wag, -L * 0.54, H * 0.44 + wag, -L * 0.36, 0)
  ctx.closePath()
  const tailGrad = ctx.createLinearGradient(-L * 0.36, 0, -L * 0.8, 0)
  tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
  tailGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.65)')
  tailGrad.addColorStop(1, 'rgba(203, 213, 225, 0.35)')
  ctx.fillStyle = tailGrad
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.1
  ctx.fill()
  ctx.stroke()

  // Garis-garis halus sirip ekor (fin rays)
  ctx.beginPath()
  ctx.moveTo(-L * 0.38, 0)
  ctx.lineTo(-L * 0.76, -H * 0.28 + wag)
  ctx.moveTo(-L * 0.38, 0)
  ctx.lineTo(-L * 0.7, wag * 0.4)
  ctx.moveTo(-L * 0.38, 0)
  ctx.lineTo(-L * 0.76, H * 0.28 + wag)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.lineWidth = 0.8
  ctx.stroke()
  ctx.restore()

  // 2. Sirip Punggung Atas (Dorsal Fin) - Menjulang tinggi melengkung lembut ke belakang
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(L * 0.08, -H * 0.46)
  ctx.bezierCurveTo(-L * 0.02, -H * 1.35 + sway, -L * 0.16, -H * 1.6 + sway, -L * 0.32, -H * 1.55 + sway)
  ctx.quadraticCurveTo(-L * 0.22, -H * 0.95, -L * 0.32, -H * 0.25)
  ctx.closePath()
  const dorsalGrad = ctx.createLinearGradient(0, -H * 0.3, -L * 0.2, -H * 1.5)
  dorsalGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)')
  dorsalGrad.addColorStop(0.35, 'rgba(241, 245, 249, 0.82)')
  dorsalGrad.addColorStop(1, 'rgba(203, 213, 225, 0.35)')
  ctx.fillStyle = dorsalGrad
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.1
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // 3. Sirip Perut Bawah (Anal Fin) - Menjulang panjang ke bawah
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(L * 0.04, H * 0.46)
  ctx.bezierCurveTo(-L * 0.04, H * 1.35 - sway, -L * 0.16, H * 1.6 - sway, -L * 0.32, H * 1.5 - sway)
  ctx.quadraticCurveTo(-L * 0.22, H * 0.95, -L * 0.32, H * 0.22)
  ctx.closePath()
  const analGrad = ctx.createLinearGradient(0, H * 0.3, -L * 0.2, H * 1.5)
  analGrad.addColorStop(0, 'rgba(254, 240, 138, 0.88)')
  analGrad.addColorStop(0.35, 'rgba(241, 245, 249, 0.82)')
  analGrad.addColorStop(1, 'rgba(203, 213, 225, 0.35)')
  ctx.fillStyle = analGrad
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.1
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // 4. Badan Ikan (Body Disc) - Oval bulat pipih organik khas ikan manfish
  ctx.beginPath()
  ctx.moveTo(L * 0.48, 0)
  ctx.bezierCurveTo(L * 0.38, -H * 0.48, -L * 0.08, -H * 0.55, -L * 0.36, 0)
  ctx.bezierCurveTo(-L * 0.08, H * 0.55, L * 0.38, H * 0.48, L * 0.48, 0)
  ctx.closePath()
  const bodyGrad = ctx.createRadialGradient(L * 0.2, -H * 0.12, L * 0.05, 0, 0, L * 0.55)
  bodyGrad.addColorStop(0, '#fef08a')
  bodyGrad.addColorStop(0.32, '#f8fafc')
  bodyGrad.addColorStop(0.78, '#cbd5e1')
  bodyGrad.addColorStop(1, '#94a3b8')
  ctx.fillStyle = bodyGrad
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.2
  ctx.fill()
  ctx.stroke()

  // 5. Belang Alami Manfish (3 Garis Vertikal Halus)
  const drawStripe = (x1, y1, x2, y2, bend) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.quadraticCurveTo(x1 + bend, (y1 + y2) * 0.5, x2, y2)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.42)'
    ctx.lineWidth = L * 0.042
    ctx.lineCap = 'round'
    ctx.stroke()
  }
  drawStripe(L * 0.28, -H * 0.36, L * 0.24, H * 0.34, -L * 0.03)
  drawStripe(L * 0.04, -H * 0.51, L * 0.01, H * 0.51, -L * 0.035)
  drawStripe(-L * 0.2, -H * 0.3, -L * 0.22, H * 0.3, -L * 0.02)

  // 6. Sungut / Antena Dada (Pelvic Filaments) - Mengayun anggun di air
  ctx.save()
  const finFlutter = Math.sin(phase * 0.6) * 3.5
  ctx.beginPath()
  ctx.moveTo(L * 0.18, H * 0.38)
  ctx.bezierCurveTo(L * 0.05, H * 1.1, -L * 0.06, H * 1.55 + finFlutter, -L * 0.16, H * 1.85 + finFlutter)
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.95)'
  ctx.lineWidth = 1.6
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(L * 0.14, H * 0.38)
  ctx.bezierCurveTo(L * 0.02, H * 1.05, -L * 0.1, H * 1.45 - finFlutter, -L * 0.2, H * 1.7 - finFlutter)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.lineWidth = 1.3
  ctx.stroke()
  ctx.restore()

  // 7. Sirip Dayung Dada (Pectoral Fin)
  ctx.save()
  ctx.translate(L * 0.14, H * 0.06)
  ctx.rotate(Math.sin(phase * 1.4) * 0.25 + 0.2)
  ctx.beginPath()
  ctx.ellipse(0, 0, L * 0.12, H * 0.22, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.strokeStyle = 'rgba(3, 22, 30, 0.35)'
  ctx.lineWidth = 0.8
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // 8. Mata Ikan Alami (Amber Gold Ring + Pupil Hitam + Catchlight Hidup)
  const eyeX = L * 0.3
  const eyeY = -H * 0.14
  ctx.beginPath()
  ctx.arc(eyeX, eyeY, L * 0.065, 0, Math.PI * 2)
  ctx.fillStyle = '#f59e0b'
  ctx.fill()
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 0.8
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(eyeX, eyeY, L * 0.042, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(eyeX + L * 0.015, eyeY - H * 0.025, L * 0.016, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  // Mulut ikan kecil
  ctx.beginPath()
  ctx.arc(L * 0.48, H * 0.02, L * 0.025, Math.PI * 0.6, Math.PI * 1.4)
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawTetra(ctx, S, wag) {
  ctx.beginPath()
  ctx.moveTo(-S * 0.38, 0)
  ctx.lineTo(-S * 0.64, -S * 0.17 + wag * 0.6)
  ctx.lineTo(-S * 0.64, S * 0.17 + wag * 0.6)
  ctx.closePath()
  ctx.fillStyle = 'rgba(210, 235, 240, 0.45)'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(S * 0.5, 0)
  ctx.quadraticCurveTo(S * 0.1, -S * 0.25, -S * 0.4, wag * 0.3)
  ctx.quadraticCurveTo(S * 0.1, S * 0.25, S * 0.5, 0)
  ctx.closePath()
  const body = ctx.createLinearGradient(0, -S * 0.25, 0, S * 0.25)
  body.addColorStop(0, '#49708a')
  body.addColorStop(0.5, '#a3c6d6')
  body.addColorStop(1, '#eaf5f7')
  ctx.fillStyle = body
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(S * 0.15, S * 0.03)
  ctx.quadraticCurveTo(-S * 0.1, S * 0.23, -S * 0.38, wag * 0.3)
  ctx.lineTo(-S * 0.38, wag * 0.3 - S * 0.02)
  ctx.lineTo(S * 0.15, S * 0.03)
  ctx.closePath()
  ctx.fillStyle = '#ff5252'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(S * 0.42, -S * 0.03)
  ctx.lineTo(-S * 0.34, wag * 0.25 - S * 0.01)
  ctx.strokeStyle = 'rgba(56, 232, 255, 0.35)'
  ctx.lineWidth = 3.4
  ctx.stroke()
  ctx.strokeStyle = '#3de8ff'
  ctx.lineWidth = 1.4
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(S * 0.37, -S * 0.04, S * 0.055, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(S * 0.385, -S * 0.04, S * 0.028, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
}

function drawCory(ctx, L, step) {
  const H = L * 0.42
  ctx.beginPath()
  ctx.ellipse(0, H * 0.7, L * 0.5, H * 0.18, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(40, 30, 15, 0.28)'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(-L * 0.42, 0)
  ctx.lineTo(-L * 0.68, -H * 0.4 + step)
  ctx.lineTo(-L * 0.68, H * 0.4 - step)
  ctx.closePath()
  ctx.fillStyle = '#b08a52'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(L * 0.2, -H * 0.4)
  ctx.quadraticCurveTo(-L * 0.02, -H * 1.05, -L * 0.2, -H * 0.4)
  ctx.fillStyle = '#9c7a46'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(L * 0.5, H * 0.1)
  ctx.bezierCurveTo(L * 0.4, -H * 0.62, -L * 0.2, -H * 0.62, -L * 0.45, 0)
  ctx.bezierCurveTo(-L * 0.2, H * 0.5, L * 0.35, H * 0.5, L * 0.5, H * 0.1)
  ctx.closePath()
  const body = ctx.createLinearGradient(0, -H * 0.6, 0, H * 0.5)
  body.addColorStop(0, '#9b7a47')
  body.addColorStop(0.5, '#d9bb83')
  body.addColorStop(1, '#efe0b8')
  ctx.fillStyle = body
  ctx.strokeStyle = 'rgba(60, 40, 15, 0.55)'
  ctx.lineWidth = 1
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = 'rgba(70, 48, 22, 0.5)'
  ;[
    [0.05, -0.2, 0.14, 0.1],
    [-0.18, -0.12, 0.1, 0.08],
    [0.25, -0.05, 0.07, 0.06],
  ].forEach(([x, y, rx, ry]) => {
    ctx.beginPath()
    ctx.ellipse(L * x, H * y, L * rx, H * ry * 2, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.beginPath()
  ctx.moveTo(L * 0.48, H * 0.12)
  ctx.lineTo(L * 0.62, H * 0.3)
  ctx.moveTo(L * 0.46, H * 0.16)
  ctx.lineTo(L * 0.56, H * 0.4)
  ctx.strokeStyle = 'rgba(240, 225, 190, 0.85)'
  ctx.lineWidth = 0.9
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(L * 0.36, -H * 0.12, L * 0.045, 0, Math.PI * 2)
  ctx.fillStyle = '#1b1208'
  ctx.fill()
}

// ── Lapisan statis: pasir, batu, dan airstone digambar sekali per resize ──

function drawRock(c, x, baseY, w, h, rng) {
  const pts = 9
  const poly = []
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2
    const jitter = 0.82 + rng() * 0.3
    poly.push([x + Math.cos(a) * w * 0.5 * jitter, baseY - h * 0.5 + Math.sin(a) * h * 0.5 * jitter])
  }
  c.beginPath()
  for (let i = 0; i < pts; i++) {
    const p = poly[i]
    const n = poly[(i + 1) % pts]
    const mx = (p[0] + n[0]) / 2
    const my = (p[1] + n[1]) / 2
    if (i === 0) c.moveTo(mx, my)
    else c.quadraticCurveTo(p[0], p[1], mx, my)
  }
  c.closePath()
  const g = c.createLinearGradient(x - w * 0.3, baseY - h, x + w * 0.4, baseY)
  g.addColorStop(0, '#8aa4a8')
  g.addColorStop(0.55, '#4b6268')
  g.addColorStop(1, '#27393f')
  c.fillStyle = g
  c.fill()
  c.strokeStyle = 'rgba(2, 16, 22, 0.5)'
  c.lineWidth = 1.2
  c.stroke()

  // Lumut tipis di bagian atas
  c.beginPath()
  c.ellipse(x - w * 0.08, baseY - h * 0.82, w * 0.22, h * 0.1, -0.2, 0, Math.PI * 2)
  c.fillStyle = 'rgba(96, 160, 110, 0.45)'
  c.fill()

  // Kilau
  c.beginPath()
  c.ellipse(x - w * 0.18, baseY - h * 0.7, w * 0.12, h * 0.07, -0.5, 0, Math.PI * 2)
  c.fillStyle = 'rgba(255, 255, 255, 0.16)'
  c.fill()
}

function buildSubstrate(w, h, dpr) {
  const off = document.createElement('canvas')
  off.width = Math.floor(w * dpr)
  off.height = Math.floor(h * dpr)
  const c = off.getContext('2d')
  c.scale(dpr, dpr)

  const rng = mulberry32(11)
  const sandH = clamp(h * 0.1, 60, 100)
  const top = h - sandH

  c.beginPath()
  c.moveTo(0, h)
  for (let x = 0; x <= w + 12; x += 12) c.lineTo(x, sandSurface(x, top))
  c.lineTo(w, h)
  c.closePath()
  const sand = c.createLinearGradient(0, top - 8, 0, h)
  sand.addColorStop(0, '#c4b182')
  sand.addColorStop(0.2, '#8f7e57')
  sand.addColorStop(0.65, '#54462e')
  sand.addColorStop(1, '#2f2618')
  c.fillStyle = sand
  c.fill()

  const grains = Math.floor((w * sandH) / 70)
  for (let i = 0; i < grains; i++) {
    const x = rng() * w
    const y = sandSurface(x, top) + rng() * (h - sandSurface(x, top))
    c.beginPath()
    c.arc(x, y, 0.5 + rng() * 1.2, 0, Math.PI * 2)
    c.fillStyle = rng() > 0.5 ? 'rgba(255, 240, 205, 0.22)' : 'rgba(20, 14, 6, 0.3)'
    c.fill()
  }

  const mobile = w < 768
  const rocks = mobile
    ? [{ x: 0.1, w: 74, h: 46 }, { x: 0.86, w: 58, h: 36 }]
    : [
        { x: 0.12, w: 130, h: 82 },
        { x: 0.19, w: 74, h: 48 },
        { x: 0.77, w: 108, h: 70 },
      ]
  rocks.forEach((r) => {
    const x = r.x * w
    const base = sandSurface(x, top) + r.h * 0.22
    drawRock(c, x, base, r.w, r.h, rng)
    c.beginPath()
    c.ellipse(x, base - 1, r.w * 0.48, 6, 0, 0, Math.PI)
    c.fillStyle = 'rgba(170, 150, 108, 0.9)'
    c.fill()
  })

  // Airstone
  const ax = mobile ? w * 0.9 : w * 0.88
  const ay = sandSurface(ax, top) + 5
  const stone = c.createLinearGradient(ax, ay - 8, ax, ay + 6)
  stone.addColorStop(0, '#9aa7ab')
  stone.addColorStop(1, '#4d5a5e')
  c.beginPath()
  c.ellipse(ax, ay, 14, 6, 0, 0, Math.PI * 2)
  c.fillStyle = stone
  c.fill()

  return { canvas: off, sandTop: top, sandH, airX: ax, airY: ay - 4 }
}

export default function AquariumCanvas() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const depthVeilRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeScale = reduceMotion ? 0.35 : 1

    const env = { w: 0, h: 0, dpr: 1, mobile: false, sandTop: 0, sandH: 0, airX: 0, airY: 0 }
    let substrate = null
    let backPlants = []
    let frontPlants = []
    let motes = []
    const bubbles = []
    const ripples = []
    const food = []
    let airTimer = 0
    let running = true
    let rafId = 0
    let lastT = performance.now()

    // ── Ikan ────────────────────────────────────────────────────────────
    const swimTop = () => 90
    const swimBottom = () => env.sandTop - 50

    const nearestFood = (x, y, range, landedOnly = false) => {
      let best = null
      let bestD = range
      for (const f of food) {
        if (f.eaten) continue
        if (landedOnly ? !f.landed : f.landed) continue
        const d = Math.hypot(f.x - x, f.y - y)
        if (d < bestD) {
          bestD = d
          best = f
        }
      }
      return best
    }

    const eat = (f, x, y) => {
      f.eaten = true
      bubbles.push({ x, y, r: rand(1.2, 2.2), vy: rand(0.6, 1), wob: rand(0, 6), amp: 0.3, air: false })
    }

    class Swimmer {
      constructor(kind, x, y, speed, size, turn) {
        this.kind = kind
        this.x = x
        this.y = y
        this.speed = speed
        this.size = size
        this.turn = turn
        this.angle = rand(-0.4, 0.4)
        this.dir = 1
        this.sx = 1
        this.phase = rand(0, 100)
        this.gulp = 0
        this.pickTarget()
      }

      pickTarget() {
        this.tx = rand(90, Math.max(160, env.w - 90))
        this.ty = rand(swimTop(), Math.max(swimTop() + 40, swimBottom()))
      }

      update(dt) {
        this.phase += 0.18 * dt
        let tx = this.tx
        let ty = this.ty
        let boost = 1

        const f = nearestFood(this.x, this.y, 560)
        if (f) {
          tx = f.x
          ty = f.y
          boost = 1.75
          if (this.kind !== 'leader' && Math.hypot(f.x - this.x, f.y - this.y) < this.size * 0.5 + 6) {
            eat(f, this.x + Math.cos(this.angle) * this.size * 0.5, this.y)
            this.gulp = 1
          }
        } else if (Math.hypot(this.tx - this.x, this.ty - this.y) < 70) {
          this.pickTarget()
        }

        let diff = Math.atan2(ty - this.y, tx - this.x) - this.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.angle += diff * this.turn * dt

        const burst = this.kind === 'clown' ? 0.85 + Math.sin(this.phase * 0.7) * 0.3 : 1
        const v = this.speed * boost * burst * dt
        this.x += Math.cos(this.angle) * v
        this.y += Math.sin(this.angle) * v

        if (this.y < swimTop() - 30) this.y = swimTop() - 30
        if (this.y > swimBottom() + 30) this.y = swimBottom() + 30
        this.x = clamp(this.x, -30, env.w + 30)

        const c = Math.cos(this.angle)
        if (c > 0.15) this.dir = 1
        else if (c < -0.15) this.dir = -1
        this.sx += (this.dir - this.sx) * Math.min(1, 0.12 * dt)
        this.gulp = Math.max(0, this.gulp - 0.06 * dt)
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        const g = 1 + this.gulp * 0.1
        ctx.scale(this.sx * g, g)
        ctx.rotate(pitchOf(this.angle))
        const wag = Math.sin(this.phase) * 4
        if (this.kind === 'clown') drawClownfish(ctx, this.size, wag, this.phase)
        else if (this.kind === 'tang') drawTang(ctx, this.size, wag * 0.9)
        else drawAngel(ctx, this.size, Math.sin(this.phase * 0.12) * 2, this.phase)
        ctx.restore()
      }
    }

    let clown
    let tang
    let angel
    let leader
    let tetras = []
    let cory

    const buildFish = () => {
      const m = env.mobile
      clown = new Swimmer('clown', env.w * 0.22, env.h * 0.5, m ? 0.95 : 1.2, m ? 38 : 50, 0.035)
      tang = new Swimmer('tang', env.w * 0.75, env.h * 0.4, m ? 1.05 : 1.3, m ? 42 : 56, 0.032)
      angel = new Swimmer('angel', env.w * 0.5, env.h * 0.6, 0.65, m ? 44 : 62, 0.02)
      leader = new Swimmer('leader', env.w * 0.4, env.h * 0.3, 1.45, 10, 0.03)
      leader.vx = 0
      leader.vy = 0
      const count = m ? 8 : 15
      tetras = Array.from({ length: count }, (_, i) => ({
        x: leader.x + rand(-80, 40),
        y: leader.y + rand(-40, 40),
        vx: 1,
        vy: 0,
        angle: 0,
        dir: 1,
        sx: 1,
        ox: rand(-130, 10),
        oy: rand(-52, 52),
        phase: (i / count) * Math.PI * 2,
        size: m ? 15 : 20,
      }))
      cory = {
        x: env.w * 0.45,
        dir: 1,
        tx: env.w * 0.6,
        pause: 0,
        step: 0,
        size: m ? 24 : 30,
      }
    }

    const updateTetras = (dt, t) => {
      // Pemimpin kawanan: berenang seperti ikan lain, ikut mengejar makanan
      leader.update(dt)
      const lvx = Math.cos(leader.angle) * leader.speed
      const lvy = Math.sin(leader.angle) * leader.speed
      const cosA = Math.cos(leader.angle)
      const sinA = Math.sin(leader.angle)

      tetras.forEach((s, i) => {
        s.phase += 0.3 * dt
        const ox = s.ox + Math.sin(t * 0.0008 + i) * 8
        const oy = s.oy + Math.cos(t * 0.0011 + i * 1.7) * 6
        let dx = leader.x + cosA * ox - sinA * oy
        let dy = leader.y + sinA * ox + cosA * oy

        const f = nearestFood(s.x, s.y, 240)
        if (f) {
          dx = f.x
          dy = f.y
          if (Math.hypot(f.x - s.x, f.y - s.y) < 12) eat(f, s.x, s.y)
        }

        s.vx += ((dx - s.x) * 0.012 + (lvx - s.vx) * 0.03) * dt
        s.vy += ((dy - s.y) * 0.012 + (lvy - s.vy) * 0.03) * dt

        for (let j = 0; j < tetras.length; j++) {
          if (j === i) continue
          const o = tetras[j]
          const ddx = s.x - o.x
          const ddy = s.y - o.y
          const d2 = ddx * ddx + ddy * ddy
          if (d2 > 0 && d2 < 361) {
            const d = Math.sqrt(d2)
            s.vx += (ddx / d) * 0.05 * dt
            s.vy += (ddy / d) * 0.05 * dt
          }
        }

        const sp = Math.hypot(s.vx, s.vy)
        const max = f ? 3.4 : leader.speed * 1.6
        if (sp > max) {
          s.vx = (s.vx / sp) * max
          s.vy = (s.vy / sp) * max
        }

        s.x += s.vx * dt
        s.y += s.vy * dt
        s.y = clamp(s.y, swimTop() - 30, swimBottom() + 20)

        let diff = Math.atan2(s.vy, s.vx) - s.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        s.angle += diff * Math.min(1, 0.18 * dt)
        const c = Math.cos(s.angle)
        if (c > 0.15) s.dir = 1
        else if (c < -0.15) s.dir = -1
        s.sx += (s.dir - s.sx) * Math.min(1, 0.14 * dt)
      })
    }

    const drawTetras = () => {
      tetras.forEach((s) => {
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.scale(s.sx, 1)
        ctx.rotate(pitchOf(s.angle))
        drawTetra(ctx, s.size, Math.sin(s.phase) * 2.4)
        ctx.restore()
      })
    }

    const updateCory = (dt) => {
      const c = cory
      const f = nearestFood(c.x, env.sandTop + 20, 380, true)
      if (f) {
        c.pause = 0
        c.tx = f.x
        if (Math.abs(f.x - c.x) < 14) eat(f, c.x, sandSurface(c.x, env.sandTop) + 14)
      } else if (c.pause > 0) {
        c.pause -= dt
      } else if (Math.abs(c.tx - c.x) < 8) {
        c.pause = rand(40, 150)
        c.tx = rand(60, Math.max(120, env.w - 60))
      }
      if (c.pause <= 0 || f) {
        const dir = Math.sign(c.tx - c.x)
        if (dir !== 0 && Math.abs(c.tx - c.x) > 4) {
          c.dir = dir
          c.x += dir * (f ? 1.1 : 0.55) * dt
          c.step += 0.25 * dt
        }
      }
    }

    const drawCoryFish = () => {
      const c = cory
      const y = sandSurface(c.x, env.sandTop) + env.sandH * 0.32
      ctx.save()
      ctx.translate(c.x, y)
      ctx.scale(c.dir, 1)
      drawCory(ctx, c.size, Math.sin(c.step) * 1.4)
      ctx.restore()
    }

    // ── Tanaman, partikel, dan gelembung ─────────────────────────────────
    const buildPlants = () => {
      const m = env.mobile
      const makeBlades = (count, minH, maxH, wMin, wMax, hue, light) =>
        Array.from({ length: count }, (_, i) => {
          const left = i % 2 === 0
          const span = env.w * (m ? 0.22 : 0.18)
          const bx = left ? rand(-10, span) : env.w - rand(-10, span)
          return {
            x: bx,
            y: sandSurface(clamp(bx, 0, env.w), env.sandTop) + 8,
            height: rand(minH, maxH),
            width: rand(wMin, wMax),
            speed: rand(0.0009, 0.0017),
            phase: rand(0, Math.PI * 2),
            amp: rand(14, 30),
            hue: hue + rand(-8, 8),
            light,
          }
        })
      backPlants = makeBlades(m ? 7 : 14, env.h * 0.28, env.h * 0.58, 6, 11, 150, 24)
      frontPlants = makeBlades(m ? 9 : 18, env.h * 0.1, env.h * 0.3, 5, 9, 140, 36)
    }

    const buildMotes = () => {
      const n = env.mobile ? 18 : 42
      motes = Array.from({ length: n }, () => ({
        x: rand(0, env.w),
        y: rand(0, env.h),
        r: rand(0.6, 1.7),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.05, 0.06),
        a: rand(0.12, 0.38),
      }))
    }

    const drawBlades = (list, t) => {
      list.forEach((b) => {
        const sway = Math.sin(t * b.speed + b.phase) * b.amp
        ctx.beginPath()
        ctx.moveTo(b.x - b.width * 0.5, b.y)
        ctx.bezierCurveTo(
          b.x - b.width * 0.3 + sway * 0.2,
          b.y - b.height * 0.35,
          b.x + sway * 0.7,
          b.y - b.height * 0.7,
          b.x + sway,
          b.y - b.height
        )
        ctx.bezierCurveTo(
          b.x + sway * 0.7 + b.width * 0.4,
          b.y - b.height * 0.7,
          b.x + b.width * 0.3 + sway * 0.2,
          b.y - b.height * 0.35,
          b.x + b.width * 0.5,
          b.y
        )
        ctx.closePath()
        const g = ctx.createLinearGradient(0, b.y, 0, b.y - b.height)
        g.addColorStop(0, `hsla(${b.hue}, 62%, ${b.light - 14}%, 0.95)`)
        g.addColorStop(1, `hsla(${b.hue}, 66%, ${b.light + 14}%, 0.85)`)
        ctx.fillStyle = g
        ctx.fill()
      })
    }

    const drawRays = (t) => {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const n = env.mobile ? 3 : 6
      for (let i = 0; i < n; i++) {
        const phase = (t * 0.00028 + (i * Math.PI) / 3) % (Math.PI * 2)
        const sway = Math.sin(phase) * 42
        const x = (env.w / (n + 1)) * (i + 1) + sway
        const g = ctx.createLinearGradient(x, 0, x + sway, env.h * 0.85)
        g.addColorStop(0, 'rgba(255, 255, 235, 0.085)')
        g.addColorStop(0.45, 'rgba(180, 250, 245, 0.03)')
        g.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(x - 26, 0)
        ctx.lineTo(x + 26, 0)
        ctx.lineTo(x + 80 + sway, env.h * 0.85)
        ctx.lineTo(x - 80 + sway, env.h * 0.85)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }

    const drawMotes = (dt) => {
      motes.forEach((m) => {
        m.x += m.vx * dt
        m.y += m.vy * dt
        if (m.x < -5) m.x = env.w + 5
        if (m.x > env.w + 5) m.x = -5
        if (m.y < -5) m.y = env.h + 5
        if (m.y > env.h + 5) m.y = -5
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 255, 250, ${m.a})`
        ctx.fill()
      })
    }

    const updateBubbles = (dt) => {
      airTimer -= dt
      if (airTimer <= 0 && bubbles.length < 90) {
        bubbles.push({
          x: env.airX + rand(-3, 3),
          y: env.airY,
          r: rand(1.4, 3.6),
          vy: rand(0.9, 1.7),
          wob: rand(0, 6),
          amp: rand(0.25, 0.6),
          air: true,
        })
        airTimer = rand(5, 12)
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]
        b.wob += 0.05 * dt
        b.y -= b.vy * dt
        b.x += Math.sin(b.wob) * b.amp * dt
        if (b.air) b.r += 0.0035 * dt
        if (b.y < SURFACE_Y) {
          ripples.push({ x: b.x, r: 3, max: 22, a: 0.4 })
          bubbles.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(220, 250, 255, 0.12)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 0.9
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.fill()
      }
    }

    // ── Makanan ikan ─────────────────────────────────────────────────────
    const feed = (x) => {
      if (food.filter((f) => !f.eaten).length > 40) return
      const cx = x ?? rand(env.w * 0.2, env.w * 0.8)
      for (let i = 0; i < 8; i++) {
        food.push({
          x: cx + rand(-28, 28),
          y: SURFACE_Y + rand(2, 16),
          vy: rand(0.35, 0.65),
          phase: rand(0, Math.PI * 2),
          size: rand(2.2, 3.6),
          hue: rand(18, 46),
          landed: false,
          life: 0,
          eaten: false,
        })
      }
      ripples.push({ x: cx, r: 4, max: 52, a: 0.55 })
    }

    const updateFood = (dt, t) => {
      for (let i = food.length - 1; i >= 0; i--) {
        const f = food[i]
        if (f.eaten) {
          food.splice(i, 1)
          continue
        }
        if (!f.landed) {
          f.y += f.vy * dt
          f.x += Math.sin(f.phase + t * 0.002) * 0.25 * dt
          if (f.y >= sandSurface(f.x, env.sandTop) + env.sandH * 0.28) f.landed = true
        } else {
          f.life += dt
          if (f.life > 900) {
            food.splice(i, 1)
            continue
          }
        }
        const alpha = f.landed ? clamp(1 - (f.life - 600) / 300, 0, 1) : 1
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.phase + t * 0.001)
        ctx.fillStyle = `hsla(${f.hue}, 85%, 62%, ${alpha})`
        ctx.beginPath()
        ctx.ellipse(0, 0, f.size, f.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // ── Permukaan air dan cahaya di pasir ────────────────────────────────
    const drawSurface = (t) => {
      const g = ctx.createLinearGradient(0, 0, 0, 52)
      g.addColorStop(0, 'rgba(235, 255, 255, 0.42)')
      g.addColorStop(0.35, 'rgba(170, 245, 240, 0.14)')
      g.addColorStop(1, 'rgba(170, 245, 240, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, env.w, 52)

      ctx.beginPath()
      for (let x = 0; x <= env.w + 8; x += 8) {
        const y = SURFACE_Y + Math.sin(x * 0.02 + t * 0.0015) * 2 + Math.sin(x * 0.05 - t * 0.0021) * 1.2
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    const drawSandLight = (t) => {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const n = env.mobile ? 8 : 16
      for (let i = 0; i < n; i++) {
        const dir = i % 2 ? 1 : -1
        const x = (((i * env.w) / n + t * 0.014 * dir) % env.w + env.w) % env.w
        const y = env.sandTop + 12 + ((i * 37) % Math.max(20, env.sandH * 0.7))
        const a = 0.05 + (Math.sin(t * 0.0012 + i) + 1) * 0.04
        ctx.beginPath()
        ctx.ellipse(x, y, 34 + (i % 3) * 10, 4, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 225, ${a})`
        ctx.fill()
      }
      ctx.restore()
    }

    const drawRipples = (dt) => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.r += 1.5 * dt
        r.a -= 0.012 * dt
        if (r.a <= 0 || r.r >= r.max) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.ellipse(r.x, SURFACE_Y + 2, r.r, r.r * 0.16, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.a})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    // ── Ukuran dan siklus render ─────────────────────────────────────────
    const build = (first) => {
      env.w = wrap.clientWidth || window.innerWidth
      env.h = wrap.clientHeight || window.innerHeight
      env.mobile = env.w < 768
      env.dpr = Math.min(window.devicePixelRatio || 1, env.mobile ? 1.5 : 2)
      canvas.width = Math.floor(env.w * env.dpr)
      canvas.height = Math.floor(env.h * env.dpr)
      ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0)

      substrate = buildSubstrate(env.w, env.h, env.dpr)
      env.sandTop = substrate.sandTop
      env.sandH = substrate.sandH
      env.airX = substrate.airX
      env.airY = substrate.airY

      buildPlants()
      buildMotes()
      if (first) buildFish()
      else {
        ;[clown, tang, angel, leader].forEach((f) => {
          f.x = clamp(f.x, 0, env.w)
          f.pickTarget()
        })
        tetras.forEach((s) => {
          s.x = clamp(s.x, 0, env.w)
        })
        cory.x = clamp(cory.x, 40, env.w - 40)
      }
    }

    build(true)

    let resizeTimer
    let lastW = env.w
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const w = wrap.clientWidth
        if (Math.abs(w - lastW) < 2 && Math.abs(wrap.clientHeight - env.h) < 2) return
        lastW = w
        build(false)
      }, 150)
    }
    window.addEventListener('resize', onResize)

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return
      const target = e.target
      if (
        target &&
        target.closest &&
        target.closest('button, a, input, textarea, select, label, summary, header, footer, [data-no-feed], .glass, .glass-inset, .specimen-panel, .specimen-inset')
      ) {
        return
      }
      feed(e.clientX)
    }
    window.addEventListener('pointerdown', onPointerDown)

    const onFeedEvent = (e) => feed(e.detail?.x)
    window.addEventListener('fizhtank-feed', onFeedEvent)

    const render = (now) => {
      if (!running) return
      const dt = Math.min((now - lastT) / 16.667, 3) * timeScale
      lastT = now

      ctx.clearRect(0, 0, env.w, env.h)

      drawRays(now)
      drawMotes(dt)
      drawBlades(backPlants, now)

      ctx.drawImage(substrate.canvas, 0, 0, env.w, env.h)

      updateCory(dt)
      drawCoryFish()

      angel.update(dt)
      angel.draw()
      tang.update(dt)
      tang.draw()
      clown.update(dt)
      clown.draw()
      updateTetras(dt, now)
      drawTetras()

      drawBlades(frontPlants, now)
      updateFood(dt, now)
      updateBubbles(dt)
      drawSandLight(now)
      drawSurface(now)
      drawRipples(dt)

      rafId = requestAnimationFrame(render)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!running) {
        running = true
        lastT = performance.now()
        rafId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Kedalaman air bertahap mengikuti posisi scroll (Permukaan 0m -> Abisal 500m) via GPU opacity
    let depthRaf = null
    const syncDepthVeil = () => {
      depthRaf = null
      if (!depthVeilRef.current) return
      const doc = document.documentElement
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll))
      depthVeilRef.current.style.opacity = (ratio * 0.68).toFixed(3)
    }
    const onScrollDepth = () => {
      if (depthRaf) return
      depthRaf = requestAnimationFrame(syncDepthVeil)
    }
    syncDepthVeil()
    window.addEventListener('scroll', onScrollDepth, { passive: true })
    window.addEventListener('resize', onScrollDepth, { passive: true })

    rafId = requestAnimationFrame(render)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      if (depthRaf) cancelAnimationFrame(depthRaf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('fizhtank-feed', onFeedEvent)
      window.removeEventListener('scroll', onScrollDepth)
      window.removeEventListener('resize', onScrollDepth)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 h-lvh w-full select-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(130, 240, 235, 0.3), transparent 70%), linear-gradient(180deg, #0c6274 0%, #0a4c5e 30%, #063a4a 62%, #042a35 100%)',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Lapisan kedalaman abisal saat user menyelam ke bagian bawah halaman */}
      <div
        ref={depthVeilRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          background:
            'radial-gradient(ellipse 100% 70% at 50% 25%, rgba(2, 19, 27, 0.45), rgba(1, 10, 16, 0.96))',
        }}
      />
      {/* Bayangan di dasar tank agar teks yang melewati area pasir tetap terbaca */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-deep/70 to-transparent" />
    </div>
  )
}
