import sharp from 'sharp'

/**
 * Seed artwork.
 *
 * This project has no photography yet, and this environment has neither an
 * image-generation tool nor reachable stock imagery. Rather than ship boxes
 * that say PLACEHOLDER to the public, everything generated here is a finished
 * dark-water plate: deep gradients, a suggestion of caustic light, and the
 * same grade the rest of the interface uses.
 *
 * These are atmosphere, not specimens. Nothing here depicts a fish, claims to
 * be one, or implies stock. Every file is still named `placeholder-*`, tagged
 * `placeholder` in Payload and described honestly in its alt text, so an
 * editor can filter the media library and replace the lot in one pass once
 * real photography exists.
 */

/*
 * Sampled from `tokens.css`, not invented here.
 *
 * These plates used to be generated in the old near-black palette, so when
 * the site moved to lit water every card was a hole: a dark rectangle in a
 * blue page. Artwork and interface have to be mixed from the same paint.
 */
const ABYSS = '#03101d'
const DEEP = '#06192c'
const MID = '#0e2a45'
const BONE = '#ECE8DA'
const AQUA = '#7FD4E8'
const AMBER = '#E7AE3D'

/** Deterministic noise, so a re-run produces byte-identical artwork. */
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/**
 * Caustic light: the bands a water surface throws onto whatever is below it.
 *
 * Built from a handful of long, soft, rotated ellipses rather than a filter,
 * so the result stays cheap to rasterise and reads as light rather than as a
 * blur effect.
 */
const caustics = (width: number, height: number, seed: number, count = 9) => {
  const rand = mulberry(seed)
  return Array.from({ length: count }, () => {
    const cx = rand() * width
    // Spread across most of the plate, not just the top three quarters. A 4:5
    // category tile is tall, and bands confined to the upper area left the
    // lower half of those tiles with nothing in it at all.
    const cy = rand() * height * 0.88
    const rx = (0.18 + rand() * 0.3) * width
    const ry = (0.008 + rand() * 0.022) * height
    const angle = -35 + rand() * 70
    // A floor on the opacity as well as a ceiling. The old range bottomed out
    // at 0.05, which on a near-black plate is invisible, so roughly a third of
    // the bands were not doing anything.
    const opacity = (0.13 + rand() * 0.13).toFixed(3)
    return `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}"
      fill="url(#caustic)" opacity="${opacity}"
      transform="rotate(${angle.toFixed(1)} ${cx.toFixed(0)} ${cy.toFixed(0)})" />`
  }).join('\n    ')
}

/**
 * A dark-water plate.
 *
 * `seed` shifts the light so no two records look stamped from the same die,
 * and `tint` lets a plate lean red or cold without leaving the palette.
 */
export const waterPlate = async (
  seed: number,
  width = 1600,
  height = 1200,
  tint: 'cold' | 'warm' | 'neutral' = 'cold',
): Promise<Buffer> => {
  const rand = mulberry(seed * 977)
  /*
   * The light stays near the middle third.
   *
   * It used to range from 18% to 82%, which is fine on a 4:3 plate and wrong
   * on a 4:5 one: `object-fit: cover` crops the sides, so a light source at
   * 18% simply fell outside the tile and that card rendered as flat murk
   * beside cards that had caught theirs. Keeping it between 34% and 66% means
   * every crop of every plate contains the light.
   */
  const lightX = (34 + rand() * 32).toFixed(0)
  const accent = tint === 'warm' ? AMBER : AQUA
  // Matched strengths. Red at 0.10 against cold at 0.16 made every warm-tinted
  // plate read as the dim one in the set.
  const accentOpacity = tint === 'neutral' ? 0.1 : tint === 'warm' ? 0.16 : 0.22

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="depth" cx="${lightX}%" cy="8%" r="95%">
        <stop offset="0%" stop-color="#1d4f70"/>
        <stop offset="40%" stop-color="#0f3a5c"/>
        <stop offset="72%" stop-color="${MID}"/>
        <stop offset="100%" stop-color="${DEEP}"/>
      </radialGradient>
      <radialGradient id="accent" cx="${lightX}%" cy="0%" r="70%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="${accentOpacity}"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="caustic" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${BONE}" stop-opacity="0"/>
        <stop offset="50%" stop-color="${BONE}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${BONE}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <!--
          The sink to black starts at the halfway line, not at the top edge.
          Components that place type over a plate lay their own scrim on top of
          it; starting the floor at 0% meant the two stacked and the bottom
          half of every card went dead flat.
        -->
        <stop offset="0%" stop-color="${ABYSS}" stop-opacity="0"/>
        <stop offset="50%" stop-color="${ABYSS}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="${ABYSS}" stop-opacity="0.66"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#depth)"/>
    <rect width="${width}" height="${height}" fill="url(#accent)"/>
    ${caustics(width, height, seed)}
    <rect width="${width}" height="${height}" fill="url(#floor)"/>
  </svg>`

  return sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toBuffer()
}

/**
 * A plate for a named search category.
 *
 * Identical treatment to `waterPlate`, seeded from the category name so the
 * grid reads as a set rather than as noise. Carries no text: a label baked
 * into an image cannot be translated, selected or restyled, and the component
 * already renders the name in real type beside it.
 */
export const categoryPlate = async (name: string, width = 1200, height = 1500): Promise<Buffer> => {
  const seed = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0)
  /*
   * Cold across the whole set.
   *
   * Every third tile used to take the red tint, which at plate scale is not an
   * accent but a wash: three of the seven cards read as a dark red room rather
   * than as water, and red stopped meaning 'this is the thing to press'. The
   * seeded light position still gives each tile its own character.
   */
  return waterPlate(seed, width, height, 'cold')
}

/**
 * The wordmark, as a flat red plate with the F cut out of it.
 *
 * Deliberately geometric: a drawn fish at logo scale becomes a cartoon, which
 * is the single thing the brand direction rules out.
 */
export const placeholderLogo = async (size = 512): Promise<Buffer> => {
  const r = Math.round(size * 0.22)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" fill="${AMBER}"/>
    <path d="M${size * 0.34} ${size * 0.26}h${size * 0.34}v${size * 0.1}H${size * 0.46}v${size * 0.12}h${size * 0.18}v${size * 0.1}H${size * 0.46}v${size * 0.18}h-${size * 0.12}z"
      fill="${ABYSS}"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
