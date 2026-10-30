import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import AdventureCard from '@/components/rva/AdventureCard'
import type { ServiceContent } from '@/lib/pages'
import {
  adventurePublicDuration,
  PADDLE_OG_IMAGE,
  PADDLE_PHOTO_ALT,
  PADDLE_RENTAL_ID,
  FLY_FISHING_PUBLIC_DESCRIPTION,
  TRAIL_HIKING_PUBLIC_DESCRIPTION,
  adventurePublicDescription,
  adventurePublicFromText,
  adventurePublicHref,
  adventurePublicImage,
  isPaddleTourListing,
  isPublicAdventureCard,
} from '@/lib/rva-adventure-public'
import {
  RVA_TRIP_OWNERSHIP,
  isScenicTourSlug,
  rvaPublicAdventureTitle,
} from '@/lib/rva-confirmed'

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
  return (
    adventures.find((a: AdventureRow) => {
      const rowSlug = slugify(a.name)
      if (rowSlug === slug) return true
      if (isScenicTourSlug(slug) && (isScenicTourSlug(rowSlug) || /escalade/i.test(a.name))) return true
      return false
    }) || null
  )
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
    notFound()
  }
  const adventureSlug = isScenicTourSlug(slugify(adventure.name)) ? 'scenic-wildlife-tours' : slugify(adventure.name)
  const displayName = rvaPublicAdventureTitle(adventure.name, adventureSlug)
  const isRental = adventure.id === PADDLE_RENTAL_ID || adventureSlug === 'paddle-board-rentals'
  const visual = adventurePublicImage(adventure)
  const publicDescription = adventurePublicDescription(adventure)
  return {
    title: `${displayName} | Rich Valley Adventures | Aspen, CO`,
    description: publicDescription,
    alternates: {
      canonical: `https://www.richvalleyadventures.com/adventures/${adventureSlug}`,
    },
    openGraph: {
      title: `${displayName} — Guided Adventure in Aspen | Rich Valley Adventures`,
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
              : `${displayName} with Rich Valley Adventures in Aspen, Colorado`),
        },
      ],
    },
  }
}

export default async function AdventureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const adventure = await getAdventure(slug)

  if (!adventure || isPaddleTourListing(adventure)) {
    notFound()
  }

  const relatedAdventures = await getRelatedAdventures(adventure.id)
  const visual = adventurePublicImage(adventure)
  const publicDescription = adventurePublicDescription(adventure)
  const adventureSlug = isScenicTourSlug(slugify(adventure.name)) ? 'scenic-wildlife-tours' : slugify(adventure.name)
  const displayName = rvaPublicAdventureTitle(adventure.name, adventureSlug)
  const longDescription =
    publicDescription === FLY_FISHING_PUBLIC_DESCRIPTION ||
    publicDescription === TRAIL_HIKING_PUBLIC_DESCRIPTION
      ? publicDescription
      : adventure.long_description || adventure.description
  const whatsIncluded = Array.isArray(adventure.whats_included) ? adventure.whats_included : []
  const highlights = Array.isArray(adventure.highlights) ? adventure.highlights : []
  const groupSize = (adventure.group_size || '').trim()

  const scenic = isScenicTourSlug(slug) || isScenicTourSlug(adventureSlug)
  const priceNote = adventurePublicFromText(adventure)
  const seasonValue = adventure.season
    ? adventure.season === 'year-round'
      ? 'Year-round'
      : adventure.season
    : scenic
      ? 'Year-round'
      : null
  const facts = [
    scenic
      ? { label: 'Duration', value: 'Half Day / Full Day' }
      : adventure.duration
        ? { label: 'Duration', value: adventure.duration }
        : null,
    scenic
      ? { label: 'Half-day scenic and wildlife tour', value: '$750' }
      : priceNote
        ? { label: 'Price', value: priceNote }
        : null,
    adventure.difficulty ? { label: 'Level', value: adventure.difficulty } : null,
    groupSize ? { label: 'Group size', value: groupSize } : null,
    seasonValue ? { label: 'Season', value: seasonValue } : null,
    adventure.best_for ? { label: 'Best for', value: adventure.best_for } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null)

  const content: ServiceContent = {
    hero_title: displayName,
    hero_subtitle: scenic ? '' : publicDescription,
    // Keep #15 scenic intro (publicDescription) after rebase onto main.
    intro: scenic
      ? publicDescription
      : /horse|snowmobile|atv|scenic|raft/i.test(`${adventureSlug} ${displayName}`)
        ? `${publicDescription}\n\n${RVA_TRIP_OWNERSHIP}`
        : longDescription,
    lead: facts.length > 0
      ? {
          paragraphs: [],
          facts,
          ...(scenic
            ? {
                links: [
                  { href: '/rafting', label: 'Scenic river rafting with picnic' },
                  { href: '/fly-fishing', label: 'Aspen fly fishing' },
                ],
              }
            : {}),
        }
      : undefined,
    features: whatsIncluded.filter(Boolean).map((item) => ({ title: item, description: '' })),
    h2_sections:
      highlights.length > 0 ? [{ title: 'Highlights', content: highlights.join('\n\n') }] : undefined,
    faqs: scenic
      ? [
          {
            question: 'How long are scenic and wildlife tours?',
            answer: 'Tours run Half Day / Full Day.',
          },
          {
            question: 'How much is a half-day scenic and wildlife tour?',
            answer: 'Half-day scenic and wildlife tour: $750.',
          },
        ]
      : undefined,
    cta_text: 'Check availability',
  }

  const heroSrc = (visual.src || '').trim()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <ServicePageTemplate
        site="rva"
        title={displayName}
        content={content}
        heroImage={heroSrc || undefined}
        heroImageAlt={visual.alt || `${displayName} with Rich Valley Adventures in Aspen, Colorado`}
        heroObjectPosition={scenic ? visual.objectPosition || 'center 18%' : visual.objectPosition}
        heroHeightClass={scenic ? 'h-[55vh] max-h-[55vh]' : undefined}
        bookingHref="/contact"
      />
      {relatedAdventures.length > 0 && (
        <section className="bg-rva-cream py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-playfair text-3xl text-rva-forest font-semibold mb-6">More Adventures</h2>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {relatedAdventures.map((related) => {
                const relatedVisual = adventurePublicImage(related)
                return (
                  <AdventureCard
                    key={related.id}
                    href={adventurePublicHref(related)}
                    title={rvaPublicAdventureTitle(related.name, slugify(related.name))}
                    image={relatedVisual.src}
                    imageAlt={
                      relatedVisual.alt ||
                      (relatedVisual.src.endsWith('/paddle-boarding.jpg')
                        ? PADDLE_PHOTO_ALT
                        : rvaPublicAdventureTitle(related.name, slugify(related.name)))
                    }
                    objectPosition={relatedVisual.objectPosition}
                    duration={adventurePublicDuration(related)}
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
