/**
 * RVA blog SEO pillars — kept fully indexable; all other RVA posts are bulk-demoted (draft + redirect).
 * Fly fishing, hiking, family summer — highest depth / booking relevance among in-repo sources.
 */
export const RVA_PILLAR_BLOG_SLUGS = [
  'fly-fishing-aspen-roaring-fork-valley',
  'guided-hiking-tours-aspen-maroon-bells',
  'summer-activities-aspen-families',
] as const

export type RvaPillarBlogSlug = (typeof RVA_PILLAR_BLOG_SLUGS)[number]

export function isRvaPillarBlogSlug(slug: string): slug is RvaPillarBlogSlug {
  return (RVA_PILLAR_BLOG_SLUGS as readonly string[]).includes(slug)
}

/** Sidebar links merged on pillar posts only — canonical paths (no legacy URLs that 301). */
export function rvaPillarBlogExtraInternalLinks(slug: string): { text: string; url: string }[] {
  if (!isRvaPillarBlogSlug(slug)) return []

  const book = { text: 'Book a trip — contact us', url: '/contact' }
  const areas = { text: 'Where we guide — service areas', url: '/service-areas' }
  const adventures = { text: 'Browse guided adventures', url: '/adventures' }

  if (slug === 'fly-fishing-aspen-roaring-fork-valley') {
    return [
      { text: 'Guided fly fishing trips', url: '/fly-fishing' },
      adventures,
      areas,
      book,
    ]
  }
  if (slug === 'guided-hiking-tours-aspen-maroon-bells') {
    return [
      { text: 'Guided hiking in Aspen', url: '/hiking' },
      adventures,
      areas,
      book,
    ]
  }
  return [
    { text: 'Family-friendly paddle boarding', url: '/paddle-boarding' },
    { text: 'Guided fly fishing for families', url: '/fly-fishing' },
    adventures,
    areas,
    book,
  ]
}

/** Related reading on key service landings → pillar posts (CMS slug or route id). */
export function rvaServicePageRelatedBlogLinks(serviceSlug: string): { href: string; label: string }[] {
  const s = serviceSlug.toLowerCase()
  if (s === 'fly-fishing') {
    return [
      {
        href: '/blog/fly-fishing-aspen-roaring-fork-valley',
        label: 'Ultimate guide: fly fishing in Aspen & the Roaring Fork Valley',
      },
    ]
  }
  if (s === 'hiking') {
    return [
      {
        href: '/blog/guided-hiking-tours-aspen-maroon-bells',
        label: 'Guided hiking near Aspen: Maroon Bells to Independence Pass',
      },
    ]
  }
  if (s === 'paddle-boarding') {
    return [
      {
        href: '/blog/summer-activities-aspen-families',
        label: 'Top summer activities in Aspen for families',
      },
    ]
  }
  return []
}

/** Merge CMS internal links with pillar extras; extras first; dedupe by URL. */
export function mergeRvaBlogSidebarLinks(
  slug: string,
  dbLinks: { text: string; url: string }[],
): { text: string; url: string }[] {
  const extra = rvaPillarBlogExtraInternalLinks(slug)
  const seen = new Set<string>()
  const out: { text: string; url: string }[] = []
  for (const l of [...extra, ...dbLinks]) {
    if (seen.has(l.url)) continue
    seen.add(l.url)
    out.push(l)
  }
  return out
}

/** Blog index / contact / service areas — cross-links to pillars. */
export const RVA_GLOBAL_PILLAR_BLOG_LINKS: { href: string; label: string }[] = [
  {
    href: '/blog/fly-fishing-aspen-roaring-fork-valley',
    label: 'Fly fishing in Aspen & the Roaring Fork Valley — full guide',
  },
  {
    href: '/blog/guided-hiking-tours-aspen-maroon-bells',
    label: 'Guided hiking: Maroon Bells, Independence Pass & more',
  },
  {
    href: '/blog/summer-activities-aspen-families',
    label: 'Summer in Aspen for families — activities & trip ideas',
  },
]
