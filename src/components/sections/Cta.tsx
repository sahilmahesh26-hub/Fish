import { Section } from './Section'
import { Button } from '@/components/ui/Button'

import { resolveLink } from '@/lib/links'
import type { CtaBlock as CtaBlockType, SiteSetting } from '@/payload-types'
import styles from './Cta.module.css'

/** Closing call to action: a confident red editorial block. */
export const Cta = ({ block, settings }: { block: CtaBlockType; settings: SiteSetting }) => {
  const primary = resolveLink(block.primaryCta, settings)
  const secondary = resolveLink(block.secondaryCta, settings)
  const headingId = `cta-${block.id ?? 'block'}`
  const onScarlet = (block.background ?? 'scarlet') === 'scarlet'

  return (
    <Section
      background={block.background ?? 'scarlet'}
      labelledBy={headingId}
      className={styles.section}
    >
      <div className={styles.inner}>
        {block.eyebrow ? <p className="u-eyebrow">{block.eyebrow}</p> : null}
        <h2 id={headingId} className={styles.heading}>
          {block.heading}
        </h2>
        <div className={styles.copy}>
          {block.body ? <p className={styles.body}>{block.body}</p> : null}

          <div className={styles.actions}>
            {primary ? (
              <Button
                href={primary.href}
                external={primary.external}
                size="lg"
                variant={onScarlet ? 'onDark' : 'primary'}
                event="final_cta_primary"
              >
                {primary.label}
              </Button>
            ) : null}
            {secondary ? (
              <Button
                href={secondary.href}
                external={secondary.external}
                size="lg"
                variant="secondary"
                className={onScarlet ? styles.secondaryOnScarlet : undefined}
                event="final_cta_whatsapp"
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  )
}
