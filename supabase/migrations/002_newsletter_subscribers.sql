-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  site_key TEXT NOT NULL CHECK (site_key IN ('rva', 'alpenglow')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, site_key)
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full access" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
