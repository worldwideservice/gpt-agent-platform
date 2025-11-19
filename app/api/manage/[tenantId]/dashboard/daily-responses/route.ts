// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDailyResponsesSeries } from '@/lib/repositories/agents'

export async function GET(request: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params

  try {
    const session = await auth()
    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '10', 10)

    const series = await getDailyResponsesSeries(organizationId, days)

    return NextResponse.json(series)
  } catch (error) {
    console.error('Failed to fetch daily responses:', error)
    return NextResponse.json({ error: 'Failed to fetch daily responses' }, { status: 500 })
  }
}
