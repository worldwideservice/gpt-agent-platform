/**
 * Event Tracking API
 * POST /api/experiments/[id]/track - Track experiment event
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import { trackEvent, getExperiment } from '@/lib/ab-testing'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      event_type,
      event_value,
      metadata,
      session_id,
    } = body

    if (!event_type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    const userId = session?.user?.id
    const sessionId = session_id || undefined

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or session ID required' },
        { status: 400 }
      )
    }

    // Verify experiment exists
    const experiment = await getExperiment(params.id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    // Track event
    await trackEvent(
      params.id,
      event_type,
      event_value,
      metadata,
      userId,
      sessionId
    )

    logger.debug('Event tracked', {
      experimentId: params.id,
      eventType: event_type,
      userId,
      sessionId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to track event', { error, id: params.id })
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
