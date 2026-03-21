-- Review Requests table
-- Run this in the Supabase SQL editor to create the table

create table if not exists review_requests (
  id uuid default gen_random_uuid() primary key,
  brand text not null check (brand in ('rva', 'alpenglow')),
  customer_name text not null,
  customer_email text not null,
  adventure_name text,
  template_id text not null,
  subject text not null,
  sent_at timestamptz default now(),
  status text default 'sent'
);

-- Optional: enable row-level security
alter table review_requests enable row level security;

-- Allow authenticated users (admin) to read and insert
create policy "Admin can read review_requests"
  on review_requests for select
  using (auth.role() = 'authenticated');

create policy "Admin can insert review_requests"
  on review_requests for insert
  with check (auth.role() = 'authenticated');

-- Allow the service role to insert (used by the API route)
create policy "Service role can insert review_requests"
  on review_requests for insert
  to service_role
  with check (true);

create policy "Service role can read review_requests"
  on review_requests for select
  to service_role
  using (true);
