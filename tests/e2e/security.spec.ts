import { test, expect } from '@playwright/test'

/**
 * Security headers and HTTPS enforcement.
 *
 * These run against a production server (`next start`), because the policy in
 * `src/proxy.ts` deliberately relaxes in development and the HTTPS redirect is
 * skipped entirely there.
 */

const securityHeaders = async (request: import('@playwright/test').APIRequestContext, path: string) => {
  const response = await request.get(path, { maxRedirects: 0 })
  return response.headers()
}

test.describe('security headers', () => {
  test('the public site sends a content security policy with no eval', async ({ request }) => {
    const headers = await securityHeaders(request, '/')
    const csp = headers['content-security-policy']

    expect(csp, 'a public page must carry a CSP').toBeTruthy()
    // The whole reason the policy drops the nonce is to avoid needing eval.
    expect(csp).not.toContain('unsafe-eval')
    for (const directive of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ]) {
      expect(csp).toContain(directive)
    }
  })

  test('every response carries the baseline hardening headers', async ({ request }) => {
    const headers = await securityHeaders(request, '/')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(headers['permissions-policy']).toContain('geolocation=()')
    // Next advertises its version by default, which is free reconnaissance.
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('the admin still gets the directives that do not touch scripts', async ({ request }) => {
    const headers = await securityHeaders(request, '/admin')
    const csp = headers['content-security-policy']
    expect(csp, 'the admin must not be left with no policy at all').toBeTruthy()
    expect(csp).toContain("frame-ancestors 'self'")
    expect(csp).toContain("object-src 'none'")
  })
})

test.describe('HTTPS enforcement', () => {
  /*
   * The deciding inputs are the forwarded headers, because behind a load
   * balancer the protocol and host Next sees are both internal. Reading the
   * internal host once made this redirect silently never fire.
   */
  test('a forwarded plain-HTTP request is redirected to the same URL on HTTPS', async ({ request }) => {
    const response = await request.get('/about', {
      headers: { host: 'finquiry.example', 'x-forwarded-proto': 'http' },
      maxRedirects: 0,
    })

    // Independent of the configured site URL: the redirect is decided entirely
    // by the forwarded headers, so it holds on any production deployment.
    expect(response.status()).toBe(308)
    expect(response.headers()['location']).toBe('https://finquiry.example/about')
  })

  test('a request that is already HTTPS is served, not redirected', async ({ request }) => {
    const response = await request.get('/about', {
      headers: { host: 'finquiry.example', 'x-forwarded-proto': 'https' },
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
  })

  test('localhost is never redirected, so a production build stays testable', async ({ request }) => {
    const response = await request.get('/', {
      headers: { 'x-forwarded-proto': 'http' },
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
  })
})

test.describe('secret exposure', () => {
  test('no server-only environment variable reaches the HTML', async ({ page }) => {
    await page.goto('/')
    const html = await page.content()

    for (const name of [
      'PAYLOAD_SECRET',
      'DATABASE_URL',
      'PREVIEW_SECRET',
      'REVALIDATION_SECRET',
      'S3_SECRET_ACCESS_KEY',
      'SMTP_PASS',
    ]) {
      expect(html, `${name} must never appear in a served document`).not.toContain(name)
    }
  })
})
