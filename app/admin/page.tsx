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
        const galData = rvaData.gallery.map((url, i) => ({
          url, alt_text: `Adventure photo ${i + 1}`, site_key: 'rva' as const, display_order: i, is_active: true,
        }))
        await supabase.from('gallery_images').insert(galData)
        results.push(`Gallery: ${galData.length} inserted`)
      } else {
        results.push('Gallery: skipped (already has data)')
      }

      // FAQs
      const { count: faqCount } = await supabase.from('faqs').select('id', { count: 'exact', head: true })
      if (!faqCount || faqCount === 0) {
        results.push('FAQs: skipped (use page-level FAQs)')
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
