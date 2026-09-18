import { cn } from '@/lib/cn'
import styles from './SectionHeading.module.css'

type Props = {
  eyebrow?: string | null
  heading: string
  body?: string | null
  id?: string
  align?: 'start' | 'center'
  className?: string
  /** Renders the heading as h3 inside sections that already own an h2. */
  as?: 'h2' | 'h3'
}

export const SectionHeading = ({
  eyebrow,
  heading,
  body,
  id,
  align = 'start',
  className,
  as: Tag = 'h2',
}: Props) => (
  <header className={cn(styles.header, align === 'center' && styles.center, className)}>
    {eyebrow ? <p className="u-eyebrow">{eyebrow}</p> : null}
    <Tag id={id} className={styles.heading}>
      {heading}
    </Tag>
    {body ? <p className={styles.body}>{body}</p> : null}
  </header>
)
