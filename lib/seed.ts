import { rvaData, alpenglowData } from '@/lib/site-data'
import { seedPages } from '@/lib/seed-pages'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function seedAllTables(supabase: SupabaseClient) {
  const results: string[] = []

  // Adventures — now managed via admin UI, skip seeding
  // Services — now managed via admin UI, skip seeding
  // Fleet — now managed via admin UI, skip seeding
  // Testimonials — now managed via admin UI, skip seeding
  // Gallery — now managed via admin UI, skip seeding
  // FAQs — now managed via admin UI, skip seeding
  // Service Areas — now managed via admin UI, skip seeding

  // Site Settings
  const { count: settingsCount } = await supabase.from('site_settings').select('id', { count: 'exact', head: true })
  if (!settingsCount || settingsCount === 0) {
    await supabase.from('site_settings').insert([
      {
        site_key: 'rva', brand_name: rvaData.name, tagline: rvaData.tagline, phone: rvaData.phone,
        email: rvaData.email, address: 'Aspen, Colorado 81611', logo_url: rvaData.logo,
        social_links: { Facebook: rvaData.social.facebook, Instagram: rvaData.social.instagram },
        colors: { primary: '#C17A3A', secondary: '#2D3B2D', accent: '#D4A96A', background: '#F5F0EB' },
        stats: [{ value: '2012', label: 'Guiding since' }, { value: '3,000+', label: 'Adventures Led' }, { value: '4.9', label: 'Average Rating' }],
      },
      {
        site_key: 'alpenglow', brand_name: alpenglowData.name, tagline: alpenglowData.tagline, phone: alpenglowData.phone,
        email: alpenglowData.email, address: 'Aspen, Colorado 81611', logo_url: alpenglowData.logo,
        social_links: { Facebook: alpenglowData.social.facebook, Instagram: alpenglowData.social.instagram },
        colors: { primary: '#1B2541', secondary: '#C8A96E', accent: '#2A3F6F', background: '#0F1729' },
        stats: [{ value: '24/7', label: 'Dispatch Available' }, { value: 'Since 2012', label: 'Serving Aspen' }, { value: '5.0', label: 'on Google (5 reviews)' }],
      },
    ])
    results.push('Site Settings: 2 inserted')
  }

  // SEO Pages
  const { count: seoCount } = await supabase.from('seo_pages').select('id', { count: 'exact', head: true })
  if (!seoCount || seoCount === 0) {
    await supabase.from('seo_pages').insert([
      { site_key: 'rva', page_slug: '/', meta_title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO', meta_description: 'Guided fly fishing, hiking, and mountain biking in Aspen and the Roaring Fork Valley. Paddleboarding is a rental from $100.', og_title: 'Rich Valley Adventures', og_description: 'Expert-guided outdoor adventures in Aspen, Colorado since 2012.' },
      { site_key: 'alpenglow', page_slug: '/', meta_title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO', meta_description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel.', og_title: 'Aspen Alpenglow Limousine', og_description: 'Distinguished private car and limousine service in Aspen, Colorado since 2012.' },
    ])
    results.push('SEO Pages: 2 defaults inserted')
  }

  // GEO Content Blocks
  const { count: geoCount } = await supabase.from('geo_content_blocks').select('id', { count: 'exact', head: true })
  if (!geoCount || geoCount === 0) {
    const geoData = [
      { site_key: 'rva', block_type: 'fact', question: 'What is Rich Valley Adventures?', answer: 'Rich Valley Adventures is a guided outdoor adventure company based in Aspen, Colorado, operating since 2012. Paddleboarding is a rental from $100, not a guided trip. A full-day float trip starts at $1,400 for 2 people.', display_on_page: '/', display_order: 0 },
      { site_key: 'rva', block_type: 'local_info', question: 'Where is the best fly fishing near Aspen?', answer: 'The Roaring Fork River near Aspen is designated a Gold Medal trout fishery by Colorado Parks and Wildlife. Guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady.', display_on_page: '/', display_order: 1 },
      { site_key: 'rva', block_type: 'statistic', question: 'How many adventures does Rich Valley offer?', answer: 'Rich Valley Adventures offers guided fly fishing, mountain biking, trail hiking, elevated camping, and scenic Chauffeur Guided Tours. Paddleboarding is a rental from $100, not a guided trip.', display_on_page: '/', display_order: 2 },
      { site_key: 'alpenglow', block_type: 'fact', question: 'What is Aspen Alpenglow Limousine?', answer: 'Aspen Alpenglow Limousine is a luxury private car and limousine service in Aspen, Colorado, operating 24/7 since 2012 with two Chevrolet Suburbans and a Ford Transit Van.', display_on_page: '/', display_order: 0 },
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
