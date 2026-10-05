// ── Contact Matrix & Social Channels Data ──
// Data kontak dipusatkan di src/data/site.js
import { site } from './site'

export const contactConfig = {
  // Masukkan endpoint form kamu (misal: 'https://formspree.io/f/xbjnqowz' atau 'https://api.web3forms.com/submit')
  // Bila dibiarkan kosong, form akan otomatis membuka mailto klien email default pengguna.
  formspreeEndpoint: '',
  fallbackEmail: site.email,
}

export const socialLinks = [
  {
    label: 'GitHub',
    value: 'github.com/Fizhkan',
    href: 'https://github.com/Fizhkan',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.15)',
  },
  ...(site.linkedinUrl && !site.linkedinUrl.includes('[ISI')
    ? [
        {
          label: 'LinkedIn',
          value: site.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, ''),
          href: site.linkedinUrl,
          color: '#3b82f6',
          glowColor: 'rgba(59,130,246,0.15)',
        },
      ]
    : []),
  {
    label: 'Email Langsung',
    value: site.email,
    href: `mailto:${site.email}`,
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.15)',
  },
]

export default { contactConfig, socialLinks }
