import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const allowed = [
      'report_date',
      'author_name',
      'hatch_report',
      'fly_recommendations',
      'water_clarity',
      'trail_conditions',
      'wildlife_notes',
      'birdwatching_highlights',
      'environmental_alerts',
      'general_notes',
      'published',
    ] as const
    const payload: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        payload[key] = body[key]
      }
    }

    const { data, error } = await supabase.from('conditions_reports').update(payload).eq('id', id).select().single()

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
