import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { loadFishingReportFeed } from '@/lib/fishing-report-feed'

// Default GET route handlers are statically cached at build time, which would
// freeze the homepage "latest report" strip at whatever was published on the
// last deploy. Force per-request execution so newly published reports show up.
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * First sentence only. A period between digits is a decimal, not the end of the sentence,
 * so a flow or clock time is never sliced mid-number.
 */
function firstCompleteSentence(text: string): string | null {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return null
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]
    if (ch !== '.' && ch !== '!' && ch !== '?') continue
    if (ch === '.') {
      const prev = normalized[i - 1] || ''
      const next = normalized[i + 1] || ''
      if (/\d/.test(prev) && /\d/.test(next)) continue
    }
    const after = normalized[i + 1]
    if (after === undefined || /\s/.test(after)) {
      const sentence = normalized.slice(0, i + 1).trim()
      return sentence || null
    }
  }
  return null
}

function stripDateLabel(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/** One complete sentence, or the report date when the body has no sentence end. */
function conditionsStripCopy(body: string, date?: string | null): string {
  const sentence = firstCompleteSentence(body)
  if (sentence) return sentence
  const label = stripDateLabel(date)
  return label ? `Updated ${label}.` : ''
}

function buildTeaser(row: {
  report_date?: string | null
  hatch_report?: string | null
  fly_recommendations?: string | null
  water_clarity?: string | null
  general_notes?: string | null
}): string {
  const parts = [row.hatch_report, row.fly_recommendations, row.water_clarity, row.general_notes].filter(Boolean) as string[]
  return conditionsStripCopy(parts.join(' '), row.report_date)
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
      const teaser = conditionsStripCopy(item.body, item.date) || item.title
      return NextResponse.json({
        report: {
          teaser,
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
