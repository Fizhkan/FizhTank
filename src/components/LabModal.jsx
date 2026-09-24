import { useEffect } from 'react'
import { X, Target, Map, Terminal, CheckCircle2 } from 'lucide-react'

export default function LabModal({ lab, onClose }) {
  const Icon = lab.icon

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
  }
  const accent = colorMap[lab.accentColor]

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}>
              <Icon size={18} />
            </div>
            <div>
              <span className="text-xs text-zinc-500 font-mono block">{lab.category}</span>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight">{lab.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-all ml-4 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <Section icon={Target} title="Objective" iconClass="text-amber-400">
            <p className="text-zinc-300 text-sm leading-relaxed">{lab.writeup.objective}</p>
          </Section>

          {/* Topology */}
          <Section icon={Map} title="Architecture / Topology" iconClass="text-blue-400">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 relative overflow-hidden">
              {/* Decorative grid */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #8b5cf6 0, #8b5cf6 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 1px, transparent 0, transparent 50%)',
                  backgroundSize: '24px 24px',
                }}
              />
              <pre className="relative text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap">
                {lab.writeup.topology}
              </pre>
            </div>
          </Section>

          {/* Key Commands */}
          <Section icon={Terminal} title="Key Commands / Config" iconClass="text-violet-400">
            <div className="code-block">
              {lab.writeup.commands}
            </div>
          </Section>

          {/* Verification */}
          <Section icon={CheckCircle2} title="Verification Results" iconClass="text-green-400">
            <div className="space-y-2">
              {lab.writeup.verification.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-400 text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-mono text-xs">{item}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            {lab.tags.map((tag) => (
              <span key={tag} className="tech-badge">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, iconClass, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className={iconClass} />
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      {children}
    </div>
  )
}
