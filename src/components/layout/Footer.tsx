import Link from 'next/link'
import { getFooter, getSiteSettings } from '@/lib/queries'
import { whatsappLink } from '@/lib/whatsapp'
import { CookiePreferencesLink } from '@/components/consent/CookiePreferencesLink'
import styles from './Footer.module.css'
import { BrandMark } from '@/components/art/BrandMark'
import { Reef } from '@/components/art/Reef'
import { Water } from '@/components/art/Water'

export const SiteFooter = async () => {
  const [footer, settings] = await Promise.all([getFooter(), getSiteSettings()])
  const brand = settings.brandName ?? 'Finquiry'
  const wa = whatsappLink(settings)
  const address = settings.address

  const copyright = (footer.copyrightFormat ?? '© {year} {brand}.')
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{brand}', brand)

  const hasContactDetails = Boolean(settings.contactEmail || wa || address?.city)

  return (
    <footer className={styles.footer} data-on-dark>
      {/*
        The floor of the page.
        
        The hero opens on a reef at the surface and the footer closes on one at
        depth: same bed, darker water, no light shafts. It is the device that
        makes the whole page read as a single column of water rather than as a
        stack of sections that happen to share a palette.
      */}
      <Water variant="abyss" className={styles.water} />
      <Reef className={styles.reef} size="low" />

      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <BrandMark className={styles.brand} />
          {footer.brandStatement ? (
            <p className={styles.statement}>{footer.brandStatement}</p>
          ) : null}
        </div>

        <div className={styles.columns}>
          {(footer.navGroups ?? [])
            .filter((group) => (group.links ?? []).length > 0)
            .map((group) => (
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

          {/*
           * The contact column only renders when it has something in it.
           *
           * Its three entries are all conditional: the email, the WhatsApp
           * link (hidden whenever no valid number is configured) and the
           * address. With none of them set the column still printed its
           * "Contact" heading over an empty list, which is the kind of
           * detail that makes a footer look unfinished. A heading is a
           * promise that something follows it.
           */}
          {footer.showContactDetails && hasContactDetails ? (
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
                {/* Always present, regardless of configuration — consent must stay
                    reversible from every page. */}
                <li>
                  <CookiePreferencesLink className={styles.link} />
                </li>
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
