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
}

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
}: BuildMetadataArgs): Metadata => {
  const defaults = settings.defaultSeo
  const brand = settings.brandName ?? 'Finquiry'

  const resolvedTitle = meta?.title || title || defaults?.defaultTitle || brand
  const resolvedDescription =
    meta?.description ||
    description ||
    defaults?.description ||
    settings.shortDescription ||
    undefined

  const resolvedImage = imageUrl(meta?.image) ?? imageUrl(image) ?? imageUrl(defaults?.image)

  const canonical = meta?.canonicalUrl || `${siteUrl()}${path}`
  const noIndex = Boolean(meta?.noIndex)

  // The template only applies to child pages; `absolute` is used where the
  // title already reads as a complete title.
  const template = defaults?.titleTemplate?.includes('%s')
    ? defaults.titleTemplate
    : `%s — ${brand}`

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: brand,
      locale: 'en_IN',
      images: resolvedImage ? [{ url: resolvedImage, width: 1200, height: 630 }] : undefined,
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: resolvedImage ? 'summary_large_image' : 'summary',
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
    other: {
      'og:title:template': template,
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
