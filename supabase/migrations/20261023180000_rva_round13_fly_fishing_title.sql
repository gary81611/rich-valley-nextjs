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

UPDATE blog_posts
SET content = replace(content, 'After 14 years of guiding here', 'Since 2012')
WHERE site_key = 'rva' AND id = '7aeef53b-4999-4dd0-9645-c0733ebb3317';

UPDATE blog_posts
SET content = replace(
  content,
  'we wanted to create something that truly shows what makes our adventures unique.',
  'we wanted to create something that shows the trips we guide.'
)
WHERE site_key = 'rva' AND id = '3086cbb0-ea13-47f0-aa19-4bf2db4b8fc1';

UPDATE blog_posts
SET content = replace(
  content,
  'in a way that''s uniquely ours.',
  'in a small mountain town.'
)
WHERE site_key = 'rva' AND id = '9d77a4f6-8228-4e54-9ab5-01914c7b0925';

UPDATE blog_posts
SET content = replace(
  content,
  'Aspen and the surrounding valley have a unique combination of assets that most corporate retreat destinations don''t offer simultaneously.',
  'Aspen and the surrounding valley combine guided fishing, hiking, and time on the river in the same day.'
)
WHERE site_key = 'rva' AND id = '0d284cf0-35a2-4775-8b3e-b537d658b9ba';

UPDATE blog_posts
SET content = replace(
  content,
  'There''s something uniquely bonding about conquering mountain trails together',
  'Groups hike mountain trails together'
)
WHERE site_key = 'rva' AND id = '8af65fe5-b495-4287-adf7-1c776d8f23bd';

-- Round 13b. Still NOT APPLIED. Drops superlatives already removed in code.
-- "uniquely effective" is the published corporate-team-building post (DB only).
-- Do not invent a new ranking. The replacement only says the group spends the day on the water.

UPDATE blog_posts
SET content = replace(
  content,
  'guided fly fishing is uniquely effective at creating collaboration across hierarchies',
  'guided fly fishing is a day on the water with the group'
)
WHERE site_key = 'rva'
  AND slug = 'corporate-team-building-roaring-fork-valley'
  AND content LIKE '%uniquely effective%';

-- pages.content is jsonb. Cast keeps the row valid. updated_at is set by pages_updated_at.
-- Heading only. The Frying Pan is the tailwater below Ruedi Reservoir, which the page already says.

UPDATE pages
SET content = replace(
  content::text,
  'The Frying Pan River — Colorado''s Premier Tailwater Fishery',
  'The Frying Pan River — Tailwater below Ruedi Reservoir'
)::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Colorado''s Premier Tailwater Fishery%';

UPDATE pages
SET content = replace(
  content::text,
  'Ruedi Reservoir — Aspen''s Premier SUP Destination',
  'Ruedi Reservoir'
)::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Aspen''s Premier SUP Destination%';

UPDATE pages
SET content = replace(
  content::text,
  'Aspen''s Premier SUP Destination',
  'Ruedi Reservoir'
)::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Aspen''s Premier SUP Destination%';

-- Curly apostrophe, if the stored heading uses one. Then collapse a doubled reservoir name.
UPDATE pages
SET content = replace(
  content::text,
  'Aspen’s Premier SUP Destination',
  'Ruedi Reservoir'
)::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Aspen’s Premier SUP Destination%';

UPDATE pages
SET content = replace(content::text, 'Ruedi Reservoir — Ruedi Reservoir', 'Ruedi Reservoir')::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Ruedi Reservoir — Ruedi Reservoir%';

UPDATE pages
SET content = replace(
  content::text,
  'Colorado’s Premier Tailwater Fishery',
  'Tailwater below Ruedi Reservoir'
)::jsonb
WHERE site_id = 'rva'
  AND content::text LIKE '%Colorado’s Premier Tailwater Fishery%';
