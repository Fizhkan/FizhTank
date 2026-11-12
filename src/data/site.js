/**
 * Central site profile and metadata for FizhTank.
 * Synced to <title>, meta, Open Graph, and JSON-LD by scripts/prerender.js on build.
 */

export const site = {
  title: 'FizhTank | Hafidz — Network & Security Engineering Portfolio',

  jobTitle: 'Aspiring Network & Security Engineer',

  subtitle: 'Informatics Engineering (D3)',

  tagline: 'Engineering resilient networks and practical security, one lab at a time.',

  // Profile image path in public/profile.jpg; falls back to monogram initial if absent.
  avatarUrl: '/profile.jpg',

  description:
    'Portfolio of Hafidz (Hafidz Sirajuddin), Informatics Engineering student focusing on network architecture, Linux infrastructure, and packet security.',

  availability: 'Open to technical collaborations & internships',

  location: 'Surabaya, Indonesia',

  // Optional CV download path
  cvUrl: '',

  // Optional LinkedIn URL
  linkedinUrl: '',

  email: 'hafidzsirajuddin99@gmail.com',

  // Contact form endpoint (Formspree)
  formspreeEndpoint: 'https://formspree.io/f/mrpegvge',

  // Certifications list; uses default roadmap in Certifications.jsx when empty.
  certifications: [
    {
      name: '',
      issuer: '',
      date: '',
      status: 'Planned',
    },
  ],
}

export default site
