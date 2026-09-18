'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { enquirySchema, CONSENT_TEXT, UPLOAD_LIMITS } from '@/lib/enquirySchema'
import { reserveRequestId } from '@/lib/requestId'
import { checkRateLimit, MAX_ATTEMPTS_PER_WINDOW } from '@/lib/rateLimit'
import { hasSmtp, siteUrl } from '@/lib/env'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  /** Field-level messages, keyed by field name. */
  errors?: Record<string, string>
  /** A message about the submission as a whole. */
  message?: string
  requestId?: string
  fishRequired?: string
}

/** The one message both rate-limit tiers return, so neither reveals which it was. */
const tooManyRequests = (retryAfterSeconds: number): EnquiryState => ({
  status: 'error',
  message: `That is a lot of requests in a short time. Please try again in about ${Math.ceil(
    retryAfterSeconds / 60,
  )} minutes, or message us on WhatsApp.`,
})

/** Faster than any person could complete and submit the form. */
const MIN_ELAPSED_MS = 2500

const clientKey = async (): Promise<string> => {
  const headerList = await headers()
  // `x-forwarded-for` is set by the proxy; the first entry is the client.
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headerList.get('x-real-ip') || 'unknown'
}

/**
 * Server-side origin check.
 *
 * Next already compares `Origin` against `Host` for Server Actions, so this is
 * a second, explicit layer rather than the only one — and it is the layer an
 * auditor can read. A request with no `Origin` at all is allowed through: some
 * privacy tooling strips the header, and refusing those would break real
 * submissions to stop an attack the header does not prevent anyway.
 */
const originIsTrusted = async (): Promise<boolean> => {
  const headerList = await headers()
  const origin = headerList.get('origin')
  if (!origin) return true

  const expected = new Set<string>()
  const configured = siteUrl()
  if (configured) expected.add(configured.replace(/\/$/, ''))

  // The host this request actually arrived on, so a deployment behind a proxy
  // or on a preview domain is not locked out of its own form.
  const forwardedHost = headerList.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || headerList.get('host')
  if (host) {
    const proto = headerList.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https'
    expected.add(`${proto}://${host}`)
    expected.add(`http://${host}`)
    expected.add(`https://${host}`)
  }

  return expected.has(origin.replace(/\/$/, ''))
}

const str = (value: FormDataEntryValue | null): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Receives a sourcing enquiry.
 *
 * This is the only public write path into the Enquiries collection. The
 * collection itself denies public create, so everything has to come through
 * here, where it is rate limited, spam checked, validated against the shared
 * schema and only then written with `overrideAccess`.
 */
