/**
 * Static public-adventure cards when Supabase is down or returns nothing.
 * Built from RVA_ACTIVITIES + existing public copy/prices — not a second hand-typed catalog.
 *
 * Duration/level badges are omitted here and cleared at listing render (same as home #18).
 * Prices come only through adventurePublicFromText → rvaPriceNoteForSlug / paddle From $100.
 */
import { RVA_ACTIVITIES } from '@/lib/rva-activities'
import {
  FLY_FISHING_ID,
  FLY_FISHING_CARD_IMAGE,
  FLY_FISHING_PUBLIC_DESCRIPTION,
  PADDLE_PHOTO,
  PADDLE_RENTAL_ID,
  TRAIL_HIKING_ID,
  TRAIL_HIKING_IMAGE,
  TRAIL_HIKING_PUBLIC_DESCRIPTION,
  toPublicAdventureCard,
  type PublicAdventureCard,
} from '@/lib/rva-adventure-public'
import {
  RVA_SCENIC_PRICE,
  RVA_SCENIC_TOUR_IMAGE,
} from '@/lib/rva-confirmed'

/** Production adventures.id values already referenced in migrations / public helpers. */
const SCENIC_TOUR_ID = '88b4bc72-49b7-4552-b4e6-5aa9db5ee05a'
const ELEVATED_CAMPING_ID = 'd999b4ae-3341-4cab-8c3d-05d6865b01df'
const MOUNTAIN_BIKING_ID = '7761a614-9f60-4885-b61c-da5f435f5284'
const HORSEBACK_ID = '11fa5e23-9c2e-40f0-a9b8-2362d00cb894'

/** Existing card/layout copy for mountain biking (app/rva/layout.tsx Offer description). */
const MOUNTAIN_BIKING_CARD_DESCRIPTION =
  'Expert-guided mountain biking on singletrack trails throughout the Roaring Fork Valley near Aspen, Colorado. Bikes and helmets included.'

/** Existing paddle card copy (adventurePublicDescription for paddle rentals). */
const PADDLE_RENTAL_CARD_DESCRIPTION =
  'We rent High Society paddle boards, and boards can be delivered to you.'

type FallbackRow = {
  id: string
  name: string
  description: string
  image_url: string
  duration: string
  difficulty: string
  season: string
}

/**
 * Card-row builders keyed by RVA_ACTIVITIES.href.
 * Descriptions from rva-adventure-public / rva-confirmed / existing layout card copy.
 * duration and difficulty stay empty — no confirmed badge source for the grid.
 */
const ROW_BY_ACTIVITY_HREF: Record<string, () => FallbackRow> = {
  '/fly-fishing': () => ({
    id: FLY_FISHING_ID,
    name: 'Fly Fishing',
    description: FLY_FISHING_PUBLIC_DESCRIPTION,
    image_url: FLY_FISHING_CARD_IMAGE,
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
  '/paddle-boarding': () => ({
    id: PADDLE_RENTAL_ID,
    name: 'Paddle Board Rentals',
    description: PADDLE_RENTAL_CARD_DESCRIPTION,
    image_url: PADDLE_PHOTO,
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
  '/adventures/mountain-biking': () => ({
    id: MOUNTAIN_BIKING_ID,
    name: 'Mountain Biking',
    description: MOUNTAIN_BIKING_CARD_DESCRIPTION,
    image_url: '/images/adventures/mountain-biking.jpg',
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
  '/hiking': () => ({
    id: TRAIL_HIKING_ID,
    name: 'Trail Hiking',
    description: TRAIL_HIKING_PUBLIC_DESCRIPTION,
    image_url: TRAIL_HIKING_IMAGE,
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
  '/adventures/horseback-riding': () => ({
    id: HORSEBACK_ID,
    name: 'Horseback Riding',
    // Price + partner note come from adventurePublicDescription / RVA_HORSEBACK_PRICE.
    description: '',
    image_url: '/images/adventures/horseback-riding.png',
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
  '/adventures/scenic-wildlife-tours': () => ({
    id: SCENIC_TOUR_ID,
    name: 'Scenic & Wildlife Tours',
    description: RVA_SCENIC_PRICE,
    image_url: RVA_SCENIC_TOUR_IMAGE,
    duration: '',
    difficulty: '',
    season: 'year-round',
  }),
  '/elevated-camping': () => ({
    id: ELEVATED_CAMPING_ID,
    name: 'Elevated Camping',
    // Matches app/rva/elevated-camping/page.tsx metadata description.
    description:
      'Experience elevated camping near Aspen, Colorado — premium canvas tents, gourmet chef-prepared meals, guided night-sky viewing, and all the comforts of home in the heart of the Colorado wilderness.',
    image_url: '/images/adventures/elevated-camping.jpeg',
    duration: '',
    difficulty: '',
    season: 'summer',
  }),
}

/** Same as home #18 / adventures listing: no duration badge or level meta; keep prices. */
export function withoutCardBadges(card: PublicAdventureCard): PublicAdventureCard {
  return { ...card, duration: '', difficulty: '' }
}

/** The 7 public adventure cards, ordered like RVA_ACTIVITIES, for SSR when Supabase fails. */
export function getStaticPublicAdventureCards(): PublicAdventureCard[] {
  return RVA_ACTIVITIES.filter((activity) => activity.href in ROW_BY_ACTIVITY_HREF).map((activity) => {
    const card = toPublicAdventureCard(ROW_BY_ACTIVITY_HREF[activity.href]())
    // Strip badges even if adventurePublicDuration fills paddle duration.
    return withoutCardBadges(card)
  })
}
