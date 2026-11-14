/**
 * AAL canonical URLs, host-only redirects, and sitemap normalization.
 * RVA production hosts are not redirected here. Shared legal pages use isAalHost
 * so the same route file does not hard-code an AAL canonical.
 */
import { hrefForServiceArea } from '@/lib/alpenglow-service-areas'
import { hrefForService } from '@/lib/alpenglow-services'
import { isAalHost, isRvaHost } from '@/lib/site-from-host'

export const AAL_CANONICAL_ORIGIN = 'https://aspenalpenglowlimousine.com'
export const RVA_CANONICAL_ORIGIN = 'https://www.richvalleyadventures.com'

/**
 * Slashless AAL path 301s. Existing destinations stay as they are.
 * `/gallery` is included so the public URL does not 307 while naming itself canonical.
 */
export const AAL_PATH_REDIRECTS: Readonly<Record<string, string>> = {
  '/services/ski-resort-transfers': '/ski-resort-transfers',
  '/services/airport-transfers': '/airport-transfers',
  '/wedding-transportation': '/weddings',
  '/corporate-events': '/corporate',
  '/services/corporate-events': '/corporate',
  '/services/corporate-travel': '/corporate',
  '/services/wedding-transportation': '/weddings',
  '/services/charter-services': '/services/hourly-charter',
  '/areas/aspen': '/service-areas/aspen',
  '/areas/snowmass': '/service-areas/snowmass-village',
  '/areas/vail': '/service-areas/eagle-vail',
  '/book': '/reservations',
  '/gallery': '/',
}

export function aalAliasDestination(pathname: string): string | null {
  const bare = pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname
  return AAL_PATH_REDIRECTS[bare] ?? null
}

/** Shared /terms and /privacy. AAL hosts use the apex; every other host uses the RVA www origin. */
export function legalCanonicalUrl(hostname: string, path: '/terms' | '/privacy'): string {
  const origin = isAalHost(hostname) ? AAL_CANONICAL_ORIGIN : RVA_CANONICAL_ORIGIN
  return `${origin}${path}`
}

export function canonicalUrlForService(service: { slug: string | null; name: string }): string {
  return aalAbsoluteUrl(hrefForService(service))
}

export function canonicalUrlForServiceArea(area: { name: string; slug: string | null }): string {
  return aalAbsoluteUrl(hrefForServiceArea(area))
}

export function aalAbsoluteUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const bare = path.length > 1 ? path.replace(/\/+$/, '') : path
  if (bare === '/') return AAL_CANONICAL_ORIGIN
  return `${AAL_CANONICAL_ORIGIN}${bare}`
}

/**
 * AAL hosts only. Returns the replacement query ('' or '?...') when `site` is
 * `alpenglow` or `rva`. Returns null when the query should be left alone.
 * Other parameters are kept.
 */
export function aalSearchWithoutBrandSite(search: string): string | null {
  const raw = search.startsWith('?') ? search.slice(1) : search
  if (!raw) return null
  const params = new URLSearchParams(raw)
  const site = params.get('site')
  if (site !== 'alpenglow' && site !== 'rva') return null
  params.delete('site')
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** Non-canonical hosts (Vercel production alias, previews, unknown). Production RVA and AAL hosts stay untouched. */
export function xRobotsTagForHost(hostname: string): 'noindex, follow' | null {
  if (isAalHost(hostname) || isRvaHost(hostname)) return null
  return 'noindex, follow'
}

function stripTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.replace(/\/+$/, '') || '/'
  return path || '/'
}

/**
 * Apex, slashless AAL sitemap URL. Alias paths are rewritten to the live canonical.
 * `/gallery` is omitted. Non-AAL hosts return null so this never rewrites RVA URLs in place.
 */
export function canonicalizeAalSitemapUrl(raw: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return null
  }

  let host = parsed.hostname.toLowerCase()
  if (host === 'www.aspenalpenglowlimousine.com') host = 'aspenalpenglowlimousine.com'
  if (host !== 'aspenalpenglowlimousine.com') return null

  let path = stripTrailingSlash(parsed.pathname || '/')
  if (path === '/alpenglow') path = '/'
  else if (path.startsWith('/alpenglow/')) path = stripTrailingSlash(path.slice('/alpenglow'.length) || '/')

  if (path === '/gallery') return null

  const redirected = AAL_PATH_REDIRECTS[path]
  if (redirected) path = redirected
  if (path === '/gallery') return null

  if (path.startsWith('/services/')) {
    const slug = path.slice('/services/'.length)
    if (slug && !slug.includes('/')) path = hrefForService({ slug, name: slug })
  } else if (path.startsWith('/service-areas/')) {
    const slug = path.slice('/service-areas/'.length)
    if (slug && !slug.includes('/')) path = hrefForServiceArea({ name: '', slug })
  }

  if (path === '/gallery') return null
  return aalAbsoluteUrl(path)
}

export function canonicalizeAalSitemapEntries<T extends { url: string }>(entries: T[]): T[] {
  const out: T[] = []
  for (const entry of entries) {
    const url = canonicalizeAalSitemapUrl(entry.url)
    if (!url) continue
    out.push(url === entry.url ? entry : { ...entry, url })
  }
  return out
}
