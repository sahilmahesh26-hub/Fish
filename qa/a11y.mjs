import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const base = process.env.BASE_URL ?? 'http://localhost:3100'

const ROUTES = [
  '/',
  '/source-a-fish',
  '/how-it-works',
  '/deliveries',
  // Detail templates need `pnpm qa:fixtures apply`; without it they 404 and the
  // run says so rather than quietly skipping the two densest pages on the site.
  '/deliveries/qa-fixture-super-red-arowana-to-bengaluru',
  '/custom-aquariums',
  '/knowledge',
  '/knowledge/how-to-evaluate-a-fish-through-photos-and-video',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/thank-you?request=FQ-1709-0001&fish=Arowana',
  '/no-such-page',
]

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

let total = 0
const allViolations = []

for (const viewport of VIEWPORTS) {
  // axe requires a real context, not a bare page.
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const page = await context.newPage()

  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
    await page.evaluate(() => document.fonts.ready)
    /*
     * Let entrance animations finish before auditing.
     *
     * axe samples computed colour at the instant it runs. Catching a button
     * halfway through an opacity fade reports the blend of the button and
     * whatever is behind it, which is a contrast failure that does not exist
     * once the page has settled.
     */
    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
    )
    await page.waitForTimeout(300)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()

    const serious = results.violations.filter((v) =>
      ['critical', 'serious', 'moderate'].includes(v.impact ?? ''),
    )

    total += serious.length
    if (serious.length > 0) {
      console.log(`\n${viewport.name} ${route}`)
      for (const v of serious) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
        v.nodes.slice(0, 2).forEach((n) => console.log(`      ${n.target.join(' ')} ${(n.failureSummary ?? '').split('\n')[1] ?? ''}`))
        allViolations.push({ viewport: viewport.name, route, id: v.id, impact: v.impact })
      }
    } else {
      console.log(`OK  ${viewport.name.padEnd(8)} ${route}`)
    }
  }

  await context.close()
}

await browser.close()
console.log(`\n${total} accessibility violation(s) at moderate severity or above`)
process.exit(total === 0 ? 0 : 1)
