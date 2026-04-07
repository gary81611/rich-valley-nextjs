import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const host = request.headers.get('host') || ''
  const isAlpenglow = host.includes('alpenglow') || host.includes('aspenalpenglow')

  const rvaText = `# Rich Valley Adventures — Aspen, CO
# Guided outdoor adventures since 2012

> Authoritative pages:
/rva — homepage
/rva/fly-fishing — guided fly fishing Aspen
/rva/hiking — guided hiking Aspen
/rva/mountain-biking — guided mountain biking
/rva/paddle-boarding — stand up paddle boarding
/rva/elevated-camping — glamping near Aspen
/rva/winter — winter adventures
/rva/conditions — live river and trail conditions
/rva/guides — guide team profiles
/rva/locations — service locations

> Not authoritative (legacy pages, redirected):
/service-areas/
/fleet
/services
`

  const aalText = `# Aspen Alpenglow Limousine — Aspen, CO
# Luxury private car service since 2012

> Authoritative pages:
/alpenglow — homepage
/alpenglow/fleet — vehicle fleet
/alpenglow/pricing — all-inclusive rates
/alpenglow/faq — frequently asked questions
/alpenglow/services — services overview
`

  const text = isAlpenglow ? aalText : rvaText

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
