import { useState, useEffect } from 'react'
import { GitBranch, Link2, Mail, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { contactConfig } from '../data/contactData'
import { site } from '../data/site'

const iconMap = {
  GitHub: GitBranch,
  LinkedIn: Link2,
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
      className="glass group flex items-center justify-between gap-4 p-5 transition-[border-color,transform] duration-200 hover:border-aqua/50 active:scale-[0.99]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s, border-color 0.2s`,
      }}
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 text-aqua">
          <Icon size={19} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm text-mist">{label}</span>
          <span className="block truncate font-semibold text-white">{value}</span>
        </span>
      </span>

      <ArrowUpRight
        size={18}
        aria-hidden="true"
        className="shrink-0 text-mist transition-colors group-hover:text-aqua"
      />
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

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((prev) => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 })
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.08 })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cooldown > 0) {
      setStatus('error')
      setStatusMsg(`Tunggu ${cooldown} detik sebelum mengirim lagi.`)
      return
    }

    // Honeypot: bot yang mengisi field tersembunyi dikira berhasil, tapi tidak dikirim ke mana pun
    if (botTrap.trim() !== '') {
      setIsSending(true)
      setTimeout(() => {
        setIsSending(false)
        setStatus('success')
        setStatusMsg('Pesan terkirim.')
        setForm({ name: '', email: '', message: '' })
        setCooldown(30)
      }, 500)
      return
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      setStatusMsg('Mohon isi nama, email, dan pesan.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      setStatusMsg('Format email belum benar.')
      return
    }

    setIsSending(true)
    setStatus(null)
    setStatusMsg('')

    try {
      const response = await fetch(contactConfig.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          _subject: `[FizhTank] Pesan dari ${form.name.trim()}`,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMsg('Terima kasih, pesanmu sudah terkirim. Saya akan membalas lewat email.')
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
    const subject = encodeURIComponent(`[FizhTank] Pesan dari ${form.name}`)
    const body = encodeURIComponent(`Halo Siraj,\n\n${form.message}\n\nDari: ${form.name} (${form.email})`)
    window.location.href = `mailto:${contactConfig.fallbackEmail}?subject=${subject}&body=${body}`

    setStatus('sent-mailto')
    setStatusMsg('Formulir sedang bermasalah, jadi aplikasi email kamu dibuka untuk mengirim pesan ini.')
    setForm({ name: '', email: '', message: '' })
    setCooldown(30)
  }

  const links = [
    { label: 'GitHub', value: 'github.com/Fizhkan', href: 'https://github.com/Fizhkan' },
    ...(site.linkedinUrl && !site.linkedinUrl.includes('[ISI')
      ? [
          {
            label: 'LinkedIn',
            value: site.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, ''),
            href: site.linkedinUrl,
          },
        ]
      : []),
    {
      label: 'Email',
      value: site.email,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`,
    },
  ]

  const ok = status === 'success' || status === 'sent-mailto'
  const reveal = (visible, offset = 24) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div ref={headerRef} className="mb-12 max-w-2xl transition-all duration-700" style={reveal(headerVisible)}>
        <p className="eyebrow">Kontak</p>
        <h2 className="section-title on-water mt-4">Mari ngobrol</h2>
        <p className="lede on-water mt-4">
          Saya terbuka untuk diskusi soal jaringan dan keamanan, kolaborasi lab, atau peluang magang. Kirim pesan
          lewat formulir, atau langsung lewat email dan GitHub.
        </p>
      </div>

      <div ref={contentRef} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {links.map((item, idx) => (
            <SocialCard key={item.label} {...item} visible={contentVisible} idx={idx} />
          ))}

          <div className="glass p-6">
            <p className="flex items-start gap-2.5 font-semibold text-white">
              <span className="relative mt-[0.5em] flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kelp opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-kelp" />
              </span>
              {site.availability}
            </p>
            <p className="mt-2 leading-relaxed text-mist">
              Saat ini saya fokus ke kuliah, praktik lab Cisco dan Linux, dan persiapan CCNA.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass space-y-5 p-6 sm:p-8 lg:col-span-7" noValidate>
          <div className="hidden" aria-hidden="true">
            <label>
              Jangan diisi
              <input type="text" tabIndex={-1} autoComplete="off" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} />
            </label>
          </div>

          <div>
            <label htmlFor="contact-name" className="label">
              Nama
            </label>
            <input
              id="contact-name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama kamu atau organisasi"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="label">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@domain.com"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="label">
              Pesan
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tulis pertanyaan, ide kolaborasi, atau tawaran magang"
              className="field resize-none"
            />
          </div>

          {statusMsg && (
            <div
              role={ok ? 'status' : 'alert'}
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-[0.9375rem] ${
                ok ? 'border-kelp/40 bg-kelp/10 text-kelp' : 'border-coral/40 bg-coral/10 text-coral'
              }`}
            >
              {ok ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <span>{statusMsg}</span>
            </div>
          )}

          <button type="submit" disabled={isSending || cooldown > 0} className="btn btn-primary w-full">
            {cooldown > 0 ? (
              <span>Bisa kirim lagi dalam {cooldown} detik</span>
            ) : isSending ? (
              <span>Mengirim…</span>
            ) : (
              <>
                <span>Kirim pesan</span>
                <Send size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
