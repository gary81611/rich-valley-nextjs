/**
 * Facts Kit confirmed on Oct 29, 2026.
 * Prices are the amounts he stated. Do not add "per person" or "from" where he did not.
 */

export const RVA_LICENSED_OUTFITTER = 'CO Licensed Outfitter OUT.0003060'
export const RVA_RIVER_LICENSE = 'CO River License 620'
export const RVA_LICENSES_LINE = `${RVA_LICENSED_OUTFITTER}. ${RVA_RIVER_LICENSE}.`

/** In-house vs partner trips. Partner outfitters stay unnamed. */
export const RVA_TRIP_OWNERSHIP =
  'Guides run fishing, hiking, rafting, and camping in-house. Horseback riding, ATV, and snowmobile trips go through local partner outfitters.'

export const RVA_FLOAT_PRICE = 'Full-day float trip: $1,400 for 2'
export const RVA_RANCH_PRICE = 'Private ranch: $800 per adult and $250 per child'
export const RVA_HIKE_PRICE = 'Half-day hike: $600'
export const RVA_SNOWSHOE_PRICE = 'Half-day snowshoe: $500'
export const RVA_CAMPING_PRICE = 'Overnight camping: $1,500'
export const RVA_HORSEBACK_PRICE = 'Horseback: $600'
export const RVA_SCENIC_PRICE = 'Half-day scenic and wildlife tour: $750'
export const RVA_RAFTING_PRICE = 'Scenic river rafting with picnic: $1,200'

export const RVA_PRICE_LINES = [
  RVA_FLOAT_PRICE,
  RVA_RANCH_PRICE,
  RVA_HIKE_PRICE,
  RVA_SNOWSHOE_PRICE,
  RVA_CAMPING_PRICE,
  RVA_HORSEBACK_PRICE,
  RVA_SCENIC_PRICE,
  RVA_RAFTING_PRICE,
] as const

/** Public path for the scenic/wildlife tour. The old slug redirects here. */
export const RVA_SCENIC_TOUR_PATH = '/adventures/scenic-wildlife-tours'
export const RVA_SCENIC_TOUR_IMAGE = '/images/adventures/scenic-wildlife-tour.png'
export const RVA_SCENIC_TOUR_IMAGE_ALT = 'Aspen trees along a dirt road in the Roaring Fork Valley'

/** Drop the retired vehicle name from public copy. The path token and filenames are rewritten first. */
const ESCALADE_WORD = /(?<![\w/.-])Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi
const ESCALADES_WORD = /(?<![\w/.-])Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi

export function stripEscaladeCopy(text: string): string {
  if (!text) return text
  let t = text
  t = t.replace(/scenic-escalade-tours/gi, 'scenic-wildlife-tours')
  t = t.replace(/scenic-escalade\.png/gi, 'scenic-wildlife-tour.png')
  t = t.replace(/\/images\/(?:fleet|alpenglow)\/escalade\.png/gi, '/images/logos/alpenglow-logo.png')
  t = t.replace(/Scenic Escalade Tours/g, 'Scenic and Wildlife Tours')
  t = t.replace(/scenic Escalade tours/g, 'scenic and wildlife tours')
  t = t.replace(ESCALADES_WORD, 'SUVs')
  t = t.replace(ESCALADE_WORD, 'SUV')
  return t
}

/** Customer quotes that name the retired vehicle stay in the database and stay off the page. */
export function quoteMentionsEscalade(quote: string | null | undefined): boolean {
  return /escalade/i.test(quote || '')
}

/**
 * Public quotes must be active and verified.
 * A missing `verified` field (column not migrated yet) is unverified, so nothing is shown.
 */
export function isPublicTestimonial(row: {
  is_active?: boolean | null
  verified?: boolean | null
  quote?: string | null
}): boolean {
  return row.is_active === true && row.verified === true && !quoteMentionsEscalade(row.quote)
}

export function rvaPriceNoteForSlug(slug: string): string | null {
  switch (slug) {
    case 'horseback-riding':
      return '$600'
    case 'scenic-escalade-tours':
    case 'scenic-wildlife-tours':
    case 'scenic-wildlife-tour':
      return '$750 half-day'
    case 'elevated-camping':
    case 'glamping':
    case 'camping':
      return 'Overnight $1,500'
    case 'trail-hiking':
    case 'hiking':
    case 'group-hiking':
      return 'Half-day $600'
    case 'snowshoeing':
      return 'Half-day $500'
    case 'rafting':
    case 'whitewater-rafting':
    case 'scenic-river-rafting':
    case 'river-rafting':
      return 'Scenic rafting with picnic $1,200'
    default:
      return null
  }
}

export function isScenicTourSlug(slug: string): boolean {
  return slug === 'scenic-escalade-tours' || slug === 'scenic-wildlife-tours' || slug === 'scenic-wildlife-tour'
}

export function rvaPublicAdventureTitle(name: string, slug: string): string {
  if (isScenicTourSlug(slug) || /escalade/i.test(name)) return 'Scenic & Wildlife Tours'
  return name
}
