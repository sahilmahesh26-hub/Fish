import 'server-only'
import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

/**
 * Shared Payload instance for server-side rendering.
 *
 * `getPayload` already memoises per process; this wrapper exists so frontend
 * code imports one thing and never reaches for the REST API when the Local API
 * will do (no HTTP hop, no serialisation, no extra auth round trip).
 */
export const getPayloadClient = async () => getPayloadInstance({ config })
