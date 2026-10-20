import { isBookableAdventureName, slugFromAdventureName } from '@/lib/rva-adventure-filters'

/** Adventures row "Paddle Boarding" (tour listing). Hidden in code until the manager sets is_active = false. */
export const PADDLE_TOUR_ID = '480f5980-5b4d-423e-9d71-36d7e8c62506'

/** Adventures row "Paddle Board Rentals". Stays active; cards link to the rentals page. */
export const PADDLE_RENTAL_ID = 'dde80b04-d226-4914-8777-f25286d4c13c'

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

export function adventurePublicHref(row: { id?: string | null; name: string }): string {
  if (row.id === PADDLE_RENTAL_ID) return PADDLE_CANONICAL_PATH
  const slug = slugFromAdventureName(row.name)
  return HREF_BY_SLUG[slug] ?? `/adventures/${slug}`
}

export function adventurePublicImage(row: {
  id?: string | null
  name: string
  image_url?: string | null
}): { src: string; objectPosition?: string } {
  const slug = slugFromAdventureName(row.name)
  const raw = (row.image_url || '').trim()
  const isRental = row.id === PADDLE_RENTAL_ID || slug === 'paddle-board-rentals'
  if (isRental) {
    const src = raw === '' || FISH_FALLBACK_IMAGES.has(raw) ? PADDLE_PHOTO : raw
    const portrait =
      src === PADDLE_PHOTO ||
      src.endsWith('/paddle-boarding.jpg') ||
      src.endsWith('/paddleboarding.jpg')
    return portrait ? { src, objectPosition: PADDLE_PHOTO_POSITION } : { src }
  }
  if (raw === '') return { src: '/images/adventures/fly-fishing.png' }
  return { src: raw }
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
    description: row.description,
    image: visual.src,
    objectPosition: visual.objectPosition,
    href: adventurePublicHref(row),
    duration: row.duration,
    difficulty: row.difficulty,
    season: row.season || 'summer',
    fromText: adventurePublicFromText(row),
  }
}
