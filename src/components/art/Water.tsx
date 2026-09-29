import styles from './Water.module.css'

/**
 * The medium the whole site sits in.
 *
 * Three layers, each doing a different job, composited by CSS rather than
 * baked into an image so they cost nothing to ship and stay sharp at any
 * width:
 *
 *   shafts    light entering from above, at an angle, in varying widths
 *   caustics  the moving net of light a surface throws onto what is below
 *   motes     suspended particles, which is what actually sells "underwater"
 *
 * Without the third one the first two read as a blue gradient. Real water is
 * full of matter, and the eye uses that matter to judge that it is looking
 * *through* something rather than *at* something.
 *
 * All of it is decorative and inert: aria-hidden, no pointer events, and
 * every animation is gated behind `prefers-reduced-motion: no-preference`.
 */
export const Water = ({
  variant = 'deep',
  className,
}: {
  /**
   * `surface` is bright and close to the light, for a hero. `deep` is dimmer
   * with longer, weaker shafts, for the sections below it. `abyss` drops the
   * shafts entirely and keeps only motes, for the foot of the page.
   */
  variant?: 'surface' | 'deep' | 'abyss'
  className?: string
}) => (
  <div
    className={[styles.water, className].filter(Boolean).join(' ')}
    data-variant={variant}
    aria-hidden
  >
    {variant !== 'abyss' ? (
      <div className={styles.shafts}>
        {/* Widths and offsets are irregular on purpose. Evenly spaced shafts
            read as a striped background instead of as light. */}
        <span style={{ '--x': '8%', '--w': '9%', '--t': '-7deg', '--o': '0.7' } as never} />
        <span style={{ '--x': '21%', '--w': '4%', '--t': '-5deg', '--o': '0.45' } as never} />
        <span style={{ '--x': '38%', '--w': '14%', '--t': '-9deg', '--o': '1' } as never} />
        <span style={{ '--x': '57%', '--w': '6%', '--t': '-4deg', '--o': '0.6' } as never} />
        <span style={{ '--x': '69%', '--w': '11%', '--t': '-8deg', '--o': '0.85' } as never} />
        <span style={{ '--x': '86%', '--w': '5%', '--t': '-6deg', '--o': '0.5' } as never} />
      </div>
    ) : null}

    <div className={styles.caustics} />

    <div className={styles.motes}>
      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          style={
            {
              '--x': `${(i * 37) % 100}%`,
              '--y': `${(i * 61) % 100}%`,
              '--s': `${1 + ((i * 13) % 5) * 0.5}px`,
              '--d': `${18 + ((i * 7) % 22)}s`,
              '--delay': `${-((i * 3) % 20)}s`,
              '--o': 0.12 + ((i * 17) % 40) / 100,
            } as never
          }
        />
      ))}
    </div>
  </div>
)
