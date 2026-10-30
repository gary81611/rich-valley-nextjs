import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  isUnconfirmedWinterClaim,
  scrubUnconfirmedWinterList,
  scrubUnconfirmedWinterText,
} from '@/lib/rva-unconfirmed-winter'

export type PublicGuide = {
  id: string
  name: string
  title: string | null
  specialties: string[] | null
  certifications: string[] | null
  bio: string | null
  photo_url: string | null
}

function toPublicGuide(row: PublicGuide): PublicGuide {
  const specialties = scrubUnconfirmedWinterList(row.specialties || []).filter(Boolean)
  const bioRaw = (row.bio || '').trim()
  const bio = bioRaw ? scrubUnconfirmedWinterText(bioRaw) : ''
  const titleRaw = (row.title || '').trim()
  const title = titleRaw && !isUnconfirmedWinterClaim(titleRaw) ? titleRaw : null
  return {
    ...row,
    title,
    specialties: specialties.length ? specialties : null,
    bio: bio || null,
  }
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
    return (data as PublicGuide[]).map(toPublicGuide)
  } catch {
    return []
  }
}
