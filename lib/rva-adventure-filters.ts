/** Slugs derived from adventure names that are not bookable activities (info pages live elsewhere). */
export const EXCLUDED_FROM_ADVENTURE_GRIDS = new Set([
  'meet-your-guides',
  'guides',
  'river-trail-conditions',
  'trail-conditions',
  'conditions',
  'river-conditions',
])

export function slugFromAdventureName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isBookableAdventureName(name: string): boolean {
  return !EXCLUDED_FROM_ADVENTURE_GRIDS.has(slugFromAdventureName(name))
}
