import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { RichText } from '@/components/ui/RichText'
import { JsonLd } from '@/components/ui/JsonLd'
import { faqSchema } from '@/lib/schema'
import { getFaqs, getFaqsByIds } from '@/lib/queries'
import type { FaqsBlock as FaqsBlockType } from '@/payload-types'
import styles from './Faqs.module.css'

/**
 * FAQ accordion built on native `<details>`.
 *
 * Keyboard operation, expand/collapse semantics and find-in-page all come free
 * from the element — no ARIA re-implementation, and it works before hydration.
 */
export const Faqs = async ({ block }: { block: FaqsBlockType }) => {
  const ids = (block.faqs ?? []).map((item) => (typeof item === 'object' ? item.id : item))
  const faqs =
    block.mode === 'selected' ? await getFaqsByIds(ids) : await getFaqs(block.category ?? undefined)

  if (faqs.length === 0) return null

  const headingId = `faqs-${block.id ?? 'block'}`

  return (
    <Section background={block.background} labelledBy={headingId}>
      <SectionHeading eyebrow={block.eyebrow} heading={block.heading} id={headingId} />

      <div className={styles.list}>
        {faqs.map((faq) => (
          <details key={faq.id} className={styles.item} name={`faq-${block.id ?? 'block'}`}>
            <summary className={styles.summary}>
              <span className={styles.question}>{faq.question}</span>
              <span className={styles.indicator} aria-hidden="true" />
            </summary>
            <div className={styles.answer}>
              <RichText data={faq.answer} />
            </div>
          </details>
        ))}
      </div>

      {/* Emitted only when the editor confirmed the same Q&As are visible here. */}
      {block.emitStructuredData ? <JsonLd data={faqSchema(faqs)} /> : null}
    </Section>
  )
}
