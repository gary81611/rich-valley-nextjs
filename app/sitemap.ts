import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const RVA_URL = 'https://richvalleyadventures.com'
const ALP_URL = 'https://aspenalpenglow.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    // Rich Valley Adventures
    { url: RVA_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${RVA_URL}/#adventures`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${RVA_URL}/#about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${RVA_URL}/#gallery`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${RVA_URL}/#faq`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${RVA_URL}/#contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${RVA_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    // Aspen Alpenglow Limousine
    { url: ALP_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${ALP_URL}/#services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${ALP_URL}/#fleet`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${ALP_URL}/#service-areas`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${ALP_URL}/#faq`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${ALP_URL}/#contact`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${ALP_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    // Shared pages
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

    // Blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, site_key, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post) => {
      const baseUrl = post.site_key === 'alpenglow' ? ALP_URL : RVA_URL
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })

    // CMS pages
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, site_id, updated_at')
      .eq('status', 'published')
      .order('site_id')
      .order('slug')

    const pageEntries: MetadataRoute.Sitemap = (pages || []).map((page) => {
      const baseUrl = page.site_id === 'alpenglow' ? ALP_URL : RVA_URL
      return {
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }
    })

    return [...staticEntries, ...blogEntries, ...pageEntries]
  } catch {
    return staticEntries
  }
}
