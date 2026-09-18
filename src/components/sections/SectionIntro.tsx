import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { CurrentLine } from '@/components/art/Shapes'
import type { SectionIntroBlock as SectionIntroBlockType } from '@/payload-types'
import styles from './SectionIntro.module.css'

export const SectionIntro = ({ block }: { block: SectionIntroBlockType }) => {
  const headingId = `intro-${block.id ?? 'block'}`
  return (
    <Section background={block.background} labelledBy={headingId} className={styles.section}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
        align={block.alignment === 'center' ? 'center' : 'start'}
        className={styles.heading}
      />
      <CurrentLine className={styles.current} />
    </Section>
  )
}
