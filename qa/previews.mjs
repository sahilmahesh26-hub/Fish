import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { mkdirSync } from 'fs'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const out = process.env.OUT_DIR ?? 'qa/previews'
mkdirSync(out, { recursive: true })

const SHOTS = [
  { name: '01-home-desktop', path: '/', w: 1440, h: 900, full: true, width: 1200 },
  { name: '02-home-mobile', path: '/', w: 390, h: 844, full: true, width: 420 },
  { name: '03-enquiry-desktop', path: '/source-a-fish', w: 1440, h: 900, full: true, width: 1200 },
  { name: '04-enquiry-mobile', path: '/source-a-fish', w: 390, h: 844, full: true, width: 420 },
  { name: '05-how-it-works-desktop', path: '/how-it-works', w: 1440, h: 900, full: true, width: 1200 },
  { name: '06-deliveries-desktop', path: '/deliveries', w: 1440, h: 900, full: true, width: 1200 },
  { name: '07-knowledge-mobile', path: '/knowledge', w: 390, h: 844, full: true, width: 420 },
  { name: '08-404-desktop', path: '/no-such-page', w: 1440, h: 900, full: false, width: 1200 },
]

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.w, height: shot.h },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await page.goto(base + shot.path, { waitUntil: 'load', timeout: 90000 })
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)

  const buffer = await page.screenshot({ fullPage: shot.full })
  await sharp(buffer).resize({ width: shot.width }).jpeg({ quality: 78 }).toFile(`${out}/${shot.name}.jpg`)
  console.log('saved', shot.name)
  await context.close()
}

await browser.close()
