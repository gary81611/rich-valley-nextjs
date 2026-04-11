# RVA + AAL Admin Fix — Make ALL Content Admin-Editable

## Goal
Every piece of user-facing content on both Rich Valley Adventures (RVA) and Aspen Alpenglow Limousine (AAL) must be database-backed and editable through the admin panel. No hardcoded content that needs updating. Also rename "Expert Report" to "Fishing Report" and move it to the RVA home page.

---

## Phase 1 — Wire Existing DB Tables to Public Pages

These pages have working admin UIs and DB tables already, but the public components use hardcoded arrays instead of querying the database. Replace the hardcoded data with Supabase queries and delete the static arrays.

1. **`/app/rva/guides/page.tsx`** — Remove hardcoded `GUIDES` array (lines 10-17). Fetch from `guides` table instead. Admin: `/admin/guides` already works.

2. **`/app/rva/winter/page.tsx`** — Remove hardcoded `winterAdventures` array (lines 21-110, 11 items). Fetch from `winter_adventures` table. Admin: `/admin/winter` already works.

3. **`/app/rva/elevated-camping/page.tsx`** — Remove hardcoded `includedItems` array (lines 29-60). Fetch from `camping_packages` table. Admin: `/admin/camping` already works.

4. **`/app/rva/fleet/page.tsx`** — Remove hardcoded vehicle descriptions (lines 72-75). Fetch from `fleet_vehicles` table. Admin: `/admin/fleet` already works.

5. **`/alpenglow/faq/page.tsx`** — Remove 16 hardcoded FAQs (lines 10-75). Fetch from `faqs` table filtered by `site_key = 'alpenglow'`. Admin: `/admin/faqs` already works.

6. **`/alpenglow/destinations/page.tsx`** — Remove 5 hardcoded destinations (lines 10-36). Fetch from `destinations` table. Admin: `/admin/destinations` already works.

7. **`/alpenglow/services/page.tsx`** — Remove hardcoded service fallbacks (lines 53-103). Fetch from `services` table. Admin: `/admin/services` already works.

8. **`/alpenglow/gallery/page.tsx`** — Remove hardcoded gallery images array (lines 11-17). Fetch from `gallery_images` table filtered by `site_key = 'alpenglow'`. Admin: `/admin/gallery` already works.

9. **`/lib/site-data.ts`** — Remove all hardcoded fallback arrays in both `rvaData` and `alpenglowData` objects. Every page should query the DB directly, not fall back to static data.

---

## Phase 2 — Extend DB Schemas (Tables exist but missing fields)

These tables need new columns, then update the admin forms to include the new fields, then update public pages to use them.

### Migration: `adventures` table
```sql
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS whats_included JSONB DEFAULT '[]';
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS group_size TEXT;
ALTER TABLE adventures ADD COLUMN IF NOT EXISTS phone TEXT;
```
- **Public page:** `/app/rva/adventures/[slug]/page.tsx` — Remove hardcoded `adventureDetails` object (lines 20-184). Fetch extended fields from DB.
- **Admin page:** `/admin/adventures/page.tsx` — Add form fields for long_description, whats_included (repeatable list), highlights (repeatable list), best_for, group_size.

### Migration: `services` table (AAL)
```sql
ALTER TABLE services ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';
```
- **Public page:** `/alpenglow/services/page.tsx` — Use `features` from DB instead of hardcoded arrays.
- **Admin page:** `/admin/services/page.tsx` — Add repeatable "features" list field.

### Migration: `locations` table
```sql
ALTER TABLE locations ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
```
- **Public page:** `/app/rva/locations/[slug]/page.tsx` — Remove hardcoded `LOCATIONS` data from `/lib/rva-locations.ts`. Fetch from `locations` table including faqs.
- **Admin page:** `/admin/locations/page.tsx` — Add repeatable FAQ pairs (question/answer) to the form.

### Migration: `service_areas` table (AAL)
```sql
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS key_destinations JSONB DEFAULT '[]';
```
- **Public page:** `/alpenglow/service-areas/[slug]/page.tsx` — Remove hardcoded `areaDetails` object (lines 6-95). Fetch extended fields from DB.
- **Admin page:** `/admin/service-areas/page.tsx` — Add long_description textarea and key_destinations repeatable list.

---

## Phase 3 — New Tables + Admin Pages

### 3A. Fishing Report (renamed from "Expert Report")

**New table:**
```sql
CREATE TABLE fishing_reports (
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
```

