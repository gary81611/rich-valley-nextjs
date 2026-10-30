'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PADDLE_PHOTO, PADDLE_PHOTO_ALT, type PublicAdventureCard } from '@/lib/rva-adventure-public'
import { RVA_GLOBAL_PILLAR_BLOG_LINKS } from '@/lib/rva-blog-pillars'
import AdventureCard from '@/components/rva/AdventureCard'
import RvaButton, { RVA_BOOKING_LABEL, RVA_PHONE_LABEL, RVA_PHONE_HREF } from '@/components/rva/Button'
import { RVA_PRICE_LINES } from '@/lib/rva-confirmed'

type Season = 'all' | 'summer' | 'winter' | 'year-round'

const seasonTabs: { label: string; value: Season }[] = [
  { label: 'All', value: 'all' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' },
  { label: 'Year-Round', value: 'year-round' },
]

export default function AdventuresListing({ adventures }: { adventures: PublicAdventureCard[] }) {
  const [activeSeason, setActiveSeason] = useState<Season>('all')

  const filtered =
    activeSeason === 'all'
      ? adventures
      : adventures.filter((a) => a.season === activeSeason)

  return (
    <div className="min-h-screen overflow-x-clip bg-rva-cream font-inter">
      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">Adventures</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            What We Offer
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Our Adventures
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            Guided days on the water and in the mountains.
            Corporate packages are for groups of 50 or more: a custom mix of fishing and hiking.
            Book at least 2 days in advance. A 50% deposit is due at booking. Cancellations within 72 hours are billed in full.
          </p>
          <p className="text-white/70 text-sm max-w-2xl mx-auto mt-3">{RVA_PRICE_LINES.join(' · ')}</p>
        </div>
      </section>

      <section className="overflow-x-clip border-b border-rva-cream-dark bg-white py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-rva-forest/85 sm:px-6">
          <span className="font-semibold text-rva-forest">Planning guides: </span>
          {RVA_GLOBAL_PILLAR_BLOG_LINKS.map((l, i) => (
            <span key={l.href}>
              {i > 0 ? ' · ' : null}
              <Link href={l.href} className="text-rva-copper-700 font-medium hover:underline">
                {i === 0 ? 'Fly fishing' : i === 1 ? 'Hiking' : 'Families'}
              </Link>
            </span>
          ))}
          <span className="hidden sm:inline">
            {' · '}
            <Link href="/service-areas" className="text-rva-copper-700 font-medium hover:underline">
              Where we guide
            </Link>
            {' · '}
            <Link href="/contact" className="text-rva-copper-700 font-medium hover:underline">
              Book
            </Link>
          </span>
        </div>
      </section>

      {/* Season Tabs */}
      <section className="py-8 bg-rva-cream border-b border-rva-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex max-w-full flex-wrap justify-center gap-2">
            {seasonTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveSeason(tab.value)}
                className={`min-h-11 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors ${
                  activeSeason === tab.value
                    ? 'bg-rva-copper-700 text-white'
                    : 'bg-white text-rva-forest border border-rva-forest/15 hover:border-rva-copper-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Adventures Grid */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-rva-forest">
                {activeSeason === 'all'
                  ? 'No adventures are listed yet. Call 970-456-3666 and we will help you plan.'
                  : 'No adventures are listed for this season. Choose All, or call 970-456-3666.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filtered.map((adventure) => (
                <AdventureCard
                  key={adventure.slug}
                  href={adventure.href}
                  title={adventure.title}
                  image={adventure.image}
                  imageAlt={
                    adventure.imageAlt ||
                    (adventure.image === PADDLE_PHOTO
                      ? PADDLE_PHOTO_ALT
                      : `${adventure.title} — guided adventure in Aspen and the Roaring Fork Valley`)
                  }
                  objectPosition={adventure.objectPosition}
                  // Same as home #18: no duration badge or level meta on adventure cards.
                  duration=""
                  level=""
                  excerpt={adventure.description}
                  priceNote={adventure.fromText}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Not Sure Which Adventure Is Right?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Give us a call and we&apos;ll help you plan the perfect trip based on your group, skill
            level, and interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RvaButton href="/contact" size="lg" tone="on-dark">{RVA_BOOKING_LABEL}</RvaButton>
            <RvaButton href={RVA_PHONE_HREF} variant="secondary" size="lg" tone="on-dark">{RVA_PHONE_LABEL}</RvaButton>
          </div>
        </div>
      </section>
    </div>
  )
}
