const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const DEFAULT_MAX_TOKENS = 2000
const ABSOLUTE_MAX_TOKENS = 12000

/**
 * Default model. `anthropic/claude-sonnet-4` is no longer in the OpenRouter
 * catalog: Amazon Bedrock retired that snapshot on 2026-10-14, and OpenRouter
 * calls to it started failing on 2026-10-16. Sonnet 4.6 is the live drop-in
 * that still accepts this chat-completions body (`messages` + `max_tokens`).
 */
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4.6'
const RETIRED_MODELS = new Set([
  'anthropic/claude-sonnet-4',
  'anthropic/claude-sonnet-4-20250514',
])

function resolveModel(): string {
  const configured = process.env.OPENROUTER_MODEL?.trim()
  if (!configured || RETIRED_MODELS.has(configured)) return DEFAULT_MODEL
  return configured
}

/** Chat Completions `message.content` is a string, or an array of text parts. */
function messageText(data: { choices?: { message?: { content?: unknown } }[] }): string {
  const content = data.choices?.[0]?.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (part && typeof part === 'object' && 'text' in part && typeof (part as { text?: unknown }).text === 'string') {
          return (part as { text: string }).text
        }
        return ''
      })
      .join('')
  }
  return ''
}

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
      model: resolveModel(),
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
  return messageText(data)
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
        model: resolveModel(),
        messages: [{ role: 'user', content: 'Reply with just the word "connected".' }],
        max_tokens: 10,
      }),
    })
    const latency = Date.now() - start
    if (!response.ok) return { success: false, model: '', latency }
    const data = await response.json()
    return { success: true, model: data.model || resolveModel(), latency }
  } catch {
    return { success: false, model: '', latency: Date.now() - start }
  }
}
