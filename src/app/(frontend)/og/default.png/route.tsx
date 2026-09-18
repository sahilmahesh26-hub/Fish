import { getSiteSettings } from '@/lib/queries'
import { ogCard } from '@/lib/og'

/**
 * The default social card, at a fixed URL.
 *
 * This is deliberately a route handler rather than Next's `opengraph-image`
 * file convention. That convention attaches the image to the segment holding
 * the file, and any deeper segment returning its own `openGraph` object from
 * `generateMetadata` — which every page here does — replaces it. The result was
 * a card on `/` and nowhere else.
 *
 * A fixed path instead lets `buildMetadata` name the fallback outright, so one
 * rule covers every route: a document's own image if it has one, this card if
 * it does not.
 */
export const dynamic = 'force-static'

export const GET = async () => {
  const settings = await getSiteSettings()
  return ogCard({
    heading: settings.defaultSeo?.defaultTitle ?? 'Collector-led fish sourcing across India',
    subheading:
      settings.shortDescription ??
      'Tell us the species, variety, colour and size you are searching for.',
    // The tagline, not a restatement of the heading — the footer bar is the one
    // line that survives when a network crops the card to a thumbnail.
    footnote: settings.tagline ?? 'Every collector is searching for something.',
  })
}
