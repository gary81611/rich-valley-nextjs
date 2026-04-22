/**
 * Host-aware sitemap (RVA vs AAL). Rewritten from /sitemap.xml in next.config.js.
 * Prefers SUPABASE_SERVICE_ROLE_KEY on the server; sets X-Sitemap-Mode: dynamic | fallback.
 * Every Supabase query must filter by site_key / site_id from resolveSiteKeyFromHost.
 */
import { createClient } from '@supabase/supabase-js'
import { resolveSiteKeyFromHost } from '@/lib/site-from-host'

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

/** CMS rows that mirror app routes — omit so sitemap lists one URL per page. */
const RVA_SITEMAP_OMIT_CMS_SLUGS = new Set([
  'contact-us',
  'privacy-policy',
  'outdoor-adventures',
  'adventure-booking',
  'booking',
  'fleet-v3',
  'fleet',
  'home',
  'winter-offerings',
  'horseback-riding',
  'rva',
  'mountain-biking',
  'elevated-camping',
  'service-areas',
  'service-areas-locations',
  'transportation',
  'faq',
  'areas/aspen',
  'areas/basalt',
  'areas/snowmass',
  'fly-fishing',
  'guides',
  'locations',
  'conditions',
  'blog',
  'about',
  'contact',
  'gallery',
  'winter',
  'destinations',
  'services',
  'terms',
  'privacy',
])

function normalizeRvaCmsSlug(slug: string): string {
  return slug.trim().replace(/^\/+/, '').replace(/\/+$/, '')
}

function shouldOmitRvaCmsPageSlug(slug: string): boolean {
  const s = normalizeRvaCmsSlug(slug)
  if (!s) return true
  if (s.startsWith('areas/')) return true
  if (s.startsWith('service-areas-locations/')) return true
  if (s.startsWith('service-areas/')) return true
  return RVA_SITEMAP_OMIT_CMS_SLUGS.has(s)
}

/** DB service_area.slug may use legacy `-co` — map to the URL that returns 200 without a redirect. */
function canonicalRvaServiceAreaSlug(raw: string): string | null {
  const slug = String(raw).trim()
  const coMap: Record<string, string> = {
    'aspen-co': 'aspen',
    'basalt-co': 'basalt',
    'snowmass-village-co': 'snowmass-village',
    'carbondale-co': 'carbondale',
  }
  if (slug in coMap) return coMap[slug]
  if (slug === 'rifle-co' || slug === 'denver-co') return null
  return slug
}

function sitemapResponse(body: string, mode: 'dynamic' | 'fallback'): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
      'X-Sitemap-Mode': mode,
    },
  })
}

