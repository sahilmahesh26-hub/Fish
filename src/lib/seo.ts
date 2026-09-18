import type { Metadata } from 'next'
import { siteUrl } from './env'
import { asMedia } from './media'
import type { SiteSetting } from '@/payload-types'

type MetaGroup = {
  title?: string | null
  description?: string | null
  image?: unknown
  canonicalUrl?: string | null
  noIndex?: boolean | null
} | null

type BuildMetadataArgs = {
  /** The document's own SEO overrides (plugin `meta` group). */
  meta?: MetaGroup
  /** Fallback title from the document itself. */
  title?: string | null
  /** Fallback description from the document itself. */
  description?: string | null
  /** Fallback social image from the document itself. */
  image?: unknown
  /** Path on this site, e.g. `/knowledge/some-article`. */
  path: string
  settings: SiteSetting
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  /**
   * Force `noindex, follow` regardless of the document's own setting. Used for
   * filtered and paginated views, which are crawlable (so nothing is orphaned)
   * but should not compete with the canonical listing page.
   */
  forceNoIndex?: boolean
}

/** The generated brand card served by `app/(frontend)/og/default.png`. */
const DEFAULT_OG_IMAGE = () => `${siteUrl()}/og/default.png`

const imageUrl = (value: unknown): string | null => {
  const media = asMedia(value as never)
  if (!media) return null
  // Prefer the generated 1200×630 size; fall back to the original.
  const social = media.sizes?.social?.url
  const url = social ?? media.url
  if (!url) return null
  return url.startsWith('http') ? url : `${siteUrl()}${url}`
}

/**
 * Metadata fallback hierarchy, applied in this order:
 *   1. the document's SEO override
 *   2. the document's own title / excerpt / featured image
 *   3. the site defaults in Site Settings
 */
export const buildMetadata = ({
  meta,
  title,
  description,
  image,
  path,
  settings,
  type = 'website',
  publishedTime,
  modifiedTime,
  forceNoIndex = false,
}: BuildMetadataArgs): Metadata => {
  const defaults = settings.defaultSeo
  const brand = settings.brandName ?? 'Finquiry'

  const resolvedTitle = meta?.title || title || defaults?.defaultTitle || brand

  /*
   * An editor writing a title in Payload writes the whole title — the seeded
   * ones already end in "| Finquiry". Letting the layout's `%s — Finquiry`
   * template wrap that would print the brand twice, so an explicit override is
   * marked absolute. A title falling back to the document's own heading is a
   * fragment, and does want the template.
   */
  const titleIsComplete = Boolean(meta?.title)
  const resolvedDescription =
    meta?.description ||
    description ||
    defaults?.description ||
    settings.shortDescription ||
    undefined

  /*
   * Image fallback chain, ending in the generated card so that every single
   * page has a social image — a link with none renders as a bare grey box.
   */
  const resolvedImage =
    imageUrl(meta?.image) ?? imageUrl(image) ?? imageUrl(defaults?.image) ?? DEFAULT_OG_IMAGE()

  const canonical = meta?.canonicalUrl || `${siteUrl()}${path}`
  const noIndex = Boolean(meta?.noIndex)

  return {
    title: titleIsComplete ? { absolute: resolvedTitle } : resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : forceNoIndex
        ? // `follow` stays on: the filtered view is a discovery path to articles.
          { index: false, follow: true }
        : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: brand,
      locale: 'en_IN',
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: resolvedTitle }],
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      // Always the large card: every branch of the fallback chain above ends in
      // a 1200×630 image, so there is never a case for the small one.
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
  }
}

/** Title template applied by the root layout to every child page. */
export const titleTemplateFor = (settings: SiteSetting) => {
  const brand = settings.brandName ?? 'Finquiry'
  const template = settings.defaultSeo?.titleTemplate
  return {
    default: settings.defaultSeo?.defaultTitle || `${brand} — ${settings.tagline ?? ''}`.trim(),
    template: template?.includes('%s') ? template : `%s — ${brand}`,
  }
}

/** The subset of a Page needed to decide whether it may be indexed. */
type IndexablePage = {
  pageType?: string | null
  legalReviewRequired?: boolean | null
  meta?: { noIndex?: boolean | null } | null
}

/**
 * Single source of truth for "may this page be offered to search engines?".
 *
 * The sitemap and the page's own robots directive both read it, because a page
 * listed in the sitemap while serving `noindex` is a contradiction crawlers
 * report as an error.
 *
 * A policy page awaiting legal review is excluded from both. It stays reachable
 * — the footer and the enquiry form's consent checkbox link to it — but draft
 * wording is not offered as settled terms. Unticking "requires legal review" in
 * Payload makes the page indexable and adds it to the sitemap in one step.
 */
export const isIndexablePage = (page: IndexablePage): boolean => {
  if (page.meta?.noIndex) return false
  if (page.pageType === 'policy' && page.legalReviewRequired) return false
  return true
}
