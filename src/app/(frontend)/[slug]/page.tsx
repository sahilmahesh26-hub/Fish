import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, getAllPageSlugs, getSiteSettings } from '@/lib/queries'
import { buildMetadata, isIndexablePage } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/ui/JsonLd'
import { LegalReviewNotice } from '@/components/ui/LegalReviewNotice'

/** Routes owned by a dedicated file; this catch-all must not shadow them. */
const RESERVED = new Set(['source-a-fish', 'deliveries', 'knowledge', 'thank-you'])

type Props = { params: Promise<{ slug: string }> }

/*
 * Unknown top-level paths are left unmatched on purpose.
 *
 * This app has no root layout — each route group owns its own `<html>`, which
 * is the Payload convention — and in that shape a `notFound()` raised from a
 * matched route renders Next's bare fallback with no `lang`, no `<main>` and
 * no H1. Letting an unknown slug miss this route entirely sends it to
 * `app/global-not-found.tsx` instead, which renders the full branded 404 with
 * the correct status.
 *
 * The cost is that a brand-new top-level page needs a rebuild before its URL
 * resolves. That suits these routes, About, Contact, the policies, which are
 * set up once. The genuinely editorial collections (`/knowledge/[slug]` and
 * `/deliveries/[slug]`) keep `dynamicParams` on, so new articles and delivery
 * stories go live the moment they are published. See QA.md for the detail.
 */
export const dynamicParams = false

export const generateStaticParams = async () => {
  const pages = await getAllPageSlugs()
  return pages
    .filter((page) => page.slug && !RESERVED.has(page.slug) && page.slug !== 'home')
    .map((page) => ({ slug: page.slug as string }))
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  if (!page) return {}

  const metadata = buildMetadata({
    meta: page.meta,
    title: page.title,
    description: page.hero?.intro,
    image: page.hero?.image,
    path: `/${slug}`,
    settings,
  })

  // Kept in step with the sitemap, which reads the same predicate.
  if (!isIndexablePage(page)) {
    return { ...metadata, robots: { index: false, follow: false } }
  }

  return metadata
}

const CmsPage = async ({ params }: Props) => {
  const { slug } = await params
  if (RESERVED.has(slug)) notFound()

  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  if (!page) notFound()

  const heading = page.hero?.heading || page.title

  return (
    <>
      <PageHero
        eyebrow={page.hero?.eyebrow}
        heading={heading}
        intro={page.hero?.intro}
        image={page.hero?.image}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: page.title, path: `/${slug}` },
        ]}
      />

      {/* A policy page that has not been through legal review says so, plainly,
          rather than presenting draft wording as settled terms. */}
      {page.pageType === 'policy' && page.legalReviewRequired ? <LegalReviewNotice /> : null}

      <RenderBlocks blocks={page.layout} settings={settings} />

      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: page.title, path: `/${slug}` },
        ])}
      />
    </>
  )
}

export default CmsPage
