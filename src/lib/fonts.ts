import { Bricolage_Grotesque, Manrope } from 'next/font/google'

/**
 * Both families are variable fonts, self-hosted by next/font at build time.
 * `display: swap` plus `adjustFontFallback` means text paints immediately in a
 * metric-matched fallback, so nothing shifts when the webfont arrives.
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
  adjustFontFallback: true,
})

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
})
