import { createClient } from '@supabase/supabase-js'

const RVA_ORIGIN = 'https://www.richvalleyadventures.com'
const AAL_ORIGIN = 'https://aspenalpenglowlimousine.com'

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
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastModified.toISOString()}</lastmod>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function dedupeByUrl(entries: SitemapEntry[]): SitemapEntry[] {
  const seen = new Set<string>()
  const out: SitemapEntry[] = []
  for (const e of entries) {
    if (seen.has(e.url)) continue
    seen.add(e.url)
    out.push(e)
  }
  return out
}

function normalizeAalPageSlug(slug: string): string {
  const s = slug.trim().replace(/^\/+|\/+$/g, '')
  if (!s) return ''
  if (s === 'alpenglow') return ''
  if (s.startsWith('alpenglow/')) return s.slice('alpenglow/'.length)
  return s
}

export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const isAAL = hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')
  const siteKey = isAAL ? 'alpenglow' : 'rva'
  const lastModified = new Date()

  /** Paths must match real routes + metadata canonicals (SEO/AEO). */
  const staticEntries: SitemapEntry[] = isAAL
    ? [
        { url: AAL_ORIGIN, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${AAL_ORIGIN}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${AAL_ORIGIN}/faq`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${AAL_ORIGIN}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${AAL_ORIGIN}/fleet`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${AAL_ORIGIN}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${AAL_ORIGIN}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${AAL_ORIGIN}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${AAL_ORIGIN}/service-areas`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${AAL_ORIGIN}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
        { url: `${AAL_ORIGIN}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${AAL_ORIGIN}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
      ]
    : [
        { url: `${RVA_ORIGIN}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${RVA_ORIGIN}/fly-fishing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${RVA_ORIGIN}/conditions`, lastModified, changeFrequency: 'daily', priority: 0.9 },
        { url: `${RVA_ORIGIN}/guides`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/locations`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/service-areas`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/service-areas/aspen-co`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/rifle-co`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${RVA_ORIGIN}/service-areas/snowmass-village-co`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/basalt-co`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/carbondale-co`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${RVA_ORIGIN}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${RVA_ORIGIN}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/winter`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${RVA_ORIGIN}/adventures/elevated-camping`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/adventures`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/services`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${RVA_ORIGIN}/fleet`, lastModified, changeFrequency: 'monthly', priority: 0.55 },
        { url: `${RVA_ORIGIN}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${RVA_ORIGIN}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${RVA_ORIGIN}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
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

    const base = isAAL ? AAL_ORIGIN : RVA_ORIGIN

    const blogEntries: SitemapEntry[] = (posts || []).map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const excludedRvaSlugs = new Set([
      'service-areas-locations',
      'transportation',
      'faq',
      'areas/aspen',
      'areas/basalt',
      'areas/snowmass',
      'mountain-biking',
      'paddle-boarding',
      'snowshoeing',
    ])

    const excludedAalSlugs = new Set([
      'areas/aspen',
      'areas/snowmass',
      'areas/vail',
      'alpenglow/about',
      'alpenglow/pricing',
      'alpenglow/faq',
      'alpenglow/services',
      'alpenglow/fleet',
      'alpenglow/destinations',
      'alpenglow/gallery',
      'alpenglow/contact',
      'alpenglow/service-areas',
    ])

    const pageEntries: SitemapEntry[] = (pages || [])
      .filter((page) => !(siteKey === 'rva' && excludedRvaSlugs.has(page.slug)))
      .filter((page) => !(siteKey === 'alpenglow' && excludedAalSlugs.has(page.slug)))
      .map((page) => {
        const normalizedSlug = siteKey === 'alpenglow' ? normalizeAalPageSlug(page.slug) : page.slug
        const url = normalizedSlug ? `${base}/${normalizedSlug}` : `${base}/`
        return {
          url,
          lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
          changeFrequency: 'weekly',
          priority: 0.85,
        }
      })

    const merged = dedupeByUrl([...staticEntries, ...blogEntries, ...pageEntries])

    return new Response(toXml(merged), {
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
