import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Guides | Rich Valley Adventures — Expert Local Guides in Aspen',
  description:
    'Meet the Rich Valley Adventures guide team. First Aid certified experts in fly fishing, hunting, hiking, and outdoor adventures in the Roaring Fork Valley.',
  alternates: { canonical: 'https://www.richvalleyadventures.com/rva/guides' },
}

type GuideRow = {
  id: string
  name: string
  title: string
  specialties: string[] | null
  certifications: string[] | null
  bio: string | null
  photo_url: string | null
  display_order: number
  is_active: boolean
}

async function getGuides(): Promise<GuideRow[]> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`
  try {
    const res = await fetch(`${origin}/api/guides`, { next: { revalidate: 120 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.guides as GuideRow[]) || []
  } catch {
    return []
  }
}

export default async function GuidesPage() {
  const guides = await getGuides()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-rva-copper text-sm font-semibold uppercase tracking-[0.2em] mb-3">Our Team</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">Meet Your Guides</h1>
          <p className="text-white/60">First Aid certified. Local experts. Passionate about the outdoors.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {guides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-rva-forest/60 text-lg">Our guide profiles are being updated. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((g) => (
              <div key={g.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {g.photo_url ? (
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={g.photo_url}
                      alt={g.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-rva-forest/10 to-rva-copper/10 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl font-playfair text-rva-forest/30 mb-2">{g.name.charAt(0)}</p>
                      <p className="text-xs text-rva-forest/40 uppercase tracking-wider">Photo Coming Soon</p>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-playfair text-xl font-semibold text-rva-forest-dark mb-1">{g.name}</h2>
                  <p className="text-sm text-rva-copper font-medium mb-3">{g.title}</p>
                  {g.certifications && g.certifications.length > 0 && (
                    <p className="text-xs text-rva-forest/50 mb-3">{g.certifications.join(' · ')}</p>
                  )}
                  {g.bio && <p className="text-sm text-rva-forest/70 leading-relaxed mb-3">{g.bio}</p>}
                  <div className="flex flex-wrap gap-1">
                    {(g.specialties || []).map((s) => (
                      <span key={s} className="text-xs bg-rva-copper/10 text-rva-copper px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-rva-forest/60 mb-6">
            All transportation provided by{' '}
            <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper hover:underline">
              Aspen Alpenglow Limousine
            </a>
          </p>
          <Link href="/rva/contact" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Book an Adventure — 970-456-3666
          </Link>
        </div>
      </div>

      {guides.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              guides.map((g) => ({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: g.name,
                jobTitle: g.title,
                worksFor: { '@type': 'Organization', name: 'Rich Valley Adventures', url: 'https://www.richvalleyadventures.com' },
                hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'First Aid Certification' },
              })),
            ),
          }}
        />
      )}
    </div>
  )
}
