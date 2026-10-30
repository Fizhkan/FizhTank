import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FIZHTANK — THREE.JS WEBGL DEEP-SEA PARTICLE & CAUSTIC ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * Built for 60 FPS performance:
 * - 3D Bioluminescent particle cloud with procedural fluid drag & turbulence
 * - Interactive 3D mouse repulsion & hydro-acoustic pressure field
 * - Click-triggered 3D acoustic shockwave ripple
 * - Scroll-depth color grading & camera descent
 * ══════════════════════════════════════════════════════════════════════════════
 */

export default function OceanariumScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    let width = window.innerWidth
    let height = window.innerHeight

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x020408, 0.0018)

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000)
    camera.position.z = 240

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    container.appendChild(renderer.domElement)

    // 2. 3D Bioluminescent Organism Particle System
    const isMobile = width < 768
    const PARTICLE_COUNT = isMobile ? 180 : 420
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const scales = new Float32Array(PARTICLE_COUNT)

    // Palette: Cyan (#00f5ff), Deep Marine (#0284c7), Bioluminescent Violet (#8b5cf6), White Pearl (#f8fafc)
    const colorChoices = [
      new THREE.Color(0x00f5ff),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xffffff),
    ]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 360
      const y = (Math.random() - 0.5) * 260
      const z = (Math.random() - 0.5) * 180

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = 0.08 + Math.random() * 0.15
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      scales[i] = 1.2 + Math.random() * 2.8
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Create a circular glowing sprite texture in memory
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(34, 211, 238, 0.8)')
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: isMobile ? 4.5 : 6.0,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // 3. Acoustic Sonar Rings in 3D
    const ringGeo = new THREE.RingGeometry(1, 2, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const sonarMesh = new THREE.Mesh(ringGeo, ringMat)
    sonarMesh.position.z = 20
    scene.add(sonarMesh)
    let sonarActive = false
    let sonarRadius = 1
    let sonarAlpha = 0

    const triggerSonar3D = (worldX = 0, worldY = 0) => {
      sonarMesh.position.x = worldX
      sonarMesh.position.y = worldY
      sonarRadius = 2
      sonarAlpha = 0.9
      sonarActive = true
    }

    // 4. Mouse Tracking in 3D Space
    const mouse3D = new THREE.Vector3(0, 0, 0)
    const mouseTarget = new THREE.Vector2(0, 0)
    let isMouseActive = false

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouseTarget.x = (clientX / width) * 2 - 1
      mouseTarget.y = -(clientY / height) * 2 + 1
      isMouseActive = true
    }

    const onPointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const clickX = ((clientX / width) * 2 - 1) * 120
      const clickY = (-(clientY / height) * 2 + 1) * 80
      triggerSonar3D(clickX, clickY)
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)

    const onCustomFeed = () => triggerSonar3D(0, 0)
    window.addEventListener('fizhtank-feed', onCustomFeed)

    // 5. Scroll Depth Navigation
    let scrollDepth = 0
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollDepth = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // 6. Window Resize
    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // 7. Render Loop (60 FPS with Visibility Throttling)
    let animationFrameId
    let isRunning = true
    let clock = new THREE.Clock()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = () => {
      if (!isRunning) return

      const elapsedTime = clock.getElapsedTime()
      const pos = geometry.attributes.position.array

      if (!prefersReducedMotion) {
        // Smooth camera interpolation based on mouse & scroll depth
        camera.position.x += (mouseTarget.x * 25 - camera.position.x) * 0.04
        camera.position.y += (-mouseTarget.y * 18 - scrollDepth * 80 - camera.position.y) * 0.04
        camera.lookAt(0, -scrollDepth * 40, 0)

        // Project mouse target to rough 3D coordinates
        mouse3D.set(mouseTarget.x * 140, mouseTarget.y * 90, 0)
      } else {
        camera.position.set(0, 0, 240)
        camera.lookAt(0, 0, 0)
      }

      // Animate Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        // Hydrodynamic buoyancy drift
        pos[i3 + 1] += velocities[i3 + 1]
        pos[i3] += Math.sin(elapsedTime * 0.8 + i) * 0.12
        pos[i3 + 2] += Math.cos(elapsedTime * 0.6 + i) * 0.08

        // Mouse fluid repulsion
        if (isMouseActive) {
          const dx = pos[i3] - mouse3D.x
          const dy = pos[i3 + 1] - mouse3D.y
          const dist = Math.hypot(dx, dy)
          if (dist < 45) {
            const force = (1 - dist / 45) * 1.4
            pos[i3] += (dx / dist) * force
            pos[i3 + 1] += (dy / dist) * force
          }
        }

        // Sonar blast wave interaction
        if (sonarActive) {
          const dx = pos[i3] - sonarMesh.position.x
          const dy = pos[i3 + 1] - sonarMesh.position.y
          const dist = Math.hypot(dx, dy)
          if (Math.abs(dist - sonarRadius) < 12) {
            pos[i3] += (dx / dist) * 1.2
            pos[i3 + 1] += (dy / dist) * 1.2
          }
        }

        // Loop boundaries in 3D
        if (pos[i3 + 1] > 130) pos[i3 + 1] = -130
        if (pos[i3] > 180) pos[i3] = -180
        if (pos[i3] < -180) pos[i3] = 180
      }

      geometry.attributes.position.needsUpdate = true

      // Animate 3D Sonar Mesh
      if (sonarActive) {
        sonarRadius += 3.2
        sonarAlpha -= 0.015
        sonarMesh.scale.set(sonarRadius, sonarRadius, 1)
        ringMat.opacity = Math.max(0, sonarAlpha * 0.6)

        if (sonarAlpha <= 0 || sonarRadius > 140) {
          sonarActive = false
        }
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false
        cancelAnimationFrame(animationFrameId)
      } else {
        isRunning = true
        clock.start()
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      isRunning = false
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('fizhtank-feed', onCustomFeed)
      document.removeEventListener('visibilitychange', handleVisibility)

      // Dispose Three.js objects cleanly
      geometry.dispose()
      material.dispose()
      texture.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    />
  )
}
