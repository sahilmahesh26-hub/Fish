import { Archivo, Manrope } from 'next/font/google'

/**
 * Two families, both variable, both self-hosted by next/font at build time.
 *
 * Archivo carries a width axis as well as weight, which is what gives the
 * display voice range without a third family: the hero runs expanded and
 * heavy, section titles run normal width, and the difference reads as
 * intent rather than as two fonts fighting.
 *
 * `display: swap` plus `adjustFontFallback` means text paints immediately in
 * a metric-matched fallback, so nothing shifts when the webfont arrives.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  axes: ['wdth'],
  adjustFontFallback: true,
})

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
})
