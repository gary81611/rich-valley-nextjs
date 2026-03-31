-- Phase 2: Extend existing tables with missing fields
-- Phase 3: Create new tables for admin-editable content

-- ============================================================
-- Phase 2A: adventures table — extended fields
-- ============================================================
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS whats_included JSONB DEFAULT '[]';
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS group_size TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============================================================
-- Phase 2B: services table — features column
-- ============================================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT;

-- ============================================================
-- Phase 2C: locations table — faqs, rivers, activities, highlights
-- ============================================================
ALTER TABLE locations ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS rivers JSONB DEFAULT '[]';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '[]';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';

-- ============================================================
-- Phase 2D: service_areas table — extended fields
-- ============================================================
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS key_destinations JSONB DEFAULT '[]';
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- ============================================================
-- Phase 3A: fishing_reports table
-- ============================================================
CREATE TABLE IF NOT EXISTS fishing_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Weekly Fishing Report',
  content TEXT NOT NULL,
  author_guide_id UUID REFERENCES guides(id),
  river_name TEXT,
  hatch_info TEXT,
  fly_recommendations TEXT,
  water_clarity TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Phase 3B: value_propositions table
-- ============================================================
CREATE TABLE IF NOT EXISTS value_propositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Phase 3C: site_settings stats column
-- ============================================================
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_content JSONB DEFAULT '{}';

