import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Adventure } from '@/lib/types'
import {
  isPublicAdventureCard,
  toPublicAdventureCard,
  type PublicAdventureCard,
} from '@/lib/rva-adventure-public'
import { getStaticPublicAdventureCards } from '@/lib/rva-adventures-static'
import AdventuresListing from './AdventuresListing'

export const dynamic = 'force-dynamic'

/** Same as home #18: no duration badge or level meta on adventure cards; keep prices. */
function withoutCardBadges(card: PublicAdventureCard): PublicAdventureCard {
  return { ...card, duration: '', difficulty: '' }
}

function staticFallback(reason: string): PublicAdventureCard[] {
  console.error(`[rva/adventures] static fallback: ${reason}`)
  return getStaticPublicAdventureCards().map(withoutCardBadges)
}

export default async function AdventuresPage() {
  let adventures: PublicAdventureCard[] = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('adventures')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      adventures = staticFallback(`supabase error: ${error.message}`)
    } else if (data && data.length > 0) {
      adventures = data
        .filter((a: Adventure) => isPublicAdventureCard(a))
        .map((a: Adventure) => withoutCardBadges(toPublicAdventureCard(a)))
      if (adventures.length === 0) {
        adventures = staticFallback('supabase returned rows but none are public adventure cards')
      }
    } else {
      adventures = staticFallback('supabase returned no active adventures')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    adventures = staticFallback(`supabase fetch failed: ${message}`)
  }

  return <AdventuresListing adventures={adventures} />
}
