import { useState } from 'react'
import { GitBranch, Link2, Mail, Send, Fish, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const socialLinks = [
  {
    icon: GitBranch,
    label: 'GitHub',
    value: 'github.com/Fizhkan',
    href: 'https://github.com/Fizhkan',
    color: 'hover:border-zinc-500/50 hover:text-zinc-200',
    glowColor: 'rgba(161,161,170,0.08)',
  },
  {
    icon: Link2,
    label: 'LinkedIn',
    value: 'linkedin.com/in/fizhtank',
    href: '#',
    color: 'hover:border-blue-500/50 hover:text-blue-300',
    glowColor: 'rgba(59,130,246,0.08)',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'fizhtank@engineer.dev',
    href: 'mailto:fizhtank@engineer.dev',
    color: 'hover:border-violet-500/50 hover:text-violet-300',
    glowColor: 'rgba(139,92,246,0.08)',
  },
]

// ── Bottom Kelp (anchored strictly to the bottom edge of the page) ──
const KELP_STALKS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i / 20) * 98 + (i % 3) * 0.7}%`,
  height: 45 + (i % 5) * 12,
  delay: `${(i * 0.35) % 3}s`,
  duration: `${2.5 + (i % 4) * 0.5}s`,
  opacity: 0.28 + (i % 4) * 0.08,
  swayType: i % 2 === 0 ? 'kelp-sway-left' : 'kelp-sway-right',
  hue: i % 3 === 0 ? '#059669' : i % 3 === 1 ? '#047857' : '#065f46',
}))

function BottomKelp() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: '75px', zIndex: 0 }}
      aria-hidden="true"
    >
      {/* seafloor thin edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, #021a10 0%, #042f1a 50%, #021a10 100%)',
        }}
      />
      {KELP_STALKS.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '2px',
            left: s.left,
            width: '8px',
            height: `${s.height}px`,
            background: `linear-gradient(0deg, ${s.hue} 0%, #059669 60%, #34d399 100%)`,
            borderRadius: '5px 5px 2px 2px',
            transformOrigin: 'bottom center',
            animation: `${s.swayType} ${s.duration} ease-in-out ${s.delay} infinite`,
            opacity: s.opacity,
          }}
        >
          {/* subtle leaf left */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '-7px',
              width: '10px',
              height: '6px',
              background: 'rgba(5,150,105,0.6)',
              borderRadius: '50% 0 50% 0',
              transform: 'rotate(-20deg)',
            }}
          />
          {/* subtle leaf right */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '-7px',
              width: '9px',
              height: '5px',
              background: 'rgba(4,120,87,0.5)',
              borderRadius: '0 50% 0 50%',
              transform: 'rotate(16deg)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Social Link Card ──────────────────────────────────────────
function SocialCard({ icon: Icon, label, value, href, color, glowColor, visible, idx }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`bento-card p-5 flex items-center gap-4 group transition-all cursor-pointer ${color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-25px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.12}s, border-color 0.2s, color 0.2s`,
        boxShadow: isHovered ? `0 8px 25px ${glowColor}` : '',
      }}
    >
      <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 group-hover:border-current transition-all duration-300 group-hover:scale-110">
        <Icon size={20} className="text-zinc-400 group-hover:text-current transition-colors" />
      </div>
      <div className="flex-1">
        <p className="text-[12px] text-zinc-400 font-mono font-medium">{label}</p>
        <p className="text-[14.5px] text-zinc-100 font-semibold group-hover:text-current transition-colors">{value}</p>
      </div>
      <ExternalLink
        size={14}
        className="text-zinc-400 group-hover:text-current transition-all duration-300"
        style={{
          transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
          opacity: isHovered ? 1 : 0,
        }}
      />
    </a>
  )
}

