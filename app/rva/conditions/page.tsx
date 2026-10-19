import { createClient } from '@supabase/supabase-js'
import ConditionsPageClient from './ConditionsPageClient'
import type { VoiceFishingReport } from '@/lib/fishing-report-intake'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function loadVoiceFishingReports(): Promise<VoiceFishingReport[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) return []

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('voice_fishing_reports')
      .select('id, created_at, reporter, river_or_section, flows, water_temp, hatches_and_flies, what_is_working, summary')
      .not('summary', 'is', null)
      .not('reporter', 'is', null)
      .not('river_or_section', 'is', null)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error || !data) return []

    return data.filter((row): row is VoiceFishingReport => {
      return Boolean(row.id && row.created_at && row.reporter && row.river_or_section && row.summary)
    })
  } catch {
    return []
  }
}

export default async function ConditionsPage() {
  const voiceReports = await loadVoiceFishingReports()
  return <ConditionsPageClient voiceReports={voiceReports} />
}
