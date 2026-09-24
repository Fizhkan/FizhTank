import './index.css'
import AquariumBackground from './components/AquariumBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Labs from './components/Labs'
import Contact from './components/Contact'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#04060f' }}>
      {/* ── Full-screen aquarium world ── */}
      <AquariumBackground />

      {/* ── Content layers ── */}
      <div className="relative z-10 flex flex-col justify-between">
        <Navbar />
        <Hero />
        {/* Wave divider */}
        <div className="wave-divider" aria-hidden="true" />
        <Skills />
        <div className="wave-divider" aria-hidden="true" />
        <Labs />
        <div className="wave-divider" aria-hidden="true" />
        <Contact />
      </div>
    </div>
  )
}

export default App
