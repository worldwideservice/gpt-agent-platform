import { NextResponse } from 'next/server'
import { addJobToQueue } from '@/lib/queue'
import { logger } from '@/lib/utils/logger'

/**
 * POST /api/admin/jobs/test
 * Create a test job to verify worker is processing jobs
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Create a test job with timestamp
    const job = await addJobToQueue('test-job', {
      test: true,
      timestamp: Date.now(),
      message: body.message || 'Test job from API',
      ...body,
    })

    logger.info('Test job created', {
      jobId: job.id,
      jobName: job.name,
      service: 'api',
      endpoint: '/api/admin/jobs/test',
    })

    return NextResponse.json({
      success: true,
      message: 'Test job created and added to queue',
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
      },
      instructions: 'Check worker logs or call GET /api/admin/jobs?status=completed to see if job was processed',
    })
  } catch (error) {
    logger.error('Error creating test job', error, {
      service: 'api',
      endpoint: '/api/admin/jobs/test',
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create test job',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/jobs/test
 * Get instructions on how to test the worker
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Test job endpoint',
    usage: {
      createTestJob: {
        method: 'POST',
        endpoint: '/api/admin/jobs/test',
        body: {
          message: 'Optional custom message',
        },
      },
      checkQueueStats: {
        method: 'GET',
        endpoint: '/api/admin/jobs',
        description: 'Get queue statistics',
      },
      checkCompletedJobs: {
        method: 'GET',
        endpoint: '/api/admin/jobs?status=completed&limit=5',
        description: 'Get last 5 completed jobs',
      },
      checkWorkerHealth: {
        method: 'GET',
        endpoint: 'http://localhost:3001/health',
        description: 'Worker service health check (if worker is running)',
      },
      checkWorkerMetrics: {
        method: 'GET',
        endpoint: 'http://localhost:3001/metrics',
        description: 'Worker service metrics (if worker is running)',
      },
    },
    availableJobTypes: [
      'test-job',
      'webhook-event',
      'crm-sync-pipelines',
      'crm-sync-contacts',
      'process-asset',
      'extract-knowledge-graph',
      'process-large-file',
      'generate-report',
      'process-bulk-data',
      'fine-tune-model',
    ],
  })
}
