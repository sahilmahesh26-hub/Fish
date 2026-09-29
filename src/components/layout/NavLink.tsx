'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

/**
 * A primary navigation link that knows whether it is the current page.
 *
 * Worth a client component for two reasons, one visual and one not. The
 * visual one is that a nav with no current-page marker gives a visitor no
 * sense of where they are in the site. The other is `aria-current`, which is
 * how a screen-reader user gets that same information, and which cannot be
 * set from the server here because the layout is shared across every route.
 *
 * Matching is prefix-based so `/knowledge/some-article` still marks
 * "Knowledge", but `/` is matched exactly, or Home would be current on every
 * page.
 */
export const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname()
  const current = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={styles.navLink}
      data-current={current ? '' : undefined}
      aria-current={current ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
