import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Water } from '@/components/art/Water'
import { Jellyfish, Arowana, Coral, Kelp } from '@/components/art/Creatures'
import styles from './Section.module.css'

export type Background = 'linen' | 'linen-raised' | 'navy' | 'scarlet' | null | undefined

type Props = {
  children: ReactNode
  background?: Background
  className?: string
  id?: string
  labelledBy?: string
  /** Removes the default vertical rhythm for sections that manage their own. */
  flush?: boolean
  /**
   * Which creature drifts in this section's margin, if any.
   *
   * The reference boards all do the same thing: a large translucent animal
   * bleeding in from one edge, behind the content, at a depth where it reads
   * as atmosphere rather than as an illustration someone has to look at. It
   * is what stops a stack of dark bands reading as a template.
   *
   * Left to the caller rather than cycled automatically, because the value of
   * the device is that it is occasional. A creature in every section is
   * wallpaper.
   */
  art?: 'jellyfish' | 'jellyfish-left' | 'arowana' | 'coral' | 'kelp' | 'none'
  /** Drops the light and particle layer. For plates and dense form pages. */
  quiet?: boolean
}

const backgroundClass: Record<string, string> = {
  linen: styles.linen,
  'linen-raised': styles.linenRaised,
  navy: styles.navy,
  scarlet: styles.scarlet,
}

/**
 * Section shell.
 *
 * Owns the four approved surfaces. The stored keys are unchanged so no CMS
 * content has to migrate, but what they render is now:
 *
 *   linen        the page itself
 *   linen-raised a band lifted one step off the page
 *   navy         the deep band, used where imagery or atmosphere carries
 *   scarlet      the plate, reserved for a decision. Amber now, not red;
 *                the key is unchanged so no CMS content had to migrate.
 *
 * Every surface except the red plate is dark, so `data-on-dark` is set on all
 * of them. Child components read it to keep their text, focus ring and labels
 * legible without knowing where they were placed.
 */
export const Section = ({
  children,
  background = 'linen',
  className,
  id,
  labelledBy,
  flush = false,
  art = 'none',
  quiet = false,
}: Props) => {
  const key = background ?? 'linen'
  const onAccent = key === 'scarlet'
  // Everything that is not the amber plate is a dark surface now.
  const onDark = !onAccent

  /*
   * The amber plate never gets water. It is the one surface on the site that
   * is opaque paint rather than a depth, which is what makes it read as a
   * decision rather than as more scenery.
   */
  const showWater = !onAccent && !quiet

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(styles.section, backgroundClass[key], flush && styles.flush, className)}
      {...(onDark ? { 'data-on-dark': '' } : {})}
      {...(onAccent ? { 'data-on-accent': '' } : {})}
    >
      {showWater ? <Water variant={key === 'navy' ? 'deep' : 'abyss'} /> : null}

      {art === 'jellyfish' ? <Jellyfish className={styles.artJellyRight} depth={0.34} /> : null}
      {art === 'jellyfish-left' ? <Jellyfish className={styles.artJellyLeft} depth={0.28} /> : null}
      {art === 'arowana' ? <Arowana className={styles.artArowana} depth={0.26} /> : null}
      {art === 'coral' ? <Coral className={styles.artCoral} depth={0.4} /> : null}
      {art === 'kelp' ? <Kelp className={styles.artKelp} depth={0.3} /> : null}

      <div className={styles.inner}>{children}</div>
    </section>
  )
}
