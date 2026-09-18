import sharp from 'sharp'

/**
 * Generates clearly-marked placeholder artwork.
 *
 * Every file produced here is named `placeholder-*`, tagged `placeholder` in
 * Payload and given alt text that says it is a placeholder, so an editor can
 * find and replace all of them from the media library in one pass.
 */

const LINEN = '#F5F0E8'
const NAVY = '#081F33'
const SCARLET = '#D91A2A'
const AEGEAN = '#1A6FBF'

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char,
  )

/** A labelled placeholder panel for photography that has not been supplied. */
export const placeholderPanel = async (
  label: string,
  width = 1600,
  height = 1200,
): Promise<Buffer> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <pattern id="hatch" width="28" height="28" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="${LINEN}"/>
        <line x1="0" y1="0" x2="0" y2="28" stroke="${NAVY}" stroke-opacity="0.07" stroke-width="12"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#hatch)"/>
    <rect x="18" y="18" width="${width - 36}" height="${height - 36}" fill="none"
          stroke="${NAVY}" stroke-opacity="0.34" stroke-width="3" stroke-dasharray="18 14" rx="20"/>
    <circle cx="${width / 2}" cy="${height / 2 - 60}" r="52" fill="none" stroke="${AEGEAN}" stroke-width="4"/>
    <circle cx="${width / 2}" cy="${height / 2 - 60}" r="88" fill="none" stroke="${AEGEAN}" stroke-opacity="0.5" stroke-width="3"/>
    <text x="${width / 2}" y="${height / 2 + 70}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="46" font-weight="700"
          letter-spacing="3" fill="${NAVY}">PLACEHOLDER</text>
    <text x="${width / 2}" y="${height / 2 + 128}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="32" fill="${NAVY}" fill-opacity="0.7">${escapeXml(label)}</text>
    <text x="${width / 2}" y="${height - 56}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${SCARLET}">Replace this image in Payload → Media</text>
  </svg>`

  return sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toBuffer()
}

/**
 * Stand-in hero artwork: a stylised fish on a transparent background.
 *
 * An abstract illustration rather than a photograph, so it reads as artwork to
 * be replaced and never as a real specimen Finquiry is claiming to have.
 */
export const placeholderFish = async (): Promise<Buffer> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1000" viewBox="0 0 1400 1000">
    <g transform="translate(60,40)">
      <!-- tail -->
      <path d="M60 460 L250 330 L250 590 Z" fill="${SCARLET}" opacity="0.92"/>
      <!-- body -->
      <path d="M250 460c90-190 330-300 560-284 190 13 340 116 420 244-80 128-230 231-420 244-230 16-470-94-560-284Z"
            fill="${NAVY}"/>
      <!-- flank -->
      <path d="M330 460c80-140 270-222 470-210 150 9 272 82 344 180-72 98-194 171-344 180-200 12-390-70-470-210Z"
            fill="${AEGEAN}" opacity="0.55"/>
      <!-- dorsal fin -->
      <path d="M520 214c130-70 300-84 430-40-120 22-230 60-320 116Z" fill="${SCARLET}" opacity="0.85"/>
      <!-- lower fin -->
      <path d="M560 700c120 62 270 74 386 34-108-20-206-54-286-104Z" fill="${SCARLET}" opacity="0.7"/>
      <!-- eye -->
      <circle cx="1105" cy="418" r="34" fill="${LINEN}"/>
      <circle cx="1112" cy="418" r="16" fill="${NAVY}"/>
      <!-- gill line -->
      <path d="M980 300c-46 96-46 224 0 320" stroke="${LINEN}" stroke-opacity="0.65" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- scale marks -->
      <g stroke="${LINEN}" stroke-opacity="0.35" stroke-width="5" fill="none" stroke-linecap="round">
        <path d="M700 360c34 60 34 140 0 200"/>
        <path d="M800 340c38 70 38 170 0 240"/>
        <path d="M600 390c28 46 28 134 0 180"/>
      </g>
    </g>
  </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Square brand mark used as a stand-in logo and favicon. */
export const placeholderLogo = async (size = 512): Promise<Buffer> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="120" fill="${LINEN}"/>
    <path d="M150 256c0-70 60-120 140-120s150 50 150 120-70 120-150 120-140-50-140-120Z" fill="${SCARLET}"/>
    <path d="M150 256 60 176v160Z" fill="${NAVY}"/>
    <circle cx="360" cy="230" r="22" fill="${LINEN}"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
