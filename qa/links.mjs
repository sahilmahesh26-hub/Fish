import { chromium } from '@playwright/test'

/**
 * Link crawl.
 *
 * Walks every internal link reachable from the site's own pages and reports
 * anything that does not resolve. Runs against a production server, because
 * `dynamicParams = false` and the static/ISR routes only behave correctly
 * there.
 *
 * External links are checked separately and reported but never fail the run:
 * a third-party site being down, rate-limiting, or blocking a headless request
 * is not this site's defect, and a crawl that fails on it is a crawl nobody
 * trusts.
 */
const BASE = (process.env.BASE_URL ?? 'http://127.0.0.1:3100').replace(/\/$/, '')
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

/** Reached only after a real submission, so it is a seed, not a discovery. */
const SEEDS = ['/', '/thank-you?request=FQ-1234-5678&fish=Test']

/** Deliberately not crawled: the CMS, internal endpoints and the 404 fixture. */
const SKIP = [/^\/admin/, /^\/api\//]

const browser = await chromium.launch({ executablePath: CHROMIUM })
const context = await browser.newContext()
const page = await context.newPage()

const seen = new Set()
const queue = [...SEEDS]
const broken = []
const external = new Map()
let checked = 0

const record = (map, url, from) => {
  if (!map.has(url)) map.set(url, new Set())
  map.get(url).add(from)
}

while (queue.length > 0) {
  const path = queue.shift()
  if (seen.has(path)) continue
  seen.add(path)

  const response = await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 })
  const status = response?.status() ?? 0
  checked += 1

  if (status >= 400) {
    broken.push(`${status}  ${path}`)
    continue
  }

  const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.getAttribute('href') ?? ''))

  for (const href of hrefs) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue

    if (/^https?:\/\//.test(href) && !href.startsWith(BASE)) {
      record(external, href, path)
      continue
    }

    const url = new URL(href, BASE + path)
    if (url.origin !== new URL(BASE).origin) continue

    const next = url.pathname + url.search
    if (SKIP.some((pattern) => pattern.test(url.pathname))) continue
    if (!seen.has(next)) queue.push(next)
  }
}

/* -------------------------------------------------------------------------- */

console.log(`crawled ${checked} internal pages from ${SEEDS.length} seeds`)

if (broken.length > 0) {
  console.log(`\n${broken.length} broken internal link(s):`)
  broken.forEach((entry) => console.log('  ' + entry))
} else {
  console.log('no broken internal links')
}

if (external.size > 0) {
  console.log(`\n${external.size} external destination(s), reported only:`)
  for (const [url, sources] of external) {
    let note = ''
    try {
      const response = await context.request.head(url, { timeout: 15000, maxRedirects: 5 })
      note = String(response.status())
    } catch (error) {
      note = `unreachable (${String(error).split('\n')[0].slice(0, 60)})`
    }
    console.log(`  ${note.padEnd(12)} ${url}   [from ${[...sources].join(', ')}]`)
  }
}

// The 404 handler must return a real 404, not a 200 with apologetic content.
const notFound = await context.request.get(`${BASE}/definitely-not-a-real-page`, { maxRedirects: 0 })
console.log(`\n/definitely-not-a-real-page returns ${notFound.status()}`)
const statusOk = notFound.status() === 404

await browser.close()
console.log(broken.length === 0 && statusOk ? '\nPASS' : '\nFAIL')
process.exit(broken.length === 0 && statusOk ? 0 : 1)
