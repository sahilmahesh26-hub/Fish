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
 * Owns the four approved surfaces and sets `data-on-dark` / `data-on-scarlet`,
 * which every child component reads to flip its text, focus ring and eyebrow
 * colour. That keeps contrast correct without each component knowing where it
 * has been placed.
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
  const onDark = key === 'navy'
  const onScarlet = key === 'scarlet'

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(styles.section, backgroundClass[key], flush && styles.flush, className)}
      {...(onDark ? { 'data-on-dark': '' } : {})}
      {...(onScarlet ? { 'data-on-scarlet': '' } : {})}
    >
      <div className={styles.inner}>{children}</div>
    </section>
  )
}
