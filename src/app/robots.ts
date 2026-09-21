import type { MetadataRoute } from 'next'
import { siteUrl, isProductionOrigin } from '@/lib/env'

const robots = async (): Promise<MetadataRoute.Robots> => {
  const base = siteUrl()
  /*
   * Anything that is not a production origin is kept out of the index
   * entirely, so a staging or preview deployment can never outrank the real
   * site. `isProductionOrigin` also rejects plain http, per-deploy preview
   * hosts and an unset variable, all of which used to read as production
   * because the check here only looked for the word "localhost".
   */
  const isProduction = isProductionOrigin(base)

  return {
    rules: isProduction
      ? [
          {
            userAgent: '*',
            allow: '/',
            disallow: [
              // The CMS. Blocked from crawling, not from access — robots.txt is
              // not a security control; the admin routes have real auth.
              '/admin',
              // Internal endpoints, including the draft-preview entry point.
              '/api/',
              // Request confirmation: reachable only after a submission.
              '/thank-you',
            ],
          },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    // Filtered listing views (`/knowledge?category=…`) are intentionally NOT
    // disallowed here. They stay crawlable so articles are never orphaned, and
    // are kept out of the index by a `noindex, follow` directive plus a
    // canonical pointing at the unfiltered listing — which consolidates
    // signals, whereas a robots block would merely hide the duplication.
    sitemap: `${base}/sitemap.xml`,
    host: isProduction ? base.replace(/^https?:\/\//, '') : undefined,
  }
}

export default robots
