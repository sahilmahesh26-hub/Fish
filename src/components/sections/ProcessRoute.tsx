import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { resolveLink } from '@/lib/links'
import type { ProcessRouteBlock as ProcessRouteBlockType, SiteSetting } from '@/payload-types'
import styles from './ProcessRoute.module.css'

/**
 * The sourcing process, drawn as a route rather than five equal cards.
 *
 * Steps alternate vertically and vary in scale along a dashed current line.
 * On narrow screens the same route rotates to a vertical spine, so it still
 * reads as a journey instead of collapsing into a plain list.
 */
export const ProcessRoute = ({
  block,
  settings,
}: {
  block: ProcessRouteBlockType
  settings: SiteSetting
}) => {
  const cta = resolveLink(block.cta, settings)
  const steps = block.steps ?? []
  const headingId = `process-${block.id ?? 'route'}`

  return (
    <Section background={block.background} labelledBy={headingId}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      <div className={styles.route}>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.id ?? index} className={styles.step}>
              <span className={styles.marker} aria-hidden="true">
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>
                  <span className="u-visually-hidden">{`Step ${index + 1}: `}</span>
                  {step.title}
                </h3>
                <p className={styles.stepCopy}>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {cta ? (
        <div className={styles.cta}>
          <Button href={cta.href} external={cta.external} size="lg" event="process_cta">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
