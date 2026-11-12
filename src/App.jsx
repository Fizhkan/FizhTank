import { useEffect, useState } from 'react'
import { MotionConfig, motion } from 'motion/react'
import AquariumCanvas from './components/AquariumCanvas'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Labs from './components/Labs'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import { site } from './data/site'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined' && site.title) {
      document.title = site.title
    }
  }, [])

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen overflow-x-clip bg-deep text-foam selection:bg-aqua/40 selection:text-white">
          <AquariumCanvas />

          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-coral focus:px-4 focus:py-2 focus:font-semibold focus:text-[#2a1204] focus:outline-none"
          >
            Lewati ke konten utama
          </a>

          <div className="relative z-10 flex min-h-screen flex-col justify-between">
            <Navbar />

            {/* Dorong & redupkan lapisan latar belakang saat modal lab aktif (depth hierarchy) */}
            <motion.div
              animate={{
                transform: modalOpen ? 'scale(0.985)' : 'scale(1)',
                opacity: modalOpen ? 0.72 : 1,
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.36 }}
              className="origin-top"
            >
              <main id="main-content" tabIndex={-1} className="outline-none">
                <Hero />
                <Labs onModalOpenChange={setModalOpen} />
                <Skills />
                <Certifications />
                <Contact />
              </main>

              <Footer />
            </motion.div>
          </div>

          <div className="tank-frame" aria-hidden="true" />
          <ScrollToTop />
        </div>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
