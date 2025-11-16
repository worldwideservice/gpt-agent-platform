import { NextRequest, NextResponse } from 'next/server'
import { Queue } from 'bullmq'
import Redis from 'ioredis'
import { DeadLetterQueue } from '@/services/worker/src/lib/dead-letter-queue'
import { requireAdmin } from '@/lib/auth/admin'

/**
 * Dead Letter Queue Management API
 *
 * Задача 5.1: Security Audit - Усилена проверка admin доступа
 *
 * Endpoints:
 * - GET /api/admin/dlq - Get DLQ statistics and jobs
 * - POST /api/admin/dlq/retry - Retry job from DLQ
 * - DELETE /api/admin/dlq/cleanup - Clean up old DLQ jobs
 */

// Lazy initialization Redis connection
let redis: Redis | null = null
let dlq: DeadLetterQueue | null = null

function getRedisConnection(): Redis {
  if (!redis) {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!upstashUrl || !upstashToken) {
      throw new Error('Redis credentials not configured')
    }

    const upstashRestUrl = new URL(upstashUrl)
    const redisHost = upstashRestUrl.hostname
    const redisUrl = `rediss://default:${upstashToken}@${redisHost}:6379`

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    })
  }

  return redis
}

function getDLQ(): DeadLetterQueue {
  if (!dlq) {
    const connection = getRedisConnection()
    const queueName = process.env.JOB_QUEUE_NAME || 'default-queue'
    dlq = new DeadLetterQueue(connection, `${queueName}:dlq`)
  }

  return dlq
}

/**
 * GET /api/admin/dlq
 * Get DLQ statistics and jobs
 */
export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {

    const { searchParams } = new URL(request.url)
    const status = (searchParams.get('status') as 'waiting' | 'completed' | 'failed' | 'all') || 'all'
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    const dlqInstance = getDLQ()

    const [stats, jobs] = await Promise.all([
      dlqInstance.getStats(),
      dlqInstance.getDLQJobs(status, limit),
    ])

    const jobsData = jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace,
      attemptsMade: job.attemptsMade,
    }))

    return NextResponse.json({
      success: true,
      stats,
      jobs: jobsData,
      count: jobsData.length,
    })
  } catch (error) {
    console.error('DLQ GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/dlq/retry
 * Retry job from DLQ
 */
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {

    const body = await request.json()
    const { dlqJobId } = body

    if (!dlqJobId) {
      return NextResponse.json(
        { error: 'dlqJobId is required' },
        { status: 400 }
      )
    }

    const dlqInstance = getDLQ()
    const connection = getRedisConnection()
    const queueName = process.env.JOB_QUEUE_NAME || 'default-queue'
    const mainQueue = new Queue(queueName, { connection })

    const success = await dlqInstance.retryFromDeadLetter(dlqJobId, mainQueue)

    await mainQueue.close()

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Job ${dlqJobId} retried successfully`,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to retry job ${dlqJobId}`,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('DLQ POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/dlq/cleanup
 * Clean up old DLQ jobs
 */
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request)
  if (adminCheck) return adminCheck

  try {

    const { searchParams } = new URL(request.url)
    const olderThanDays = parseInt(searchParams.get('olderThanDays') || '30', 10)

    const dlqInstance = getDLQ()
    const cleaned = await dlqInstance.cleanup(olderThanDays)

    return NextResponse.json({
      success: true,
      message: `Cleaned ${cleaned} jobs older than ${olderThanDays} days`,
      cleaned,
    })
  } catch (error) {
    console.error('DLQ DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
