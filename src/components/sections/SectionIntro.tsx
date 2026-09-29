import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

import type { SectionIntroBlock as SectionIntroBlockType } from '@/payload-types'
import styles from './SectionIntro.module.css'
import { Reveal } from '@/components/ui/Reveal'

export const SectionIntro = ({ block }: { block: SectionIntroBlockType }) => {
  const headingId = `intro-${block.id ?? 'block'}`
  return (
    <Section
      art="jellyfish"
      background={block.background}
      labelledBy={headingId}
      className={styles.section}
    >
      <Reveal>
        <SectionHeading
          eyebrow={block.eyebrow}
          heading={block.heading}
          body={block.body}
          id={headingId}
          align={block.alignment === 'center' ? 'center' : 'start'}
          className={styles.heading}
        />
      </Reveal>
    </Section>
  )
}
