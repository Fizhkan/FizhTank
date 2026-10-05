// ── Deprecated: Gunakan src/data/site.js sebagai Single Source of Truth ──
// Data sertifikasi dan konfigurasi CV kini dipusatkan di src/data/site.js.
import { site } from './site'

export const cvDownloadConfig = {
  filePath: site.cvUrl || '/cv.pdf',
  fileName: 'CV_Siraj.pdf',
  lastUpdated: '',
  available: Boolean(site.cvUrl && site.cvUrl.trim() !== '' && !site.cvUrl.includes('[ISI')),
}

export const certificationsTimeline = site.certifications || []

export default { cvDownloadConfig, certificationsTimeline }
