import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Content Security Policy.
 *
 * `unsafe-inline`/`unsafe-eval` are scoped to the Payload admin route group only
 * (see `middleware.ts`); the public site runs the strict policy below.
 */
const isDev = process.env.NODE_ENV === 'development'

/**
 * HSTS, added only once HTTPS genuinely works.
 *
 * Sending it from an origin that is not fully HTTPS locks visitors out of the
 * site in a way that cannot be undone from the server — the browser remembers
 * it. So it is emitted only when the configured site URL is already https.
 *
 * `preload` is a separate, stronger commitment: submitting to the preload list
 * is effectively irreversible for months and covers every subdomain. It stays
 * off until the owner explicitly opts in with HSTS_PRELOAD=true, having
 * confirmed the apex and every required subdomain serve HTTPS.
 */
const hstsHeader = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  if (isDev || !siteUrl.startsWith('https://')) return []

  const directives = ['max-age=63072000', 'includeSubDomains']
  if (process.env.HSTS_PRELOAD === 'true') directives.push('preload')

  return [{ key: 'Strict-Transport-Security', value: directives.join('; ') }]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    /*
     * Lets `app/global-not-found.tsx` render a complete document for routes
     * that match no segment at all. Without it, Next falls back to its own
     * bare error shell, whose <html> carries no `lang` and no <main> — an
     * accessibility failure on the 404 page.
     */
    globalNotFound: true,
  },
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...(process.env.S3_ENDPOINT
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.S3_ENDPOINT).hostname,
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          ...hstsHeader(),
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
