import type { Metadata } from 'next'
import { getPageBySlug, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { Button } from '@/components/ui/Button'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'

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
        /*
         * The eyebrow states what is actually true of this visit.
         *
         * It read "Request received" in both states, so a visitor who
         * arrived without a reference was told their request had been
         * received directly above a line saying we could not find it. On a
         * confirmation page that is not a wording problem, it is the page
         * telling someone their enquiry is safe when we cannot show that it
         * is.
         */
        eyebrow={hasRequest ? 'Request received' : 'No reference found'}
        heading={hasRequest ? 'Your search has started.' : 'Start your search'}
        /*
         * The copy follows the channel that actually exists.
         *
         * Telling someone to continue on WhatsApp when no number is
         * configured sends them looking for a message that will never
         * arrive, and it is the enquiry they already submitted that is at
         * stake. A missing number changes what we promise, never whether the
         * requirement was recorded.
         */
        intro={
          hasRequest
            ? wa
              ? 'We have recorded your requirement. Continue on WhatsApp to confirm the details with our sourcing team.'
              : 'We have recorded your requirement. Our sourcing team will be in touch using the contact details you gave us.'
            : wa
              ? 'We could not find a request reference. If you have just submitted a requirement, check your WhatsApp, otherwise start a new search.'
              : 'We could not find a request reference. If you have just submitted a requirement we already have it, otherwise start a new search.'
        }
      />

      <Section background="linen" className={styles.section}>
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
            /*
             * The no-reference state.
             *
             * This was a single grey sentence in a large empty card, which
             * told a visitor that something was missing and nothing about
             * what it meant for them. It now answers the question they
             * actually have — is my enquiry lost? — before offering the
             * action.
             */
            <>
              <p className={styles.label}>Nothing to confirm here</p>
              <h2 className={styles.heading}>This page arrived without a reference.</h2>
              <p className={styles.note}>
                A reference is added to this page automatically when a requirement is submitted, so
                you will usually see one here. Opening the page directly, reloading it later or
                following an old bookmark drops it.
              </p>
              <p className={styles.caveat}>
                If you submitted a requirement already, it is recorded and nothing further is needed
                from you — a missing reference here does not undo it. If you have not, the search
                starts with the form.
              </p>
            </>
          )}

          {/*
           * There is always exactly one primary action.
           *
           * WhatsApp is it when a number is configured. Without one, a
           * visitor who has no reference is sent to the enquiry form, and a
           * visitor who does have one is not given a second form to fill in,
           * because their requirement is already recorded: they get the
           * contact page instead. The page never ends in a dead end, and it
           * never renders a WhatsApp button that goes nowhere.
           */}
          <div className={styles.actions}>
            {wa ? (
              <Button href={wa} external size="lg" event="thankyou_whatsapp">
                Continue on WhatsApp
              </Button>
            ) : hasRequest ? (
              <Button href="/contact" size="lg">
                Contact the sourcing team
              </Button>
            ) : (
              <Button href="/source-a-fish" size="lg" event="thankyou_start_search">
                Start Your Search
              </Button>
            )}
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
