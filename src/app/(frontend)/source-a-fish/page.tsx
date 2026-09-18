import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getPageBySlug, getSiteSettings, getSourcingCategories } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/ui/JsonLd'
import { Button } from '@/components/ui/Button'
import { EnquiryForm } from '@/components/form/EnquiryForm'
import { whatsappLink } from '@/lib/whatsapp'
import styles from './source.module.css'

type Props = { searchParams: Promise<{ category?: string }> }

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Source a Fish', path: '/source-a-fish' },
]

export const generateMetadata = async (): Promise<Metadata> => {
  const [page, settings] = await Promise.all([getPageBySlug('source-a-fish'), getSiteSettings()])
  return buildMetadata({
    meta: page?.meta,
    title: page?.title ?? 'Source a Fish',
    description: page?.hero?.intro,
    path: '/source-a-fish',
    settings,
  })
}

const SourceAFishPage = async ({ searchParams }: Props) => {
  const { category } = await searchParams
  const [page, settings, categories] = await Promise.all([
    getPageBySlug('source-a-fish'),
    getSiteSettings(),
    getSourcingCategories(),
  ])

  // A category link from the homepage grid prefills the requirement field.
  const matched = categories.find((item) => item.slug === category)
  const wa = whatsappLink(settings)

  return (
    <>
      <PageHero
        eyebrow={page?.hero?.eyebrow ?? 'Start a sourcing request'}
        heading={page?.hero?.heading ?? page?.title ?? 'Source a Fish'}
        intro={page?.hero?.intro}
        breadcrumbs={TRAIL}
      />

      <Section background="linen" labelledBy="form-heading">
        <h2 id="form-heading" className="u-visually-hidden">
          Sourcing requirement form
        </h2>

        <div className={styles.layout}>
          <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
            <EnquiryForm defaultCategory={matched?.name} />
          </Suspense>

          <aside className={styles.aside} aria-labelledby="aside-heading">
            <h2 id="aside-heading" className={styles.asideHeading}>
              Prefer to talk it through?
            </h2>
            <p className={styles.asideBody}>
              If you are not sure how to describe the variety or size you want, message us and we
              will work it out with you.
            </p>
            {wa ? (
              <Button href={wa} external variant="secondary" event="source_whatsapp">
                Talk to Us on WhatsApp
              </Button>
            ) : null}

            <hr className={styles.asideRule} />

            <h3 className={styles.asideSubheading}>What happens next</h3>
            <ol className={styles.asideList}>
              <li>We review your requirement and confirm the details with you.</li>
              <li>We search the sources most relevant to what you asked for.</li>
              <li>You receive specimen-specific photos, video and individual pricing.</li>
              <li>Nothing is prepared or dispatched until you approve a specific fish.</li>
            </ol>
          </aside>
        </div>
      </Section>

      <RenderBlocks blocks={page?.layout} settings={settings} />

      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}

export default SourceAFishPage
