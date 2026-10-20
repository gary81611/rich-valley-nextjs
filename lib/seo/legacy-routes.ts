/** Single-hop 301 target for RVA SEO (same host unless `external`). */
export type RvaSeoRedirect =
  | { kind: 'path'; path: string }
  | { kind: 'external'; url: string }

/** Paths that must land on the paddleboard rentals page. `/paddle-boarding` itself is not an alias. */
const PADDLE_RENTAL_ALIAS_PATHS = new Set([
  '/adventures/paddle-boarding',
  '/adventures/paddle-board-rentals',
  '/paddle-board-rentals',
  '/paddleboard-rentals',
  '/paddle-boarding-tours',
  '/paddleboard-tours',
])

/**
 * Extra one-hop aliases. Trailing slashes are stripped by the lookup so
 * `/glamping/` does not 301 to `/glamping` and then again.
 * Bare `/horseback-riding` stays on `/` (existing destination).
 */
const RVA_EXACT_ALIAS: Record<string, string> = {
  '/adventures/paddleboarding': '/paddle-boarding',
  '/paddleboarding': '/paddle-boarding',
  '/adventures/paddleboard-tour': '/paddle-boarding',
  '/paddleboard-tour': '/paddle-boarding',
  '/adventures/sup': '/paddle-boarding',
  '/sup': '/paddle-boarding',
  '/adventures/stand-up-paddle-boarding': '/paddle-boarding',
  '/stand-up-paddle-boarding': '/paddle-boarding',
  '/adventures/stand-up-paddleboard': '/paddle-boarding',
  '/stand-up-paddleboard': '/paddle-boarding',
  '/adventures/paddleboard': '/paddle-boarding',
  '/paddleboard': '/paddle-boarding',
  '/adventures/float-trip': '/fly-fishing',
  '/float-trip': '/fly-fishing',
  '/adventures/full-day-float-trip': '/fly-fishing',
  '/full-day-float-trip': '/fly-fishing',
  '/adventures/group-hiking': '/hiking',
  '/group-hiking': '/hiking',
  '/glamping': '/elevated-camping',
  '/adventures/private-ranch-family-fishing-and-picnic-lunch': '/private-ranch-fishing',
  '/private-ranch-family-fishing-and-picnic-lunch': '/private-ranch-fishing',
  '/adventures/private-ranch-fishing': '/private-ranch-fishing',
  '/adventures/trail-hiking': '/hiking',
  '/trail-hiking': '/hiking',
  '/scenic-escalade-tours': '/adventures/scenic-escalade-tours',
  '/horseback-riding': '/',
}

/** RVA-only. Strips a trailing slash so `/paddle-board-rentals/` is one hop, not slash-strip then redirect. */
export function rvaPaddleRentalAliasPath(pathname: string): '/paddle-boarding' | null {
  const bare = pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
  return PADDLE_RENTAL_ALIAS_PATHS.has(bare) ? '/paddle-boarding' : null
}

/** RVA-only alias, including the paddle set. Checked before the generic slash strip. */
export function rvaEarlyAliasPath(pathname: string): string | null {
  return rvaPaddleRentalAliasPath(pathname) ?? RVA_EXACT_ALIAS[pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname] ?? null
}

/**
 * Maps legacy public paths (and paths after stripping `/rva`) to their final canonical
 * destination in one hop — avoids chains like `/service-areas-locations/*` → `/service-areas/*-co` → `/service-areas/*`.
 */
