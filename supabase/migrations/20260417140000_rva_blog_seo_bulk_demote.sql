-- RVA blog SEO: bulk-demote March 2026 posts except three pillars (fly fishing, hiking, families).
-- Pillar slugs: fly-fishing-aspen-roaring-fork-valley, guided-hiking-tours-aspen-maroon-bells, summer-activities-aspen-families
-- Demoted rows: draft + seo_bulk_demoted; app redirects /blog/{slug} → /blog via service_role check.

alter table public.blog_posts
  add column if not exists seo_bulk_demoted boolean not null default false;

comment on column public.blog_posts.seo_bulk_demoted is
  'When true with status=draft, RVA /blog/[slug] permanently redirects to /blog. Clear when intentionally re-publishing.';

update public.blog_posts
set
  status = 'draft',
  seo_bulk_demoted = true,
  published_at = null,
  updated_at = now()
where site_key = 'rva'
  and status = 'published'
  and slug not in (
    'fly-fishing-aspen-roaring-fork-valley',
    'guided-hiking-tours-aspen-maroon-bells',
    'summer-activities-aspen-families'
  );

update public.blog_posts
set seo_bulk_demoted = false, updated_at = now()
where site_key = 'rva'
  and slug in (
    'fly-fishing-aspen-roaring-fork-valley',
    'guided-hiking-tours-aspen-maroon-bells',
    'summer-activities-aspen-families'
  );
