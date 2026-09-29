/**
 * A fast axe pass over the routes most likely to regress.
 *
 * `qa/a11y.mjs` crawls fifteen routes at two viewports and takes the better
 * part of ten minutes, which is right before a release and too slow to run
 * after every visual change. This covers the six routes that carry the
 * section components, at both viewports, in about a fifth of the time.
 *
 * It waits for `document.getAnimations()` to settle before analysing:
 * sampling mid-fade reports a blended colour, which produces contrast
 * failures that do not exist once the page is at rest.
 *
 *   pnpm qa:axe
 */
import { chromium, devices } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const B = process.env.BASE_URL || 'http://127.0.0.1:3320'
const ROUTES = ['/', '/how-it-works', '/source-a-fish', '/deliveries', '/about', '/no-such-page']
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let total = 0
for (const [name, dev] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', { ...devices['Pixel 5'] }]]) {
  for (const route of ROUTES) {
    const ctx = await b.newContext(dev)
    const p = await ctx.newPage()
    await p.goto(B + route, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(700)
    await p.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))).catch(() => {}))
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()
    const bad = r.violations.filter(v => ['moderate','serious','critical'].includes(v.impact))
    total += bad.length
    console.log(`${bad.length ? 'FAIL' : 'OK  '} ${name.padEnd(8)} ${route}`)
    for (const v of bad) console.log(`        ${v.impact} ${v.id}: ${v.nodes.length} node(s) — ${v.help}`)
    await ctx.close()
  }
}
console.log(`\n${total} violation(s) at moderate or above`)
await b.close()
process.exit(total === 0 ? 0 : 1)
