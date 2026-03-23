-- Pages CMS table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL CHECK (site_id IN ('rva', 'alpenglow')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  template_type TEXT NOT NULL DEFAULT 'service' CHECK (template_type IN ('service', 'location', 'faq', 'landing')),
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  schema_markup JSONB,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS pages_site_slug ON pages(site_id, slug);
CREATE INDEX IF NOT EXISTS pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS pages_site_status ON pages(site_id, status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pages_updated_at ON pages;
CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_pages_updated_at();

-- Navigation table
CREATE TABLE IF NOT EXISTS navigation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL CHECK (site_id IN ('rva', 'alpenglow')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  parent_id UUID REFERENCES navigation(id) ON DELETE SET NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS navigation_site_position ON navigation(site_id, position);

-- RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "pages_read_published"
  ON pages FOR SELECT
  USING (status = 'published' OR (auth.role() = 'authenticated'));

CREATE POLICY IF NOT EXISTS "pages_insert_authenticated"
  ON pages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "pages_update_authenticated"
  ON pages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "pages_delete_authenticated"
  ON pages FOR DELETE
  USING (auth.role() = 'authenticated');

ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "navigation_read_all"
  ON navigation FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "navigation_write_authenticated"
  ON navigation FOR ALL
  USING (auth.role() = 'authenticated');