-- ============================================================
-- Phase 3D: trail_conditions table
-- ============================================================
CREATE TABLE IF NOT EXISTS trail_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('wildlife', 'birdwatching', 'trail_status', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Phase 3E: Seed pricing_routes from aal-pricing.ts
-- ============================================================
INSERT INTO pricing_routes (route_name, category, origin, destination, distance, drive_time, suv_price, price_note, display_order, is_active)
SELECT * FROM (VALUES
  ('ASE to Aspen', 'airport-inbound', 'ASE Airport', 'Aspen', '~5 mi', '10 min', 210, 'Contact for Sprinter quote', 1, true),
  ('ASE to Snowmass', 'airport-inbound', 'ASE Airport', 'Snowmass', '~10 mi', '20 min', 210, 'Contact for Sprinter quote', 2, true),
  ('EGE to Aspen', 'airport-inbound', 'EGE (Eagle)', 'Aspen', '~70 mi', '1.5 hr', 720, 'Contact for Sprinter quote', 3, true),
  ('EGE to Snowmass', 'airport-inbound', 'EGE (Eagle)', 'Snowmass', '~65 mi', '1.5 hr', 720, 'Contact for Sprinter quote', 4, true),
  ('RIL to Aspen', 'airport-inbound', 'RIL (Rifle)', 'Aspen', '~65 mi', '1.25 hr', 720, 'Contact for Sprinter quote', 5, true),
  ('RIL to Snowmass', 'airport-inbound', 'RIL (Rifle)', 'Snowmass', '~60 mi', '1.25 hr', 720, 'Contact for Sprinter quote', 6, true),
  ('GJT to Aspen', 'airport-inbound', 'GJT (Grand Junction)', 'Aspen', '~130 mi', '2.5 hr', 850, 'Contact for Sprinter quote', 7, true),
  ('GJT to Snowmass', 'airport-inbound', 'GJT (Grand Junction)', 'Snowmass', '~125 mi', '2.5 hr', 850, 'Contact for Sprinter quote', 8, true),
  ('DEN to Aspen', 'airport-inbound', 'DEN (Denver)', 'Aspen', '~220 mi', '4 hr', 1475, 'Contact for Sprinter quote', 9, true),
  ('DEN to Snowmass', 'airport-inbound', 'DEN (Denver)', 'Snowmass', '~215 mi', '4 hr', 1475, 'Contact for Sprinter quote', 10, true),
  ('Aspen to ASE', 'airport-outbound', 'Aspen', 'ASE Airport', '~5 mi', '10 min', 150, 'Contact for Sprinter quote', 11, true),
  ('Aspen to EGE', 'airport-outbound', 'Aspen', 'EGE (Eagle)', '~70 mi', '1.5 hr', 720, 'Contact for Sprinter quote', 12, true),
  ('Aspen to RIL', 'airport-outbound', 'Aspen', 'RIL (Rifle)', '~65 mi', '1.25 hr', 720, 'Contact for Sprinter quote', 13, true),
  ('Aspen to GJT', 'airport-outbound', 'Aspen', 'GJT (Grand Junction)', '~130 mi', '2.5 hr', 850, 'Contact for Sprinter quote', 14, true),
  ('Aspen to DEN', 'airport-outbound', 'Aspen', 'DEN (Denver)', '~220 mi', '4 hr', 1475, 'Contact for Sprinter quote', 15, true),
  ('Aspen to Snowmass', 'local', 'Aspen', 'Snowmass Village', '~8 mi', '15 min', 150, 'Contact for Sprinter quote', 16, true),
  ('Aspen to Woody Creek', 'local', 'Aspen', 'Woody Creek', '~5 mi', '10 min', 125, 'Contact for Sprinter quote', 17, true),
  ('Aspen to Basalt', 'local', 'Aspen', 'Basalt', '~18 mi', '25 min', 235, 'Contact for Sprinter quote', 18, true),
  ('Aspen to Carbondale', 'local', 'Aspen', 'Carbondale', '~30 mi', '35 min', 250, 'Contact for Sprinter quote', 19, true),
  ('Aspen to Glenwood Springs', 'local', 'Aspen', 'Glenwood Springs', '~42 mi', '50 min', 270, 'Contact for Sprinter quote', 20, true),
  ('Aspen to Pine Creek Cook House', 'local', 'Aspen', 'Pine Creek Cook House', '~12 mi', '20 min', 175, 'Contact for Sprinter quote', 21, true),
  ('Aspen to Maroon Creek', 'local', 'Aspen', 'Maroon Creek', '~10 mi', '15 min', 235, 'Contact for Sprinter quote', 22, true),
  ('Aspen to Highlands', 'local', 'Aspen', 'Aspen Highlands', '~3 mi', '8 min', 150, 'Contact for Sprinter quote', 23, true),
  ('Aspen to Buttermilk', 'local', 'Aspen', 'Buttermilk', '~3 mi', '8 min', 150, 'Contact for Sprinter quote', 24, true),
  ('Aspen to Vail', 'long-distance', 'Aspen', 'Vail', '~100 mi', '2 hr', 850, 'Contact for Sprinter quote', 25, true),
  ('Aspen to Beaver Creek', 'long-distance', 'Aspen', 'Beaver Creek', '~95 mi', '2 hr', 800, 'Contact for Sprinter quote', 26, true),
  ('Aspen to Crested Butte', 'long-distance', 'Aspen', 'Crested Butte', '~180 mi', '3.5 hr', 1475, 'Contact for Sprinter quote', 27, true),
  ('Aspen to Breckenridge', 'long-distance', 'Aspen', 'Breckenridge', '~130 mi', '2.5 hr', 900, 'Contact for Sprinter quote', 28, true),
  ('Aspen to Telluride', 'long-distance', 'Aspen', 'Telluride', '~180 mi', '4 hr', 1475, 'Contact for Sprinter quote', 29, true)
) AS v(route_name, category, origin, destination, distance, drive_time, suv_price, price_note, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM pricing_routes LIMIT 1);

-- Seed hourly services into pricing_routes
INSERT INTO pricing_routes (route_name, category, origin, destination, distance, drive_time, suv_price, price_note, display_order, is_active)
SELECT * FROM (VALUES
  ('In-Town Aspen', 'hourly', 'Aspen', 'Aspen', '', 'per ride', 100, 'Contact for Sprinter quote', 30, true),
  ('Hourly Charter (SUV)', 'hourly', '', '', '', '/hr', 150, 'Contact for Sprinter quote', 31, true),
  ('Hourly Charter (Limo Coach/Sprinter)', 'hourly', '', '', '', '/hr', 240, '', 32, true),
  ('Ski Mountain Shuttle', 'hourly', 'Aspen', 'Ski Mountains', '', 'per ride', 150, 'Contact for Sprinter quote', 33, true),
  ('Dinner / Event Service', 'hourly', 'Aspen', 'Event Venue', '', 'per ride', 150, 'Contact for Sprinter quote', 34, true)
) AS v(route_name, category, origin, destination, distance, drive_time, suv_price, price_note, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM pricing_routes WHERE category = 'hourly' LIMIT 1);
