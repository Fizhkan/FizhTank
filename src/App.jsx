import { useEffect } from 'react'
import './index.css'
import AquariumBackground from './components/AquariumBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Labs from './components/Labs'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import DepthMeter from './components/DepthMeter'
import { site } from './data/site'

function App() {
  useEffect(() => {
    if (typeof document !== 'undefined' && site.title) {
      document.title = site.title
    }
  }, [])
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#04060f' }}>
      {/* ── Full-screen aquarium world ── */}
      <AquariumBackground />

      {/* ── Skip Link for Keyboard Accessibility ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-mono focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Lewati ke konten
      </a>

      {/* ── Content layers ── */}
      <div className="relative z-10 flex flex-col justify-between">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Hero />
          {/* Wave divider */}
          <div className="wave-divider" aria-hidden="true" />
          <Skills />
          <div className="wave-divider" aria-hidden="true" />
          <Labs />
          <div className="wave-divider" aria-hidden="true" />
          <Certifications />
          <div className="wave-divider" aria-hidden="true" />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* ── Interactive Depth Gauge HUD & Scroll-to-top ── */}
      <DepthMeter />
      <ScrollToTop />
    </div>
  )
}

export default App
