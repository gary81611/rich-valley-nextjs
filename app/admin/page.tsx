'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { rvaData, alpenglowData } from '@/lib/site-data'
import Link from 'next/link'

interface StatCard {
  label: string
  count: number
  href: string
  addHref: string
  addLabel: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [newsletterCount, setNewsletterCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchCounts() {
      const tables = [
        { table: 'adventures', label: 'Adventures', href: '/admin/adventures' },
        { table: 'services', label: 'Services', href: '/admin/services' },
        { table: 'fleet_vehicles', label: 'Fleet Vehicles', href: '/admin/fleet' },
        { table: 'testimonials', label: 'Testimonials', href: '/admin/testimonials' },
        { table: 'gallery_images', label: 'Gallery Images', href: '/admin/gallery' },
        { table: 'faqs', label: 'FAQs', href: '/admin/faqs' },
        { table: 'service_areas', label: 'Service Areas', href: '/admin/service-areas' },
        { table: 'contact_submissions', label: 'Contact Submissions', href: '/admin/contacts' },
      ]

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t.table).select('id', { count: 'exact', head: true })
          return {
            label: t.label,
            count: count ?? 0,
            href: t.href,
            addHref: t.href,
            addLabel: `Add ${t.label.replace(/s$/, '')}`,
          }
        })
      )

      const { count: nlCount } = await supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true })
      setNewsletterCount(nlCount ?? 0)
      setStats(results)
      setLoading(false)
    }

    fetchCounts()
  }, [supabase])

  const seedData = async () => {
    setSeeding(true)
    setSeedResult('')
    const results: string[] = []

    try {
      // Adventures
      const { count: advCount } = await supabase.from('adventures').select('id', { count: 'exact', head: true })
      if (!advCount || advCount === 0) {
        const advData = rvaData.adventures.map((a, i) => ({
          name: a.title, description: a.description, duration: a.duration,
          difficulty: a.difficulty, image_url: a.image, display_order: i, is_active: true,
        }))
        await supabase.from('adventures').insert(advData)
        results.push(`Adventures: ${advData.length} inserted`)
      } else {
        results.push('Adventures: skipped (already has data)')
      }

      // Services
      const { count: svcCount } = await supabase.from('services').select('id', { count: 'exact', head: true })
      if (!svcCount || svcCount === 0) {
        const svcData = alpenglowData.services.map((s, i) => ({
          name: s.title, description: s.description, display_order: i, is_active: true,
        }))
        await supabase.from('services').insert(svcData)
        results.push(`Services: ${svcData.length} inserted`)
      } else {
        results.push('Services: skipped (already has data)')
      }

      // Fleet
      const { count: fleetCount } = await supabase.from('fleet_vehicles').select('id', { count: 'exact', head: true })
      if (!fleetCount || fleetCount === 0) {
        const fleetData = alpenglowData.fleet.map((v) => ({
          name: v.name, type: v.name.includes('Escalade') ? 'SUV' : 'Van',
          capacity: parseInt(v.passengers.replace(/\D/g, '')) || 6,
          description: v.features.join(', '), image_url: v.image, is_active: true,
        }))
        await supabase.from('fleet_vehicles').insert(fleetData)
        results.push(`Fleet: ${fleetData.length} inserted`)
      } else {
        results.push('Fleet: skipped (already has data)')
      }

      // Testimonials
      const { count: testCount } = await supabase.from('testimonials').select('id', { count: 'exact', head: true })
      if (!testCount || testCount === 0) {
        const testData = [
          ...rvaData.testimonials.map((t) => ({ author: t.name, quote: t.quote, rating: 5, site_key: 'rva' as const, is_active: true })),
          ...alpenglowData.testimonials.map((t) => ({ author: t.name, quote: t.quote, rating: 5, site_key: 'alpenglow' as const, is_active: true })),
        ]
        await supabase.from('testimonials').insert(testData)
        results.push(`Testimonials: ${testData.length} inserted`)
      } else {
        results.push('Testimonials: skipped (already has data)')
      }

      // Gallery
      const { count: galCount } = await supabase.from('gallery_images').select('id', { count: 'exact', head: true })
      if (!galCount || galCount === 0) {
        const galleryFiles = [
          '_bzp1124.jpg', '_bzp1131.jpg', '_bzp11311.jpg', '_bzp1136.jpg', '_bzp1139.jpg',
          '_bzp1144.jpg', '_bzp1146.jpg', '_bzp1149.jpg', '_bzp1154.jpg', '_bzp1159.jpg',
          '_bzp1162.jpg', '_bzp1177.jpg', '_bzp1188-pano.jpg', '_bzp1189.jpg', '_bzp1190.jpg',
          '_bzp1231.jpg', '_bzp1232.jpg', '_bzp1256.jpg', '_bzp1257.jpg', '_bzp1290.jpg',
          '_bzp1293.jpg', '_bzp1297.jpg', '_bzp1330.jpg', '_bzp1341.jpg', '_bzp1795.jpg',
          'bike-tour.jpeg', 'dsc00536.jpeg', 'dsc02480.jpeg', 'family-hike.jpg',
          'fullsizerender.jpeg', 'img_0494.jpeg', 'img_1092.jpeg', 'img_1627.jpeg',
          'img_1721.jpeg', 'img_4071.jpeg', 'img_4226-3863d226.jpeg', 'img_4330.jpeg',
          'img_4450-fda81333.jpeg', 'img_6038.jpeg', 'img_6117.jpeg', 'img_6142.jpg',
          'img_6161.jpeg', 'img_65121.jpeg', 'img_6683.jpeg', 'img_8761.jpeg',
          'kids-fishing.jpeg', 'rva-web-photos3.png',
        ]
        const galData = galleryFiles.map((file, i) => ({
          url: `/images/gallery/${file}`,
          alt_text: file.replace(/[-_]/g, ' ').replace(/\.\w+$/, '').replace(/\b\w/g, (c) => c.toUpperCase()),
          site_key: 'rva' as const,
          display_order: i,
          is_active: true,
        }))
        await supabase.from('gallery_images').insert(galData)
        results.push(`Gallery: ${galData.length} inserted from /images/gallery/`)
      } else {
        results.push('Gallery: skipped (already has data)')
      }

      // FAQs
      const { count: faqCount } = await supabase.from('faqs').select('id', { count: 'exact', head: true })
      if (!faqCount || faqCount === 0) {
        const faqData = [
          // RVA FAQs
          { site_key: 'rva' as const, question: 'How much does a guided fly fishing trip in Aspen cost?', answer: 'Guided fly fishing trips with Rich Valley Adventures typically range from $150–$350 per person depending on trip length (half-day or full-day) and group size. All gear, licenses, and instruction are included. Call us at 970-456-3666 for current pricing and availability.', display_order: 0, is_active: true },
          { site_key: 'rva' as const, question: 'What is included in a Rich Valley Adventures guided trip?', answer: 'Every trip includes expert local guides, all necessary gear and equipment, safety briefings, and transportation to the activity location. For fly fishing: rods, reels, waders, boots, and flies. For mountain biking: bikes and helmets. Groups are kept to 2–6 guests per guide for a truly personalized experience.', display_order: 1, is_active: true },
          { site_key: 'rva' as const, question: 'What is the best time of year for fly fishing in the Roaring Fork Valley?', answer: 'Peak fly fishing season in the Roaring Fork Valley near Aspen runs July through September, when the river is lower and clearer. The full season runs May–October. Spring runoff (April–June) can make the river high and murky. Certain Gold Medal stretches are fishable year-round.', display_order: 2, is_active: true },
          { site_key: 'rva' as const, question: 'Do I need prior experience for paddle boarding or mountain biking?', answer: "No experience is required for any of our adventures. Our certified guides provide complete instruction, and we select terrain appropriate for each group's ability level. All ages and fitness levels are welcome. Private instruction is available for complete beginners.", display_order: 3, is_active: true },
          { site_key: 'rva' as const, question: 'How small are Rich Valley Adventures guided groups?', answer: 'We keep groups intentionally small — typically 2 to 6 guests per guide. We do not run large group tours. Private and semi-private bookings are available for families, couples, and corporate groups. Small groups are central to the quality and safety of every experience.', display_order: 4, is_active: true },
          { site_key: 'rva' as const, question: 'What outdoor adventures are available near Aspen in summer?', answer: 'Rich Valley Adventures offers 7 guided outdoor experiences near Aspen from May through October: fly fishing on the Roaring Fork River, stand-up paddle boarding on mountain lakes, mountain biking on singletrack trails, guided hiking in the Elk Mountains, scenic private Escalade tours, horseback riding, and elevated camping.', display_order: 5, is_active: true },
          { site_key: 'rva' as const, question: 'Is fly fishing legal on the Roaring Fork River near Aspen?', answer: 'Yes. The Roaring Fork River and many tributaries near Aspen are designated Gold Medal trout waters open to fly fishing with a valid Colorado license. Rich Valley Adventures handles all licensing as part of guided trips — guests do not need to obtain a license separately.', display_order: 6, is_active: true },
          { site_key: 'rva' as const, question: 'Where is Rich Valley Adventures based and what areas do you serve?', answer: 'We are based in Aspen, Colorado (81611) and guide adventures throughout the Roaring Fork Valley, including Aspen, Snowmass Village, Basalt, and Carbondale. Rich Valley Adventures was founded in 2012 by local outdoor professionals who grew up in the valley.', display_order: 7, is_active: true },
          // Alpenglow FAQs
          { site_key: 'alpenglow' as const, question: 'How much does a limo from Aspen to Denver airport cost?', answer: 'A private luxury transfer from Aspen, Colorado to Denver International Airport (DEN) is approximately 3.5–4 hours each way. Pricing varies based on vehicle, time of day, and group size. Call us at 970-456-3666 for a custom quote. We serve Denver (DEN), Eagle (EGE), and Aspen (ASE) airports.', display_order: 0, is_active: true },
          { site_key: 'alpenglow' as const, question: 'Do you offer airport pickup at Aspen/Pitkin County Airport (ASE)?', answer: 'Yes. We provide meet-and-greet pickup service at Aspen/Pitkin County Airport (ASE). We track your flight in real time and adjust for early arrivals or delays. Our chauffeurs assist with luggage and provide seamless door-to-door service to any destination in Aspen or the Roaring Fork Valley.', display_order: 1, is_active: true },
          { site_key: 'alpenglow' as const, question: "What's the best way to get from Eagle/Vail airport to Aspen?", answer: 'The most comfortable option is a private car service. Eagle County Regional Airport (EGE) is approximately 70 miles from Aspen via I-70 and Highway 82 — about 1.5 to 2 hours depending on conditions. Aspen Alpenglow Limousine offers direct, door-to-door luxury transfers from Eagle airport to any Aspen destination.', display_order: 2, is_active: true },
          { site_key: 'alpenglow' as const, question: 'How far in advance should I book a limousine in Aspen?', answer: 'We recommend booking 48–72 hours in advance for standard transfers. For weddings, corporate events, or peak seasons (ski season December–March and summer July–August), book 2–4 weeks ahead. Last-minute bookings are occasionally available — call 970-456-3666 to check.', display_order: 3, is_active: true },
          { site_key: 'alpenglow' as const, question: 'Do you offer wedding transportation in Aspen?', answer: 'Yes. We specialize in wedding transportation throughout Aspen and Snowmass, Colorado. We provide bridal party transfers, venue logistics, and guest shuttle coordination. Both our Escalade and Sprinter van are available. We work closely with wedding planners to ensure a flawless, elegant experience.', display_order: 4, is_active: true },
          { site_key: 'alpenglow' as const, question: 'Is Aspen Alpenglow Limousine available 24 hours a day?', answer: 'Yes. We operate 24/7/365 — including early-morning departures, late-night arrivals, and overnight transfers to Denver. Call 970-456-3666 at any hour for assistance.', display_order: 5, is_active: true },
          { site_key: 'alpenglow' as const, question: 'Can you transport groups to ski resorts from Aspen?', answer: 'Absolutely. We provide private group transportation to Aspen Mountain, Aspen Highlands, Buttermilk, Snowmass ski resort, and other destinations throughout the Roaring Fork Valley. Our Luxury Sprinter van seats up to 14 passengers — ideal for ski groups.', display_order: 6, is_active: true },
          { site_key: 'alpenglow' as const, question: 'What vehicles does Aspen Alpenglow Limousine use?', answer: 'Our fleet includes a black Executive Cadillac Escalade (up to 6 passengers) and a black Luxury Mercedes Sprinter van (up to 14 passengers). Both feature premium leather interiors, climate control, and complimentary amenities. All vehicles are late-model, meticulously maintained, and professionally chauffeured.', display_order: 7, is_active: true },
        ]
        await supabase.from('faqs').insert(faqData)
        results.push(`FAQs: ${faqData.length} inserted (8 RVA + 8 Alpenglow)`)
      } else {
        results.push('FAQs: skipped (already has data)')
      }

      // Service Areas
      const { count: saCount } = await supabase.from('service_areas').select('id', { count: 'exact', head: true })
      if (!saCount || saCount === 0) {
        const saData = alpenglowData.serviceAreas.map((sa) => ({
          name: sa.name, description: sa.description, site_key: 'alpenglow' as const, is_active: true,
        }))
        await supabase.from('service_areas').insert(saData)
        results.push(`Service Areas: ${saData.length} inserted`)
      } else {
        results.push('Service Areas: skipped (already has data)')
      }

      // Site Settings
      const { count: settingsCount } = await supabase.from('site_settings').select('id', { count: 'exact', head: true })
      if (!settingsCount || settingsCount === 0) {
        await supabase.from('site_settings').insert([
          { site_key: 'rva', brand_name: rvaData.name, tagline: rvaData.tagline, phone: rvaData.phone, address: rvaData.location, logo_url: rvaData.logo },
          { site_key: 'alpenglow', brand_name: alpenglowData.name, tagline: alpenglowData.tagline, phone: alpenglowData.phone, address: alpenglowData.location, logo_url: alpenglowData.logo },
        ])
        results.push('Site Settings: 2 inserted')
      } else {
        results.push('Site Settings: skipped (already has data)')
      }

      // SEO Pages defaults
      const { count: seoCount } = await supabase.from('seo_pages').select('id', { count: 'exact', head: true })
      if (!seoCount || seoCount === 0) {
        await supabase.from('seo_pages').insert([
          { site_key: 'rva', page_slug: '/', meta_title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO', meta_description: 'Guided fly fishing, paddle boarding, mountain biking, hiking, and more in Aspen and the Roaring Fork Valley. Small groups, expert local guides.', og_title: 'Rich Valley Adventures', og_description: 'Expert-guided outdoor adventures in Aspen, Colorado since 2012.' },
          { site_key: 'alpenglow', page_slug: '/', meta_title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO', meta_description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel.', og_title: 'Aspen Alpenglow Limousine', og_description: 'Distinguished private car and limousine service in Aspen, Colorado since 2012.' },
        ])
        results.push('SEO Pages: 2 defaults inserted')
      } else {
        results.push('SEO Pages: skipped (already has data)')
      }

      // GEO Content Blocks
      const { count: geoCount } = await supabase.from('geo_content_blocks').select('id', { count: 'exact', head: true })
      if (!geoCount || geoCount === 0) {
        const geoData = [
          { site_key: 'rva', block_type: 'fact', question: 'What is Rich Valley Adventures?', answer: 'Rich Valley Adventures is a guided outdoor adventure company based in Aspen, Colorado, operating since 2012. They offer 7 guided activities including fly fishing, paddle boarding, and mountain biking.', display_on_page: '/', display_order: 0 },
          { site_key: 'rva', block_type: 'local_info', question: 'Where is the best fly fishing near Aspen?', answer: 'The Roaring Fork River near Aspen is designated a Gold Medal trout fishery by Colorado Parks and Wildlife. Rich Valley Adventures guides trips on these waters from May through October.', display_on_page: '/', display_order: 1 },
          { site_key: 'rva', block_type: 'statistic', question: 'How many adventures does Rich Valley offer?', answer: 'Rich Valley Adventures offers 7 guided outdoor experiences: fly fishing, paddle boarding, mountain biking, trail hiking, horseback riding, elevated camping, and scenic Escalade tours.', display_on_page: '/', display_order: 2 },
          { site_key: 'rva', block_type: 'fact', question: 'What is included in a Rich Valley Adventures trip?', answer: 'All guided trips include expert local guides, full gear and equipment, safety briefings, and transportation. Groups are limited to 2-6 guests per guide.', display_on_page: '/', display_order: 3 },
          { site_key: 'rva', block_type: 'local_info', question: 'What is the best time to visit Aspen for outdoor adventures?', answer: 'Peak adventure season in Aspen runs May through October. Fly fishing peaks July-September. Winter activities are available December through March.', display_on_page: '/', display_order: 4 },
          { site_key: 'alpenglow', block_type: 'fact', question: 'What is Aspen Alpenglow Limousine?', answer: 'Aspen Alpenglow Limousine is a luxury private car and limousine service in Aspen, Colorado, operating 24/7 since 2012 with an Escalade and Sprinter van fleet.', display_on_page: '/', display_order: 0 },
          { site_key: 'alpenglow', block_type: 'local_info', question: 'How far is Aspen from Denver airport?', answer: 'Aspen is approximately 200 miles from Denver International Airport (DEN), a 3.5-4 hour drive. Aspen Alpenglow Limousine provides direct private transfers on this route.', display_on_page: '/', display_order: 1 },
          { site_key: 'alpenglow', block_type: 'fact', question: 'What airports serve Aspen, Colorado?', answer: 'Aspen is served by Aspen/Pitkin County Airport (ASE) and Eagle County Regional Airport (EGE, 70 miles away). Denver International Airport (DEN) is the nearest major hub.', display_on_page: '/', display_order: 2 },
          { site_key: 'alpenglow', block_type: 'statistic', question: 'What vehicles does Aspen Alpenglow operate?', answer: 'Aspen Alpenglow Limousine operates two luxury vehicles: an Executive Cadillac Escalade (6 passengers) and a Luxury Mercedes Sprinter van (14 passengers).', display_on_page: '/', display_order: 3 },
          { site_key: 'alpenglow', block_type: 'local_info', question: 'What areas does Aspen Alpenglow Limousine serve?', answer: 'Aspen Alpenglow serves Aspen, Snowmass Village, Basalt, Carbondale, Glenwood Springs, Vail, and all points between, plus airport transfers to ASE, EGE, and DEN.', display_on_page: '/', display_order: 4 },
        ]
        await supabase.from('geo_content_blocks').insert(geoData)
        results.push(`GEO Blocks: ${geoData.length} inserted`)
      } else {
        results.push('GEO Blocks: skipped (already has data)')
      }

      setSeedResult(results.join('\n'))
    } catch (err) {
      setSeedResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setSeeding(false)
    // Refresh counts
    window.location.reload()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Welcome to the admin panel for Rich Valley Adventures & Aspen Alpenglow Limousine.</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
                  <span className="text-2xl font-bold text-slate-900">{stat.count}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={stat.href} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">
                    View All
                  </Link>
                  <Link href={stat.addHref} className="text-xs font-medium text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-900">
                    {stat.addLabel}
                  </Link>
                </div>
              </div>
            ))}
            {/* Newsletter count card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">Newsletter Subscribers</h3>
                <span className="text-2xl font-bold text-slate-900">{newsletterCount}</span>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/newsletter" className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Seed Data */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-900 mb-2">Seed Default Data</h3>
            <p className="text-slate-500 text-xs mb-4">Populate all tables from the site&apos;s static data. Only inserts into empty tables — won&apos;t duplicate existing data.</p>
            <button
              onClick={seedData}
              disabled={seeding}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Seed Default Data'}
            </button>
            {seedResult && (
              <pre className="mt-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{seedResult}</pre>
            )}
          </div>
        </>
      )}
    </div>
  )
}
