-- GEO content blocks for AI/answer engine optimization
CREATE TABLE geo_content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  block_type TEXT NOT NULL CHECK (block_type IN ('fact', 'statistic', 'definition', 'comparison', 'how_to', 'local_info')),
  question TEXT DEFAULT '',
  answer TEXT NOT NULL,
  source_citation TEXT DEFAULT '',
  target_queries TEXT[] DEFAULT '{}',
  display_on_page TEXT DEFAULT '/',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER geo_content_updated_at BEFORE UPDATE ON geo_content_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
ALTER TABLE geo_content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON geo_content_blocks FOR SELECT USING (is_active = true);
CREATE POLICY "Auth full access" ON geo_content_blocks FOR ALL USING (auth.role() = 'authenticated');
