import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

export interface AnalyticsMetrics {
  totalPageviews7d: number
  totalPageviews30d: number
  uniqueVisitors30d: number
  avgSessionDuration30d: number // seconds
  bounceRate30d: number // 0–100
}

export interface TopPage {
  path: string
  views: number
  avgTimeOnPage: number // seconds
}

export interface TrafficSource {
  channel: string
  sessions: number
  percentage: number
}

export interface DailyPageview {
  date: string // YYYY-MM-DD
  views: number
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics
  topPages: TopPage[]
  trafficSources: TrafficSource[]
  dailyPageviews: DailyPageview[]
}

function getPropertyId(siteKey: string): string | undefined {
  if (siteKey === 'rva') return process.env.GA_PROPERTY_ID_RVA
  if (siteKey === 'alpenglow') return process.env.GA_PROPERTY_ID_AAL
  return undefined
}

function getAnalyticsClient() {
  const clientEmail = process.env.GOOGLE_SA_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) return null

  return new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  })
}

function formatSeconds(value: string | null | undefined): number {
  return Math.round(parseFloat(value || '0'))
}

function formatFloat(value: string | null | undefined): number {
  return parseFloat((parseFloat(value || '0') * 100).toFixed(1))
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const siteKey = searchParams.get('site_key') || 'rva'
  const propertyId = getPropertyId(siteKey)

  // Check configuration
  if (!process.env.GOOGLE_SA_CLIENT_EMAIL || !process.env.GOOGLE_SA_PRIVATE_KEY) {
    return NextResponse.json({ error: 'not_configured', message: 'Google service account credentials not configured.' }, { status: 503 })
  }
  if (!propertyId) {
    return NextResponse.json({ error: 'no_property', message: `GA4 property ID for site '${siteKey}' not configured.` }, { status: 503 })
  }

  const client = getAnalyticsClient()
  if (!client) {
    return NextResponse.json({ error: 'not_configured', message: 'Could not initialize GA4 client.' }, { status: 503 })
  }

  try {
    const property = `properties/${propertyId}`

    const [
      metrics7d,
      metrics30d,
      topPagesRes,
      trafficSourcesRes,
      dailyRes,
    ] = await Promise.all([
      // 7-day pageviews
      client.runReport({
        property,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'screenPageViews' }],
      }),
      // 30-day core metrics
      client.runReport({
        property,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),
      // Top pages
      client.runReport({
        property,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      // Traffic sources
      client.runReport({
        property,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      // Daily pageviews for last 30 days
      client.runReport({
        property,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ])

    const pageviews7d = parseInt(metrics7d[0]?.rows?.[0]?.metricValues?.[0]?.value || '0')
    const row30d = metrics30d[0]?.rows?.[0]?.metricValues || []
    const pageviews30d = parseInt(row30d[0]?.value || '0')
    const uniqueVisitors = parseInt(row30d[1]?.value || '0')
    const avgDuration = formatSeconds(row30d[2]?.value)
    const bounce = formatFloat(row30d[3]?.value)

    const topPages: TopPage[] = (topPagesRes[0]?.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '/',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      avgTimeOnPage: formatSeconds(row.metricValues?.[1]?.value),
    }))

    const totalSessions = (trafficSourcesRes[0]?.rows || []).reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'), 0
    )
    const trafficSources: TrafficSource[] = (trafficSourcesRes[0]?.rows || []).map((row) => {
      const sessions = parseInt(row.metricValues?.[0]?.value || '0')
      return {
        channel: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions,
        percentage: totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0,
      }
    })

    const dailyPageviews: DailyPageview[] = (dailyRes[0]?.rows || []).map((row) => {
      const raw = row.dimensionValues?.[0]?.value || ''
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
      return { date, views: parseInt(row.metricValues?.[0]?.value || '0') }
    })

    const data: AnalyticsData = {
      metrics: {
        totalPageviews7d: pageviews7d,
        totalPageviews30d: pageviews30d,
        uniqueVisitors30d: uniqueVisitors,
        avgSessionDuration30d: avgDuration,
        bounceRate30d: bounce,
      },
      topPages,
      trafficSources,
      dailyPageviews,
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('GA4 API error:', err)
    return NextResponse.json(
      { error: 'api_error', message: 'Failed to fetch analytics data.' },
      { status: 500 }
    )
  }
}
