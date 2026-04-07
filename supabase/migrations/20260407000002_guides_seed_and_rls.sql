-- Tighten guides RLS: public reads active only; authenticated full access

DROP POLICY IF EXISTS "public_read_guides" ON guides;
DROP POLICY IF EXISTS "admin_all_guides" ON guides;

CREATE POLICY "guides_public_read" ON guides FOR SELECT USING (is_active = true);

CREATE POLICY "guides_authenticated_all" ON guides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default team when table is empty
INSERT INTO guides (name, title, specialties, certifications, bio, display_order, is_active)
SELECT v.name, v.title, v.specialties, v.certifications, NULL, v.display_order, true
FROM (
  VALUES
    (
      'Kit McLendon',
      'Lead Fly Fishing Guide',
      ARRAY['Hatch reports', 'Fly recommendations', 'Water clarity', 'River observations', 'Trail information', 'Boat ramp logistics']::text[],
      ARRAY['First Aid']::text[],
      1
    ),
    (
      'Bart Chandler',
      'Shooting Guide',
      ARRAY['Sporting clay instruction', 'Hunting guide']::text[],
      ARRAY['First Aid']::text[],
      2
    ),
    (
      'Bobby Regan',
      'Kids Fishing Guide',
      ARRAY['Youth fly fishing', 'Family trips', 'First-time anglers']::text[],
      ARRAY['First Aid']::text[],
      3
    ),
    (
      'Alex Macintyre',
      'Boat Captain',
      ARRAY['Float trips', 'Gunnison River', 'Colorado River operations']::text[],
      ARRAY['First Aid']::text[],
      4
    ),
    (
      'Jason Fagre',
      'Chef & Hunting Guide',
      ARRAY['Elevated camping chef', 'Hunting guide', 'Field-to-table experiences']::text[],
      ARRAY['First Aid']::text[],
      5
    ),
    (
      'John Mudrey',
      'Fly Fishing Guide — Dry Fly Specialist',
      ARRAY['Dry fly fishing', 'Technical nymphing', 'Precision presentation']::text[],
      ARRAY['First Aid']::text[],
      6
    )
) AS v(name, title, specialties, certifications, display_order)
WHERE NOT EXISTS (SELECT 1 FROM guides LIMIT 1);