export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const siteKey = resolveSiteKeyFromHost(hostname)
  const isAAL = siteKey === 'alpenglow'
  const lastModified = new Date()

  /** Paths must match real routes + metadata canonicals (SEO/AEO). */
  const staticEntries: SitemapEntry[] = isAAL
    ? [
        { url: AAL_ORIGIN, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${AAL_ORIGIN}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${AAL_ORIGIN}/faq`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${AAL_ORIGIN}/services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${AAL_ORIGIN}/fleet`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${AAL_ORIGIN}/reservations`, lastModified, changeFrequency: 'weekly', priority: 0.92 },
        { url: `${AAL_ORIGIN}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${AAL_ORIGIN}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${AAL_ORIGIN}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.72 },
        { url: `${AAL_ORIGIN}/about`, lastModified, changeFrequency: 'monthly', priority: 0.82 },
        { url: `${AAL_ORIGIN}/airport-transfers`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${AAL_ORIGIN}/corporate`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
        { url: `${AAL_ORIGIN}/weddings`, lastModified, changeFrequency: 'weekly', priority: 0.86 },
        { url: `${AAL_ORIGIN}/wine-tours`, lastModified, changeFrequency: 'monthly', priority: 0.72 },
        { url: `${AAL_ORIGIN}/night-out`, lastModified, changeFrequency: 'monthly', priority: 0.72 },
        { url: `${AAL_ORIGIN}/areas/aspen`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${AAL_ORIGIN}/areas/snowmass`, lastModified, changeFrequency: 'monthly', priority: 0.78 },
        { url: `${AAL_ORIGIN}/areas/vail`, lastModified, changeFrequency: 'monthly', priority: 0.78 },
        { url: `${AAL_ORIGIN}/service-areas`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${AAL_ORIGIN}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
        { url: `${AAL_ORIGIN}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${AAL_ORIGIN}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
      ]
    : [
        { url: `${RVA_ORIGIN}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${RVA_ORIGIN}/fly-fishing`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${RVA_ORIGIN}/hiking`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
        { url: `${RVA_ORIGIN}/paddle-boarding`, lastModified, changeFrequency: 'weekly', priority: 0.88 },
        { url: `${RVA_ORIGIN}/conditions`, lastModified, changeFrequency: 'daily', priority: 0.9 },
        { url: `${RVA_ORIGIN}/guides`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/locations`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/service-areas`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
        /** Canonical paths (next.config 301s strip `-co` and legacy patterns). */
        { url: `${RVA_ORIGIN}/service-areas/aspen`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/snowmass-village`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/basalt`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/service-areas/carbondale`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${RVA_ORIGIN}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${RVA_ORIGIN}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/winter`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${RVA_ORIGIN}/elevated-camping`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${RVA_ORIGIN}/adventures/mountain-biking`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/adventures`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/services`, lastModified, changeFrequency: 'weekly', priority: 0.82 },
        { url: `${RVA_ORIGIN}/destinations`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${RVA_ORIGIN}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${RVA_ORIGIN}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
        { url: `${RVA_ORIGIN}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.25 },
      ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return sitemapResponse(toXml(staticEntries), 'fallback')
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [{ data: posts }, { data: pages }, { data: serviceAreas }] = await Promise.all([
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
      supabase
        .from('service_areas')
        .select('slug, updated_at')
        .eq('site_key', siteKey)
        .eq('is_active', true),
    ])

    const base = isAAL ? AAL_ORIGIN : RVA_ORIGIN

    const blogEntries: SitemapEntry[] = (posts || []).map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    const excludedAalSlugs = new Set([
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
      .filter((page) => !(siteKey === 'alpenglow' && excludedAalSlugs.has(page.slug)))
      .filter((page) => !(siteKey === 'rva' && shouldOmitRvaCmsPageSlug(page.slug)))
      .map((page) => {
        const normalizedSlug =
          siteKey === 'alpenglow' ? normalizeAalPageSlug(page.slug) : normalizeRvaCmsSlug(page.slug)
        const url = normalizedSlug ? `${base}/${normalizedSlug}` : `${base}/`
        return {
          url,
          lastModified: page.updated_at ? new Date(page.updated_at) : lastModified,
          changeFrequency: 'weekly',
          priority: 0.85,
        }
      })

    /**
     * AAL area detail pages are currently canonical under `/areas/*` from the CMS-backed catch-all,
     * while `/service-areas/*` is just the hub page family. Emitting AAL detail URLs here creates
     * non-200s / duplicate clusters, so only RVA uses `service_areas` detail rows in the sitemap.
     */
    const serviceAreaEntries: SitemapEntry[] = siteKey === 'rva'
      ? (serviceAreas || [])
          .filter((row) => typeof row.slug === 'string' && row.slug.trim().length > 0)
          .flatMap((row) => {
            const mapped = canonicalRvaServiceAreaSlug(String(row.slug))
            if (mapped === null) return []
            return [
              {
                url: `${base}/service-areas/${mapped}`,
                lastModified: row.updated_at ? new Date(row.updated_at) : lastModified,
                changeFrequency: 'monthly',
                priority: 0.78,
              },
            ]
          })
      : []

    const merged = dedupeByUrl([...staticEntries, ...blogEntries, ...pageEntries, ...serviceAreaEntries])

    return sitemapResponse(toXml(merged), 'dynamic')
  } catch (err) {
    console.error('[sitemap] Dynamic generation failed; serving static fallback.', {
      hostname,
      siteKey,
      error: err instanceof Error ? err.message : String(err),
    })
    return sitemapResponse(toXml(staticEntries), 'fallback')
  }
}
