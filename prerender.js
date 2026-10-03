import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.resolve(__dirname, 'dist/index.html')
const serverEntryPath = path.resolve(__dirname, 'dist-ssr/entry-server.js')

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
    const { render } = await import(serverEntryPath)
    const appHtml = render()

    const finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )

    fs.writeFileSync(templatePath, finalHtml, 'utf-8')
    console.log('✓ Successfully prerendered static HTML into dist/index.html')
  } catch (err) {
    console.error('Prerender execution failed:', err)
    process.exit(1)
  }
}

prerender()
