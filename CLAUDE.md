# CLAUDE.md — Rich Valley Next.js

**Doc revision:** 2026-04-14

## Stack

- Next.js 14 (App Router)
- Supabase (Postgres, Auth, Storage)
- Vercel: push to `main` → production

## Protected files

Do not edit without explicit human instruction:

- `.env`, `.env*.local` — secrets; agents must not read or write
- `DESIGN.md`, `BRAND.md` — design and content authority (human-owned)

## SEO / request-aware public routes

- **`/sitemap.xml`** — `next.config.js` rewrites to **`app/api/sitemap/route.ts`**. Brand is chosen from the `Host` header via **`lib/site-from-host.ts`** (align with `middleware.ts` host heuristics). Server prefers **`SUPABASE_SERVICE_ROLE_KEY`**, then anon key; all DB queries must keep **`.eq('site_key'|site_id', siteKey)`**. Responses set **`X-Sitemap-Mode: dynamic`** or **`fallback`** (errors / missing env → static URL list only). **Do not add `app/sitemap.ts`** without revisiting rewrites and GSC.
- **`/robots.txt`** — Rewritten to **`app/api/robots/route.ts`**. Keep body in sync with **`public/robots.txt`** (see `.cursor/rules/robots-txt-sync.mdc`).
- **`middleware.ts`** — Brand detection, `/rva` prefix redirect, internal rewrites to `/{site}/…`, Supabase session refresh.

## Critical files registry (extend when adding SEO/auth-critical code)

- `next.config.js` — redirects, `/sitemap.xml` + `/robots.txt` rewrites
- `middleware.ts`
- `lib/site-from-host.ts`
- `app/api/sitemap/route.ts`
- `app/api/robots/route.ts`
- `public/robots.txt`

## Environment variables (names only)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; sitemap and other API routes use it when set