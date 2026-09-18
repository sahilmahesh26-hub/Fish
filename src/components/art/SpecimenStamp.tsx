import { cn } from '@/lib/cn'
import styles from './SpecimenStamp.module.css'

/**
 * Request-ID stamp, styled like an ink mark in a collector's journal.
 *
 * The label is real text (not an image), so the reference stays selectable,
 * searchable and readable by assistive technology.
 */
export const SpecimenStamp = ({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) => (
  <span className={cn(styles.stamp, className)}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </span>
)
