import { test, expect } from '@playwright/test'

/** The server rejects submissions faster than a person could manage. */
const HUMAN_PAUSE = 3200

const fillStepOne = async (page: import('@playwright/test').Page) => {
  await page.fill('#field-fullName', 'A. Collector')
  await page.fill('#field-whatsapp', '9876543210')
  await page.fill('#field-city', 'Pune')
  await page.fill('#field-state', 'Maharashtra')
  await page.fill('#field-pincode', '411001')
}

test.describe('sourcing enquiry form', () => {
  test('shows field errors and focuses the summary on an invalid submit', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await page.getByRole('button', { name: /submit my requirement/i }).click()

    const summary = page.locator('form [role="alert"]').first()
    await expect(summary).toBeVisible()
    await expect(summary).toBeFocused()
    await expect(summary).toContainText('Enter your name.')
    await expect(summary).toContainText('WhatsApp')
  })

  test('preserves values when moving between steps', async ({ page }) => {
    await page.goto('/source-a-fish')
    await fillStepOne(page)

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Super red arowana')
    await page.getByRole('button', { name: 'Back', exact: true }).click()

    await expect(page.locator('#field-fullName')).toHaveValue('A. Collector')

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.locator('#field-fishRequired')).toHaveValue('Super red arowana')
  })

  test('can be completed with the keyboard alone', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await page.locator('#field-fullName').focus()
    await page.keyboard.type('Keyboard Collector')
    await page.keyboard.press('Tab')
    await page.keyboard.type('9876543210')

    await page.fill('#field-city', 'Nagpur')
    await page.fill('#field-state', 'Maharashtra')
    await page.fill('#field-pincode', '440001')

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Black diamond stingray')

    // Jump to the final step through the step indicator, using the keyboard.
    const lastStep = page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last()
    await lastStep.focus()
    await page.keyboard.press('Enter')

    await page.locator('#field-consent').focus()
    await page.keyboard.press('Space')
    await expect(page.locator('#field-consent')).toBeChecked()
  })

  test('creates an enquiry, shows the request ID and offers a WhatsApp handover', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await fillStepOne(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Super red arowana, 10-12 inches')

    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    await page.waitForURL(/\/thank-you/, { timeout: 30_000 })

    const requestId = page.locator('body')
    await expect(requestId).toContainText(/FQ-\d{4}-\d{4}/)

    const whatsapp = page.locator('a[href^="https://wa.me/"]').first()
    await expect(whatsapp).toBeVisible()

    const href = await whatsapp.getAttribute('href')
    const shown = (await page.locator('body').innerText()).match(/FQ-\d{4}-\d{4}/)?.[0]
    expect(decodeURIComponent(href ?? '')).toContain(shown)

    // The handover must not carry the customer's own details.
    expect(href).not.toContain('9876543210')
    expect(decodeURIComponent(href ?? '')).not.toContain('A. Collector')
    expect(page.url()).not.toContain('9876543210')
  })

  test('rejects an unsupported upload type in the browser', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()

    await page.setInputFiles('#field-referenceImage', {
      name: 'evil.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
    })

    await expect(page.locator('#field-referenceImage-error')).toContainText(/JPG, PNG or WebP/i)
  })
})
