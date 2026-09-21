import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
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
 *   red          the plate, reserved for a decision
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
}: Props) => {
  const key = background ?? 'linen'
  const onRed = key === 'scarlet'
  // Everything that is not the red plate is a dark surface now.
  const onDark = !onRed

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(styles.section, backgroundClass[key], flush && styles.flush, className)}
      {...(onDark ? { 'data-on-dark': '' } : {})}
      {...(onRed ? { 'data-on-red': '' } : {})}
    >
      <div className={styles.inner}>{children}</div>
    </section>
  )
}
