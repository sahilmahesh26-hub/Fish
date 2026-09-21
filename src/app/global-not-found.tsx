import type { Metadata } from 'next'
import Link from 'next/link'
import { archivo, manrope } from '@/lib/fonts'
import '@/styles/global.css'
import styles from './global-not-found.module.css'

export const metadata: Metadata = {
  title: 'Page not found, Finquiry',
  description: 'The page you are looking for may have moved, changed or never existed.',
  robots: { index: false, follow: false },
}

/**
 * 404 for routes that match no segment at all.
 *
 * These render outside every route group, so this file has to supply the whole
 * document — including `lang`, a `<main>` landmark and the single H1 that the
 * rest of the site guarantees. It deliberately avoids CMS queries: a 404 must
 * still render if the database is unreachable.
 */
const GlobalNotFound = () => (
  <html lang="en-IN" className={`${archivo.variable} ${manrope.variable}`}>
    <body>
      <main id="main-content" className={styles.wrapper}>
        <div className={styles.inner}>
          <p className="u-eyebrow">Error 404</p>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <h1 className={styles.heading}>This one slipped out of the net.</h1>
          <p className={styles.body}>
            The page you are looking for may have moved, changed or never existed.
          </p>

          {/* Home is the primary action here, not the enquiry form. Someone who
              landed on a dead URL is lost, not ready to describe a fish. */}
          <div className={styles.actions}>
            <Link className={styles.primary} href="/">
              Return Home
            </Link>
            <Link className={styles.secondary} href="/source-a-fish">
              Start Your Search
            </Link>
          </div>

          <nav aria-label="Popular pages" className={styles.links}>
            <h2 className={styles.linksHeading}>Popular pages</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link href="/deliveries">Successful Deliveries</Link>
              </li>
              <li>
                <Link href="/custom-aquariums">Custom Aquariums</Link>
              </li>
              <li>
                <Link href="/knowledge">Knowledge Hub</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>
    </body>
  </html>
)

export default GlobalNotFound
