import Link from 'next/link'
import styles from './LegalReviewNotice.module.css'

/**
 * Shown on policy pages still marked as needing legal review.
 *
 * Deliberately prominent: these pages carry placeholder section headings, not
 * settled terms, and a reader must not mistake one for the other.
 */
export const LegalReviewNotice = () => (
  <div className={styles.wrapper}>
    <div className={styles.notice} role="note">
      <p className={styles.title}>Draft — pending legal review</p>
      <p className={styles.body}>
        This policy is a working draft. It sets out the sections this document will cover, but the
        wording has not yet been reviewed or approved, and it should not be relied on. Please{' '}
        <Link href="/contact">contact us</Link> with any question about how we handle your enquiry
        in the meantime.
      </p>
    </div>
  </div>
)
