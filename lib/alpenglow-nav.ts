/**
 * Nav / DB often store a top-level slug like `/airport-transfers` (CMS-style).
 * The Supabase-backed service detail route is `/services/[slug]`.
 * Paths that already include `/services/` or `/service-areas/` are left unchanged.
 */
const RESERVED_SINGLE_SEGMENTS = new Set([
  'blog',
  'fleet',
  'faq',
  'contact',
  'about',
  'pricing',
  'destinations',
  'gallery',
  'services',
  'service-areas',
  'alpenglow',
])

export function normalizeAalServiceNavHref(href: string): string {
  const u = href.trim()
  if (!u.startsWith('/') || u.startsWith('http') || u.startsWith('/services/') || u.startsWith('/service-areas')) {
    return href
  }

  let path = u
  if (path.startsWith('/alpenglow/')) {
    path = path.slice('/alpenglow'.length) || '/'
  }

  const segments = path.split('/').filter(Boolean)
  if (segments.length !== 1) return href

  const seg = segments[0]
  if (!seg || RESERVED_SINGLE_SEGMENTS.has(seg)) return href

  if (seg === 'airport-transfers') return '/airport-transfers'

  return `/services/${seg}`
}
