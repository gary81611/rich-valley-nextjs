-- Add season column to adventures
ALTER TABLE adventures ADD COLUMN season TEXT DEFAULT 'summer' CHECK (season IN ('summer', 'winter', 'year-round'));
