'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Adventure } from '@/lib/types'
import { isBookableAdventureName, slugFromAdventureName } from '@/lib/rva-adventure-filters'
import { RVA_GLOBAL_PILLAR_BLOG_LINKS } from '@/lib/rva-blog-pillars'

type Season = 'all' | 'summer' | 'winter' | 'year-round'

interface AdventureCard {
  title: string
  slug: string
  description: string
  image: string
  duration: string
  difficulty: string
  season: string
}

function toSlug(title: string): string {
  return slugFromAdventureName(title)
}

const seasonTabs: { label: string; value: Season }[] = [
  { label: 'All', value: 'all' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' },
  { label: 'Year-Round', value: 'year-round' },
]

export default function AdventuresPage() {
  const [adventures, setAdventures] = useState<AdventureCard[]>([])
  const [activeSeason, setActiveSeason] = useState<Season>('all')

  useEffect(() => {
    async function fetchAdventures() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('adventures')
          .select('*')
          .eq('is_active', true)
          .order('display_order')

        if (data && data.length > 0) {
          setAdventures(
            data
              .filter((a: Adventure) => isBookableAdventureName(a.name))
              .map((a: Adventure) => ({
                title: a.name,
                slug: toSlug(a.name),
                description: a.description,
                image: a.image_url || '/images/rva/flyfishing.png',
                duration: a.duration,
                difficulty: a.difficulty,
                season: a.season || 'summer',
              })),
          )
        }
      } catch {
        // Use static fallback
      }
    }
    fetchAdventures()
  }, [])

  const filtered =
    activeSeason === 'all'
      ? adventures
      : adventures.filter((a) => a.season === activeSeason)

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
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
            Seven ways to experience the Roaring Fork Valley — each one expertly guided, fully
            equipped, and unforgettable.
          </p>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-rva-cream-dark">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-rva-forest/85">
          <span className="font-semibold text-rva-forest">Planning guides: </span>
          {RVA_GLOBAL_PILLAR_BLOG_LINKS.map((l, i) => (
            <span key={l.href}>
              {i > 0 ? ' · ' : null}
              <Link href={l.href} className="text-rva-copper font-medium hover:underline">
                {i === 0 ? 'Fly fishing' : i === 1 ? 'Hiking' : 'Families'}
              </Link>
            </span>
          ))}
          <span className="hidden sm:inline">
            {' · '}
            <Link href="/service-areas" className="text-rva-copper font-medium hover:underline">
              Where we guide
            </Link>
            {' · '}
            <Link href="/contact" className="text-rva-copper font-medium hover:underline">
              Book
            </Link>
          </span>
        </div>
      </section>

      {/* Season Tabs */}
      <section className="py-8 bg-rva-cream border-b border-rva-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-3">
            {seasonTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveSeason(tab.value)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeSeason === tab.value
                    ? 'bg-rva-copper text-white shadow-md'
                    : 'bg-rva-cream-dark text-rva-forest hover:bg-rva-copper/10'
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
              <p className="text-gray-500 text-lg">
                No adventures found for this season. Check back soon or view all adventures.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((adventure) => (
                <Link
                  key={adventure.slug}
                  href={`/adventures/${adventure.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={adventure.image}
                        alt={`${adventure.title} — guided adventure in Aspen and the Roaring Fork Valley`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-rva-copper/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                          {adventure.duration}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">
                          {adventure.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-playfair text-2xl text-rva-forest font-semibold mb-3">
                        {adventure.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {adventure.description}
                      </p>
                      <span className="mt-5 text-rva-copper text-sm font-semibold group-hover:text-rva-copper-light transition-colors flex items-center gap-2">
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
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
          <Link
            href="/contact"
            className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
