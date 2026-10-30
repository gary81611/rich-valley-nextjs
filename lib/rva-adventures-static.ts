/**
 * Static public-adventure cards when Supabase is down or returns nothing.
 * Built from RVA_ACTIVITIES + existing public copy/prices — not a second hand-typed catalog.
 */
import { RVA_ACTIVITIES } from '@/lib/rva-activities'
import {
  FLY_FISHING_ID,
  FLY_FISHING_IMAGE,
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
import { allSeedPages } from '@/lib/seed-pages'

/** Production adventures.id values already referenced in migrations / public helpers. */
const SCENIC_TOUR_ID = '88b4bc72-49b7-4552-b4e6-5aa9db5ee05a'
const ELEVATED_CAMPING_ID = 'd999b4ae-3341-4cab-8c3d-05d6865b01df'
const MOUNTAIN_BIKING_ID = '7761a614-9f60-4885-b61c-da5f435f5284'
const HORSEBACK_ID = '11fa5e23-9c2e-40f0-a9b8-2362d00cb894'

type FallbackRow = {
  id: string
  name: string
  description: string
  image_url: string
  duration: string
  difficulty: string
  season: string
}

function rvaSeedMeta(slug: string): string {
  const page = allSeedPages.find((p) => p.site_id === 'rva' && p.slug === slug)
  return (page?.meta_description || '').trim()
}

/**
 * Card-row builders keyed by RVA_ACTIVITIES.href.
 * Descriptions/prices come from seed-pages, rva-confirmed, and rva-adventure-public.
 */
const ROW_BY_ACTIVITY_HREF: Record<string, () => FallbackRow> = {
  '/fly-fishing': () => ({
    id: FLY_FISHING_ID,
    name: 'Fly Fishing',
    description: FLY_FISHING_PUBLIC_DESCRIPTION,
    image_url: FLY_FISHING_IMAGE,
    duration: 'Half Day / Full Day',
    difficulty: 'All Levels',
    season: 'summer',
  }),
  '/paddle-boarding': () => ({
    id: PADDLE_RENTAL_ID,
    name: 'Paddle Board Rentals',
    // adventurePublicDescription + seed meta both treat this as a rental from $100.
    description: rvaSeedMeta('paddle-boarding') || 'Paddleboarding is a rental from $100, not a guided trip.',
    image_url: PADDLE_PHOTO,
    duration: 'Half Day / Full Day',
    difficulty: 'Easy',
    season: 'summer',
  }),
  '/adventures/mountain-biking': () => ({
    id: MOUNTAIN_BIKING_ID,
    name: 'Mountain Biking',
    description:
      rvaSeedMeta('mountain-biking') ||
      "Explore Aspen's best mountain bike trails with expert local guides. All levels welcome.",
    image_url: '/images/adventures/mountain-biking.jpg',
    duration: 'Half Day / Full Day',
    difficulty: 'All Levels',
    season: 'summer',
  }),
  '/hiking': () => ({
    id: TRAIL_HIKING_ID,
    name: 'Trail Hiking',
    description: TRAIL_HIKING_PUBLIC_DESCRIPTION,
    image_url: TRAIL_HIKING_IMAGE,
    duration: '3–6 Hours',
    difficulty: 'Moderate',
    season: 'summer',
  }),
  '/adventures/horseback-riding': () => ({
    id: HORSEBACK_ID,
    name: 'Horseback Riding',
    // Price + partner note come from adventurePublicDescription / RVA_HORSEBACK_PRICE.
    description: '',
    image_url: '/images/adventures/horseback-riding.png',
    duration: '2–4 Hours',
    difficulty: 'All Levels',
    season: 'summer',
  }),
  '/adventures/scenic-wildlife-tours': () => ({
    id: SCENIC_TOUR_ID,
    name: 'Scenic & Wildlife Tours',
    description: RVA_SCENIC_PRICE,
    image_url: RVA_SCENIC_TOUR_IMAGE,
    duration: 'Half Day / Full Day',
    difficulty: 'Easy',
    season: 'year-round',
  }),
  '/elevated-camping': () => ({
    id: ELEVATED_CAMPING_ID,
    name: 'Elevated Camping',
    // Matches app/rva/elevated-camping/page.tsx metadata description.
    description:
      'Experience elevated camping near Aspen, Colorado — premium canvas tents, gourmet chef-prepared meals, guided night-sky viewing, and all the comforts of home in the heart of the Colorado wilderness.',
    image_url: '/images/adventures/elevated-camping.jpeg',
    duration: 'Overnight / Multi-Day',
    difficulty: 'All Levels',
    season: 'summer',
  }),
}

/** The 7 public adventure cards, ordered like RVA_ACTIVITIES, for SSR when Supabase fails. */
export function getStaticPublicAdventureCards(): PublicAdventureCard[] {
  return RVA_ACTIVITIES.filter((activity) => activity.href in ROW_BY_ACTIVITY_HREF).map((activity) =>
    toPublicAdventureCard(ROW_BY_ACTIVITY_HREF[activity.href]()),
  )
}
