#!/usr/bin/env node
import https from 'node:https'
import { URL } from 'node:url'

const origin = process.argv[2] || 'https://www.richvalleyadventures.com'
const sitemapUrl = new URL('/sitemap.xml', origin).toString()

function fetch(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers: { 'User-Agent': 'seo-sitemap-audit/1.0' } }, (res) => {
      let body = ''
      res.on('data', (d) => {
        body += d
      })
      res.on('end', () => resolve({ status: res.statusCode || 0, headers: res.headers, body }))
    })
    req.on('error', reject)
    req.end()
  })
}

function extractLocs(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  return matches.map((m) => m[1].trim()).filter(Boolean)
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  return m ? m[1].trim() : ''
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
}

function trimSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function summarize(url, firstStatus, finalStatus, canonical, noindex) {
  const issues = []
  if (firstStatus !== 200) issues.push(`first-hop=${firstStatus}`)
  if (finalStatus !== 200) issues.push(`final=${finalStatus}`)
  if (noindex) issues.push('noindex')
  if (canonical && trimSlash(canonical) !== trimSlash(url)) issues.push(`canonical=${canonical}`)
  return { url, firstStatus, finalStatus, canonical, noindex, issues }
}

async function run() {
  const sitemap = await fetch(sitemapUrl)
  if (sitemap.status !== 200) {
    console.error(`Failed to fetch sitemap: ${sitemapUrl} (${sitemap.status})`)
    process.exit(1)
  }

  const urls = extractLocs(sitemap.body)
  const rows = []
  for (const url of urls) {
    const first = await fetch(url, 'HEAD')
    const page = await fetch(url, 'GET')
    const canonical = extractCanonical(page.body)
    const noindex = hasNoindex(page.body)
    rows.push(summarize(url, first.status, page.status, canonical, noindex))
  }

  const bad = rows.filter((r) => r.issues.length > 0)
  console.log(`Sitemap: ${sitemapUrl}`)
  console.log(`Total URLs: ${rows.length}`)
  console.log(`URLs with issues: ${bad.length}`)
  for (const row of bad) {
    console.log(`- ${row.url} -> ${row.issues.join(', ')}`)
  }

  if (bad.length > 0) process.exit(2)
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
