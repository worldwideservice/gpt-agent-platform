import { NextResponse } from 'next/server'
import { getQueueStats, getJobsByStatus } from '@/lib/queue'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/admin/jobs
 * Get queue statistics and recent jobs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'active' | 'waiting' | 'completed' | 'failed' | null
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get queue statistics
    const stats = await getQueueStats()

    // Get recent jobs if status is specified
    let jobs = null
    if (status) {
      jobs = await getJobsByStatus(status, limit)
    }

    return NextResponse.json({
      success: true,
      stats,
      jobs: jobs
        ? jobs.map((job) => ({
            id: job.id,
            name: job.name,
            data: job.data,
            timestamp: job.timestamp,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
            failedReason: job.failedReason,
            attemptsMade: job.attemptsMade,
          }))
        : null,
    })
  } catch (error) {
    logger.error('Error getting queue stats', error, {
      service: 'api',
      endpoint: '/api/admin/jobs',
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get queue stats',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/jobs
 * Create a new job (for testing)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jobName, payload } = body

    if (!jobName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job name is required',
        },
        { status: 400 }
      )
    }

    const { addJobToQueue } = await import('@/lib/queue')
    const job = await addJobToQueue(jobName, payload || {})

    logger.info('Job created', {
      jobId: job.id,
      jobName: job.name,
      service: 'api',
      endpoint: '/api/admin/jobs',
    })

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
      },
    })
  } catch (error) {
    logger.error('Error creating job', error, {
      service: 'api',
      endpoint: '/api/admin/jobs',
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create job',
      },
      { status: 500 }
    )
  }
}
