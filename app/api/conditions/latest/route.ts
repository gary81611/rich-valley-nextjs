import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { loadFishingReportFeed } from '@/lib/fishing-report-feed'

// Default GET route handlers are statically cached at build time, which would
// freeze the homepage "latest report" strip at whatever was published on the
// last deploy. Force per-request execution so newly published reports show up.
export const dynamic = 'force-dynamic'
export const revalidate = 0

function buildTeaser(row: {
  hatch_report?: string | null
  fly_recommendations?: string | null
  water_clarity?: string | null
  general_notes?: string | null
}): string {
  const parts = [row.hatch_report, row.fly_recommendations, row.water_clarity, row.general_notes].filter(Boolean) as string[]
  const raw = parts.join(' ').trim()
  if (!raw) return ''
  return raw.length > 220 ? `${raw.slice(0, 220)}…` : raw
}

/** Latest published conditions for the homepage strip; falls back to the merged fishing-report feed. */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: cr } = await supabase
      .from('conditions_reports')
      .select('report_date, author_name, hatch_report, fly_recommendations, water_clarity, general_notes')
      .eq('published', true)
      .order('report_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cr) {
      const teaser =
        buildTeaser(cr) ||
        'Check the full conditions report for river flows, hatches, and trail updates.'
      return NextResponse.json({
        report: {
          teaser,
          author: cr.author_name,
          date: cr.report_date,
        },
      })
    }

    const [item] = await loadFishingReportFeed(1)
    if (item) {
      const teaser = item.body.length > 220 ? `${item.body.slice(0, 220)}…` : item.body
      return NextResponse.json({
        report: {
          teaser: teaser || item.title,
          ...(item.reporter_display ? { author: item.reporter_display } : {}),
          date: item.date,
          ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
        },
      })
    }

    return NextResponse.json({ report: null })
  } catch {
    return NextResponse.json({ report: null })
  }
}
