# Rich Valley Multi-Site

Next.js app for **Rich Valley Adventures** and **Aspen Alpenglow Limousine**: one codebase, host-based routing and middleware rewrites.

## Prerequisites

- Node.js18+
- npm

## Setup

```bash
npm install
```

Configure Supabase and other secrets in **`.env.local`** (not committed). Minimum for most features: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **`SUPABASE_SERVICE_ROLE_KEY`** is optional locally but recommended in production server env: sitemap generation uses it when present (explicit tenant filters in code).

## Scripts

| Command           | Purpose |
| ----------------- | -------------------- |
| `npm run dev`     | Development server   |
| `npm run build`   | Production build     |
| `npm run start`   | Run production build |
| `npm run lint`    | ESLint               |
| `npm run seo:audit:sitemap` | Live sitemap health audit (status/canonical/noindex) |

## SEO notes

Production serves **`/sitemap.xml`** and **`/robots.txt`** through **`app/api/sitemap`** and **`app/api/robots`** via rewrites in `next.config.js` (not static-only). See **`CLAUDE.md`** for the full critical-file list and conventions.

## SEO regression checks

Before merging SEO-impacting changes (redirects, sitemap, robots, canonicals), run:

```bash
npm run seo:audit:sitemap
```

This script fails when sitemap URLs are non-200 on first hop/final hop, contain `noindex`, or have a canonical that points elsewhere.
