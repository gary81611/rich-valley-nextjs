/**
 * Page-2 query sprint (Nov 20, 2026). Render-time title, H1, meta, and
 * short copy. Does not write Supabase. Prices are already published.
 * "Since 2012" is used on RVA, and on AAL /corporate only. The AAL layout
 * JSON-LD already sets foundingDate to 2012. Other AAL strings omit it.
 */

export type Page2Meta = {
  /** Document title. */
  title: string
  /** Visible H1. */
  h1: string
  description: string
}

export const AAL_CORPORATE: Page2Meta = {
  title: 'Aspen Executive Transportation | Corporate Car Service',
  h1: 'Aspen Corporate & Executive Transportation',
  description:
    'Executive car service in Aspen for airports, meetings, and retreats. Private Suburbans and a 13-passenger Transit van, since 2012. Call 970-315-6111.',
}

export const AAL_ASPEN_TO_EGE: Page2Meta = {
  title: 'Aspen to Eagle Airport (EGE) Private Car | $720',
  h1: 'Aspen to Eagle Airport (EGE) Private Transfer',
  description:
    'Private transfer from Aspen or Snowmass to Eagle County Airport (EGE), $720 one way in a Suburban. The 13-passenger Transit is $1,200. About 1.5–2 hours.',
}

export const AAL_ASE_TO_EGE_FAQ = {
  question: 'What does ASE to EGE mean?',
  answer:
    'ASE is Aspen/Pitkin County Airport. EGE is Eagle County Airport in Gypsum.',
}

export const AAL_DENVER_SERVICE_AREA: Page2Meta = {
  title: 'Denver to Aspen Private Transfer | $1,375 All-Inclusive',
  h1: 'Denver to Aspen Private Transfers',
  description:
    'DEN to Aspen private transfer, $1,375 all-inclusive in a Suburban. The 13-passenger Transit is $1,600. About 3.5–4 hours. Call 970-315-6111.',
}

/** Published DEN rates. All-inclusive means no hidden service charges or automatic gratuity. */
export const AAL_DENVER_RATES_NOTE =
  'DEN to Aspen is $1,375 all-inclusive in a Suburban. The 13-passenger Transit is $1,600. About 3.5–4 hours. All-inclusive means no hidden service charges or automatic gratuity.'

/**
 * KAPA (Centennial Denver) → Aspen Suburban is $1,475 on /pricing.
 * No Transit price is published for this transfer.
 */
export const AAL_KAPA_SECTION = {
  id: 'centennial-kapa',
  title: 'Centennial Airport (KAPA) to Aspen',
  content:
    'KAPA (Centennial Denver) to Aspen is $1,475 one way in a Chevrolet Suburban. That published rate is the Aspen transfer, not a Snowmass-only fare. Snowmass Village can be a drop-off on the trip. A Ford Transit price for Centennial is not published. Call 970-315-6111.',
  link: { href: '/pricing', label: 'Published KAPA to Aspen Suburban rate' },
}

export const AAL_SNOWMASS_KAPA_NOTE =
  'Denver and Centennial (KAPA) pickups to Snowmass Village can be arranged. The published Centennial rate is a KAPA to Aspen Suburban fare on the Denver page, not a Snowmass-only price.'

export const AAL_PARKING_FAQ = {
  question: 'Does Aspen airport have parking, or should I book a transfer?',
  answer:
    'Aspen/Pitkin County Airport parking is tight, especially in ski season. Aspen Alpenglow Limousine is a private car service, not a parking operator. Book a private transfer if you would rather skip the lot.',
}

export const AAL_WINE_TOUR_LEAD =
  'Book a private wine tour on the [Aspen wine tours](/wine-tours) page.'

export const RVA_FLY_FISHING: Page2Meta = {
  title: 'Aspen Fly Fishing Guides | Roaring Fork | Since 2012',
  h1: 'Aspen Fly Fishing on the Roaring Fork',
  description:
    'Guided fly fishing in Aspen since 2012: Roaring Fork, Fryingpan, and private water. Full-day floats from $1,400 for 2, with lunch, gear, and transport.',
}

export const RVA_FLY_FISHING_BLOG_SLUG = 'fly-fishing-aspen-roaring-fork-valley'
export const RVA_FLY_FISHING_BLOG: Page2Meta = {
  title: 'Fly Fishing in Aspen: A Roaring Fork Valley Guide',
  h1: 'Fly Fishing in Aspen and the Roaring Fork Valley',
  description:
    'A local guide to fly fishing in Aspen: Roaring Fork stretches, seasons, private water, and how to book a guided trip. On these rivers since 2012.',
}

export const RVA_FLY_FISHING_BLOG_LEAD =
  'Book a guided trip on the [Aspen fly fishing](/fly-fishing) page, or see [private-water fly fishing at Spring Creek Ranch](/private-ranch-fishing).'

export const RVA_WILDLIFE_BLOG_SLUG = 'aspen-wildlife-tours-nature-experiences-rich-valley'
export const RVA_WILDLIFE_BLOG: Page2Meta = {
  title: 'Aspen Wildlife & Naturalist Tours | Since 2012',
  h1: 'Aspen Wildlife and Naturalist Tours',
  description:
    'Guided wildlife and naturalist tours in Aspen since 2012. Elk, deer, and winter nature walks in the Elk Mountains. Small groups. Call 970-456-3666.',
}

export const RVA_WILDLIFE_SANCTUARY_FAQ = {
  question: 'Do you operate a wildlife sanctuary?',
  answer:
    'No. These are guided wildlife-viewing and naturalist tours in Aspen, not a wildlife sanctuary.',
}

