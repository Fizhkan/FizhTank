import { useEffect } from 'react'
import OceanariumScene from './components/OceanariumScene'
import AquariumCanvas from './components/AquariumCanvas'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Labs from './components/Labs'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import DepthMeter from './components/DepthMeter'
import ErrorBoundary from './components/ErrorBoundary'
import { site } from './data/site'

function App() {
  useEffect(() => {
    if (typeof document !== 'undefined' && site.title) {
      document.title = site.title
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-[#010308] text-slate-100 overflow-x-hidden selection:bg-cyan-400 selection:text-slate-950">
        {/* ── Magnetic Awwwards Custom Cursor ── */}
        <CustomCursor />

        {/* ── Layer 1: Three.js 3D Bioluminescent WebGL Scene ── */}
        <OceanariumScene />

        {/* ── Layer 2: 60 FPS Hydrodynamic Oceanic Caustics Canvas ── */}
        <AquariumCanvas />

        {/* ── Accessible Skip Link ── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-slate-950 focus:font-mono focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
        >
          Lewati ke konten utama
        </a>

        {/* ── Foreground Layout Layers ── */}
        <div className="relative z-10 flex flex-col justify-between min-h-screen">
          <Navbar />

          <main id="main-content" tabIndex={-1} className="outline-none">
            <Hero />

            {/* Architectural Section Divider */}
            <div className="max-w-7xl mx-auto px-6" aria-hidden="true">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Labs />

            <div className="max-w-7xl mx-auto px-6" aria-hidden="true">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Skills />

            <div className="max-w-7xl mx-auto px-6" aria-hidden="true">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Certifications />

            <div className="max-w-7xl mx-auto px-6" aria-hidden="true">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Contact />
          </main>

          <Footer />
        </div>

        {/* ── Surgical Ocean Telemetry HUD ── */}
        <DepthMeter />
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  )
}

export default App
