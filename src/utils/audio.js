/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FIZHTANK — PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS)
 * ══════════════════════════════════════════════════════════════════════════════
 * Uses Web Audio API to synthesize subtle, high-end, organic oceanic sounds:
 * 1. Ambient deep-sea drone (sub-bass low-pass filtered hum)
 * 2. Water droplet / acoustic click chime on hover & tap
 * 3. Sonar acoustic ping for radar interactions
 * ══════════════════════════════════════════════════════════════════════════════
 */

let audioCtx = null
let ambientDroneNode = null
let ambientGainNode = null
let isMuted = true

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function toggleAudio() {
  const ctx = getAudioContext()
  if (!ctx) return false

  isMuted = !isMuted

  if (isMuted) {
    if (ambientGainNode) {
      ambientGainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
    }
  } else {
    startAmbientDrone()
    playWaterBubble()
  }

  return !isMuted
}

export function isAudioActive() {
  return !isMuted
}

// 1. Ambient Deep-Sea Sub-Bass Drone
function startAmbientDrone() {
  const ctx = getAudioContext()
  if (!ctx || ambientDroneNode) return

  try {
    // Low frequency ocean hum (52 Hz & 78 Hz harmonic)
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    ambientGainNode = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(52, ctx.currentTime)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(78, ctx.currentTime)

    // Low pass filter to create deep ocean resonance
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(120, ctx.currentTime)
    filter.Q.setValueAtTime(3, ctx.currentTime)

    ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    ambientGainNode.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(ambientGainNode)
    ambientGainNode.connect(ctx.destination)

    osc1.start()
    osc2.start()

    ambientDroneNode = { osc1, osc2 }
  } catch (err) {
    console.warn('Web Audio drone init error:', err)
  }
}

// 2. Synthesized Water Droplet / Crisp Acoustic Chime
export function playWaterBubble() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const now = ctx.currentTime
    // Pitch sweep mimicking water droplet tension
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  } catch {}
}

// 3. Acoustic Sonar Ping
export function playSonarPing() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const now = ctx.currentTime
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.4)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.85)
  } catch {}
}
