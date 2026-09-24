import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Labs from './components/Labs'
import Contact from './components/Contact'

function App() {
  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Scanline ambient effect */}
      <div className="scan-line" aria-hidden="true" />

      {/* Fixed background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.12), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Skills />
        <Labs />
        <Contact />
      </div>
    </div>
  )
}

export default App
