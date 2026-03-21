const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function generateWithAI(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured')

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
      max_tokens: 2000,
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
