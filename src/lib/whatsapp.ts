import type { SiteSetting } from '@/payload-types'

/**
 * Builds a wa.me deep link.
 *
 * The number always comes from Site Settings first so an editor can change it
 * without a deploy; the env var is only a fallback for a fresh install.
 * Returns null when no number is configured anywhere, so the UI can hide the
 * WhatsApp CTA rather than render a dead link.
 */
export const whatsappLink = (
  settings: Pick<SiteSetting, 'whatsappNumber' | 'whatsappDefaultMessage'> | null | undefined,
  message?: string,
): string | null => {
  const number =
    settings?.whatsappNumber?.replace(/\D/g, '') ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')

  if (!number) return null

  const text = message ?? settings?.whatsappDefaultMessage ?? ''
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${number}${query}`
}

/**
 * Continuation message after an enquiry is submitted.
 *
 * Deliberately carries only the request ID and a short, non-sensitive summary —
 * never the customer's name, number, budget or full requirement text, which
 * would otherwise end up in a URL and in browser history.
 */
export const enquiryWhatsappMessage = (requestId: string, fishRequired: string): string =>
  `Hello Finquiry, I have submitted a sourcing request. Request ID: ${requestId}. I am looking for: ${fishRequired}.`
