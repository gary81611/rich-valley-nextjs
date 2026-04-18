import { createClient } from '@supabase/supabase-js'

/**
 * Draft posts marked `seo_bulk_demoted` 301/308 to `/blog` so old URLs don’t 404 after bulk demotion.
 * Requires `SUPABASE_SERVICE_ROLE_KEY` in production.
 */
export async function rvaBlogSlugShouldRedirectToBlogIndex(slug: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url?.startsWith('http') || !key) return false

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data } = await supabase
    .from('blog_posts')
    .select('status, seo_bulk_demoted')
    .eq('site_key', 'rva')
    .eq('slug', slug)
    .maybeSingle()

  return data?.status === 'draft' && data?.seo_bulk_demoted === true
}
