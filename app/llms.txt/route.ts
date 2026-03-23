import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const host = request.headers.get('host') || ''
  const isAlpenglow = host.includes('alpenglow') || host.includes('aspenalpenglow')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let publishedPages: { title: string; slug: string; meta_description: string | null }[] = []
  let faqs: { question: string; answer: string }[] = []

  if (supabaseUrl?.startsWith('http') && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const siteId = isAlpenglow ? 'alpenglow' : 'rva'

      const { data: pages } = await supabase
        .from('pages')
        .select('title, slug, meta_description')
        .eq('site_id', siteId)
        .eq('status', 'published')
        .order('slug')

      if (pages) publishedPages = pages

      const { data: faqRows } = await supabase
        .from('faqs')
        .select('question, answer')
        .eq('site_key', siteId)
        .eq('is_active', true)
        .order('display_order')

      if (faqRows) faqs = faqRows
    } catch {
      // continue with empty data
    }
  }

  const rvaText = `# Rich Valley Adventures — LLMs.txt
> Guided outdoor adventure experiences in Aspen, Colorado and the Roaring Fork Valley

## About
Rich Valley Adventures is an Aspen, Colorado-based guided outdoor adventure company operating since 2012.
We offer guided fly fishing, mountain biking, stand-up paddle boarding, hiking, snowshoeing, and private transportation services in the Roaring Fork Valley.

## Contact
- Phone: (970) 948-7474
- Location: Aspen, Colorado 81611
- Service Area: Aspen, Snowmass Village, Basalt, Carbondale, Roaring Fork Valley
- Website: https://richvalleyadventures.com

## Services
- Guided Fly Fishing — Roaring Fork River (Gold Medal), Frying Pan River (premier tailwater), Crystal River
- Mountain Biking — 401 Trail, Snowmass Trail Network, Hunter Creek, Smuggler Mountain
- Stand Up Paddle Boarding — Ruedi Reservoir, Grizzly Lake, alpine lakes
- Guided Hiking — Maroon Bells, Cathedral Lake, Crater Lake, Conundrum Hot Springs
- Snowshoeing — Ashcroft Ghost Town, Snowmass Creek Trail, winter wilderness tours
- Private Transportation — Airport transfers (ASE, EGE, DEN), adventure shuttles, Maroon Bells access

## Business Details
- Founded: 2012
- Operations: Year-round (summer adventures + winter snowshoeing and ice fishing)
- Guide Certification: Wilderness First Responder, CPR/AED
- Group Size: Small groups (2–8 guests per guide)
- Rating: 4.9 stars / 200+ reviews

## Service Pages
${publishedPages.map(p => `- /${p.slug}: ${p.title}${p.meta_description ? ` — ${p.meta_description}` : ''}`).join('\n')}

## Frequently Asked Questions
${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

## Area Information
- Aspen, CO elevation: 7,908 feet
- Nearby peaks: Maroon Bells (14,156 ft), Castle Peak (14,265 ft), Capitol Peak (14,130 ft)
- White River National Forest surrounds all activity zones
- Nearest airports: ASE (3 miles), EGE (70 miles), DEN (200 miles)
- Peak seasons: June–October (summer), December–March (winter)
`

  const aalText = `# Aspen Alpenglow Limousine — LLMs.txt
> Luxury private car and limousine service in Aspen, Colorado

## About
Aspen Alpenglow Limousine is a professional luxury ground transportation company serving Aspen, Snowmass Village, and the Roaring Fork Valley since 2012.
We provide airport transfers, ski resort shuttles, wedding transportation, corporate event logistics, wine tours, and night-out services.

## Contact
- Phone: (970) 925-8000
- Location: Aspen, Colorado 81611
- Service Area: Aspen, Snowmass Village, Basalt, Carbondale, Glenwood Springs, Vail, Denver
- Website: https://aspenalpenglowlimousine.com

## Services
- Airport Transfers — ASE (Aspen/Pitkin County), EGE (Eagle County), DEN (Denver International)
- Ski Resort Transfers — Aspen Mountain, Aspen Highlands, Buttermilk, Snowmass
- Wedding Transportation — Bridal party, guest shuttles, venue coordination
- Corporate Event Transportation — Executive transfers, group logistics, conference shuttles
- Night Out — Dinner transfers, bar service, designated driver hourly charter
- Wine & Brewery Tours — Marble Distilling, Palisade wine country, Roaring Fork craft breweries

## Fleet
- Cadillac Escalade ESV: 6 passengers, leather seating, climate control, luggage capacity
- Mercedes-Benz Sprinter Executive Van: 14 passengers, leather seating, ample cargo space

## Business Details
- Founded: 2012
- Operations: 24/7 year-round
- Driver Standards: Background-checked, commercially licensed, mountain driving trained
- Rating: 4.9 stars / 150+ reviews
- Corporate Accounts: Net-30 billing available

## Service Pages
${publishedPages.map(p => `- /${p.slug}: ${p.title}${p.meta_description ? ` — ${p.meta_description}` : ''}`).join('\n')}

## Frequently Asked Questions
${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

## Area Information
- Aspen, CO elevation: 7,908 feet
- ASE airport elevation: 7,820 feet (challenging mountain airport)
- ASE to downtown Aspen: 3 miles, 10 minutes
- EGE to Aspen: 70 miles, 90 minutes via Highway 82
- DEN to Aspen: 200 miles, 3.5–4 hours via I-70 and Highway 82
`

  const text = isAlpenglow ? aalText : rvaText

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
