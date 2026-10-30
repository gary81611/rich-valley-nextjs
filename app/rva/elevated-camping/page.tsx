import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import type { ServiceContent } from '@/lib/pages'
import { RVA_CAMPING_PRICE, RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Elevated Camping | Glamping in Aspen | Rich Valley Adventures',
  description:
    'Experience elevated camping near Aspen, Colorado — premium canvas tents, gourmet chef-prepared meals, guided night-sky viewing, and all the comforts of home in the heart of the Colorado wilderness.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/elevated-camping',
  },
  openGraph: {
    title: 'Elevated Camping — Glamping Near Aspen | Rich Valley Adventures',
    description:
      'Premium basecamp with gourmet meals, real beds, and guided stargazing in the Roaring Fork Valley. This is not roughing it.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/elevated-camping',
    images: [
      {
        url: '/images/adventures/elevated-camping.jpeg',
        width: 1200,
        height: 630,
        alt: 'Elevated camping experience with Rich Valley Adventures near Aspen, Colorado',
      },
    ],
  },
}

async function fetchCampingPackages(): Promise<{ id: string; name: string; description: string | null }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return []
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('camping_packages')
    .select('id, name, description')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching camping packages:', error)
    return []
  }

  return data ?? []
}

export default async function ElevatedCampingPage() {
  const includedItems = await fetchCampingPackages()
  const content: ServiceContent = {
    hero_title: 'Elevated Camping',
    hero_subtitle: 'Glamping meets wilderness. Premium comfort in the heart of the Colorado Rockies. Overnight / multi-day. All levels.',
    intro: `Our elevated camping experience is designed for people who love the idea of sleeping under the stars but don't want to sacrifice comfort. Think of it as a luxury basecamp — spacious canvas tents with real beds, a communal dining area with chef-prepared meals, and guided activities that make every moment count.

Each camp is set in a carefully chosen location deep in the Roaring Fork Valley backcountry — far from roads and crowds, close to streams and mountain views. You wake up to fresh coffee and a sunrise over the peaks, spend the day hiking or fishing or simply reading by the creek, and end the evening around a campfire with a gourmet dinner and guided stargazing.

Whether it's a romantic getaway, a family milestone, or a group trip with friends, our elevated camping experiences create memories that last. We handle every detail so you can be fully present in one of the most beautiful places on Earth.

${RVA_CAMPING_PRICE}. Camping is guided in-house. ${RVA_TRIP_OWNERSHIP}`,
    lead: {
      heading: 'This Is Not Roughing It',
      paragraphs: [],
      facts: [
        { label: 'Overnight camping', value: '$1,500' },
        { label: 'Nights', value: '1-3. Single overnight or multi-day experiences available.' },
        { label: 'Guests', value: '2-8. Perfect for couples, families, and small groups.' },
        { label: 'Availability', value: '4 seasons. Year-round camping with seasonal variations.' },
      ],
    },
    features: includedItems.map((item) => ({
      title: item.name,
      description: item.description || '',
    })),
    cta_text: 'Ready for an Unforgettable Night Under the Stars?',
    cta_note: "Contact us to plan your elevated camping experience. We'll customize every detail to your group.",
  }

  return (
    <>
      <div className="h-[var(--rva-header,97px)] md:h-[var(--rva-header,117px)]" aria-hidden />
      <ServicePageTemplate
        site="rva"
        title="Elevated Camping"
        content={content}
        heroImage="/images/adventures/elevated-camping.jpeg"
        heroImageAlt="Elevated camping — premium glamping experience near Aspen, Colorado with Rich Valley Adventures"
        bookingHref="/contact"
      />
    </>
  )
}
