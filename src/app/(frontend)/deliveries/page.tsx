import type { Metadata } from 'next'
import Link from 'next/link'
import { getDeliveries, getPageBySlug, getSiteSettings, getSourcingCategories } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { CmsImage } from '@/components/ui/CmsImage'
import { JsonLd } from '@/components/ui/JsonLd'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'
import { RouteArrow } from '@/components/art/Shapes'
import { Cta } from '@/components/sections/Cta'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import styles from './deliveries.module.css'

type Props = { searchParams: Promise<{ category?: string; origin?: string; destination?: string }> }

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Successful Deliveries', path: '/deliveries' },
]

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
  const [{ category, origin, destination }, page, settings] = await Promise.all([
    searchParams,
    getPageBySlug('deliveries'),
    getSiteSettings(),
  ])
  return buildMetadata({
    meta: page?.meta,
    title: page?.title ?? 'Successful Deliveries',
    description: page?.hero?.intro,
    // The canonical is always the unfiltered listing, so a filtered view
    // consolidates into it rather than competing with it.
    path: '/deliveries',
    settings,
    forceNoIndex: Boolean(category || origin || destination),
  })
}

const DeliveriesPage = async ({ searchParams }: Props) => {
  const { category, origin, destination } = await searchParams
  const [page, settings, categories, result] = await Promise.all([
    getPageBySlug('deliveries'),
    getSiteSettings(),
    getSourcingCategories(),
    getDeliveries({ limit: 24, categorySlug: category, origin, destination }),
  ])

  const deliveries = result.docs
  const isFiltered = Boolean(category || origin || destination)

  return (
    <>
      <PageHero
        eyebrow={page?.hero?.eyebrow ?? 'Real specimens. Documented routes.'}
        heading={page?.hero?.heading ?? page?.title ?? 'Successful Deliveries'}
        intro={page?.hero?.intro}
        breadcrumbs={TRAIL}
      />

      <Section background="linen">
        {/* Filters are links, not a JS widget, so they work without hydration
            and each filtered view has its own shareable URL. */}
        <nav aria-label="Filter deliveries" className={styles.filters}>
          <ul role="list" className={styles.filterList}>
            <li>
              <Link
                href="/deliveries"
                className={styles.filter}
                aria-current={!isFiltered ? 'page' : undefined}
              >
                All
              </Link>
            </li>
            {categories.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/deliveries?category=${item.slug}`}
                  className={styles.filter}
                  aria-current={category === item.slug ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {deliveries.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyHeading}>
              {isFiltered
                ? 'No published delivery matches this filter yet.'
                : 'The first stories are being documented.'}
            </p>
            <p className={styles.emptyBody}>
              {isFiltered
                ? 'Try another category, or start a new sourcing request and tell us what you are looking for.'
                : 'Real delivery notes will appear here only after the specimen, route and customer permission are confirmed. Nothing on this page is illustrative.'}
            </p>
            <Link href="/source-a-fish" className={styles.emptyLink}>
              Start a sourcing request
            </Link>
          </div>
        ) : (
          <ul className={styles.grid} role="list">
            {deliveries.map((delivery) => (
              <li key={delivery.id} className={styles.card}>
                <Link href={`/deliveries/${delivery.slug}`} className={styles.cardLink}>
                  <div className={styles.media}>
                    <CmsImage
                      media={delivery.mainImage}
                      sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 380px"
                      placeholderLabel="Delivery photograph"
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
                    <h2 className={styles.title}>{delivery.title}</h2>
                    <p className={styles.route}>
                      <span>{delivery.origin}</span>
                      <RouteArrow className={styles.arrow} />
                      <span>{delivery.destination}</span>
                    </p>
                    <p className={styles.specimen}>{delivery.specimen}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <RenderBlocks blocks={page?.layout} settings={settings} />

      <Cta
        block={{
          id: 'deliveries-cta',
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Every delivery begins as a search.',
          body: 'Tell us what you are looking for and we will tell you honestly what our network can find.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        }}
        settings={settings}
      />

      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}

export default DeliveriesPage
