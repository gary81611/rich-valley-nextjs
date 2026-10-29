-- Forward fix. 20261023200000 is already applied in production (recorded as 20261024052145).
-- Do not edit that file. This migration is NOT applied by the agent.
-- It removes Escalade from RVA/AAL text and JSON columns, and drops unverified ratings.
-- It does not add a review count or a star rating.
-- cc_* tables, customer submissions, and the testimonials table are left out of the sweep.
-- Slug columns are left out so a path token is not rewritten inside a slug.
-- Customer quotes are not rewritten.
-- testimonials.verified defaults false. No row is set verified.
-- Four unconfirmed quotes are hidden with is_active = false. Their text is left as written.

-- Standalone word only. Same boundary as lib/aal-public-copy.ts:
-- (?<![\w/.-])Escalades?(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))
-- Postgres has no lookaround, so the characters on each side are checked here.
CREATE OR REPLACE FUNCTION public.kit_replace_standalone_escalade(t text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  s text := t;
  i int := 1;
  n int;
  len int;
  prev text;
  nxt text;
  tail text;
  repl text;
BEGIN
  IF s IS NULL OR s = '' OR position('escalade' IN lower(s)) = 0 THEN
    RETURN s;
  END IF;

  WHILE i <= char_length(s) LOOP
    n := position('escalade' IN lower(substring(s FROM i)));
    IF n = 0 THEN
      EXIT;
    END IF;
    n := i + n - 1;
    len := 8;
    IF lower(substring(s FROM n FOR 9)) = 'escalades' THEN
      len := 9;
    END IF;
    prev := CASE WHEN n = 1 THEN '' ELSE substring(s FROM n - 1 FOR 1) END;
    nxt := substring(s FROM n + len FOR 1);
    tail := substring(s FROM n + len);
    IF prev ~ '[[:alnum:]/._-]'
       OR nxt ~ '[[:alnum:]/_-]'
       OR tail ~* '^\.(png|jpe?g|webp|svg|gif)' THEN
      i := n + 1;
      CONTINUE;
    END IF;
    repl := CASE WHEN len = 9 THEN 'SUVs' ELSE 'vehicle' END;
    s := substring(s FROM 1 FOR n - 1) || repl || substring(s FROM n + len);
    i := n + char_length(repl);
  END LOOP;
  RETURN s;
END;
$$;

CREATE OR REPLACE FUNCTION public.kit_strip_escalade(t text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  s text := t;
BEGIN
  IF s IS NULL OR s = '' OR s !~* 'escalade|scenic-drives' THEN
    RETURN s;
  END IF;

  -- Path/slug token first, before any Escalade word replacement.
  s := regexp_replace(s, 'scenic-escalade-tours', 'scenic-wildlife-tours', 'gi');
  s := replace(s, 'scenic-escalade.png', 'scenic-wildlife-tour.png');
  s := replace(s, '/images/fleet/escalade.png', '/images/logos/alpenglow-logo.png');
  s := replace(s, '/images/alpenglow/escalade.png', '/images/logos/alpenglow-logo.png');
  s := replace(s, '/tours/scenic-drives', '/adventures/scenic-wildlife-tours');
  s := replace(s, 'Scenic Escalade Tours', 'Scenic and Wildlife Tours');
  s := replace(s, 'scenic Escalade tours', 'scenic and wildlife tours');
  s := replace(s, 'Cadillac Escalade (6 passengers) and Mercedes Sprinter van (14 passengers)', 'Chevrolet Suburban (7 passengers) and a Ford Transit Passenger Van (13 passengers)');
  s := replace(s, 'Cadillac Escalade', 'Chevrolet Suburban');
  s := public.kit_replace_standalone_escalade(s);
  RETURN s;
END;
$$;

-- Every public text / jsonb column on RVA and AAL tables.
-- Not cc_*, not customer mail, not testimonials, not slug columns.
DO $$
DECLARE
  col record;
BEGIN
  FOR col IN
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name NOT LIKE 'cc\_%'
      AND table_name NOT IN ('contact_submissions', 'newsletter_subscribers', 'testimonials')
      AND column_name <> 'slug'
      AND column_name NOT LIKE '%\_slug' ESCAPE '\'
      AND data_type IN ('text', 'character varying', 'jsonb')
  LOOP
    IF col.data_type = 'jsonb' THEN
      EXECUTE format(
        'UPDATE %I SET %I = public.kit_strip_escalade(%I::text)::jsonb WHERE %I::text ~* %L',
        col.table_name, col.column_name, col.column_name, col.column_name, 'escalade|scenic-drives'
      );
    ELSE
      EXECUTE format(
        'UPDATE %I SET %I = public.kit_strip_escalade(%I) WHERE %I ~* %L',
        col.table_name, col.column_name, col.column_name, col.column_name, 'escalade|scenic-drives'
      );
    END IF;
  END LOOP;
END $$;

DROP FUNCTION public.kit_strip_escalade(text);
DROP FUNCTION public.kit_replace_standalone_escalade(text);

-- Public pages show a quote only when is_active and verified are both true.
-- The column is absent until this migration runs. Do not mark any row verified.
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;

-- Hide unconfirmed quotes. Leave the quote text unchanged.
UPDATE testimonials
SET is_active = false
WHERE id IN (
  '4654459d-8e4e-4012-ac91-b21464fd5e3e',
  '2f178ca2-cb6a-424d-a90a-50f0782861b1',
  '6fd684c9-22ea-4b34-8864-b10ad5b89cdc',
  '39fca401-b360-472d-864d-1c12b9e375cc'
);

-- Hits this sweep cleans, from a read of production on Oct 29, 2026:
-- adventures.name, adventures.description, adventures.image_url
-- blog_posts.content, blog_posts.internal_links, blog_posts.featured_image_url
-- faqs.answer
-- geo_content_blocks.answer
-- testimonials is not swept. verified stays false for every row.
-- These ids are set is_active = false, quote text unchanged:
-- 4654459d-8e4e-4012-ac91-b21464fd5e3e, 2f178ca2-cb6a-424d-a90a-50f0782861b1,
-- 6fd684c9-22ea-4b34-8864-b10ad5b89cdc, 39fca401-b360-472d-864d-1c12b9e375cc.

-- Scenic tour photo and copy. Row checked in production: 88b4bc72.
UPDATE adventures
SET
  name = 'Scenic & Wildlife Tours',
  price = 750,
  description = 'Half-day scenic and wildlife tour: $750.',
  long_description = 'Half-day scenic and wildlife tour: $750.',
  image_url = '/images/adventures/scenic-wildlife-tour.png'
WHERE id = '88b4bc72-49b7-4552-b4e6-5aa9db5ee05a'
   OR name ILIKE '%escalade%'
   OR coalesce(image_url, '') ILIKE '%escalade%'
   OR coalesce(description, '') ILIKE '%escalade%'
   OR coalesce(long_description, '') ILIKE '%escalade%';

UPDATE fleet_vehicles
SET image_url = ''
WHERE coalesce(image_url, '') ILIKE '%escalade%';

UPDATE blog_posts
SET
  content = replace(replace(content, 'Scenic Escalade Tours', 'Scenic and Wildlife Tours'), 'scenic Escalade tours', 'scenic and wildlife tours'),
  title = replace(title, 'Scenic Escalade Tours', 'Scenic and Wildlife Tours'),
  meta_title = replace(coalesce(meta_title, ''), 'Scenic Escalade Tours', 'Scenic and Wildlife Tours'),
  meta_description = replace(coalesce(meta_description, ''), 'Scenic Escalade Tours', 'Scenic and Wildlife Tours')
WHERE content ILIKE '%escalade%'
   OR title ILIKE '%escalade%'
   OR coalesce(meta_title, '') ILIKE '%escalade%'
   OR coalesce(meta_description, '') ILIKE '%escalade%';

UPDATE blog_posts
SET featured_image_url = '/images/adventures/scenic-wildlife-tour.png'
WHERE featured_image_url ILIKE '%scenic-escalade%';

UPDATE blog_posts
SET featured_image_url = '/images/logos/alpenglow-logo.png'
WHERE featured_image_url ILIKE '%escalade%';

-- About feature cards. AAL title was written by the applied claims migration.
-- RVA title was never rewritten because that migration is AAL-only.
UPDATE pages
SET content = replace(
  replace(
    replace(
      replace(
        content::text,
        '5.0 on Google',
        'Fleet'
      ),
      'Rated 5.0 by guests on Google (5 reviews).',
      'Two Chevrolet Suburbans (7 passengers each) and one Ford Transit Passenger Van (13 passengers).'
    ),
    '4.9-Star Rated',
    'Licenses'
  ),
  'Over 200 five-star reviews from guests who came as visitors and left as friends of the valley.',
  'CO Licensed Outfitter OUT.0003060. CO River License 620.'
)::jsonb
WHERE content::text ILIKE '%5.0 on Google%'
   OR content::text ILIKE '%(5 reviews)%'
   OR content::text ILIKE '%4.9-Star Rated%'
   OR content::text ILIKE '%five-star reviews%';

UPDATE faqs
SET
  question = replace(replace(replace(question, '5.0 on Google', 'Fleet'), '4.9-Star Rated', 'Licenses'), '(5 reviews)', ''),
  answer = replace(replace(replace(replace(answer,
    'Rated 5.0 by guests on Google (5 reviews).',
    'Two Chevrolet Suburbans (7 passengers each) and one Ford Transit Passenger Van (13 passengers).'),
    '5.0 on Google', 'Fleet'),
    '4.9-Star Rated', 'Licenses'),
    'Over 200 five-star reviews from guests who came as visitors and left as friends of the valley.',
    'CO Licensed Outfitter OUT.0003060. CO River License 620.')
WHERE question ILIKE '%5.0%'
   OR answer ILIKE '%5.0%'
   OR question ILIKE '%4.9%'
   OR answer ILIKE '%4.9%'
   OR question ILIKE '%five-star%'
   OR answer ILIKE '%five-star%'
   OR question ILIKE '%(5 reviews)%'
   OR answer ILIKE '%(5 reviews)%';
