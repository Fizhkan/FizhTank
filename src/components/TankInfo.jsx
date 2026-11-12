import { useState, useEffect, useRef } from 'react'
import { Fish, Thermometer } from 'lucide-react'
import { site } from '../data/site'

function getOceanZone(meters) {
  if (meters < 110) return 'PERMUKAAN'
  if (meters < 240) return 'MESOPELAGIK'
  if (meters < 390) return 'BATIPELAGIK'
  return 'ABISAL'
}

// HUD telemetri tangki & kedalaman air: merespons posisi scroll (0m - 500m) dan tombol beri makan ikan.
export default function TankInfo() {
  const [fed, setFed] = useState(0)
  const [depth, setDepth] = useState(0)
  const meterBarRef = useRef(null)
  const pipRef = useRef(null)

  useEffect(() => {
    const onFed = (e) => setFed(e.detail?.count ?? 0)
    window.addEventListener('fizhtank-fed', onFed)
    return () => window.removeEventListener('fizhtank-fed', onFed)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    let rafId = null

    const updateDepth = () => {
      const doc = document.documentElement
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll))
      const meters = Math.round(ratio * 500)
      setDepth(meters)
      if (meterBarRef.current) {
        meterBarRef.current.style.transform = `scaleY(${ratio})`
      }
      if (pipRef.current) {
        pipRef.current.style.transform = `translateY(${ratio * 160}px)`
      }
      rafId = null
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateDepth)
    }

    updateDepth()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  const aq = site.aquarium
  const zone = getOceanZone(depth)

  return (
    <>
      {/* Kartu Telemetri Kiri Bawah */}
      <aside
        aria-label="Telemetri tank dan kedalaman"
        className="pointer-events-none fixed bottom-5 left-6 z-40 hidden select-none sm:block"
      >
        <div className="specimen-panel reticle pointer-events-auto flex items-center gap-3.5 py-2 pr-4 pl-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('fizhtank-feed'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-coral text-[#1f0a02] transition-transform duration-150 active:scale-[0.95]"
            aria-label="Beri makan ikan"
            title="Beri makan ikan"
          >
            <Fish size={18} aria-hidden="true" />
          </button>

          <div className="font-mono text-[0.6875rem] leading-tight">
            <p className="flex items-center gap-2 text-foam">
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-65" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
              </span>
              <span className="text-aqua">{String(depth).padStart(3, '0')}M</span>
              <span className="text-aqua/35" aria-hidden="true">·</span>
              <span className="tracking-wider text-sand">{zone}</span>
            </p>
            <p className="mt-1 flex items-center gap-2 text-mist" aria-live="polite">
              <span className="inline-flex items-center gap-1">
                <Thermometer size={11} className="text-aqua" aria-hidden="true" />
                {aq.waterTemp}
              </span>
              <span className="text-aqua/30" aria-hidden="true">/</span>
              <span>pH {aq.phLevel}</span>
              <span className="text-aqua/30" aria-hidden="true">/</span>
              <span className={fed > 0 ? 'text-coral-text' : ''}>
                {fed === 0 ? 'PAKAN 0×' : `PAKAN ${fed}×`}
              </span>
            </p>
          </div>
        </div>
      </aside>

      {/* Pengukur Kedalaman Vertikal Minimalis (Desktop) */}
      <aside
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 right-3.5 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 select-none lg:flex xl:right-5"
      >
        <span className="font-mono text-[0.625rem] tracking-widest text-aqua/85">0M</span>
        <div className="relative h-40 w-[3px] bg-aqua/15">
          <div className="pointer-events-none absolute top-0 right-1.5 flex h-full flex-col justify-between">
            <span className="block h-px w-2 bg-aqua/30" />
            <span className="block h-px w-1.5 bg-aqua/20" />
            <span className="block h-px w-2.5 bg-aqua/35" />
            <span className="block h-px w-1.5 bg-aqua/20" />
            <span className="block h-px w-2 bg-aqua/30" />
          </div>
          <div
            ref={meterBarRef}
            className="h-full w-full origin-top bg-aqua/80 transition-none"
            style={{ transform: 'scaleY(0)' }}
          />
          <span
            ref={pipRef}
            className="absolute -top-1 -left-[3px] h-2 w-[9px] rounded-[1px] bg-coral shadow-[0_0_8px_rgba(255,138,76,0.7)] transition-none"
            style={{ transform: 'translateY(0px)' }}
          />
        </div>
        <span className="font-mono text-[0.625rem] tracking-widest text-mist/70">500M</span>
      </aside>
    </>
  )
}
