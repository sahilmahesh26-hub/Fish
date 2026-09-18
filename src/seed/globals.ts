import type { Payload } from 'payload'
import { log } from './helpers'
import { PROCESS_STEPS, AQUARIUM_SERVICES } from './content'

type SeedContext = {
  media: Record<string, number>
  /** Resolved for callers that pin specific categories. The seeded homepage
   *  uses "all active categories", so it picks up new ones automatically. */
  sourcing: Record<string, number>
}

/**
 * Seeds the four globals.
 *
 * Globals always exist in Payload, so these are updates rather than creates.
 * The homepage body is written as blocks, which is what lets an editor reorder
 * and hide sections afterwards without a developer.
 */
export const seedGlobals = async (payload: Payload, { media }: SeedContext) => {
  const ctx = { overrideAccess: true, context: { skipRevalidate: true } } as const

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      brandName: 'Finquiry',
      tagline: 'Every Collector Is Searching for Something.',
      shortDescription:
        'An enquiry-led fish-sourcing service for serious collectors across India. Tell us what you are searching for and we will search our network.',
      logo: media.logo,
      logoOnDark: media.logo,
      favicon: media.logo,
      // Left blank on purpose: real contact details are the owner's to supply.
      contactEmail: undefined,
      whatsappNumber: undefined,
      whatsappDefaultMessage:
        'Hello Finquiry, I would like help sourcing a fish. Here is what I am looking for:',
      address: { country: 'India' },
      defaultSeo: {
        titleTemplate: '%s — Finquiry',
        defaultTitle: 'Finquiry — Collector-led fish sourcing across India',
        description:
          'Tell us the species, variety, colour, pattern and size you are looking for. We search our network and share suitable specimens with actual photos, videos and individual pricing.',
        image: media.social,
      },
      organisation: { areaServed: 'India' },
      analytics: { provider: 'none' },
      consent: {
        enabled: false,
        message: 'We use a small amount of anonymous analytics to understand how the site is used.',
        policyLink: '/privacy-policy',
      },
    },
    ...ctx,
  })
  log('global: site-settings')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Home', href: '/' },
        { label: 'Source a Fish', href: '/source-a-fish', description: 'Start a sourcing request' },
        { label: 'How It Works', href: '/how-it-works', description: 'Requirement to arrival' },
        { label: 'Deliveries', href: '/deliveries', description: 'Documented journeys' },
        {
          label: 'Custom Aquariums',
          href: '/custom-aquariums',
          description: 'Fish-specific systems',
        },
        { label: 'Knowledge', href: '/knowledge', description: 'Guides for collectors' },
        { label: 'About', href: '/about', description: 'Why Finquiry exists' },
      ],
      cta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
      announcement: { enabled: false },
    },
    ...ctx,
  })
  log('global: header')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      brandStatement:
        'Finquiry is a sourcing service for collectors. We search, verify and coordinate — we do not hold stock, and nothing moves without your approval.',
      navGroups: [
        {
          title: 'Sourcing',
          links: [
            { label: 'Source a Fish', href: '/source-a-fish' },
            { label: 'How It Works', href: '/how-it-works' },
            { label: 'Successful Deliveries', href: '/deliveries' },
          ],
        },
        {
          title: 'Services',
          links: [
            { label: 'Custom Aquariums', href: '/custom-aquariums' },
            { label: 'Knowledge Hub', href: '/knowledge' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      ],
      policyLinks: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms and Conditions', href: '/terms-and-conditions' },
        { label: 'Sourcing and Delivery Policy', href: '/sourcing-and-delivery-policy' },
        { label: 'Restricted-Species Policy', href: '/restricted-species-policy' },
      ],
      showContactDetails: true,
      copyrightFormat: '© {year} {brand}. All rights reserved.',
    },
    ...ctx,
  })
  log('global: footer')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        eyebrow: 'Collector-led fish sourcing across India',
        // The asterisks mark the run that is set in Scarlet.
        headline: 'Every Collector Is *Searching* for Something.',
        body: 'Tell us the species, variety, colour, pattern and size you are looking for. We will search our network and share suitable specimens with actual photos, videos and individual pricing.',
        trustLine:
          'Actual specimen media. Individual pricing. No substitutions without your approval.',
        primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
        secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        fishImage: media.fish,
        annotation: 'Specimen shown is placeholder artwork',
        scrollHint: 'See how it works',
      },
      sections: [
        {
          blockType: 'sectionIntro',
          background: 'linen',
          eyebrow: 'Not another aquarium store',
          heading: 'You tell us the fish. We search beyond one store.',
          body: "A collector's search should not depend on the stock of a single aquarium shop. Finquiry brings your requirement to a wider sourcing network and returns with the closest verified options we can find.",
          alignment: 'start',
        },
        {
          blockType: 'processRoute',
          background: 'linen-raised',
          eyebrow: 'The sourcing route',
          heading: 'From a specific requirement to an approved specimen.',
          steps: PROCESS_STEPS,
          cta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
        },
        {
          blockType: 'categoryGrid',
          background: 'linen',
          eyebrow: 'Built around requirements',
          heading: 'A broader search for a more specific fish.',
          body: 'These categories represent the types of searches we support. They are not guaranteed stock lists. Every search begins with your requirement.',
          mode: 'all',
        },
        {
          blockType: 'specimenRecord',
          background: 'linen-raised',
          eyebrow: 'Review before approval',
          heading: 'See the individual fish—not a generic product photo.',
          body: 'Every option is shared as a specific specimen. Where available, we provide current photographs, videos, approximate size, origin, feeding information and other details that can be confirmed.',
          note: 'Availability and condition can change. We reconfirm the specimen before payment and dispatch.',
          mainImage: media.specimen,
          detailImages: [
            { image: media.detailA, caption: 'Detail crop — placeholder' },
            { image: media.detailB, caption: 'Detail crop — placeholder' },
          ],
          record: {
            requestId: 'FQ-0000-0000',
            measurement: 'Example only — recorded per specimen',
            origin: 'Recorded per specimen',
            mediaStatus: 'pending',
            notes:
              'This is an illustrative record layout. Real specimen details are shared privately with the collector who requested them.',
          },
        },
        {
          blockType: 'trustStatements',
          background: 'navy',
          eyebrow: 'Why collectors choose Finquiry',
          heading: 'A sourcing process collectors can follow.',
          statements: [
            {
              heading: 'Search wider',
              copy: 'One clear requirement can be checked across multiple relevant sources.',
            },
            {
              heading: 'See the actual fish',
              copy: 'Review specimen-specific photographs, videos and available details before deciding.',
            },
            {
              heading: 'Approve before it moves',
              copy: 'No substitution, preparation or dispatch without your written confirmation.',
            },
          ],
          proofPoints: [
            { label: 'Transparent availability' },
            { label: 'Individual pricing' },
            { label: 'Direct WhatsApp communication' },
            { label: 'Interstate delivery coordination' },
            { label: 'Custom aquarium support' },
          ],
        },
        {
          blockType: 'deliveryStories',
          background: 'linen',
          eyebrow: 'Documented journeys',
          heading: 'Every delivery begins as a search.',
          body: 'Explore real sourcing stories, from the original requirement and specimen review to packing, dispatch and arrival.',
          mode: 'featured',
          limit: 3,
          emptyState: {
            heading: 'The first stories are being documented.',
            body: 'Real delivery notes will appear here only after the specimen, route and customer permission are confirmed.',
            behaviour: 'show',
          },
        },
        {
          blockType: 'aquariumFeature',
          eyebrow: 'Custom aquarium solutions',
          heading: 'Built around the fish, not just the room.',
          body: 'From tank dimensions and filtration to stands, cabinets, lighting and equipment, we help plan systems around the specimen’s long-term requirements.',
          mainImage: media.aquarium,
          detailImages: [{ image: media.aquariumDetail }],
          services: AQUARIUM_SERVICES.map((label) => ({ label })),
          cta: { label: 'Plan Your Aquarium', type: 'internal', href: '/custom-aquariums' },
        },
        {
          blockType: 'featuredArticles',
          background: 'linen-raised',
          eyebrow: 'Knowledge for collectors',
          heading: 'Know more before you choose.',
          body: 'Practical guidance on evaluating specimens, preparing aquariums, managing arrival and making more informed collection decisions.',
          mode: 'latest',
          limit: 4,
          emptyState: {
            heading: 'The first guides are being written.',
            body: 'Six starter articles are drafted in the Knowledge Hub. They appear here as soon as an editor publishes them.',
            behaviour: 'show',
          },
          cta: { label: 'Browse the Knowledge Hub', type: 'internal', href: '/knowledge' },
        },
        {
          blockType: 'faqs',
          background: 'linen',
          eyebrow: 'Before you ask',
          heading: 'Questions collectors ask first.',
          mode: 'category',
          category: 'sourcing',
          emitStructuredData: true,
        },
        {
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Tell us what you are searching for.',
          body: 'Share the species, variety, colour, size, budget and destination. We will tell you honestly what our network can find.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'WhatsApp the Sourcing Team', type: 'whatsapp' },
        },
      ],
      _status: 'published',
    } as never,
    ...ctx,
  })
  log('global: homepage')
}
