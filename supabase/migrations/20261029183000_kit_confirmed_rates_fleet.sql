-- Kit McLendon confirmed these facts on Oct 29, 2026.
-- NOT APPLIED by the agent. Do not run this from CI. A manager applies it in Supabase
-- after review, together with 20261023200000_aal_round14_claims.sql if that file
-- is still unapplied. This file does not depend on the round 14 function.
-- It does not invent review counts, ratings, or outfitter names.

-- Fleet: remove Escalade rows. Keep two Suburbans and one Transit active.
DELETE FROM fleet_vehicles
WHERE name ILIKE '%escalade%'
   OR name ILIKE '%cadillac%'
   OR coalesce(type, '') ILIKE '%escalade%';

UPDATE fleet_vehicles
SET
  name = 'Ford Transit passenger van',
  type = 'van',
  capacity = 13,
  description = 'Ford Transit passenger van seating 13. The fleet has one Transit.'
WHERE name ILIKE '%sprinter%'
   OR name ILIKE '%mercedes%'
   OR (name ILIKE '%transit%' AND capacity IS DISTINCT FROM 13);

UPDATE fleet_vehicles
SET capacity = 7
WHERE capacity = 6
  AND (
    name ILIKE '%suburban%'
    OR name ILIKE '%suv%'
    OR coalesce(type, '') ILIKE '%suv%'
  );

UPDATE fleet_vehicles
SET
  name = 'Chevrolet Suburban',
  type = 'suv',
  capacity = 7
WHERE name ILIKE '%suburban%';

WITH ranked AS (
  SELECT
    id,
    CASE
      WHEN name ILIKE '%transit%' THEN 'van'
      WHEN name ILIKE '%suburban%' THEN 'suv'
      ELSE 'other'
    END AS kind,
    row_number() OVER (
      PARTITION BY CASE
        WHEN name ILIKE '%transit%' THEN 'van'
        WHEN name ILIKE '%suburban%' THEN 'suv'
        ELSE 'other'
      END
      ORDER BY created_at NULLS LAST, id
    ) AS n
  FROM fleet_vehicles
)
UPDATE fleet_vehicles AS f
SET is_active = false
FROM ranked AS r
WHERE f.id = r.id
  AND (r.kind = 'other' OR (r.kind = 'suv' AND r.n > 2) OR (r.kind = 'van' AND r.n > 1));

INSERT INTO fleet_vehicles (name, type, capacity, description, is_active)
SELECT
  'Chevrolet Suburban',
  'suv',
  7,
  'Chevrolet Suburban seating 7 passengers. The fleet has two Suburbans.',
  true
FROM generate_series(
  1,
  GREATEST(
    0,
    2 - (SELECT count(*)::int FROM fleet_vehicles WHERE is_active AND name ILIKE '%suburban%')
  )
);

INSERT INTO fleet_vehicles (name, type, capacity, description, is_active)
SELECT
  'Ford Transit passenger van',
  'van',
  13,
  'Ford Transit passenger van seating 13. The fleet has one Transit.',
  true
WHERE (SELECT count(*) FROM fleet_vehicles WHERE is_active AND name ILIKE '%transit%') = 0;

-- Airport rates Kit confirmed. Other routes are left alone.
UPDATE pricing_routes
SET
  suv_price = 720,
  sprinter_price = 1200,
  price_note = '$1,200'
WHERE category LIKE 'airport%'
  AND (
    route_name ILIKE '%eagle%' OR route_name ILIKE '%ege%' OR origin ILIKE '%eagle%' OR origin ILIKE '%ege%' OR destination ILIKE '%eagle%' OR destination ILIKE '%ege%'
    OR route_name ILIKE '%rifle%' OR route_name ILIKE '%kril%' OR route_name ILIKE '%ril%' OR origin ILIKE '%rifle%' OR destination ILIKE '%rifle%'
  )
  AND route_name NOT ILIKE '%vail%'
  AND coalesce(origin, '') NOT ILIKE '%vail%'
  AND coalesce(destination, '') NOT ILIKE '%vail%';

UPDATE pricing_routes
SET
  suv_price = 1375,
  sprinter_price = 1600,
  price_note = '$1,600'
WHERE category LIKE 'airport%'
  AND (
    route_name ILIKE '%denver%' OR route_name ILIKE '%den %' OR route_name ILIKE '% den%' OR route_name ILIKE 'den %'
    OR origin ILIKE '%denver%' OR destination ILIKE '%denver%'
    OR origin ILIKE '%(den)%' OR destination ILIKE '%(den)%'
  )
  AND route_name NOT ILIKE '%centennial%'
  AND coalesce(origin, '') NOT ILIKE '%centennial%'
  AND coalesce(destination, '') NOT ILIKE '%centennial%'
  AND route_name NOT ILIKE '%kapa%';

UPDATE pricing_policies
SET title = 'One-way SUV rates each way: Eagle and Rifle $720, Denver $1,375, Grand Junction $950. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally.'
WHERE title ILIKE '%eagle%'
  AND (title ILIKE '%quoted%' OR title ILIKE '%request a quote%' OR title ILIKE '%$720%' OR title ILIKE '%$120%');

