import { chromium } from '@playwright/test'

/**
 * Field-style performance check.
 *
 * Not a Lighthouse score — no Lighthouse binary is available here — but it
 * measures the same primitives on a throttled connection: LCP, CLS, transfer
 * weight and script count.
 */
const base = process.env.BASE_URL ?? 'http://localhost:3107'
const ROUTES = ['/', '/source-a-fish', '/knowledge', '/about']

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  // Throttle to a mid-range mobile connection (Fast 3G-ish) and 4x CPU.
  const client = await context.newCDPSession(page)
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  })
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })

  let bytes = 0
  let scripts = 0
  page.on('response', async (r) => {
    try {
      const len = Number(r.headers()['content-length'] ?? 0)
      bytes += len
      if ((r.headers()['content-type'] ?? '').includes('javascript')) scripts += 1
    } catch {
      /* ignore */
    }
  })

  await page.goto(base + route, { waitUntil: 'load', timeout: 120000 })

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0
        let cls = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) lcp = entry.startTime
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const e = entry
            if (!e.hadRecentInput) cls += e.value
          }
        }).observe({ type: 'layout-shift', buffered: true })

        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0]
          resolve({
            lcp: Math.round(lcp),
            cls: Number(cls.toFixed(4)),
            ttfb: Math.round(nav?.responseStart ?? 0),
            domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0),
          })
        }, 3500)
      }),
  )

  const lcpOk = vitals.lcp > 0 && vitals.lcp < 2500
  const clsOk = vitals.cls < 0.1
  console.log(
    `${route.padEnd(16)} LCP ${String(vitals.lcp).padStart(5)}ms ${lcpOk ? 'OK ' : 'OVER'}  ` +
      `CLS ${String(vitals.cls).padStart(6)} ${clsOk ? 'OK ' : 'OVER'}  ` +
      `TTFB ${String(vitals.ttfb).padStart(4)}ms  ${Math.round(bytes / 1024)}KB  ${scripts} scripts`,
  )

  await context.close()
}

await browser.close()
