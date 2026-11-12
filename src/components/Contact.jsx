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
      className="group flex items-center justify-between gap-4 p-5 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-aqua/[0.04] active:scale-[0.99]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transition: `opacity 0.24s cubic-bezier(0.23, 1, 0.32, 1) ${idx * 0.04}s, transform 0.24s cubic-bezier(0.23, 1, 0.32, 1) ${idx * 0.04}s, background-color 0.2s`,
      }}
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-aqua/25 bg-aqua/5 font-mono text-xs text-aqua">
          <Icon size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[11px] tracking-widest text-mist uppercase">
            {String(idx + 1).padStart(2, '0')} // {label}
          </span>
          <span className="mt-0.5 block truncate font-medium text-foam transition-colors group-hover:text-aqua">
            {value}
          </span>
        </span>
      </span>

      <ArrowUpRight
        size={17}
        aria-hidden="true"
        className="shrink-0 text-mist transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aqua"
      />
    </a>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({ name: false, email: false, message: false })
  const [botTrap, setBotTrap] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [isSending, setIsSending] = useState(false)

  const validateField = (field, val) => {
    const trimmed = val.trim()
    if (field === 'name' && !trimmed) return 'Nama wajib diisi.'
    if (field === 'email') {
      if (!trimmed) return 'Email wajib diisi.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Format email belum valid (contoh: nama@domain.com).'
    }
    if (field === 'message' && !trimmed) return 'Pesan belum ditulis.'
    return ''
  }

  const fieldErrors = {
    name: touched.name ? validateField('name', form.name) : '',
    email: touched.email ? validateField('email', form.email) : '',
    message: touched.message ? validateField('message', form.message) : '',
  }

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

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
        setTouched({ name: false, email: false, message: false })
        setCooldown(30)
      }, 500)
      return
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setTouched({ name: true, email: true, message: true })
      setStatus('error')
      setStatusMsg('Mohon periksa kolom yang masih kosong.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setTouched((prev) => ({ ...prev, email: true }))
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
        setTouched({ name: false, email: false, message: false })
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
    setTouched({ name: false, email: false, message: false })
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
  const reveal = (visible, offset = 16) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
  })

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div
        ref={headerRef}
        className="mb-12 grid grid-cols-1 items-end gap-6 border-b border-aqua/15 pb-8 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:grid-cols-12"
        style={reveal(headerVisible)}
      >
        <div className="lg:col-span-7">
          <p className="eyebrow">04 // Komunikasi &amp; Transmisi</p>
          <h2 className="section-title on-water mt-4">
            Mari <em className="font-normal text-aqua italic">ngobrol</em>
          </h2>
        </div>
        <p className="lede on-water lg:col-span-5">
          Terbuka untuk diskusi soal jaringan dan keamanan, kolaborasi lab, atau peluang magang. Kirim pesan lewat
          formulir, atau langsung lewat email dan GitHub.
        </p>
      </div>

      <div ref={contentRef} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="specimen-panel divide-y divide-aqua/15 lg:col-span-5">
          {links.map((item, idx) => (
            <SocialCard key={item.label} {...item} visible={contentVisible} idx={idx} />
          ))}

          <div className="p-5 sm:p-6">
            <p className="font-mono text-[11px] tracking-widest text-mist uppercase">03 // Status Ekspedisi</p>
            <p className="mt-2 flex items-start gap-2.5 font-medium text-foam">
              <span className="relative mt-[0.45em] flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kelp opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-kelp" />
              </span>
              {site.availability}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Saat ini fokus ke kuliah, praktik lab Cisco dan Linux, serta persiapan sertifikasi CCNA.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="specimen-panel reticle space-y-5 p-6 sm:p-8 lg:col-span-7" noValidate>
          <div className="flex items-center justify-between border-b border-aqua/15 pb-3 font-mono text-[11px] tracking-widest text-mist uppercase">
            <span>DISPATCH FORM // DIRECT LINK</span>
            <span className="text-aqua">ENCRYPTED HTTPS</span>
          </div>
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
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              placeholder="Nama kamu atau organisasi"
              className={`field ${fieldErrors.name ? 'border-coral/70!' : ''}`}
            />
            {fieldErrors.name && (
              <p id="contact-name-error" className="mt-1.5 font-mono text-xs text-coral-text">
                {fieldErrors.name}
              </p>
            )}
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
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              placeholder="nama@domain.com"
              className={`field ${fieldErrors.email ? 'border-coral/70!' : ''}`}
            />
            {fieldErrors.email && (
              <p id="contact-email-error" className="mt-1.5 font-mono text-xs text-coral-text">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="label">
              Pesan
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
              value={form.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              onBlur={() => handleFieldBlur('message')}
              placeholder="Tulis pertanyaan, ide kolaborasi, atau tawaran magang"
              className={`field resize-none ${fieldErrors.message ? 'border-coral/70!' : ''}`}
            />
            {fieldErrors.message && (
              <p id="contact-message-error" className="mt-1.5 font-mono text-xs text-coral-text">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {statusMsg && (
            <div
              role={ok ? 'status' : 'alert'}
              className={`flex items-start gap-2.5 rounded-[2px] border p-3.5 text-[0.9375rem] ${
                ok ? 'border-kelp/40 bg-kelp/10 text-kelp' : 'border-coral/40 bg-coral/10 text-coral-text'
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
