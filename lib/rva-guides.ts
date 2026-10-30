import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  isUnconfirmedWinterClaim,
  scrubUnconfirmedWinterList,
  scrubUnconfirmedWinterText,
} from '@/lib/rva-unconfirmed-winter'

const BART_CHANDLER_ID = '9937a1e8-c6d4-457d-a492-99324bda3161'
const KIT_MCLENDON_ID = '7ad5b557-6a83-4d18-94e8-ccc583043834'
const AARON_DALCHOW_ID = 'aad0aa57-93f5-4766-a036-63274b0a221c'
const BOBBY_REGAN_ID = 'b6652670-ee67-4bcd-85d6-657b25dfee47'
const JOHN_MUDREY_ID = '4c21ab38-a68f-4f57-aec4-97ef9fa76352'

/** Public bios (DB unchanged). Unconfirmed claim sentences are scrubbed at render. */
const BART_BIO_PUBLIC = 'Bart has been a lifelong fisherman and world traveler.'

const KIT_BIO_PUBLIC = [
  'Kit grew up fishing in Eastern North Carolina. His fishing experience began off the coast of the Outer Banks fishing for large gamefish that included Marlin, Sailfish, MahiMahi, Tuna, Wahoo and more.',
  'With over 20 years of experience as a fly fishing guide in Colorado, Kit has traveled to Alaska, Belize, Mexico and beyond chasing fish on the fly.',
  'Sharing time with others on the water has been a lifelong passion. Kit loves the diversity of people who travel to Aspen from around the world. Kit enjoys the challenge of teaching children and beginners. Kit has also fished with some of the most versed fly fishing guides and professionals in the fly fishing industry.',
].join('\n')

const AARON_BIO_PUBLIC = [
  'Chef Aaron loves the outdoors and best displays his culinary talents in a wilderness setting. Aaron has been working in Aspen as a private Chef for over 20 years and has been a Chef for Rich Valley Adventures for the last decade. Every year we work with Aaron we are more amazed by his comfort and excitement to achieve the best meals possible in the elements of nature.',
  'Most recently guests from Guadalajara, Jalisco, Mexico requested "carne asada" to be served on the riverbank while fly fishing. The guests stated that "we don\'t get carne asada that authentic in Mexico."',
].join('\n')

const BOBBY_BIO_PUBLIC =
  'Bobby grew up in Wisconsin as a passionate fisherman on some of the best rivers and lakes in America. Bobby has been an avid fishing guide and ski instructor since he moved to Aspen 15 years ago.'


const JOHN_BIO_PUBLIC =
  'John grew up in Colorado and began guiding at 16. John loves sharing the outdoors with others and is well versed in environmental education and Colorado history. When John isn’t in the outdoors he is dedicated to his other jobs in architecture and construction.'

const GUIDE_BIO_PUBLIC: Record<string, string> = {
  [BART_CHANDLER_ID]: BART_BIO_PUBLIC,
  [KIT_MCLENDON_ID]: KIT_BIO_PUBLIC,
  [AARON_DALCHOW_ID]: AARON_BIO_PUBLIC,
  [BOBBY_REGAN_ID]: BOBBY_BIO_PUBLIC,
  [JOHN_MUDREY_ID]: JOHN_BIO_PUBLIC,
}

export type PublicGuide = {
  id: string
  name: string
  title: string | null
  specialties: string[] | null
  certifications: string[] | null
  bio: string | null
  photo_url: string | null
}

/** Kit-unconfirmed guide job titles (DB unchanged). */
function isUnconfirmedGuideTitle(title: string): boolean {
  if (isUnconfirmedWinterClaim(title)) return true
  const t = title.toLowerCase()
  // Bart Chandler — no confirmed firearm-clinic title
  if (t.includes('shooting')) return true
  return false
}

function isUnconfirmedGuideSpecialty(label: string): boolean {
  const t = label.toLowerCase()
  if (t.includes('safety training')) return true
  if (t.includes('sporting clay')) return true
  if (t.includes('shotgun')) return true
  return false
}

function toPublicGuide(row: PublicGuide): PublicGuide {
  let specialties = scrubUnconfirmedWinterList(row.specialties || [])
    .filter(Boolean)
    .filter((s) => !isUnconfirmedGuideSpecialty(s))
  // Bart: no confirmed specialty chips yet (title stays blank via isUnconfirmedGuideTitle)
  if (row.id === BART_CHANDLER_ID) {
    specialties = []
  }
  const bioRaw = (row.bio || '').trim()
  const bioNormalized = GUIDE_BIO_PUBLIC[row.id] && bioRaw ? GUIDE_BIO_PUBLIC[row.id] : bioRaw
  const bio = bioNormalized ? scrubUnconfirmedWinterText(bioNormalized) : ''
  const titleRaw = (row.title || '').trim()
  const title = titleRaw && !isUnconfirmedGuideTitle(titleRaw) ? titleRaw : null
  return {
    ...row,
    title,
    specialties: specialties.length ? specialties : null,
    bio: bio || null,
  }
}

/** Name-only + monogram shells (no title/photo/bio after scrub) — hide until Kit confirms. */
function isEmptyGuideShell(g: PublicGuide): boolean {
  const photo = (g.photo_url || '').trim()
  const bio = (g.bio || '').trim()
  const title = (g.title || '').trim()
  return !photo && !bio && !title
}

/** Same guide rows as /guides. Empty photo_url stays empty — do not invent a portrait. */
export async function getActiveGuides(): Promise<PublicGuide[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return []
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('guides')
      .select('id, name, title, specialties, certifications, bio, photo_url')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (error || !data) return []
    return (data as PublicGuide[]).map(toPublicGuide).filter((g) => !isEmptyGuideShell(g))
  } catch {
    return []
  }
}
