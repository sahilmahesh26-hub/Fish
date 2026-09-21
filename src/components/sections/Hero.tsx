import { CmsImage } from '@/components/ui/CmsImage'
import { Button } from '@/components/ui/Button'
import { renderEmphasis } from '@/lib/emphasis'
import { resolveLink } from '@/lib/links'
import type { SiteSetting, Homepage } from '@/payload-types'
import styles from './Hero.module.css'

type Props = {
  hero: Homepage['hero']
  settings: SiteSetting
}

/**
 * The homepage hero.
 *
 * One image, held under a deep scrim, with the proposition set over it. The
 * previous version stacked a cartoon fish, three tinted shapes, ripples,
 * bubbles, a starburst, an annotation and a scroll cue over a cream field; all
 * of that is gone. What is left is the thing a collector actually needs in the
 * first three seconds: what this is, and where to start.
 *
 * Rendered entirely on the server. The composition is complete before any
 * JavaScript runs, which also means the largest paint is the image itself.
 */
export const Hero = ({ hero, settings }: Props) => {
  const primary = resolveLink(hero?.primaryCta, settings)
  const secondary = resolveLink(hero?.secondaryCta, settings)

  /*
   * The trust line arrives from the CMS as one sentence. Splitting it into
   * separate claims lets them sit along the base of the hero as a rail rather
   * than stacking a fifth paragraph under the buttons, which is what turns a
   * hero into a list.
   */
  const trustPoints = (hero?.trustLine ?? '')
    .split(/\.\s+|\.$/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.media} aria-hidden={hero?.heroImage ? undefined : 'true'}>
        <CmsImage
          media={hero?.heroImage}
          priority
          fill
          sizes="100vw"
          className={styles.mediaImage}
          fallbackLabel="Dark water, lit from above"
        />
        {/* Two scrims, not one: a vertical lift so type stays legible at the
            base, and a horizontal fade so the left column never fights the
            image behind it. */}
        <div className={styles.scrim} />
        <div className={styles.scrimSide} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          {hero?.eyebrow ? <p className={styles.eyebrow}>{hero.eyebrow}</p> : null}

          <h1 id="hero-heading" className={styles.headline}>
            {renderEmphasis(hero?.headline, styles.emphasis)}
          </h1>

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
                event="hero_secondary_cta"
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {trustPoints.length > 0 ? (
        <ul className={styles.trust}>
          {trustPoints.map((point) => (
            <li key={point} className={styles.trustItem}>
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
