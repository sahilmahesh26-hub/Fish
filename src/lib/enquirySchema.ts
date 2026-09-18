import { z } from 'zod'

/**
 * Sourcing enquiry schema.
 *
 * One definition, used by the browser for inline validation and by the server
 * action for the check that actually matters. The client copy is a convenience;
 * the server never trusts it.
 */

const trimmed = (max: number) => z.string().trim().max(max)
const required = (max: number, message: string) => trimmed(max).min(1, message)

/**
 * An optional `<select>`.
 *
 * A select the person never touched submits an empty string, not `undefined`,
 * so a plain `z.enum([...]).optional()` would reject the untouched control and
 * block the whole form. This treats empty as "not answered".
 */
const optionalEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.literal(''), z.enum(values)])
    .optional()
    // `transform` rather than `preprocess`, so the parsed type stays the union
    // of the allowed values instead of widening back to `string`.
    .transform((value): T[number] | undefined =>
      value === '' || value === undefined ? undefined : value,
    )

/** Indian mobile numbers, accepting the common ways people type them. */
const WHATSAPP_RE = /^(?:\+?91[-\s]?)?[6-9]\d{9}$/
const PINCODE_RE = /^[1-9]\d{5}$/

export const enquirySchema = z.object({
  // --- Step 1: about you ---------------------------------------------------
  fullName: required(120, 'Enter your name.'),
  whatsapp: required(20, 'Enter your WhatsApp number.').refine(
    (value) => WHATSAPP_RE.test(value.replace(/[\s-]/g, '')),
    'Enter a valid Indian mobile number, for example 98765 43210.',
  ),
  email: z
    .union([z.literal(''), z.string().trim().email('Enter a valid email address.')])
    .optional(),
  city: required(80, 'Enter your city.'),
  state: required(80, 'Enter your state.'),
  pincode: required(10, 'Enter your PIN code.').refine(
    (value) => PINCODE_RE.test(value),
    'Enter a valid 6-digit PIN code.',
  ),

  // --- Step 2: the fish ----------------------------------------------------
  fishRequired: required(160, 'Tell us which fish you are looking for.'),
  species: trimmed(120).optional(),
  variety: trimmed(120).optional(),
  preferredSize: trimmed(80).optional(),
  sizeRange: trimmed(80).optional(),
  quantity: z
    .union([z.literal(''), z.coerce.number().int().min(1, 'Enter 1 or more.').max(999)])
    .optional(),
  alternativesAccepted: optionalEnum(['yes', 'no', 'describe']),
  alternativesNotes: trimmed(600).optional(),

  // --- Step 3: your aquarium ----------------------------------------------
  tankDimensions: trimmed(120).optional(),
  waterVolume: trimmed(80).optional(),
  tankInhabitants: trimmed(600).optional(),
  tankCycled: optionalEnum(['yes', 'no', 'unsure', 'new-system']),
  systemNotes: trimmed(600).optional(),

  // --- Step 4: budget and timeline ----------------------------------------
  budgetRange: trimmed(80).optional(),
  timeline: trimmed(80).optional(),
  deliveryCity: trimmed(80).optional(),
  deliveryPincode: z
    .union([z.literal(''), z.string().trim().regex(PINCODE_RE, 'Enter a valid 6-digit PIN code.')])
    .optional(),

  // --- Step 5: reference and contact --------------------------------------
  additionalRequirements: trimmed(1200).optional(),
  preferredContactTime: trimmed(80).optional(),
  consent: z
    .union([z.literal('on'), z.literal('true'), z.boolean()])
    .refine((value) => value === true || value === 'on' || value === 'true', {
      message: 'Please confirm you are happy for us to contact you.',
    }),

  // --- Anti-spam. Not shown to people; a filled value means a bot. ---------
  website: z.string().max(0).optional(),
  // Milliseconds since the form was rendered, used to reject instant submits.
  elapsed: z.coerce.number().optional(),

  // --- Attribution ---------------------------------------------------------
  sourcePage: trimmed(200).optional(),
  utmSource: trimmed(120).optional(),
  utmMedium: trimmed(120).optional(),
  utmCampaign: trimmed(120).optional(),
  utmTerm: trimmed(120).optional(),
  utmContent: trimmed(120).optional(),
})

export type EnquiryInput = z.infer<typeof enquirySchema>

/** The exact wording a person agrees to. Stored with the enquiry. */
export const CONSENT_TEXT =
  'I agree that Finquiry may contact me on WhatsApp, phone or email about this sourcing request, and I have read the Privacy Policy.'

/** Step definitions, shared by the form UI and the step indicator. */
export const STEPS = [
  {
    id: 'about-you',
    title: 'About you',
    description: 'So we know who we are searching for and where the fish would travel to.',
    fields: ['fullName', 'whatsapp', 'email', 'city', 'state', 'pincode'],
  },
  {
    id: 'the-fish',
    title: 'The fish you are searching for',
    description: 'The more specific you are, the more focused our search can be.',
    fields: [
      'fishRequired',
      'species',
      'variety',
      'preferredSize',
      'sizeRange',
      'quantity',
      'alternativesAccepted',
      'alternativesNotes',
    ],
  },
  {
    id: 'your-aquarium',
    title: 'Your aquarium',
    description: 'Helps us judge whether a specimen actually suits your system.',
    fields: ['tankDimensions', 'waterVolume', 'tankInhabitants', 'tankCycled', 'systemNotes'],
  },
  {
    id: 'budget-timeline',
    title: 'Budget and timeline',
    description: 'A range is fine. It helps us search in the right places.',
    fields: ['budgetRange', 'timeline', 'deliveryCity', 'deliveryPincode'],
  },
  {
    id: 'reference-contact',
    title: 'Reference and contact preference',
    description: 'Anything else that helps, and how you would like us to reach you.',
    fields: ['referenceImage', 'additionalRequirements', 'preferredContactTime', 'consent'],
  },
] as const

export type StepId = (typeof STEPS)[number]['id']

/** Upload limits, shown on the form and enforced on the server. */
export const UPLOAD_LIMITS = {
  maxBytes: 8 * 1024 * 1024,
  maxLabel: '8 MB',
  accept: ['image/jpeg', 'image/png', 'image/webp'],
  acceptLabel: 'JPG, PNG or WebP',
}

/** Fields never written to localStorage — see the autosave note in EnquiryForm. */
export const NEVER_AUTOSAVED: readonly string[] = ['fullName', 'whatsapp', 'email', 'consent']

/**
 * The only field names autosave will persist.
 *
 * An allowlist rather than a denylist: a form also carries React's internal
 * server-action fields and our hidden anti-spam and attribution inputs, none of
 * which belong in a visitor's browser storage.
 */
export const AUTOSAVED_FIELDS: readonly string[] = STEPS.flatMap(
  (step) => step.fields as readonly string[],
).filter((field) => !NEVER_AUTOSAVED.includes(field) && field !== 'referenceImage')
