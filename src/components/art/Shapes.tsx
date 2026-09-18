import { cn } from '@/lib/cn'
import styles from './Shapes.module.css'

/**
 * The Finquiry graphic language.
 *
 * One consistent family — pool masks, current lines, bubbles, ripples, a light
 * starburst, route arrows and specimen stamps. Every piece is inline SVG built
 * from the four brand colours, is decorative by definition (`aria-hidden`), and
 * carries no text that a screen reader would need.
 */

type ArtProps = { className?: string }

/** Slow-rotating light reflection. Used once per composition, never repeated. */
export const Starburst = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.starburst, className)}
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M60 0c3 34 26 57 60 60-34 3-57 26-60 60-3-34-26-57-60-60 34-3 57-26 60-60Z"
      fill="currentColor"
    />
  </svg>
)

/** Concentric ripple rings, as if something has just broken the surface. */
export const RippleRings = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.ripple, className)}
    viewBox="0 0 200 200"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
    <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1" opacity="0.18" />
  </svg>
)

/** A cluster of rising bubbles. */
export const BubbleCluster = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.bubbles, className)}
    viewBox="0 0 80 160"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="22" cy="140" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="48" cy="112" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="28" cy="86" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="52" cy="58" r="7" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="30" cy="30" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="50" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

/** Horizontal current line — the connective tissue of the process route. */
export const CurrentLine = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.current, className)}
    viewBox="0 0 1200 60"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M0 30c100-40 200 40 300 0s200-40 300 0 200 40 300 0 200-40 300 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="8 10"
      strokeLinecap="round"
    />
  </svg>
)

/** Vertical current line, used when the route stacks on narrow screens. */
export const CurrentLineVertical = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.currentVertical, className)}
    viewBox="0 0 60 600"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M30 0c-40 80 40 160 0 240s-40 160 0 240 40 100 0 120"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="8 10"
      strokeLinecap="round"
    />
  </svg>
)

/** Scarlet direction marker sitting on the route. */
export const RouteArrow = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.arrow, className)}
    viewBox="0 0 40 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0 12h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="m26 4 10 8-10 8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Measurement mark used on specimen records. */
export const MeasurementMark = ({ className }: ArtProps) => (
  <svg
    className={cn(styles.measure, className)}
    viewBox="0 0 200 24"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 4v16M198 4v16M2 12h196"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 8v8M40 8v8M70 8v8M100 8v8M130 8v8M160 8v8M190 8v8"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
    />
  </svg>
)

/**
 * Curved transition between sections — the "surface" that connects the framed
 * hero to the editorial body below it.
 */
export const CurrentDivider = ({ className, flip = false }: ArtProps & { flip?: boolean }) => (
  <svg
    className={cn(styles.divider, flip && styles.dividerFlip, className)}
    viewBox="0 0 1440 120"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0 64c180-48 360-64 540-42s300 74 480 66 300-52 420-76v108H0Z" fill="currentColor" />
  </svg>
)

/** Organic pool blob used behind imagery. */
export const PoolBlob = ({ className, variant = 1 }: ArtProps & { variant?: 1 | 2 }) => (
  <svg
    className={cn(styles.blob, className)}
    viewBox="0 0 400 400"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {variant === 1 ? (
      <path
        d="M330 128c26 54 14 124-30 166s-116 56-176 32S22 238 28 178 92 66 156 44s148 30 174 84Z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M356 190c8 66-42 128-108 152S98 358 56 306 22 168 62 112 190 22 252 38s96 86 104 152Z"
        fill="currentColor"
      />
    )}
  </svg>
)
