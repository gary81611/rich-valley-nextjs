/** Public RVA activities. Nav, footer, and cards share this list. Wine tours are not an RVA page. */
export const RVA_ACTIVITIES: { label: string; href: string }[] = [
  { label: 'Fly Fishing', href: '/fly-fishing' },
  { label: 'Private Ranch Fishing', href: '/private-ranch-fishing' },
  { label: 'Paddleboard Rental', href: '/paddle-boarding' },
  { label: 'Mountain Biking', href: '/adventures/mountain-biking' },
  { label: 'Hiking', href: '/hiking' },
  { label: 'Horseback Riding', href: '/adventures/horseback-riding' },
  { label: 'Scenic & Wildlife Tours', href: '/adventures/scenic-wildlife-tours' },
  { label: 'Elevated Camping', href: '/elevated-camping' },
  { label: 'Snowshoeing', href: '/snowshoeing' },
  { label: 'Winter Adventures', href: '/winter' },
]

/** Browser path, or the middleware rewrite path `/rva/...` on client pages. */
export function rvaPublicPath(pathname: string): string {
  let path = (pathname || '/').split('?')[0] || '/'
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (path === '/rva') return '/'
  if (path.startsWith('/rva/')) path = path.slice(4) || '/'
  return path || '/'
}

export function rvaNavIsCurrent(pathname: string, href: string): boolean {
  const path = rvaPublicPath(pathname)
  if (href === '/') return path === '/'
  return path === href || path.startsWith(`${href}/`)
}
