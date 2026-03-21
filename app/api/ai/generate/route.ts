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
  meta_tags: `You are an SEO expert. Generate meta tags for a page. Return JSON with: { "meta_title": "...(max 60 chars)", "meta_description": "...(max 155 chars)", "meta_keywords": "comma,separated,keywords", "og_title": "...", "og_description": "..." }. Only return valid JSON, no markdown.`,
  geo_block: `You are a content strategist specializing in GEO (Generative Engine Optimization). Create factual, citation-worthy content blocks that AI engines can extract and cite. Return JSON with: { "question": "...", "answer": "...(max 40 words, factual, specific)", "block_type": "fact|statistic|local_info|how_to", "source_citation": "..." }. Only return valid JSON, no markdown.`,
  faq: `You are a content writer for a local business in Aspen, Colorado. Generate FAQ content. Return JSON with: { "question": "...", "answer": "...(detailed, 2-3 sentences)" }. Only return valid JSON, no markdown.`,
  description: `You are a copywriter for a luxury adventure/transportation brand in Aspen, Colorado. Write compelling, concise copy. Return plain text only.`,
  free_form: `You are an AI assistant helping manage content for Rich Valley Adventures (outdoor adventures) and Aspen Alpenglow Limousine (luxury transportation) in Aspen, Colorado. Be helpful and concise.`,
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 10 requests per minute.' }, { status: 429 })
  }

  try {
    const { prompt, type, brand, context } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = systemPrompts[type] || systemPrompts.free_form
    const enrichedPrompt = brand
      ? `Brand: ${brand === 'rva' ? 'Rich Valley Adventures (outdoor adventure guides)' : 'Aspen Alpenglow Limousine (luxury transportation)'}${context ? `\nContext: ${context}` : ''}\n\n${prompt}`
      : prompt

    const result = await generateWithAI(enrichedPrompt, systemPrompt)
    return NextResponse.json({ result, type })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
