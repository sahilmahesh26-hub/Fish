import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'

const base = process.env.BASE_URL ?? 'http://localhost:3100'

/** Every width the brief requires a visual review at. */
const VIEWPORTS = [
  { w: 320, h: 568, label: '320x568' },
  { w: 360, h: 800, label: '360x800' },
  { w: 390, h: 844, label: '390x844' },
  { w: 414, h: 896, label: '414x896' },
  { w: 667, h: 375, label: '667x375-landscape' },
  { w: 768, h: 1024, label: '768x1024' },
  { w: 834, h: 1194, label: '834x1194' },
  { w: 1024, h: 768, label: '1024x768' },
  { w: 1280, h: 800, label: '1280x800' },
  { w: 1366, h: 768, label: '1366x768' },
  { w: 1440, h: 900, label: '1440x900' },
  { w: 1920, h: 1080, label: '1920x1080' },
]

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/source-a-fish', name: 'source' },
  { path: '/how-it-works', name: 'how-it-works' },
  { path: '/deliveries', name: 'deliveries' },
  { path: '/custom-aquariums', name: 'aquariums' },
  { path: '/knowledge', name: 'knowledge' },
  { path: '/about', name: 'about' },
  { path: '/no-such-page', name: '404' },
]

const shotsOnly = process.argv.includes('--shots')
mkdirSync('qa/screenshots', { recursive: true })

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

const problems = []

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  for (const route of ROUTES) {
    await page.goto(base + route.path, { waitUntil: 'load', timeout: 60000 })
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 80))
      }
      window.scrollTo(0, 0)
    })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(350)

    const audit = await page.evaluate(() => {
      const issues = []
      const doc = document.documentElement

      // 1. Horizontal overflow.
      const overflow = doc.scrollWidth - doc.clientWidth
      if (overflow > 1) {
        const culprits = Array.from(document.querySelectorAll('body *'))
          .filter((el) => {
            const r = el.getBoundingClientRect()
            return r.right > doc.clientWidth + 1 && r.width > 0 && r.height > 0
          })
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`)
        issues.push(`horizontal overflow ${overflow}px (${culprits.join(', ') || 'unknown'})`)
      }

      // 2. Content text below 16px. Uppercase microcopy (eyebrows, metadata
      //    labels, captions) is UI chrome and is checked separately by eye.
      const isMicrocopy = (el) =>
        getComputedStyle(el).textTransform === 'uppercase' ||
        el.closest('figcaption, .u-eyebrow, nav[aria-label="Breadcrumb"]')
      const small = Array.from(document.querySelectorAll('p, li, dd, label, input, textarea, select'))
        .filter((el) => {
          const text = (el.textContent ?? '').trim()
          if (!text && el.tagName !== 'INPUT') return false
          if (isMicrocopy(el)) return false
          const size = parseFloat(getComputedStyle(el).fontSize)
          return size > 0 && size < 15.5
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()} ${parseFloat(getComputedStyle(el).fontSize)}px`)
      if (small.length > 0 && window.innerWidth < 768) {
        issues.push(`body text under 16px: ${small.join(', ')}`)
      }

      // 3. Touch targets under 44px on touch-sized viewports.
      if (window.innerWidth < 1024) {
        const tiny = Array.from(document.querySelectorAll('a, button, input[type="checkbox"]'))
          .filter((el) => {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) return false
            if (getComputedStyle(el).position === 'absolute' && r.height < 2) return false
            return r.height < 44
          })
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}"${(el.textContent ?? '').trim().slice(0, 18)}" ${Math.round(el.getBoundingClientRect().height)}px`)
        if (tiny.length > 0) issues.push(`touch target under 44px: ${tiny.join(', ')}`)
      }

      // 4. Clipped text (element scrolls its own content horizontally).
      //    Visually-hidden helpers are clipped on purpose, and an element
      //    containing one inherits that overflow — both are excluded.
      const clipped = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button'))
        .filter((el) => {
          if (el.classList.contains('u-visually-hidden')) return false
          if (el.querySelector('.u-visually-hidden')) return false
          return el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}"${(el.textContent ?? '').trim().slice(0, 20)}"`)
      if (clipped.length > 0) issues.push(`clipped text: ${clipped.join(', ')}`)

      // 5. Broken images.
      const broken = Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .slice(0, 3)
        .map((img) => img.currentSrc.slice(-40))
      if (broken.length > 0) issues.push(`broken images: ${broken.join(', ')}`)

      return issues
    })

    if (audit.length > 0) {
      audit.forEach((issue) => {
        problems.push(`${vp.label} ${route.path}: ${issue}`)
        console.log(`ISSUE ${vp.label.padEnd(18)} ${route.path.padEnd(18)} ${issue}`)
      })
    }

    if (shotsOnly || route.name === 'home') {
      await page.screenshot({
        path: `qa/screenshots/${route.name}-${vp.label}.png`,
        fullPage: shotsOnly,
      })
    }
  }

  if (problems.filter((p) => p.startsWith(vp.label)).length === 0) {
    console.log(`OK    ${vp.label}`)
  }

  await context.close()
}

await browser.close()
console.log(`\n${problems.length} responsive issue(s) across ${VIEWPORTS.length} widths x ${ROUTES.length} routes`)
process.exit(problems.length === 0 ? 0 : 1)
