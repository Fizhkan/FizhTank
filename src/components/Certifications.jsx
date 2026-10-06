import { Calendar, CheckCircle2, Clock, Download } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { site } from '../data/site'

export default function Certifications() {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [timelineRef, timelineVisible] = useScrollReveal({ threshold: 0.1 })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Selesai':
        return {
          icon: CheckCircle2,
          text: 'Verified / Completed',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dotColor: '#10b981',
          dotGlow: 'rgba(16,185,129,0.5)',
        }
      case 'In Progress':
      case 'Sedang Berjalan':
        return {
          icon: Clock,
          text: 'In Progress / Target',
          classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dotColor: '#06b6d4',
          dotGlow: 'rgba(6,182,212,0.5)',
        }
      default:
        return {
          icon: Calendar,
          text: 'Roadmap / Planned',
          classes: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
          dotColor: '#8b5cf6',
          dotGlow: 'rgba(139,92,246,0.5)',
        }
    }
  }

  // Render bersyarat: hanya sertifikasi yang nama-nya terisi & bukan placeholder
  const activeCertifications = (site.certifications || []).filter((cert) => {
    const name = cert.name || cert.nama
    return Boolean(name && name.trim() !== '' && !name.includes('[ISI'))
  })

  const hasCv = Boolean(site.cvUrl && site.cvUrl.trim() !== '' && !site.cvUrl.includes('[ISI'))

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
                credentials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
              Certifications &amp; Progress
            </h2>
            <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
              Continuous Learning — roadmap kualifikasi formal, sertifikasi vendor, dan pencapaian kompetensi jaringan.
            </p>
          </div>

          {/* Render bersyarat: tombol CV hanya jika cvUrl terisi */}
          {hasCv && (
            <div className="shrink-0 flex flex-col items-start md:items-end">
              <a
                href={site.cvUrl}
                download="CV_Siraj.pdf"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-sm font-semibold transition-all duration-300 shadow-lg group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.85))',
                  boxShadow: '0 0 25px rgba(124,58,237,0.25)',
                }}
              >
                <Download size={16} className="text-white group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-white">Download CV (PDF)</span>
              </a>
            </div>
          )}
        </div>

        {/* Content: Timeline atau Empty State tanpa placeholder */}
        {activeCertifications.length > 0 ? (
          <ol ref={timelineRef} className="relative pl-6 sm:pl-8 border-l border-violet-500/20 space-y-8 ml-2 sm:ml-4 list-none">
            {activeCertifications.map((item, idx) => {
              const statusConfig = getStatusBadge(item.status)
              const StatusIcon = statusConfig.icon
              const certName = item.name || item.nama
              const certIssuer = item.issuer || item.penerbit
              const certDate = item.date || item.tanggal

              return (
                <li
                  key={idx}
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
                      backgroundColor: statusConfig.dotColor,
                      borderColor: '#04060f',
                      boxShadow: `0 0 10px ${statusConfig.dotGlow}`,
                    }}
                  />

                  {/* Card Container */}
                  <div className="bento-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${statusConfig.classes}`}>
                            <StatusIcon size={12} />
                            {statusConfig.text}
                          </span>
                          {certDate && (
                            <span className="text-xs font-mono text-zinc-400">
                              {certDate}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold font-display text-zinc-50 group-hover/cert:text-cyan-300 transition-colors">
                          {certName}
                        </h3>
                        {certIssuer && (
                          <p className="text-sm font-mono text-zinc-300 mt-1">
                            Penerbit: <span className="text-violet-300 font-medium">{certIssuer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        ) : (
          <div
            ref={timelineRef}
            className="bento-card p-8 rounded-2xl border border-violet-500/20 text-center max-w-xl mx-auto"
            style={{
              opacity: timelineVisible ? 1 : 0,
              transform: timelineVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold font-display text-zinc-100 mb-2">
              Roadmap Kualifikasi Aktif
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              Saat ini berfokus pada pendalaman kurikulum, penguasaan administrasi Linux, dan penyelesaian lab praktikum sebelum mengambil sertifikasi industri formal.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
