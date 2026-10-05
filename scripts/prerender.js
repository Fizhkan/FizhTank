import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { site } from '../src/data/site.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const templatePath = path.resolve(projectRoot, 'dist/index.html')
const serverEntryPath = path.resolve(projectRoot, 'dist-ssr/entry-server.js')
const distSsrDir = path.resolve(projectRoot, 'dist-ssr')

async function prerender() {
  try {
    if (!fs.existsSync(templatePath)) {
      console.error('Prerender error: dist/index.html not found.')
      process.exit(1)
    }
    if (!fs.existsSync(serverEntryPath)) {
      console.error('Prerender error: dist-ssr/entry-server.js not found.')
      process.exit(1)
    }

    const template = fs.readFileSync(templatePath, 'utf-8')
    const { render } = await import(pathToFileURL(serverEntryPath).href)
    const appHtml = render()

    let finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )

    // Synchronize <title> from site.js
    if (site.title) {
      finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${site.title}</title>`)
    }

    // Synchronize meta description from site.js
    if (site.description) {
      finalHtml = finalHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"/,
        `<meta name="description" content="${site.description}"`
      )
    }

    // Synchronize Open Graph & Twitter title and description from site.js
    if (site.title) {
      finalHtml = finalHtml.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"/,
        `<meta property="og:title" content="${site.title}"`
      )
      finalHtml = finalHtml.replace(
        /<meta\s+name="twitter:title"\s+content="[^"]*"/,
        `<meta name="twitter:title" content="${site.title}"`
      )
    }
    if (site.description) {
      finalHtml = finalHtml.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"/,
        `<meta property="og:description" content="${site.description}"`
      )
      finalHtml = finalHtml.replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"/,
        `<meta name="twitter:description" content="${site.description}"`
      )
    }

    // Synchronize JSON-LD structured data from site.js
    const sameAsList = ['https://github.com/Fizhkan']
    if (site.linkedinUrl && !site.linkedinUrl.includes('[ISI')) {
      sameAsList.push(site.linkedinUrl)
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Siraj',
      alternateName: 'Fizhkan',
      url: 'https://fizhtank.vercel.app/',
      email: site.email || undefined,
      jobTitle: site.jobTitle,
      description: site.description,
      knowsAbout: [
        'Computer Networking',
        'VLAN Segmentation',
        'Wireshark',
        'Linux Administration',
        'Network Security',
      ],
      sameAs: sameAsList,
    }

    finalHtml = finalHtml.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n    ${JSON.stringify(jsonLdData, null, 2).replace(/\n/g, '\n    ')}\n    </script>`
    )

    fs.writeFileSync(templatePath, finalHtml, 'utf-8')
    console.log('✓ Successfully prerendered static HTML and synchronized metadata into dist/index.html')

    // Clean up dist-ssr directory cleanly and cross-platform
    if (fs.existsSync(distSsrDir)) {
      fs.rmSync(distSsrDir, { recursive: true, force: true })
      console.log('✓ Cleaned up dist-ssr')
    }
  } catch (err) {
    console.error('Prerender execution failed:', err)
    process.exit(1)
  }
}

prerender()
