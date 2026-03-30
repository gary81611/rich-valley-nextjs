import { NextRequest, NextResponse } from 'next/server'
import { generateWithAI } from '@/lib/openrouter'

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
  rva: `Rich Valley Adventures is a guided outdoor adventure company in Aspen, Colorado, operating since 2012. They offer guided activities: fly fishing (Roaring Fork River, Gold Medal waters), paddle boarding, mountain biking, trail hiking (Elk Mountains), scenic Chauffeur Guided Tours, and elevated camping/glamping. Small groups of 2-6 guests per guide. All gear included. Phone: 970-456-3666. Based in Aspen, CO 81611. The Roaring Fork River is a Gold Medal trout fishery designated by Colorado Parks and Wildlife. Price range: $150-$350/person.`,
  alpenglow: `Aspen Alpenglow Limousine is a luxury private car and limousine service in Aspen, Colorado, operating 24/7 since 2012. Fleet: Executive Cadillac Escalade (6 passengers) and Luxury Mercedes Sprinter van (14 passengers). Services: airport transfers (ASE, EGE, DEN airports), hourly charter, corporate travel, wedding transportation. Serves Aspen, Snowmass Village, Basalt, Carbondale, Glenwood Springs, Vail, Eagle, Denver. Flight tracking, meet-and-greet, complimentary amenities. Phone: 970-456-3666.`,
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 10 requests per minute.' }, { status: 429 })
  }

  try {
    const { prompt, type, brand, system_prompt_override } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = system_prompt_override || systemPrompts[type] || systemPrompts.free_form
    const context = brand && brandContext[brand] ? `\n\nBusiness context:\n${brandContext[brand]}` : ''
    const enrichedPrompt = `${prompt}${context}`

    const result = await generateWithAI(enrichedPrompt, systemPrompt)
    return NextResponse.json({ result, type })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
