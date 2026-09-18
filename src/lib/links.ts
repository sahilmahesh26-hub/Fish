import { whatsappLink } from './whatsapp'
import type { SiteSetting } from '@/payload-types'

export type ResolvedLink = {
  label: string
  href: string
  external: boolean
}

type CmsLink =
  | {
      label?: string | null
      type?: ('internal' | 'external' | 'whatsapp') | null
      href?: string | null
      url?: string | null
      whatsappMessage?: string | null
    }
  | null
  | undefined

/**
 * Turns a CMS link group into something renderable.
 *
 * Returns null when the link cannot be built — most often a WhatsApp CTA on a
 * site where no number has been configured yet. Callers hide the control
 * instead of rendering a link that goes nowhere.
 */
export const resolveLink = (link: CmsLink, settings: SiteSetting): ResolvedLink | null => {
  if (!link?.label) return null

  switch (link.type) {
    case 'external': {
      if (!link.url) return null
      return { label: link.label, href: link.url, external: true }
    }
    case 'whatsapp': {
      const href = whatsappLink(settings, link.whatsappMessage ?? undefined)
      if (!href) return null
      return { label: link.label, href, external: true }
    }
    case 'internal':
    default: {
      if (!link.href) return null
      return { label: link.label, href: link.href, external: false }
    }
  }
}
