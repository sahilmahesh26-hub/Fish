/**
 * Text contrast on every interactive element, in every state.
 *
 * axe checks the resting state and gives up ("incomplete", not a violation)
 * when it cannot resolve a transparent element's effective background — which
 * is exactly the case that broke here: a bone outline button sitting on the
 * amber band measured 1.6:1 and axe never reported it.
 *
 * This walks the ancestor chain itself to find the real backdrop, and it
 * forces :hover as well, because a hover state that inverts one of the two
 * colours and not the other is invisible for as long as the pointer is on it.
 */
import { chromium, devices } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3320'
const ROUTES = [
  '/', '/how-it-works', '/source-a-fish', '/deliveries', '/about',
  '/custom-aquariums', '/knowledge', '/contact', '/thank-you',
  // Real policy slugs — `/policies/privacy` does not exist, and pointing at it
  // meant these runs were measuring the 404 page instead.
  '/privacy-policy', '/terms-and-conditions', '/cookie-policy',
  '/no-such-page',
]

const PROBE = () => {
  const parse = (value) => {
    const m = value.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const [r, g, b, a = '1'] = m[1].split(/[,\s/]+/).filter(Boolean)
    return { r: +r, g: +g, b: +b, a: +a }
  }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  const lum = (c) => {
    const f = (v) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const backdrop = (el) => {
    let acc = null
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (!c || c.a === 0) continue
      acc = acc ? over(acc, c) : c
      if (acc.a >= 1) return acc
    }
    return acc ?? { r: 255, g: 255, b: 255, a: 1 }
  }

  const out = []
  for (const el of document.querySelectorAll('a, button, summary, [role="button"]')) {
    const rect = el.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 8) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
    const fg = parse(cs.color)
    if (!fg) continue
    const own = parse(cs.backgroundColor)
    const behind = backdrop(el.parentElement ?? el)
    const bg = own && own.a > 0 ? over(own, behind) : behind
    const size = parseFloat(cs.fontSize)
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700)
    out.push({
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36),
      ratio: +ratio(over(fg, bg), bg).toFixed(2),
      floor: large ? 3 : 4.5,
      cls: el.className.toString().slice(0, 44),
    })
  }
  return out
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
let failures = 0

for (const [label, device] of [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobile', { ...devices['Pixel 5'] }],
]) {
  const context = await browser.newContext(device)
  await context.addCookies([
    {
      name: 'finquiry_consent',
      value: encodeURIComponent(JSON.stringify({ analytics: false, ts: Date.now() })),
      url: BASE,
    },
  ])

  for (const route of ROUTES) {
    const page = await context.newPage()
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20_000 })
    await page.addStyleTag({
      content: '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}',
    })
    await page.waitForTimeout(350)

    const states = { rest: await page.evaluate(PROBE) }
    // Forcing :hover on every element at once is what catches a hover rule
    // that moves the background without moving the text.
    await page.addStyleTag({
      content: `a,button,summary{
        &:not(:hover){ }
      }`,
    })
    await page.emulateMedia({ forcedColors: null })
    states.hover = await page.evaluate(() => {
      const style = document.createElement('style')
      // Re-declare each hover rule as an always-on rule by cloning the sheet.
      for (const sheet of Array.from(document.styleSheets)) {
        let rules
        try { rules = sheet.cssRules } catch { continue }
        for (const rule of Array.from(rules ?? [])) {
          if (rule.selectorText && rule.selectorText.includes(':hover')) {
            style.appendChild(
              document.createTextNode(rule.cssText.replace(/:hover/g, '') + '\n'),
            )
          }
        }
      }
      document.head.appendChild(style)
      return null
    })
    const hover = await page.evaluate(PROBE)

    for (const [state, rows] of [['rest', states.rest], ['hover', hover]]) {
      const bad = rows.filter((r) => r.ratio < r.floor)
      for (const r of bad) {
        failures += 1
        console.log(
          `FAIL ${label.padEnd(7)} ${route.padEnd(20)} ${state.padEnd(5)} ${String(r.ratio).padStart(6)}:1 (needs ${r.floor}) "${r.text}" .${r.cls}`,
        )
      }
    }
    await page.close()
  }
  await context.close()
}

console.log(`\n${failures} contrast failure(s)`)
await browser.close()
process.exit(failures === 0 ? 0 : 1)
