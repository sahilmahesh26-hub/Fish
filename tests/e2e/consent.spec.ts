import { test, expect } from '@playwright/test'

const CONSENT_COOKIE = 'finquiry_consent'

/**
 * Cookie consent.
 *
 * The behaviour that matters is not that a banner appears — it is that nothing
 * optional runs before someone agrees, that refusing is exactly as easy as
 * accepting, and that the decision can be changed later.
 */
test.describe('cookie consent', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('asks once, and offers Accept and Reject with equal weight', async ({ page }) => {
    await page.goto('/')

    const banner = page.getByRole('region', { name: /cookies on this site/i })
    await expect(banner).toBeVisible()

    const accept = banner.getByRole('button', { name: /accept analytics/i })
    const reject = banner.getByRole('button', { name: /reject analytics/i })
    await expect(accept).toBeVisible()
    await expect(reject).toBeVisible()

    // Non-deceptive: both choices are the same size, so neither is nudged.
    const acceptBox = await accept.boundingBox()
    const rejectBox = await reject.boundingBox()
    expect(acceptBox).not.toBeNull()
    expect(rejectBox).not.toBeNull()
    expect(Math.abs((acceptBox?.height ?? 0) - (rejectBox?.height ?? 0))).toBeLessThan(2)
    expect(Math.abs((acceptBox?.width ?? 0) - (rejectBox?.width ?? 0))).toBeLessThan(2)
  })

  test('loads no analytics request before a decision', async ({ page }) => {
    const thirdParty: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (/plausible|umami|googletagmanager|google-analytics/.test(url)) thirdParty.push(url)
    })

    await page.goto('/')
    await page.waitForTimeout(1500)

    expect(thirdParty).toEqual([])
    // And no consent cookie has been written by merely showing the banner.
    const cookies = await page.context().cookies()
    expect(cookies.find((c) => c.name === CONSENT_COOKIE)).toBeUndefined()
  })

  test('rejecting stores the refusal and dismisses the banner', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /reject analytics/i }).click()

    await expect(page.getByRole('region', { name: /cookies on this site/i })).toBeHidden()

    const cookie = (await page.context().cookies()).find((c) => c.name === CONSENT_COOKIE)
    expect(cookie).toBeDefined()
    expect(decodeURIComponent(cookie?.value ?? '')).toContain('"analytics":false')

    // The decision survives a reload — nobody is asked twice.
    await page.reload()
    await expect(page.getByRole('region', { name: /cookies on this site/i })).toBeHidden()
  })

  test('accepting stores consent', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /accept analytics/i }).click()

    const cookie = (await page.context().cookies()).find((c) => c.name === CONSENT_COOKIE)
    expect(decodeURIComponent(cookie?.value ?? '')).toContain('"analytics":true')
  })

  test('preferences dialog is a real modal: focus trapped, Escape closes', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /manage preferences/i }).click()

    const dialog = page.getByRole('dialog', { name: /cookie preferences/i })
    await expect(dialog).toBeVisible()

    // Focus moved inside.
    const focusedInside = await page.evaluate(() => {
      const panel = document.querySelector('[role="dialog"]')
      return Boolean(panel && document.activeElement && panel.contains(document.activeElement))
    })
    expect(focusedInside).toBe(true)

    // Necessary cookies cannot be switched off.
    const necessary = dialog.locator('#consent-necessary')
    await expect(necessary).toBeChecked()
    await expect(necessary).toBeDisabled()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('preferences can be reopened from the footer after deciding', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /reject analytics/i }).click()
    await expect(page.getByRole('region', { name: /cookies on this site/i })).toBeHidden()

    await page.getByRole('contentinfo').getByRole('button', { name: /cookie preferences/i }).click()
    await expect(page.getByRole('dialog', { name: /cookie preferences/i })).toBeVisible()
  })

  test('saving analytics from the dialog records consent', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /manage preferences/i }).click()

    await page.locator('#consent-analytics').check()
    await page.getByRole('button', { name: /save preferences/i }).click()

    const cookie = (await page.context().cookies()).find((c) => c.name === CONSENT_COOKIE)
    expect(decodeURIComponent(cookie?.value ?? '')).toContain('"analytics":true')
  })

  test('cookie policy page is reachable and lists the categories', async ({ page }) => {
    const response = await page.goto('/cookie-policy')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/necessary cookies/i).first()).toBeVisible()
    await expect(page.getByText(/analytics cookies/i).first()).toBeVisible()
  })
})
