-- Voice fishing report intake via a security-definer RPC.
-- Callers use the anon key. The shared secret is checked as a sha256 hex hash
-- stored later in private.app_secrets (name = voice_fishing_report). This file
-- does not insert a secret or a hash.

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create table if not exists private.app_secrets (
  name text primary key,
  secret_sha256 text not null,
  updated_at timestamptz not null default now()
);

revoke all on table private.app_secrets from public;
revoke all on table private.app_secrets from anon;
revoke all on table private.app_secrets from authenticated;

create extension if not exists pgcrypto with schema extensions;

create or replace function public.submit_voice_fishing_report(
  p_secret text,
  p_reporter text,
  p_river_or_section text,
  p_summary text,
  p_flows text default null,
  p_water_temp text default null,
  p_hatches_and_flies text default null,
  p_what_is_working text default null
) returns table (id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $fn$
#variable_conflict use_column
declare
  v_hash text;
  v_reporter text;
  v_river text;
  v_summary text;
  v_flows text;
  v_water_temp text;
  v_hatches text;
  v_working text;
  v_count integer;
begin
  select s.secret_sha256
    into v_hash
    from private.app_secrets as s
   where s.name = 'voice_fishing_report';

  if v_hash is null or p_secret is null or pg_catalog.btrim(p_secret) = '' then
    raise exception 'unauthorized' using errcode = '28000';
  end if;

  if pg_catalog.encode(extensions.digest(p_secret, 'sha256'), 'hex') <> v_hash then
    raise exception 'unauthorized' using errcode = '28000';
  end if;

  v_reporter := pg_catalog.btrim(p_reporter);
  v_river := pg_catalog.btrim(p_river_or_section);
  v_summary := pg_catalog.btrim(p_summary);
  v_flows := pg_catalog.nullif(pg_catalog.btrim(pg_catalog.coalesce(p_flows, '')), '');
  v_water_temp := pg_catalog.nullif(pg_catalog.btrim(pg_catalog.coalesce(p_water_temp, '')), '');
  v_hatches := pg_catalog.nullif(pg_catalog.btrim(pg_catalog.coalesce(p_hatches_and_flies, '')), '');
  v_working := pg_catalog.nullif(pg_catalog.btrim(pg_catalog.coalesce(p_what_is_working, '')), '');

  if v_reporter is null or pg_catalog.char_length(v_reporter) < 1 or pg_catalog.char_length(v_reporter) > 100
     or v_river is null or pg_catalog.char_length(v_river) < 1 or pg_catalog.char_length(v_river) > 150
     or v_summary is null or pg_catalog.char_length(v_summary) < 1 or pg_catalog.char_length(v_summary) > 1500
     or (v_flows is not null and pg_catalog.char_length(v_flows) > 100)
     or (v_water_temp is not null and pg_catalog.char_length(v_water_temp) > 100)
     or (v_hatches is not null and pg_catalog.char_length(v_hatches) > 500)
     or (v_working is not null and pg_catalog.char_length(v_working) > 500)
  then
    raise exception 'invalid' using errcode = '22023';
  end if;

  select count(*)::integer
    into v_count
    from public.voice_fishing_reports as r
   where r.created_at > pg_catalog.now() - interval '1 hour';

  if v_count >= 20 then
    raise exception 'rate_limited' using errcode = 'P0429';
  end if;

  return query
  insert into public.voice_fishing_reports as v (
    reporter,
    river_or_section,
    flows,
    water_temp,
    hatches_and_flies,
    what_is_working,
    summary
  ) values (
    v_reporter,
    v_river,
    v_flows,
    v_water_temp,
    v_hatches,
    v_working,
    v_summary
  )
  returning v.id, v.created_at;
end;
$fn$;

revoke all on function public.submit_voice_fishing_report(text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_voice_fishing_report(text, text, text, text, text, text, text, text) to anon, authenticated;

revoke insert, update, delete, truncate on table public.voice_fishing_reports from anon, authenticated;
grant select on table public.voice_fishing_reports to anon, authenticated;

alter table public.voice_fishing_reports enable row level security;
