-- Published river/trail/wildlife conditions reports (RVA /rva/conditions)

CREATE TABLE IF NOT EXISTS conditions_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date date NOT NULL DEFAULT CURRENT_DATE,
  author_name text,
  hatch_report text,
  fly_recommendations text,
  water_clarity text,
  trail_conditions text,
  wildlife_notes text,
  birdwatching_highlights text,
  environmental_alerts text,
  general_notes text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS conditions_reports_updated_at ON conditions_reports;
CREATE TRIGGER conditions_reports_updated_at
  BEFORE UPDATE ON conditions_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE conditions_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conditions_reports_public_read" ON conditions_reports;
CREATE POLICY "conditions_reports_public_read"
  ON conditions_reports FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "conditions_reports_authenticated_all" ON conditions_reports;
CREATE POLICY "conditions_reports_authenticated_all"
  ON conditions_reports FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
