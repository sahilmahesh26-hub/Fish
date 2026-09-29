import styles from './Reef.module.css'

/**
 * A coral reef, drawn dense and saturated.
 *
 * The first version of this site's artwork was thin cream outlines at about
 * a third opacity. Against a dark page that reads as a faint diagram, which
 * is exactly the "plain portfolio" problem: the reference boards are carried
 * by big, saturated, high-contrast imagery, and a 1px stroke at 30% is the
 * opposite of that.
 *
 * So this is built the other way round. Every form is a FILLED shape with its
 * own gradient, the palette runs hot (magenta, coral, tangerine) against the
 * cold water so the contrast is in hue as well as value, and the bright tips
 * carry a real blur-based bloom the way a lit subject underwater actually
 * does. Density is the other half: forty-odd overlapping forms, not six.
 *
 * Still illustration, not photography, and it never depicts a specimen
 * Finquiry holds.
 */

type ReefProps = {
  className?: string
  /** `full` is the hero bed. `low` is a shorter strip for a section foot. */
  size?: 'full' | 'low'
}

/* Hue families, kept to four so the bed reads as one reef rather than a
   swatch chart. Each is [deep, mid, bright]. */
const PALETTES = [
  ['#7a1f5c', '#c2317f', '#ff7ac0'], // magenta sea fan
  ['#8a2d2a', '#d65438', '#ff9d5c'], // fire coral
  ['#6b2a7a', '#9d4fc4', '#d99cff'], // violet
  ['#134b5f', '#1d7ea3', '#7fd4e8'], // the water's own blue, for recession
] as const

/** Branching coral: a trunk that forks twice, tipped bright. */
const Branch = ({
  x,
  y,
  scale,
  palette,
  flip,
}: {
  x: number
  y: number
  scale: number
  palette: readonly [string, string, string]
  flip?: boolean
}) => {
  const id = `br-${x}-${y}`
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="55%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>
      </defs>
      {/* Six arms off a thick base, each forking again near the tip. An
          earlier three-arm version read as a candelabra: real branching
          coral is bushy, and the bushiness is most of the recognition. */}
      <path
        d="M0 0c-4-18 2-30-2-44-10-8-17-18-18-32 7 8 12 15 19 20-2-12-7-20-8-32 6 9 10 18 12 29 2-13 0-23-1-35 5 11 8 22 8 35 3-12 8-20 15-29-1 13-4 22-8 33 7-5 12-12 18-21 0 15-7 25-17 33-5 13-2 26-6 43Z"
        fill={`url(#${id})`}
      />
      {/* A second, smaller clump offset at the base, so one instance already
          reads as a cluster rather than a single plant. */}
      <path
        d="M14 0c-2-11 1-18-1-27-6-5-10-11-11-19 4 5 7 9 11 12-1-7-4-12-5-19 4 6 6 11 7 17 1-7 0-14 0-21 3 7 5 13 5 21 2-7 5-12 9-17-1 8-2 13-5 20 4-3 7-7 11-12 0 9-4 15-10 19-3 8-1 16-4 26Z"
        fill={`url(#${id})`}
        fillOpacity="0.85"
      />
      {/* Polyp texture: short strokes along the arms, which is what stops a
          filled silhouette reading as a paper cut-out. */}
      <g stroke={palette[2]} strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round">
        <path d="M-13-52l-5-4M-8-44l-5-3M-1-60l0-5M6-56l4-4M14-48l5-3M18-40l4-3" />
      </g>
    </g>
  )
}

/** Sea fan: a lacework blade, the most recognisable reef silhouette. */
const Fan = ({
  x,
  y,
  scale,
  palette,
}: {
  x: number
  y: number
  scale: number
  palette: readonly [string, string, string]
}) => {
  const id = `fan-${x}-${y}`
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={id} cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="70%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </radialGradient>
      </defs>
      <path
        d="M0 0c-2-18-14-28-18-46-4-18 2-34 18-40 16 6 22 22 18 40-4 18-16 28-18 46Z"
        fill={`url(#${id})`}
        fillOpacity="0.9"
      />
      {/* The lace. Drawn as ribs rather than a texture so it scales. */}
      <g stroke="#04101d" strokeOpacity="0.4" strokeWidth="1.1" fill="none">
        <path d="M0-2v-80M-9-12c-2-20-1-38 4-54M9-12c2-20 1-38-4-54M-15-28c0-14 2-26 7-38M15-28c0-14-2-26-7-38" />
      </g>
    </g>
  )
}

/** Tube sponges: a clutch of vertical cylinders with lit mouths. */
const Tubes = ({
  x,
  y,
  scale,
  palette,
}: {
  x: number
  y: number
  scale: number
  palette: readonly [string, string, string]
}) => {
  const id = `tb-${x}-${y}`
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      {[
        [-14, -46, 9],
        [0, -62, 11],
        [14, -40, 8],
      ].map(([tx, th, r]) => (
        <g key={tx}>
          <path d={`M${tx - r} 0v${th}a${r} 6 0 0 1 ${r * 2} 0V0Z`} fill={`url(#${id})`} />
          <ellipse cx={tx} cy={th} rx={r} ry="5.5" fill={palette[2]} fillOpacity="0.85" />
          <ellipse cx={tx} cy={th} rx={r * 0.55} ry="3" fill="#04101d" fillOpacity="0.55" />
        </g>
      ))}
    </g>
  )
}

