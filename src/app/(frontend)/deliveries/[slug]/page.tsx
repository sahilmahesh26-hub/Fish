import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDeliveryBySlug, getDeliveries, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { deliverySchema, breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { RichText } from '@/components/ui/RichText'
import { CmsImage } from '@/components/ui/CmsImage'
import { JsonLd } from '@/components/ui/JsonLd'
import { TrackView } from '@/components/layout/TrackView'
import { ANALYTICS_EVENTS } from '@/lib/analytics'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'
import { RouteArrow, MeasurementMark } from '@/components/art/Shapes'
import { Cta } from '@/components/sections/Cta'
import styles from './delivery.module.css'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = async () => {
  const { docs } = await getDeliveries({ limit: 200 })
  return docs.map((delivery) => ({ slug: delivery.slug as string }))
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const [delivery, settings] = await Promise.all([getDeliveryBySlug(slug), getSiteSettings()])
  if (!delivery) return {}

  return buildMetadata({
    meta: delivery.meta,
    title: delivery.title,
    description: delivery.requirement,
    image: delivery.mainImage,
    path: `/deliveries/${slug}`,
    settings,
    type: 'article',
  })
}

const DeliveryPage = async ({ params }: Props) => {
  const { slug } = await params
  const [delivery, settings] = await Promise.all([getDeliveryBySlug(slug), getSiteSettings()])
  if (!delivery) notFound()

  const category =
    typeof delivery.category === 'object' && delivery.category ? delivery.category : null

  const record = [
    { label: 'Specimen sourced', value: delivery.specimen },
    delivery.variety ? { label: 'Variety', value: delivery.variety } : null,
    delivery.approximateSize
      ? { label: 'Approximate size', value: delivery.approximateSize }
      : null,
    category ? { label: 'Category', value: category.name } : null,
    { label: 'Origin', value: delivery.origin },
    { label: 'Destination', value: delivery.destination },
    delivery.deliveryDate
      ? {
          label: 'Delivered',
          value: new Date(delivery.deliveryDate).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
          }),
        }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Successful Deliveries', path: '/deliveries' },
    { name: delivery.title, path: `/deliveries/${slug}` },
  ]

  return (
    <>
      {delivery._status === 'draft' ? <DraftBanner label="delivery story" /> : null}

      <PageHero
        eyebrow="Documented journey"
        heading={delivery.title}
        intro={delivery.requirement}
        breadcrumbs={trail}
      />

      <Section background="linen">
        <div className={styles.layout}>
          <div className={styles.mediaColumn}>
            <figure className={styles.mainFigure}>
              <div className={styles.mainImage}>
                <CmsImage
                  media={delivery.mainImage}
                  priority
                  sizes="(max-width: 1023px) 92vw, 700px"
                  placeholderLabel="Delivery photograph"
                />
              </div>
              <MeasurementMark className={styles.measure} />
            </figure>

            {(delivery.gallery ?? []).length > 0 ? (
              <ul className={styles.gallery} role="list">
                {(delivery.gallery ?? []).map((item, index) => (
                  <li key={item.id ?? index}>
                    <figure className={styles.galleryFigure}>
                      <div className={styles.galleryImage}>
                        <CmsImage media={item.image} sizes="280px" />
                      </div>
                      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                    </figure>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside className={styles.record} aria-label="Delivery record">
            {delivery.requestId ? (
              <SpecimenStamp label="Request" value={delivery.requestId} className={styles.stamp} />
            ) : null}

            <p className={styles.route}>
              <span>{delivery.origin}</span>
              <RouteArrow className={styles.arrow} />
              <span>{delivery.destination}</span>
            </p>

            <dl className={styles.recordList}>
              {record.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>

      {delivery.outcome ? (
        <Section background="linen-raised" labelledBy="outcome-heading">
          <h2 id="outcome-heading" className={styles.sectionHeading}>
            Outcome
          </h2>
          <RichText data={delivery.outcome} />
        </Section>
      ) : null}

      {(delivery.packingMedia ?? []).length > 0 ? (
        <Section background="linen" labelledBy="packing-heading">
          <h2 id="packing-heading" className={styles.sectionHeading}>
            Packing and dispatch
          </h2>
          <ul className={styles.gallery} role="list">
            {(delivery.packingMedia ?? []).map((item, index) => (
              <li key={item.id ?? index}>
                <figure className={styles.galleryFigure}>
                  <div className={styles.galleryImage}>
                    <CmsImage media={item.image} sizes="280px" />
                  </div>
                  {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                </figure>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* A testimonial is only ever rendered when consent is recorded on the
          document — the same rule the collection enforces on save. */}
      {delivery.testimonial && delivery.testimonialConsent ? (
        <Section background="navy" labelledBy="testimonial-heading">
          <h2 id="testimonial-heading" className="u-visually-hidden">
            Customer testimonial
          </h2>
          <figure className={styles.testimonial}>
            <blockquote>
              <p>{delivery.testimonial}</p>
            </blockquote>
            {delivery.testimonialAttribution ? (
              <figcaption>{delivery.testimonialAttribution}</figcaption>
            ) : null}
          </figure>
        </Section>
      ) : null}

      <Cta
        block={{
          id: 'delivery-cta',
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Searching for something similar?',
          body: 'Share the species, variety, size and destination. We will search our network and share what we can confirm.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        }}
        settings={settings}
      />

      <TrackView event={ANALYTICS_EVENTS.deliveryViewed} label={delivery.slug ?? undefined} />

      <JsonLd data={deliverySchema(delivery, settings)} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}

export default DeliveryPage
