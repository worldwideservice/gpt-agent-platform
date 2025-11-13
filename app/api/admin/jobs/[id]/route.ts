import { NextResponse } from 'next/server'
import { getJobById, removeJob } from '@/lib/queue'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/admin/jobs/[id]
 * Get job details by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id

    const job = await getJobById(jobId)

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        failedReason: job.failedReason,
        stacktrace: job.stacktrace,
        returnvalue: job.returnvalue,
        attemptsMade: job.attemptsMade,
        progress: job.progress,
      },
    })
  } catch (error) {
    logger.error('Error getting job details', error, {
      service: 'api',
      endpoint: '/api/admin/jobs/[id]',
      jobId: params.id,
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get job details',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/jobs/[id]
 * Remove job from queue
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id

    const removed = await removeJob(jobId)

    if (!removed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found or already removed',
        },
        { status: 404 }
      )
    }

    logger.info('Job removed', {
      jobId,
      service: 'api',
      endpoint: '/api/admin/jobs/[id]',
    })

    return NextResponse.json({
      success: true,
      message: 'Job removed successfully',
    })
  } catch (error) {
    logger.error('Error removing job', error, {
      service: 'api',
      endpoint: '/api/admin/jobs/[id]',
      jobId: params.id,
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove job',
      },
      { status: 500 }
    )
  }
}