// ── Animated Form Input ──────────────────────────────────────
function AnimatedInput({ label, type = 'text', placeholder, value, onChange, rows }) {
  const [isFocused, setIsFocused] = useState(false)
  const Component = rows ? 'textarea' : 'input'

  return (
    <div className="relative">
      <label
        className="block text-[12.5px] font-mono font-medium mb-1.5 transition-colors duration-300"
        style={{ color: isFocused ? 'rgba(196,181,253,1)' : 'rgba(161,161,170,1)' }}
      >
        // {label}
      </label>
      <Component
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={rows ? { resize: 'none' } : {}}
      />
      {/* Focus indicator line */}
      <div
        className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
        style={{
          width: isFocused ? '100%' : '0%',
          left: isFocused ? '0' : '50%',
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [isSending, setIsSending] = useState(false)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [socialRef, socialVisible] = useScrollReveal({ threshold: 0.15 })
  const [formRef, formVisible] = useScrollReveal({ threshold: 0.15 })
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.3 })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      return
    }

    // Simulate send with loading animation
    setIsSending(true)
    setTimeout(() => {
      setStatus('success')
      setIsSending(false)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus(null), 4000)
    }, 1200)
  }

  return (
    <section id="contact" className="relative py-24 pb-8 px-6 overflow-hidden">
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
            <span className="font-mono text-sm font-semibold tracking-wide text-cyan-300">04. contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-zinc-50 section-title font-display">
            Get In Touch
          </h2>
          <p className="text-zinc-300 text-base sm:text-[17px] leading-relaxed mt-4 max-w-2xl font-normal">
            Siap berkolaborasi, berdiskusi teknis, atau sekadar menyapa. Jangan ragu untuk reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Social Links */}
          <div ref={socialRef} className="flex flex-col gap-4">
            {socialLinks.map(({ icon, label, value, href, color, glowColor }, idx) => (
              <SocialCard
                key={label}
                icon={icon}
                label={label}
                value={value}
                href={href}
                color={color}
                glowColor={glowColor}
                visible={socialVisible}
                idx={idx}
              />
            ))}

            {/* Availability */}
            <div
              className="bento-card p-5"
              style={{
                opacity: socialVisible ? 1 : 0,
                transform: socialVisible ? 'translateX(0)' : 'translateX(-25px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="blink absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[12.5px] text-green-300 font-mono font-semibold">Available for opportunities</span>
              </div>
              <p className="text-[14px] text-zinc-300 leading-relaxed font-normal">
                Terbuka untuk posisi Network Engineer, NOC, atau Security Analyst. Full-time maupun freelance.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            ref={formRef}
            className="bento-card p-6 relative overflow-hidden"
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'translateX(0) scale(1)' : 'translateX(25px) scale(0.98)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <h3 className="font-bold text-lg font-display text-zinc-50 mb-4 flex items-center gap-2">
              <Send size={16} className="text-violet-400" />
              Send a Packet
            </h3>

            {/* Success Toast */}
            <div
              style={{
                maxHeight: status === 'success' ? '60px' : '0',
                opacity: status === 'success' ? 1 : 0,
                marginBottom: status === 'success' ? '16px' : '0',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <p className="text-sm text-green-300 font-medium">Packet sent! I'll get back to you soon.</p>
              </div>
            </div>

            {/* Error Toast */}
            <div
              style={{
                maxHeight: status === 'error' ? '60px' : '0',
                opacity: status === 'error' ? 1 : 0,
                marginBottom: status === 'error' ? '16px' : '0',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-medium">Please fill in all fields before sending.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedInput
                label="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <AnimatedInput
                label="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <AnimatedInput
                label="message"
                placeholder="What's on your mind?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-[15px] transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] group relative overflow-hidden active:scale-[0.98] disabled:opacity-70 tracking-wide"
              >
                {/* Shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                    backgroundSize: '250% 100%',
                    animation: 'shimmer-sweep 3s ease-in-out infinite',
                  }}
                />
                {isSending ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: 'spin 0.8s linear infinite' }}
                    />
                    <span className="relative z-10">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform relative z-10" />
                    <span className="relative z-10">Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="max-w-6xl mx-auto mt-16 pt-8 border-t border-zinc-800/60 relative z-10"
        style={{
          opacity: footerVisible ? 1 : 0,
          transform: footerVisible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.6s ease',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Fish size={16} className="text-violet-400" />
            <span className="text-sm text-zinc-400 font-mono font-medium">
              © 2026 <span className="text-violet-300 font-semibold">FizhTank</span>. All packets reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-[13px] text-zinc-400 font-mono font-medium">
            <span>Built with React + Vite</span>
            <div className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>Powered by ☕ & Arch Linux</span>
          </div>
        </div>
      </div>

      {/* ── Kelp along bottom edge ── */}
      <BottomKelp />
    </section>
  )
}
