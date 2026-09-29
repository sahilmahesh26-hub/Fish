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
          <details
            key={faq.id}
            className={styles.item}
            name={`faq-${block.id ?? 'block'}`}
            /*
             * A lone question opens by default.
             *
             * An accordion earns its collapse by letting somebody scan several
             * headings and choose. With one item there is nothing to scan, so
             * a closed `<details>` under a heading that says "Common
             * questions" is just an answer the visitor has to go and find.
             * `name` still makes it exclusive if more are added later.
             */
            open={faqs.length === 1 || undefined}
          >
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
