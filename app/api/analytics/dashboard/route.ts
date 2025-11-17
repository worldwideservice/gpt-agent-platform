/**
 * Analytics Dashboard API
 * GET /api/analytics/dashboard - Get dashboard summary
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getDashboardSummary,
  getTopAgents,
  getRealtimeMetrics,
} from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined

    // Get all dashboard data in parallel
    const [summary, topAgents, realtime] = await Promise.all([
      getDashboardSummary(orgId, startDate, endDate),
      getTopAgents(orgId, 'requests', 5, startDate, endDate),
      getRealtimeMetrics(orgId),
    ])

    // Transform summary into object
    const summaryData = summary.reduce(
      (acc, item) => ({
        ...acc,
        [item.metric_name]: {
          current: item.current_value,
          previous: item.previous_value,
          change: item.change_percentage,
        },
      }),
      {}
    )

    return NextResponse.json({
      summary: summaryData,
      top_agents: topAgents,
      realtime,
    })
  } catch (error) {
    logger.error('Failed to get dashboard data', { error })
    return NextResponse.json(
      { error: 'Failed to get dashboard data' },
      { status: 500 }
    )
  }
}
