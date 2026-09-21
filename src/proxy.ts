import { NextResponse, type NextRequest } from 'next/server'

/**
 * Security headers for the public site.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; behaviour is
 * unchanged.
 *
 * ---------------------------------------------------------------------------
 * Why this policy has no nonce
 * ---------------------------------------------------------------------------
 * Most of this site is statically prerendered, which is what keeps it fast and
 * indexable. A nonce must be minted per request, so a prerendered document
 * cannot carry one — and a nonce-based policy implies `strict-dynamic`, which
 * makes browsers ignore `'self'` and every host source. Applied to static
 * output the result is a site whose JavaScript silently never runs. That was a
 * real production-only bug here: every script on every prerendered page was
 * refused while the dev server looked fine.
 *
 * The fix is not to force the public site dynamic — that would cost the
 * performance and SEO the static rendering exists for. It is to drop the nonce
 * and let Next's inline bootstrap run under `'unsafe-inline'`, while keeping
 * every other directive tight.
 *
 * If a genuinely dynamic route ever needs a nonce, scope it to that route group
 * and render it dynamically; do not reintroduce a nonce expectation here, where
 * it would apply to build-time static output.
 *
 * `'unsafe-eval'` is never set in production.
 */
const isDev = process.env.NODE_ENV === 'development'

/** Same-origin media is served by Payload; S3/CDN is added only when configured. */
const mediaOrigins = (() => {
  const origins = new Set<string>()
  if (process.env.S3_ENDPOINT) {
    try {
      origins.add(new URL(process.env.S3_ENDPOINT).origin)
    } catch {
      // A malformed endpoint must not widen the policy.
    }
  }
  return Array.from(origins)
})()

/**
 * Analytics origins, added only for the provider actually configured.
 *
 * Scripts are additionally gated behind cookie consent at runtime, so the CSP
 * entry is a ceiling, not a licence to load.
 */
const analyticsOrigins = (() => {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
  const custom = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL

  const origins = new Set<string>()
  if (custom) {
    try {
      origins.add(new URL(custom).origin)
    } catch {
      /* ignore a malformed URL rather than widening the policy */
    }
  }

  if (provider === 'plausible') origins.add('https://plausible.io')
  if (provider === 'umami') origins.add('https://analytics.umami.is')
  if (provider === 'ga4') {
    origins.add('https://www.googletagmanager.com')
    origins.add('https://www.google-analytics.com')
  }

  return Array.from(origins)
})()

const join = (...parts: (string | string[])[]) => parts.flat().filter(Boolean).join(' ')

const PUBLIC_CSP = [
  `default-src 'self'`,
  // Next's inline bootstrap needs `unsafe-inline`; see the note above.
  // `unsafe-eval` is development-only — React's dev build requires it.
  join(`script-src 'self' 'unsafe-inline'`, isDev ? "'unsafe-eval'" : '', analyticsOrigins),
  // Next injects inline styles for CSS-in-JS and font preloading.
  `style-src 'self' 'unsafe-inline'`,
  // `data:` and `blob:` cover the image pipeline's placeholders and previews.
  join(`img-src 'self' data: blob:`, mediaOrigins, analyticsOrigins),
  join(`media-src 'self' blob:`, mediaOrigins),
  // Fonts are self-hosted by next/font; no third-party font origin is allowed.
  `font-src 'self'`,
  join(`connect-src 'self'`, mediaOrigins, analyticsOrigins),
  // Only the two video hosts the Video block supports.
  `frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

/**
 * A deliberately partial policy for the Payload admin and API.
 *
 * The admin bundle evaluates code at runtime, so a `script-src` it could live
 * with would need `'unsafe-eval'` — which is exactly what the public policy
 * exists to forbid. Rather than choose between a policy that breaks the CMS and
 * one that legitimises `eval` site-wide, this sets only the directives that do
 * not touch script execution. Clickjacking, `<base>` injection, plugin
 * embedding and form exfiltration are all still closed off; script execution is
 * left to Payload's own model and to the session auth in front of it.
 */
const ADMIN_CSP = [
  `frame-ancestors 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

/**
 * The host the visitor actually typed.
 *
 * `request.nextUrl.host` is the address the server was reached on, which behind
 * a load balancer is an internal one, using it made the HTTPS redirect below
 * silently never fire, because every real request looked like it came from
 * localhost. The forwarded headers carry the external host; `nextUrl` is only
 * the last resort.
 *
 * `x-forwarded-host` can hold a comma-separated list when a request crossed
 * several proxies; the first entry is the original client-facing host.
 */
const externalHost = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-host')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('host') ?? request.nextUrl.host
}

const isLocalHost = (host: string) =>
  host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const host = externalHost(request)

  /*
   * Force HTTPS in production.
   *
   * The deciding header is `x-forwarded-proto`, set by the proxy or load
   * balancer that terminated TLS, `request.nextUrl.protocol` reflects the
   * internal hop and would cause a redirect loop behind a terminating proxy.
   * Only redirect when the forwarded protocol says plain HTTP, and never in
   * development or on a local host.
   */
  const forwardedProto = request.headers.get('x-forwarded-proto')

  if (!isDev && !isLocalHost(host) && forwardedProto === 'http') {
    const target = request.nextUrl.clone()
    target.protocol = 'https:'
    // Redirect to the host the visitor used, not the internal one Next saw.
    target.host = host
    target.port = ''
    return NextResponse.redirect(target, 308)
  }

  // The Payload admin and API manage their own security model, and the admin
  // bundle needs allowances the public site should not have, but "not the
  // public policy" is not the same as "no policy".
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    const adminResponse = NextResponse.next()
    adminResponse.headers.set('Content-Security-Policy', ADMIN_CSP)
    return adminResponse
  }

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', PUBLIC_CSP)
  return response
}

export const config = {
  matcher: [
    /*
     * Everything except Next.js internals and static files. Prefetches are
     * skipped because they reuse the policy from the original document.
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|media/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
