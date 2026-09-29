import { CmsImage } from '@/components/ui/CmsImage'
import { Button } from '@/components/ui/Button'
import { Water } from '@/components/art/Water'
import { Arowana, Jellyfish, Stingray } from '@/components/art/Creatures'
import { Reef } from '@/components/art/Reef'
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
 * Built as a water column rather than a banner.
 *
 * There are five planes, back to front: the CMS image if one exists, kelp at
 * the back wall, a stingray in the mid-water, the light and particles of the
 * `Water` layer, and finally a near arowana crossing the front at a size that
 * crops off the edge. Each plane is dimmer, cooler and slower than the one in
 * front of it, which is the only thing that produces depth: a single
 * photograph behind a scrim cannot, no matter how good the photograph is.
 *
 * The creatures are drawn, not photographed. Nothing here depicts a specimen
 * Finquiry holds, and none of it is presented as one.
 *
 * Rendered entirely on the server. The composition is complete before any
 * JavaScript runs.
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

      {/* --- The scene ---------------------------------------------------- */}
      {/* Mid-water. Large, slow, and well behind the type. */}
      <Stingray className={styles.ray} depth={0.5} />

      <Water variant="surface" className={styles.water} />

      {/* The floor. Saturated, dense, and the one place on the page where hot
          colour is allowed, because it is the thing the cold water is cold
          against. */}
      <Reef className={styles.reef} />

      {/* Foreground. Cropped by the viewport on purpose, so the frame reads
          as a window onto something larger than itself. */}
      <Jellyfish className={styles.jellyNear} depth={0.85} />
      <Jellyfish className={styles.jellyFar} depth={0.5} />
      <Arowana className={styles.arowana} depth={1} />

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
