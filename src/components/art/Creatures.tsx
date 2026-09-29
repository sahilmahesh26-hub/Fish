/**
 * The creature library.
 *
 * This environment has no photography and no image generation, and every
 * stock source is blocked, so the alternative to drawing these was another
 * page of abstract gradient plates. That is what made the site read as a
 * template.
 *
 * Drawing them is also the more on-brand answer. The Finquiry mark is not a
 * photograph, it is a line-drawn arowana: cream body, black scale work, one
 * amber eye. Building the site's imagery in the same language means the
 * decoration and the logo are the same object at different sizes, which a
 * stock photograph of a fish could never be.
 *
 * Every shape here is `aria-hidden` and `pointer-events: none`. They carry no
 * information; they are the medium the page sits in.
 */

type ArtProps = {
  className?: string
  /** Opacity multiplier, so one shape can sit at several depths. */
  depth?: number
}

const base = (className?: string) => ({
  className,
  'aria-hidden': true as const,
  focusable: 'false' as const,
  xmlns: 'http://www.w3.org/2000/svg',
})

/**
 * Arowana, the fish in the logo.
 *
 * Long body, unbroken dorsal and anal fins running most of its length, a
 * small forked tail set well back, two barbels at the chin, one amber eye.
 * Every mark is a path, so it stays crisp at 28px in the header and at 600px
 * across a hero, which is the whole reason this is not a PNG.
 */
export const Arowana = ({ className, depth = 1 }: ArtProps) => (
  <svg {...base(className)} viewBox="0 0 460 190" style={{ opacity: depth }}>
    <defs>
      <linearGradient id="aro-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--bone-100)" stopOpacity="0.5" />
        <stop offset="55%" stopColor="var(--aqua-300)" stopOpacity="0.26" />
        <stop offset="100%" stopColor="var(--aqua-500)" stopOpacity="0.14" />
      </linearGradient>
      <linearGradient id="aro-fin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--aqua-300)" stopOpacity="0.34" />
        <stop offset="100%" stopColor="var(--aqua-300)" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/*
      The fins are filled shapes, not strokes.
      
      An arowana is mostly fin: one dorsal and one anal, each running over half
      the body and meeting the tail. Drawn as hairlines they disappeared at
      any real size and the animal read as a plain ellipse, which is precisely
      what it looked like in the first pass. Given area, they become the
      silhouette, and the silhouette is the whole recognition.
    */}
    <path
      d="M108 74C168 52 286 46 372 60c16 2 28 6 34 10-8 3-20 5-36 6-84 6-200 4-262 0Z"
      fill="url(#aro-fin)"
      stroke="var(--aqua-300)"
      strokeOpacity="0.4"
      strokeWidth="1"
    />
    <path
      d="M108 116C168 138 286 144 372 130c16-2 28-6 34-10-8-3-20-5-36-6-84-6-200-4-262 0Z"
      fill="url(#aro-fin)"
      stroke="var(--aqua-300)"
      strokeOpacity="0.4"
      strokeWidth="1"
    />

    {/* Tail, behind the body so the join never shows. */}
    <path
      d="M404 95 452 62c5-3 8 0 6 5l-9 28 9 28c2 5-1 8-6 5l-48-33Z"
      fill="var(--aqua-300)"
      fillOpacity="0.2"
      stroke="var(--bone-100)"
      strokeOpacity="0.4"
      strokeWidth="1.2"
    />

    {/* Body. */}
    <path
      d="M56 95c20-26 66-42 128-44 88-3 176 12 222 30 11 4 18 10 18 14s-7 10-18 14c-46 18-134 33-222 30-62-2-108-18-128-44Z"
      fill="url(#aro-body)"
      stroke="var(--bone-100)"
      strokeOpacity="0.72"
      strokeWidth="1.6"
    />

    {/* Pectoral fin, gill plate, barbels: the details that read as "fish"
        rather than "shape" at a glance. */}
    <g
      fill="none"
      stroke="var(--bone-100)"
      strokeOpacity="0.45"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M96 62c9 20 9 46 0 66" />
      <path d="M128 112c14 16 30 24 48 26-16 6-34 2-50-8" strokeOpacity="0.3" />
      <path d="M58 106c-11 6-18 15-20 26M65 111c-8 9-11 19-11 30" />
    </g>

    {/* Scale rows: three dashed arcs following the body's curve. */}
    <g stroke="var(--bone-100)" strokeOpacity="0.2" strokeWidth="1" fill="none">
      {[0, 1, 2].map((row) => (
        <path
          key={row}
          d={`M${132 + row * 7} ${76 + row * 11}c54-7 126-6 188 3`}
          strokeDasharray="1 14"
        />
      ))}
    </g>

    {/* The eye: the one amber in the whole identity. */}
    <circle cx="82" cy="89" r="6" fill="var(--accent-500)" />
  </svg>
)

