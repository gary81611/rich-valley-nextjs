import type { SupabaseClient } from '@supabase/supabase-js'
import { STOCK_ALPENGLOW_DESTINATIONS } from '@/lib/seed-destinations-data'

/**
 * Upserts stock Alpenglow destinations by `slug`, then removes other `site_key = alpenglow` rows
 * whose slug is not in the stock list (e.g. old Front Range cards).
 */
export async function syncAlpenglowDestinations(supabase: SupabaseClient): Promise<string> {
  const rows = [...STOCK_ALPENGLOW_DESTINATIONS]
  const slugSet = new Set(rows.map((r) => r.slug))

  const { error: upErr } = await supabase.from('destinations').upsert(rows, { onConflict: 'slug' })
  if (upErr) {
    return `Destinations sync: ERROR — ${upErr.message}`
  }

  const { data: existing, error: selErr } = await supabase
    .from('destinations')
    .select('id, slug')
    .eq('site_key', 'alpenglow')

  if (selErr) {
    return `Destinations sync: ERROR reading rows — ${selErr.message}`
  }

  const orphanIds = (existing ?? []).filter((r) => !slugSet.has(r.slug)).map((r) => r.id)
  if (orphanIds.length > 0) {
    const { error: delErr } = await supabase.from('destinations').delete().in('id', orphanIds)
    if (delErr) {
      return `Destinations sync: ERROR removing old rows — ${delErr.message}`
    }
  }

  return `Destinations: synced ${rows.length} stock rows; removed ${orphanIds.length} other alpenglow row(s) not in stock list`
}
