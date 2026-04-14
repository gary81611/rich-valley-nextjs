/** Align with middleware host hints: brand selection for request-aware routes (sitemap, robots). */
export type SiteKey = 'rva' | 'alpenglow'

const AAL_HOSTS = new Set(['aspenalpenglowlimousine.com', 'www.aspenalpenglowlimousine.com'])
const RVA_HOSTS = new Set(['richvalleyadventures.com', 'www.richvalleyadventures.com'])

export function isAalHost(hostname: string): boolean {
  const h = hostname.trim().toLowerCase().split(':')[0]
  return AAL_HOSTS.has(h)
}

export function isRvaHost(hostname: string): boolean {
  const h = hostname.trim().toLowerCase().split(':')[0]
  return RVA_HOSTS.has(h)
}

/**
 * Maps Host header to CMS / sitemap site key. Defaults to `rva` when the host is not
 * clearly AAL or RVA (e.g. preview URLs).
 */
export function resolveSiteKeyFromHost(hostname: string): SiteKey {
  const h = hostname.trim().toLowerCase().split(':')[0]
  if (isAalHost(h)) return 'alpenglow'
  if (isRvaHost(h)) return 'rva'
  console.warn('[site-from-host] Unknown Host header; defaulting site to rva:', h || '(empty)')
  return 'rva'
}
