/**
 * Must match `autoSlug` in `app/admin/services/page.tsx` so public URLs match admin-created rows.
 */
export function slugifyServiceName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function hrefForService(service: { slug: string | null; name: string }): string {
  const seg = (service.slug && service.slug.trim()) || slugifyServiceName(service.name)
  if (seg === 'airport-transfers') return '/airport-transfers'
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
