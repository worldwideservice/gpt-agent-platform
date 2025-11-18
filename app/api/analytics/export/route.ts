/**
 * Analytics Export API
 * GET /api/analytics/export - Export analytics data
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { exportAnalytics } from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const format = searchParams.get('format') as 'csv' | 'json' || 'csv'

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    const data = await exportAnalytics(orgId, startDate, endDate, format)

    const contentType = format === 'csv'
      ? 'text/csv'
      : 'application/json'

    const filename = `analytics-${startDate}-to-${endDate}.${format}`

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    logger.error('Failed to export analytics', { error })
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    )
  }
}