-- Hide the street address. Keep city-level service areas.
UPDATE site_settings
SET address = regexp_replace(address, '212 Woody Creek Plaza[, ]*', '', 'gi')
WHERE address ILIKE '%woody creek plaza%';

UPDATE site_settings
SET address = 'Service areas: Aspen, Snowmass Village, Basalt, Carbondale, Glenwood Springs, Gypsum, Rifle, and Denver'
WHERE site_key = 'alpenglow'
  AND (
    btrim(address) = ''
    OR address ILIKE '%woody creek%'
  );

UPDATE pages
SET
  content = regexp_replace(content::text, '212 Woody Creek Plaza[, ]*', '', 'gi')::jsonb
WHERE content::text ILIKE '%woody creek plaza%';

UPDATE pages
SET schema_markup = regexp_replace(schema_markup::text, '212 Woody Creek Plaza[, ]*', '', 'gi')::jsonb
WHERE schema_markup IS NOT NULL
  AND schema_markup::text ILIKE '%woody creek plaza%';

UPDATE faqs
SET
  question = regexp_replace(question, '212 Woody Creek Plaza[, ]*', '', 'gi'),
  answer = regexp_replace(answer, '212 Woody Creek Plaza[, ]*', '', 'gi')
WHERE question ILIKE '%woody creek plaza%'
   OR answer ILIKE '%woody creek plaza%';

UPDATE blog_posts
SET content = regexp_replace(content, '212 Woody Creek Plaza[, ]*', '', 'gi')
WHERE content ILIKE '%woody creek plaza%';

-- Drop unverified review counts. Do not substitute another rating.
UPDATE pages
SET content = replace(replace(replace(content::text,
  'Over 150 five-star reviews from guests who trust us with their most important transportation needs.',
  'Guests book airport transfers, ski days, weddings, and corporate travel.'),
  'Rated 5.0 by guests on Google (5 reviews).',
  'Guests book airport transfers, ski days, weddings, and corporate travel.'),
  'Over 200 five-star reviews from guests who came as visitors and left as friends of the valley.',
  'CO Licensed Outfitter OUT.0003060. CO River License 620.')::jsonb
WHERE content::text ILIKE '%five-star%'
   OR content::text ILIKE '%5.0 by guests on Google%';

-- EGE is in Gypsum. Leave Glenwood Springs the city, the canyon, and the hot springs alone.
UPDATE pages
SET content = replace(replace(replace(content::text,
  'Eagle County Regional Airport (EGE) in Glenwood Springs', 'Eagle County Regional Airport (EGE) in Gypsum'),
  'Eagle County Airport (EGE) near Glenwood Springs', 'Eagle County Airport (EGE) in Gypsum'),
  'EGE is located in Glenwood Springs', 'EGE is located in Gypsum')::jsonb
WHERE site_id = 'alpenglow'
  AND content::text ILIKE '%glenwood%'
  AND content::text ~* 'EGE|Eagle County';

-- Passenger counts only. Escalade wording is handled by 20261023200000, which
-- avoids rewriting filenames. This file deletes Escalade fleet rows above.
UPDATE pages
SET content = replace(replace(content::text, '(6 pax)', '(7 pax)'), 'up to 6 passengers', 'up to 7 passengers')::jsonb
WHERE site_id = 'alpenglow'
  AND content::text ~* '\(6 pax\)|up to 6 passengers';

UPDATE faqs
SET
  question = replace(question, '(6 pax)', '(7 pax)'),
  answer = replace(replace(answer, '(6 pax)', '(7 pax)'), 'up to 6 passengers', 'up to 7 passengers')
WHERE site_key = 'alpenglow'
  AND (question ILIKE '%(6 pax)%' OR answer ILIKE '%(6 pax)%' OR answer ILIKE '%up to 6 passengers%');

-- Scenic tour row 88b4bc72. There is no adventures row whose name contains "raft".
-- Snowshoeing is a winter_adventures title, not an adventures name.
-- camping_packages has no rows; overnight price is the Elevated Camping adventure.
UPDATE adventures
SET
  name = 'Scenic & Wildlife Tours',
  price = 750,
  description = 'Half-day scenic and wildlife tour: $750.',
  image_url = '/images/adventures/scenic-wildlife-tour.png',
  long_description = 'Half-day scenic and wildlife tour: $750.'
WHERE id = '88b4bc72-49b7-4552-b4e6-5aa9db5ee05a'
   OR name ILIKE '%escalade%'
   OR coalesce(image_url, '') ILIKE '%escalade%';

UPDATE adventures
SET
  price = 600,
  description = trim(both ' ' FROM coalesce(description, '') || ' Horseback: $600. Horseback rides go through a partner local outfitter.')
WHERE name ILIKE '%horseback%'
  AND description NOT ILIKE '%partner local outfitter%';

UPDATE adventures
SET price = 600
WHERE name ILIKE '%hik%';

UPDATE adventures
SET price = 1500
WHERE id = 'd999b4ae-3341-4cab-8c3d-05d6865b01df'
   OR name ILIKE '%camp%';

UPDATE winter_adventures
SET price_from = 500
WHERE title ILIKE '%snowshoe%';
