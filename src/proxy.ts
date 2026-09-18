import { NextResponse, type NextRequest } from 'next/server'

/**
 * Content Security Policy.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; the behaviour is
 * unchanged.
 *
 * Why `'unsafe-inline'` for scripts rather than a nonce:
 *
 * Most of this site is statically prerendered, which is what keeps it fast. A
 * nonce has to be minted per request, so a prerendered document cannot carry
 * one — and a nonce-based policy (which implies `strict-dynamic`, making
 * browsers ignore `'self'` and every host source) blocks *every* script on
 * those pages. The result is a site whose JavaScript silently never runs.
 *
 * Next's own inline bootstrap scripts therefore need `'unsafe-inline'`. Every
 * other directive stays strict: no `object-src`, no arbitrary `base-uri`, forms
 * may only post to this origin, and framing is limited to this origin.
 *
 * To run a nonce-based policy instead, every route has to be dynamically
 * rendered — see README, "Security".
 */
const isDev = process.env.NODE_ENV === 'development'

const PUBLIC_CSP = [
  `default-src 'self'`,
  // `unsafe-eval` is development-only: React's dev build needs it for its
  // debugging features. Production never gets it.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // Next injects inline styles for CSS-in-JS and font preloading.
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data: https:`,
  `media-src 'self' https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https:`,
  // YouTube/Vimeo embeds in the Video block.
  `frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // The admin and the Payload API manage their own security model, and the
  // admin bundle needs allowances the public site should not have.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    return NextResponse.next()
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
