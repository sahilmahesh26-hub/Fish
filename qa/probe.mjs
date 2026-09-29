import { chromium, devices } from '@playwright/test'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await b.newContext({ ...devices['Pixel 5'] })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:3320/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
console.log(JSON.stringify(await p.evaluate(() => {
  const out = []
  for (const el of document.querySelectorAll('button, a')) {
    const r = el.getBoundingClientRect()
    if (r.height > 0 && r.height < 44) {
      const cs = getComputedStyle(el)
      out.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 24), h: Math.round(r.height), w: Math.round(r.width), minH: cs.minBlockSize, cls: (el.className||'').toString().slice(0,42) })
    }
  }
  return out.slice(0, 10)
}), null, 1))
await b.close()
