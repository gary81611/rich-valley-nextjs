/** Align with middleware host hints: brand selection for request-aware routes (sitemap, robots). */
export type SiteKey = 'rva' | 'alpenglow'

export function isAalHost(hostname: string): boolean {
  const h = hostname.trim().toLowerCase()
  return h.includes('aspenalpenglow') || h.includes('alpenglow')
}

export function isRvaHost(hostname: string): boolean {
  const h = hostname.trim().toLowerCase()
  return h.includes('richvalley') || h.includes('rva')
}

/**
 * Maps Host header to CMS / sitemap site key. Defaults to `rva` when the host is not
 * clearly AAL or RVA (e.g. preview URLs).
 */
export function resolveSiteKeyFromHost(hostname: string): SiteKey {
  const h = hostname.trim()
  if (isAalHost(h)) return 'alpenglow'
  if (isRvaHost(h)) return 'rva'
  console.warn('[site-from-host] Unknown Host header; defaulting site to rva:', h || '(empty)')
  return 'rva'
}
