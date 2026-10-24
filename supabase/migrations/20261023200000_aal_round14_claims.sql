-- AAL Round 14. NOT APPLIED by the agent.
-- Do not run this from CI. A manager applies it in Supabase.
-- AAL only: pages.site_id = 'alpenglow', blog_posts.site_key = 'alpenglow', faqs.site_key = 'alpenglow'.
-- Does not touch RVA rows, testimonials, voice_fishing_reports, or earlier migrations.
-- updated_at triggers will stamp the apply time.
-- Whole sentences and vehicle names only. No "14+ years" -> "since 2012" substring
-- and no bare "Sprinter" pass that leaves the word Mercedes in front.
-- Dropped (they match nothing, or the table has no site column):
--   site_settings (alpenglow tagline / about_content / stats do not contain these phrases; stats is [])
--   service_areas (Glenwood Springs there is the city or the canyon)
--   value_propositions (no rows)
--   services (active rows do not contain these phrases; no site column)
-- fleet_vehicles has no site column. The only change is capacity on one verified van id.

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

  -- Whole strings. These run before any shorter year or vehicle replace.
  s := regexp_replace(s, '14\+[[:space:]]+Years of Excellence', 'Serving Aspen Since 2012', 'gi');
  s := replace(
    s,
    'Over 14 years of operation, we''ve become the trusted transportation partner for Aspen''s most discerning travelers — Fortune 500 executives, international celebrities, Aspen Institute fellows, and families returning year after year because they know their transportation needs are handled with absolute reliability and discretion.',
    'Operating since 2012, we''ve become the trusted transportation partner for Aspen''s most discerning travelers — Fortune 500 executives, international celebrities, Aspen Institute fellows, and families returning year after year because they know their transportation needs are handled with absolute reliability and discretion.'
  );
  s := regexp_replace(s, '4\.9-Star Rated', '5.0 on Google', 'gi');
  s := replace(
    s,
    'Over 150 five-star reviews from guests who trust us with their most important transportation needs.',
    '5.0 on Google (5 reviews).'
  );

  -- EGE is in Gypsum. Glenwood Springs as a city, Glenwood Canyon, and the hot springs stay.
  s := replace(s, 'Eagle County Regional Airport (EGE) in Glenwood Springs', 'Eagle County Regional Airport (EGE) in Gypsum');
  s := replace(s, 'Eagle County Regional Airport, located in Glenwood Springs', 'Eagle County Regional Airport, located in Gypsum');
  s := replace(s, 'Eagle County Airport (EGE) near Glenwood Springs', 'Eagle County Airport (EGE) near Gypsum');
  s := replace(s, 'EGE is located in Glenwood Springs', 'EGE is located in Gypsum');

  s := replace(s, 'After 14 years of shuttling', 'Since 2012, driving');
  s := regexp_replace(s, 'have 15\+[[:space:]]*years of mountain driving experience', 'have been driving these mountain roads since 2012', 'gi');
  s := regexp_replace(s, 'with 15\+[[:space:]]*years of mountain driving experience', 'who have been driving these mountain roads since 2012', 'gi');
  s := regexp_replace(s, 'with 15\+[[:space:]]*years of mountain driving', 'who have been driving these mountain roads since 2012', 'gi');
  s := regexp_replace(s, 'Colorado''s Premier Ski Towns', 'Colorado''s Ski Towns', 'gi');
  s := regexp_replace(s, 'Colorado’s Premier Ski Towns', 'Colorado''s Ski Towns', 'gi');
  s := regexp_replace(s, 'Colorado''s Premier Wine Region', 'a Colorado wine region', 'gi');
  s := regexp_replace(s, 'Colorado’s Premier Wine Region', 'a Colorado wine region', 'gi');
  s := regexp_replace(s, 'extensive experience with premier venues including', 'extensive experience with venues including', 'gi');
  s := regexp_replace(s, 'Aspen''s Premier Private Car & Limousine Service', 'Aspen''s Private Car and Limousine Service', 'gi');
  s := regexp_replace(s, 'Aspen’s Premier Private Car & Limousine Service', 'Aspen''s Private Car and Limousine Service', 'gi');
  s := regexp_replace(s, 'Aspen''s Premier Private Car', 'Aspen''s Private Car Service', 'gi');
  s := regexp_replace(s, 'Aspen’s Premier Private Car', 'Aspen''s Private Car Service', 'gi');
  s := regexp_replace(s, 'the Roaring Fork Valley''s premier limo service', 'a Roaring Fork Valley limo service', 'gi');
  s := regexp_replace(s, 'the Roaring Fork Valley’s premier limo service', 'a Roaring Fork Valley limo service', 'gi');
  s := regexp_replace(s, 'one of the world''s premier mountain destinations', 'a mountain destination', 'gi');
  s := regexp_replace(s, 'one of the world’s premier mountain destinations', 'a mountain destination', 'gi');
  s := regexp_replace(s, 'one of America''s premier culinary destinations', 'a culinary destination in America', 'gi');
  s := regexp_replace(s, 'one of America’s premier culinary destinations', 'a culinary destination in America', 'gi');
  s := regexp_replace(s, 'virtually every premier venue', 'venues', 'gi');
  s := regexp_replace(s, 'a premier ski destination', 'a ski destination', 'gi');
  s := regexp_replace(s, 'one of the premier wine and food events', 'a wine and food event', 'gi');
  s := regexp_replace(s, 'a premier destination for corporate retreats', 'a destination for corporate retreats', 'gi');
  s := regexp_replace(s, 'a premier wedding destination', 'a wedding destination', 'gi');
  s := regexp_replace(s, '3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5[[:space:]]*hours', '3.5–4 hours', 'gi');
  s := regexp_replace(s, 'Aspen''s most trusted luxury car service', 'a private car service built on local drivers and on-time pickups', 'gi');
  s := regexp_replace(s, 'Aspen’s most trusted luxury car service', 'a private car service built on local drivers and on-time pickups', 'gi');

  -- Passenger counts. "4–6 passengers" (a cost comparison) is not one of these phrases.
  s := regexp_replace(s, '\(6 pax\)', '(7 pax)', 'gi');
  s := regexp_replace(s, '\(14 pax\)', '(13 pax)', 'gi');
  s := regexp_replace(s, '14 pax', '13 pax', 'gi');
  s := regexp_replace(s, '14-passenger', '13-passenger', 'gi');
  s := regexp_replace(s, 'up to 14 passengers', 'up to 13 passengers', 'gi');
  s := regexp_replace(s, '14 passengers', '13 passengers', 'gi');
  s := regexp_replace(s, 'up to 14 in the party', 'up to 13 in the party', 'gi');
  s := regexp_replace(s, 'Group Sizes 2–14', 'Group Sizes 2–13', 'g');
  s := regexp_replace(s, 'Group Sizes 2-14', 'Group Sizes 2-13', 'g');
  s := regexp_replace(s, 'groups of 2–14', 'groups of 2–13', 'gi');
  s := regexp_replace(s, 'groups of 2-14', 'groups of 2-13', 'gi');
  s := regexp_replace(s, 'groups of 6–14', 'groups of 6–13', 'gi');
  s := regexp_replace(s, 'groups of 6-14', 'groups of 6-13', 'gi');
  s := replace(s, 'for groups up to 14)', 'for groups up to 13)');
  s := replace(s, 'for groups up to 14.', 'for groups up to 13.');
  s := regexp_replace(s, 'up to 6 passengers', 'up to 7 passengers', 'gi');
  s := regexp_replace(s, 'seats 6 passengers', 'seats 7 passengers', 'gi');

  -- Vehicle names, longest first, so "Executive Van" and "Mercedes" are not left behind.
  s := regexp_replace(s, 'Mercedes-Benz Sprinter Executive Vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinter Executive Van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter Executive Vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter Executive Van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinter vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinter van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinters', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Sprinter', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinters', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Mercedes Sprinter', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Luxury Sprinter vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Luxury Sprinter van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Sprinter vans', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Sprinter van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Sprinters', 'Ford Transit passenger vans', 'gi');
  s := regexp_replace(s, 'Sprinter', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Cadillac Escalade ESV', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Cadillac Escalades', 'Chevrolet Suburbans', 'gi');
  s := regexp_replace(s, 'Cadillac Escalade', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Escalades', 'Chevrolet Suburbans', 'gi');
  s := regexp_replace(s, 'Escalade', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Mercedes-Benz Ford Transit', 'Ford Transit', 'gi');
  s := regexp_replace(s, 'Mercedes Ford Transit', 'Ford Transit', 'gi');
  s := regexp_replace(s, 'Cadillac Chevrolet Suburban', 'Chevrolet Suburban', 'gi');
  s := regexp_replace(s, 'Ford Transit passenger van Executive Van', 'Ford Transit passenger van', 'gi');
  s := regexp_replace(s, 'Ford Transit passenger van van', 'Ford Transit passenger van', 'gi');

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
    coalesce(title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(meta_title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(meta_description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR content::text ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(schema_markup::text, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
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
    coalesce(title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(content, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(meta_title, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(meta_description, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(faqs::text, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
  );

UPDATE faqs
SET
  question = public.aal_round14_fix_text(question),
  answer = public.aal_round14_fix_text(answer)
WHERE site_key = 'alpenglow'
  AND (
    coalesce(question, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
    OR coalesce(answer, '') ~* 'escalade|sprinter|14-passenger|14\+|most trusted|after 14 years|4\.9|6 pax|14 pax|150 five-star|EGE\) in Glenwood Springs|Airport, located in Glenwood Springs|EGE is located in Glenwood|Eagle County Airport \(EGE\) near Glenwood'
  );

-- QA round 2. NOT APPLIED. KRIL is Rifle Garfield County Airport, not Colorado Springs.
-- "over 12 years" / "12 years of local expertise" become "since 2012" with no year count.
UPDATE blog_posts
SET
  content = regexp_replace(
    regexp_replace(
      regexp_replace(
        content,
        'Colorado Springs Airport \(KRIL\)',
        'Rifle Garfield County Airport (KRIL)',
        'gi'
      ),
      'for over 12 years',
      'since 2012',
      'gi'
    ),
    'the difference that 12 years of local expertise makes',
    'the difference that local expertise since 2012 makes',
    'gi'
  )
WHERE site_key = 'alpenglow'
  AND slug = 'aspen-airport-limo-service-luxury-transfers-since-2012'
  AND (
    content ILIKE '%colorado springs%'
    OR content ILIKE '%12 years%'
  );

-- RVA closure guide stored on the Alpenglow blog. Unpublish it. Do not rewrite it.
UPDATE blog_posts
SET status = 'draft'
WHERE site_key = 'alpenglow'
  AND lower(slug) = 'aspen-airport-closure-alternative-transportation-adventures';

-- Premier phrases and Denver "3.5–4.5 hours" on rows the first filter did not select.
-- Same function. Still site-scoped. Do not change blog slugs.
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
    coalesce(title, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(meta_title, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(meta_description, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR content::text ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(schema_markup::text, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
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
    coalesce(title, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(content, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(meta_title, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(meta_description, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(faqs::text, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
  );

UPDATE faqs
SET
  question = public.aal_round14_fix_text(question),
  answer = public.aal_round14_fix_text(answer)
WHERE site_key = 'alpenglow'
  AND (
    coalesce(question, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
    OR coalesce(answer, '') ~* '15\+[[:space:]]*years of mountain driving|premier|3\.5[[:space:]]*(–|—|-)[[:space:]]*4\.5'
  );

-- Verified active row. Name stays "Luxury Van" because RVA /fleet reads this table.
-- Capacity 14 contradicts the Ford Transit passenger van limit of 13.
UPDATE fleet_vehicles
SET capacity = 13
WHERE id = '77a5c467-5e5e-43ef-ba96-c3d8af691f6d'
  AND capacity = 14;

DROP FUNCTION public.aal_round14_fix_text(text);
