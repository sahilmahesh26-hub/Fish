import Link from 'next/link'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Carousel } from '@/components/ui/Carousel'
import { resolveLink } from '@/lib/links'
import { getSourcingCategories, getSourcingCategoriesByIds } from '@/lib/queries'
import type { CategoryGridBlock as CategoryGridBlockType, SiteSetting } from '@/payload-types'
import styles from './CategoryGrid.module.css'

/**
 * Sourcing categories, as a swipeable shelf.
 *
 * This was a static bento grid. Seven categories in a fixed mosaic reads as a
 * page of thumbnails, and on a phone it became a column seven screens long
 * that nobody scrolls to the end of. A shelf with arrows and dots is the
 * control the reference boards all use for exactly this content, and it makes
 * the section something you operate rather than something you scroll past.
 *
 * Every card still carries its availability label, so nothing here can be
 * mistaken for stock on hand.
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
    <Section
      art="jellyfish-left"
      background={block.background}
      labelledBy={headingId}
      id="what-we-source"
    >
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      <Carousel label="Sourcing categories" className={styles.shelf}>
        {categories.map((category, index) => (
          <li
            key={category.id}
            className={styles.card}
            /*
             * The first card is wider. In a shelf a single oversized leading
             * item reads as an editor's pick and gives the row somewhere to
             * start, where a run of identical tiles reads as a grid that
             * happens to scroll.
             */
            data-feature={index === 0 ? '' : undefined}
            id={category.slug}
          >
            <Link href={`/source-a-fish?category=${category.slug}`} className={styles.cardLink}>
              <div className={styles.media}>
                <CmsImage
                  media={category.coverMedia}
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 420px"
                  fallbackLabel="Category image"
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
      </Carousel>

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
