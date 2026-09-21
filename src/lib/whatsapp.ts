import type { SiteSetting } from '@/payload-types'

/**
 * Numbers that ship in documentation rather than belonging to anyone.
 *
 * `919000000000` appears in `.env.example` and in every setup instruction as
 * an illustration of the required format, which is exactly what makes it
 * dangerous: it is the right length, it passes a digits-only check, it builds
 * a working `wa.me` URL, and it reaches somebody who is not Finquiry. A
 * collector who taps it is handed to a stranger.
 *
 * Rather than guess at country-code boundaries, this looks for the shapes real
 * subscriber numbers do not have: a long run of one repeated digit, a straight
 * ascending or descending run, or one of the values our own docs use.
 */
const DOCUMENTED_PLACEHOLDERS = new Set(['919000000000', '919876543210', '911234567890'])

const isPlaceholderNumber = (digits: string): boolean => {
  if (DOCUMENTED_PLACEHOLDERS.has(digits)) return true
  // Six or more of the same digit in a row: 9000000000, 911111111111.
  if (/(\d)\1{5,}/.test(digits)) return true
  // A straight run of eight or more, ascending or descending.
  const ASCENDING = '01234567890'
  const DESCENDING = '09876543210'
  for (let i = 0; i + 8 <= digits.length; i += 1) {
    const window = digits.slice(i, i + 8)
    if (ASCENDING.includes(window) || DESCENDING.includes(window)) return true
  }
  return false
}

/**
 * The configured WhatsApp number, or null when none is usable.
 *
 * Site Settings wins over the environment so an editor can change the number
 * without a deploy. Both sources are validated the same way: a number that is
 * missing, malformed or a documentation placeholder is treated as absent, and
 * every WhatsApp control on the site hides itself rather than sending a
 * collector to a stranger's phone.
 */
export const resolveWhatsappNumber = (
  settings: Pick<SiteSetting, 'whatsappNumber'> | null | undefined,
): string | null => {
  /*
   * `WHATSAPP_NUMBER` is read at runtime; `NEXT_PUBLIC_WHATSAPP_NUMBER` is not.
   *
   * Next inlines every `NEXT_PUBLIC_*` value into the bundle at build time,
   * server code included, so the public variable freezes whatever was set when
   * the site was built. Changing it on the host and restarting appears to do
   * nothing, which is a genuinely confusing way to lose a contact number.
   *
   * Nothing that builds this link runs in the browser, so the number does not
   * need to be public at all. The server-only variable is checked first and is
   * the one to set; the public one is still honoured so an existing deployment
   * does not lose its number on upgrade.
   */
  const candidates = [
    settings?.whatsappNumber,
    process.env.WHATSAPP_NUMBER,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue
    const digits = String(candidate).replace(/\D/g, '')
    // E.164 without the leading "+": country code plus subscriber number.
    if (!/^\d{8,15}$/.test(digits)) continue
    if (isPlaceholderNumber(digits)) continue
    return digits
  }

  return null
}

/** True when a real WhatsApp destination exists. Drives whether a WhatsApp CTA
 *  renders at all, or falls back to the on-site enquiry flow. */
export const hasWhatsapp = (
  settings: Pick<SiteSetting, 'whatsappNumber'> | null | undefined,
): boolean => resolveWhatsappNumber(settings) !== null

/**
 * Builds a wa.me deep link, or null when no usable number is configured.
 *
 * Callers must handle null by hiding the control or substituting the on-site
 * enquiry CTA. They must never render the link anyway.
 */
export const whatsappLink = (
  settings: Pick<SiteSetting, 'whatsappNumber' | 'whatsappDefaultMessage'> | null | undefined,
  message?: string,
): string | null => {
  const number = resolveWhatsappNumber(settings)
  if (!number) return null

  const text = message ?? settings?.whatsappDefaultMessage ?? ''
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${number}${query}`
}

/**
 * Continuation message after an enquiry is submitted.
 *
 * Deliberately carries only the request ID and a short, non-sensitive summary,
 * never the customer's name, number, budget or full requirement text, which
 * would otherwise end up in a URL and in browser history.
 */
export const enquiryWhatsappMessage = (requestId: string, fishRequired: string): string =>
  `Hello Finquiry, I have submitted a sourcing request. Request ID: ${requestId}. I am looking for: ${fishRequired}.`
