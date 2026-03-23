import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// NOTE: Next.js sitemap() receives no request object, so hostname detection is not
// possible here. This sitemap is served from both domains (richvalleyadventures.com and
// aspenalpenglowlimousine.com) and includes pages for both sites. GSC properties will
// only index URLs matching their respective domain.
const RVA_URL = 'https://richvalleyadventures.com'
const AAL_URL = 'https://aspenalpenglowlimousine.com'

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
    // AAL static pages
    { url: AAL_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${AAL_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${AAL_URL}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${AAL_URL}/fleet`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${AAL_URL}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${AAL_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${AAL_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
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

    // CMS pages — RVA
    const { data: rvaPages } = await supabase
      .from('pages')
      .select('slug, site_id, updated_at')
      .eq('status', 'published')
      .eq('site_id', 'rva')
      .order('slug')

    const rvaPageEntries: MetadataRoute.Sitemap = (rvaPages || []).map((page) => ({
      url: `${RVA_URL}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    // CMS pages — AAL
    const { data: aalPages } = await supabase
      .from('pages')
      .select('slug, site_id, updated_at')
      .eq('status', 'published')
      .eq('site_id', 'alpenglow')
      .order('slug')

    const aalPageEntries: MetadataRoute.Sitemap = (aalPages || []).map((page) => ({
      url: `${AAL_URL}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    // AAL blog posts
    const { data: aalPosts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')
      .eq('site_key', 'alpenglow')
      .order('published_at', { ascending: false })

    const aalBlogEntries: MetadataRoute.Sitemap = (aalPosts || []).map((post) => ({
      url: `${AAL_URL}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticEntries, ...blogEntries, ...rvaPageEntries, ...aalPageEntries, ...aalBlogEntries]
  } catch {
    return staticEntries
  }
}
