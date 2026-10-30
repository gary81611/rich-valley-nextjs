import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Adventure } from '@/lib/types'
import {
  isPublicAdventureCard,
  toPublicAdventureCard,
  type PublicAdventureCard,
} from '@/lib/rva-adventure-public'
import AdventuresListing from './AdventuresListing'

export const dynamic = 'force-dynamic'

export default async function AdventuresPage() {
  let adventures: PublicAdventureCard[] = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('adventures')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (data && data.length > 0) {
      adventures = data
        .filter((a: Adventure) => isPublicAdventureCard(a))
        .map((a: Adventure) => toPublicAdventureCard(a))
    }
  } catch {
    adventures = []
  }

  return <AdventuresListing adventures={adventures} />
}
