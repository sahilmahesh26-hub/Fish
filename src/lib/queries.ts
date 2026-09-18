import 'server-only'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type {
  Footer,
  Header,
  Homepage,
  SiteSetting,
  Page,
  Post,
  Delivery,
  SourcingCategory,
  Faq,
  Category,
  AquariumProject,
} from '@/payload-types'

/**
 * CMS read helpers.
 *
 * Published reads go through `unstable_cache` with a tag named after the
 * collection, which the publish hooks invalidate. Draft reads bypass the cache
 * entirely so preview always shows the newest autosave.
 */

const isDraft = async (): Promise<boolean> => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // `draftMode()` throws outside a request scope (sitemap generation, RSS).
    return false
  }
}

/** Wraps a loader in the tag cache unless we are previewing drafts. */
const cached = <T>(key: string[], tags: string[], loader: () => Promise<T>) =>
  unstable_cache(loader, key, { tags, revalidate: 3600 })

/* -------------------------------------------------------------------------- */
/* Globals                                                                     */
/* -------------------------------------------------------------------------- */

export const getSiteSettings = async (): Promise<SiteSetting> => {
  const load = async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 2, overrideAccess: false })
  }
  return (await isDraft()) ? load() : cached(['site-settings'], ['global'], load)()
}

export const getHeader = async (): Promise<Header> => {
  const load = async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'header', depth: 1, overrideAccess: false })
  }
  return (await isDraft()) ? load() : cached(['header'], ['global'], load)()
}

export const getFooter = async (): Promise<Footer> => {
  const load = async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'footer', depth: 1, overrideAccess: false })
  }
  return (await isDraft()) ? load() : cached(['footer'], ['global'], load)()
}

export const getHomepage = async (): Promise<Homepage> => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'homepage', depth: 3, draft, overrideAccess: draft })
  }
  return draft ? load() : cached(['homepage'], ['global', 'homepage'], load)()
}

/* -------------------------------------------------------------------------- */
/* Pages                                                                       */
/* -------------------------------------------------------------------------- */

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 3,
      draft,
      overrideAccess: draft,
    })
    return result.docs[0] ?? null
  }
  return draft ? load() : cached(['page', slug], ['pages'], load)()
}

/** Minimal page projection used by the sitemap. */
export type PageSummary = Pick<
  Page,
  'slug' | 'updatedAt' | 'pageType' | 'legalReviewRequired' | 'meta'
>

export const getAllPageSlugs = async (): Promise<PageSummary[]> => {
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
        pageType: true,
        legalReviewRequired: true,
        meta: true,
      },
    })
    return result.docs as PageSummary[]
  }
  return cached(['page-slugs'], ['pages'], load)()
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                       */
/* -------------------------------------------------------------------------- */

type PostQuery = {
  limit?: number
  page?: number
  categorySlug?: string
  excludeId?: number | string
}

export const getPosts = async ({
  limit = 12,
  page = 1,
  categorySlug,
  excludeId,
}: PostQuery = {}) => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    const where: Where = {}
    const and: Where[] = []
    if (!draft) and.push({ _status: { equals: 'published' } })
    if (categorySlug) and.push({ 'category.slug': { equals: categorySlug } })
    if (excludeId) and.push({ id: { not_equals: excludeId } })
    if (and.length > 0) where.and = and

    return payload.find({
      collection: 'posts',
      where,
      limit,
      page,
      depth: 2,
      sort: '-publishedAt',
      draft,
      overrideAccess: draft,
    })
  }
  return draft
    ? load()
    : cached(
        ['posts', String(limit), String(page), categorySlug ?? '', String(excludeId ?? '')],
        ['posts'],
        load,
      )()
}

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      draft,
      overrideAccess: draft,
    })
    return result.docs[0] ?? null
  }
  return draft ? load() : cached(['post', slug], ['posts'], load)()
}

export const getPostsByIds = async (ids: (number | string)[]): Promise<Post[]> => {
  if (ids.length === 0) return []
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
      limit: ids.length,
      depth: 2,
    })
    // Preserve the editor's chosen order rather than the database's.
    return ids
      .map((id) => result.docs.find((doc) => String(doc.id) === String(id)))
      .filter((doc): doc is Post => Boolean(doc))
  }
  return cached(['posts-by-id', ids.join(',')], ['posts'], load)()
}

export const getCategories = async (): Promise<Category[]> => {
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'order',
      depth: 0,
      pagination: false,
    })
    return result.docs
  }
  return cached(['categories'], ['categories'], load)()
}

