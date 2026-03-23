import { rvaData, alpenglowData, galleryImages, rvaFaqs, alpenglowFaqs } from '@/lib/site-data'
import { seedPages } from '@/lib/seed-pages'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function seedAllTables(supabase: SupabaseClient) {
  const results: string[] = []

  // Adventures
  const { count: advCount } = await supabase.from('adventures').select('id', { count: 'exact', head: true })
  if (!advCount || advCount === 0) {
    const advData = rvaData.adventures.map((a, i) => ({
      name: a.title, description: a.description, duration: a.duration,
      difficulty: a.difficulty, image_url: a.image, display_order: i, is_active: true, season: a.season,
    }))
    await supabase.from('adventures').insert(advData)
    results.push(`Adventures: ${advData.length} inserted`)
  }

  // Services
  const { count: svcCount } = await supabase.from('services').select('id', { count: 'exact', head: true })
  if (!svcCount || svcCount === 0) {
    const svcData = alpenglowData.services.map((s, i) => ({
      name: s.title, description: s.description, display_order: i, is_active: true,
    }))
    await supabase.from('services').insert(svcData)
    results.push(`Services: ${svcData.length} inserted`)
  }

  // Fleet
  const { count: fleetCount } = await supabase.from('fleet_vehicles').select('id', { count: 'exact', head: true })
  if (!fleetCount || fleetCount === 0) {
    const fleetData = alpenglowData.fleet.map((v) => ({
      name: v.name, type: v.name.includes('Escalade') ? 'Executive SUV' : 'Sprinter Van',
      capacity: parseInt(v.passengers.replace(/\D/g, '')) || 6,
      description: v.features.join(', '), image_url: v.image, is_active: true,
    }))
    await supabase.from('fleet_vehicles').insert(fleetData)
    results.push(`Fleet: ${fleetData.length} inserted`)
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
  }

  // Gallery
  const { count: galCount } = await supabase.from('gallery_images').select('id', { count: 'exact', head: true })
  if (!galCount || galCount === 0) {
    const galData = galleryImages.map((img, i) => ({
      url: img.path, alt_text: img.alt, site_key: 'rva' as const, display_order: i, is_active: true,
    }))
    await supabase.from('gallery_images').insert(galData)
    results.push(`Gallery: ${galData.length} inserted`)
  }

  // FAQs
  const { count: faqCount } = await supabase.from('faqs').select('id', { count: 'exact', head: true })
  if (!faqCount || faqCount === 0) {
    const faqData = [
      ...rvaFaqs.map((f, i) => ({ site_key: 'rva' as const, question: f.q, answer: f.a, display_order: i, is_active: true })),
      ...alpenglowFaqs.map((f, i) => ({ site_key: 'alpenglow' as const, question: f.q, answer: f.a, display_order: i, is_active: true })),
    ]
    await supabase.from('faqs').insert(faqData)
    results.push(`FAQs: ${faqData.length} inserted`)
  }

  // Service Areas
  const { count: saCount } = await supabase.from('service_areas').select('id', { count: 'exact', head: true })
  if (!saCount || saCount === 0) {
    const saData = alpenglowData.serviceAreas.map((sa) => ({
      name: sa.name, description: sa.description, site_key: 'alpenglow' as const, is_active: true,
    }))
    await supabase.from('service_areas').insert(saData)
    results.push(`Service Areas: ${saData.length} inserted`)
  }

  // Site Settings
  const { count: settingsCount } = await supabase.from('site_settings').select('id', { count: 'exact', head: true })
  if (!settingsCount || settingsCount === 0) {
    await supabase.from('site_settings').insert([
      {
        site_key: 'rva', brand_name: rvaData.name, tagline: rvaData.tagline, phone: rvaData.phone,
        email: rvaData.email, address: 'Aspen, Colorado 81611', logo_url: rvaData.logo,
        social_links: { Facebook: rvaData.social.facebook, Instagram: rvaData.social.instagram },
        colors: { primary: '#C17A3A', secondary: '#2D3B2D', accent: '#D4A96A', background: '#F5F0EB' },
      },
      {
        site_key: 'alpenglow', brand_name: alpenglowData.name, tagline: alpenglowData.tagline, phone: alpenglowData.phone,
        email: alpenglowData.email, address: 'Aspen, Colorado 81611', logo_url: alpenglowData.logo,
        social_links: { Facebook: alpenglowData.social.facebook, Instagram: alpenglowData.social.instagram },
        colors: { primary: '#1B2541', secondary: '#C8A96E', accent: '#2A3F6F', background: '#0F1729' },
      },
    ])
    results.push('Site Settings: 2 inserted')
  }

  // SEO Pages
  const { count: seoCount } = await supabase.from('seo_pages').select('id', { count: 'exact', head: true })
  if (!seoCount || seoCount === 0) {
    await supabase.from('seo_pages').insert([
      { site_key: 'rva', page_slug: '/', meta_title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO', meta_description: 'Guided fly fishing, paddle boarding, mountain biking, hiking, and more in Aspen and the Roaring Fork Valley. Small groups, expert local guides.', og_title: 'Rich Valley Adventures', og_description: 'Expert-guided outdoor adventures in Aspen, Colorado since 2012.' },
      { site_key: 'alpenglow', page_slug: '/', meta_title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO', meta_description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel.', og_title: 'Aspen Alpenglow Limousine', og_description: 'Distinguished private car and limousine service in Aspen, Colorado since 2012.' },
    ])
    results.push('SEO Pages: 2 defaults inserted')
  }

  // GEO Content Blocks
  const { count: geoCount } = await supabase.from('geo_content_blocks').select('id', { count: 'exact', head: true })
  if (!geoCount || geoCount === 0) {
    const geoData = [
      { site_key: 'rva', block_type: 'fact', question: 'What is Rich Valley Adventures?', answer: 'Rich Valley Adventures is a guided outdoor adventure company based in Aspen, Colorado, operating since 2012. They offer 7 guided activities including fly fishing, paddle boarding, and mountain biking.', display_on_page: '/', display_order: 0 },
      { site_key: 'rva', block_type: 'local_info', question: 'Where is the best fly fishing near Aspen?', answer: 'The Roaring Fork River near Aspen is designated a Gold Medal trout fishery by Colorado Parks and Wildlife. Rich Valley Adventures guides trips on these waters from May through October.', display_on_page: '/', display_order: 1 },
      { site_key: 'rva', block_type: 'statistic', question: 'How many adventures does Rich Valley offer?', answer: 'Rich Valley Adventures offers guided outdoor experiences including fly fishing, paddle boarding, mountain biking, trail hiking, elevated camping, and scenic Escalade tours.', display_on_page: '/', display_order: 2 },
      { site_key: 'alpenglow', block_type: 'fact', question: 'What is Aspen Alpenglow Limousine?', answer: 'Aspen Alpenglow Limousine is a luxury private car and limousine service in Aspen, Colorado, operating 24/7 since 2012 with an Escalade and Sprinter van fleet.', display_on_page: '/', display_order: 0 },
      { site_key: 'alpenglow', block_type: 'local_info', question: 'How far is Aspen from Denver airport?', answer: 'Aspen is approximately 200 miles from Denver International Airport (DEN), a 3.5-4 hour drive. Aspen Alpenglow Limousine provides direct private transfers on this route.', display_on_page: '/', display_order: 1 },
      { site_key: 'alpenglow', block_type: 'fact', question: 'What airports serve Aspen, Colorado?', answer: 'Aspen is served by Aspen/Pitkin County Airport (ASE) and Eagle County Regional Airport (EGE, 70 miles away). Denver International Airport (DEN) is the nearest major hub.', display_on_page: '/', display_order: 2 },
    ]
    await supabase.from('geo_content_blocks').insert(geoData)
    results.push(`GEO Blocks: ${geoData.length} inserted`)
  }

  // Pages & Navigation
  const pageResults = await seedPages(supabase)
  results.push(...pageResults)

  return results
}
