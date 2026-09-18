import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end configuration.
 *
 * `executablePath` points at the Chromium this environment pre-installs, whose
 * revision does not match the one Playwright would otherwise download.
 */
const CHROMIUM = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: { executablePath: CHROMIUM },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: { executablePath: CHROMIUM } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], launchOptions: { executablePath: CHROMIUM } },
    },
  ],
})
