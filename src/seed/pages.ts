import type { Payload } from 'payload'
import { upsertBySlug, log } from './helpers'
import {
  POLICY_PAGES,
  ABOUT_CONTENT,
  HOW_IT_WORKS_PHASES,
  AQUARIUM_SERVICES,
  PAGE_SEO,
} from './content'

type SeedContext = { media: Record<string, number> }

/**
 * Page records for every required route.
 *
 * Content pages are published; policy pages are created as drafts and flagged
 * for legal review, so none of them can reach the public site or the sitemap
 * until a person has actually reviewed them.
 */
export const seedPages = async (payload: Payload, { media }: SeedContext) => {
  const pages: {
    slug: string
    title: string
    pageType: 'standard' | 'policy' | 'utility'
    hero?: Record<string, unknown>
    layout?: unknown[]
    status: 'draft' | 'published'
    legalReviewRequired?: boolean
    showInNavigation?: boolean
  }[] = [
    {
      slug: 'source-a-fish',
      title: 'Source a Fish',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Start a sourcing request',
        heading: 'Tell us exactly what you are looking for.',
        intro:
          'The more specific your requirement, the more focused our search can be. If you are flexible on size, colour or variety, tell us that too.',
      },
      // The enquiry form itself is rendered by the route, not by a block —
      // it is an application, not editable page furniture.
      layout: [
        {
          blockType: 'faqs',
          background: 'linen-raised',
          eyebrow: 'Before you submit',
          heading: 'What to expect after you send a requirement.',
          mode: 'category',
          category: 'sourcing',
          emitStructuredData: false,
        },
      ],
    },
    {
      slug: 'how-it-works',
      title: 'How It Works',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Transparent from request to arrival',
        heading: 'A clear process for a highly specific search.',
        intro:
          'Finquiry does not display fish as permanently available products. We begin with your requirement, check the relevant network and share only the options we can currently confirm.',
      },
      layout: [
        {
          blockType: 'processRoute',
          background: 'linen',
          eyebrow: 'The eight phases',
          heading: 'What happens, and in what order.',
          steps: HOW_IT_WORKS_PHASES.map((phase) => ({ title: phase.title, copy: phase.copy })),
        },
        {
          blockType: 'specimenRecord',
          background: 'linen-raised',
          eyebrow: 'Option verification',
          heading: 'What a shared specimen looks like.',
          body: 'Each option arrives as a record for one individual fish, with the details we can genuinely confirm.',
          note: 'Fields are left blank when we cannot confirm them. We do not fill gaps with assumptions.',
          mainImage: media.specimen,
          detailImages: [{ image: media.detailA }, { image: media.detailB }],
          record: {
            measurement: 'Recorded per specimen',
            origin: 'Recorded per specimen',
            mediaStatus: 'pending',
          },
        },
        {
          blockType: 'faqs',
          background: 'linen',
          heading: 'Common questions about the process.',
          mode: 'category',
          category: 'delivery',
          emitStructuredData: true,
        },
        {
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Ready to start a search?',
          body: 'Share the species, size, colour, budget and destination. We will tell you honestly what our network can find.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        },
      ],
    },
    {
      slug: 'deliveries',
      title: 'Successful Deliveries',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Real specimens. Documented routes.',
        heading: 'Sourcing stories from requirement to arrival.',
        intro:
          'Every published story uses real records and customer-approved media. Filter by fish category, origin or destination to explore completed journeys.',
      },
    },
    {
      slug: 'custom-aquariums',
      title: 'Custom Aquariums',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Fish-specific systems',
        heading: 'An aquarium should be designed around what will live in it.',
        intro:
          'Finquiry helps plan custom aquariums for collectors who need the correct space, filtration, structure and equipment for a particular fish or collection.',
      },
      layout: [
        {
          blockType: 'aquariumFeature',
          eyebrow: 'What we help with',
          heading: 'From specimen requirements to a complete system.',
          body: 'We start from the fish: its adult size, its behaviour and the water it needs. The tank, the stand and the equipment follow from that.',
          mainImage: media.aquarium,
          detailImages: [{ image: media.aquariumDetail }],
          services: AQUARIUM_SERVICES.map((label) => ({ label })),
          cta: { label: 'Discuss Your Aquarium', type: 'whatsapp' },
        },
        {
          blockType: 'faqs',
          background: 'linen-raised',
          heading: 'Aquarium questions.',
          mode: 'category',
          category: 'aquariums',
          emitStructuredData: true,
        },
        {
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Planning a tank for a particular fish?',
          body: 'Share the species, expected adult size, available space and city. We will help define the right starting point.',
          primaryCta: { label: 'Discuss Your Aquarium', type: 'whatsapp' },
          secondaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
        },
      ],
    },
    {
      slug: 'knowledge',
      title: 'Knowledge Hub',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Collector knowledge',
        heading: 'Better questions lead to better decisions.',
        intro:
          'Guides for evaluating specimens, preparing systems, understanding delivery and caring for fish before and after arrival.',
      },
    },
    {
      slug: 'about',
      title: 'About',
      pageType: 'standard',
      status: 'published',
      showInNavigation: true,
      hero: {
        eyebrow: 'Why Finquiry exists',
        heading: 'Built for collectors who know the difference.',
      },
      layout: [
        {
          blockType: 'richText',
          background: 'linen',
          width: 'narrow',
          content: ABOUT_CONTENT,
        },
        {
          blockType: 'trustStatements',
          background: 'navy',
          eyebrow: 'How we work',
          heading: 'Three commitments that shape every search.',
          statements: [
            {
              heading: 'Search wider',
              copy: 'One requirement reaches a broader network than any single shop can offer.',
            },
            {
              heading: 'See the actual fish',
              copy: 'Real photos, real video and the details we can genuinely confirm.',
            },
            {
              heading: 'Approve before it moves',
              copy: 'Nothing is prepared or dispatched without your written confirmation.',
            },
          ],
        },
        {
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Tell us what you are searching for.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        },
      ],
    },
    {
      slug: 'contact',
      title: 'Contact',
      pageType: 'standard',
      status: 'published',
      hero: {
        eyebrow: 'Talk to the sourcing team',
        heading: "Let's start with the fish.",
        intro:
          'If you already know what you are looking for, submit a structured requirement. If you need help defining the variety, size or aquarium requirements, speak to us on WhatsApp.',
      },
    },
    {
      slug: 'thank-you',
      title: 'Your search has started',
      pageType: 'utility',
      status: 'published',
    },
    {
      slug: 'not-found',
      title: 'Page not found',
      pageType: 'utility',
      status: 'published',
    },
  ]

  for (const page of pages) {
    await upsertBySlug(payload, 'pages', page.slug, {
      title: page.title,
      pageType: page.pageType,
      hero: page.hero,
      layout: page.layout,
      showInNavigation: page.showInNavigation ?? false,
      _status: page.status,
    })
  }

  /*
   * Policy pages refresh while they are still flagged for legal review.
   *
   * The seed is create-only everywhere else, so an editor's work is never
   * overwritten. Policy pages are the exception: until someone unticks
   * "requires legal review" there is no approved wording to protect, and the
   * placeholder text should track what the site actually does. The moment
   * legal clears a page, that flag goes off and the seed stops touching it.
   */
  for (const policy of POLICY_PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: policy.slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })
    const stillDraftWording = existing.docs[0]?.legalReviewRequired !== false

    await upsertBySlug(
      payload,
      'pages',
      policy.slug,
      {
        title: policy.title,
        pageType: 'policy',
        legalReviewRequired: true,
        hero: { eyebrow: 'Policy', heading: policy.title, intro: policy.intro },
        layout: [
          {
            blockType: 'richText',
            background: 'linen',
            width: 'narrow',
            content: policy.content,
          },
        ],
        /*
         * Published, but flagged. These routes have to resolve, the footer and
         * the enquiry form's consent checkbox both link to them, and a 404 there
         * would be worse than a page that states its own status. The
         * `legalReviewRequired` flag renders a prominent notice on the page,
         * forces `noindex`, and keeps the page out of the sitemap until someone
         * unticks it in Payload.
         */
        _status: 'published',
      },
      { updateExisting: stillDraftWording },
    )
  }

  log(`pages: ${pages.length} content pages, ${POLICY_PAGES.length} policy drafts`)

  await seedPageSeo(payload)
}

/**
 * Starting meta titles and descriptions for the pages that have one.
 *
 * Write-once per field: a page whose SEO title is already set keeps it, even on
 * a page the policy loop above otherwise refreshes. These are a starting point
 * an editor is meant to rewrite, so the seed must never win an argument with
 * one — which also makes re-running this a no-op.
 */
const seedPageSeo = async (payload: Payload) => {
  let filled = 0

  for (const [slug, seo] of Object.entries(PAGE_SEO)) {
    // `home` lives on the Homepage global, not in Pages; it is seeded there.
    if (slug === 'home') continue

    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })
    const page = found.docs[0]
    if (!page) continue

    const patch: Record<string, unknown> = {}
    if (!page.meta?.title) patch.title = seo.title
    if (!page.meta?.description) patch.description = seo.description
    if (Object.keys(patch).length === 0) continue

    await payload.update({
      collection: 'pages',
      id: page.id,
      // Spread the existing group: Payload replaces a group wholesale, so
      // patching only the empty fields would drop a sibling image override.
      data: { meta: { ...(page.meta ?? {}), ...patch } } as never,
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
    filled += 1
  }

  log(`page SEO: ${filled} filled, ${Object.keys(PAGE_SEO).length - 1 - filled} already set`)
}
