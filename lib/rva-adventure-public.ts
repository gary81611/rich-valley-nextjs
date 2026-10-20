import { isBookableAdventureName, slugFromAdventureName } from '@/lib/rva-adventure-filters'

/** Adventures row "Paddle Boarding" (tour listing). Hidden in code until the manager sets is_active = false. */
export const PADDLE_TOUR_ID = '480f5980-5b4d-423e-9d71-36d7e8c62506'

/** Adventures row "Paddle Board Rentals". Stays active; cards link to the rentals page. */
export const PADDLE_RENTAL_ID = 'dde80b04-d226-4914-8777-f25286d4c13c'

/** The merged fly-fishing listing. Stays active. */
export const FLY_FISHING_ID = '0c5d51d3-40d6-451b-a868-332f9df4b089'

/** The merged hiking listing. Stays active. */
export const TRAIL_HIKING_ID = '8db0165a-5bd7-42c6-8514-d33ff973914b'

/**
 * Larger of the two card photos (501×751). The float card's other file is a 333×250 drift-boat image.
 */
export const FLY_FISHING_IMAGE = '/images/adventures/fly-fishing.png'
export const FLY_FISHING_IMAGE_ALT = 'An angler holding a trout on a river'

/** Wording already on /fly-fishing: wading trips plus the full-day float price. */
export const FLY_FISHING_PUBLIC_DESCRIPTION =
  'Half-day and full-day guided trips on our wading fisheries, and full-day float trips on the Roaring Fork or Colorado River. From $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. An 8–12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation included.'

export const TRAIL_HIKING_IMAGE = '/images/adventures/hiking.png'
export const TRAIL_HIKING_IMAGE_ALT = 'Trail hiking'
/** Live Trail Hiking row: duration, difficulty, and description. No picnic line; /hiking does not say that. */
export const TRAIL_HIKING_PUBLIC_DESCRIPTION =
  'Discover hidden waterfalls, wildflower meadows, and panoramic summit views with guides who bring the ecology and history of the Rockies to life. 3–6 Hours. Moderate.'

export const PADDLE_PHOTO = '/images/adventures/paddle-boarding.jpg'
export const PADDLE_PHOTO_ALT = 'Four people paddleboarding on a river'
/** Portrait frame: keep the group in view inside a wide crop. */
export const PADDLE_PHOTO_POSITION = 'center 40%'
export const PADDLE_CANONICAL_PATH = '/paddle-boarding'
export const PADDLE_OG_IMAGE =
  'https://www.richvalleyadventures.com/images/adventures/paddle-boarding.jpg'

const FISH_FALLBACK_IMAGES = new Set([
  '/images/adventures/fly-fishing.png',
  '/images/rva/flyfishing.png',
])

const HREF_BY_SLUG: Record<string, string> = {
  'fly-fishing': '/fly-fishing',
  'paddle-board-rentals': PADDLE_CANONICAL_PATH,
  'paddle-boarding': PADDLE_CANONICAL_PATH,
  'mountain-biking': '/adventures/mountain-biking',
  'trail-hiking': '/hiking',
  'scenic-escalade-tours': '/adventures/scenic-escalade-tours',
  'horseback-riding': '/adventures/horseback-riding',
  'elevated-camping': '/elevated-camping',
}

export function isPaddleTourListing(row: { id?: string | null; name?: string | null }): boolean {
  if (row.id === PADDLE_TOUR_ID) return true
  if (row.name && slugFromAdventureName(row.name) === 'paddle-boarding') return true
  return false
}

export function isPublicAdventureCard(row: { id?: string | null; name: string }): boolean {
  if (!isBookableAdventureName(row.name)) return false
  if (isPaddleTourListing(row)) return false
  return true
}

function isFlyFishingListing(row: { id?: string | null; name?: string | null }): boolean {
  if (row.id === FLY_FISHING_ID) return true
  return !!row.name && slugFromAdventureName(row.name) === 'fly-fishing'
}

function isTrailHikingListing(row: { id?: string | null; name?: string | null }): boolean {
  if (row.id === TRAIL_HIKING_ID) return true
  return !!row.name && slugFromAdventureName(row.name) === 'trail-hiking'
}

/** Home grid hides the two listings that already appear in the featured strip. */
export function isHomeGridAdventure(row: { id?: string | null; name: string }): boolean {
  if (!isPublicAdventureCard(row)) return false
  if (isFlyFishingListing(row) || isTrailHikingListing(row)) return false
  return true
}

export function adventurePublicHref(row: { id?: string | null; name: string }): string {
  if (row.id === PADDLE_RENTAL_ID) return PADDLE_CANONICAL_PATH
  const slug = slugFromAdventureName(row.name)
  return HREF_BY_SLUG[slug] ?? `/adventures/${slug}`
}

export function adventurePublicImage(row: {
  id?: string | null
  name: string
  image_url?: string | null
}): { src: string; objectPosition?: string; alt?: string } {
  const slug = slugFromAdventureName(row.name)
  if (row.id === FLY_FISHING_ID || slug === 'fly-fishing') {
    return { src: FLY_FISHING_IMAGE, alt: FLY_FISHING_IMAGE_ALT }
  }
  if (row.id === TRAIL_HIKING_ID || slug === 'trail-hiking') {
    return { src: TRAIL_HIKING_IMAGE, alt: TRAIL_HIKING_IMAGE_ALT }
  }
  const raw = (row.image_url || '').trim()
  const isRental = row.id === PADDLE_RENTAL_ID || slug === 'paddle-board-rentals'
  if (isRental) {
    const src = raw === '' || FISH_FALLBACK_IMAGES.has(raw) ? PADDLE_PHOTO : raw
    const portrait =
      src === PADDLE_PHOTO ||
      src.endsWith('/paddle-boarding.jpg') ||
      src.endsWith('/paddleboarding.jpg')
    return portrait ? { src, objectPosition: PADDLE_PHOTO_POSITION, alt: PADDLE_PHOTO_ALT } : { src }
  }
  if (raw === '') return { src: '/images/adventures/fly-fishing.png' }
  return { src: raw }
}

export function adventurePublicDescription(row: {
  id?: string | null
  name: string
  description: string
}): string {
  if (isFlyFishingListing(row)) return FLY_FISHING_PUBLIC_DESCRIPTION
  if (isTrailHikingListing(row)) return TRAIL_HIKING_PUBLIC_DESCRIPTION
  return row.description
}

/** Confirmed display price. Omits database prices, including the rentals row's 95. */
export function adventurePublicFromText(row: { id?: string | null; name: string }): string | null {
  const slug = slugFromAdventureName(row.name)
  if (row.id === PADDLE_RENTAL_ID || slug === 'paddle-board-rentals') return 'From $100'
  return null
}

export type PublicAdventureCard = {
  id: string
  title: string
  slug: string
  description: string
  image: string
  imageAlt?: string
  objectPosition?: string
  href: string
  duration: string
  difficulty: string
  season: string
  fromText: string | null
}

export function toPublicAdventureCard(row: {
  id: string
  name: string
  description: string
  image_url?: string | null
  duration: string
  difficulty: string
  season?: string | null
}): PublicAdventureCard {
  const visual = adventurePublicImage(row)
  return {
    id: row.id,
    title: row.name,
    slug: slugFromAdventureName(row.name),
    description: adventurePublicDescription(row),
    image: visual.src,
    imageAlt: visual.alt,
    objectPosition: visual.objectPosition,
    href: adventurePublicHref(row),
    duration: row.duration,
    difficulty: row.difficulty,
    season: row.season || 'summer',
    fromText: adventurePublicFromText(row),
  }
}
