/**
 * Experiments API
 * GET /api/experiments - List experiments
 * POST /api/experiments - Create experiment
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import {
  createExperiment,
  listExperiments,
} from '@/lib/ab-testing'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const experiments = await listExperiments(orgId, status)

    return NextResponse.json({ experiments })
  } catch (error) {
    logger.error('Failed to list experiments', { error })
    return NextResponse.json(
      { error: 'Failed to list experiments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const body = await request.json()
    const {
      name,
      description,
      hypothesis,
      traffic_percentage,
      control_variant,
      test_variant,
      primary_metric,
      secondary_metrics,
      confidence_level,
      min_sample_size,
    } = body

    // Validation
    if (!name || !control_variant || !test_variant || !primary_metric) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const experiment = await createExperiment({
      org_id: orgId,
      name,
      description,
      hypothesis,
      traffic_percentage,
      control_variant,
      test_variant,
      primary_metric,
      secondary_metrics,
      confidence_level,
      min_sample_size,
    })

    return NextResponse.json({ experiment })
  } catch (error) {
    logger.error('Failed to create experiment', { error })
    return NextResponse.json(
      { error: 'Failed to create experiment' },
      { status: 500 }
    )
  }
}
