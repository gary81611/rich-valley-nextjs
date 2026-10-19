import ConditionsPageClient from './ConditionsPageClient'
import { loadFishingReportFeed } from '@/lib/fishing-report-feed'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ConditionsPage() {
  const feed = await loadFishingReportFeed()
  return <ConditionsPageClient feed={feed} />
}
