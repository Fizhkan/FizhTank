import { useState, useEffect } from 'react'
import { Fish, Thermometer } from 'lucide-react'
import { site } from '../data/site'

// Kartu kecil di pojok kiri bawah: tombol beri makan dan hitungan berapa kali tank sudah diberi makan.
export default function TankInfo() {
  const [fed, setFed] = useState(0)

  useEffect(() => {
    const onFed = (e) => setFed(e.detail?.count ?? 0)
    window.addEventListener('fizhtank-fed', onFed)
    return () => window.removeEventListener('fizhtank-fed', onFed)
  }, [])

  const aq = site.aquarium

  return (
    <aside
      aria-label="Info tank"
      className="pointer-events-none fixed bottom-6 left-7 z-40 hidden select-none sm:block"
    >
      <div className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2 pr-5 pl-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('fizhtank-feed'))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-[#2a1204] transition-transform active:scale-95"
          aria-label="Beri makan ikan"
          title="Beri makan ikan"
        >
          <Fish size={18} aria-hidden="true" />
        </button>

        <div className="text-sm leading-tight">
          <p className="flex items-center gap-1.5 text-foam">
            <Thermometer size={13} className="text-aqua" aria-hidden="true" />
            <span>
              {aq.waterTemp} · pH {aq.phLevel}
            </span>
          </p>
          <p className="mt-0.5 text-mist" aria-live="polite">
            {fed === 0 ? 'Belum diberi makan' : `Diberi makan ${fed}×`}
          </p>
        </div>
      </div>
    </aside>
  )
}
