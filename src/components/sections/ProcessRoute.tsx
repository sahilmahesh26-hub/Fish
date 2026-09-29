import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { resolveLink } from '@/lib/links'
import type { ProcessRouteBlock as ProcessRouteBlockType, SiteSetting } from '@/payload-types'
import styles from './ProcessRoute.module.css'

/**
 * The sourcing process, drawn as a descent.
 *
 * This was five titles beside five paragraphs with a hairline down the left,
 * which is a table of contents, not a process. It was also the plainest thing
 * on a page whose hero is a reef.
 *
 * It is now a dive: each step sits at a stated depth, the water darkens as
 * you go down, and the marker for the step you have reached lights amber
 * while the ones below it stay unlit. Depth is doing real work here rather
 * than being a theme — it is the one metaphor that already means "further
 * along" and "harder to reach", which is exactly what a sourcing process is.
 *
 * The depths are labels for the stages, not measurements of anything; they
 * are generated from the step's position, never from CMS data, so no number
 * here can be read as a claim.
 */

/** The dive plan. One entry per step, deepening, with a zone name. */
const ZONES = [
  { depth: '0m', zone: 'Surface' },
  { depth: '20m', zone: 'Sunlight' },
  { depth: '60m', zone: 'Twilight' },
  { depth: '120m', zone: 'Midnight' },
  { depth: '200m', zone: 'The floor' },
] as const

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
    <Section background={block.background} labelledBy={headingId} className={styles.section}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      <div className={styles.dive}>
        {/* The shaft the markers hang on. Behind the steps, and it fades out
            at the bottom rather than stopping, because a hard end to a line
            that means "deeper" contradicts itself. */}
        <span className={styles.shaft} aria-hidden="true" />

        <ol className={styles.steps}>
          {steps.map((step, index) => {
            const zone = ZONES[Math.min(index, ZONES.length - 1)]
            return (
              <Reveal as="li" key={step.id ?? index} className={styles.step} delay={index * 90}>
                {/* The gauge. Decorative: the depth is a label for the stage,
                    so it is hidden from assistive technology, which gets the
                    step number from the heading instead. */}
                <div className={styles.gauge} aria-hidden="true">
                  <span className={styles.depth}>{zone.depth}</span>
                  <span className={styles.zone}>{zone.zone}</span>
                </div>

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
              </Reveal>
            )
          })}
        </ol>
      </div>

      {cta ? (
        <Reveal className={styles.cta}>
          <Button href={cta.href} external={cta.external} size="lg" event="process_cta">
            {cta.label}
          </Button>
        </Reveal>
      ) : null}
    </Section>
  )
}
