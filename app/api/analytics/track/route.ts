/**
 * Activity Tracking API
 * POST /api/analytics/track - Track user activity event
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { trackActivity } from '@/lib/analytics/advanced'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    const body = await request.json()
    const {
      event_type,
      metadata,
      session_id,
      agent_id,
    } = body

    if (!event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      )
    }

    // Get org_id from session or require it
    const orgId = session?.user?.orgId || session?.user?.id

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }

    const userId = session?.user?.id
    const sessionIdToUse = session_id || undefined

    await trackActivity(
      orgId,
      event_type,
      metadata,
      userId,
      sessionIdToUse,
      agent_id
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to track activity', { error })
    // Don't return error - analytics should fail silently
    return NextResponse.json({ success: true })
  }
}
