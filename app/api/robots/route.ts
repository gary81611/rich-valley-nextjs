import { resolveSiteKeyFromHost } from '@/lib/site-from-host'

const robotsHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=300, s-maxage=300',
} as const

export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const isAAL = resolveSiteKeyFromHost(hostname) === 'alpenglow'

  const sitemapUrl = isAAL
    ? 'https://aspenalpenglowlimousine.com/sitemap.xml'
    : 'https://www.richvalleyadventures.com/sitemap.xml'

  if (isAAL) {
    const content = `User-agent: *
Allow: /
Allow: /llms.txt

Sitemap: ${sitemapUrl}
`
    return new Response(content, {
      headers: { ...robotsHeaders },
    })
  }

  // Keep in sync with public/robots.txt — see .cursor/rules/robots-txt-sync.mdc
  const content = `User-agent: *
Disallow: /rva/
Allow: /llms.txt
Allow: /conditions
Allow: /guides
Allow: /fly-fishing
Allow: /hiking
Allow: /adventures/mountain-biking
Allow: /paddle-boarding
Allow: /elevated-camping
Allow: /winter
Allow: /locations
Allow: /service-areas
Allow: /contact
Allow: /adventures
Allow: /about
Allow: /blog
Allow: /privacy
Allow: /services
Allow: /

Sitemap: ${sitemapUrl}
`

  return new Response(content, {
    headers: { ...robotsHeaders },
  })
}
