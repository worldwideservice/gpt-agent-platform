// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getQueueStats, getJobsByStatus } from '@/lib/queue'
import { logger } from '@/lib/utils/logger'

// ✅ SECURITY FIX: Add runtime validation with Zod schemas
const GetJobsQuerySchema = z.object({
  status: z.enum(['active', 'waiting', 'completed', 'failed']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
})

const CreateJobSchema = z.object({
  jobName: z.string().min(1, 'Job name is required'),
  payload: z.record(z.string(), z.unknown()).optional(),
})

/**
 * GET /api/admin/jobs
 * Get queue statistics and recent jobs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // ✅ SECURITY FIX: Validate query parameters with Zod
    const queryValidation = GetJobsQuerySchema.safeParse({
      status: searchParams.get('status'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    })

    if (!queryValidation.success) {
      logger.warn('Invalid query parameters for GET /api/admin/jobs', {
        errors: queryValidation.error.issues,
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.error.issues.map(issue => issue.message),
        },
        { status: 400 }
      )
    }

    const { status, limit, offset } = queryValidation.data

    // Get queue statistics
    const stats = await getQueueStats()

    // Get recent jobs if status is specified
    let jobs: Awaited<ReturnType<typeof getJobsByStatus>> | null = null
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

    // ✅ SECURITY FIX: Validate request body with Zod
    const bodyValidation = CreateJobSchema.safeParse(body)

    if (!bodyValidation.success) {
      logger.warn('Invalid request body for POST /api/admin/jobs', {
        errors: bodyValidation.error.issues,
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: bodyValidation.error.issues.map(issue => issue.message),
        },
        { status: 400 }
      )
    }

    const { jobName, payload } = bodyValidation.data

    const { addJobToQueue } = await import('@/lib/queue')
    const job = await addJobToQueue(jobName, (payload || {}) as Record<string, unknown>)

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
