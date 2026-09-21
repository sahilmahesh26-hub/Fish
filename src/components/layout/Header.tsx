import Link from 'next/link'
import { getHeader, getSiteSettings } from '@/lib/queries'
import { resolveLink } from '@/lib/links'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/Button'
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
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandName}>{settings.brandName ?? 'Finquiry'}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList} role="list">
              {navItems.map((item) => (
                <li key={item.id ?? item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
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
