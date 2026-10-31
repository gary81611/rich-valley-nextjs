import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { serviceMatchesPathSlug } from '@/lib/alpenglow-services'
import { alpenglowData } from '@/lib/site-data'
import { correctAalPublicText } from '@/lib/aal-public-copy'
import VehicleCard from '@/components/alpenglow/VehicleCard'
import { AAL_OG_IMAGE, AAL_VEHICLES } from '@/lib/aal-vehicles'

export const dynamic = 'force-dynamic'

type ServiceRow = {
  id: string
  slug: string | null
  name: string
  description: string
  long_description?: string | null
  features: string[] | unknown
  icon: string
}

async function getServiceByPathSlug(pathSlug: string): Promise<ServiceRow | null> {
  const supabase = await createServerSupabaseClient()

  const { data: direct } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('slug', pathSlug)
    .maybeSingle()

  if (direct) return direct as ServiceRow

  const { data: rows } = await supabase.from('services').select('*').eq('is_active', true)

  if (!rows?.length) return null
  const match = rows.find((r) => serviceMatchesPathSlug(r as ServiceRow, pathSlug))
  return (match as ServiceRow) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceByPathSlug(slug)
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.name} in Aspen, CO | Aspen Alpenglow Limousine`,
    description: correctAalPublicText(service.description),
    alternates: { canonical: `https://aspenalpenglowlimousine.com/services/${slug}` },
    openGraph: {
      title: `${service.name} in Aspen, CO | Aspen Alpenglow Limousine`,
      description: correctAalPublicText(service.description),
      url: `https://aspenalpenglowlimousine.com/services/${slug}`,
      type: 'website',
      images: [AAL_OG_IMAGE],
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceByPathSlug(slug)

  if (!service) notFound()

  const displayTitle = correctAalPublicText(service.name)
  const bodyCopy = correctAalPublicText((service.long_description || service.description || '').trim())
  const features = (Array.isArray(service.features) ? (service.features as string[]) : []).map((feature) =>
    correctAalPublicText(feature),
  )
  const plainDescription = bodyCopy.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-alp-gold transition-colors">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{displayTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="aal-hero-photo bg-alp-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full pb-12">
          <h1 className="font-playfair font-bold mb-6">{displayTitle}</h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">{correctAalPublicText(service.description)}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={alpenglowData.onlineReservationsPath} className="inline-flex items-center justify-center bg-alp-gold text-alp-navy font-semibold px-6 py-3 rounded-full">Book online</Link>
            <Link href="/contact" className="inline-flex items-center justify-center border-2 border-alp-gold text-alp-gold font-semibold px-6 py-3 rounded-full">Request a quote</Link>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-6">About This Service</h2>
              <p className="text-alp-slate leading-relaxed text-lg mb-8">{bodyCopy}</p>
              {features.length > 0 && (
                <>
                  <h3 className="font-playfair text-xl font-bold text-alp-navy mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-alp-navy">
                        <svg className="w-5 h-5 text-alp-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Fleet Preview */}
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-alp-navy mb-4">Available Vehicles</h3>
              {AAL_VEHICLES.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} fillHeight={false} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Book <span className="text-alp-gold">{displayTitle}</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Ready to experience luxury transportation? Contact us today to reserve your ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={alpenglowData.onlineReservationsPath}
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book online
            </Link>
            <a
              href="tel:+19703156111"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-315-6111
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${displayTitle} in Aspen, Colorado`,
            serviceType: displayTitle,
            description: plainDescription || service.description,
            areaServed: [
              { '@type': 'City', name: 'Aspen' },
              { '@type': 'City', name: 'Snowmass Village' },
              { '@type': 'AdministrativeArea', name: 'Roaring Fork Valley' },
            ],
            provider: {
              '@type': 'LocalBusiness',
              name: 'Aspen Alpenglow Limousine',
              url: 'https://aspenalpenglowlimousine.com',
              telephone: '+19703156111',
            },
          }),
        }}
      />
    </div>
  )
}
