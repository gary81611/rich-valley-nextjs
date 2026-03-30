import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Guides | Rich Valley Adventures — Expert Local Guides in Aspen',
  description: 'Meet the Rich Valley Adventures guide team. First Aid certified experts in fly fishing, hunting, hiking, and outdoor adventures in the Roaring Fork Valley.',
  alternates: { canonical: 'https://www.richvalleyadventures.com/rva/guides' },
}

const GUIDES = [
  { slug: 'kit-mclendon', name: 'Kit McLendon', title: 'Lead Fly Fishing Guide', specialties: ['Hatch reports', 'Fly recommendations', 'Water clarity', 'River observations', 'Trail information'], icon: '🎣' },
  { slug: 'bart-chandler', name: 'Bart Chandler', title: 'Shooting Guide', specialties: ['Sporting clay instruction', 'Shotgun clinics', 'Safety training'], icon: '🎯' },
  { slug: 'bobby-regan', name: 'Bobby Regan', title: 'Kids Fishing Specialist', specialties: ['Youth fly fishing', 'Family adventures', 'Patient instruction', 'Fun-focused guiding'], icon: '🐟' },
  { slug: 'alex-macintyre', name: 'Alex Macintyre', title: 'Boat Captain', specialties: ['Float trips', 'River navigation', 'Multi-day expeditions'], icon: '🚣' },
  { slug: 'jason-fagre', name: 'Jason Fagre', title: 'Chef & Hunting Guide', specialties: ['Field-to-table dining', 'Elk hunting', 'Backcountry cooking', 'Wilderness survival'], icon: '🏔' },
  { slug: 'john-mudrey', name: 'John Mudrey', title: 'Dry Fly Specialist & Nymphing Connoisseur', specialties: ['Dry fly technique', 'Nymphing mastery', 'Technical water', 'Advanced instruction'], icon: '🪰' },
]

export default function GuidesPage() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDES.map(g => (
            <div key={g.slug} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Placeholder photo area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-rva-forest/10 to-rva-copper/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl mb-2">{g.icon}</p>
                  <p className="text-xs text-rva-forest/40 uppercase tracking-wider">Photo Coming Soon</p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-playfair text-xl font-semibold text-rva-forest-dark mb-1">{g.name}</h2>
                <p className="text-sm text-rva-copper font-medium mb-3">{g.title}</p>
                <p className="text-xs text-rva-forest/40 mb-3">✓ First Aid Certified</p>
                <div className="flex flex-wrap gap-1">
                  {g.specialties.map(s => (
                    <span key={s} className="text-xs bg-rva-copper/10 text-rva-copper px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-rva-forest/60 mb-6">All transportation provided by <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper hover:underline">Aspen Alpenglow Limousine</a></p>
          <Link href="/rva/contact" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Book an Adventure — 970-456-3666
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        GUIDES.map(g => ({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: g.name,
          jobTitle: g.title,
          worksFor: { '@type': 'Organization', name: 'Rich Valley Adventures', url: 'https://www.richvalleyadventures.com' },
          hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'First Aid Certification' },
        }))
      )}} />
    </div>
  )
}
