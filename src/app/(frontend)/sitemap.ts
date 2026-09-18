import type { MetadataRoute } from 'next'
import { getAllPageSlugs, getPosts, getDeliveries } from '@/lib/queries'
import { siteUrl } from '@/lib/env'

/** Routes owned by code rather than a Pages record. */
const STATIC_ROUTES: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [{ path: '/', priority: 1, changeFrequency: 'weekly' }]

/** Never indexed: utility pages and anything still awaiting legal review. */
const EXCLUDED_SLUGS = new Set(['thank-you', 'not-found', 'home'])

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const base = siteUrl()

  const [pages, posts, deliveries] = await Promise.all([
    getAllPageSlugs(),
    getPosts({ limit: 500 }),
    getDeliveries({ limit: 500 }),
  ])

  const pageEntries = pages
    .filter((page) => {
      if (!page.slug || EXCLUDED_SLUGS.has(page.slug)) return false
      if (page.meta?.noIndex) return false
      // A policy page that has not been reviewed must not be indexed.
      if (page.pageType === 'policy' && page.legalReviewRequired) return false
      return true
    })
    .map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const postEntries = posts.docs
    .filter((post) => !post.meta?.noIndex)
    .map((post) => ({
      url: `${base}/knowledge/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const deliveryEntries = deliveries.docs
    .filter((delivery) => !delivery.meta?.noIndex)
    .map((delivery) => ({
      url: `${base}/deliveries/${delivery.slug}`,
      lastModified: delivery.updatedAt ? new Date(delivery.updatedAt) : undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }))

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...pageEntries,
    ...postEntries,
    ...deliveryEntries,
  ]
}

export default sitemap
