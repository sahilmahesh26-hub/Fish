import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { siteUrl } from './env'

/** Open Graph's canonical card size. Every major network crops from this. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const FONT_DIR = join(process.cwd(), 'assets', 'brand', 'fonts')

/**
 * Static TTF cuts of the two site families, committed to the repo.
 *
 * Satori cannot read WOFF2, which is the only format `next/font` keeps, so the
 * card needs its own copies. They are the same Google Fonts sources
 * `next/font` downloads at build time, see `docs/SEO.md`.
 */
const loadFonts = async () => {
  const [archivo, manrope] = await Promise.all([
    readFile(join(FONT_DIR, 'archivo-expanded-700.ttf')),
    readFile(join(FONT_DIR, 'manrope-500.ttf')),
  ])
  return [
    {
      name: 'Archivo',
      data: archivo,
      weight: 700 as const,
      style: 'normal' as const,
    },
    { name: 'Manrope', data: manrope, weight: 500 as const, style: 'normal' as const },
  ]
}

/* The card is the brand's first impression in a feed, so it uses the same
   near-black canvas and the same single red as the site. */
const INK = '#050607'
const INK_800 = '#0a0d10'
const BONE = '#f4f1ea'
const BONE_500 = '#9aa0a6'
const RED = '#ef2436'

/** The configured host, or nothing at all — never an invented domain. */
const displayHost = () => {
  const host = siteUrl().replace(/^https?:\/\//, '')
  if (!host || host.startsWith('localhost') || host.startsWith('127.0.0.1')) return null
  return host
}

type OgCardArgs = {
  /** Site-wide default headline. Kept short enough to stay at card scale. */
  heading: string
  subheading: string
  /** The strapline in the navy footer bar. */
  footnote: string
}

/**
 * The wordmark already sits in the top-left corner, so a headline that opens
 * with the brand says it twice and costs a line of the card's two.
 */
const withoutBrandPrefix = (heading: string, brand: string) =>
  heading.replace(new RegExp(`^${brand}\\s*[-|:-]\\s*`, 'i'), '').trim() || heading

/**
 * The branded fallback card, used wherever a document has no featured image.
 *
 * It takes no request input on purpose. A `?title=` endpoint would render
 * arbitrary text as an image under this domain, which is a phishing surface
 * for the sake of a marginal gain, documents that want their own card supply
 * one through Payload instead.
 */
export const ogCard = async ({ heading, subheading, footnote }: OgCardArgs) => {
  const host = displayHost()
  const headline = withoutBrandPrefix(heading, 'Finquiry')

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: INK,
        fontFamily: 'Manrope',
      }}
    >
      {/* Content well. 72px of padding keeps everything inside the safe area
            that Twitter and LinkedIn crop to on small cards. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '72px 72px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              width: 34,
              height: 34,
              borderRadius: 9,
              backgroundColor: RED,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 27,
              letterSpacing: 5,
              color: BONE,
              textTransform: 'uppercase',
            }}
          >
            Finquiry
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 54,
            fontFamily: 'Archivo',
            fontSize: 78,
            lineHeight: 1.06,
            letterSpacing: -2,
            color: BONE,
            maxWidth: 940,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 31,
            lineHeight: 1.4,
            color: BONE_500,
            maxWidth: 880,
          }}
        >
          {subheading}
        </div>
      </div>

      {/* Scarlet hairline above the navy footer, the same edge the site uses
            to separate a dark band from linen. */}
      <div style={{ display: 'flex', height: 8, backgroundColor: RED }} />

      <div
        style={{
          display: 'flex',
          height: 104,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 72px',
          backgroundColor: INK_800,
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: BONE }}>{footnote}</div>
        {host ? (
          <div style={{ display: 'flex', fontSize: 26, color: BONE, opacity: 0.84 }}>{host}</div>
        ) : null}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts() },
  )
}
