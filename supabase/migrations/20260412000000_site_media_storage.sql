-- Public bucket for CMS-uploaded images (guides, adventures, fleet, etc.)
-- Run in Supabase → SQL Editor if project migrations are applied manually.

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "site_media_public_read" ON storage.objects;
CREATE POLICY "site_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_authenticated_insert" ON storage.objects;
CREATE POLICY "site_media_authenticated_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_authenticated_update" ON storage.objects;
CREATE POLICY "site_media_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media')
  WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media_authenticated_delete" ON storage.objects;
CREATE POLICY "site_media_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media');
