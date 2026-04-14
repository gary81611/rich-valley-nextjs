import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { normalizeRvaLegacyPath } from '@/lib/seo/legacy-routes'

const RVA_HOSTS = new Set(['www.richvalleyadventures.com', 'richvalleyadventures.com'])
const AAL_HOSTS = new Set(['www.aspenalpenglowlimousine.com', 'aspenalpenglowlimousine.com'])

function toSafeRedirectPath(path: string): string {
  if (!path.startsWith('/')) return '/'
  const [rawPath, query] = path.split('?', 2)
  const cleaned = rawPath.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
  const safePath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`
  const normalized = safePath === '' ? '/' : safePath
  if (normalized.startsWith('//')) return '/'
  if (normalized.includes('..')) return '/'
  if (normalized.includes('://')) return '/'
  return query ? `${normalized}?${query}` : normalized
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Guard legacy homepage aliases so /home and /home/ always collapse to /.
  if (pathname === '/home' || pathname === '/home/') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // Refresh Supabase session on every request (only if configured)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })
      await supabase.auth.getUser()
    } catch {
      // Supabase not configured — continue without auth refresh
    }
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.includes('.')) {
    return response
  }

  // Skip admin routes — let them pass through
  if (pathname.startsWith('/admin')) {
    return response
  }

  // Skip shared routes — terms, privacy (these are not brand-specific)
  if (pathname === '/terms' || pathname === '/privacy') {
    return response
  }

  const hostname = (request.headers.get('host') || '').trim().toLowerCase().split(':')[0]
  let site: 'rva' | 'alpenglow' = 'rva'

  if (AAL_HOSTS.has(hostname)) {
    site = 'alpenglow'
  } else if (RVA_HOSTS.has(hostname)) {
    site = 'rva'
  }

  /** Indexed legacy URLs used /rva/* — strip prefix so canonical paths are /… (see next.config.js). */
  if (site === 'rva' && (pathname === '/rva' || pathname === '/rva/' || pathname.startsWith('/rva/'))) {
    const dest = pathname === '/rva' || pathname === '/rva/' ? '/' : toSafeRedirectPath(pathname.slice(4) || '/')
    return NextResponse.redirect(new URL(dest, request.url), 301)
  }

  /** Canonical public URLs on AAL host do not include /alpenglow prefix. */
  if (site === 'alpenglow' && (pathname === '/alpenglow' || pathname === '/alpenglow/' || pathname.startsWith('/alpenglow/'))) {
    const dest =
      pathname === '/alpenglow' || pathname === '/alpenglow/'
        ? '/'
        : toSafeRedirectPath(pathname.slice('/alpenglow'.length) || '/')
    return NextResponse.redirect(new URL(dest, request.url), 301)
  }

  /** Valley location guides that overlap service-area landings — canonical is /service-areas/[slug]. */
  const locationSlugToServiceArea: Record<string, string> = {
    snowmass: 'snowmass-village',
  }
  const locationsMergedToServiceAreas = new Set(['aspen', 'basalt', 'carbondale', 'snowmass', 'glenwood-springs'])

  if (site === 'rva' && pathname.startsWith('/locations/')) {
    const slug = pathname.slice('/locations/'.length).split('/')[0]
    if (slug && locationsMergedToServiceAreas.has(slug)) {
      const target = locationSlugToServiceArea[slug] || slug
      return NextResponse.redirect(new URL(`/service-areas/${target}`, request.url), 301)
    }
  }

  // 301 redirects for stale RVA URLs (see also next.config.js redirects)
  if (site === 'rva') {
    if (pathname === '/adventures' || pathname.startsWith('/adventures/')) {
      const normalized = toSafeRedirectPath(normalizeRvaLegacyPath(pathname))
      if (normalized !== pathname) {
        return NextResponse.redirect(new URL(normalized, request.url), 301)
      }
    }
    if (pathname === '/winter-offerings') {
      return NextResponse.redirect(new URL('/winter', request.url), 301)
    }
    if (pathname === '/horseback-riding') {
      return NextResponse.redirect(new URL('/', request.url), 301)
    }
  }

  const siteParam = url.searchParams.get('site')
  if (siteParam === 'alpenglow' || siteParam === 'rva') {
    site = siteParam
  }

  if (pathname.startsWith(`/${site}`)) {
    return response
  }

  url.pathname = `/${site}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
