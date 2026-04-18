import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// This endpoint is called by Vercel cron every 15 minutes.
// It publishes any blog posts whose scheduled_for time has passed.
export async function GET(request: NextRequest) {
  // Verify cron secret if set
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  })

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ status: 'published', published_at: now, seo_bulk_demoted: false })
    .eq('status', 'scheduled')
    .lte('scheduled_for', now)
    .select('id, site_key, slug, title')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const count = data?.length ?? 0
  return NextResponse.json({ published: count, posts: data })
}
