import styles from './DraftBanner.module.css'

/**
 * Marks a page that is only visible because draft preview is enabled.
 *
 * Without it, an editor reviewing a preview link has no way to tell that what
 * they are looking at is not live.
 */
export const DraftBanner = ({ label = 'page' }: { label?: string }) => (
  <div className={styles.banner} role="status">
    <span>Draft preview — this {label} is not published and is not visible to the public.</span>
    {/*
      A plain anchor on purpose: this hits a route handler that clears the
      draft-mode cookie, which needs a full document request. A client-side
      <Link> navigation would not clear it.
    */}
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/api/preview/exit" className={styles.exit}>
      Exit preview
    </a>
  </div>
)
