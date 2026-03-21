-- SEO page meta settings
CREATE TABLE seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  page_slug TEXT NOT NULL DEFAULT '/',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '' CHECK (char_length(meta_description) <= 160),
  meta_keywords TEXT DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  no_index BOOLEAN DEFAULT false,
  no_follow BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_key, page_slug)
);
CREATE TRIGGER seo_pages_updated_at BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON seo_pages FOR SELECT USING (true);
CREATE POLICY "Auth full access" ON seo_pages FOR ALL USING (auth.role() = 'authenticated');
