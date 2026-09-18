import { siteUrl } from './env'
import { asMedia } from './media'
import type { SiteSetting, Post, Delivery, Faq } from '@/payload-types'
import { richTextToPlainText } from './richText'

/**
 * Structured data builders.
 *
 * Nothing here fabricates ratings, reviews, prices or stock — Finquiry does not
 * hold inventory, so Product/Offer schema would be a false claim.
 */

type Json = Record<string, unknown>

const absolute = (path: string) => `${siteUrl()}${path}`

const mediaUrl = (value: unknown): string | undefined => {
  const media = asMedia(value as never)
  if (!media?.url) return undefined
  return media.url.startsWith('http') ? media.url : absolute(media.url)
}

export const organisationSchema = (settings: SiteSetting): Json => {
  const address = settings.address
  const hasAddress = address?.city || address?.line1

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl()}#organisation`,
    name: settings.brandName ?? 'Finquiry',
    legalName: settings.organisation?.legalName ?? undefined,
    url: siteUrl(),
    slogan: settings.tagline ?? undefined,
    description: settings.shortDescription ?? undefined,
    logo: mediaUrl(settings.logo),
    foundingDate: settings.organisation?.foundingYear
      ? String(settings.organisation.foundingYear)
      : undefined,
    areaServed: settings.organisation?.areaServed ?? 'India',
    email: settings.contactEmail ?? undefined,
    telephone: settings.phone ?? undefined,
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: [address?.line1, address?.line2].filter(Boolean).join(', ') || undefined,
          addressLocality: address?.city ?? undefined,
          addressRegion: address?.state ?? undefined,
          postalCode: address?.postalCode ?? undefined,
          addressCountry: address?.country ?? 'IN',
        }
      : undefined,
    sameAs: [
      ...(settings.organisation?.sameAs ?? []),
      ...(settings.socialLinks?.map((link) => link.url) ?? []),
    ].filter(Boolean),
  }
}

export const websiteSchema = (settings: SiteSetting): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl()}#website`,
  url: siteUrl(),
  name: settings.brandName ?? 'Finquiry',
  publisher: { '@id': `${siteUrl()}#organisation` },
  inLanguage: 'en-IN',
})

export const breadcrumbSchema = (trail: { name: string; path: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absolute(item.path),
  })),
})

export const articleSchema = (post: Post, settings: SiteSetting): Json => {
  const author = typeof post.author === 'object' && post.author ? post.author : null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: mediaUrl(post.featuredImage),
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: author
      ? { '@type': 'Person', name: author.name }
      : { '@type': 'Organization', name: settings.brandName ?? 'Finquiry' },
    publisher: { '@id': `${siteUrl()}#organisation` },
    mainEntityOfPage: absolute(`/knowledge/${post.slug}`),
  }
}

/**
 * A delivery story is an article about completed work, not a product listing.
 * Modelling it as `Article` avoids implying purchasable stock.
 */
export const deliverySchema = (delivery: Delivery, settings: SiteSetting): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: delivery.title,
  description: delivery.requirement ?? undefined,
  image: mediaUrl(delivery.mainImage),
  datePublished: delivery.deliveryDate ?? delivery.createdAt,
  dateModified: delivery.updatedAt,
  // A delivery record is written by the business, not by a named person — and
  // `Article` requires an author, so naming the organisation is both accurate
  // and what the schema needs.
  author: { '@type': 'Organization', name: settings.brandName ?? 'Finquiry' },
  publisher: { '@id': `${siteUrl()}#organisation` },
  mainEntityOfPage: absolute(`/deliveries/${delivery.slug}`),
})

/**
 * FAQ schema. Only emit this when the same questions and answers are visibly
 * rendered on the page — the block exposes a switch for exactly that reason.
 */
export const faqSchema = (faqs: Faq[]): Json | null => {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: richTextToPlainText(faq.answer as never),
      },
    })),
  }
}

/** Renders a JSON-LD script tag payload, stripping undefined values. */
export const jsonLd = (data: Json | null): string | null => {
  if (!data) return null
  return JSON.stringify(data, (_key, value) => (value === undefined ? undefined : value))
}
