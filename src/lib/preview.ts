/** Builds the draft-preview URL for a document. The secret is checked by the
 *  preview route before `draftMode` is enabled, so a guessed URL cannot reveal
 *  unpublished content. */
export const previewUrl = (collection: string, slug: string): string => {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const params = new URLSearchParams({
    collection,
    slug,
    secret: process.env.PREVIEW_SECRET ?? '',
  })
  return `${base}/api/preview?${params.toString()}`
}

/** Public path for a document, used by preview, sitemaps and internal links. */
export const pathFor = (collection: string, slug: string): string => {
  switch (collection) {
    case 'posts':
      return `/knowledge/${slug}`
    case 'deliveries':
      return `/deliveries/${slug}`
    case 'sourcing-categories':
      return `/source-a-fish#${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return `/${slug}`
  }
}