/* -------------------------------------------------------------------------- */
/* Sourcing                                                                    */
/* -------------------------------------------------------------------------- */

export const getSourcingCategories = async (): Promise<SourcingCategory[]> => {
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'sourcing-categories',
      where: { active: { equals: true } },
      limit: 50,
      sort: 'order',
      depth: 2,
      pagination: false,
    })
    return result.docs
  }
  return cached(['sourcing-categories'], ['sourcing-categories'], load)()
}

export const getSourcingCategoriesByIds = async (
  ids: (number | string)[],
): Promise<SourcingCategory[]> => {
  if (ids.length === 0) return []
  const all = await getSourcingCategories()
  return ids
    .map((id) => all.find((doc) => String(doc.id) === String(id)))
    .filter((doc): doc is SourcingCategory => Boolean(doc))
}

/* -------------------------------------------------------------------------- */
/* Deliveries                                                                  */
/* -------------------------------------------------------------------------- */

type DeliveryQuery = {
  limit?: number
  page?: number
  featuredOnly?: boolean
  categorySlug?: string
  origin?: string
  destination?: string
}

export const getDeliveries = async ({
  limit = 12,
  page = 1,
  featuredOnly = false,
  categorySlug,
  origin,
  destination,
}: DeliveryQuery = {}) => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    const and: Where[] = []
    if (!draft) and.push({ _status: { equals: 'published' } })
    if (featuredOnly) and.push({ featured: { equals: true } })
    if (categorySlug) and.push({ 'category.slug': { equals: categorySlug } })
    if (origin) and.push({ origin: { like: origin } })
    if (destination) and.push({ destination: { like: destination } })

    return payload.find({
      collection: 'deliveries',
      where: and.length > 0 ? { and } : {},
      limit,
      page,
      depth: 2,
      sort: '-deliveryDate',
      draft,
      overrideAccess: draft,
    })
  }
  return draft
    ? load()
    : cached(
        [
          'deliveries',
          String(limit),
          String(page),
          String(featuredOnly),
          categorySlug ?? '',
          origin ?? '',
          destination ?? '',
        ],
        ['deliveries'],
        load,
      )()
}

export const getDeliveryBySlug = async (slug: string): Promise<Delivery | null> => {
  const draft = await isDraft()
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'deliveries',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      draft,
      overrideAccess: draft,
    })
    return result.docs[0] ?? null
  }
  return draft ? load() : cached(['delivery', slug], ['deliveries'], load)()
}

export const getDeliveriesByIds = async (ids: (number | string)[]): Promise<Delivery[]> => {
  if (ids.length === 0) return []
  const load = async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'deliveries',
      where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
      limit: ids.length,
      depth: 2,
    })
    return ids
      .map((id) => result.docs.find((doc) => String(doc.id) === String(id)))
      .filter((doc): doc is Delivery => Boolean(doc))
  }
  return cached(['deliveries-by-id', ids.join(',')], ['deliveries'], load)()
}

/* -------------------------------------------------------------------------- */
/* Aquariums, FAQs                                                             */
/* -------------------------------------------------------------------------- */

export const getAquariumProjects = async (
  serviceType?: 'service' | 'project',
): Promise<AquariumProject[]> => {
  const load = async () => {
    const payload = await getPayloadClient()
    const and: Where[] = [{ _status: { equals: 'published' } }]
    if (serviceType) and.push({ serviceType: { equals: serviceType } })
    const result = await payload.find({
      collection: 'aquarium-projects',
      where: { and },
      limit: 50,
      depth: 2,
      pagination: false,
    })
    return result.docs
  }
  return cached(['aquarium-projects', serviceType ?? 'all'], ['aquarium-projects'], load)()
}

export const getFaqs = async (category?: string): Promise<Faq[]> => {
  const load = async () => {
    const payload = await getPayloadClient()
    const and: Where[] = [{ published: { equals: true } }]
    if (category) and.push({ category: { equals: category } })
    const result = await payload.find({
      collection: 'faqs',
      where: { and },
      limit: 100,
      sort: 'order',
      depth: 0,
      pagination: false,
    })
    return result.docs
  }
  return cached(['faqs', category ?? 'all'], ['faqs'], load)()
}

export const getFaqsByIds = async (ids: (number | string)[]): Promise<Faq[]> => {
  if (ids.length === 0) return []
  const all = await getFaqs()
  return ids
    .map((id) => all.find((doc) => String(doc.id) === String(id)))
    .filter((doc): doc is Faq => Boolean(doc))
}
