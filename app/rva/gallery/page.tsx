'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { GalleryImage } from '@/lib/types'

interface GalleryItem {
  url: string
  alt: string
  caption: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([])

  useEffect(() => {
    async function fetchGallery() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('is_active', true)
          .eq('site_key', 'rva')
          .order('display_order')

        if (data && data.length > 0) {
          setImages(
            data.map((g: GalleryImage) => ({
              url: g.url,
              alt: g.alt_text || 'Rich Valley Adventures gallery image',
              caption: g.caption || '',
            }))
          )
        }
      } catch {
        // Use static fallback
      }
    }
    fetchGallery()
  }, [])

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
            <span className="text-rva-copper-light">Gallery</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            The Valley in Pictures
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">Gallery</h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            Moments from the trail, the river, and the mountains — captured by our guides and guests.
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, i) => {
              // Vary aspect ratios for masonry effect
              const aspectClass =
                i % 5 === 0
                  ? 'aspect-[3/4]'
                  : i % 5 === 1
                    ? 'aspect-square'
                    : i % 5 === 2
                      ? 'aspect-[4/3]'
                      : i % 5 === 3
                        ? 'aspect-[3/2]'
                        : 'aspect-[4/5]'

              return (
                <div
                  key={i}
                  className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`relative ${aspectClass}`}>
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-rva-forest-dark/0 group-hover:bg-rva-forest-dark/30 transition-colors duration-300" />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rva-forest-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm">{img.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Ready to Make Your Own Memories?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Book an adventure and we&apos;ll capture the moments for you.
          </p>
          <Link
            href="/contact"
            className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
          >
            Book an Adventure
          </Link>
        </div>
      </section>
    </div>
  )
}
