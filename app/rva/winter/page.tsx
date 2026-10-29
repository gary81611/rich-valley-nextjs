import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { seasonForWinterAdventure } from '@/lib/rva-winter-seasons'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import type { ServiceContent } from '@/lib/pages'
import { RVA_SNOWSHOE_PRICE, RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'
import { RVA_WINTER_HERO_PHOTO } from '@/lib/rva-kit-photos'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Winter Adventures | Rich Valley Adventures | Aspen, CO',
  description:
    'Explore winter in the Roaring Fork Valley with Rich Valley Adventures. Guided snowshoeing, cross-country skiing, ice fishing, and winter Chauffeur Guided Tours in Aspen, Colorado.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/winter',
  },
  openGraph: {
    title: 'Winter Adventures in Aspen | Rich Valley Adventures',
    description:
      'Guided snowshoeing, cross-country skiing, ice fishing, and scenic winter tours in the Roaring Fork Valley.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/winter',
  },
}

interface WinterAdventure {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  season?: string | null
  image_url?: string | null
  is_active: boolean
  display_order: number
}

async function getWinterAdventures(): Promise<WinterAdventure[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return []

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('winter_adventures')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    return (data as WinterAdventure[]) || []
  } catch {
    return []
  }
}

export default async function WinterPage() {
  const winterAdventures = await getWinterAdventures()
  const content: ServiceContent = {
    hero_title: 'Winter Offerings',
    hero_subtitle: 'November through April',
    intro:
      `The Roaring Fork Valley is just as magical under snow. Explore our guided winter adventures — all gear included, small groups, expert local guides. ${RVA_SNOWSHOE_PRICE}. ${RVA_TRIP_OWNERSHIP}`,
    lead: {
      heading: 'How winter trips work',
      paragraphs: [
        'Advance booking required: Ice fishing, snowshoeing, and cross-country skiing must be booked with a minimum 7-day notice. All other winter activities: 48-hour advance booking recommended.',
        winterAdventures.length === 0
          ? 'No winter adventures available at this time. Check back soon!'
          : '',
      ].filter(Boolean),
      facts: [
        { label: 'Half-day snowshoe', value: '$500' },
        { label: 'Hunting', value: 'From $250 per person' },
        { label: 'Half-day', value: '3–4 hours door-to-door. Includes snacks and drinks.' },
        { label: 'Full day', value: '6–8 hours door-to-door. Includes lunch.' },
        { label: 'Gear', value: 'All gear provided on every trip' },
        { label: 'Group sizes', value: '1–12 people' },
        { label: 'Transportation', value: 'All transportation provided by Aspen Alpenglow Limousine' },
      ],
      links: [],
    },
    h2_sections: winterAdventures.map((adventure) => {
      const season = seasonForWinterAdventure(adventure.title) || adventure.season || ''
      const bits = [
        adventure.description,
        [adventure.duration, adventure.difficulty, season].filter(Boolean).join(' · '),
        /snowshoe/i.test(adventure.title)
          ? 'Half-day snowshoe: $500. Groups 1–12. All gear included. Snowshoeing is guided in-house.'
          : /snowmobile|atv|snowbike/i.test(adventure.title)
            ? 'Horseback, ATV, and snowmobile trips go through partner local outfitters. Groups 1–12. Transport: Aspen Alpenglow Limousine.'
            : /hunt|elk|deer|waterfowl|cast and blast/i.test(adventure.title)
              ? 'Hunting trips on this page start at $250 per person. Groups 1–12. All gear included. Transport: Aspen Alpenglow Limousine.'
              : 'Groups 1–12. All gear included. Transport: Aspen Alpenglow Limousine.',
      ].filter(Boolean)
      const imageSrc = (adventure.image_url || '').trim()
      return {
        title: adventure.title,
        content: bits.join('\n\n'),
        image: imageSrc || undefined,
        imageAlt: `${adventure.title} — guided winter adventure near Aspen, Colorado with Rich Valley Adventures`,
      }
    }),
    cta_text: 'Plan Your Winter Adventure',
    cta_note:
      'Winter in the Roaring Fork Valley is something special. Let us help you experience it the right way — with expert guides, premium gear, and small groups.',
  }

  return (
    <>
      <div className="h-[86px]" />
      <ServicePageTemplate
        site="rva"
        title="Winter Offerings"
        content={content}
        bookingHref="/contact"
        heroImage={RVA_WINTER_HERO_PHOTO.src}
        heroImageAlt={RVA_WINTER_HERO_PHOTO.alt}
      />
    </>
  )
}
