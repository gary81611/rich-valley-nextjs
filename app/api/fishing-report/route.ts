import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  FISHING_REPORT_LIMITS,
  FISHING_REPORT_MAX_BODY_BYTES,
} from '@/lib/fishing-report-intake'

export const dynamic = 'force-dynamic'

function methodNotAllowed() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export function GET() {
  return methodNotAllowed()
}

export function PUT() {
  return methodNotAllowed()
}

export function PATCH() {
  return methodNotAllowed()
}

export function DELETE() {
  return methodNotAllowed()
}

function unauthorized() {
  return new NextResponse(null, { status: 401 })
}

function headerMatches(header: string | null): header is string {
  const secret = process.env.FISHING_REPORT_SECRET
  if (!secret || !header) return false
  const provided = Buffer.from(header, 'utf8')
  const expected = Buffer.from(secret, 'utf8')
  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}

function invalid() {
  return NextResponse.json({ error: 'Invalid report' }, { status: 400 })
}

async function readBody(request: Request): Promise<{ tooLarge: true } | { tooLarge: false; text: string }> {
  const declared = request.headers.get('content-length')
  if (declared && Number.isFinite(Number(declared)) && Number(declared) > FISHING_REPORT_MAX_BODY_BYTES) {
    return { tooLarge: true }
  }
  if (!request.body) return { tooLarge: false, text: '' }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    total += value.byteLength
    if (total > FISHING_REPORT_MAX_BODY_BYTES) {
      await reader.cancel()
      return { tooLarge: true }
    }
    chunks.push(value)
  }
  return { tooLarge: false, text: Buffer.concat(chunks).toString('utf8') }
}

function requiredText(value: unknown, max: number): string | null | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return undefined
  return trimmed
}

function optionalText(value: unknown, max: number): string | null | undefined {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (trimmed.length > max) return undefined
  return trimmed.length ? trimmed : null
}

function waterTempText(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined
    const text = String(value)
    if (text.length > FISHING_REPORT_LIMITS.water_temp) return undefined
    return text
  }
  return optionalText(value, FISHING_REPORT_LIMITS.water_temp)
}

function rpcFailure(error: { code?: string; message?: string }) {
  const code = error.code ?? ''
  const message = error.message ?? ''
  console.error('submit_voice_fishing_report failed', { code, message })
  if (code === '28000' || message === 'unauthorized') return unauthorized()
  if (code === '22023' || message === 'invalid') return invalid()
  if (code === 'P0429' || message === 'rate_limited') {
    return NextResponse.json({ error: 'Too many reports' }, { status: 429 })
  }
  if (code === 'PGRST202') {
    return NextResponse.json({ error: 'Could not save the report' }, { status: 500 })
  }
  return NextResponse.json({ error: 'Could not save the report' }, { status: 500 })
}

export async function POST(request: Request) {
  const headerSecret = request.headers.get('x-report-secret')
  if (!headerMatches(headerSecret)) return unauthorized()

  const raw = await readBody(request)
  if (raw.tooLarge) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw.text)
  } catch {
    return invalid()
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return invalid()

  const body = parsed as Record<string, unknown>
  const reporter = requiredText(body.reporter, FISHING_REPORT_LIMITS.reporter)
  const river = requiredText(body.river_or_section, FISHING_REPORT_LIMITS.river_or_section)
  const flows = optionalText(body.flows, FISHING_REPORT_LIMITS.flows)
  const waterTemp = waterTempText(body.water_temp)
  const hatches = optionalText(body.hatches_and_flies, FISHING_REPORT_LIMITS.hatches_and_flies)
  const working = optionalText(body.what_is_working, FISHING_REPORT_LIMITS.what_is_working)
  const summary = requiredText(body.summary, FISHING_REPORT_LIMITS.summary)
  if (
    reporter === undefined ||
    river === undefined ||
    flows === undefined ||
    waterTemp === undefined ||
    hatches === undefined ||
    working === undefined ||
    summary === undefined
  ) {
    return invalid()
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Could not save the report' }, { status: 500 })
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase.rpc('submit_voice_fishing_report', {
    p_secret: headerSecret,
    p_reporter: reporter,
    p_river_or_section: river,
    p_summary: summary,
    p_flows: flows,
    p_water_temp: waterTemp,
    p_hatches_and_flies: hatches,
    p_what_is_working: working,
  })

  if (error) return rpcFailure(error)

  const row = Array.isArray(data) ? data[0] : data
  if (!row || typeof row !== 'object' || !('id' in row) || !('created_at' in row)) {
    return NextResponse.json({ error: 'Could not save the report' }, { status: 500 })
  }

  return NextResponse.json({ id: row.id, created_at: row.created_at }, { status: 201 })
}
