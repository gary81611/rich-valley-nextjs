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
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }

  // Keep in sync with public/robots.txt (fallback if rewrite differs). No trailing punctuation on Sitemap URL.
  const content = `User-agent: *
Disallow: /rva/
Allow: /llms.txt
Allow: /

Sitemap: ${sitemapUrl}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
