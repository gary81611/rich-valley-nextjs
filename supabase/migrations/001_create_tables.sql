-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- site_settings
-- ==========================================
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  brand_name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  social_links JSONB DEFAULT '{}',
  colors JSONB DEFAULT '{}',
  logo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_key)
);
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- adventures (RVA)
-- ==========================================
CREATE TABLE adventures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  price NUMERIC(10,2) DEFAULT 0,
  difficulty TEXT DEFAULT 'moderate',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER adventures_updated_at BEFORE UPDATE ON adventures FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- services (Alpenglow)
-- ==========================================
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_from NUMERIC(10,2) DEFAULT 0,
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- fleet_vehicles (Alpenglow)
-- ==========================================
CREATE TABLE fleet_vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT '',
  capacity INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER fleet_vehicles_updated_at BEFORE UPDATE ON fleet_vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- testimonials (both sites)
-- ==========================================
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- gallery_images (both sites)
-- ==========================================
CREATE TABLE gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- faqs (both sites)
-- ==========================================
CREATE TABLE faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- service_areas (both sites)
-- ==========================================
CREATE TABLE service_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER service_areas_updated_at BEFORE UPDATE ON service_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- RLS Policies — all tables
-- ==========================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Public read for active records
CREATE POLICY "Public read active" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read active" ON adventures FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON fleet_vehicles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active" ON service_areas FOR SELECT USING (is_active = true);

-- Authenticated users get full access
CREATE POLICY "Auth full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON adventures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON fleet_vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON service_areas FOR ALL USING (auth.role() = 'authenticated');
