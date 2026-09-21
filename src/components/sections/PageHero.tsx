import Link from 'next/link'
import { CmsImage } from '@/components/ui/CmsImage'

import type { Page } from '@/payload-types'
import styles from './PageHero.module.css'

type Props = {
  eyebrow?: string | null
  heading: string
  intro?: string | null
  image?: Page['hero'] extends { image: infer T } ? T : unknown
  /** Breadcrumb trail rendered above the heading. */
  breadcrumbs?: { name: string; path: string }[]
}

/**
 * Standard page opener.
 *
 * Carries the single H1 for the page, so no route needs to invent one.
 */
export const PageHero = ({ eyebrow, heading, intro, image, breadcrumbs }: Props) => (
  <section className={styles.hero} aria-labelledby="page-heading">
    <div className={styles.inner}>
      <div className={styles.copy}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <ol role="list">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path}>
                  {index < breadcrumbs.length - 1 ? (
                    <Link href={crumb.path}>{crumb.name}</Link>
                  ) : (
                    <span aria-current="page">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <p className="u-eyebrow">{eyebrow}</p> : null}
        <h1 id="page-heading" className={styles.heading}>
          {heading}
        </h1>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
      </div>

      {image ? (
        <div className={styles.media}>
          <CmsImage media={image as never} priority sizes="(max-width: 1023px) 92vw, 520px" />
        </div>
      ) : null}
    </div>
  </section>
)
