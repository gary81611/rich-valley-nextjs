/**
 * Canonicalize legacy RVA URL patterns to current public paths.
 * Used for related links and redirect safety.
 */
export function normalizeRvaLegacyPath(url: string): string {
  if (!url.startsWith('/')) return url

  const [path, query] = url.split('?', 2)
  const suffix = query != null ? `?${query}` : ''

  if (path === '/adventures') return `/${suffix}`
  if (!path.startsWith('/adventures/')) return url

  const rest = path.slice('/adventures/'.length)
  if (!rest) return `/${suffix}`

  const map: Record<string, string> = {
    glamping: '/elevated-camping',
    'fly-fishing': '/fly-fishing',
    hiking: '/hiking',
    'mountain-biking': '/adventures/mountain-biking',
    'paddle-boarding': '/paddle-boarding',
    hunting: '/hunting',
    'winter-adventures': '/winter',
  }

  const isUnsafe =
    rest.startsWith('/') || rest.startsWith('.') || rest.includes('\\') || rest.includes('://') || rest.includes('..')
  if (isUnsafe) return `/${suffix}`

  const target = map[rest] || `/${rest.replace(/^\/+/, '')}`
  return `${target}${suffix}`
}
