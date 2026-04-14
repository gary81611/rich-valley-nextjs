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
