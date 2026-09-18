import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/env'

const robots = async (): Promise<MetadataRoute.Robots> => {
  const base = siteUrl()
  // Anything that is not a production origin is kept out of the index entirely.
  const isProduction = !base.includes('localhost') && !base.includes('127.0.0.1')

  return {
    rules: isProduction
      ? [
          {
            userAgent: '*',
            allow: '/',
            disallow: [
              '/admin',
              '/api/',
              '/thank-you',
              // Query-string views duplicate the canonical listing pages.
              '/deliveries?',
              '/knowledge?',
            ],
          },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  }
}

export default robots
