import Link from 'next/link'
import { getHeader, getSiteSettings } from '@/lib/queries'
import { resolveLink } from '@/lib/links'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/art/BrandMark'
import { NavLink } from './NavLink'
import styles from './Header.module.css'

export const SiteHeader = async () => {
  const [header, settings] = await Promise.all([getHeader(), getSiteSettings()])
  const navItems = header.navItems ?? []
  const cta = resolveLink(header.cta, settings)
  const announcement = header.announcement

  return (
    <>
      {announcement?.enabled && announcement.text ? (
        <div className={styles.announcement} data-on-dark>
          {announcement.href ? (
            <Link href={announcement.href}>{announcement.text}</Link>
          ) : (
            <span>{announcement.text}</span>
          )}
        </div>
      ) : null}

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link
            href="/"
            className={styles.brand}
            aria-label={`${settings.brandName ?? 'Finquiry'}, home`}
          >
            <BrandMark />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList} role="list">
              {navItems.map((item) => (
                <li key={item.id ?? item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {cta ? (
              <Button
                href={cta.href}
                external={cta.external}
                variant="primary"
                className={styles.cta}
                event="header_cta"
              >
                {cta.label}
              </Button>
            ) : null}
            <MobileMenu
              navItems={navItems}
              cta={cta}
              brandName={settings.brandName ?? 'Finquiry'}
            />
          </div>
        </div>
      </header>
    </>
  )
}
