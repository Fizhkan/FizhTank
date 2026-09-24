import { useState } from 'react'
import { GitBranch, Link2, Mail, Send, Fish, CheckCircle2, AlertCircle } from 'lucide-react'

const socialLinks = [
  {
    icon: GitBranch,
    label: 'GitHub',
    value: 'github.com/Fizhkan',
    href: 'https://github.com/Fizhkan',
    color: 'hover:border-zinc-500/50 hover:text-zinc-200',
  },
  {
    icon: Link2,
    label: 'LinkedIn',
    value: 'linkedin.com/in/fizhtank',
    href: '#',
    color: 'hover:border-blue-500/50 hover:text-blue-300',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'fizhtank@engineer.dev',
    href: 'mailto:fizhtank@engineer.dev',
    color: 'hover:border-violet-500/50 hover:text-violet-300',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'success' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      return
    }
    // Simulate send
    setStatus('success')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus(null), 4000)
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            <span className="font-mono text-sm" style={{ color: 'rgba(6,182,212,0.7)' }}>04. contact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 section-title">
            Get In Touch
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl">
            Siap berkolaborasi, berdiskusi teknis, atau sekadar menyapa. Jangan ragu untuk reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Social Links */}
          <div className="flex flex-col gap-4">
            {socialLinks.map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bento-card p-5 flex items-center gap-4 group transition-all cursor-pointer ${color}`}
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 group-hover:border-current transition-colors">
                  <Icon size={20} className="text-zinc-400 group-hover:text-current transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono">{label}</p>
                  <p className="text-sm text-zinc-300 font-medium group-hover:text-current transition-colors">{value}</p>
                </div>
              </a>
            ))}

            {/* Availability */}
            <div className="bento-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="blink absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs text-green-400 font-mono">Available for opportunities</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Terbuka untuk posisi Network Engineer, NOC, atau Security Analyst. Full-time maupun freelance.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bento-card p-6">
            <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Send size={16} className="text-violet-400" />
              Send a Packet
            </h3>

            {status === 'success' && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <p className="text-sm text-green-300">Packet sent! I'll get back to you soon.</p>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300">Please fill in all fields before sending.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-1.5">// name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-1.5">// email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-1.5">// message</label>
                <textarea
                  className="form-input resize-none"
                  rows={4}
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] group"
              >
                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-zinc-800/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Fish size={16} className="text-violet-400" />
            <span className="text-sm text-zinc-500 font-mono">
              © 2026 <span className="text-violet-400">FizhTank</span>. All packets reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono">
            <span>Built with React + Vite</span>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>Powered by ☕ & Arch Linux</span>
          </div>
        </div>
      </div>
    </section>
  )
}
