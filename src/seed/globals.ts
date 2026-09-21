import type { Payload } from 'payload'
import { log } from './helpers'
import { PROCESS_STEPS, PAGE_SEO } from './content'

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
        titleTemplate: '%s | Finquiry',
        defaultTitle: 'Finquiry, collector-led fish sourcing across India',
        description:
          'Tell us the species, variety, colour, pattern and size you are looking for. We search our network and share suitable specimens with actual photos, videos and individual pricing.',
        /*
         * No default social image is seeded, deliberately.
         *
         * Leaving it empty is what makes `app/(frontend)/opengraph-image.tsx`
         * take effect: a generated card in the site's own type and colours.
         * Pointing this at the placeholder artwork instead would put the words
         * "placeholder artwork" on every link ever shared. An operator who has
         * a real card of their own uploads it here, and it wins.
         */
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
        'Finquiry is a sourcing service for collectors. We search, verify and coordinate, we do not hold stock, and nothing moves without your approval.',
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
        { label: 'Cookie Policy', href: '/cookie-policy' },
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
        // The asterisks mark the run set in red italic.
        headline: 'Every Collector Is *Searching* for Something.',
        // Twenty words. Longer than that and the hero stops being a hero.
        body: 'Tell us the species, variety, colour and size. We search our network and come back with actual specimens.',
        // Three sentences, because the hero splits them into a rail.
        trustLine:
          'Actual specimen media. Individual pricing per fish. Nothing moves without your approval.',
        primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
        secondaryCta: { label: 'See How It Works', type: 'internal', href: '/how-it-works' },
        heroImage: media.hero,
      },
      /*
       * Seven sections, hero included.
       *
       * The page ran to eleven and roughly 11,800px, and most of the extra was
       * repetition: a trust band saying what the hero already says, an article
       * shelf rendering an empty state, an FAQ block duplicating the one on
       * How It Works. Each of those is now either folded into the hero rail or
       * living on the page it belongs to.
       *
       * Eyebrows: one, on the hero. The cap is one per three sections and the
       * budget allows two, but the headlines carry their sections without help
       * and a label above each one is the templated rhythm worth avoiding.
       * Every block still has the field for an editor who wants it back.
       */
      sections: [
        {
          blockType: 'sectionIntro',
          background: 'linen',
          heading: 'Your search should not end at one shop\u2019s stock.',
          body: "A collector's requirement is specific, and the fish that matches it is rarely sitting in the nearest tank. Finquiry takes that requirement to a wider sourcing network and comes back with the closest verified options we can actually find.",
          alignment: 'start',
        },
        {
          blockType: 'processRoute',
          background: 'linen-raised',
          heading: 'From a specific requirement to an approved specimen.',
          steps: PROCESS_STEPS,
          cta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
        },
        {
          blockType: 'categoryGrid',
          background: 'linen',
          heading: 'What collectors come to us searching for.',
          body: 'These are the kinds of searches we support, not a stock list. Every one of them begins with your requirement.',
          mode: 'all',
        },
        {
          blockType: 'specimenRecord',
          background: 'navy',
          heading: 'You see the individual fish, not a catalogue photograph.',
          body: 'Every option arrives as a specific specimen. Where it exists we send current photographs, video, approximate size, origin and feeding notes, so you are deciding about one fish rather than a species.',
          note: 'Availability and condition can change. We reconfirm the specimen before any payment or dispatch.',
          mainImage: media.specimen,
          /*
           * No detail crops and no `measurement`.
           *
           * Both exist as fields for a real record, and both render the moment
           * an editor fills them in. Seeding them meant the homepage staged
           * two empty plates and printed the same non-value ('Recorded per
           * specimen') three times, under the photograph and twice in the
           * sheet. An illustrative record should show what a collector is
           * told, not repeat a placeholder until it fills the column.
           */
          record: {
            requestId: 'FQ-0000-0000',
            origin: 'Named for every specimen we send',
            mediaStatus: 'pending',
            notes:
              'An illustrative record layout. Real specimen details, photographs and video are shared privately with the collector who asked for them.',
          },
        },
        {
          blockType: 'deliveryStories',
          background: 'linen',
          heading: 'Every delivery began as a search.',
          body: 'Documented sourcing journeys: the original requirement, the specimen, the route and the arrival.',
          mode: 'featured',
          limit: 3,
          emptyState: {
            heading: 'The first stories are being documented.',
            body: 'Delivery notes appear here once the specimen, the route and the customer\u2019s permission are all confirmed.',
            /*
             * Hidden rather than shown. There are no published delivery records
             * yet, and an empty state is not worth a whole screen on the
             * homepage. It returns by itself the moment one is published.
             */
            behaviour: 'hide',
          },
        },
        {
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Tell us what you are searching for.',
          body: 'The species, the variety, the colour, the size, the budget, the destination. We will tell you honestly what our network can find.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        },
      ],
      _status: 'published',
    } as never,
    ...ctx,
  })
  log('global: homepage')

  /*
   * Homepage SEO, filled only where empty.
   *
   * The block above rewrites the global wholesale on every run, which is fine
   * for layout the seed owns — but a meta title an editor tuned is theirs, so
   * it is patched separately and never overwritten.
   */
  const homepage = await payload.findGlobal({ slug: 'homepage', overrideAccess: true })
  const seo = PAGE_SEO.home
  const metaPatch: Record<string, unknown> = {}
  if (!homepage.meta?.title) metaPatch.title = seo.title
  if (!homepage.meta?.description) metaPatch.description = seo.description

  if (Object.keys(metaPatch).length > 0) {
    await payload.updateGlobal({
      slug: 'homepage',
      data: { meta: { ...(homepage.meta ?? {}), ...metaPatch } } as never,
      ...ctx,
    })
    log('global: homepage SEO')
  }
}