/**
 * Mound coral.
 *
 * The heavy, rounded mass that fills the space between branching forms. A
 * reef built only from upright shapes reads as grass; the mounds are what
 * give it weight and a horizon line.
 */
const Mound = ({
  x,
  y,
  scale,
  palette,
}: {
  x: number
  y: number
  scale: number
  palette: readonly [string, string, string]
}) => {
  const id = `md-${Math.round(x)}-${Math.round(scale * 100)}`
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={id} cx="42%" cy="18%" r="88%">
          <stop offset="0%" stopColor={palette[2]} />
          <stop offset="46%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[0]} />
        </radialGradient>
      </defs>
      <path d="M-34 0c-3-20 6-36 16-42 12-7 28-4 36 6 7 9 9 24 6 36Z" fill={`url(#${id})`} />
      {/* The meandering grooves that name brain coral. */}
      <g stroke="#04101d" strokeOpacity="0.38" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M-26-10c8-6 16-2 24-8s14-2 20-8M-28-22c6-5 12 0 18-6s12 0 18-7M-20-32c5-4 10 0 15-5" />
      </g>
    </g>
  )
}

/**
 * The bed.
 *
 * Three ranks, back to front. The back rank is the water's own blue at low
 * opacity and heavy blur, so it reads as distance rather than as more coral;
 * the front rank is full-saturation and sharp. That separation is what gives
 * a flat SVG the depth a photograph gets for free.
 */
/*
 * Deterministic scatter.
 *
 * Positions come from a seeded generator rather than an evenly spaced array.
 * The first version laid coral out at a fixed pitch and the result read as a
 * picket fence: real reefs clump, leave gaps, and vary wildly in scale within
 * a metre. Seeding keeps it identical between server and client render, which
 * an actual `Math.random()` would not.
 */
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

type Placed = { x: number; scale: number; kind: number; palette: number; flip: boolean }

/** Lays out one rank: `count` forms across the width, clustered and varied. */
const scatter = (seed: number, count: number, minScale: number, maxScale: number): Placed[] => {
  const rand = mulberry(seed)
  return Array.from({ length: count }, () => {
    /* Squaring a uniform value biases toward the low end, which is what gives
       a few large specimens among many small ones rather than a uniform mob. */
    const bias = rand()
    return {
      x: -40 + rand() * 1520,
      scale: minScale + (maxScale - minScale) * bias * bias,
      kind: Math.floor(rand() * 10),
      palette: Math.floor(rand() * 3),
      flip: rand() > 0.5,
    }
  }).sort((a, b) => a.scale - b.scale)
}

const Rank = ({ items, y }: { items: Placed[]; y: number }) => (
  <>
    {items.map((item, i) => {
      const palette = PALETTES[item.palette]
      if (item.kind < 5) {
        return (
          <Branch key={i} x={item.x} y={y} scale={item.scale} palette={palette} flip={item.flip} />
        )
      }
      if (item.kind < 8) {
        return <Mound key={i} x={item.x} y={y} scale={item.scale * 0.9} palette={palette} />
      }
      if (item.kind === 8) {
        return <Fan key={i} x={item.x} y={y} scale={item.scale} palette={palette} />
      }
      return <Tubes key={i} x={item.x} y={y} scale={item.scale * 0.8} palette={palette} />
    })}
  </>
)

/**
 * The bed.
 *
 * Three ranks, back to front. The back rank is the water's own blue at low
 * opacity and heavy blur, so it reads as distance rather than as more coral;
 * the front rank is full-saturation and sharp. That separation is what gives
 * a flat SVG the depth a photograph gets for free.
 */
export const Reef = ({ className, size = 'full' }: ReefProps) => {
  /* Counts are high on purpose. Density is most of what separates a reef from
     a row of plants, and each form is a handful of paths, so sixty of them is
     still a fraction of the weight of one photograph. */
  const back = scatter(11, 26, 1.6, 4.2)
  const mid = scatter(29, 24, 1.2, 3.4)
  const front = scatter(47, 20, 0.9, 2.8)

  return (
    <svg
      className={[styles.reef, className].filter(Boolean).join(' ')}
      viewBox={size === 'full' ? '0 0 1440 320' : '0 0 1440 180'}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="reef-bloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="reef-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03101d" stopOpacity="0" />
          <stop offset="100%" stopColor="#03101d" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <g className={styles.rankBack}>
        <Rank items={back} y={332} />
      </g>
      <g className={styles.rankMid}>
        <Rank items={mid} y={336} />
      </g>
      <g filter="url(#reef-bloom)" className={styles.rankFront}>
        <Rank items={front} y={340} />
      </g>

      <rect
        x="0"
        y={size === 'full' ? 250 : 130}
        width="1440"
        height="90"
        fill="url(#reef-floor)"
      />
    </svg>
  )
}
