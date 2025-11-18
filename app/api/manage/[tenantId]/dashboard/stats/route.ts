// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDashboardStats } from '@/lib/repositories/agents'
import { rateLimitAPI } from '@/lib/middleware/rate-limit-api'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest, { params }: { params: { tenantId: string } }) {
  try {
    // Apply rate limiting
    const session = await auth()
    const rateLimitResponse = await rateLimitAPI(request, session?.user?.id)
    if (rateLimitResponse) return rateLimitResponse

    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getDashboardStats(organizationId)

    return NextResponse.json(stats)
  } catch (error) {
    logger.error('Failed to fetch dashboard stats', error, { tenantId: params.tenantId })
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
