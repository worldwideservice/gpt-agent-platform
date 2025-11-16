import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDashboardStats } from '@/lib/repositories/agents'
import { rateLimitAPI } from '@/lib/middleware/rate-limit-api'

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
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
