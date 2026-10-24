import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import AdventureCard from '@/components/rva/AdventureCard'
import RvaButton from '@/components/rva/Button'
import type { ServiceContent } from '@/lib/pages'
import {
  PADDLE_OG_IMAGE,
  PADDLE_PHOTO_ALT,
  PADDLE_RENTAL_ID,
  FLY_FISHING_PUBLIC_DESCRIPTION,
  TRAIL_HIKING_PUBLIC_DESCRIPTION,
  adventurePublicDescription,
  adventurePublicHref,
  adventurePublicImage,
  isPaddleTourListing,
  isPublicAdventureCard,
} from '@/lib/rva-adventure-public'

export const dynamic = 'force-dynamic'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface AdventureRow {
  id: string
  name: string
  description: string
  long_description: string | null
  whats_included: string[] | null
  highlights: string[] | null
  best_for: string | null
  group_size: string | null
  duration: string
  price: number
  difficulty: string
  image_url: string
  display_order: number
  is_active: boolean
  season: string
}

async function getAdventure(slug: string): Promise<AdventureRow | null> {
  const supabase = await createServerSupabaseClient()
  const { data: adventures } = await supabase
    .from('adventures')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (!adventures) return null
  return adventures.find((a: AdventureRow) => slugify(a.name) === slug) || null
}

async function getRelatedAdventures(currentId: string): Promise<AdventureRow[]> {
  const supabase = await createServerSupabaseClient()
  const { data: adventures } = await supabase
    .from('adventures')
    .select('*')
    .eq('is_active', true)
    .neq('id', currentId)
    .order('display_order')
  return ((adventures as AdventureRow[]) || []).filter((a) => isPublicAdventureCard(a)).slice(0, 3)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const adventure = await getAdventure(slug)
  if (!adventure || isPaddleTourListing(adventure)) {
    return {
      title: 'Adventure Not Found | Rich Valley Adventures',
      alternates: {
        canonical: `https://www.richvalleyadventures.com/adventures/${slug}`,
      },
      robots: { index: false, follow: true },
    }
  }
  const adventureSlug = slugify(adventure.name)
  const isRental = adventure.id === PADDLE_RENTAL_ID || adventureSlug === 'paddle-board-rentals'
  const visual = adventurePublicImage(adventure)
  const publicDescription = adventurePublicDescription(adventure)
  return {
    title: `${adventure.name} | Rich Valley Adventures | Aspen, CO`,
    description: publicDescription,
    alternates: {
      canonical: `https://www.richvalleyadventures.com/adventures/${adventureSlug}`,
    },
    openGraph: {
      title: `${adventure.name} — Guided Adventure in Aspen | Rich Valley Adventures`,
      description: publicDescription,
      type: 'website',
      url: `https://www.richvalleyadventures.com/adventures/${adventureSlug}`,
      images: [
        {
          url: isRental ? PADDLE_OG_IMAGE : visual.src,
          width: 1200,
          height: 630,
          alt:
            visual.alt ||
            (isRental
              ? PADDLE_PHOTO_ALT
              : `${adventure.name} with Rich Valley Adventures in Aspen, Colorado`),
        },
      ],
    },
  }
}

export default async function AdventureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const adventure = await getAdventure(slug)

  if (!adventure || isPaddleTourListing(adventure)) {
    return (
      <div className="min-h-screen bg-rva-cream font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl text-rva-forest font-bold mb-4">
            Adventure Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find that adventure. Check out all of our offerings below.
          </p>
          <RvaButton href="/adventures" size="lg">View All Adventures</RvaButton>
        </div>
      </div>
    )
  }

  const relatedAdventures = await getRelatedAdventures(adventure.id)
  const visual = adventurePublicImage(adventure)
  const publicDescription = adventurePublicDescription(adventure)
  const longDescription =
    publicDescription === FLY_FISHING_PUBLIC_DESCRIPTION ||
    publicDescription === TRAIL_HIKING_PUBLIC_DESCRIPTION
      ? publicDescription
      : adventure.long_description || adventure.description
  const whatsIncluded = Array.isArray(adventure.whats_included) ? adventure.whats_included : []
  const highlights = Array.isArray(adventure.highlights) ? adventure.highlights : []
  const groupSize = (adventure.group_size || '').trim()

  const facts = [
    adventure.duration ? { label: 'Duration', value: adventure.duration } : null,
    adventure.difficulty ? { label: 'Level', value: adventure.difficulty } : null,
    groupSize ? { label: 'Group size', value: groupSize } : null,
    adventure.season ? { label: 'Season', value: adventure.season } : null,
    adventure.best_for ? { label: 'Best for', value: adventure.best_for } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null)

  const content: ServiceContent = {
    hero_title: adventure.name,
    hero_subtitle: publicDescription,
    intro: longDescription,
    lead: facts.length > 0 ? { paragraphs: [], facts } : undefined,
    features: whatsIncluded.filter(Boolean).map((item) => ({ title: item, description: '' })),
    h2_sections:
      highlights.length > 0 ? [{ title: 'Highlights', content: highlights.join('\n\n') }] : undefined,
    cta_text: 'Check availability',
  }

  const heroSrc = (visual.src || '').trim()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <ServicePageTemplate
        site="rva"
        title={adventure.name}
        content={content}
        heroImage={heroSrc || undefined}
        heroImageAlt={visual.alt || `${adventure.name} with Rich Valley Adventures in Aspen, Colorado`}
        heroObjectPosition={visual.objectPosition}
        bookingHref="/contact"
      />
      {relatedAdventures.length > 0 && (
        <section className="bg-rva-cream px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl text-rva-forest font-semibold mb-6">More Adventures</h2>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {relatedAdventures.map((related) => {
                const relatedVisual = adventurePublicImage(related)
                return (
                  <AdventureCard
                    key={related.id}
                    href={adventurePublicHref(related)}
                    title={related.name}
                    image={relatedVisual.src}
                    imageAlt={relatedVisual.alt || (relatedVisual.src.endsWith('/paddle-boarding.jpg') ? PADDLE_PHOTO_ALT : related.name)}
                    objectPosition={relatedVisual.objectPosition}
                    duration={related.duration}
                    level={related.difficulty}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
