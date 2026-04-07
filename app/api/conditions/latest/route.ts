import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

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

/** Latest published conditions for homepage strip; falls back to fishing_reports. */
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

    const { data: fr } = await supabase
      .from('fishing_reports')
      .select('title, content, date, published_at, guides(name)')
      .eq('is_published', true)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fr) {
      const content = typeof fr.content === 'string' ? fr.content : ''
      const teaser = content.length > 220 ? `${content.slice(0, 220)}…` : content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (fr as any).guides
      const authorName = Array.isArray(g) ? g[0]?.name : g?.name
      return NextResponse.json({
        report: {
          teaser: teaser || fr.title,
          author: authorName || undefined,
          date: fr.published_at || fr.date,
        },
      })
    }

    return NextResponse.json({ report: null })
  } catch {
    return NextResponse.json({ report: null })
  }
}
