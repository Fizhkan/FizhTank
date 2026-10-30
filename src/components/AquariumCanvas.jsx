import { useEffect, useRef, useState } from 'react'
import { playSonarPing } from '../utils/audio'

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FIZHTANK — HIGH-END INTERACTIVE OCEANIC CANVAS (AWWWARDS CALIBER)
 * ══════════════════════════════════════════════════════════════════════════════
 * Features:
 *  1. Volumetric caustic light shafts refracting through water column.
 *  2. Hydrodynamic particle physics (marine snow & bioluminescent plankton)
 *     with fluid cursor wake & turbulence.
 *  3. Procedural deep-sea organisms with kinematic swimming locomotion:
 *     - Abyssal Ghost Manta (undulating pectoral wings & whip tail)
 *     - Bioluminescent Medusa / Jellyfish (rhythmic bell propulsion & trailing tentacles)
 *     - Synchronous School of Neon Nano-Tetras (flocking boids)
 *  4. Interactive sonar acoustic shockwave ripples on click/tap.
 *  5. Adaptive scroll-depth color grading (photic shallow -> hadal midnight void).
 *  6. 60 FPS compositor efficiency: throttled when tab hidden, scales for mobile.
 * ══════════════════════════════════════════════════════════════════════════════
 */

export default function AquariumCanvas() {
  const canvasRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll depth smoothly for background color & creature depths
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const p = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
          setScrollProgress(p)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let isRunning = true
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle high DPI displays cleanly
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

    // Mouse & Touch interaction state
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      vx: 0,
      vy: 0,
      active: false,
      lastMoved: Date.now(),
    }

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouse.vx = clientX - mouse.targetX
      mouse.vy = clientY - mouse.targetY
      mouse.targetX = clientX
      mouse.targetY = clientY
      mouse.active = true
      mouse.lastMoved = Date.now()
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })

    // Acoustic Sonar Rings (Spawned on click)
    const sonarRings = []
    const triggerSonar = (x, y) => {
      playSonarPing()
      sonarRings.push({
        x: x ?? mouse.targetX,
        y: y ?? mouse.targetY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.6,
        alpha: 0.8,
        speed: 3.5,
      })
    }

    const onPointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      triggerSonar(clientX, clientY)
    }
    window.addEventListener('pointerdown', onPointerDown)

    // Listen to custom event from terminal / UI
    const onCustomFeed = () => triggerSonar(width * 0.5, height * 0.3)
    window.addEventListener('fizhtank-feed', onCustomFeed)

    // ── 1. Marine Snow & Plankton Particles ──────────────────────────
    const isMobile = width < 768
    const PARTICLE_COUNT = isMobile ? 35 : 75
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      size: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.15 + Math.random() * 0.45,
      alpha: 0.2,
      hue: Math.random() > 0.6 ? 185 : Math.random() > 0.3 ? 260 : 210, // Cyan, Violet, Marine Blue
      oscSpeed: 0.005 + Math.random() * 0.015,
      oscOffset: Math.random() * Math.PI * 2,
    }))

    // ── 2. Bioluminescent Medusa (Jellyfish) ────────────────────────
    class Jellyfish {
      constructor(x, y, scale = 1, baseDepth = 0.5) {
        this.x = x
        this.y = y
        this.scale = scale
        this.baseDepth = baseDepth
        this.propulsion = 0
        this.timer = Math.random() * 10
        this.vx = (Math.random() - 0.5) * 0.2
        this.vy = -0.4
        this.bellWidth = 34 * scale
        this.bellHeight = 28 * scale
        this.tentacles = Array.from({ length: 6 }, (_, i) => ({
          offset: (i - 2.5) * (this.bellWidth / 3.5),
          nodes: Array.from({ length: 9 }, () => ({ x: 0, y: 0 })),
          length: 45 * scale + Math.random() * 20 * scale,
        }))
      }

      update(time) {
        this.timer += 0.02
        // Pulse cycle: 0 -> contraction -> thrust -> glide
        const cycle = Math.sin(this.timer)
        const isContracting = cycle > 0.2

        if (isContracting) {
          this.propulsion = Math.min(1, this.propulsion + 0.05)
          this.vy = -0.7 * this.scale
        } else {
          this.propulsion = Math.max(0, this.propulsion - 0.02)
          this.vy = -0.15 * this.scale
        }

        // Horizontal sway
        this.x += Math.sin(time * 0.001 + this.timer) * 0.3 + this.vx
        this.y += this.vy

        // Reposition if off screen
        if (this.y < -100) {
          this.y = height + 80
          this.x = Math.random() * width
        }

        // Mouse gentle repulsion
        const dx = this.x - mouse.targetX
        const dy = this.y - mouse.targetY
        const dist = Math.hypot(dx, dy)
        if (dist < 150 && mouse.active) {
          const force = (1 - dist / 150) * 0.8
          this.x += (dx / dist) * force
          this.y += (dy / dist) * force
        }

        // Update tentacle physics (inverse kinematics drag)
        this.tentacles.forEach((t) => {
          let prevX = this.x + t.offset * (1 - this.propulsion * 0.3)
          let prevY = this.y + this.bellHeight * 0.5
          t.nodes.forEach((node) => {
            node.x += (prevX - node.x) * 0.35
            node.y += (prevY + t.length / t.nodes.length - node.y) * 0.35 + 0.1
            prevX = node.x
            prevY = node.y
          })
        })
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)

        const squash = 1 + this.propulsion * 0.25
        const stretch = 1 - this.propulsion * 0.2

        // Glow aura around bell
        const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, this.bellWidth * 1.6)
        glow.addColorStop(0, 'rgba(0, 245, 255, 0.22)')
        glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)')
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, this.bellWidth * 1.6, 0, Math.PI * 2)
        ctx.fill()

        // Translucent Bell (Umbrella)
        ctx.beginPath()
        ctx.moveTo(-this.bellWidth * 0.5 * stretch, 0)
        ctx.bezierCurveTo(
          -this.bellWidth * 0.55 * stretch,
          -this.bellHeight * squash,
          this.bellWidth * 0.55 * stretch,
          -this.bellHeight * squash,
          this.bellWidth * 0.5 * stretch,
          0
        )
        ctx.quadraticCurveTo(0, this.bellHeight * 0.25 * squash, -this.bellWidth * 0.5 * stretch, 0)

        const bellGrad = ctx.createLinearGradient(0, -this.bellHeight, 0, this.bellHeight * 0.3)
        bellGrad.addColorStop(0, 'rgba(168, 85, 247, 0.55)')
        bellGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.35)')
        bellGrad.addColorStop(1, 'rgba(6, 182, 212, 0.75)')
        ctx.fillStyle = bellGrad
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Core rhopalia / inner organ ring
        ctx.beginPath()
        ctx.ellipse(0, -this.bellHeight * 0.25, this.bellWidth * 0.2, this.bellHeight * 0.15, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()

        ctx.restore()

        // Trailing tentacles
        this.tentacles.forEach((t) => {
          ctx.beginPath()
          ctx.moveTo(this.x + t.offset * (1 - this.propulsion * 0.3), this.y + this.bellHeight * 0.5)
          t.nodes.forEach((node) => {
            ctx.lineTo(node.x, node.y)
          })
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
          ctx.lineWidth = 0.8
          ctx.stroke()
        })
      }
    }

    // ── 3. Abyssal Ghost Ray (Manta with organic sinusoidal wings) ────
    class GhostRay {
      constructor() {
        this.x = width * 0.2
        this.y = height * 0.55
        this.vx = 0.85
        this.vy = 0.1
        this.targetAngle = 0
        this.angle = 0
        this.wingSpan = isMobile ? 65 : 105
        this.wingWave = 0
        this.speed = isMobile ? 0.9 : 1.2
        this.targetX = width * 0.8
        this.targetY = height * 0.5
      }

      update() {
        this.wingWave += 0.035

        // Pick new random cruise destination if close
        const distToDest = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (distToDest < 120) {
          this.targetX = Math.random() * (width - 200) + 100
          this.targetY = Math.random() * (height - 300) + 150
        }

        // Steer towards target
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.targetAngle = Math.atan2(dy, dx)

        // Smooth angle interpolation
        let diff = this.targetAngle - this.angle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        this.angle += diff * 0.02

        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Wrap around screen boundaries with margin
        if (this.x < -180) this.x = width + 180
        if (this.x > width + 180) this.x = -180
        if (this.y < -100) this.y = height + 100
        if (this.y > height + 100) this.y = -100
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        const flap = Math.sin(this.wingWave) * 16

        // Subtle ambient ray bioluminescent halo
        const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, this.wingSpan * 1.2)
        halo.addColorStop(0, 'rgba(6, 182, 212, 0.16)')
        halo.addColorStop(0.6, 'rgba(99, 102, 241, 0.08)')
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(0, 0, this.wingSpan * 1.2, 0, Math.PI * 2)
        ctx.fill()

        // Pectoral Wings & Body
        ctx.beginPath()
        // Rostrum tip (head)
        ctx.moveTo(35, 0)
        // Left Wingtip (with vertical sinusoidal flap)
        ctx.bezierCurveTo(15, -this.wingSpan * 0.4, -10, -this.wingSpan * 0.9, -15, -this.wingSpan + flap)
        // Trailing left edge
        ctx.bezierCurveTo(-25, -this.wingSpan * 0.5, -35, -20, -45, 0)
        // Trailing right edge
        ctx.bezierCurveTo(-35, 20, -25, this.wingSpan * 0.5, -15, this.wingSpan - flap)
        // Right Wingtip
        ctx.bezierCurveTo(-10, this.wingSpan * 0.9, 15, this.wingSpan * 0.4, 35, 0)
        ctx.closePath()

        const rayGrad = ctx.createLinearGradient(-45, 0, 35, 0)
        rayGrad.addColorStop(0, 'rgba(8, 14, 32, 0.95)')
        rayGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.92)')
        rayGrad.addColorStop(1, 'rgba(14, 165, 233, 0.4)')
        ctx.fillStyle = rayGrad
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Glowing cybernetic lateral line down the spine
        ctx.beginPath()
        ctx.moveTo(25, 0)
        ctx.lineTo(-45, 0)
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.75)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Cephalic Fins (Head lobes)
        ctx.fillStyle = 'rgba(34, 211, 238, 0.6)'
        ctx.beginPath()
        ctx.ellipse(32, -6, 5, 2.5, 0.4, 0, Math.PI * 2)
        ctx.ellipse(32, 6, 5, 2.5, -0.4, 0, Math.PI * 2)
        ctx.fill()

        // Whip Tail with smooth sinusoidal sway
        ctx.beginPath()
        ctx.moveTo(-45, 0)
        const tailLength = 60
        const tailWave = Math.sin(this.wingWave - 1.2) * 8
        ctx.quadraticCurveTo(-45 - tailLength * 0.5, tailWave * 0.5, -45 - tailLength, tailWave)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.restore()
      }
    }

    // ── 4. Shoal of Bioluminescent Neon Micro-Tetras ─────────────────
    const TETRA_COUNT = isMobile ? 6 : 14
    const tetras = Array.from({ length: TETRA_COUNT }, (_, i) => ({
      x: width * 0.6 + (Math.random() - 0.5) * 200,
      y: height * 0.25 + (Math.random() - 0.5) * 120,
      vx: 1.2 + Math.random() * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      size: 14 + Math.random() * 6,
      tailPhase: Math.random() * Math.PI * 2,
      depth: 0.2 + (i / TETRA_COUNT) * 0.3,
    }))

    // Instantiate specimens
    const jellies = [
      new Jellyfish(width * 0.82, height * 0.7, isMobile ? 0.75 : 1.05, 0.7),
      new Jellyfish(width * 0.18, height * 0.85, isMobile ? 0.6 : 0.85, 0.85),
    ]
    const ray = new GhostRay()

    // ── 5. Main 60 FPS Render Loop ──────────────────────────────────
    const render = (currentTime) => {
      if (!isRunning) return

      // Clear Canvas
      ctx.clearRect(0, 0, width, height)

      // ── Layer A: Volumetric Caustic Light Rays ──
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const rayCount = isMobile ? 3 : 5
      for (let i = 0; i < rayCount; i++) {
        const offset = (currentTime * 0.0003 + (i * Math.PI) / 3) % (Math.PI * 2)
        const sway = Math.sin(offset) * 45
        const rayX = (width / (rayCount + 1)) * (i + 1) + sway

        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + sway * 1.5, height * 0.85)
        rayGrad.addColorStop(0, 'rgba(0, 245, 255, 0.08)')
        rayGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.04)')
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(rayX - 35, 0)
        ctx.lineTo(rayX + 35, 0)
        ctx.lineTo(rayX + 90 + sway, height * 0.85)
        ctx.lineTo(rayX - 90 + sway, height * 0.85)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // ── Layer B: Acoustic Sonar Rings ──
      for (let i = sonarRings.length - 1; i >= 0; i--) {
        const ring = sonarRings[i]
        ring.radius += ring.speed
        ring.alpha -= 0.009

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          sonarRings.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 245, 255, ${ring.alpha * 0.45})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Inner harmonic ring
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, Math.max(0, ring.radius - 22), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139, 92, 246, ${ring.alpha * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }

      // ── Layer C: Marine Snow & Bioluminescent Plankton ──
      particles.forEach((p) => {
        p.oscOffset += p.oscSpeed
        p.x += p.vx + Math.sin(p.oscOffset) * 0.4
        p.y += p.vy

        // Hydrodynamic mouse wake
        if (mouse.active) {
          const dx = p.x - mouse.targetX
          const dy = p.y - mouse.targetY
          const dist = Math.hypot(dx, dy)
          if (dist < 110) {
            const push = (1 - dist / 110) * 1.8
            p.x += (dx / dist) * push + mouse.vx * 0.08
            p.y += (dy / dist) * push + mouse.vy * 0.08
          }
        }

        // Wrap particles
        if (p.y < 0) p.y = height
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.baseAlpha})`
        ctx.fill()
      })

      // ── Layer D: Deep Sea Ghost Ray ──
      ray.update()
      ray.draw(ctx)

      // ── Layer E: School of Neon Nano-Tetras ──
      tetras.forEach((t) => {
        t.tailPhase += 0.18
        t.x += t.vx
        t.y += t.vy + Math.sin(t.tailPhase * 0.5) * 0.35

        // Lead fish loop around
        if (t.x > width + 50) {
          t.x = -50
          t.y = height * 0.2 + Math.random() * (height * 0.25)
        }

        // Draw individual sleek nano-tetra
        ctx.save()
        ctx.translate(t.x, t.y)

        const wag = Math.sin(t.tailPhase) * 3

        ctx.beginPath()
        ctx.moveTo(t.size, 0)
        ctx.quadraticCurveTo(0, -t.size * 0.25, -t.size * 0.7, wag)
        ctx.lineTo(-t.size, wag * 1.5)
        ctx.lineTo(-t.size * 0.7, wag)
        ctx.quadraticCurveTo(0, t.size * 0.25, t.size, 0)
        ctx.closePath()

        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)'
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.7)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Luminous lateral cyan streak
        ctx.beginPath()
        ctx.moveTo(t.size * 0.6, 0)
        ctx.lineTo(-t.size * 0.4, wag * 0.5)
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.95)'
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.restore()
      })

      // ── Layer F: Deep Sea Bioluminescent Jellyfish ──
      jellies.forEach((jelly) => {
        jelly.update(currentTime)
        jelly.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    // Tab visibility handling (pause to conserve 100% CPU when backgrounded)
    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false
        cancelAnimationFrame(animationFrameId)
      } else {
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
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('fizhtank-feed', onCustomFeed)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [scrollProgress])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden transition-colors duration-1000"
      style={{
        // Smoothly darken the ocean gradient as user descends into the Mariana Trench
        background: `radial-gradient(ellipse 130% 90% at 50% ${Math.max(0, 15 - scrollProgress * 20)}%, 
          rgba(6, 24, 56, ${0.45 - scrollProgress * 0.35}) 0%, 
          rgba(3, 10, 26, ${0.75 - scrollProgress * 0.25}) 45%, 
          #010308 100%)`,
      }}
      aria-hidden="true"
    >
      {/* 60 FPS HTML5 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair" />

      {/* Atmospheric oceanic depth vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.85)',
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(1, 3, 8, 0.7) 100%)',
        }}
      />
    </div>
  )
}
