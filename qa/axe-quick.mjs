/**
 * A fast axe pass over the routes that carry section components.
 *
 * Two things this deliberately avoids, both of which hang forever on this
 * site:
 *
 *   - `waitUntil: 'networkidle'`. The pages hold open connections, so idle
 *     never arrives.
 *   - awaiting `document.getAnimations()`. The reef surge and the water
 *     motes are infinite animations, and an infinite animation's `finished`
 *     promise never settles.
 *
 * Instead the page is frozen with a stylesheet that turns motion off before
 * axe reads it, which is also what makes the result reproducible: axe sees
 * one fixed frame rather than whatever the water happened to be doing.
 *
 * Each route prints as it completes, so a run that is interrupted still
 * tells you how far it got.
 */
import { chromium, devices } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3320'

const ROUTES = [
  '/',
  '/how-it-works',
  '/source-a-fish',
  '/deliveries',
  '/about',
  '/custom-aquariums',
  '/knowledge',
  '/contact',
  '/thank-you',
  // The real policy slugs. An earlier version of this list used
  // `/policies/privacy`, which does not exist, so every run quietly audited
  // the 404 page twice and reported the policy pages as passing.
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/no-such-page',
]

const FREEZE = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const IMPACTS = new Set(['moderate', 'serious', 'critical'])

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

let total = 0

for (const [label, device] of [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobile', { ...devices['Pixel 5'] }],
]) {
  const context = await browser.newContext(device)
  // The consent banner is a focus trap by design; dismissing it up front is
  // what a returning visitor sees, and it lets axe reach the page beneath.
  await context.addCookies([
    {
      name: 'finquiry_consent',
      value: encodeURIComponent(JSON.stringify({ analytics: false, ts: Date.now() })),
      url: BASE,
    },
  ])

  for (const route of ROUTES) {
    const page = await context.newPage()
    let line
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20_000 })
      await page.addStyleTag({ content: FREEZE })
      await page.waitForTimeout(400)

      const result = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      const bad = result.violations.filter((v) => IMPACTS.has(v.impact))
      total += bad.length

      line = `${bad.length ? 'FAIL' : 'OK  '} ${label.padEnd(7)} ${route}`
      for (const v of bad) {
        line += `\n        ${v.impact} ${v.id} (${v.nodes.length}) — ${v.help}`
        for (const node of v.nodes.slice(0, 3)) {
          line += `\n          ${node.target.join(' ')}`
        }
      }
    } catch (error) {
      total += 1
      line = `ERR  ${label.padEnd(7)} ${route} — ${error.message.split('\n')[0]}`
    }
    console.log(line)
    await page.close()
  }

  await context.close()
}

/* The consent banner only renders for a visitor with no stored choice, so
   it needs its own pass with a clean jar or it is never audited. */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20_000 })
  await page.addStyleTag({ content: FREEZE })
  await page.waitForTimeout(600)
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  const bad = result.violations.filter((v) => IMPACTS.has(v.impact))
  total += bad.length
  let line = `${bad.length ? 'FAIL' : 'OK  '} banner  / (consent banner shown)`
  for (const v of bad) line += `\n        ${v.impact} ${v.id} (${v.nodes.length}) — ${v.help}`
  console.log(line)
  await context.close()
}

console.log(`\n${total} violation(s) at moderate impact or above`)
await browser.close()
process.exit(total === 0 ? 0 : 1)
