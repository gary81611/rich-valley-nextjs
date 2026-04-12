/**
 * Legacy seed shape. Canonical blog content lives in `content/blog/{rva,aal}/*.md`.
 * Upsert into Supabase: `npx tsx scripts/seed-blog.ts` (service role + project URL).
 */
export interface BlogPostSeed {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
}

/** Kept empty — all posts ship from markdown via the seed script. */
export const BLOG_POSTS: BlogPostSeed[] = []
