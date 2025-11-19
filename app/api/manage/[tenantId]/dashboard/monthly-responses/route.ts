// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getMonthlyResponsesSeries } from '@/lib/repositories/agents'

export async function GET(request: NextRequest, { params }: { params: { tenantId: string } }) {
  try {
    const session = await auth()
    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const months = parseInt(searchParams.get('months') || '6', 10)

    const series = await getMonthlyResponsesSeries(organizationId, months)

    return NextResponse.json(series)
  } catch (error) {
    console.error('Failed to fetch monthly responses:', error)
    return NextResponse.json({ error: 'Failed to fetch monthly responses' }, { status: 500 })
  }
}
