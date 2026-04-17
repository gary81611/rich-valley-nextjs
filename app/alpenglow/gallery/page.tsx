import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { alpenglowData } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Photo Gallery | Aspen Alpenglow Limousine Fleet & Valley',
  description:
    'Photos of our Aspen limo fleet — Chevy Suburbans, Ford Transit Van, ski racks & interiors — plus Colorado landscapes we serve across the Roaring Fork Valley.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/gallery' },
}

async function fetchGalleryImages() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('site_key', 'alpenglow')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch gallery images:', error)
    return []
  }

  return (data ?? []).map((img) => ({
    src: img.image_url || img.path || img.src,
    alt: img.alt ?? '',
  }))
}

export default async function GalleryPage() {
  const galleryImages = await fetchGalleryImages()

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Gallery</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Photo <span className="text-alp-gold">Gallery</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Our fleet, our destinations, and the stunning Colorado landscapes we call home.
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {galleryImages.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-alp-navy-deep/50 text-lg">No gallery images available at this time.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((img, i) => {
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
                        src={img.src}
                        alt={
                          img.alt?.trim()
                            ? `${img.alt} — Aspen Alpenglow Limousine luxury transportation gallery`
                            : `Aspen Alpenglow Limousine fleet or Colorado destination photo ${i + 1}`
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-alp-navy-deep/0 group-hover:bg-alp-navy-deep/30 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-alp-navy-deep/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm">{img.alt}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Ready to <span className="text-alp-gold">Ride in Style</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Book your luxury transportation and experience the Roaring Fork Valley in comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={alpenglowData.onlineReservationsPath}
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book a Ride
            </Link>
            <a
              href="tel:+19704563666"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
