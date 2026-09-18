import type { MetadataRoute } from 'next'
import { getAllPageSlugs, getPosts, getDeliveries } from '@/lib/queries'
import { siteUrl } from '@/lib/env'
import { isIndexablePage } from '@/lib/seo'

type Entry = MetadataRoute.Sitemap[number]

/**
 * Routes owned by code rather than by a Pages record.
 *
 * `/deliveries`, `/knowledge` and `/source-a-fish` are deliberately absent:
 * each has a Pages record of the same slug (which supplies its hero and
 * blocks), so it arrives through `getAllPageSlugs` with a real `updatedAt`.
 * Listing them here too would emit the URL twice.
 */
const STATIC_ROUTES: {
  path: string
  priority: number
  changeFrequency: Entry['changeFrequency']
}[] = [{ path: '/', priority: 1, changeFrequency: 'weekly' }]

/**
 * Never indexed.
 *
 * `home` and `not-found` back code-owned routes that already have their own
 * URL (`/` and the 404 handler), so their slugs are not addressable. The
 * others are request-confirmation pages, which must stay out of search.
 */
const EXCLUDED_SLUGS = new Set(['home', 'not-found', 'thank-you'])

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const base = siteUrl()

  const [pages, posts, deliveries] = await Promise.all([
    getAllPageSlugs(),
    getPosts({ limit: 1000 }),
    getDeliveries({ limit: 1000 }),
  ])

  const entries: Entry[] = [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  ]

  // Policy pages belong in the sitemap, and appear here as soon as they are
  // indexable. `isIndexablePage` is the same predicate the page's own robots
  // directive uses, so the two can never disagree.
  for (const page of pages) {
    if (!page.slug || EXCLUDED_SLUGS.has(page.slug)) continue
    if (!isIndexablePage(page)) continue
    entries.push({
      url: `${base}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: page.pageType === 'policy' ? 'yearly' : 'monthly',
      priority: page.pageType === 'policy' ? 0.3 : 0.7,
    })
  }

  for (const post of posts.docs) {
    if (!post.slug || post.meta?.noIndex) continue
    entries.push({
      url: `${base}/knowledge/${post.slug}`,
      // `publishedAt` is the editorial date; `updatedAt` is when the record last
      // changed, which is what a crawler wants for recrawl scheduling.
      lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const delivery of deliveries.docs) {
    if (!delivery.slug || delivery.meta?.noIndex) continue
    entries.push({
      url: `${base}/deliveries/${delivery.slug}`,
      lastModified: delivery.updatedAt ? new Date(delivery.updatedAt) : undefined,
      // A delivery record describes finished work and is not revised after.
      changeFrequency: 'yearly',
      priority: 0.6,
    })
  }

  // Last line of defence against a duplicate URL: a Pages record sharing a slug
  // with a code-owned route would otherwise be emitted twice, and duplicate
  // <loc> values make a sitemap invalid.
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

export default sitemap
