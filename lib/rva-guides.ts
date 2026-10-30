import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  isUnconfirmedWinterClaim,
  scrubUnconfirmedWinterList,
  scrubUnconfirmedWinterText,
} from '@/lib/rva-unconfirmed-winter'


const BART_CHANDLER_ID = '9937a1e8-c6d4-457d-a492-99324bda3161'

/** Supabase guides.bio for Bart (DB unchanged). Drop hunter + broken guest-quote sentences. */
const BART_BIO_DB =
  'Bart has been a lifelong hunter and fisherman and world traveler. Bart is recognized and one of the best shooting coaches in the country and has supported number sporting clay Champions and Olympian’s. One guest mention,  “It’s an honor to spend time with such an admirable gentleman. Bart is not just and professional but an expert in his field”.'

const BART_BIO_PUBLIC = 'Bart has been a lifelong fisherman and world traveler.'

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
  // Bart Chandler — no confirmed shooting service
  if (t.includes('shooting')) return true
  return false
}

function toPublicGuide(row: PublicGuide): PublicGuide {
  const specialties = scrubUnconfirmedWinterList(row.specialties || []).filter(Boolean)
  const bioRaw = (row.bio || '').trim()
  // Bart: whole-bio display override (see BART_BIO_DB). DB unchanged.
  const bioNormalized = row.id === BART_CHANDLER_ID && bioRaw ? BART_BIO_PUBLIC : bioRaw
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
