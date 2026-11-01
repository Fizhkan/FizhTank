// Konfigurasi kontak. Endpoint dan email diambil dari src/data/site.js
import { site } from './site'

export const contactConfig = {
  formspreeEndpoint: site.formspreeEndpoint,
  fallbackEmail: site.email,
}

export default { contactConfig }
