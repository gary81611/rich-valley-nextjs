import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// NOTE: Next.js sitemap() receives no request object, so hostname detection is not
// possible here. This sitemap is scoped to richvalleyadventures.com (site_id='rva')
// only, which satisfies the GSC property for that domain.
// TODO: Add a separate sitemap for aspenalpenglow.com once that GSC property is set up.
const RVA_URL = 'https://richvalleyadventures.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: RVA_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${RVA_URL}/#adventures`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${RVA_URL}/#about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${RVA_URL}/#gallery`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${RVA_URL}/#faq`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${RVA_URL}/#contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${RVA_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${RVA_URL}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${RVA_URL}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return staticEntries
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Blog posts — RVA only
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, site_key, published_at, updated_at')
      .eq('status', 'published')
      .eq('site_key', 'rva')
      .order('published_at', { ascending: false })

    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${RVA_URL}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // CMS pages — RVA only
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, site_id, updated_at')
      .eq('status', 'published')
      .eq('site_id', 'rva')
      .order('slug')

    const pageEntries: MetadataRoute.Sitemap = (pages || []).map((page) => ({
      url: `${RVA_URL}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    return [...staticEntries, ...blogEntries, ...pageEntries]
  } catch {
    return staticEntries
  }
}
