export async function GET(request: Request) {
  const hostname = request.headers.get('host') || ''
  const isAAL =
    hostname.includes('aspenalpenglow') || hostname.includes('alpenglow')

  const sitemapUrl = isAAL
    ? 'https://aspenalpenglowlimousine.com/sitemap.xml'
    : 'https://www.richvalleyadventures.com/sitemap.xml'

  const content = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
