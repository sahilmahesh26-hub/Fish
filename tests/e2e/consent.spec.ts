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

  test('leaves the primary call to action usable while it is up', async ({ page }, testInfo) => {
    /*
     * Regression: the consent card used to sit in the bottom-LEFT corner.
     *
     * Every hero on this site sets its copy and its buttons hard against the
     * leading edge, so on a desktop the card landed squarely on "Start Your
     * Search": the one control a visitor has to be able to reach while
     * deciding about cookies. It now sits in the trailing corner, which is
     * the only empty quarter of the first screen, and the two rectangles must
     * stay apart as either one moves.
     *
     * On a phone the banner is a full-width sheet along the bottom edge,
     * which is the right pattern for a consent gate and unavoidably overlaps
     * the foot of a hero that is taller than the screen. What matters there
     * is that the action is still reachable rather than trapped underneath,
     * so that is what is asserted.
     */
    await page.goto('/')

    const banner = page.getByRole('region', { name: /cookies on this site/i })
    await expect(banner).toBeVisible()

    const cta = page.getByRole('link', { name: /start your search/i }).first()
    const bannerBox = await banner.boundingBox()
    expect(bannerBox).not.toBeNull()

    if (testInfo.project.name === 'mobile') {
      /*
       * The sheet spans the bottom edge, so on a hero taller than the screen
       * it does sit over the buttons at scroll-top. What has to hold is that
       * the action still works: the click scrolls it clear and lands on it
       * rather than being swallowed by the sheet. If the sheet ever became
       * modal, or grew tall enough to trap the control, this fails.
       */
      await cta.click()
      await expect(page).toHaveURL(/\/source-a-fish/)
      // And the sheet is still there afterwards: navigating is not a decision.
      await expect(page.getByRole('region', { name: /cookies on this site/i })).toBeVisible()
      return
    }

    await expect(cta).toBeVisible()
    const ctaBox = await cta.boundingBox()
    expect(ctaBox).not.toBeNull()

    const overlaps =
      bannerBox!.x < ctaBox!.x + ctaBox!.width &&
      bannerBox!.x + bannerBox!.width > ctaBox!.x &&
      bannerBox!.y < ctaBox!.y + ctaBox!.height &&
      bannerBox!.y + bannerBox!.height > ctaBox!.y
    expect(overlaps).toBe(false)
    await expect(cta).toBeInViewport()
  })

  test('takes a reasonable share of a mobile viewport, with readable copy', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile proportions only')

    await page.goto('/')
    const banner = page.getByRole('region', { name: /cookies on this site/i })
    await expect(banner).toBeVisible()

    const viewport = page.viewportSize()
    const box = await banner.boundingBox()
    expect(box).not.toBeNull()

    // A consent gate needs presence, but it is not the page. Half the screen
    // is too much; it once stood at 46% and cut the hero paragraph in half.
    expect(box!.height / viewport!.height).toBeLessThan(0.45)

    /*
     * Body copy stays at 16px on a phone.
     *
     * This is the text somebody reads to make a consent decision, so it is
     * not the place to save vertical space by shrinking type. An earlier fix
     * dropped it to 12px to make the sheet shorter and the responsive harness
     * caught it on every route.
     */
    const bodySize = await banner
      .locator('p')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(bodySize).toBeGreaterThanOrEqual(16)
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

    await page
      .getByRole('contentinfo')
      .getByRole('button', { name: /cookie preferences/i })
      .click()
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