export const submitEnquiry = async (
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> => {
  // --- Origin --------------------------------------------------------------
  if (!(await originIsTrusted())) {
    return {
      status: 'error',
      message:
        'This request did not come from the Finquiry site. Please reload the page and try again, or message us on WhatsApp.',
    }
  }

  /*
   * Rate limit, in two tiers.
   *
   * The attempt budget is checked here, before anything else, and is generous:
   * a person who mistypes their number twice is not an abuser, and a strict
   * limit at this point would spend their allowance on their own corrections.
   * The strict budget is only charged further down, once a submission is about
   * to become a real enquiry.
   */
  const key = await clientKey()
  const attempts = checkRateLimit(`enquiry-attempt:${key}`, { max: MAX_ATTEMPTS_PER_WINDOW })
  if (!attempts.allowed) return tooManyRequests(attempts.retryAfterSeconds)

  // --- Spam checks ---------------------------------------------------------
  // A filled honeypot means a bot: return the generic success shape without
  // writing anything, so the bot learns nothing from the difference.
  if (str(formData.get('website'))) {
    return { status: 'success', requestId: 'FQ-0000-0000', fishRequired: '' }
  }

  // --- Validation ----------------------------------------------------------
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === 'string'),
  )
  const parsed = enquirySchema.safeParse(raw)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && !errors[field]) errors[field] = issue.message
    }
    return {
      status: 'error',
      errors,
      message: 'Please check the highlighted fields.',
    }
  }

  /*
   * Timing check, deliberately after validation.
   *
   * Run before validation it would hide genuine field errors behind a
   * confusing "too quick" message for anyone who types fast or uses autofill.
   * A bot posts a complete, valid payload instantly, so checking a complete
   * submission is both the safer and the more accurate place for it.
   */
  const elapsed = Number(formData.get('elapsed') ?? 0)
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_ELAPSED_MS) {
    return {
      status: 'error',
      message:
        'That was submitted unusually quickly. Please take a moment to review your details and submit again.',
    }
  }

  const data = parsed.data
  const payload = await getPayloadClient()

  try {
    /*
     * Duplicate submission guard.
     *
     * The browser mints one token per filled-in form, so a double click, an
     * impatient retry or a resubmitted navigation all carry the same value.
     * The lookup is against the database rather than an in-memory set on
     * purpose: a retry can land on a different instance, and an in-memory
     * guard would let the duplicate straight through.
     *
     * The original request ID is returned, so the second attempt shows the
     * same confirmation the first one did instead of an error the customer
     * cannot act on.
     */
    if (data.submissionToken) {
      const existing = await payload.find({
        collection: 'enquiries',
        where: { 'meta.submissionToken': { equals: data.submissionToken } },
        limit: 1,
        overrideAccess: true,
      })
      const already = existing.docs[0]
      if (already) {
        return {
          status: 'success',
          requestId: already.requestId as string,
          fishRequired: (already.fishRequired as string) ?? data.fishRequired,
        }
      }
    }

    /*
     * The strict budget, charged here and nowhere else — so it counts enquiries
     * actually created. A typo costs the visitor nothing, and a replayed
     * submission that was recognised above has already returned.
     */
    const creations = checkRateLimit(`enquiry:${key}`)
    if (!creations.allowed) return tooManyRequests(creations.retryAfterSeconds)

    // --- Reference image -------------------------------------------------
    // Stored in the private collection so it can never appear in the public
    // media library or be listed by the public API.
    let referenceImageId: number | undefined

    const file = formData.get('referenceImage')
    if (file instanceof File && file.size > 0) {
      if (!UPLOAD_LIMITS.accept.includes(file.type)) {
        return {
          status: 'error',
          errors: { referenceImage: `Upload a ${UPLOAD_LIMITS.acceptLabel} image.` },
          message: 'Please check the highlighted fields.',
        }
      }
      if (file.size > UPLOAD_LIMITS.maxBytes) {
        return {
          status: 'error',
          errors: {
            referenceImage: `That file is larger than ${UPLOAD_LIMITS.maxLabel}. Please upload a smaller image.`,
          },
          message: 'Please check the highlighted fields.',
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const created = await payload.create({
        collection: 'private-media',
        data: {},
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type,
          size: file.size,
        },
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
      referenceImageId = created.id as number
    }

    const requestId = await reserveRequestId(payload)

    await payload.create({
      collection: 'enquiries',
      data: {
        requestId,
        status: 'new',
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        email: data.email || undefined,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        fishRequired: data.fishRequired,
        species: data.species,
        variety: data.variety,
        preferredSize: data.preferredSize,
        sizeRange: data.sizeRange,
        quantity: typeof data.quantity === 'number' ? data.quantity : undefined,
        alternativesAccepted: data.alternativesAccepted,
        alternativesNotes: data.alternativesNotes,
        tankDimensions: data.tankDimensions,
        waterVolume: data.waterVolume,
        tankInhabitants: data.tankInhabitants,
        tankCycled: data.tankCycled,
        systemNotes: data.systemNotes,
        budgetRange: data.budgetRange,
        timeline: data.timeline,
        deliveryCity: data.deliveryCity,
        deliveryPincode: data.deliveryPincode || undefined,
        additionalRequirements: data.additionalRequirements,
        preferredContactTime: data.preferredContactTime,
        referenceImage: referenceImageId,
        meta: {
          sourcePage: data.sourcePage,
          submissionToken: data.submissionToken,
          consentAt: new Date().toISOString(),
          consentText: CONSENT_TEXT,
          utm: {
            source: data.utmSource,
            medium: data.utmMedium,
            campaign: data.utmCampaign,
            term: data.utmTerm,
            content: data.utmContent,
          },
        },
      },
      overrideAccess: true,
      context: { skipRevalidate: true },
    })

    // Link the upload back to its enquiry so staff can trace it.
    if (referenceImageId) {
      await payload.update({
        collection: 'private-media',
        id: referenceImageId,
        data: { enquiryRequestId: requestId },
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
    }

    // Admin notification, only when an email transport is actually configured.
    if (hasSmtp() && process.env.EMAIL_ADMIN_TO) {
      try {
        await payload.sendEmail({
          to: process.env.EMAIL_ADMIN_TO,
          subject: `New sourcing enquiry ${requestId}`,
          text: [
            `Request ID: ${requestId}`,
            `Fish required: ${data.fishRequired}`,
            `City: ${data.city}, ${data.state}`,
            '',
            'Open the enquiry in Payload for the full details.',
          ].join('\n'),
        })
      } catch (error) {
        // A failed notification must never lose the customer's enquiry.
        payload.logger.error({ err: error, requestId }, 'Could not send enquiry notification')
      }
    }

    return { status: 'success', requestId, fishRequired: data.fishRequired }
  } catch (error) {
    payload.logger.error({ err: error }, 'Could not record a sourcing enquiry')
    return {
      status: 'error',
      message:
        'Something went wrong saving your request. Please try again, or message us on WhatsApp and we will take the details there.',
    }
  }
}
