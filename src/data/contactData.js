// ── Contact Matrix & Social Channels Data ──
// Formspree / Web3Forms endpoint without frontend secrets.

export const contactConfig = {
  // Masukkan endpoint form kamu (misal: 'https://formspree.io/f/xbjnqowz' atau 'https://api.web3forms.com/submit')
  // Bila dibiarkan placeholder atau kosong, form akan otomatis membuka mailto klien email default pengguna.
  formspreeEndpoint: '[ISI DI SINI: Formspree Endpoint / ID]',
  fallbackEmail: 'hafidzsirajuddin99@gmail.com',
}

export const socialLinks = [
  {
    label: 'GitHub',
    value: 'github.com/Fizhkan',
    href: 'https://github.com/Fizhkan',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.15)',
  },
  {
    label: 'LinkedIn',
    value: '[ISI DI SINI: LinkedIn Profile]',
    href: 'https://linkedin.com/in/[ISI_DI_SINI_USERNAME]',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.15)',
  },
  {
    label: 'Email Langsung',
    value: 'hafidzsirajuddin99@gmail.com',
    href: 'mailto:hafidzsirajuddin99@gmail.com',
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.15)',
  },
]
