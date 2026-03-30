-- Admin Content Tables for RVA/AAL
-- Guides, Winter Adventures, Locations, Camping, Pricing, Destinations, USGS Stations

-- Guides (RVA)
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  photo_url TEXT,
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_guides" ON guides;
CREATE POLICY "public_read_guides" ON guides FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_guides" ON guides;
CREATE POLICY "admin_all_guides" ON guides FOR ALL USING (true);

-- Winter Adventures (RVA)
CREATE TABLE IF NOT EXISTS winter_adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  difficulty TEXT,
  season_start TEXT,
  season_end TEXT,
  image_url TEXT,
  price_from NUMERIC,
  price_note TEXT,
  included_items TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE winter_adventures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_winter" ON winter_adventures;
CREATE POLICY "public_read_winter" ON winter_adventures FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_winter" ON winter_adventures;
CREATE POLICY "admin_all_winter" ON winter_adventures FOR ALL USING (true);

-- Locations (RVA)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  activities TEXT[] DEFAULT '{}',
  rivers TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  drive_time TEXT,
  hero_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_locations" ON locations;
CREATE POLICY "public_read_locations" ON locations FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_locations" ON locations;
CREATE POLICY "admin_all_locations" ON locations FOR ALL USING (true);

-- Camping Packages (RVA)
CREATE TABLE IF NOT EXISTS camping_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_from NUMERIC,
  price_note TEXT,
  included_items TEXT[] DEFAULT '{}',
  image_url TEXT,
  duration TEXT,
  capacity TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE camping_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_camping" ON camping_packages;
CREATE POLICY "public_read_camping" ON camping_packages FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_camping" ON camping_packages;
CREATE POLICY "admin_all_camping" ON camping_packages FOR ALL USING (true);

-- Pricing Routes (AAL)
CREATE TABLE IF NOT EXISTS pricing_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  route_name TEXT NOT NULL,
  origin TEXT,
  destination TEXT,
  distance TEXT,
  drive_time TEXT,
  suv_price NUMERIC,
  sprinter_price NUMERIC,
  price_note TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pricing_routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pricing_routes" ON pricing_routes;
CREATE POLICY "public_read_pricing_routes" ON pricing_routes FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_pricing_routes" ON pricing_routes;
CREATE POLICY "admin_all_pricing_routes" ON pricing_routes FOR ALL USING (true);

-- Pricing Policies (AAL)
CREATE TABLE IF NOT EXISTS pricing_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pricing_policies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pricing_policies" ON pricing_policies;
CREATE POLICY "public_read_pricing_policies" ON pricing_policies FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_pricing_policies" ON pricing_policies;
CREATE POLICY "admin_all_pricing_policies" ON pricing_policies FOR ALL USING (true);

-- Destinations (AAL)
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  highlights TEXT[] DEFAULT '{}',
  site_key TEXT NOT NULL DEFAULT 'alpenglow',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_destinations" ON destinations;
CREATE POLICY "public_read_destinations" ON destinations FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_destinations" ON destinations;
CREATE POLICY "admin_all_destinations" ON destinations FOR ALL USING (true);

-- USGS Stations (RVA conditions)
CREATE TABLE IF NOT EXISTS usgs_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parameter_codes TEXT[] DEFAULT '{00060,00010}',
  low_threshold NUMERIC DEFAULT 100,
  good_threshold NUMERIC DEFAULT 400,
  high_threshold NUMERIC DEFAULT 800,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE usgs_stations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_stations" ON usgs_stations;
CREATE POLICY "public_read_stations" ON usgs_stations FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "admin_all_stations" ON usgs_stations;
CREATE POLICY "admin_all_stations" ON usgs_stations FOR ALL USING (true);
