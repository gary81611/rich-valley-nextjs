import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  // Prevent network resolution failures from throwing during SSR/SSG.
  // Supabase will receive a normal HTTP 503 response and return an error object instead.
  const safeFetch: typeof fetch = async (input, init) => {
    try {
      return await fetch(input, init)
    } catch {
      return new Response(
        JSON.stringify({ message: 'Supabase request unavailable (network/DNS)' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }

  return createServerClient(
    url,
    key,
    {
      global: { fetch: safeFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  )
}
