import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Content Security Policy.
 *
 * `unsafe-inline`/`unsafe-eval` are scoped to the Payload admin route group only
 * (see `middleware.ts`); the public site runs the strict policy below.
 */
const isDev = process.env.NODE_ENV === 'development'

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
          ...(isDev
            ? []
            : [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]),
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
