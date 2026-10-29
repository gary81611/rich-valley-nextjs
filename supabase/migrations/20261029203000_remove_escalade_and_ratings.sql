-- Forward fix. 20261023200000 is already applied in production (recorded as 20261024052145).
-- Do not edit that file. This migration is NOT applied by the agent.
-- It removes public Escalade wording and image paths, and drops unverified ratings.
-- It does not add a review count or a star rating.

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
      'Two Chevrolet Suburbans (7 passengers each) and one Ford Transit passenger van (13 passengers).'
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
    'Two Chevrolet Suburbans (7 passengers each) and one Ford Transit passenger van (13 passengers).'),
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