export function resolveRvaLegacySingleHop(pathname: string, search: string): RvaSeoRedirect | null {
  const pathnameWithQuery = search ? `${pathname}${search}` : pathname
  const [rawPath] = pathnameWithQuery.split('?', 2)
  const p = rawPath.replace(/\/$/, '') || '/'

  if (p.startsWith('/service-areas-locations')) {
    const map: Record<string, string> = {
      '/service-areas-locations': '/service-areas',
      '/service-areas-locations/aspen-co': '/service-areas/aspen',
      '/service-areas-locations/basalt-co': '/service-areas/basalt',
      '/service-areas-locations/snowmass-village-co': '/service-areas/snowmass-village',
      '/service-areas-locations/carbondale-co': '/service-areas/carbondale',
      '/service-areas-locations/rifle-co': '/service-areas',
      '/service-areas-locations/denver-co': '/service-areas',
    }
    const dest = map[p] ?? '/service-areas'
    return { kind: 'path', path: dest + (search || '') }
  }

  if (p === '/fleet-v3') {
    return { kind: 'external', url: 'https://aspenalpenglowlimousine.com/fleet' }
  }

  const legacy: Record<string, string> = {
    '/booking': '/contact',
    '/winter-offerings': '/winter',
    '/outdoor-adventures': '/adventures',
    '/adventure-booking': '/contact',
    '/contact-us': '/contact',
    '/privacy-policy': '/privacy',
    '/glamping': '/elevated-camping',
    '/sup': '/paddle-boarding',
    '/paddleboard-tour': '/paddle-boarding',
    '/paddleboarding': '/paddle-boarding',
    '/paddleboard': '/paddle-boarding',
    '/stand-up-paddle-boarding': '/paddle-boarding',
    '/stand-up-paddleboard': '/paddle-boarding',
    '/float-trip': '/fly-fishing',
    '/full-day-float-trip': '/fly-fishing',
    '/group-hiking': '/hiking',
    '/private-ranch-family-fishing-and-picnic-lunch': '/private-ranch-fishing',
  }
  if (legacy[p]) {
    return { kind: 'path', path: legacy[p] + (search || '') }
  }

  if (PADDLE_RENTAL_ALIAS_PATHS.has(p)) {
    return { kind: 'path', path: '/paddle-boarding' + (search || '') }
  }

  if (p === '/trail-hiking') {
    return { kind: 'path', path: '/hiking' + (search || '') }
  }

  if (p === '/scenic-escalade-tours') {
    return { kind: 'path', path: '/adventures/scenic-escalade-tours' + (search || '') }
  }

  if (p === '/adventures' || p.startsWith('/adventures/')) {
    const normalized = normalizeRvaLegacyPath(pathnameWithQuery)
    if (normalized !== pathnameWithQuery) {
      return { kind: 'path', path: normalized }
    }
  }

  if (p === '/horseback-riding') {
    return { kind: 'path', path: '/' + (search || '') }
  }

  return null
}

/**
 * Canonicalize legacy RVA URL patterns to current public paths.
 * Used for related links and redirect safety.
 */
export function normalizeRvaLegacyPath(url: string): string {
  if (!url.startsWith('/')) return url

  const [path, query] = url.split('?', 2)
  const suffix = query != null ? `?${query}` : ''

  if (!path.startsWith('/adventures/')) return url

  const rest = path.slice('/adventures/'.length)
  if (!rest) return `/${suffix}`

  const map: Record<string, string> = {
    glamping: '/elevated-camping',
    'fly-fishing': '/fly-fishing',
    hiking: '/hiking',
    'mountain-biking': '/adventures/mountain-biking',
    'paddle-boarding': '/paddle-boarding',
    'paddle-board-rentals': '/paddle-boarding',
    paddleboarding: '/paddle-boarding',
    sup: '/paddle-boarding',
    'stand-up-paddle-boarding': '/paddle-boarding',
    'stand-up-paddleboard': '/paddle-boarding',
    paddleboard: '/paddle-boarding',
    'paddleboard-tour': '/paddle-boarding',
    'float-trip': '/fly-fishing',
    'full-day-float-trip': '/fly-fishing',
    'group-hiking': '/hiking',
    'private-ranch-family-fishing-and-picnic-lunch': '/private-ranch-fishing',
    'private-ranch-fishing': '/private-ranch-fishing',
    'trail-hiking': '/hiking',
    // Detail pages stay on /adventures/<slug>. Mapping to themselves skips the /<slug> fallback.
    'scenic-escalade-tours': '/adventures/scenic-escalade-tours',
    'horseback-riding': '/adventures/horseback-riding',
    hunting: '/hunting',
    'winter-adventures': '/winter',
  }

  const isUnsafe =
    rest.startsWith('/') || rest.startsWith('.') || rest.includes('\\') || rest.includes('://') || rest.includes('..')
  if (isUnsafe) return `/${suffix}`

  const target = map[rest] || `/${rest.replace(/^\/+/, '')}`
  return `${target}${suffix}`
}
