/**
 * Nav / DB often store a top-level slug like `/airport-transfers` (CMS-style).
 * Some AAL money pages are canonical as top-level CMS pages, while others still live under
 * the Supabase-backed `/services/[slug]` route.
 * Paths that already include `/services/` or `/service-areas/` are left unchanged.
 */
const RESERVED_SINGLE_SEGMENTS = new Set([
  'blog',
  'fleet',
  'faq',
  'contact',
  'reservations',
  'about',
  'pricing',
  'destinations',
  'gallery',
  'services',
  'service-areas',
  'alpenglow',
])

const CANONICAL_CMS_SERVICE_SLUGS = new Set([
  'airport-transfers',
  'corporate-events',
  'wedding-transportation',
  'night-out',
  'wine-tours',
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

  if (CANONICAL_CMS_SERVICE_SLUGS.has(seg)) return `/${seg}`

  return `/services/${seg}`
}
