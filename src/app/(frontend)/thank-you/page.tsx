import type { Metadata } from 'next'
import { getPageBySlug, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { Button } from '@/components/ui/Button'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'
import { RippleRings } from '@/components/art/Shapes'
import { whatsappLink, enquiryWhatsappMessage } from '@/lib/whatsapp'
import { TrackView } from '@/components/layout/TrackView'
import { ANALYTICS_EVENTS } from '@/lib/analytics'
import styles from './thank-you.module.css'

type Props = { searchParams: Promise<{ request?: string; fish?: string }> }

export const generateMetadata = async (): Promise<Metadata> => {
  const [page, settings] = await Promise.all([getPageBySlug('thank-you'), getSiteSettings()])
  return {
    ...buildMetadata({
      meta: page?.meta,
      title: page?.title ?? 'Your search has started',
      path: '/thank-you',
      settings,
    }),
    // A confirmation page carries a request reference and has no value in
    // search results.
    robots: { index: false, follow: false },
  }
}

const ThankYouPage = async ({ searchParams }: Props) => {
  const { request, fish } = await searchParams
  const settings = await getSiteSettings()

  const hasRequest = Boolean(request)
  // The deep link carries the request ID and the fish description only — never
  // the name, number, budget or the rest of the requirement.
  const wa = hasRequest
    ? whatsappLink(
        settings,
        enquiryWhatsappMessage(request as string, fish ?? 'the fish in my request'),
      )
    : whatsappLink(settings)

  return (
    <>
      {/* No label: the request ID identifies a named person, and the fish
          description is what they typed. Neither may reach a provider. */}
      {hasRequest ? <TrackView event={ANALYTICS_EVENTS.requestConfirmationViewed} /> : null}

      <PageHero
        eyebrow="Request received"
        heading={hasRequest ? 'Your search has started.' : 'Start your search'}
        intro={
          hasRequest
            ? 'We have recorded your requirement. Continue on WhatsApp to confirm the details with our sourcing team.'
            : 'We could not find a request reference. If you have just submitted a requirement, check your WhatsApp — otherwise start a new search.'
        }
      />

      <Section background="linen" className={styles.section}>
        <RippleRings className={styles.ripples} />

        <div className={styles.card}>
          {hasRequest ? (
            <>
              <p className={styles.label}>Your request reference</p>
              <SpecimenStamp label="Request" value={request as string} className={styles.stamp} />
              <p className={styles.note}>
                Keep this reference. Quoting it lets us find your search straight away.
              </p>

              <hr className={styles.rule} />

              <h2 className={styles.heading}>What happens next</h2>
              <ol className={styles.steps}>
                <li>We review your requirement and come back with any questions.</li>
                <li>We check the sources most relevant to what you asked for.</li>
                <li>
                  You receive specimen-specific photographs, video where available and individual
                  pricing.
                </li>
                <li>Nothing is prepared or dispatched until you approve a specific fish.</li>
              </ol>

              <p className={styles.caveat}>
                Submitting a requirement does not confirm an order or guarantee availability. We
                will tell you honestly what our network can find.
              </p>
            </>
          ) : (
            <p className={styles.note}>No request reference was supplied with this page.</p>
          )}

          <div className={styles.actions}>
            {wa ? (
              <Button href={wa} external size="lg" event="thankyou_whatsapp">
                Continue on WhatsApp
              </Button>
            ) : null}
            <Button href="/" variant="secondary" size="lg">
              Back to home
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}

export default ThankYouPage
