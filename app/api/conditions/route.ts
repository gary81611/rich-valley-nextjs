import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      report_date,
      author_name,
      hatch_report,
      fly_recommendations,
      water_clarity,
      trail_conditions,
      wildlife_notes,
      birdwatching_highlights,
      environmental_alerts,
      general_notes,
      published = false,
    } = body

    const { data, error } = await supabase
      .from('conditions_reports')
      .insert({
        report_date: report_date || new Date().toISOString().slice(0, 10),
        author_name: author_name ?? null,
        hatch_report: hatch_report ?? null,
        fly_recommendations: fly_recommendations ?? null,
        water_clarity: water_clarity ?? null,
        trail_conditions: trail_conditions ?? null,
        wildlife_notes: wildlife_notes ?? null,
        birdwatching_highlights: birdwatching_highlights ?? null,
        environmental_alerts: environmental_alerts ?? null,
        general_notes: general_notes ?? null,
        published: Boolean(published),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ report: data })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unexpected error' },
      { status: 500 },
    )
  }
}
