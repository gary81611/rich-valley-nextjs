-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  preferred_date DATE,
  details TEXT,
  brand TEXT NOT NULL DEFAULT 'rva',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full access" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert" ON contact_submissions FOR INSERT WITH CHECK (true);
