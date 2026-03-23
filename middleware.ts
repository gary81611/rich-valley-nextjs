import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

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

  const hostname = request.headers.get('host') || ''
  let site: 'rva' | 'alpenglow' = 'rva'

  if (hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')) {
    site = 'alpenglow'
  } else if (hostname.includes('richvalley') || hostname.includes('rva')) {
    site = 'rva'
  }

  // 301 redirects for stale RVA URLs indexed by search engines
  if (site === 'rva') {
    if (pathname.startsWith('/service-areas') || pathname === '/horseback-riding') {
      return NextResponse.redirect('https://www.richvalleyadventures.com/', 301)
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
