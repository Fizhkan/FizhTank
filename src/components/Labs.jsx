import { useState, useRef, useCallback, lazy, Suspense } from 'react'
import { ArrowUpRight, Network, Eye, Terminal, Fish, Waves } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { labsData } from '../data/labsData'

const LabModal = lazy(() => import('./LabModal'))

const labIcons = {
  1: Network,
  2: Eye,
  3: Terminal,
}

function LabCard({ lab, onClick, visible, cardIdx }) {
  const Icon = labIcons[lab.id] || Network
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const colorMap = {
    blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400', glow: 'rgba(59,130,246,0.12)' },
    violet: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30', icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400', glow: 'rgba(139,92,246,0.12)' },
    green: { badge: 'bg-green-500/10 text-green-300 border-green-500/30', icon: 'bg-green-500/10 border-green-500/20 text-green-400', glow: 'rgba(34,197,94,0.12)' },
  }
  const colors = colorMap[lab.accentColor]

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Buka detail eksplorasi lab: ${lab.title}`}
      className="bento-card p-6 flex flex-col gap-4 cursor-pointer group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + cardIdx * 0.15}s`,
      }}
    >
      {/* Mouse-following spotlight (CSS variables, 0 React re-renders) */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: 'calc(var(--mouse-x, -999px) - 120px)',
          top: 'calc(var(--mouse-y, -999px) - 120px)',
          width: 240,
          height: 240,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          borderRadius: '50%',
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
        }}
      />

      {/* Top Row */}
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colors.icon}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const hasProof = Boolean(
              (lab.repoUrl && !lab.repoUrl.includes('[ISI') && lab.repoUrl.trim() !== '') ||
              (lab.topologyImage && !lab.topologyImage.includes('[ISI') && lab.topologyImage.trim() !== '') ||
              (lab.reportUrl && !lab.reportUrl.includes('[ISI') && lab.reportUrl.trim() !== '')
            )
            const isComplete = lab.status === 'complete' && hasProof
            const isInProgress = lab.status === 'in-progress'
            const badgeText = isComplete ? 'Complete' : isInProgress ? 'In Progress' : 'Planned'
            const badgeClasses = isComplete
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : isInProgress
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60'

            return (
              <span
                className={`text-[11.5px] px-2.5 py-0.5 rounded-full border font-mono font-medium ${badgeClasses}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.4 + cardIdx * 0.1}s`,
                }}
              >
                {badgeText}
              </span>
            )
          })()}
          <ArrowUpRight
            size={16}
            className="text-zinc-400 group-hover:text-violet-300 transition-all duration-300"
            style={{
              transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
            }}
          />
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative z-10">
        <span className="text-[12px] text-cyan-300 font-mono font-semibold tracking-wider mb-1.5 block">{lab.category}</span>
        <h3 className="font-bold text-lg sm:text-[19px] text-zinc-50 mb-2.5 group-hover:text-violet-200 transition-colors leading-snug font-display">
          {lab.title}
        </h3>
        <p className="text-[14px] text-zinc-300 leading-relaxed line-clamp-3">{lab.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/60 relative z-10">
        {lab.tags.slice(0, 4).map((tag, tagIdx) => (
          <span
            key={tag}
            className="tech-badge transition-all duration-200 hover:scale-105"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              transition: `all 0.4s ease ${0.5 + cardIdx * 0.1 + tagIdx * 0.06}s`,
            }}
          >
            {tag}
          </span>
        ))}
        {lab.tags.length > 4 && (
          <span className="tech-badge">+{lab.tags.length - 4}</span>
        )}
      </div>

      {/* CTA */}
      <button
        className="w-full text-center text-[13.5px] font-semibold text-violet-300 border border-violet-500/35 hover:bg-violet-500/15 hover:text-white rounded-lg py-2.5 transition-all mt-1 relative z-10 active:scale-[0.98] hover:border-violet-500/55 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        onClick={onClick}
      >
        {lab.status === 'planned' ? 'Lihat rencana lab →' : 'View Lab Write-up →'}
      </button>
    </div>
  )
}

export default function Labs() {
  const [selectedLab, setSelectedLab] = useState(null)
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [cardsRef, cardsVisible] = useScrollReveal({ threshold: 0.1 })
  const [methodRef, methodVisible] = useScrollReveal({ threshold: 0.2 })

  return (
    <section id="labs" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px transition-all duration-700"
              style={{
                width: headerVisible ? '32px' : '0px',
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              }}
            />
            <span className="font-mono text-sm font-semibold tracking-wide text-cyan-300">labs</span>
            <Fish size={14} style={{ color: 'rgba(167,139,250,0.7)' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
            Featured Labs
          </h2>
          <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
            Lab roadmap: eksperimen yang direncanakan dan sedang dikerjakan.
          </p>
        </div>

        {/* Bento Lab Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {labsData.map((lab, idx) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onClick={() => setSelectedLab(lab)}
              visible={cardsVisible}
              cardIdx={idx}
            />
          ))}
        </div>

        {/* Large feature card */}
        <div
          ref={methodRef}
          className="mt-6 bento-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          style={{
            opacity: methodVisible ? 1 : 0,
            transform: methodVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.7s ease 0.2s',
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Waves size={16} style={{ color: '#06b6d4' }} />
              <span className="text-[12px] font-mono font-semibold text-cyan-300 tracking-wider">// Methodology</span>
            </div>
            <h3 className="text-xl font-bold font-display text-zinc-50 mb-2">Lab Roadmap Framework</h3>
            <p className="text-zinc-300 text-[14.5px] leading-relaxed">
              Setiap lab dipersiapkan dengan alur terstruktur: Objective → Desain Topologi → Rencana Langkah → Write-up &amp; Verifikasi.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 shrink-0">
            {['📌 Define Objective', '🗺️ Map Topology', '📝 Planned Steps', '🔍 Verify & Write-up'].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2.5 text-[13.5px] text-zinc-200 font-mono font-medium"
                style={{
                  opacity: methodVisible ? 1 : 0,
                  transform: methodVisible ? 'translateX(0)' : 'translateX(20px)',
                  transition: `all 0.5s ease ${0.4 + i * 0.12}s`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
                    boxShadow: methodVisible ? `0 0 6px ${i % 2 === 0 ? 'rgba(124,58,237,0.5)' : 'rgba(6,182,212,0.5)'}` : 'none',
                  }}
                />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLab && (
        <Suspense fallback={null}>
          <LabModal lab={selectedLab} onClose={() => setSelectedLab(null)} />
        </Suspense>
      )}
    </section>
  )
}
