import Link from 'next/link'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { resolveLink } from '@/lib/links'
import { getSourcingCategories, getSourcingCategoriesByIds } from '@/lib/queries'
import type { CategoryGridBlock as CategoryGridBlockType, SiteSetting } from '@/payload-types'
import styles from './CategoryGrid.module.css'

/**
 * Editorial grid of sourcing categories.
 *
 * Card sizes vary on a repeating rhythm and two cards deliberately overlap the
 * grid lines at desktop width. Every card carries its availability label, so
 * nothing here can be mistaken for stock on hand.
 */
export const CategoryGrid = async ({
  block,
  settings,
}: {
  block: CategoryGridBlockType
  settings: SiteSetting
}) => {
  const ids = (block.categories ?? []).map((item) => (typeof item === 'object' ? item.id : item))
  const categories =
    block.mode === 'selected'
      ? await getSourcingCategoriesByIds(ids)
      : await getSourcingCategories()

  if (categories.length === 0) return null

  const cta = resolveLink(block.cta, settings)
  const headingId = `categories-${block.id ?? 'grid'}`

  return (
    <Section background={block.background} labelledBy={headingId} id="what-we-source">
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      <ul className={styles.grid} role="list">
        {categories.map((category, index) => (
          <li
            key={category.id}
            className={styles.card}
            /* A four-step rhythm keeps the grid varied however many categories
               the editor publishes. */
            data-size={['lg', 'sm', 'sm', 'md'][index % 4]}
            id={category.slug}
          >
            <Link href={`/source-a-fish?category=${category.slug}`} className={styles.cardLink}>
              <div className={styles.media}>
                <CmsImage
                  media={category.coverMedia}
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 420px"
                  placeholderLabel="Image to be added"
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.availability}>{category.availabilityLabel}</p>
                <h3 className={styles.cardTitle}>{category.name}</h3>
                <p className={styles.cardCopy}>{category.shortDescription}</p>
                <span className={styles.cardAction} aria-hidden="true">
                  Start a search
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {cta ? (
        <div className={styles.cta}>
          <Button href={cta.href} external={cta.external} size="lg" event="category_cta">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
