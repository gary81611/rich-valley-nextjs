import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.includes('.')) {
    return NextResponse.next()
  }

  let site: 'rva' | 'alpenglow' = 'rva'

  if (hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')) {
    site = 'alpenglow'
  } else if (hostname.includes('richvalley') || hostname.includes('rva')) {
    site = 'rva'
  }

  const siteParam = url.searchParams.get('site')
  if (siteParam === 'alpenglow' || siteParam === 'rva') {
    site = siteParam
  }

  if (pathname.startsWith(`/${site}`)) {
    return NextResponse.next()
  }

  url.pathname = `/${site}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
