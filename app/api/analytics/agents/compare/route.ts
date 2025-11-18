/**
 * Agent Comparison API
 * POST /api/analytics/agents/compare - Compare multiple agents
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAgentComparison } from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const body = await request.json()
    const { agent_ids, start_date, end_date } = body

    if (!agent_ids || !Array.isArray(agent_ids) || agent_ids.length === 0) {
      return NextResponse.json(
        { error: 'agent_ids array is required' },
        { status: 400 }
      )
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    const comparison = await getAgentComparison(
      orgId,
      agent_ids,
      start_date,
      end_date
    )

    return NextResponse.json({ comparison })
  } catch (error) {
    logger.error('Failed to compare agents', { error })
    return NextResponse.json(
      { error: 'Failed to compare agents' },
      { status: 500 }
    )
  }
}
