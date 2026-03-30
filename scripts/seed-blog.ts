// Seed blog posts into Supabase
// Run: npx tsx scripts/seed-blog.ts

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
      excerpt: post.excerpt,
      author: post.author,
      site_key: 'rva',
      status: 'published',
      published_at: post.date,
      seo_title: post.title,
      seo_description: post.excerpt,
      tags: post.tags,
    }, { onConflict: 'slug' })

    console.log(error ? `ERROR ${post.slug}: ${error.message}` : `OK: ${post.slug}`)
  }
}

seed()
