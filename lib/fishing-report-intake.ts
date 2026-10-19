/** Caps shared by the intake route and the SQL check constraints. */
export const FISHING_REPORT_LIMITS = {
  reporter: 100,
  river_or_section: 150,
  flows: 100,
  water_temp: 100,
  hatches_and_flies: 500,
  what_is_working: 500,
  summary: 1500,
} as const

export const FISHING_REPORT_MAX_BODY_BYTES = 8 * 1024
export const FISHING_REPORT_HOURLY_CAP = 20

export type VoiceFishingReport = {
  id: string
  created_at: string
  reporter: string
  river_or_section: string
  flows: string | null
  water_temp: string | null
  hatches_and_flies: string | null
  what_is_working: string | null
  summary: string
}

/** Example shape: "Oct 19, 2026, 2:45 PM MT". */
export function formatFishingReportTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
  return `${formatted} MT`
}