export const RVA_ADVENTURES: Page2Meta = {
  title: 'Aspen Outdoor Adventures | Guided Trips Since 2012',
  h1: 'Outdoor Adventures in Aspen and the Roaring Fork Valley',
  description:
    'Guided outdoor adventures in Aspen since 2012: fly fishing, hiking, rafting, and elevated camping. Paddleboarding is a rental from $100, not a guided trip.',
}

export const RVA_HIKING: Page2Meta = {
  title: 'Guided Hiking Tours in Aspen | Naturalist-Led Since 2012',
  h1: 'Guided Hiking Tours in Aspen and the Maroon Bells',
  description:
    'Naturalist-led hiking tours in Aspen and the Maroon Bells since 2012. Small groups on permitted Pitkin County and backcountry trails. Call 970-456-3666.',
}

export const RVA_HIKING_NATURALIST_NOTE =
  'Hikes are naturalist-led, including permitted Pitkin County open space and backcountry trails.'

export const RVA_PERMITTED_HIKING_LINK = {
  href: '/blog/permitted-aspen-open-space-hiking-tours-rich-valley-adventures',
  label: 'Permitted Aspen open-space hiking tours',
}

export const RVA_PRIVATE_RANCH: Page2Meta = {
  title: 'Private Water Fly Fishing in Carbondale | Since 2012',
  h1: 'Private Water Fly Fishing at Spring Creek Ranch',
  description:
    'Private-water fly fishing at Spring Creek Ranch in Carbondale, near Aspen, since 2012. Ponds, creeks, and a private Roaring Fork run. From $800 per adult.',
}

export const RVA_CARBONDALE: Page2Meta = {
  title: 'Carbondale Adventures | Private Water & Guides Since 2012',
  h1: 'Guided Adventures in Carbondale',
  description:
    'Guided fly fishing, private-water trips, and outdoor adventures in Carbondale since 2012, including Spring Creek Ranch. Call 970-456-3666.',
}

export const RVA_CARBONDALE_NOTE =
  'Private-water fly fishing at Spring Creek Ranch is in Carbondale, near Aspen.'

export const RVA_PADDLE: Page2Meta = {
  title: 'Paddleboard Rentals in Aspen | From $100',
  h1: 'Paddleboard Rentals in Aspen, Colorado',
  description:
    'Paddleboarding in Aspen is a rental from $100, not a guided trip. Book a board with Rich Valley Adventures. Call 970-456-3666.',
}

export const RVA_SNOWSHOEING: Page2Meta = {
  title: 'Guided Snowshoeing in Aspen | Tours Since 2012',
  h1: 'Guided Snowshoeing in Aspen, Colorado',
  description:
    'Guided snowshoeing in Aspen since 2012, including Ashcroft Ghost Town and Snowmass Creek. All equipment provided. Call 970-456-3666.',
}

export const RVA_WINTER_NATURALIST_NOTE =
  'Guided winter naturalist tours in Aspen include snowshoeing and wildlife viewing in the Elk Mountains.'

export const RVA_SCENIC_NATURALIST_NOTE =
  'These are guided wildlife and naturalist tours, not a wildlife sanctuary.'

type BlogCopy = {
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  content: string | null
  faqs: { question: string; answer: string }[] | null
  internal_links?: { text: string; url: string }[] | null
}

function prependOnce(content: string | null, lead: string, marker: string): string {
  const body = content || ''
  if (body.includes(marker)) return body
  return body.trim() ? `${lead}\n\n${body}` : lead
}

/** Title, H1, and meta overrides for two RVA posts. Does not write the database. */
export function applyRvaPage2Blog<T extends BlogCopy>(post: T): T {
  if (post.slug === RVA_FLY_FISHING_BLOG_SLUG) {
    return {
      ...post,
      title: RVA_FLY_FISHING_BLOG.h1,
      meta_title: RVA_FLY_FISHING_BLOG.title,
      meta_description: RVA_FLY_FISHING_BLOG.description,
      content: prependOnce(post.content, RVA_FLY_FISHING_BLOG_LEAD, '/fly-fishing'),
    }
  }
  if (post.slug === RVA_WILDLIFE_BLOG_SLUG) {
    const faqs = post.faqs ?? []
    const hasSanctuaryFaq = faqs.some((faq) => /sanctuary/i.test(faq.question))
    const links = post.internal_links ?? []
    const extraLinks = [
      { text: 'Scenic and wildlife tours', url: '/adventures/scenic-wildlife-tours' },
      { text: 'Winter adventures', url: '/winter' },
      { text: 'Aspen outdoor adventures', url: '/adventures' },
    ].filter((link) => !links.some((existing) => existing.url === link.url))
    return {
      ...post,
      title: RVA_WILDLIFE_BLOG.h1,
      meta_title: RVA_WILDLIFE_BLOG.title,
      meta_description: RVA_WILDLIFE_BLOG.description,
      faqs: hasSanctuaryFaq ? faqs : [...faqs, RVA_WILDLIFE_SANCTUARY_FAQ],
      internal_links: [...extraLinks, ...links],
    }
  }
  return post
}

type AalBlogCopy = BlogCopy

/** Parking FAQ and wine-tour booking line. Does not retitle those posts. */
export function applyAalPage2Blog<T extends AalBlogCopy>(post: T): T {
  if (post.slug === 'aspen-airport-transportation-guide') {
    const faqs = post.faqs ?? []
    const hasParking = faqs.some((faq) => /parking/i.test(faq.question))
    return {
      ...post,
      faqs: hasParking ? faqs : [...faqs, AAL_PARKING_FAQ],
    }
  }
  if (post.slug === 'aspen-wine-tours-guide-to-local-tastings') {
    return {
      ...post,
      content: prependOnce(post.content, AAL_WINE_TOUR_LEAD, '/wine-tours'),
    }
  }
  return post
}
