import { chromium } from '@playwright/test'

/**
 * Horizontal-overflow probe.
 *
 * §15 requires no horizontal page scroll at any width. This measures the real
 * thing — `scrollWidth` against `clientWidth` — and then names the elements
 * responsible.
 *
 * Elements are only blamed when nothing between them and the root clips them.
 * `getBoundingClientRect` reports the unclipped box, so a decorative glow that
 * deliberately bleeds outside a hero with `overflow: hidden` looks identical to
 * a genuine overflow unless the ancestor chain is checked.
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3100'
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const WIDTHS = [320, 360, 375, 390, 393, 412, 430, 768, 820, 1024]
const ROUTES = (process.env.ROUTES ?? '/,/source-a-fish,/how-it-works,/deliveries,/knowledge,/about,/contact,/custom-aquariums,/cookie-policy,/thank-you').split(',')

const browser = await chromium.launch({ executablePath: CHROMIUM })
const page = await browser.newPage()
let failures = 0

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 })
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')
    const result = await page.evaluate(() => {
      const root = document.documentElement
      const overflow = root.scrollWidth - root.clientWidth
      if (overflow <= 0) return { overflow: 0, culprits: [] }

      const clipped = (el) => {
        for (let p = el.parentElement; p && p !== root; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX
          if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true
        }
        return false
      }

      const culprits = []
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        const past = Math.round(rect.right - root.clientWidth)
        if (past > 1 && !clipped(el)) {
          const cls = (el.className || '').toString().split(' ')[0]
          culprits.push({ el: `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`, past })
        }
      }
      culprits.sort((a, b) => b.past - a.past)
      return { overflow, culprits: culprits.slice(0, 4) }
    })

    if (result.overflow > 0) {
      failures += 1
      console.log(`FAIL  ${String(width).padStart(4)}px  ${route}  document is ${result.overflow}px wider than the viewport`)
      for (const c of result.culprits) console.log(`         ${c.el} extends ${c.past}px past the right edge`)
    }
  }
}

console.log(
  failures === 0
    ? `PASS  no horizontal overflow — ${WIDTHS.length} widths x ${ROUTES.length} routes`
    : `FAIL  ${failures} of ${WIDTHS.length * ROUTES.length} combinations overflow`,
)
await browser.close()
process.exit(failures === 0 ? 0 : 1)
