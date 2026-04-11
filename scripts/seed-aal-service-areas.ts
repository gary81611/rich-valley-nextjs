/**
 * Upsert Aspen Alpenglow Limousine service areas with SEO/AEO/GEO copy + FAQ JSON-LD payload.
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Run: npx tsx scripts/seed-aal-service-areas.ts
 */
import { createClient } from '@supabase/supabase-js'
import { AAL_SERVICE_AREAS_SEED } from '../lib/aal-service-areas-seed'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

async function main() {
  if (!url?.startsWith('http') || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(url, key)

  for (const row of AAL_SERVICE_AREAS_SEED) {
    const payload = {
      name: row.name,
      slug: row.slug,
      description: row.description,
      long_description: row.long_description,
      key_destinations: row.key_destinations,
      display_order: row.display_order,
      site_key: row.site_key,
      is_active: row.is_active,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      faq_schema: row.faq_schema,
      updated_at: new Date().toISOString(),
    }

    const { data: existing, error: selErr } = await supabase
      .from('service_areas')
      .select('id')
      .eq('site_key', 'alpenglow')
      .eq('slug', row.slug)
      .maybeSingle()

    if (selErr) {
      console.error(`Lookup ${row.slug}:`, selErr.message)
      continue
    }

    if (existing?.id) {
      const { error } = await supabase.from('service_areas').update(payload).eq('id', existing.id)
      console.log(error ? `UPDATE FAIL ${row.slug}: ${error.message}` : `OK update ${row.slug}`)
    } else {
      const { error } = await supabase.from('service_areas').insert(payload)
      console.log(error ? `INSERT FAIL ${row.slug}: ${error.message}` : `OK insert ${row.slug}`)
    }
  }

  console.log('Done. Apply migration 20260410120000_service_areas_seo_aeo.sql if columns are missing.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
