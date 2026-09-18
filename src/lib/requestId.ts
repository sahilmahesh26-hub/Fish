import type { Payload } from 'payload'

/**
 * Human-readable request reference, e.g. FQ-2609-0001.
 *
 * `DDMM` plus a sequence that restarts each day. The sequence is derived from
 * the count of enquiries already created today; a unique index on `requestId`
 * is the real guarantee, and the caller retries on collision.
 */
export const buildRequestId = async (payload: Payload, now = new Date()): Promise<string> => {
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `FQ-${day}${month}`

  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const { totalDocs } = await payload.count({
    collection: 'enquiries',
    where: { createdAt: { greater_than_equal: startOfDay.toISOString() } },
    overrideAccess: true,
  })

  return `${prefix}-${String(totalDocs + 1).padStart(4, '0')}`
}

/**
 * Finds a free request ID, stepping past any that already exist.
 *
 * Two submissions in the same millisecond would otherwise derive the same
 * sequence; this keeps trying until it finds an unused reference.
 */
export const reserveRequestId = async (payload: Payload, attempts = 12): Promise<string> => {
  const now = new Date()
  const base = await buildRequestId(payload, now)
  const [prefixA, prefixB, sequence] = base.split('-')
  let next = Number(sequence)

  for (let i = 0; i < attempts; i += 1) {
    const candidate = `${prefixA}-${prefixB}-${String(next).padStart(4, '0')}`
    const existing = await payload.count({
      collection: 'enquiries',
      where: { requestId: { equals: candidate } },
      overrideAccess: true,
    })
    if (existing.totalDocs === 0) return candidate
    next += 1
  }

  // Extremely unlikely: fall back to a time-based suffix rather than failing
  // the customer's submission.
  return `${prefixA}-${prefixB}-${Date.now().toString().slice(-6)}`
}
