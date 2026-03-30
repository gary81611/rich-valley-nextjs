-- Add 'ata' (Accent Travel Agency) to site_id check constraints
ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_site_id_check;
ALTER TABLE public.pages ADD CONSTRAINT pages_site_id_check CHECK (site_id IN ('rva', 'alpenglow', 'ata'));

ALTER TABLE public.navigation DROP CONSTRAINT IF EXISTS navigation_site_id_check;
ALTER TABLE public.navigation ADD CONSTRAINT navigation_site_id_check CHECK (site_id IN ('rva', 'alpenglow', 'ata'));
