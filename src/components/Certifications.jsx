import { useState } from 'react'
import { Calendar, CheckCircle2, Clock, Download, ExternalLink } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { certificationsTimeline, cvDownloadConfig } from '../data/certificationsData'

export default function Certifications() {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [timelineRef, timelineVisible] = useScrollReveal({ threshold: 0.1 })
  const [cvNotification, setCvNotification] = useState(false)

  const handleDownloadCv = (e) => {
    if (!cvDownloadConfig.available) {
      e.preventDefault()
      setCvNotification(true)
      setTimeout(() => setCvNotification(false), 5000)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return {
          icon: CheckCircle2,
          text: 'Verified / Completed',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        }
      case 'In Progress':
        return {
          icon: Clock,
          text: 'In Progress / Target',
          classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        }
      default:
        return {
          icon: Calendar,
          text: 'Roadmap / Planned',
          classes: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
        }
    }
  }

  return (
    <section id="certifications" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-px transition-all duration-700"
                style={{
                  width: headerVisible ? '32px' : '0px',
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                }}
              />
              <span className="font-mono text-sm font-semibold tracking-wide text-cyan-300">
                04. credentials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
              Certifications &amp; Progress
            </h2>
            <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
              Continuous Learning — roadmap kualifikasi formal, sertifikasi vendor, dan pencapaian kompetensi jaringan.
            </p>
          </div>

          {/* Download CV Button Banner */}
          <div className="shrink-0 flex flex-col items-start md:items-end">
            <a
              href={cvDownloadConfig.filePath}
              download={cvDownloadConfig.fileName}
              onClick={handleDownloadCv}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-sm font-semibold transition-all duration-300 shadow-lg group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.85))',
                boxShadow: '0 0 25px rgba(124,58,237,0.25)',
              }}
            >
              <Download size={16} className="text-white group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-white">Download CV (PDF)</span>
            </a>
            <span className="text-[11.5px] text-zinc-400 font-mono mt-2">
              Update: {cvDownloadConfig.lastUpdated}
            </span>

            {/* Notification popup when cv.pdf is in placeholder mode */}
            {cvNotification && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono max-w-xs animate-in fade-in duration-300">
                ⚠️ File CV masih menggunakan placeholder. Silakan letakkan file resume Anda di <code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">public/cv.pdf</code>.
              </div>
            )}
          </div>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative pl-6 sm:pl-8 border-l border-violet-500/20 space-y-8 ml-2 sm:ml-4">
          {certificationsTimeline.map((item, idx) => {
            const statusConfig = getStatusBadge(item.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={item.id}
                className="relative group/cert"
                style={{
                  opacity: timelineVisible ? 1 : 0,
                  transform: timelineVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.6s ease ${0.15 + idx * 0.15}s`,
                }}
              >
                {/* Timeline node dot */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover/cert:scale-125"
                  style={{
                    backgroundColor: item.status === 'Completed' ? '#10b981' : item.status === 'In Progress' ? '#06b6d4' : '#8b5cf6',
                    borderColor: '#04060f',
                    boxShadow: `0 0 10px ${item.status === 'Completed' ? 'rgba(16,185,129,0.5)' : 'rgba(6,182,212,0.5)'}`,
                  }}
                />

                {/* Card Container */}
                <div className="bento-card p-6 rounded-2xl relative overflow-hidden group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${statusConfig.classes}`}>
                          <StatusIcon size={12} />
                          {statusConfig.text}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {item.issueDate}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold font-display text-zinc-50 group-hover/cert:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-mono text-zinc-300 mt-1">
                        Penerbit: <span className="text-violet-300 font-medium">{item.issuer}</span>
                      </p>
                    </div>

                    {item.credentialUrl && item.credentialUrl.startsWith('http') && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/60 text-xs font-mono text-zinc-300 hover:text-white hover:border-cyan-400 transition-colors shrink-0"
                      >
                        <ExternalLink size={12} />
                        <span>Verifikasi</span>
                      </a>
                    )}
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Progress Bar for In Progress / Planned certs */}
                  {item.status !== 'Completed' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1.5">
                        <span>Persiapan &amp; Target Materi</span>
                        <span className="text-cyan-300 font-semibold">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.progressPercent}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Skills Covered Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/80">
                    {item.skills.map((skill) => (
                      <span key={skill} className="tech-badge text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
