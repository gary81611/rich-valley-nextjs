import { createClient } from '@supabase/supabase-js'

const RVA_URL = 'https://www.richvalleyadventures.com'
const AAL_URL = 'https://aspenalpenglowlimousine.com'

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: string
  priority: number
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      ({ url, lastModified, changeFrequency, priority }) =>
        `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified.toISOString()}</lastmod>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const isAAL =
    hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')
  const BASE_URL = isAAL ? AAL_URL : RVA_URL
  const siteKey = isAAL ? 'alpenglow' : 'rva'
  const lastModified = new Date()

  const staticEntries: SitemapEntry[] = isAAL
    ? [
        { url: AAL_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${AAL_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${AAL_URL}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${AAL_URL}/fleet`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${AAL_URL}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${AAL_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${AAL_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
      ]
    : [
        { url: RVA_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${RVA_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_URL}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
        { url: `${RVA_URL}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
      ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return new Response(toXml(staticEntries), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [{ data: posts }, { data: pages }] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('slug, published_at, updated_at')
        .eq('status', 'published')
        .eq('site_key', siteKey)
        .order('published_at', { ascending: false }),
      supabase
        .from('pages')
        .select('slug, updated_at')
        .eq('status', 'published')
        .eq('site_id', siteKey)
        .order('slug'),
    ])

    const blogEntries: SitemapEntry[] = (posts || []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const pageEntries: SitemapEntry[] = (pages || []).map((page) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    }))

    return new Response(toXml([...staticEntries, ...blogEntries, ...pageEntries]), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new Response(toXml(staticEntries), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
