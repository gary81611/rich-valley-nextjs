-- Optional hero/cover images for blog posts and fishing reports (Supabase Storage or external URLs).

alter table public.blog_posts
  add column if not exists featured_image_url text;

comment on column public.blog_posts.featured_image_url is
  'Cover/hero image URL for listings, article header, and Open Graph.';

alter table public.fishing_reports
  add column if not exists featured_image_url text;

comment on column public.fishing_reports.featured_image_url is
  'Optional photo shown with the fishing report on the public site.';
