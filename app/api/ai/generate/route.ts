import { NextRequest, NextResponse } from 'next/server'
import { generateWithAI } from '@/lib/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000
  const requests = rateLimitMap.get(ip) || []
  const recent = requests.filter(t => now - t < windowMs)
  if (recent.length >= 10) return false
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return true
}

const systemPrompts: Record<string, string> = {
  aeo_from_query: `You are an AEO/GEO (Answer Engine Optimization / Generative Engine Optimization) expert.

Given a search query that a business wants to rank for, generate a complete content block that AI search engines (ChatGPT, Perplexity, Google AI Overview, Siri) will cite as an authoritative answer.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "question": "The search query rephrased as a natural question someone would ask an AI assistant",
  "answer": "A factual, authoritative answer in 30-50 words. Include specific numbers, locations, and entity names. Write in third person about the business.",
  "block_type": "fact|statistic|local_info|how_to|comparison|definition",
  "source_citation": "A credibility marker, e.g. 'Operating since 2012' or '4.9-star rated on Google'",
  "target_queries": ["the original query", "2-3 related queries people also search for"],
  "meta_title": "SEO page title for this topic, max 60 chars, include location",
  "meta_description": "SEO meta description, max 155 chars, compelling and specific"
}`,

  aeo_batch: `You are an AEO/GEO expert. Given a brand description and list of search queries, generate a content block for EACH query.

Return ONLY valid JSON array (no markdown fences):
[
  {
    "question": "Natural question form of the query",
    "answer": "Factual answer, 30-50 words, third person, specific numbers/names",
    "block_type": "fact|statistic|local_info|how_to",
    "source_citation": "Credibility marker",
    "target_queries": ["original query", "related query 1", "related query 2"]
  }
]`,

  meta_tags: `You are an SEO expert. Generate meta tags for a page. Return ONLY valid JSON (no markdown): { "meta_title": "...(max 60 chars)", "meta_description": "...(max 155 chars)", "meta_keywords": "comma,separated,keywords", "og_title": "...", "og_description": "..." }`,

  geo_block: `You are a GEO content strategist. Create a factual, citation-worthy content block. Return ONLY valid JSON (no markdown): { "question": "...", "answer": "...(max 40 words, factual, specific)", "block_type": "fact|statistic|local_info|how_to", "source_citation": "..." }`,

  free_form: `You are an AI assistant helping manage content for Rich Valley Adventures (outdoor adventures) and Aspen Alpenglow Limousine (luxury transportation) in Aspen, Colorado. Be helpful and concise.`,
}

const brandContext: Record<string, string> = {
  rva: `Rich Valley Adventures is a guided outdoor adventure company in Aspen, Colorado, operating since 2012. Phone: 970-456-3666. Full-day float trip: from $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. Covers an 8-12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up. Private ranch and picnic package at Spring Creek Ranch, Carbondale CO: from $800 per adult, $250 per child (ages 3+). Includes ponds, creeks, and a private section of the Roaring Fork River, with rainbow, brown, native cutthroat, and brook trout. Kids ages 3 and up can fish. Waders are provided for kids 3 and up, and adult waders and boots go up to men's size 15. Guests and grandparents with limited mobility can be hosted at the ranch ponds. Guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady. Featured trips in order: full-day float trip; private ranch family fishing and picnic lunch; group hiking (includes transportation and picnic lunch). Confirmed prices: half-day hike $600; half-day snowshoe $500; overnight camping $1,500; horseback $600; half-day scenic and wildlife tour $750; scenic river rafting with picnic $1,200. Guides run fishing, hiking, rafting, and camping in-house. Horseback, ATV, and snowmobile go through partner local outfitters (do not name them). CO Licensed Outfitter OUT.0003060. CO River License 620. Paddleboarding is a rental from $100, not a guided trip. Corporate packages: groups of 50+, custom mix of fishing and hiking. Booking: at least 2 days' advance notice, 50% deposit at booking, cancellations within 72 hours billed in full.`,
  alpenglow: `Aspen Alpenglow Limousine is a luxury private car and limousine service in Aspen, Colorado, operating 24/7 since 2012. Phone: 970-456-3666. The fleet is exactly two Chevrolet Suburbans (7 passengers each) and one Ford Transit Passenger Van (13 passengers). There is no Escalade. SUVs seat 7. The passenger shuttle van seats 13. Eagle County Regional Airport (EGE) is in Gypsum. Do not publish a street address; name service areas instead. Vehicles have Starlink, ski racks, and roof cargo space. Child car seats and boosters are free. No shared rides are offered. Pets welcome, with a cleaning fee. Private FBO airport service: Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. One-way SUV rates each way: Eagle and Rifle $720, Denver $1,375, Grand Junction $950. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally. Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice. Corporate charge accounts are billed monthly.`,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 10 requests per minute.' }, { status: 429 })
  }

  try {
    const { prompt, type, brand, system_prompt_override, max_tokens } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = system_prompt_override || systemPrompts[type] || systemPrompts.free_form
    const context = brand && brandContext[brand] ? `\n\nBusiness context:\n${brandContext[brand]}` : ''
    const enrichedPrompt = `${prompt}${context}`

    let maxTokens: number | undefined
    if (typeof max_tokens === 'number' && Number.isFinite(max_tokens)) {
      maxTokens = Math.min(Math.max(Math.floor(max_tokens), 256), 12000)
    }

    const result = await generateWithAI(enrichedPrompt, systemPrompt, { maxTokens })
    return NextResponse.json({ result, type })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
