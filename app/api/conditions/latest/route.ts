import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

/** Latest published conditions teaser for homepage strip. Extended in Task 4 with `conditions_reports`. */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

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
