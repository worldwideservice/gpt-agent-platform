/**
 * Variant Assignment API
 * POST /api/experiments/[id]/assign - Assign user to variant
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { assignVariant, getExperiment } from '@/lib/ab-testing'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { session_id } = body

    // User can be authenticated or anonymous (with session_id)
    const userId = session?.user?.id
    const sessionId = session_id || undefined

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or session ID required' },
        { status: 400 }
      )
    }

    // Verify experiment exists and is running
    const experiment = await getExperiment(params.id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    if (experiment.status !== 'running') {
      return NextResponse.json(
        { error: 'Experiment is not running' },
        { status: 400 }
      )
    }

    // Assign variant
    const assignment = await assignVariant(params.id, userId, sessionId)

    logger.info('Variant assigned', {
      experimentId: params.id,
      variant: assignment.variant,
      userId,
      sessionId,
    })

    return NextResponse.json({
      assignment: {
        variant: assignment.variant,
        experiment_id: assignment.experiment_id,
      },
      config:
        assignment.variant === 'control'
          ? experiment.control_variant
          : experiment.test_variant,
    })
  } catch (error) {
    logger.error('Failed to assign variant', { error, id: params.id })
    return NextResponse.json(
      { error: 'Failed to assign variant' },
      { status: 500 }
    )
  }
}
