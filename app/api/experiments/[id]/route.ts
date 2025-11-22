/**
 * Experiment Management API
 * GET /api/experiments/[id] - Get experiment details
 * PATCH /api/experiments/[id] - Update experiment
 * DELETE /api/experiments/[id] - Delete experiment (not implemented for safety)
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import {
  getExperiment,
  updateExperiment,
  startExperiment,
  stopExperiment,
  getExperimentStats,
  calculateResults,
} from '@/lib/ab-testing'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experiment = await getExperiment(params.id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const orgId = session.user.orgId || session.user.id
    if (experiment.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get stats
    const stats = await getExperimentStats(params.id)

    return NextResponse.json({
      experiment,
      stats,
    })
  } catch (error) {
    logger.error('Failed to get experiment', { error, id: params.id })
    return NextResponse.json(
      { error: 'Failed to get experiment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experiment = await getExperiment(params.id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const orgId = session.user.orgId || session.user.id
    if (experiment.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action, ...updates } = body

    // Handle special actions
    if (action === 'start') {
      const updated = await startExperiment(params.id)
      return NextResponse.json({ experiment: updated })
    }

    if (action === 'stop') {
      const updated = await stopExperiment(params.id)
      const results = await calculateResults(params.id)
      return NextResponse.json({ experiment: updated, results })
    }

    // Regular update
    const updated = await updateExperiment(params.id, updates)

    return NextResponse.json({ experiment: updated })
  } catch (error) {
    logger.error('Failed to update experiment', { error, id: params.id })
    return NextResponse.json(
      { error: 'Failed to update experiment' },
      { status: 500 }
    )
  }
}