/**
 * Jellyfish.
 *
 * The floating element the reference boards all reach for, and for a good
 * reason: the silhouette stays readable when half of it is off the edge of
 * the frame, so it can bleed into a margin without needing a full rectangle
 * of space the way a photograph would.
 */
export const Jellyfish = ({ className, depth = 1 }: ArtProps) => (
  <svg {...base(className)} viewBox="0 0 200 440" style={{ opacity: depth }}>
    <defs>
      <radialGradient id="jelly-bell" cx="50%" cy="78%" r="70%">
        <stop offset="0%" stopColor="var(--bone-100)" stopOpacity="0.62" />
        <stop offset="42%" stopColor="var(--aqua-300)" stopOpacity="0.34" />
        <stop offset="100%" stopColor="var(--aqua-500)" stopOpacity="0.05" />
      </radialGradient>
      <linearGradient id="jelly-arm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--bone-100)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="var(--aqua-300)" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/*
      The bell is taller than it is wide and comes to a dome, with a scalloped
      margin where it meets the water. An earlier version used a wide, shallow
      arc with a flat hem and it read unmistakably as a mushroom: in a real
      bell the widest point sits low, near the opening, not at the crown.
    */}
    <path
      d="M100 18c40 0 70 40 70 88 0 22-5 38-12 48-5 7-13 2-18 8-4 5-9 9-15 4-5-4-10-4-15 0-5 5-11 6-16 1-5-4-10-5-15-1-5 5-12 5-16-2-5-8-13-3-18-10-7-10-12-26-12-48 0-48 30-88 70-88Z"
      fill="url(#jelly-bell)"
      stroke="var(--aqua-300)"
      strokeOpacity="0.5"
      strokeWidth="1.4"
    />

    {/* Radial canals: four, meeting at the apex, which is what gives the bell
        its volume without shading it. */}
    <g fill="none" stroke="var(--bone-100)" strokeOpacity="0.22" strokeWidth="1.2">
      <path d="M100 24v128M66 32c-10 38-13 82-8 118M134 32c10 38 13 82 8 118M100 24c-26 34-34 82-30 128M100 24c26 34 34 82 30 128" />
    </g>

    {/* Oral arms: four ruffled ribbons, wider at the top and tapering, hanging
        from inside the bell rather than from its rim. */}
    <g fill="url(#jelly-arm)" stroke="var(--bone-100)" strokeOpacity="0.2" strokeWidth="0.8">
      <path d="M84 150c-6 30 2 44-6 74 8-8 14-6 16-22 3-22-2-36-4-52Z" />
      <path d="M100 152c-3 34 4 50-4 84 9-10 16-8 18-26 3-26-6-40-8-58Z" />
      <path d="M116 150c6 30-2 44 6 74-8-8-14-6-16-22-3-22 2-36 4-52Z" />
    </g>

    {/* Tentacles: fine, unevenly spaced, and drawn past the bottom of the
        viewBox so any crop reads as a fragment of something longer. */}
    <g fill="none" stroke="var(--aqua-300)" strokeOpacity="0.34" strokeLinecap="round">
      {[
        [38, 1.1],
        [52, 0.7],
        [64, 1],
        [78, 0.6],
        [92, 1.2],
        [108, 0.7],
        [122, 1],
        [136, 0.6],
        [150, 1.1],
        [162, 0.7],
      ].map(([x, w], i) => (
        <path
          key={x}
          strokeWidth={w}
          d={`M${x} ${138 + (i % 3) * 6}c${i % 2 ? 18 : -18} 60 ${i % 2 ? -12 : 12} 118 ${
            i % 2 ? 8 : -8
          } 182`}
        />
      ))}
    </g>
  </svg>
)

