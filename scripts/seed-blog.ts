// Seed blog posts into Supabase
// Run: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-blog.ts

import { createClient } from '@supabase/supabase-js'
import { BLOG_POSTS } from '../lib/rva-blog-posts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  for (const post of BLOG_POSTS) {
    const { error } = await supabase.from('blog_posts').upsert({
      slug: post.slug,
      title: post.title,
      content: post.content,
      meta_title: post.title,
      meta_description: post.excerpt,
      site_key: 'rva',
      status: 'published',
      published_at: post.date,
    }, { onConflict: 'slug' })

    console.log(error ? `ERROR ${post.slug}: ${error.message}` : `OK: ${post.slug}`)
  }
}

seed()
