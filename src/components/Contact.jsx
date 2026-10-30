import { useState, useEffect } from 'react'
import { GitBranch, Link2, Mail, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { contactConfig } from '../data/contactData'
import { site } from '../data/site'

const iconMap = {
  GitHub: GitBranch,
  LinkedIn: Link2,
  'Email Langsung': Mail,
  Email: Mail,
}

function SocialCard({ label, value, href, visible, idx }) {
  const Icon = iconMap[label] || Link2
  const isMailto = href.startsWith('mailto:')

  return (
    <a
      href={href}
      target={isMailto ? undefined : '_blank'}
      rel={isMailto ? undefined : 'noopener noreferrer'}
      className="p-5 rounded-2xl apple-glass flex items-center justify-between group transition-all duration-300 hover:border-cyan-500/40 cursor-pointer active:scale-[0.98] select-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-24px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.12}s`,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
        <div>
          <span className="text-[11px] font-mono text-slate-500 uppercase block tracking-wider">
            {label}
          </span>
          <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
            {value}
          </span>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
        <ArrowUpRight size={14} />
      </div>
    </a>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [botTrap, setBotTrap] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.1 })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cooldown > 0) {
      setStatus('error')
      setStatusMsg(`Harap tunggu ${cooldown} detik sebelum transmisi berikutnya.`)
      return
    }

    if (botTrap.trim() !== '') {
      setIsSending(true)
      setTimeout(() => {
        setIsSending(false)
        setStatus('success')
        setStatusMsg('Transmisi terkirim ke stasiun.')
        setForm({ name: '', email: '', message: '' })
        setCooldown(30)
      }, 500)
      return
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setStatusMsg('Mohon isi semua field sebelum mengirim.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setStatus('error')
      setStatusMsg('Format alamat email tidak valid.')
      return
    }

    setIsSending(true)
    setStatus(null)
    setStatusMsg('')

    try {
      const endpoint = contactConfig.formspreeEndpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          _subject: `[FizhTank Transmission] Kontak dari ${form.name.trim()}`,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMsg('Transmisi berhasil terkirim! Saya akan membalas via email segera.')
        setForm({ name: '', email: '', message: '' })
        setCooldown(30)
      } else {
        handleMailtoFallback()
      }
    } catch {
      handleMailtoFallback()
    } finally {
      setIsSending(false)
    }
  }

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`[FizhTank Transmission] Pesan dari ${form.name}`)
    const body = encodeURIComponent(`Halo Siraj,\n\n${form.message}\n\nDari: ${form.name} (${form.email})`)
    window.location.href = `mailto:${contactConfig.fallbackEmail}?subject=${subject}&body=${body}`

    setStatus('sent-mailto')
    setStatusMsg('Klien email default Anda dibuka untuk mengirim pesan ini secara langsung.')
    setForm({ name: '', email: '', message: '' })
    setCooldown(30)
  }

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div
        ref={headerRef}
        className="mb-14 sm:mb-18 transition-all duration-700"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <p className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-cyan-400/80 mb-3 flex items-center gap-2">
          <span>// 005</span>
          <span className="w-8 h-px bg-cyan-500/40" />
          <span>Surface Uplink &amp; Communication Relay</span>
        </p>

        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] leading-tight text-white font-display uppercase">
              Initialize Transmission &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-400">
                Direct Dialogue.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              Terbuka untuk diskusi teknis arsitektur jaringan, kolaborasi simulasi lab keamanan, maupun peluang magang (internship).
            </p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div ref={contentRef} className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Relays */}
        <div className="lg:col-span-5 space-y-4">
          {[
            {
              label: 'GitHub Repository',
              value: 'github.com/Fizhkan',
              href: 'https://github.com/Fizhkan',
            },
            ...(site.linkedinUrl && !site.linkedinUrl.includes('[ISI')
              ? [
                  {
                    label: 'LinkedIn Uplink',
                    value: site.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, ''),
                    href: site.linkedinUrl,
                  },
                ]
              : []),
            {
              label: 'Direct Email',
              value: site.email,
              href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`,
            },
          ].map((item, idx) => (
            <SocialCard
              key={item.label}
              label={item.label}
              value={item.value}
              href={item.href}
              visible={contentVisible}
              idx={idx}
            />
          ))}

          {/* Station Status Box */}
          <div className="p-6 rounded-2xl apple-glass font-mono text-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-cyan-300 uppercase tracking-wider">
                {site.availability && !site.availability.includes('[ISI')
                  ? site.availability
                  : 'Open to Technical Inquiries'}
              </span>
            </div>
            <p className="text-slate-400 text-[12px] leading-relaxed font-sans">
              Memfokuskan waktu pada pendalaman kurikulum akademik, eksperimen lab Cisco/Linux, serta persiapan kualifikasi CCNA.
            </p>
          </div>
        </div>

        {/* Right: Transmission Console Form */}
        <div className="lg:col-span-7 rounded-2xl apple-glass p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase tracking-wider text-slate-400">
                Nama / Identifier
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda atau Organisasi"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white font-sans text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase tracking-wider text-slate-400">
                Alamat Email Transmisi
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@domain.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white font-sans text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase tracking-wider text-slate-400">
                Payload Pesan / Inquiry
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tuliskan pesan, pertanyaan teknis, atau peluang kolaborasi..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white font-sans text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            {/* Status alerts */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl border font-mono text-xs flex items-center gap-2 ${
                  status === 'success' || status === 'sent-mailto'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {status === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{statusMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending || cooldown > 0}
              className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              {cooldown > 0 ? (
                <span>COOLDOWN: {cooldown}S</span>
              ) : isSending ? (
                <span>TRANSMITTING PACKET...</span>
              ) : (
                <>
                  <span>TRANSMIT UPLINK</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
