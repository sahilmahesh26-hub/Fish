import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'finquiry.enquiry.draft'

/**
 * The enquiry form autosaves an in-progress requirement so a reload does not
 * lose it. What it must never do is leave someone's name or phone number in a
 * shared browser, or keep anything indefinitely.
 */
test.describe('enquiry form autosave', () => {
  test('restores the requirement but never the identifying fields', async ({ page }) => {
    await page.goto('/source-a-fish')

    const steps = page.getByRole('navigation', { name: 'Form progress' }).getByRole('button')

    await steps.nth(1).click()
    await page.fill('#field-fishRequired', 'Black diamond stingray, 8 inches')
    await page.fill('#field-variety', 'Black diamond')

    await steps.first().click()
    await page.fill('#field-fullName', 'Private Person')
    await page.fill('#field-whatsapp', '9876543210')
    await page.waitForTimeout(500)

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    expect(stored).toBeTruthy()
    expect(stored).not.toContain('Private Person')
    expect(stored).not.toContain('9876543210')
    // Only allowlisted requirement fields are persisted — no hidden anti-spam,
    // attribution or server-action fields.
    const keys = Object.keys(JSON.parse(stored as string).values)
    expect(keys.sort()).toEqual(['fishRequired', 'variety'])

    await page.reload()
    await steps.nth(1).click()
    await expect(page.locator('#field-fishRequired')).toHaveValue(/Black diamond stingray/)
    await expect(page.locator('#field-variety')).toHaveValue('Black diamond')

    await steps.first().click()
    await expect(page.locator('#field-fullName')).toHaveValue('')
    await expect(page.locator('#field-whatsapp')).toHaveValue('')
  })

  test('discards a draft older than its 24-hour lifetime', async ({ page }) => {
    await page.goto('/source-a-fish')
    const steps = page.getByRole('navigation', { name: 'Form progress' }).getByRole('button')

    await steps.nth(1).click()
    await page.fill('#field-fishRequired', 'Super red arowana')
    await page.waitForTimeout(500)

    await page.evaluate((key) => {
      const raw = JSON.parse(localStorage.getItem(key) ?? '{}')
      raw.savedAt = Date.now() - 25 * 60 * 60 * 1000
      localStorage.setItem(key, JSON.stringify(raw))
    }, STORAGE_KEY)

    await page.reload()
    await steps.nth(1).click()
    await expect(page.locator('#field-fishRequired')).toHaveValue('')
  })

  test('clears the draft once the enquiry is submitted', async ({ page }) => {
    await page.goto('/source-a-fish')
    // Past the server's anti-bot timing threshold.
    await page.waitForTimeout(3200)

    await page.fill('#field-fullName', 'A. Collector')
    await page.fill('#field-whatsapp', '9876543210')
    await page.fill('#field-city', 'Pune')
    await page.fill('#field-state', 'Maharashtra')
    await page.fill('#field-pincode', '411001')

    const steps = page.getByRole('navigation', { name: 'Form progress' }).getByRole('button')
    await steps.nth(1).click()
    await page.fill('#field-fishRequired', 'Super red arowana')

    await steps.last().click()
    await page.check('#field-consent')
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    await page.waitForURL(/\/thank-you/, { timeout: 30_000 })
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    expect(stored).toBeNull()
  })
})
