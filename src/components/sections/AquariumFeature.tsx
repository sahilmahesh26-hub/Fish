import { Section } from './Section'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { resolveLink } from '@/lib/links'
import type { AquariumFeatureBlock as AquariumFeatureBlockType, SiteSetting } from '@/payload-types'
import styles from './AquariumFeature.module.css'

/**
 * Custom aquariums: one large image, overlapping detail crops and a bold
 * Scarlet editorial panel carrying the service list and CTA.
 */
export const AquariumFeature = ({
  block,
  settings,
}: {
  block: AquariumFeatureBlockType
  settings: SiteSetting
}) => {
  const cta = resolveLink(block.cta, settings)
  const headingId = `aquarium-${block.id ?? 'feature'}`
  const services = block.services ?? []
  const details = block.detailImages ?? []

  return (
    <Section background="linen" labelledBy={headingId} className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.mediaColumn}>
          <div className={styles.mainImage}>
            <CmsImage
              media={block.mainImage}
              sizes="(max-width: 1023px) 92vw, 640px"
              placeholderLabel="Custom aquarium photograph"
            />
          </div>

          {details.length > 0 ? (
            <ul className={styles.crops} role="list">
              {details.map((detail, index) => (
                <li key={detail.id ?? index} className={styles.crop}>
                  <CmsImage media={detail.image} sizes="160px" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className={styles.panel} data-on-scarlet>
          {block.eyebrow ? <p className="u-eyebrow">{block.eyebrow}</p> : null}
          <h2 id={headingId} className={styles.heading}>
            {block.heading}
          </h2>
          {block.body ? <p className={styles.body}>{block.body}</p> : null}

          {services.length > 0 ? (
            <ul className={styles.services} role="list">
              {services.map((service, index) => (
                <li key={service.id ?? index} className={styles.service}>
                  {service.label}
                </li>
              ))}
            </ul>
          ) : null}

          {cta ? (
            <Button
              href={cta.href}
              external={cta.external}
              size="lg"
              variant="onDark"
              className={styles.cta}
              event="aquarium_cta"
            >
              {cta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
