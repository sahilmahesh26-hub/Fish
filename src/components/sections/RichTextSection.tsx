import { Section } from './Section'
import { RichText } from '@/components/ui/RichText'
import { cn } from '@/lib/cn'
import type { RichTextBlock as RichTextBlockType } from '@/payload-types'
import styles from './RichTextSection.module.css'

export const RichTextSection = ({ block }: { block: RichTextBlockType }) => (
  <Section background={block.background}>
    <RichText
      data={block.content}
      className={cn(block.width === 'wide' ? styles.wide : styles.narrow)}
    />
  </Section>
)
