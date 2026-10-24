-- RVA Round 13. NOT APPLIED by the agent.
-- The public /fly-fishing page is app/rva/fly-fishing/page.tsx and does not read this row.
-- Apply only if you want the stored CMS title to match the page, so a later reader cannot serve the old title.
-- site_id is the pages column (not site_key). updated_at is set by pages_updated_at.

UPDATE pages
SET
  title = 'Aspen Fly Fishing',
  meta_title = 'Aspen Fly Fishing Guides | Roaring Fork, Fryingpan & Private Water | Rich Valley Adventures',
  content = CASE
    WHEN content ? 'hero_title'
      THEN jsonb_set(content, '{hero_title}', to_jsonb('Aspen Fly Fishing'::text))
    ELSE content
  END
WHERE site_id = 'rva'
  AND slug = 'fly-fishing';

-- Optional, only if site_settings.stats for RVA still stores "14+".
-- Render-time code already shows "2012" / "Guiding since" when it sees that phrase.
-- Inspect before running:
-- SELECT site_key, stats, settings FROM site_settings WHERE site_key = 'rva';

-- Blog rows below are published RVA copy. Do not run until the substring still matches.
-- updated_at will be overwritten by update_updated_at().
-- Left alone on purpose: habitat, wildfire, seasonal, and "original holiday plan" uses of those words.

-- Match is case-insensitive (regexp_replace 'gi' plus an ILIKE guard). Still NOT APPLIED.

UPDATE blog_posts
SET content = regexp_replace(content, 'After 14 years of guiding here', 'Since 2012', 'gi')
WHERE site_key = 'rva'
  AND id = '7aeef53b-4999-4dd0-9645-c0733ebb3317'
  AND content ILIKE '%after 14 years of guiding here%';

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'we wanted to create something that truly shows what makes our adventures unique\.',
  'we wanted to create something that shows the trips we guide.',
  'gi'
)
WHERE site_key = 'rva'
  AND id = '3086cbb0-ea13-47f0-aa19-4bf2db4b8fc1'
  AND content ILIKE '%what makes our adventures unique%';

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'in a way that[''’]s uniquely ours\.',
  'in a small mountain town.',
  'gi'
)
WHERE site_key = 'rva'
  AND id = '9d77a4f6-8228-4e54-9ab5-01914c7b0925'
  AND content ILIKE '%uniquely ours%';

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'Aspen and the surrounding valley have a unique combination of assets that most corporate retreat destinations don[''’]t offer simultaneously\.',
  'Aspen and the surrounding valley combine guided fishing, hiking, and time on the river in the same day.',
  'gi'
)
WHERE site_key = 'rva'
  AND id = '0d284cf0-35a2-4775-8b3e-b537d658b9ba'
  AND content ILIKE '%unique combination of assets%';

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'There[''’]s something uniquely bonding about conquering mountain trails together',
  'Groups hike mountain trails together',
  'gi'
)
WHERE site_key = 'rva'
  AND id = '8af65fe5-b495-4287-adf7-1c776d8f23bd'
  AND content ILIKE '%uniquely bonding%';

-- Round 13b. Still NOT APPLIED. Drops superlatives already removed in code.
-- "uniquely effective" is the published corporate-team-building post (DB only).
-- Do not invent a new ranking. The replacement only says the group spends the day on the water.

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'guided fly fishing is uniquely effective at creating collaboration across hierarchies',
  'guided fly fishing is a day on the water with the group',
  'gi'
)
WHERE site_key = 'rva'
  AND slug = 'corporate-team-building-roaring-fork-valley'
  AND content ILIKE '%uniquely effective%';

-- Family fly-fishing post. "After twelve years…" becomes "since 2012" with no year count.
UPDATE blog_posts
SET content = regexp_replace(
  content,
  'After twelve years of guiding families through Colorado[''’]s Gold Medal waters here in Aspen',
  'Since 2012, guiding families through Colorado''s Gold Medal waters here in Aspen',
  'gi'
)
WHERE site_key = 'rva'
  AND slug = 'family-fly-fishing-trips-aspen-rich-valley-adventures'
  AND content ILIKE '%twelve years of guiding families%';

-- Lowercase (and any case) "premier" on the fly-fishing and wildlife posts only.
-- Neutral wording. No new ranking.
UPDATE blog_posts
SET content = regexp_replace(
  content,
  'one of the premier fly fishing destinations',
  'a fly fishing destination',
  'gi'
)
WHERE site_key = 'rva'
  AND slug = 'fly-fishing-aspen-roaring-fork-valley'
  AND content ILIKE '%premier fly fishing%';

UPDATE blog_posts
SET content = regexp_replace(
  content,
  'one of Colorado[''’]s premier wildlife destinations',
  'a place to see wildlife in Colorado',
  'gi'
)
WHERE site_key = 'rva'
  AND slug = 'aspen-wildlife-tours-nature-experiences-rich-valley'
  AND content ILIKE '%premier wildlife%';

-- pages.content is jsonb. Cast keeps the row valid. updated_at is set by pages_updated_at.
-- Heading only. The Frying Pan is the tailwater below Ruedi Reservoir, which the page already says.
-- Straight or curly apostrophe. Match is case-insensitive.

UPDATE pages
SET content = regexp_replace(
  content::text,
  'The Frying Pan River — Colorado[''’]s Premier Tailwater Fishery',
  'The Frying Pan River — Tailwater below Ruedi Reservoir',
  'gi'
)::jsonb
WHERE site_id = 'rva'
  AND content::text ILIKE '%premier tailwater fishery%';

UPDATE pages
SET content = regexp_replace(
  content::text,
  'Ruedi Reservoir — Aspen[''’]s Premier SUP Destination',
  'Ruedi Reservoir',
  'gi'
)::jsonb
WHERE site_id = 'rva'
  AND content::text ILIKE '%premier sup destination%';

UPDATE pages
SET content = regexp_replace(
  content::text,
  'Aspen[''’]s Premier SUP Destination',
  'Ruedi Reservoir',
  'gi'
)::jsonb
WHERE site_id = 'rva'
  AND content::text ILIKE '%premier sup destination%';

UPDATE pages
SET content = regexp_replace(
  content::text,
  'Ruedi Reservoir — Ruedi Reservoir',
  'Ruedi Reservoir',
  'gi'
)::jsonb
WHERE site_id = 'rva'
  AND content::text ILIKE '%Ruedi Reservoir — Ruedi Reservoir%';

UPDATE pages
SET content = regexp_replace(
  content::text,
  'Colorado[''’]s Premier Tailwater Fishery',
  'Tailwater below Ruedi Reservoir',
  'gi'
)::jsonb
WHERE site_id = 'rva'
  AND content::text ILIKE '%premier tailwater fishery%';

-- Corporate team-building post (published slug). "After twelve years of guiding
-- corporate groups…" becomes since-2012 wording with no year count.
-- Different sentence from the family post above. Still NOT APPLIED.
UPDATE blog_posts
SET content = regexp_replace(
  content,
  'After twelve years of guiding corporate groups',
  'Since 2012, while guiding corporate groups',
  'gi'
)
WHERE site_key = 'rva'
  AND (
    slug = 'corporate-team-building-aspen-outdoor-adventures-rva'
    OR content ILIKE '%twelve years of guiding corporate groups%'
  )
  AND content ILIKE '%twelve years of guiding corporate groups%';
