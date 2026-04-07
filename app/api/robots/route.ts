export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const isAAL =
    hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')

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
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  // RVA — disallow legacy indexed paths; explicitly allow key marketing pages
  const content = `User-agent: *
Disallow: /service-areas/
Disallow: /service-areas-locations/
Allow: /llms.txt
Allow: /rva/conditions
Allow: /rva/guides
Allow: /rva/fly-fishing
Allow: /rva/hiking
Allow: /rva/mountain-biking
Allow: /rva/paddle-boarding
Allow: /rva/elevated-camping
Allow: /rva/winter
Allow: /rva/locations
Allow: /

Sitemap: ${sitemapUrl}
`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
