/** Public RVA activities. Nav, footer, and cards share this list. Wine tours are not an RVA page. */
export const RVA_ACTIVITIES: { label: string; href: string }[] = [
  { label: 'Fly Fishing', href: '/fly-fishing' },
  { label: 'Private Ranch Fishing', href: '/private-ranch-fishing' },
  { label: 'Paddleboard Rental', href: '/paddle-boarding' },
  { label: 'Mountain Biking', href: '/adventures/mountain-biking' },
  { label: 'Hiking', href: '/hiking' },
  { label: 'Horseback Riding', href: '/adventures/horseback-riding' },
  { label: 'Scenic Escalade', href: '/adventures/scenic-escalade-tours' },
  { label: 'Elevated Camping', href: '/elevated-camping' },
  { label: 'Snowshoeing', href: '/snowshoeing' },
  { label: 'Winter Adventures', href: '/winter' },
]

export function rvaNavIsCurrent(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
