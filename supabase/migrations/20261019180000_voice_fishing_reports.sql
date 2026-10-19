-- Voice-agent fishing report intake. Separate from the CMS report table.

CREATE TABLE IF NOT EXISTS public.voice_fishing_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  reporter text NOT NULL,
  river_or_section text NOT NULL,
  flows text,
  water_temp text,
  hatches_and_flies text,
  what_is_working text,
  summary text NOT NULL
);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_reporter_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_reporter_len
  CHECK (char_length(reporter) BETWEEN 1 AND 100);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_river_or_section_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_river_or_section_len
  CHECK (char_length(river_or_section) BETWEEN 1 AND 150);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_flows_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_flows_len
  CHECK (flows IS NULL OR char_length(flows) <= 100);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_water_temp_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_water_temp_len
  CHECK (water_temp IS NULL OR char_length(water_temp) <= 100);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_hatches_and_flies_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_hatches_and_flies_len
  CHECK (hatches_and_flies IS NULL OR char_length(hatches_and_flies) <= 500);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_what_is_working_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_what_is_working_len
  CHECK (what_is_working IS NULL OR char_length(what_is_working) <= 500);

ALTER TABLE public.voice_fishing_reports DROP CONSTRAINT IF EXISTS voice_fishing_reports_summary_len;
ALTER TABLE public.voice_fishing_reports
  ADD CONSTRAINT voice_fishing_reports_summary_len
  CHECK (char_length(summary) BETWEEN 1 AND 1500);

CREATE INDEX IF NOT EXISTS voice_fishing_reports_created_at_desc_idx
  ON public.voice_fishing_reports (created_at DESC);

ALTER TABLE public.voice_fishing_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS voice_fishing_reports_select_public ON public.voice_fishing_reports;
CREATE POLICY voice_fishing_reports_select_public
  ON public.voice_fishing_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON TABLE public.voice_fishing_reports TO anon, authenticated;
GRANT ALL ON TABLE public.voice_fishing_reports TO service_role;
