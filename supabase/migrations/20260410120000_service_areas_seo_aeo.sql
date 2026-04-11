-- AEO/SEO fields for service area landings (used heavily on AAL /service-areas/[slug])
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS faq_schema JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN service_areas.meta_title IS 'Optional <title>; falls back to template when null';
COMMENT ON COLUMN service_areas.meta_description IS 'Meta description (~150–160 chars) for SERP + OG';
COMMENT ON COLUMN service_areas.faq_schema IS 'FAQPage JSON-LD: [{ "question": "...", "answer": "..." }]';
