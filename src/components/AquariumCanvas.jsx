import { useEffect, useRef } from 'react'
import { playWaterBubble } from '../utils/audio'

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FIZHTANK — PRISTINE AQUARIUM TANK CANVAS ENGINE (AWWWARDS & APPLE CALIBER)
 * ══════════════════════════════════════════════════════════════════════════════
 * Authentic Aquarium Ecosystem:
 *  1. Tropical Clownfish (Amphiprion ocellaris) with 3 iconic banded stripes & fin flutter
 *  2. Royal Blue Tang (Paracanthurus hepatus) with canary-yellow caudal fin
 *  3. School of Iridescent Neon Tetras with glowing lateral cyan & crimson bars
 *  4. Majestic Freshwater Angelfish (Pterophyllum scalare) with elongated trailing fins
 *  5. Continuous Aerator Bubble Streams rising from airstone with buoyant surface wobble
 *  6. Aquascape Aquatic Flora rooted at bottom corners gently swaying in water current
 *  7. Volumetric Caustic Sunbeams refracting through crystalline water
 *  8. STABILITY: 100% decoupled from scroll — animations NEVER reset when scrolling!
 * ══════════════════════════════════════════════════════════════════════════════
 */

export default function AquariumCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let isRunning = true
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Interactive pointer state (Only active on deliberate mouse moves, NOT touch scroll swipes)
    const pointer = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      active: false,
    }

    const onMouseMove = (e) => {
      pointer.targetX = e.clientX
      pointer.targetY = e.clientY
      pointer.active = true
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Water Surface Ripple Rings (Spawned on intentional click)
    const waterRipples = []
    const triggerRipple = (x, y) => {
      playWaterBubble()
      waterRipples.push({
        x: x ?? pointer.targetX,
        y: y ?? pointer.targetY,
        radius: 8,
        maxRadius: Math.min(width, height) * 0.45,
        alpha: 0.75,
        speed: 2.8,
      })
    }

    const onPointerDown = (e) => {
      // Avoid triggering on buttons, links, or form inputs
      const target = e.target
      if (target && target.closest && target.closest('button, a, input, textarea, [role="button"]')) {
        return
      }
      triggerRipple(e.clientX, e.clientY)
    }
    window.addEventListener('pointerdown', onPointerDown)

    const onCustomFeed = () => triggerRipple(width * 0.5, height * 0.3)
    window.addEventListener('fizhtank-feed', onCustomFeed)

    // ── 1. Aerator Bubble Column ────────────────────────────────────
    const isMobile = width < 768
    const BUBBLE_COUNT = isMobile ? 22 : 45
    const bubbles = Array.from({ length: BUBBLE_COUNT }, () => ({
      x: width * 0.08 + Math.random() * (width * 0.84),
      y: height + Math.random() * height,
      size: 1.8 + Math.random() * 4.5,
      speed: 0.7 + Math.random() * 1.4,
      wobbleSpeed: 0.02 + Math.random() * 0.04,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleAmp: 0.4 + Math.random() * 0.9,
      alpha: 0.25 + Math.random() * 0.4,
    }))

    // ── 2. Aquascape Grass Flora (Rooted at bottom) ─────────────────
    const BLADE_COUNT = isMobile ? 14 : 26
    const plantBlades = Array.from({ length: BLADE_COUNT }, (_, i) => {
      const isLeft = i < BLADE_COUNT / 2
      const baseX = isLeft
        ? (i / (BLADE_COUNT / 2)) * (width * 0.16)
        : width - ((i - BLADE_COUNT / 2) / (BLADE_COUNT / 2)) * (width * 0.16)
      return {
        baseX,
        baseY: height + 10,
        height: 120 + Math.random() * 140,
        width: 6 + Math.random() * 8,
        swaySpeed: 0.0012 + Math.random() * 0.001,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 18 + Math.random() * 22,
        hue: 152 + Math.random() * 18, // Emerald to sea-green
      }
    })

    // ── 3. Tropical Clownfish (Amphiprion ocellaris) ────────────────
    class Clownfish {
      constructor(startX, startY, speed = 1.1) {
        this.x = startX
        this.y = startY
        this.speed = speed
        this.angle = 0
        this.targetAngle = 0
        this.targetX = width * 0.6
        this.targetY = height * 0.45
        this.swimTimer = Math.random() * 10
        this.finCycle = 0
        this.bodyLength = isMobile ? 38 : 50
        this.bodyHeight = this.bodyLength * 0.52
      }

      update() {
        this.swimTimer += 0.025
        this.finCycle += 0.18

        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 80) {
          this.targetX = Math.random() * (width - 160) + 80
          this.targetY = Math.random() * (height - 200) + 100
        }

        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.targetAngle = Math.atan2(dy, dx)

        let diff = this.targetAngle - this.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.angle += diff * 0.035

        // Lifelike fish burst-and-glide propulsion
        const burst = 0.8 + Math.sin(this.swimTimer * 2) * 0.35
        this.x += Math.cos(this.angle) * this.speed * burst
        this.y += Math.sin(this.angle) * this.speed * burst

        // Boundary wrap
        if (this.x < -100) this.x = width + 100
        if (this.x > width + 100) this.x = -100
        if (this.y < -60) this.y = height + 60
        if (this.y > height + 60) this.y = -60
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        // If swimming to the left, flip vertically for upright posture
        if (Math.cos(this.angle) < 0) {
          ctx.scale(1, -1)
        }

        const wag = Math.sin(this.finCycle) * 4
        const L = this.bodyLength
        const H = this.bodyHeight

        // Subtle ambient bioluminescent halo around clownfish
        const halo = ctx.createRadialGradient(0, 0, 5, 0, 0, L * 0.9)
        halo.addColorStop(0, 'rgba(249, 115, 22, 0.2)')
        halo.addColorStop(0.7, 'rgba(234, 88, 12, 0.05)')
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(0, 0, L * 0.9, 0, Math.PI * 2)
        ctx.fill()

        // 1. Caudal Fin (Tail) with wave
        ctx.beginPath()
        ctx.moveTo(-L * 0.45, 0)
        ctx.quadraticCurveTo(-L * 0.7, -H * 0.55 + wag, -L * 0.82, -H * 0.5 + wag)
        ctx.quadraticCurveTo(-L * 0.72, wag, -L * 0.82, H * 0.5 + wag)
        ctx.quadraticCurveTo(-L * 0.7, H * 0.55 + wag, -L * 0.45, 0)
        ctx.closePath()
        ctx.fillStyle = '#ea580c'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1.2
        ctx.fill()
        ctx.stroke()

        // White border on tail tip
        ctx.beginPath()
        ctx.arc(-L * 0.78, wag, H * 0.35, -Math.PI * 0.5, Math.PI * 0.5)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.lineWidth = 2
        ctx.stroke()

        // 2. Main Orange Body
        ctx.beginPath()
        ctx.moveTo(L * 0.5, 0)
        ctx.bezierCurveTo(L * 0.35, -H * 0.65, -L * 0.2, -H * 0.65, -L * 0.45, 0)
        ctx.bezierCurveTo(-L * 0.2, H * 0.65, L * 0.35, H * 0.65, L * 0.5, 0)
        ctx.closePath()

        const bodyGrad = ctx.createLinearGradient(0, -H * 0.6, 0, H * 0.6)
        bodyGrad.addColorStop(0, '#fb923c')
        bodyGrad.addColorStop(0.4, '#f97316')
        bodyGrad.addColorStop(1, '#c2410c')
        ctx.fillStyle = bodyGrad
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1.2
        ctx.fill()
        ctx.stroke()

        // 3. Three Iconic White Stripes with black outlines
        const drawStripe = (cx, topW, botW, curveX) => {
          ctx.beginPath()
          ctx.moveTo(cx - topW * 0.5, -H * 0.55)
          ctx.quadraticCurveTo(cx + curveX, 0, cx - botW * 0.5, H * 0.55)
          ctx.lineTo(cx + botW * 0.5, H * 0.55)
          ctx.quadraticCurveTo(cx + curveX + topW * 0.5, 0, cx + topW * 0.5, -H * 0.55)
          ctx.closePath()
          ctx.fillStyle = '#ffffff'
          ctx.strokeStyle = '#0f172a'
          ctx.lineWidth = 1.5
          ctx.fill()
          ctx.stroke()
        }

        // Head stripe
        drawStripe(L * 0.22, L * 0.14, L * 0.12, L * 0.04)
        // Mid-body stripe (with characteristic forward curve)
        drawStripe(-L * 0.05, L * 0.16, L * 0.14, L * 0.08)
        // Tail peduncle stripe
        drawStripe(-L * 0.35, L * 0.1, L * 0.08, 0)

        // 4. Dorsal Fin (Top)
        ctx.beginPath()
        ctx.moveTo(L * 0.15, -H * 0.5)
        ctx.quadraticCurveTo(-L * 0.05, -H * 0.95, -L * 0.25, -H * 0.45)
        ctx.strokeStyle = '#0f172a'
        ctx.fillStyle = '#f97316'
        ctx.lineWidth = 1.2
        ctx.fill()
        ctx.stroke()

        // 5. Pectoral Fin with rhythmic flutter
        const finWag = Math.sin(this.finCycle * 1.5) * 0.3
        ctx.save()
        ctx.translate(L * 0.08, H * 0.1)
        ctx.rotate(finWag)
        ctx.beginPath()
        ctx.ellipse(0, 0, L * 0.16, H * 0.25, 0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(251, 146, 60, 0.85)'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // 6. Eye
        ctx.beginPath()
        ctx.arc(L * 0.36, -H * 0.12, L * 0.07, 0, Math.PI * 2)
        ctx.fillStyle = '#0f172a'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(L * 0.38, -H * 0.14, L * 0.025, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        ctx.restore()
      }
    }

    // ── 4. Royal Blue Tang (Paracanthurus hepatus - Dory) ────────────
    class BlueTang {
      constructor(startX, startY, speed = 1.25) {
        this.x = startX
        this.y = startY
        this.speed = speed
        this.angle = 0
        this.targetAngle = 0
        this.targetX = width * 0.3
        this.targetY = height * 0.6
        this.swimTimer = Math.random() * 10
        this.finCycle = 0
        this.bodyLength = isMobile ? 42 : 56
        this.bodyHeight = this.bodyLength * 0.56
      }

      update() {
        this.swimTimer += 0.028
        this.finCycle += 0.2

        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 90) {
          this.targetX = Math.random() * (width - 180) + 90
          this.targetY = Math.random() * (height - 220) + 110
        }

        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.targetAngle = Math.atan2(dy, dx)

        let diff = this.targetAngle - this.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.angle += diff * 0.032

        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        if (this.x < -120) this.x = width + 120
        if (this.x > width + 120) this.x = -120
        if (this.y < -70) this.y = height + 70
        if (this.y > height + 70) this.y = -70
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        if (Math.cos(this.angle) < 0) {
          ctx.scale(1, -1)
        }

        const wag = Math.sin(this.finCycle) * 3.5
        const L = this.bodyLength
        const H = this.bodyHeight

        // Glow aura
        const halo = ctx.createRadialGradient(0, 0, 5, 0, 0, L)
        halo.addColorStop(0, 'rgba(37, 99, 235, 0.25)')
        halo.addColorStop(0.7, 'rgba(6, 182, 212, 0.08)')
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(0, 0, L, 0, Math.PI * 2)
        ctx.fill()

        // 1. Triangular Canary Yellow Caudal Tail
        ctx.beginPath()
        ctx.moveTo(-L * 0.42, 0)
        ctx.lineTo(-L * 0.8, -H * 0.45 + wag)
        ctx.lineTo(-L * 0.72, wag)
        ctx.lineTo(-L * 0.8, H * 0.45 + wag)
        ctx.closePath()
        ctx.fillStyle = '#facc15'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1.2
        ctx.fill()
        ctx.stroke()

        // 2. Oval Royal Cobalt Blue Body
        ctx.beginPath()
        ctx.moveTo(L * 0.48, 0)
        ctx.bezierCurveTo(L * 0.3, -H * 0.65, -L * 0.25, -H * 0.65, -L * 0.45, 0)
        ctx.bezierCurveTo(-L * 0.25, H * 0.65, L * 0.3, H * 0.65, L * 0.48, 0)
        ctx.closePath()

        const blueGrad = ctx.createLinearGradient(0, -H * 0.6, 0, H * 0.6)
        blueGrad.addColorStop(0, '#3b82f6')
        blueGrad.addColorStop(0.5, '#1d4ed8')
        blueGrad.addColorStop(1, '#172554')
        ctx.fillStyle = blueGrad
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1.2
        ctx.fill()
        ctx.stroke()

        // 3. Black Palette Swirl Pattern on flank
        ctx.beginPath()
        ctx.moveTo(L * 0.1, -H * 0.4)
        ctx.bezierCurveTo(-L * 0.25, -H * 0.5, -L * 0.4, -H * 0.2, -L * 0.42, 0)
        ctx.bezierCurveTo(-L * 0.4, H * 0.2, -L * 0.25, H * 0.5, L * 0.1, H * 0.4)
        ctx.bezierCurveTo(-L * 0.05, H * 0.2, -L * 0.15, 0, -L * 0.05, -H * 0.2)
        ctx.closePath()
        ctx.fillStyle = '#090d16'
        ctx.fill()

        // Yellow wedge in the black flank
        ctx.beginPath()
        ctx.moveTo(-L * 0.12, 0)
        ctx.lineTo(-L * 0.38, -H * 0.15)
        ctx.lineTo(-L * 0.38, H * 0.15)
        ctx.closePath()
        ctx.fillStyle = '#facc15'
        ctx.fill()

        // 4. Eye
        ctx.beginPath()
        ctx.arc(L * 0.32, -H * 0.14, L * 0.065, 0, Math.PI * 2)
        ctx.fillStyle = '#0f172a'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(L * 0.34, -H * 0.16, L * 0.025, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        ctx.restore()
      }
    }

    // ── 5. School of Iridescent Neon Tetras (Cardinal Tetras) ───────
    const TETRA_COUNT = isMobile ? 8 : 16
    const tetras = Array.from({ length: TETRA_COUNT }, (_, i) => ({
      x: width * 0.45 + (Math.random() - 0.5) * 220,
      y: height * 0.28 + (Math.random() - 0.5) * 140,
      speed: 1.35 + Math.random() * 0.6,
      angle: 0.1 + (Math.random() - 0.5) * 0.2,
      size: isMobile ? 16 : 22,
      wagPhase: (i / TETRA_COUNT) * Math.PI * 2,
    }))

    // ── 6. Majestic Freshwater Angelfish (Pterophyllum scalare) ─────
    class Angelfish {
      constructor(startX, startY) {
        this.x = startX
        this.y = startY
        this.speed = 0.65
        this.angle = 0
        this.targetAngle = 0
        this.targetX = width * 0.75
        this.targetY = height * 0.35
        this.cycle = 0
        this.size = isMobile ? 44 : 62
      }

      update() {
        this.cycle += 0.02

        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 100) {
          this.targetX = Math.random() * (width - 240) + 120
          this.targetY = Math.random() * (height - 300) + 150
        }

        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.targetAngle = Math.atan2(dy, dx)

        let diff = this.targetAngle - this.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.angle += diff * 0.02

        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        if (this.x < -140) this.x = width + 140
        if (this.x > width + 140) this.x = -140
        if (this.y < -100) this.y = height + 100
        if (this.y > height + 100) this.y = -100
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        if (Math.cos(this.angle) < 0) {
          ctx.scale(1, -1)
        }

        const S = this.size
        const sway = Math.sin(this.cycle) * 2

        // Tall triangular silver & black striped body
        ctx.beginPath()
        ctx.moveTo(S * 0.45, 0)
        ctx.lineTo(-S * 0.3, -S * 0.4)
        ctx.lineTo(-S * 0.45, 0)
        ctx.lineTo(-S * 0.3, S * 0.4)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, -S * 0.4, 0, S * 0.4)
        grad.addColorStop(0, '#e2e8f0')
        grad.addColorStop(0.5, '#94a3b8')
        grad.addColorStop(1, '#cbd5e1')
        ctx.fillStyle = grad
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Iconic vertical stripes
        ctx.beginPath()
        ctx.moveTo(S * 0.15, -S * 0.32)
        ctx.lineTo(S * 0.15, S * 0.32)
        ctx.moveTo(-S * 0.1, -S * 0.38)
        ctx.lineTo(-S * 0.1, S * 0.38)
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Majestic tall dorsal fin (pointing high up)
        ctx.beginPath()
        ctx.moveTo(S * 0.05, -S * 0.35)
        ctx.quadraticCurveTo(-S * 0.1, -S * 1.3 + sway, -S * 0.4, -S * 0.8)
        ctx.lineTo(-S * 0.25, -S * 0.38)
        ctx.closePath()
        ctx.fillStyle = 'rgba(226, 232, 240, 0.75)'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Long trailing ventral fin (pointing far down)
        ctx.beginPath()
        ctx.moveTo(S * 0.05, S * 0.35)
        ctx.quadraticCurveTo(-S * 0.1, S * 1.3 - sway, -S * 0.4, S * 0.8)
        ctx.lineTo(-S * 0.25, S * 0.38)
        ctx.closePath()
        ctx.fillStyle = 'rgba(226, 232, 240, 0.75)'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Delicate thread-like feeler fins
        ctx.beginPath()
        ctx.moveTo(S * 0.15, S * 0.25)
        ctx.quadraticCurveTo(0, S * 0.9, -S * 0.2, S * 1.2 + sway)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Eye
        ctx.beginPath()
        ctx.arc(S * 0.3, -S * 0.08, S * 0.055, 0, Math.PI * 2)
        ctx.fillStyle = '#dc2626'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(S * 0.31, -S * 0.08, S * 0.025, 0, Math.PI * 2)
        ctx.fillStyle = '#0f172a'
        ctx.fill()

        ctx.restore()
      }
    }

    // Instantiate aquarium specimens
    const clownfish = new Clownfish(width * 0.22, height * 0.52, isMobile ? 0.95 : 1.2)
    const blueTang = new BlueTang(width * 0.75, height * 0.42, isMobile ? 1.05 : 1.3)
    const angelfish = new Angelfish(width * 0.5, height * 0.65)

    // ── 7. Render Loop (Independent 60 FPS Engine) ──────────────────
    const render = (currentTime) => {
      if (!isRunning) return

      // Clear with crystal-clear aquarium backdrop
      ctx.clearRect(0, 0, width, height)

      // ── Layer A: Volumetric Caustic Sunlit Water Column ──
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const rayCount = isMobile ? 3 : 6
      for (let i = 0; i < rayCount; i++) {
        const offset = (currentTime * 0.00035 + (i * Math.PI) / 3) % (Math.PI * 2)
        const sway = Math.sin(offset) * 38
        const rayX = (width / (rayCount + 1)) * (i + 1) + sway

        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + sway * 1.6, height * 0.9)
        rayGrad.addColorStop(0, 'rgba(34, 211, 238, 0.09)')
        rayGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.04)')
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(rayX - 40, 0)
        ctx.lineTo(rayX + 40, 0)
        ctx.lineTo(rayX + 90 + sway, height * 0.9)
        ctx.lineTo(rayX - 90 + sway, height * 0.9)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // ── Layer B: Aerator Air Bubbles Rising from Bottom ──
      bubbles.forEach((b) => {
        b.wobbleOffset += b.wobbleSpeed
        b.y -= b.speed
        b.x += Math.sin(b.wobbleOffset) * b.wobbleAmp

        if (b.y < -10) {
          b.y = height + Math.random() * 20
          b.x = width * 0.05 + Math.random() * (width * 0.9)
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(186, 230, 253, ${b.alpha * 0.6})`
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`
        ctx.lineWidth = 0.8
        ctx.fill()
        ctx.stroke()

        // Shimmer specular highlight
        ctx.beginPath()
        ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.fill()
        ctx.restore()
      })

      // ── Layer C: Swaying Aquascape Plant Flora (Bottom) ──
      plantBlades.forEach((blade) => {
        const sway = Math.sin(currentTime * blade.swaySpeed + blade.swayPhase) * blade.swayAmp
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(blade.baseX - blade.width * 0.5, blade.baseY)
        ctx.quadraticCurveTo(
          blade.baseX + sway * 0.5,
          blade.baseY - blade.height * 0.55,
          blade.baseX + sway,
          blade.baseY - blade.height
        )
        ctx.quadraticCurveTo(
          blade.baseX + sway * 0.5 + blade.width * 0.3,
          blade.baseY - blade.height * 0.55,
          blade.baseX + blade.width * 0.5,
          blade.baseY
        )
        ctx.closePath()

        const plantGrad = ctx.createLinearGradient(0, blade.baseY, 0, blade.baseY - blade.height)
        plantGrad.addColorStop(0, 'rgba(4, 120, 87, 0.6)')
        plantGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.4)')
        plantGrad.addColorStop(1, 'rgba(52, 211, 153, 0.25)')
        ctx.fillStyle = plantGrad
        ctx.fill()
        ctx.restore()
      })

      // ── Layer D: School of Neon Tetras ──
      tetras.forEach((t) => {
        t.wagPhase += 0.22
        t.x += t.speed
        t.y += Math.sin(t.wagPhase * 0.5) * 0.4

        if (t.x > width + 40) {
          t.x = -40
          t.y = height * 0.22 + Math.random() * (height * 0.25)
        }

        ctx.save()
        ctx.translate(t.x, t.y)

        const wag = Math.sin(t.wagPhase) * 2.5
        const S = t.size

        // Slender fish body
        ctx.beginPath()
        ctx.moveTo(S * 0.5, 0)
        ctx.quadraticCurveTo(0, -S * 0.22, -S * 0.4, wag)
        ctx.lineTo(-S * 0.6, wag * 1.5)
        ctx.lineTo(-S * 0.4, wag)
        ctx.quadraticCurveTo(0, S * 0.22, S * 0.5, 0)
        ctx.closePath()
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
        ctx.fill()

        // Glowing electric blue upper lateral stripe
        ctx.beginPath()
        ctx.moveTo(S * 0.4, -S * 0.05)
        ctx.lineTo(-S * 0.35, wag * 0.6 - S * 0.04)
        ctx.strokeStyle = '#00f0ff'
        ctx.lineWidth = 1.4
        ctx.shadowColor = '#00f0ff'
        ctx.shadowBlur = 4
        ctx.stroke()
        ctx.shadowBlur = 0

        // Vivid crimson belly stripe
        ctx.beginPath()
        ctx.moveTo(0, S * 0.05)
        ctx.lineTo(-S * 0.35, wag * 0.6 + S * 0.04)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 1.3
        ctx.stroke()

        ctx.restore()
      })

      // ── Layer E: Royal Blue Tang (Dory) ──
      blueTang.update()
      blueTang.draw(ctx)

      // ── Layer F: Tropical Clownfish (Nemo) ──
      clownfish.update()
      clownfish.draw(ctx)

      // ── Layer G: Freshwater Angelfish (Manfish) ──
      angelfish.update()
      angelfish.draw(ctx)

      // ── Layer H: Water Surface Ripple Waves ──
      for (let i = waterRipples.length - 1; i >= 0; i--) {
        const rip = waterRipples[i]
        rip.radius += rip.speed
        rip.alpha -= 0.012

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          waterRipples.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34, 211, 238, ${rip.alpha * 0.6})`
        ctx.lineWidth = 1.6
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 16), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha * 0.35})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false
        cancelAnimationFrame(animationFrameId)
      } else if (!isRunning) {
        isRunning = true
        animationFrameId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    animationFrameId = requestAnimationFrame(render)

    return () => {
      isRunning = false
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('fizhtank-feed', onCustomFeed)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
      style={{
        // Crystal-clear planted aquarium gradient (clean aqua-navy water column)
        background: 'radial-gradient(ellipse 120% 90% at 50% 10%, #06223e 0%, #031326 50%, #010712 100%)',
      }}
      aria-hidden="true"
    >
      {/* 60/120 FPS High-Performance HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair" />

      {/* Aquarium Glass Rim Refraction Reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.7)',
          background: 'radial-gradient(circle at 50% 40%, transparent 65%, rgba(1, 7, 18, 0.6) 100%)',
        }}
      />
    </div>
  )
}
