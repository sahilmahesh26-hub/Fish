import Link from 'next/link'
import { getFooter, getSiteSettings } from '@/lib/queries'
import { whatsappLink } from '@/lib/whatsapp'
import styles from './Footer.module.css'

export const SiteFooter = async () => {
  const [footer, settings] = await Promise.all([getFooter(), getSiteSettings()])
  const brand = settings.brandName ?? 'Finquiry'
  const wa = whatsappLink(settings)
  const address = settings.address

  const copyright = (footer.copyrightFormat ?? '© {year} {brand}.')
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{brand}', brand)

  return (
    <footer className={styles.footer} data-on-dark>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <span className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            {brand}
          </span>
          {footer.brandStatement ? (
            <p className={styles.statement}>{footer.brandStatement}</p>
          ) : null}
        </div>

        <div className={styles.columns}>
          {(footer.navGroups ?? []).map((group) => (
            <nav key={group.id ?? group.title} aria-label={group.title}>
              <h2 className={styles.columnTitle}>{group.title}</h2>
              <ul className={styles.columnList} role="list">
                {(group.links ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {footer.showContactDetails ? (
            <div>
              <h2 className={styles.columnTitle}>Contact</h2>
              <ul className={styles.columnList} role="list">
                {settings.contactEmail ? (
                  <li>
                    <a href={`mailto:${settings.contactEmail}`} className={styles.link}>
                      {settings.contactEmail}
                    </a>
                  </li>
                ) : null}
                {wa ? (
                  <li>
                    <a
                      href={wa}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="whatsapp_click"
                    >
                      WhatsApp the sourcing team
                    </a>
                  </li>
                ) : null}
                {address?.city ? (
                  <li className={styles.address}>
                    <address>
                      {[address.line1, address.line2].filter(Boolean).join(', ')}
                      {address.line1 ? <br /> : null}
                      {[address.city, address.state, address.postalCode].filter(Boolean).join(' ')}
                      <br />
                      {address.country}
                    </address>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.smallPrint}>
        <div className={styles.smallPrintInner}>
          <p className={styles.copyright}>{copyright}</p>
          {(footer.policyLinks ?? []).length > 0 ? (
            <nav aria-label="Policies">
              <ul className={styles.policyList} role="list">
                {(footer.policyLinks ?? []).map((link) => (
                  <li key={link.id ?? link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
