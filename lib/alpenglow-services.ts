/**
 * Must match `autoSlug` in `app/admin/services/page.tsx` so public URLs match admin-created rows.
 */
export function slugifyServiceName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/**
 * CMS still stores this row as slug or name "Charter Services".
 * The live URL is /services/hourly-charter; /services/charter-services 301s there.
 */
const SERVICE_SLUG_OVERRIDE: Record<string, string> = {
  'charter-services': 'hourly-charter',
}

export function hrefForService(service: { slug: string | null; name: string }): string {
  const fromName = slugifyServiceName(service.name)
  const raw = (service.slug && service.slug.trim()) || fromName
  const seg = SERVICE_SLUG_OVERRIDE[raw] || raw
  if (seg === 'airport-transfers') return '/airport-transfers'
  if (seg === 'ski-resort-transfers') return '/ski-resort-transfers'
  return `/services/${seg}`
}

export function serviceMatchesPathSlug(
  row: { slug: string | null; name: string },
  pathSlug: string,
): boolean {
  const trimmed = row.slug?.trim()
  if (trimmed && trimmed === pathSlug) return true
  return slugifyServiceName(row.name) === pathSlug
}
