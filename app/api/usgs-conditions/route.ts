import { NextResponse } from 'next/server'

const SITES = '09073300,09073400,09076300,09081000,09085000,09075400'
const SITE_NAMES: Record<string, string> = {
  '09073300': 'Roaring Fork above Difficult Creek (Aspen)',
  '09073400': 'Roaring Fork near Aspen',
  '09076300': 'Roaring Fork below Maroon Creek (Aspen)',
  '09081000': 'Roaring Fork near Emma (Basalt)',
  '09085000': 'Roaring Fork at Glenwood Springs',
  '09075400': 'Frying Pan River near Ruedi',
}

// Cache for 1 hour
let cache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 60 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${SITES}&parameterCd=00060,00010&siteStatus=active`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) throw new Error(`USGS API returned ${res.status}`)

    const json = await res.json()
    const timeSeries = json?.value?.timeSeries || []

    const stations: Record<string, any> = {}

    for (const ts of timeSeries) {
      const siteCode = ts.sourceInfo?.siteCode?.[0]?.value
      const paramCode = ts.variable?.variableCode?.[0]?.value
      const values = ts.values?.[0]?.value || []
      const latest = values[values.length - 1]

      if (!siteCode || !latest) continue

      if (!stations[siteCode]) {
        stations[siteCode] = {
          siteCode,
          name: SITE_NAMES[siteCode] || siteCode,
          latitude: ts.sourceInfo?.geoLocation?.geogLocation?.latitude,
          longitude: ts.sourceInfo?.geoLocation?.geogLocation?.longitude,
        }
      }

      const val = parseFloat(latest.value)
      if (paramCode === '00060') {
        stations[siteCode].discharge_cfs = val
        stations[siteCode].discharge_time = latest.dateTime
        // Fishing condition based on CFS
        if (val < 100) stations[siteCode].condition = 'low'
        else if (val < 400) stations[siteCode].condition = 'good'
        else if (val < 800) stations[siteCode].condition = 'fair'
        else stations[siteCode].condition = 'high'
      }
      if (paramCode === '00010') {
        stations[siteCode].water_temp_c = val
        stations[siteCode].water_temp_f = Math.round(val * 9 / 5 + 32)
        stations[siteCode].temp_time = latest.dateTime
      }
    }

    const result = {
      stations: Object.values(stations),
      fetchedAt: new Date().toISOString(),
      source: 'USGS Water Services',
    }

    cache = { data: result, timestamp: Date.now() }
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message, stations: [] }, { status: 502 })
  }
}
