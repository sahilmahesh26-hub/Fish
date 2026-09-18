import { test, expect } from '@playwright/test'

test.describe('knowledge hub', () => {
  test('lists articles or explains the empty state, and filters work', async ({ page }) => {
    await page.goto('/knowledge')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const cards = page.locator('main ul li a[href^="/knowledge/"]')
    const count = await cards.count()

    if (count === 0) {
      // Every starter article ships as a draft, so an empty hub is expected
      // until an editor publishes one — it must say so rather than look broken.
      await expect(page.getByText(/first guides are being written|no published article/i)).toBeVisible()
    } else {
      await cards.first().click()
      await expect(page).toHaveURL(/\/knowledge\/[a-z0-9-]+$/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('category filter marks the active choice', async ({ page }) => {
    await page.goto('/knowledge')
    const filters = page.getByRole('navigation', { name: 'Article categories' })
    await expect(filters).toBeVisible()
    await expect(filters.getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'page')
  })

  test('serves an RSS feed', async ({ request }) => {
    const response = await request.get('/knowledge/rss.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/rss+xml')
    expect(await response.text()).toContain('<rss')
  })
})

test.describe('deliveries', () => {
  test('shows an honest empty state when nothing is published', async ({ page }) => {
    await page.goto('/deliveries')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const cards = page.locator('main ul li a[href^="/deliveries/"]')
    if ((await cards.count()) === 0) {
      await expect(page.getByText(/first stories are being documented/i)).toBeVisible()
      // Crucially, no invented delivery is ever shown in its place.
      await expect(page.getByText(/testimonial/i)).toHaveCount(0)
    }
  })
})

test.describe('policy pages', () => {
  test('are reachable and declare that they await legal review', async ({ page }) => {
    for (const path of [
      '/privacy-policy',
      '/terms-and-conditions',
      '/sourcing-and-delivery-policy',
      '/restricted-species-policy',
    ]) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByText(/pending legal review/i)).toBeVisible()
    }
  })

  test('are excluded from the sitemap while unreviewed', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).not.toContain('/privacy-policy')
    expect(sitemap).toContain('/about')
  })
})

test.describe('draft protection', () => {
  test('draft posts are not readable through the public API', async ({ request }) => {
    const response = await request.get('/api/posts?limit=100')
    const body = await response.json()
    // Every seeded article is a draft, so the public API must return none.
    expect(body.totalDocs).toBe(0)
  })

  test('preview requires a valid secret', async ({ request }) => {
    const response = await request.get('/api/preview?collection=posts&slug=anything', {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(401)
  })

  test('enquiries are never publicly readable', async ({ request }) => {
    expect((await request.get('/api/enquiries')).status()).toBe(403)
  })

  test('enquiry uploads are never publicly readable', async ({ request }) => {
    expect((await request.get('/api/private-media')).status()).toBe(403)
  })
})
