import { Section } from './Section'
import { RippleRings } from '@/components/art/Shapes'
import type { TrustStatementsBlock as TrustStatementsBlockType } from '@/payload-types'
import styles from './TrustStatements.module.css'

/**
 * Three strong editorial ideas plus smaller proof points.
 *
 * Deliberately not a six-card grid: each statement gets an oversized numeral
 * and its own column width, and the proof points sit as a quiet rail beneath.
 */
export const TrustStatements = ({ block }: { block: TrustStatementsBlockType }) => {
  const statements = block.statements ?? []
  const proofPoints = block.proofPoints ?? []
  const headingId = `trust-${block.id ?? 'statements'}`

  return (
    <Section background={block.background} labelledBy={headingId} className={styles.section}>
      <RippleRings className={styles.ripples} />

      <header className={styles.header}>
        {block.eyebrow ? <p className="u-eyebrow">{block.eyebrow}</p> : null}
        <h2 id={headingId} className={styles.heading}>
          {block.heading}
        </h2>
      </header>

      <ol className={styles.statements} role="list">
        {statements.map((statement, index) => (
          <li key={statement.id ?? index} className={styles.statement}>
            <span className={styles.numeral} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.statementHeading}>{statement.heading}</h3>
            <p className={styles.statementCopy}>{statement.copy}</p>
          </li>
        ))}
      </ol>

      {proofPoints.length > 0 ? (
        <ul className={styles.proofPoints} role="list">
          {proofPoints.map((point, index) => (
            <li key={point.id ?? index} className={styles.proofPoint}>
              {point.label}
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  )
}
