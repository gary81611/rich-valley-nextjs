import type { SeoSiteKey } from '@/lib/seo/site-config'
import { siteOrigin } from '@/lib/seo/site-config'

export function normalizePath(path: string): string {
  if (!path) return '/'
  if (path === '/') return '/'

  const [rawPath, query] = path.split('?', 2)
  const prefixed = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  const cleanPath = prefixed.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/'
  return query ? `${cleanPath}?${query}` : cleanPath
}

export function canonicalUrl(site: SeoSiteKey, path: string): string {
  return `${siteOrigin(site)}${normalizePath(path)}`
}

/** Absolute URL for OG / JSON-LD when DB may store site-relative paths. */
export function absolutePublicImageUrl(site: SeoSiteKey, url: string | null | undefined): string | undefined {
  const u = typeof url === 'string' ? url.trim() : ''
  if (!u) return undefined
  if (u.startsWith('https://') || u.startsWith('http://')) return u
  const path = u.startsWith('/') ? u : `/${u}`
  return `${siteOrigin(site)}${path}`
}
