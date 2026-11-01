/**
 * Suara tank, disintesis dengan Web Audio API (tanpa file audio).
 *  - dengung lembut filter akuarium (noise coklat yang dilunakkan)
 *  - tetes air kecil saat hover dan klik
 *  - cipratan saat makanan dijatuhkan
 * Suara mati secara default dan hanya menyala setelah pengunjung menekan tombol suara.
 */

let audioCtx = null
let ambient = null
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
    if (ambient) ambient.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
  } else {
    startAmbient()
    playWaterBubble()
  }

  return !isMuted
}

export function isAudioActive() {
  return !isMuted
}

// Dengung filter: noise coklat dilewatkan low-pass, volumenya bergelombang pelan
function startAmbient() {
  const ctx = getAudioContext()
  if (!ctx) return

  if (ambient) {
    ambient.gain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.4)
    return
  }

  try {
    const length = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 520
    filter.Q.value = 0.7

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2)

    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.12
    lfoGain.gain.value = 0.012
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start()
    lfo.start()
    ambient = { gain }
  } catch (err) {
    console.warn('Web Audio ambient init error:', err)
  }
}

// Tetes air kecil
export function playWaterBubble() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const now = ctx.currentTime

    osc.type = 'sine'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  } catch {
    /* audio tidak tersedia, abaikan */
  }
}

// Cipratan saat makanan jatuh ke permukaan
export function playFeedSplash() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18)
    oscGain.gain.setValueAtTime(0.07, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.24)

    const size = Math.floor(ctx.sampleRate * 0.12)
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1800
    const nGain = ctx.createGain()
    nGain.gain.value = 0.05
    noise.connect(hp)
    hp.connect(nGain)
    nGain.connect(ctx.destination)
    noise.start(now)
  } catch {
    /* audio tidak tersedia, abaikan */
  }
}
