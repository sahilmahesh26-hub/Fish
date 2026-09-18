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
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe('hidden')

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
