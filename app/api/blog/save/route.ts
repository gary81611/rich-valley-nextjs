import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      site_key,
      slug,
      title,
      meta_title,
      meta_description,
      content,
      internal_links,
      faqs,
      status,
      scheduled_for,
    } = body

    if (!site_key || !slug || !title) {
      return NextResponse.json({ error: 'Missing required fields: site_key, slug, title' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const st = status || 'draft'
    const payload: Record<string, unknown> = {
      site_key,
      slug,
      title,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      content: content || null,
      internal_links: internal_links || [],
      faqs: faqs || [],
      status: st,
      scheduled_for: st === 'scheduled' ? scheduled_for : null,
      published_at: st === 'published' ? new Date().toISOString() : null,
      ...(st === 'published' ? { seo_bulk_demoted: false } : {}),
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(payload, { onConflict: 'site_key,slug' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    )
  }
}
