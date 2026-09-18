import { chromium } from '@playwright/test'

const ROUTES = [
  '/',
  '/source-a-fish',
  '/how-it-works',
  '/deliveries',
  '/custom-aquariums',
  '/knowledge',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/sourcing-and-delivery-policy',
  '/restricted-species-policy',
  '/thank-you?request=FQ-1709-0001&fish=Super%20red%20arowana',
  '/this-route-does-not-exist',
  '/sitemap.xml',
  '/robots.txt',
  '/rss.xml',
]

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 160))
})
page.on('pageerror', (err) => consoleErrors.push('PAGEERROR ' + err.message.slice(0, 160)))

let failures = 0
for (const route of ROUTES) {
  consoleErrors.length = 0
  // `load`, not `domcontentloaded`: App Router streams, so the document can
  // fire DOMContentLoaded before the page's own markup has arrived.
  const response = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
  const status = response?.status() ?? 0
  const expected = route === '/this-route-does-not-exist' ? 404 : 200
  const isDocument = !/\.(xml|txt)$/.test(route.split('?')[0])
  const h1 = isDocument ? await page.locator('h1').count().catch(() => 0) : -1
  // Exactly one H1 per document page.
  const h1Ok = !isDocument || h1 === 1
  const ok = status === expected && h1Ok
  if (!ok) failures += 1
  const errs = consoleErrors.length ? ` console:${consoleErrors.length}` : ''
  void h1Ok
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${status} h1=${h1}${errs}  ${route}`)
  if (consoleErrors.length) consoleErrors.slice(0, 2).forEach((e) => console.log('      ' + e))
}

await browser.close()
console.log(failures === 0 ? '\nAll routes OK' : `\n${failures} route(s) failed`)
process.exit(failures === 0 ? 0 : 1)
