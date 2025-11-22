/**
 * Retention Analytics API
 * GET /api/analytics/retention - Get user retention data
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { calculateRetention } from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const cohortDate = searchParams.get('cohort_date')

    if (!cohortDate) {
      return NextResponse.json(
        { error: 'cohort_date is required' },
        { status: 400 }
      )
    }

    const retention = await calculateRetention(orgId, cohortDate)

    return NextResponse.json({ retention })
  } catch (error) {
    logger.error('Failed to calculate retention', { error })
    return NextResponse.json(
      { error: 'Failed to calculate retention' },
      { status: 500 }
    )
  }
}