- **New admin page:** `/admin/fishing-reports/page.tsx` — Full CRUD. Fields: title, content (rich text or textarea), river dropdown, hatch info, fly recommendations, water clarity, author (select from guides), publish toggle.
- **RVA home page (`/app/rva/page.tsx`):** Add a "Latest Fishing Report" section. Fetch the most recent published fishing report. Show title, date, author name, and content preview with "Read More" link.
- **Remove** the "Expert Report" section from `/app/rva/conditions/page.tsx` (lines 104-114).

### 3B. Value Propositions / "Why Choose Us"

**New table:**
```sql
CREATE TABLE value_propositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

- **New admin page:** `/admin/value-propositions/page.tsx` — CRUD with site_key filter toggle (RVA / Alpenglow).
- **Public pages:** Replace hardcoded `whyChooseUs` arrays in `lib/site-data.ts` with DB queries on the pages that display them.

### 3C. Site Statistics

**Extend `site_settings` table:**
```sql
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]';
```

Stats format: `[{"label": "Years Experience", "value": "14+", "icon": "..."}, ...]`

- **Admin page:** `/admin/settings/page.tsx` — Add a "Site Statistics" section with repeatable stat entries (label + value).
- **Public pages:** Replace hardcoded stats in `lib/site-data.ts`, `/rva/about/page.tsx`, and anywhere else they appear.

### 3D. Trail Conditions

**New table:**
```sql
CREATE TABLE trail_conditions (
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
```

- **Admin page:** `/admin/trail-conditions/page.tsx` or add a "Trail Conditions" tab to `/admin/conditions/page.tsx`.
- **Public page:** `/app/rva/conditions/page.tsx` — Replace hardcoded wildlife/birdwatching lists (lines 121-138) with DB query.

### 3E. AAL Pricing (move from TypeScript file to DB)

The file `/lib/aal-pricing.ts` has all pricing hardcoded with a note "Do NOT modify without owner confirmation." Move this data into the existing `pricing_routes` table.

- **Seed migration:** Insert all current pricing data from `aal-pricing.ts` into `pricing_routes` table.
- **Public page:** `/alpenglow/pricing/page.tsx` — Fetch from `pricing_routes` table grouped by category instead of importing from `.ts` file.
- **Admin page:** `/admin/pricing/page.tsx` already exists — verify it handles all route categories (AIRPORT_INBOUND, AIRPORT_OUTBOUND, LOCAL_ROUTES, LONG_DISTANCE, HOURLY_SERVICES).
- **Delete** `/lib/aal-pricing.ts` after migration.

---

## Phase 4 — About Pages & Hero Content

### RVA About Page (`/app/rva/about/page.tsx`)
Hardcoded content: founder story, company narrative, team characteristics, stats, CTA text.

**Option:** Add these as content blocks in `site_settings` or the `pages` CMS table:
- Add `about_content` JSONB field to `site_settings` with keys: `founder_story`, `company_narrative`, `team_characteristics[]`, `cta_text`.
- Or create a CMS page entry in the `pages` table with `template_type = 'about'` and structured JSONB content.
- **Admin:** Edit via `/admin/settings` or `/admin/pages`.

### Hero Sections (both sites)
Hero copy (taglines, subtitles) on home pages should come from `site_settings` (tagline, description fields already exist). Verify the public pages actually use them instead of hardcoded strings.

---

## Phase 5 — Cleanup

1. **Delete `/lib/rva-locations.ts`** — All location data should come from `locations` table.
2. **Delete `/lib/aal-pricing.ts`** — All pricing from `pricing_routes` table.
3. **Gut `/lib/site-data.ts`** — Remove all hardcoded arrays. This file should only contain helper functions to fetch from Supabase, or be deleted entirely if each page handles its own queries.
4. **Remove all inline hardcoded arrays** from page components: `GUIDES`, `winterAdventures`, `adventureDetails`, `includedItems`, `VEHICLE_DESCRIPTIONS`, `areaDetails`, FAQ arrays, destination arrays.
5. **Verify every public page** renders an appropriate empty state if the DB table has no rows (e.g., "No fishing reports yet" instead of a blank section or crash).

---

## Execution Order

1. Phase 1 first — biggest bang for buck, no migrations needed, just rewire pages to existing DB tables
2. Phase 3A (Fishing Report) — new feature, high visibility
3. Phase 2 — schema extensions + admin form updates
4. Phase 3B-3E — remaining new tables
5. Phase 4 — about pages and hero content
6. Phase 5 — cleanup and delete dead code

---

## Rules
- **No hardcoded fallbacks.** If the DB is empty, show an empty state, not static data.
- **Every content section = DB table + admin CRUD + public page query.** No exceptions.
- **Inline styles only** for both sites (matches existing design system pattern).
- **Test each admin form** after building — create, edit, delete, verify it renders on the public page.
