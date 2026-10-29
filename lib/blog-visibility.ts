/**
 * Public blog visibility.
 *
 * Rows are readable from Postgres when status = 'published' (RLS). That is not
 * a date gate: a future published_at would still be listed, sitemapped, and
 * rendered. This helper is the request-time gate. Call it on every public
 * read. Do not use it in the admin UI.
 *
 * A null published_at stays visible so older rows that were published before
 * the column was filled do not disappear.
 */
export function isBlogPostPubliclyVisible(
  post: { published_at?: string | null },
  now: Date = new Date(),
): boolean {
  const raw = post.published_at
  if (raw == null || String(raw).trim() === '') return true
  const t = Date.parse(String(raw))
  if (Number.isNaN(t)) return true
  return t <= now.getTime()
}

export function filterPublicBlogPosts<T extends { published_at?: string | null }>(
  posts: T[],
  now: Date = new Date(),
): T[] {
  return posts.filter((post) => isBlogPostPubliclyVisible(post, now))
}

/**
 * next/image treats an absolute URL as a remote image. Local files in /public
 * must be passed as a root-relative path or the optimizer rejects the host.
 * Remote URLs already used on the site (for example Unsplash) stay absolute.
 */
export function blogImageSrcForNext(url: string | null | undefined): string | undefined {
  const raw = typeof url === 'string' ? url.trim() : ''
  if (!raw) return undefined
  const u = /scenic-escalade/i.test(raw)
    ? '/images/adventures/scenic-wildlife-tour.png'
    : /escalade/i.test(raw)
      ? '/images/logos/alpenglow-logo.png'
      : raw
  if (u.startsWith('/') && !u.startsWith('//')) return u
  if (u.startsWith('https://') || u.startsWith('http://')) return u
  return `/${u}`
}
