import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { resolveRvaLegacySingleHop, rvaEarlyAliasPath, rvaExternalEarlyUrl } from '@/lib/seo/legacy-routes'

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

function applyRvaSeoRedirect(baseUrl: string, pathname: string, search: string): NextResponse | null {
  const hop = resolveRvaLegacySingleHop(pathname, search)
  if (!hop) return null
  if (hop.kind === 'external') {
    return NextResponse.redirect(hop.url, 301)
  }
  return NextResponse.redirect(new URL(hop.path, baseUrl), 301)
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const search = url.search

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const hostname = (request.headers.get('host') || '').trim().toLowerCase().split(':')[0]
  const isRvaHost = RVA_HOSTS.has(hostname)
  const isAalHost = AAL_HOSTS.has(hostname)

  if (pathname === '/home' || pathname === '/home/') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  /** `/rva` and `/rva/*` → public path in one hop (including nested legacy URLs). */
  if (isRvaHost && (pathname === '/rva' || pathname === '/rva/' || pathname.startsWith('/rva/'))) {
    const dest =
      pathname === '/rva' || pathname === '/rva/' ? '/' : toSafeRedirectPath(pathname.slice(4) || '/')
    const [destPathPart, destQuery] = dest.split('?', 2)
    const raw = destPathPart || '/'
    const pathOnly = raw.length > 1 && raw.endsWith('/') ? raw.slice(0, -1) : raw
    const mergedSearch = destQuery != null ? `?${destQuery}` : search
    const nested = applyRvaSeoRedirect(request.url, pathOnly, mergedSearch)
    if (nested) return nested
    return NextResponse.redirect(new URL(pathOnly + mergedSearch, request.url), 301)
  }

  /** AAL host: drop `/alpenglow` prefix in one hop (trim trailing slash on destination). */
  if (isAalHost && (pathname === '/alpenglow' || pathname === '/alpenglow/' || pathname.startsWith('/alpenglow/'))) {
    const rawDest =
      pathname === '/alpenglow' || pathname === '/alpenglow/'
        ? '/'
        : toSafeRedirectPath(pathname.slice('/alpenglow'.length) || '/')
    const [dp, dq] = rawDest.split('?', 2)
    let pathPart = dp || '/'
    if (pathPart.length > 1 && pathPart.endsWith('/')) {
      pathPart = pathPart.slice(0, -1)
    }
    const qs = dq != null ? `?${dq}` : search
    return NextResponse.redirect(new URL(pathPart + qs, request.url), 301)
  }

  /** RVA aliases, including trailing slashes, before the generic slash strip (one hop). */
  if (isRvaHost) {
    const externalTarget = rvaExternalEarlyUrl(pathname)
    if (externalTarget) {
      return NextResponse.redirect(externalTarget, 301)
    }
    const aliasTarget = rvaEarlyAliasPath(pathname)
    if (aliasTarget) {
      return NextResponse.redirect(new URL(aliasTarget + search, request.url), 301)
    }
  }

  /** AAL ski canonical, including the trailing slash, before the generic slash strip (one hop). */
  if (isAalHost) {
    const bare = pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname
    if (bare === '/services/ski-resort-transfers') {
      return NextResponse.redirect(new URL('/ski-resort-transfers' + search, request.url), 301)
    }
  }

  /** Canonical: no trailing slash (except `/`). Use a plain URL so NextURL does not put the slash back. */
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const stripped = pathname.replace(/\/+$/, '') || '/'
    return NextResponse.redirect(new URL(stripped + search, request.url), 301)
  }

  /** RVA: legacy paths that must 301 before `/rva` rewrite (single hop). */
  if (isRvaHost) {
    const direct = applyRvaSeoRedirect(request.url, pathname, search)
    if (direct) return direct
  }

  let site: 'rva' | 'alpenglow' = 'rva'
  if (isAalHost) {
    site = 'alpenglow'
  } else if (isRvaHost) {
    site = 'rva'
  }

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
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            )
          },
        },
      })
      await supabase.auth.getUser()
    } catch {
      // Supabase not configured — continue without auth refresh
    }
  }

  if (pathname.startsWith('/admin')) {
    return response
  }

  if (pathname === '/terms' || pathname === '/privacy') {
    return response
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
