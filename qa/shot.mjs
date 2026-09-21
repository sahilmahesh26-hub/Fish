import { chromium } from '@playwright/test'

const [url, out, width = '1440', height = '900', full = 'true', scale = '2'] =
  process.argv.slice(2)

const browser = await chromium.launch({
  // The environment pre-installs a Chromium that does not match this
  // Playwright version's expected revision, so point at it explicitly.
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  // 2 by default for a crisp review capture; pass 1 for a full-page shot of a
  // long document, where 2 produces a file too large to share.
  deviceScaleFactor: Number(scale),
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })

if (full === 'true') {
  // Scroll the whole page so lazy-loaded images below the fold actually load;
  // otherwise a full-page capture shows empty image frames.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
    window.scrollTo(0, 0)
  })
  await page
    .waitForFunction(
      () => Array.from(document.images).every((img) => img.complete),
      null,
      { timeout: 30000 },
    )
    .catch(() => {})
  await page.waitForTimeout(500)
}

await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.screenshot({ path: out, fullPage: full === 'true' })
await browser.close()
console.log('saved', out)
