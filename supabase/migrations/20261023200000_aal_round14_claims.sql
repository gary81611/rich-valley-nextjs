-- AAL Round 14. NOT APPLIED by the agent.
-- Do not run this from CI. A manager applies it in Supabase.
-- AAL only: pages.site_id = 'alpenglow', blog_posts.site_key = 'alpenglow'.
-- Does not touch RVA rows, testimonials (an Escalade mention stays for the owner to review),
-- voice_fishing_reports, or earlier migrations.
-- updated_at triggers will stamp the apply time.

CREATE OR REPLACE FUNCTION public.aal_round14_fix_text(t text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  s text := t;
BEGIN
  IF s IS NULL OR s = '' THEN
    RETURN s;
  END IF;

  s := replace(s, 'After 14 years of shuttling', 'Since 2012, driving');
  s := regexp_replace(s, '14\+[[:space:]]+years', 'since 2012', 'gi');
  s := regexp_replace(s, 'over 14 years', 'since 2012', 'gi');
  s := regexp_replace(s, 'Aspen''s most trusted luxury car service', 'a private car service built on local drivers and on-time pickups', 'gi');
  s := regexp_replace(s, 'Aspen’s most trusted luxury car service', 'a private car service built on local drivers and on-time pickups', 'gi');
  s := regexp_replace(s, '14-passenger', '13-passenger', 'gi');
  s := regexp_replace(s, 'up to 14 passengers', 'up to 13 passengers', 'gi');
  s := regexp_replace(s, '14 passengers', '13 passengers', 'gi');
  s := regexp_replace(s, '14 pax', '13 passengers', 'gi');
  s := regexp_replace(s, 'Group Sizes 2–14', 'Group Sizes 2–13', 'g');
  s := regexp_replace(s, 'groups of 6–14', 'groups of 6–13', 'g');
  s := regexp_replace(s, '4\.9-Star Rated', '5.0 on Google (5 reviews)', 'gi');
  s := regexp_replace(s, '4\.9-star', '5.0 on Google (5 reviews)', 'gi');

  s := regexp_replace(s, 'Mercedes-Benz Sprinter Executive Vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinter Executive Van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter Executive Vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter Executive Van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Cadillac Escalade ESV', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Cadillac Escalades', 'Chevrolet Suburbans', 'gi');
  s := regexp_replace(s, 'Cadillac Escalade', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Escalades(?!\.(?:png|jpe?g|webp|gif|svg))', 'Chevrolet Suburbans', 'gi');
  s := regexp_replace(s, 'Escalade(?!\.(?:png|jpe?g|webp|gif|svg))', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Sprinter vans(?!\.(?:png|jpe?g|webp|gif|svg))', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Sprinter van(?!\.(?:png|jpe?g|webp|gif|svg))', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Sprinters(?!\.(?:png|jpe?g|webp|gif|svg))', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Sprinter(?!\.(?:png|jpe?g|webp|gif|svg))', 'Ford Transit passenger van', 'gi');

  RETURN s;
END;
$$;

UPDATE pages
SET
  title = public.aal_round14_fix_text(title),
  meta_title = public.aal_round14_fix_text(meta_title),
  meta_description = public.aal_round14_fix_text(meta_description),
  content = public.aal_round14_fix_text(content::text)::jsonb,
  schema_markup = CASE
    WHEN schema_markup IS NULL THEN NULL
    ELSE public.aal_round14_fix_text(schema_markup::text)::jsonb
  END
WHERE site_id = 'alpenglow'
  AND (
    title ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(meta_title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(meta_description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR content::text ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(schema_markup::text, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
  );

UPDATE blog_posts
SET
  title = public.aal_round14_fix_text(title),
  content = public.aal_round14_fix_text(content),
  meta_title = public.aal_round14_fix_text(meta_title),
  meta_description = public.aal_round14_fix_text(meta_description),
  faqs = CASE
    WHEN faqs IS NULL THEN NULL
    ELSE public.aal_round14_fix_text(faqs::text)::jsonb
  END
WHERE site_key = 'alpenglow'
  AND (
    coalesce(title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(content, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(meta_title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(meta_description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(faqs::text, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
  );

UPDATE site_settings
SET
  tagline = public.aal_round14_fix_text(tagline),
  about_content = CASE
    WHEN about_content IS NULL THEN about_content
    ELSE public.aal_round14_fix_text(about_content::text)::jsonb
  END,
  stats = (
    SELECT COALESCE(jsonb_agg(
      CASE
        WHEN coalesce(elem->>'value', '') = '14+'
          OR coalesce(elem->>'label', '') ~* '14\+'
          THEN jsonb_build_object('value', 'Since 2012', 'label', 'Serving Aspen')
        WHEN coalesce(elem->>'value', '') ~ '4\.9'
          OR coalesce(elem->>'label', '') ~* 'client rating'
          THEN jsonb_build_object('value', '5.0', 'label', 'on Google (5 reviews)')
        ELSE elem
      END
    ), '[]'::jsonb)
    FROM jsonb_array_elements(COALESCE(stats, '[]'::jsonb)) elem
  )
WHERE site_key = 'alpenglow'
  AND (
    coalesce(tagline, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(about_content::text, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(stats::text, '') ~* '14\+|4\.9|client rating'
  );

UPDATE faqs
SET
  question = public.aal_round14_fix_text(question),
  answer = public.aal_round14_fix_text(answer)
WHERE site_key = 'alpenglow'
  AND (question ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR answer ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9');

UPDATE service_areas
SET
  description = public.aal_round14_fix_text(description),
  long_description = public.aal_round14_fix_text(long_description)
WHERE site_key = 'alpenglow'
  AND (
    coalesce(description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR coalesce(long_description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
  );

UPDATE value_propositions
SET
  title = public.aal_round14_fix_text(title),
  description = public.aal_round14_fix_text(description)
WHERE site_key = 'alpenglow'
  AND (
    title ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
    OR description ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
  );

UPDATE services
SET
  name = public.aal_round14_fix_text(name),
  description = public.aal_round14_fix_text(description)
WHERE name ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9'
   OR coalesce(description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9';

-- Alpenglow-only table. Clears cutout photos of the wrong vehicles.
UPDATE fleet_vehicles
SET
  name = CASE
    WHEN name ~* 'transit|sprinter|van' THEN 'Ford Transit passenger van'
    WHEN name ~* 'suburban|escalade|suv' THEN 'Chevrolet Suburban'
    ELSE public.aal_round14_fix_text(name)
  END,
  capacity = CASE
    WHEN name ~* 'transit|sprinter|van' OR capacity = 14 THEN 13
    WHEN name ~* 'suburban|escalade|suv' OR capacity = 6 THEN 7
    ELSE capacity
  END,
  description = public.aal_round14_fix_text(description),
  image_url = CASE
    WHEN coalesce(image_url, '') ~* 'escalade|sprinter' THEN ''
    ELSE image_url
  END
WHERE name ~* 'escalade|sprinter|2025|2026'
   OR coalesce(image_url, '') ~* 'escalade|sprinter'
   OR capacity IN (6, 14);

DROP FUNCTION public.aal_round14_fix_text(text);
