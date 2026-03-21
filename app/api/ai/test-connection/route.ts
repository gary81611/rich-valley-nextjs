import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/openrouter'

export async function GET() {
  const result = await testConnection()
  return NextResponse.json(result)
}
