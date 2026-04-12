/**
 * Seed blog posts from content/blog/{rva,aal}/*.md (canonical full articles + AAL).
 * Run: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-blog.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { parseBlogMarkdownFile, splitMarkdownBodyAndFaqs } from '../lib/parse-blog-markdown'

const ROOT = path.join(__dirname, '..')

const SITE_DIRS: { rel: string; site_key: 'rva' | 'alpenglow' }[] = [
  { rel: 'content/blog/rva', site_key: 'rva' },
  { rel: 'content/blog/aal', site_key: 'alpenglow' },
]

function publishedAtFromDate(dateStr: string | undefined): string {
  if (!dateStr?.trim()) return new Date().toISOString()
  const d = new Date(`${dateStr.trim()}T12:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url?.startsWith('http') || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  let count = 0

  for (const { rel, site_key } of SITE_DIRS) {
    const dir = path.join(ROOT, rel)
    if (!fs.existsSync(dir)) {
      console.warn(`SKIP missing dir: ${rel}`)
      continue
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
    for (const file of files) {
      const slug = file.replace(/\.md$/i, '')
      const fullPath = path.join(dir, file)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { meta, body: rawBody } = parseBlogMarkdownFile(raw)

      const title = meta.title?.trim() || slug.replace(/-/g, ' ')
      const meta_title = meta.meta_title?.trim() || title
      const meta_description = meta.description?.trim() || ''
      if (!rawBody) {
        console.warn(`SKIP empty body: ${site_key}/${slug}`)
        continue
      }

      const { articleBody, faqs: parsedFaqs } = splitMarkdownBodyAndFaqs(rawBody)
      const content = articleBody.trim()
      if (!content) {
        console.warn(`SKIP empty article after FAQ split: ${site_key}/${slug}`)
        continue
      }

      const published_at = publishedAtFromDate(meta.date)
      const updated_at = meta.updated?.trim()
        ? publishedAtFromDate(meta.updated)
        : published_at

      const row = {
        site_key,
        slug,
        title,
        meta_title,
        meta_description,
        content,
        internal_links: [] as { text: string; url: string }[],
        faqs: parsedFaqs,
        status: 'published' as const,
        published_at,
        updated_at,
      }

      const { error } = await supabase.from('blog_posts').upsert(row, {
        onConflict: 'site_key,slug',
      })

      console.log(error ? `ERROR ${site_key}/${slug}: ${error.message}` : `OK ${site_key}/${slug}`)
      if (!error) count++
    }
  }

  console.log(`\nDone. Upserted ${count} posts from markdown.`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
