import { useState } from 'react'
import { GitBranch, Link2, Mail, Send, Fish, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { socialLinks, contactConfig } from '../data/contactData'

const iconMap = {
  GitHub: GitBranch,
  LinkedIn: Link2,
  'Email Langsung': Mail,
  Email: Mail,
}

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
function SocialCard({ label, value, href, color, glowColor, visible, idx }) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = iconMap[label] || Link2

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bento-card p-5 flex items-center gap-4 group transition-all cursor-pointer border border-zinc-800 hover:border-cyan-500/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-25px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.12}s, border-color 0.2s, color 0.2s`,
        boxShadow: isHovered ? `0 8px 25px ${glowColor}` : '',
      }}
    >
      <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 group-hover:border-current transition-all duration-300 group-hover:scale-110" style={{ color }}>
        <Icon size={20} className="transition-colors" />
      </div>
      <div className="flex-1">
        <p className="text-[12px] text-zinc-400 font-mono font-medium">{label}</p>
        <p className="text-[14.5px] text-zinc-100 font-semibold group-hover:text-cyan-300 transition-colors">{value}</p>
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

  return (
    <div className="relative">
      <label className="block text-[12px] font-mono font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-zinc-900/80 border rounded-xl text-zinc-100 text-[14.5px] placeholder:text-zinc-500 focus:outline-none transition-all duration-300 resize-none font-sans"
          style={{
            borderColor: isFocused ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.08)',
            boxShadow: isFocused ? '0 0 15px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)' : '',
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-zinc-900/80 border rounded-xl text-zinc-100 text-[14.5px] placeholder:text-zinc-500 focus:outline-none transition-all duration-300 font-sans"
          style={{
            borderColor: isFocused ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.08)',
            boxShadow: isFocused ? '0 0 15px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)' : '',
          }}
        />
      )}
      {/* Animated accent bottom line */}
      <div
        className="absolute bottom-0 h-0.5 pointer-events-none"
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
  const [status, setStatus] = useState(null) // 'success' | 'error' | 'sent-mailto'
  const [statusMsg, setStatusMsg] = useState('')
  const [isSending, setIsSending] = useState(false)

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 })
  const [socialRef, socialVisible] = useScrollReveal({ threshold: 0.15 })
  const [formRef, formVisible] = useScrollReveal({ threshold: 0.15 })
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.3 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setStatusMsg('Harap lengkapi semua field formulir sebelum mengirim.')
      return
    }

    setIsSending(true)

    // Check if real Formspree endpoint is configured
    const isEndpointConfigured =
      contactConfig.formspreeEndpoint &&
      !contactConfig.formspreeEndpoint.includes('[ISI') &&
      contactConfig.formspreeEndpoint.startsWith('http')

    if (isEndpointConfigured) {
      try {
        const response = await fetch(contactConfig.formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(form),
        })

        if (response.ok) {
          setStatus('success')
          setStatusMsg('Paket terkirim ke server via Formspree! Saya akan segera merespons.')
          setForm({ name: '', email: '', message: '' })
        } else {
          throw new Error('Gagal mengirim ke endpoint')
        }
      } catch {
        // Fallback to mailto if network error
        dispatchMailto()
      } finally {
        setIsSending(false)
        setTimeout(() => setStatus(null), 6000)
      }
    } else {
      // Direct mailto dispatch (guaranteed real delivery without secrets)
      dispatchMailto()
      setIsSending(false)
      setTimeout(() => setStatus(null), 6000)
    }
  }

  const dispatchMailto = () => {
    const subject = encodeURIComponent(`[FizhTank] Pesan dari ${form.name}`)
    const body = encodeURIComponent(
      `Halo Siraj,\n\nNama: ${form.name}\nEmail: ${form.email}\n\nPesan:\n${form.message}\n\n---\nDikirim melalui formulir kontak FizhTank`
    )
    const targetEmail = contactConfig.fallbackEmail.includes('[ISI')
      ? 'siraj@fizhtank.internal'
      : contactConfig.fallbackEmail

    const mailtoLink = `mailto:${targetEmail}?subject=${subject}&body=${body}`
    window.location.href = mailtoLink

    setStatus('success')
    setStatusMsg('Klien email default Anda dibuka untuk mengirim pesan ini secara langsung!')
    setForm({ name: '', email: '', message: '' })
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
            Siap berkolaborasi, berdiskusi teknis arsitektur jaringan, atau sekadar menyapa. Jangan ragu untuk reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Social Links */}
          <div ref={socialRef} className="flex flex-col gap-4">
            {socialLinks.map(({ label, value, href, color, glowColor }, idx) => (
              <SocialCard
                key={label}
                label={label}
                value={value}
                href={href}
                color={color}
                glowColor={glowColor}
                visible={socialVisible}
                idx={idx}
              />
            ))}

            {/* Status card */}
            <div
              className="bento-card p-5 mt-2"
              style={{
                opacity: socialVisible ? 1 : 0,
                transform: socialVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
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
            {status === 'success' && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <p className="text-sm text-green-300 font-medium">{statusMsg}</p>
              </div>
            )}

            {/* Error Toast */}
            {status === 'error' && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-medium">{statusMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedInput
                label="name"
                placeholder="Nama Anda"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <AnimatedInput
                label="email"
                type="email"
                placeholder="nama@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <AnimatedInput
                label="message"
                placeholder="Tuliskan pesan atau kebutuhan proyek Anda..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-[15px] transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] group relative overflow-hidden active:scale-[0.98] disabled:opacity-70 tracking-wide cursor-pointer"
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
                  <span className="font-mono text-sm">Transmitting Packet...</span>
                ) : (
                  <>
                    <span>Send Transmission</span>
                    <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="mt-20 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-zinc-400 font-mono relative z-10"
          style={{
            borderColor: 'rgba(99,102,241,0.1)',
            opacity: footerVisible ? 1 : 0,
            transform: footerVisible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div className="flex items-center gap-2">
            <Fish size={14} className="text-violet-400" />
            <span className="text-zinc-300">FizhTank &copy; {new Date().getFullYear()}</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400">All systems operational</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Built with React 19 + Tailwind v4 + Vite</span>
            <span className="text-zinc-500">|</span>
            <a href="https://github.com/Fizhkan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Fizhkan
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Kelp at Bottom */}
      <BottomKelp />
    </section>
  )
}
