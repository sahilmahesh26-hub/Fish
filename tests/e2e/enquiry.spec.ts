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
  test('lists every field error and focuses the first invalid control', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await page.getByRole('button', { name: /submit my requirement/i }).click()

    const summary = page.locator('form [role="alert"]').first()
    await expect(summary).toBeVisible()
    await expect(summary).toContainText('Enter your name.')
    await expect(summary).toContainText('WhatsApp')

    /*
     * Focus goes to the control, not to the summary. The summary is announced
     * by `role="alert"` either way, and landing on the first thing that needs
     * fixing means the person can type straight away instead of reading a list
     * and then hunting for the input.
     */
    await expect(page.locator('#field-fullName')).toBeFocused()

    // Every message must be a sentence a customer can act on — no field may
    // fall through to a validation library's default wording.
    const messages = await summary.locator('li a').allInnerTexts()
    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(message, 'a field reported a default validation message').not.toMatch(
        /^Invalid( input)?$/i,
      )
    }
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

  test('rejects an invalid phone number and PIN code on the server', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await page.fill('#field-fullName', 'A. Collector')
    await page.fill('#field-whatsapp', '1234567890')
    await page.fill('#field-city', 'Pune')
    await page.fill('#field-state', 'Maharashtra')
    await page.fill('#field-pincode', '4110')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    const summary = page.locator('form [role="alert"]').first()
    await expect(summary).toBeVisible()
    await expect(summary).toContainText(/valid Indian mobile number/i)
    await expect(summary).toContainText(/6-digit PIN code/i)

    // Everything the person did type must survive the round trip.
    await expect(page.locator('#field-fullName')).toHaveValue('A. Collector')
    await expect(page.locator('#field-city')).toHaveValue('Pune')
  })

  test('accepts a number written with a country code and separators', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await page.fill('#field-fullName', 'Format Collector')
    await page.fill('#field-whatsapp', '+91 98765 43210')
    await page.fill('#field-city', 'Kochi')
    await page.fill('#field-state', 'Kerala')
    await page.fill('#field-pincode', '682001')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Wild-caught altum angelfish')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    await page.waitForURL(/\/thank-you/, { timeout: 30_000 })
    await expect(page.locator('body')).toContainText(/FQ-\d{4}-\d{4}/)
  })

  test('a repeated submission of the same form does not create a second enquiry', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    await fillStepOne(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Duplicate guard specimen')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')

    /*
     * Replays the exact payload the browser would send, token and all. Clicking
     * twice cannot test this — React disables the button while the action is in
     * flight, which is the client-side half of the protection. This exercises
     * the server-side half, which is what still holds when the retry arrives
     * from a reloaded page or a different instance.
     */
    const token = await page.locator('input[name="submissionToken"]').inputValue()
    expect(token, 'the form must mint an idempotency token').toMatch(/^[0-9a-f-]{36}$/i)

    await page.getByRole('button', { name: /submit my requirement/i }).click()
    await page.waitForURL(/\/thank-you/, { timeout: 30_000 })
    const firstId = (await page.locator('body').innerText()).match(/FQ-\d{4}-\d{4}/)?.[0]
    expect(firstId).toBeTruthy()

    // Second attempt, same token: the server must recognise it and hand back
    // the original request ID rather than opening a new enquiry.
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)
    await fillStepOne(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Duplicate guard specimen')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')
    await page.locator('input[name="submissionToken"]').evaluate(
      (el, value) => ((el as HTMLInputElement).value = value),
      token,
    )
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    await page.waitForURL(/\/thank-you/, { timeout: 30_000 })
    const secondId = (await page.locator('body').innerText()).match(/FQ-\d{4}-\d{4}/)?.[0]
    expect(secondId, 'a replayed submission must return the original request ID').toBe(firstId)
  })

  test('a submission from another origin is refused', async ({ page }) => {
    await page.goto('/source-a-fish')
    await page.waitForTimeout(HUMAN_PAUSE)

    // Server Actions post to the page URL; forging the Origin header is what a
    // cross-site submission would look like.
    await page.route('**/source-a-fish', async (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      await route.continue({ headers: { ...route.request().headers(), origin: 'https://evil.example' } })
    })

    await fillStepOne(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.fill('#field-fishRequired', 'Cross-origin specimen')
    await page.getByRole('navigation', { name: 'Form progress' }).getByRole('button').last().click()
    await page.check('#field-consent')
    await page.getByRole('button', { name: /submit my requirement/i }).click()

    // Either our own origin check or Next's built-in one may catch it; what
    // matters is that no enquiry is created and the page does not advance.
    await expect(page).not.toHaveURL(/\/thank-you/, { timeout: 10_000 })
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
