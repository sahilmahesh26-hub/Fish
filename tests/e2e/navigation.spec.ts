import { test, expect } from '@playwright/test'

test.describe('site navigation', () => {
  test('desktop navigation reaches every primary page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop navigation only')

    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await expect(nav).toBeVisible()

    for (const [label, path] of [
      ['Source a Fish', '/source-a-fish'],
      ['How It Works', '/how-it-works'],
      ['Deliveries', '/deliveries'],
      ['Custom Aquariums', '/custom-aquariums'],
      ['Knowledge', '/knowledge'],
      ['About', '/about'],
    ] as const) {
      await page.goto('/')
      await nav.getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${path}$`))
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('header CTA routes to the enquiry form', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop header only')
    await page.goto('/')
    await page.getByRole('banner').getByRole('link', { name: 'Start Your Search' }).click()
    await expect(page).toHaveURL(/\/source-a-fish$/)
  })

  test('exactly one h1 per page', async ({ page }) => {
    for (const path of ['/', '/source-a-fish', '/knowledge', '/deliveries', '/about']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    }
  })

  test('skip link is reachable and moves focus to the content', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Keyboard test')
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to content/i })
    await expect(skip).toBeFocused()
    await skip.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
  })
})

test.describe('mobile menu', () => {
  test('opens, traps focus, closes on Escape and restores focus', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile menu only')

    await page.goto('/')
    const trigger = page.getByRole('button', { name: /open menu/i })
    await expect(trigger).toBeVisible()

    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Body scroll is locked while the menu is open.
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    // Focus has moved into the panel.
    const focusedInDialog = await page.evaluate(() => {
      const panel = document.querySelector('[role="dialog"]')
      return Boolean(panel && document.activeElement && panel.contains(document.activeElement))
    })
    expect(focusedInDialog).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    // Scroll lock released.
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  })

  test('the overlay actually covers the viewport', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile menu only')

    /*
     * Regression: the menu opened but could not be seen.
     *
     * `backdrop-filter` on the sticky header made the header a containing
     * block for every `position: fixed` descendant, and the menu renders
     * inside it. The overlay's `inset: 0` then resolved against the header's
     * own 72px strip instead of the viewport, so tapping the trigger flipped
     * it to a close icon and nothing else appeared to happen.
     *
     * Every existing test passed throughout, because the panel was in the DOM,
     * focusable, and locking body scroll the whole time. Only geometry catches
     * this, so geometry is what is asserted: the overlay has to fill the
     * screen, and a link near the bottom of the list has to be somewhere a
     * thumb can actually reach it.
     */
    await page.goto('/')
    await page.getByRole('button', { name: /open menu/i }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const viewport = page.viewportSize()
    if (!viewport) throw new Error('no viewport')

    const box = await dialog.boundingBox()
    expect(box).not.toBeNull()
    // Full bleed horizontally, and covering the screen vertically rather than
    // the header strip it used to be trapped in.
    expect(box!.width).toBeGreaterThanOrEqual(viewport.width - 1)
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height * 0.9)

    // The first navigation link is on screen, which it was not when the
    // overlay was clipped to the header.
    await expect(dialog.getByRole('link').first()).toBeInViewport()

    // And the enquiry CTA stays reachable without hunting: it is pinned to the
    // foot of the panel, so it is on screen even though the list scrolls.
    const panelCta = dialog.getByRole('link', { name: /start your search/i })
    await expect(panelCta).toBeInViewport()

    /*
     * The consent sheet must not sit on top of the open menu.
     *
     * Both used to take `--z-menu`, so the winner was whichever rendered last
     * in the DOM, which was the sheet: opening the menu on a first visit put
     * the cookie notice over the navigation and over this very button. The
     * sheet now takes `--z-consent`, one step lower.
     */
    const ctaBox = await panelCta.boundingBox()
    const topAtCta = await page.evaluate(
      ([x, y]) => {
        const el = document.elementFromPoint(x, y)
        return el?.closest('[class*="ConsentBanner"]') ? 'consent' : 'menu'
      },
      [ctaBox!.x + ctaBox!.width / 2, ctaBox!.y + ctaBox!.height / 2],
    )
    expect(topAtCta).toBe('menu')
  })

  test('a menu link navigates and closes the menu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile menu only')
    await page.goto('/')
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Source a Fish' }).click()
    await expect(page).toHaveURL(/\/source-a-fish$/)
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})

test.describe('404', () => {
  test('returns a 404 status and an on-brand page', async ({ page }) => {
    const response = await page.goto('/no-such-page-exists')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Start Your Search' }).first()).toBeVisible()
  })
})
