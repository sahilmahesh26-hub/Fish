import type { Media } from '@/payload-types'

export type MediaLike = number | string | Media | null | undefined

/** Narrows a Payload upload relationship to a populated Media doc. */
export const asMedia = (value: MediaLike): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null

/**
 * Alt text for a CMS image.
 *
 * Returns an empty string for images the editor marked decorative, which is
 * what assistive technology needs in order to skip them. Never invents a
 * description.
 */
export const altFor = (value: MediaLike): string => {
  const media = asMedia(value)
  if (!media) return ''
  if (media.decorative) return ''
  return media.alt ?? ''
}

/** True when an image should be hidden from assistive technology. */
export const isDecorative = (value: MediaLike): boolean => {
  const media = asMedia(value)
  return Boolean(media?.decorative) || !media?.alt
}

/**
 * Normalises a Payload media URL for `next/image`.
 *
 * Payload returns an absolute URL built from `serverURL`. When that points at
 * our own origin we strip it back to a path, so the image is treated as local
 * and needs no `remotePatterns` entry — which also keeps the app working
 * unchanged across localhost, staging and production. Genuinely remote URLs
 * (an S3 or CDN host) are passed through untouched.
 */
export const mediaSrc = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (url.startsWith('/')) return url

  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
  if (origin && url.startsWith(`${origin}/`)) return url.slice(origin.length)

  // Payload builds media URLs from its own `serverURL`, which can disagree with
  // the origin actually serving the request — a different port in local
  // testing, or a different hostname behind a proxy. Anything on Payload's own
  // media route is served by this app, so keep it relative rather than letting
  // it become a cross-origin request that CSP then blocks.
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/file/')) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    // Not an absolute URL; fall through and use it as given.
  }

  return url
}

/** CSS object-position from Payload's focal point, so CMS crops stay intentional. */
export const focalPosition = (value: MediaLike): string | undefined => {
  const media = asMedia(value)
  if (!media) return undefined
  const x = typeof media.focalX === 'number' ? media.focalX : 50
  const y = typeof media.focalY === 'number' ? media.focalY : 50
  return `${x}% ${y}%`
}
