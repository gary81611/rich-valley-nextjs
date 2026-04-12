const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const DEFAULT_MAX_TOKENS = 2000
const ABSOLUTE_MAX_TOKENS = 12000

export type GenerateWithAIOptions = {
  /** Output token budget; capped at ABSOLUTE_MAX_TOKENS. Use higher values for long JSON (e.g. blog posts). */
  maxTokens?: number
}

export async function generateWithAI(
  prompt: string,
  systemPrompt?: string,
  options?: GenerateWithAIOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('AI is not set up yet. Ask your developer to add the OPENROUTER_API_KEY in Vercel environment variables.')

  const maxTokens = Math.min(
    Math.max(options?.maxTokens ?? DEFAULT_MAX_TOKENS, 256),
    ABSOLUTE_MAX_TOKENS,
  )

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://richvalleyadventures.com',
      'X-Title': 'Rich Valley Adventures Admin',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} ${text}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function testConnection(): Promise<{ success: boolean; model: string; latency: number }> {
  const start = Date.now()
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return { success: false, model: '', latency: 0 }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://richvalleyadventures.com',
        'X-Title': 'Rich Valley Adventures Admin',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4',
        messages: [{ role: 'user', content: 'Reply with just the word "connected".' }],
        max_tokens: 10,
      }),
    })
    const latency = Date.now() - start
    if (!response.ok) return { success: false, model: '', latency }
    const data = await response.json()
    return { success: true, model: data.model || process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4', latency }
  } catch {
    return { success: false, model: '', latency: Date.now() - start }
  }
}
