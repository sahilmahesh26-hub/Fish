import { CmsImage } from '@/components/ui/CmsImage'
import { Button } from '@/components/ui/Button'
import { Starburst, BubbleCluster, RippleRings, CurrentLine } from '@/components/art/Shapes'
import { renderEmphasis } from '@/lib/emphasis'
import { resolveLink } from '@/lib/links'
import type { SiteSetting, Homepage } from '@/payload-types'
import { HeroMotion } from './HeroMotion'
import styles from './Hero.module.css'

type Props = {
  hero: Homepage['hero']
  settings: SiteSetting
}

/**
 * The homepage hero.
 *
 * Rendered entirely on the server: the composition is complete and readable
 * before any JavaScript runs. `HeroMotion` only layers pointer parallax on top,
 * and only on fine-pointer devices that have not asked for reduced motion.
 */
export const Hero = ({ hero, settings }: Props) => {
  const primary = resolveLink(hero?.primaryCta, settings)
  const secondary = resolveLink(hero?.secondaryCta, settings)

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Atmospheric outer glow: transparent tints of the four brand colours. */}
      <div className={styles.glow} aria-hidden="true">
        <span className={styles.glowScarlet} />
        <span className={styles.glowAegean} />
        <span className={styles.glowNavy} />
      </div>

      <HeroMotion className={styles.frame}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            {hero?.eyebrow ? <p className="u-eyebrow">{hero.eyebrow}</p> : null}

            <h1 id="hero-heading" className={styles.headline}>
              {renderEmphasis(hero?.headline, styles.emphasis)}
            </h1>

            <hr className={styles.rule} />

            {hero?.body ? <p className={styles.body}>{hero.body}</p> : null}

            <div className={styles.actions}>
              {primary ? (
                <Button
                  href={primary.href}
                  external={primary.external}
                  size="lg"
                  event="hero_primary_cta"
                >
                  {primary.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button
                  href={secondary.href}
                  external={secondary.external}
                  variant="secondary"
                  size="lg"
                  event="hero_whatsapp"
                >
                  {secondary.label}
                </Button>
              ) : null}
            </div>

            {hero?.trustLine ? <p className={styles.trust}>{hero.trustLine}</p> : null}
          </div>

          <div className={styles.stage}>
            {/* Two contained shapes sit behind the fish: one Aegean, one soft red. */}
            <span className={styles.shapeAegean} data-parallax="slow" aria-hidden="true" />
            <span className={styles.shapeScarlet} data-parallax="medium" aria-hidden="true" />
            <span className={styles.shapeOutline} data-parallax="slow" aria-hidden="true" />

            <RippleRings className={styles.ripples} />
            <BubbleCluster className={styles.bubbles} />
            <Starburst className={styles.starburst} />

            <div className={styles.fish} data-parallax="fast" data-idle-drift>
              <CmsImage
                media={hero?.fishImage}
                priority
                sizes="(max-width: 767px) 88vw, (max-width: 1279px) 46vw, 620px"
                className={styles.fishImage}
                placeholderLabel="Hero fish image — add a transparent cutout in Payload"
              />
            </div>

            {hero?.annotation ? (
              <p className={styles.annotation}>
                <span className={styles.annotationLine} aria-hidden="true" />
                {hero.annotation}
              </p>
            ) : null}
          </div>
        </div>

        {hero?.scrollHint ? (
          <a className={styles.scrollHint} href="#main-content-start">
            <span className={styles.scrollDot} aria-hidden="true" />
            {hero.scrollHint}
          </a>
        ) : null}
      </HeroMotion>

      {/* Current-like transition connecting the framed hero to the page body.
          A drawn current rather than a filled wedge, so it reads the same
          whatever background the next section uses. */}
      <div className={styles.transition} aria-hidden="true">
        <CurrentLine className={styles.transitionLine} />
      </div>
    </section>
  )
}
