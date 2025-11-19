// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { retryJob } from '@/lib/queue'
import { logger } from '@/lib/utils/logger'

/**
 * POST /api/admin/jobs/[id]/retry
 * Retry a failed job
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id

    const retried = await retryJob(jobId)

    if (!retried) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found or cannot be retried',
        },
        { status: 404 }
      )
    }

    logger.info('Job retried', {
      jobId,
      service: 'api',
      endpoint: '/api/admin/jobs/[id]/retry',
    })

    return NextResponse.json({
      success: true,
      message: 'Job retried successfully',
    })
  } catch (error) {
    logger.error('Error retrying job', error, {
      service: 'api',
      endpoint: '/api/admin/jobs/[id]/retry',
      jobId: params.id,
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retry job',
      },
      { status: 500 }
    )
  }
}
