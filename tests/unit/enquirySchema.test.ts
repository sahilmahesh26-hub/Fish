import { describe, it, expect } from 'vitest'
import { enquirySchema, STEPS, UPLOAD_LIMITS } from '@/lib/enquirySchema'

const valid = {
  fullName: 'A. Collector',
  whatsapp: '9876543210',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  fishRequired: 'Super red arowana, 10-12 inches',
  consent: 'on',
}

describe('enquirySchema', () => {
  it('accepts a minimal valid submission', () => {
    const result = enquirySchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('requires a name, number, location and the fish', () => {
    const result = enquirySchema.safeParse({ consent: 'on' })
    expect(result.success).toBe(false)
    if (result.success) return
    const fields = result.error.issues.map((issue) => issue.path[0])
    expect(fields).toContain('fullName')
    expect(fields).toContain('whatsapp')
    expect(fields).toContain('city')
    expect(fields).toContain('fishRequired')
  })

  it('rejects a submission without consent', () => {
    const result = enquirySchema.safeParse({ ...valid, consent: undefined })
    expect(result.success).toBe(false)
  })

  it.each([
    ['9876543210', true],
    ['+91 98765 43210', true],
    ['+919876543210', true],
    ['98765-43210', true],
    ['1234567890', false], // must not start 6–9
    ['98765', false],
    ['abcdefghij', false],
  ])('validates WhatsApp number %s -> %s', (whatsapp, expected) => {
    expect(enquirySchema.safeParse({ ...valid, whatsapp }).success).toBe(expected)
  })

  it.each([
    ['411001', true],
    ['011001', false], // must not start with 0
    ['41100', false],
    ['4110011', false],
  ])('validates PIN code %s -> %s', (pincode, expected) => {
    expect(enquirySchema.safeParse({ ...valid, pincode }).success).toBe(expected)
  })

  it('treats an untouched optional select as unanswered', () => {
    // An untouched <select> posts '', which must not fail the whole form.
    const result = enquirySchema.safeParse({
      ...valid,
      alternativesAccepted: '',
      tankCycled: '',
    })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.alternativesAccepted).toBeUndefined()
    expect(result.data.tankCycled).toBeUndefined()
  })

  it('keeps a chosen select value', () => {
    const result = enquirySchema.safeParse({ ...valid, alternativesAccepted: 'describe' })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.alternativesAccepted).toBe('describe')
  })

  it('rejects an invalid select value', () => {
    expect(enquirySchema.safeParse({ ...valid, tankCycled: 'maybe' }).success).toBe(false)
  })

  it('allows an empty optional email but rejects a malformed one', () => {
    expect(enquirySchema.safeParse({ ...valid, email: '' }).success).toBe(true)
    expect(enquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
    expect(enquirySchema.safeParse({ ...valid, email: 'a@b.co' }).success).toBe(true)
  })

  it('rejects a filled honeypot', () => {
    expect(enquirySchema.safeParse({ ...valid, website: 'http://spam' }).success).toBe(false)
  })

  it('coerces quantity and rejects zero', () => {
    const ok = enquirySchema.safeParse({ ...valid, quantity: '3' })
    expect(ok.success).toBe(true)
    if (ok.success) expect(ok.data.quantity).toBe(3)
    expect(enquirySchema.safeParse({ ...valid, quantity: '0' }).success).toBe(false)
  })

  it('trims whitespace from text values', () => {
    const result = enquirySchema.safeParse({ ...valid, fullName: '  A. Collector  ' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.fullName).toBe('A. Collector')
  })
})

describe('form steps', () => {
  it('covers every required field across the five steps', () => {
    const stepFields = new Set(STEPS.flatMap((step) => step.fields as readonly string[]))
    for (const field of ['fullName', 'whatsapp', 'city', 'state', 'pincode', 'fishRequired', 'consent']) {
      expect(stepFields.has(field)).toBe(true)
    }
  })

  it('has five steps with unique ids', () => {
    expect(STEPS).toHaveLength(5)
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(5)
  })
})

describe('upload limits', () => {
  it('only accepts raster image types', () => {
    expect(UPLOAD_LIMITS.accept).toEqual(['image/jpeg', 'image/png', 'image/webp'])
    // SVG can carry script, so it is deliberately not accepted from the public.
    expect(UPLOAD_LIMITS.accept).not.toContain('image/svg+xml')
  })
})
