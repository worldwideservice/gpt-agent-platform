/**
 * Time Series Analytics API
 * GET /api/analytics/timeseries - Get time-series data for charts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTimeSeriesData } from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') as 'requests' | 'tokens' | 'cost' | 'rating' || 'requests'
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    const granularity = searchParams.get('granularity') as 'hour' | 'day' | 'week' | 'month' || 'day'

    const data = await getTimeSeriesData(
      orgId,
      metric,
      startDate,
      endDate,
      granularity
    )

    return NextResponse.json({ data })
  } catch (error) {
    logger.error('Failed to get time series data', { error })
    return NextResponse.json(
      { error: 'Failed to get time series data' },
      { status: 500 }
    )
  }
}
