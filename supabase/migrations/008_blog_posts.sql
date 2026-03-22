-- Blog posts table for RVA and Alpenglow sites
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  site_key text not null check (site_key in ('rva', 'alpenglow')),
  slug text not null,
  title text not null,
  meta_title text,
  meta_description text,
  content text,
  internal_links jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_site_slug_unique unique (site_key, slug)
);

-- Enable Row Level Security
alter table blog_posts enable row level security;

-- Public can read published posts only
create policy "Public read published blog_posts"
  on blog_posts for select
  using (status = 'published');

-- Authenticated users have full access
create policy "Authenticated full access blog_posts"
  on blog_posts for all
  using (auth.role() = 'authenticated');

-- Allow cron/service to publish scheduled posts (anon can update scheduled→published)
create policy "Allow publishing scheduled posts"
  on blog_posts for update
  using (status = 'scheduled')
  with check (status = 'published');

-- Auto-update updated_at on every modification
create trigger update_blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();
