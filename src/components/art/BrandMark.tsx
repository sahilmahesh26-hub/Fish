import styles from './BrandMark.module.css'

/**
 * The Finquiry mark, redrawn as a horizontal lockup.
 *
 * The supplied logo is a square, stacked lockup: FIN above, QUIRY below, the
 * arowana lying across both. That composition is built for a profile picture
 * or a sticker and it collapses in a 72px header row, where the two words
 * would be about nine pixels tall each.
 *
 * So the mark is split into its two real parts and re-set on one line: the
 * fish as an icon, the name as type. It is the same drawing, the same cream,
 * the same single amber eye, at a size where all three survive. The stacked
 * original is still the right thing for the favicon and the share card, where
 * the canvas is square, and it is used there.
 */
export const BrandMark = ({ className }: { className?: string }) => (
  <span className={[styles.lockup, className].filter(Boolean).join(' ')}>
    <svg
      className={styles.fish}
      viewBox="0 0 120 46"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* A compressed reading of the logo's arowana: the silhouette, the two
          long fins, the forked tail, the barbels, and the eye. At 28px the
          scale work in the original is noise, so it is dropped rather than
          rendered as grey mush. */}
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M26 16C48 10 82 10 104 15" strokeOpacity="0.45" />
        <path d="M26 30C48 36 82 36 104 31" strokeOpacity="0.45" />
        <path
          d="M12 23c5-7 17-11 33-12 23-1 45 3 57 8 3 1 5 3 5 4s-2 3-5 4c-12 5-34 9-57 8-16-1-28-5-33-12Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M109 23l11-7c1 0 2 0 2 1l-2 6 2 6c0 1-1 1-2 1l-11-7Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path d="M13 26c-3 2-4 4-5 7M16 28c-2 2-3 5-3 7" strokeOpacity="0.6" />
        <path d="M23 13c2 6 2 14 0 20" strokeOpacity="0.4" />
      </g>
      <circle cx="19" cy="21" r="2.8" fill="var(--accent-500)" />
    </svg>
    <span className={styles.word}>
      Fin<span className={styles.quiry}>quiry</span>
    </span>
  </span>
)
