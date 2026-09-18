import { permanentRedirect } from 'next/navigation'

/**
 * The feed moved to /rss.xml.
 *
 * Kept as a permanent redirect so any reader already subscribed to the old
 * path follows it across rather than silently going quiet.
 */
export const GET = () => {
  permanentRedirect('/rss.xml')
}
