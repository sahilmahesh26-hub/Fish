import Image from 'next/image'
import { asMedia, altFor, focalPosition, mediaSrc, type MediaLike } from '@/lib/media'
import { cn } from '@/lib/cn'
import styles from './CmsImage.module.css'

type Props = {
  media: MediaLike
  className?: string
  /** Only true for media genuinely above the fold. */
  priority?: boolean
  sizes?: string
  /** `fill` needs a positioned parent with its own aspect ratio. */
  fill?: boolean
  width?: number
  height?: number
  /**
   * Renders a composed dark fallback in place of a missing image rather than
   * nothing. The string is the accessible name only; it is never painted on
   * screen, because a public page that says "add an image in Payload" is a
   * developer note the visitor should never see.
   */
  fallbackLabel?: string
}

/**
 * CMS image with the alt-text contract enforced.
 *
 * Alt text comes from Payload. Images the editor marked decorative render with
 * `alt=""` and `aria-hidden`, so assistive technology skips them instead of
 * announcing a filename. Width and height always come from the stored metadata,
 * which is what keeps CLS at zero.
 */
export const CmsImage = ({
  media,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px',
  fill = false,
  width,
  height,
  fallbackLabel,
}: Props) => {
  const doc = asMedia(media)
  const src = mediaSrc(doc?.url)

  if (!src) {
    if (!fallbackLabel) return null
    /*
     * The missing-media state. A dark plate with the same grade as real
     * photography, so a record without an image reads as restrained rather
     * than as broken. No text: see `fallbackLabel`.
     */
    return <div className={cn(styles.fallback, className)} role="img" aria-label={fallbackLabel} />
  }

  const alt = altFor(media)
  const decorative = alt.length === 0

  const common = {
    src,
    alt,
    className: cn(styles.image, className),
    priority,
    // Everything below the fold defers; the hero opts in explicitly.
    loading: priority ? ('eager' as const) : ('lazy' as const),
    sizes,
    style: { objectPosition: focalPosition(media) },
    ...(decorative ? { 'aria-hidden': true as const } : {}),
  }

  // `alt` is passed explicitly rather than only through the spread: it is the
  // one prop that must always be visible at the call site.
  if (fill) {
    return <Image {...common} alt={alt} fill />
  }

  const w = width ?? doc?.width ?? 1200
  const h = height ?? doc?.height ?? 800

  return <Image {...common} alt={alt} width={w} height={h} />
}
