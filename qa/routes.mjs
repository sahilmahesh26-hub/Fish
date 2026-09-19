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
  '/cookie-policy',
  '/og/default.png',
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
  '/manifest.webmanifest',
]

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() !== 'error') return
  const text = msg.text()
  // The browser logs the 404 route's own status; that is the test passing.
  if (expectedNotFoundUrl && /Failed to load resource.*404/i.test(text)) return
  consoleErrors.push(text.slice(0, 160))
})
page.on('pageerror', (err) => consoleErrors.push('PAGEERROR ' + err.message.slice(0, 160)))

/*
 * Requests the page itself made and did not get. A 404 on a favicon or a font
 * never breaks a test, so it goes unnoticed until someone opens devtools.
 *
 * Two things are deliberately not counted. Next prefetches the RSC payload of
 * every link in view (`?_rsc=…`) and cancels those still in flight when you
 * navigate — `net::ERR_ABORTED` on a prefetch is the router working, not a
 * broken request. And the 404 route is *expected* to return 404 for its own
 * document.
 */
const isPrefetchNoise = (url, reason) =>
  url.includes('_rsc=') || reason === 'net::ERR_ABORTED'

const failedRequests = []
let expectedNotFoundUrl = ''

page.on('requestfailed', (request) => {
  const reason = request.failure()?.errorText ?? 'failed'
  if (isPrefetchNoise(request.url(), reason)) return
  failedRequests.push(`${reason} ${request.url().slice(0, 120)}`)
})
page.on('response', (response) => {
  if (response.status() < 400) return
  if (isPrefetchNoise(response.url(), '')) return
  if (response.url() === expectedNotFoundUrl) return
  failedRequests.push(`${response.status()} ${response.url().slice(0, 120)}`)
})

/*
 * CSP violations. The browser reports these to the page, not to the console in
 * a way Playwright classifies as an error — and a policy that silently blocks
 * a script is exactly the production-only failure this project already hit
 * once.
 */
const cspViolations = []
page.on('console', (msg) => {
  const text = msg.text()
  if (/Content Security Policy|Refused to (load|execute|apply|connect)/i.test(text)) {
    cspViolations.push(text.slice(0, 160))
  }
})

let failures = 0
for (const route of ROUTES) {
  consoleErrors.length = 0
  failedRequests.length = 0
  cspViolations.length = 0
  // The 404 route's own document is supposed to come back 404.
  expectedNotFoundUrl = route === '/this-route-does-not-exist' ? base + route : ''
  // `load`, not `domcontentloaded`: App Router streams, so the document can
  // fire DOMContentLoaded before the page's own markup has arrived.
  const response = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
  const status = response?.status() ?? 0
  const expected = route === '/this-route-does-not-exist' ? 404 : 200
  // Only an HTML document has an H1 to count.
  const isDocument = !/\.(xml|txt|png|ico|webmanifest)$/.test(route.split('?')[0])
  const h1 = isDocument ? await page.locator('h1').count().catch(() => 0) : -1
  const h1Ok = !isDocument || h1 === 1

  const ok =
    status === expected &&
    h1Ok &&
    consoleErrors.length === 0 &&
    cspViolations.length === 0 &&
    failedRequests.length === 0

  if (!ok) failures += 1

  const notes = [
    consoleErrors.length ? `console:${consoleErrors.length}` : '',
    cspViolations.length ? `csp:${cspViolations.length}` : '',
    failedRequests.length ? `requests:${failedRequests.length}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  console.log(`${ok ? 'OK  ' : 'FAIL'} ${String(status).padEnd(3)} h1=${String(h1).padEnd(2)} ${notes.padEnd(28)} ${route}`)
  for (const line of [...consoleErrors, ...cspViolations, ...failedRequests].slice(0, 3)) {
    console.log('      ' + line)
  }
}

await browser.close()
console.log(
  failures === 0
    ? `\nAll ${ROUTES.length} routes OK — correct status, one H1, no console errors, no CSP violations, no failed requests`
    : `\n${failures} of ${ROUTES.length} route(s) failed`,
)
process.exit(failures === 0 ? 0 : 1)