/**
 * Stingray, seen from below and slightly ahead.
 *
 * Nearly all silhouette. It exists to be the large, calm, mid-depth shape a
 * composition needs so that the smaller, busier creatures have something to
 * be small against.
 */
export const Stingray = ({ className, depth = 1 }: ArtProps) => (
  <svg {...base(className)} viewBox="0 0 360 260" style={{ opacity: depth }}>
    <defs>
      <linearGradient id="ray-body" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="var(--bone-300)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="var(--aqua-500)" stopOpacity="0.14" />
      </linearGradient>
    </defs>
    <path
      d="M180 34c30 0 52 22 66 52 12 26 40 44 76 58 6 2 6 8 0 9-44 7-76 2-100-8-14 24-26 36-42 36s-28-12-42-36c-24 10-56 15-100 8-6-1-6-7 0-9 36-14 64-32 76-58 14-30 36-52 66-52Z"
      fill="url(#ray-body)"
      stroke="var(--bone-100)"
      strokeOpacity="0.4"
      strokeWidth="1.4"
    />
    {/* Tail. */}
    <path
      d="M180 182c2 32 2 54 0 72"
      fill="none"
      stroke="var(--bone-100)"
      strokeOpacity="0.32"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Gill slits, which is the detail that stops it reading as a kite. */}
    <g stroke="var(--bone-100)" strokeOpacity="0.22" strokeWidth="1.6" strokeLinecap="round">
      <path d="M156 118h-12M156 132h-14M156 146h-12M204 118h12M204 132h14M204 146h12" />
    </g>
  </svg>
)

/**
 * A stand of coral, for the bottom edge of a section.
 *
 * Branching, asymmetric, and built from one repeated arm at four scales so
 * the silhouette has the self-similarity real coral has.
 */
export const Coral = ({ className, depth = 1 }: ArtProps) => (
  <svg
    {...base(className)}
    viewBox="0 0 400 200"
    preserveAspectRatio="none"
    style={{ opacity: depth }}
  >
    <g fill="none" stroke="var(--aqua-400)" strokeOpacity="0.5" strokeLinecap="round">
      <g strokeWidth="3">
        <path d="M40 200c2-40 10-56 6-78M40 140c-14-12-22-26-22-44M46 152c14-14 20-30 18-50" />
        <path d="M150 200c-4-54 6-74 2-98M152 128c16-16 22-34 20-54M148 142c-16-14-24-30-24-50" />
        <path d="M300 200c6-46 0-66 4-90M304 130c14-12 20-28 18-46M298 144c-14-12-22-26-22-44" />
      </g>
      <g strokeWidth="2" strokeOpacity="0.32">
        <path d="M90 200c0-30 6-42 4-58M96 158c10-10 14-22 12-36M212 200c2-34-4-48-2-66M214 150c-10-10-16-22-16-38M356 200c-2-28 4-40 2-54M358 160c10-8 14-18 12-30" />
      </g>
    </g>
  </svg>
)

/**
 * Kelp. Tall, slow, and always at the very back.
 */
export const Kelp = ({ className, depth = 1 }: ArtProps) => (
  <svg
    {...base(className)}
    viewBox="0 0 120 600"
    preserveAspectRatio="none"
    style={{ opacity: depth }}
  >
    <g
      fill="none"
      stroke="var(--aqua-500)"
      strokeOpacity="0.4"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M30 600C18 480 42 420 30 320S18 160 36 40" />
      <path d="M72 600C86 470 60 400 76 300S88 150 68 30" />
    </g>
    <g fill="var(--aqua-500)" fillOpacity="0.2">
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={i % 2 ? 76 : 30} cy={70 + i * 58} rx="17" ry="7" />
      ))}
    </g>
  </svg>
)
