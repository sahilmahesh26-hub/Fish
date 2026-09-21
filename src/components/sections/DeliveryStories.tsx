import Link from 'next/link'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'
import { RouteArrow } from '@/components/art/Shapes'
import { resolveLink } from '@/lib/links'
import { getDeliveries, getDeliveriesByIds } from '@/lib/queries'
import type { DeliveryStoriesBlock as DeliveryStoriesBlockType, SiteSetting } from '@/payload-types'
import styles from './DeliveryStories.module.css'

/**
 * Published delivery records, presented as sourcing postcards.
 *
 * Nothing is invented here. When no record has been published the block shows
 * the editor's own empty state, or hides itself entirely if that is what they
 * chose.
 */
export const DeliveryStories = async ({
  block,
  settings,
}: {
  block: DeliveryStoriesBlockType
  settings: SiteSetting
}) => {
  const ids = (block.deliveries ?? []).map((item) => (typeof item === 'object' ? item.id : item))
  const deliveries =
    block.mode === 'selected'
      ? await getDeliveriesByIds(ids)
      : (await getDeliveries({ featuredOnly: true, limit: block.limit ?? 3 })).docs

  const isEmpty = deliveries.length === 0

  if (isEmpty && block.emptyState?.behaviour === 'hide') return null

  const cta = resolveLink(block.cta, settings)
  const headingId = `deliveries-${block.id ?? 'stories'}`

  return (
    <Section background={block.background} labelledBy={headingId}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      {isEmpty ? (
        <div className={styles.empty}>
          <p className={styles.emptyHeading}>
            {block.emptyState?.heading ?? 'The first stories are being documented.'}
          </p>
          {block.emptyState?.body ? (
            <p className={styles.emptyBody}>{block.emptyState.body}</p>
          ) : null}
        </div>
      ) : (
        <ul className={styles.grid} role="list">
          {deliveries.map((delivery) => (
            <li key={delivery.id} className={styles.card}>
              <Link href={`/deliveries/${delivery.slug}`} className={styles.cardLink}>
                <div className={styles.media}>
                  <CmsImage
                    media={delivery.mainImage}
                    sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 400px"
                    fallbackLabel="Delivery photograph"
                  />
                  {delivery.requestId ? (
                    <SpecimenStamp
                      label="Request"
                      value={delivery.requestId}
                      className={styles.stamp}
                    />
                  ) : null}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{delivery.title}</h3>

                  <p className={styles.route}>
                    <span>{delivery.origin}</span>
                    <RouteArrow className={styles.arrow} />
                    <span>{delivery.destination}</span>
                  </p>

                  <dl className={styles.meta}>
                    <div>
                      <dt>Specimen</dt>
                      <dd>{delivery.specimen}</dd>
                    </div>
                    {delivery.approximateSize ? (
                      <div>
                        <dt>Approx. size</dt>
                        <dd>{delivery.approximateSize}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {cta ? (
        <div className={styles.cta}>
          <Button href={cta.href} external={cta.external} size="lg" event="deliveries_cta">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
