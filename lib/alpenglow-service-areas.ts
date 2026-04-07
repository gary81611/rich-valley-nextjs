/** Maps service area display names (from CMS) to URL path segments — used for list + detail so links always match. */
export const AAL_SERVICE_AREA_SLUG_MAP: Record<string, string> = {
  Aspen: 'aspen',
  'Snowmass Village': 'snowmass-village',
  'Basalt & El Jebel': 'basalt',
  Basalt: 'basalt',
  Carbondale: 'carbondale',
  'Glenwood Springs': 'glenwood-springs',
  'Eagle / Vail': 'eagle-vail',
  Denver: 'denver',
  Rifle: 'rifle',
}

export function hrefForServiceArea(area: { name: string; slug: string | null }): string {
  const fromDb = area.slug?.trim()
  if (fromDb) return `/service-areas/${fromDb}`
  const fromMap = AAL_SERVICE_AREA_SLUG_MAP[area.name]
  if (fromMap) return `/service-areas/${fromMap}`
  const generated = area.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `/service-areas/${generated}`
}

/** Resolve a path slug to the same row the listing page would link to. */
export function serviceAreaMatchesPathSlug(
  area: { name: string; slug: string | null },
  pathSlug: string,
): boolean {
  const candidates = new Set<string>()
  if (area.slug?.trim()) candidates.add(area.slug.trim())
  const mapped = AAL_SERVICE_AREA_SLUG_MAP[area.name]
  if (mapped) candidates.add(mapped)
  candidates.add(
    area.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
  )
  return candidates.has(pathSlug)
}
