import { Queue, Job } from 'bullmq'
import type Redis from 'ioredis'
import { logger } from './logger'

/**
 * Dead Letter Queue (DLQ) Implementation
 *
 * Handles failed jobs after max retries:
 * - Stores failed jobs for manual analysis and retry
 * - Prevents infinite retry loops
 * - Provides monitoring and retry capabilities
 */

export interface DLQJobData {
  originalJobId: string
  originalJobName: string
  originalData: unknown
  failureReason: string
  failureCount: number
  firstFailedAt: number
  lastFailedAt: number
  stackTrace?: string
}

export class DeadLetterQueue {
  private dlqQueue: Queue
  private redis: Redis

  constructor(redis: Redis, queueName: string = 'dead-letter-queue') {
    this.redis = redis
    this.dlqQueue = new Queue(queueName, {
      connection: redis,
      defaultJobOptions: {
        // DLQ jobs never auto-retry
        attempts: 1,
        removeOnComplete: false,
        removeOnFail: false,
      },
    })

    logger.info('Dead Letter Queue initialized', {
      queueName,
      event: 'dlq.init',
    })
  }

  /**
   * Move failed job to DLQ
   */
  async moveToDeadLetter(
    job: Job,
    error: Error,
    failureCount: number
  ): Promise<void> {
    const now = Date.now()

    const dlqJobData: DLQJobData = {
      originalJobId: job.id || 'unknown',
      originalJobName: job.name,
      originalData: job.data,
      failureReason: error.message,
      failureCount,
      firstFailedAt: job.processedOn || now,
      lastFailedAt: now,
      stackTrace: error.stack,
    }

    try {
      await this.dlqQueue.add(
        `dlq:${job.name}`,
        dlqJobData,
        {
          jobId: `dlq:${job.id}:${now}`,
          priority: 1,
        }
      )

      logger.warn('Job moved to Dead Letter Queue', {
        jobId: job.id,
        jobName: job.name,
        failureCount,
        failureReason: error.message,
        event: 'dlq.job.moved',
      })
    } catch (dlqError) {
      // Critical: DLQ failed - log extensively
      logger.error('Failed to move job to DLQ', dlqError, {
        jobId: job.id,
        jobName: job.name,
        originalError: error.message,
        event: 'dlq.move.failed',
      })

      // Store in Redis as fallback
      await this.storeFallback(job, error, failureCount)
    }
  }

  /**
   * Fallback storage if DLQ queue fails
   */
  private async storeFallback(
    job: Job,
    error: Error,
    failureCount: number
  ): Promise<void> {
    try {
      const key = `dlq:fallback:${job.id}:${Date.now()}`
      const data = JSON.stringify({
        jobId: job.id,
        jobName: job.name,
        jobData: job.data,
        error: error.message,
        stack: error.stack,
        failureCount,
        timestamp: new Date().toISOString(),
      })

      await this.redis.setex(key, 7 * 24 * 60 * 60, data) // 7 days TTL

      logger.info('Job stored in DLQ fallback', {
        jobId: job.id,
        key,
        event: 'dlq.fallback.stored',
      })
    } catch (fallbackError) {
      logger.error('DLQ fallback storage failed', fallbackError, {
        jobId: job.id,
        event: 'dlq.fallback.failed',
      })
    }
  }

  /**
   * Retry job from DLQ
   */
  async retryFromDeadLetter(
    dlqJobId: string,
    targetQueue: Queue
  ): Promise<boolean> {
    try {
      const dlqJob = await this.dlqQueue.getJob(dlqJobId)

      if (!dlqJob) {
        logger.error('DLQ job not found', undefined, {
          dlqJobId,
          event: 'dlq.retry.not_found',
        })
        return false
      }

      const dlqData = dlqJob.data as DLQJobData

      // Re-add to original queue
      await targetQueue.add(
        dlqData.originalJobName,
        dlqData.originalData,
        {
          jobId: `retry:${dlqData.originalJobId}:${Date.now()}`,
          attempts: 3, // Give it 3 more tries
        }
      )

      // Remove from DLQ
      await dlqJob.remove()

      logger.info('Job retried from DLQ', {
        dlqJobId,
        originalJobId: dlqData.originalJobId,
        originalJobName: dlqData.originalJobName,
        event: 'dlq.retry.success',
      })

      return true
    } catch (error) {
      logger.error('Failed to retry job from DLQ', error, {
        dlqJobId,
        event: 'dlq.retry.failed',
      })
      return false
    }
  }

  /**
   * Get all DLQ jobs for monitoring
   */
  async getDLQJobs(
    status: 'waiting' | 'completed' | 'failed' | 'all' = 'all',
    limit: number = 100
  ): Promise<Job[]> {
    try {
      let jobs: Job[] = []

      if (status === 'all') {
        const [waiting, completed, failed] = await Promise.all([
          this.dlqQueue.getWaiting(0, limit),
          this.dlqQueue.getCompleted(0, limit),
          this.dlqQueue.getFailed(0, limit),
        ])
        jobs = [...waiting, ...completed, ...failed]
      } else if (status === 'waiting') {
        jobs = await this.dlqQueue.getWaiting(0, limit)
      } else if (status === 'completed') {
        jobs = await this.dlqQueue.getCompleted(0, limit)
      } else if (status === 'failed') {
        jobs = await this.dlqQueue.getFailed(0, limit)
      }

      return jobs
    } catch (error) {
      logger.error('Failed to get DLQ jobs', error, {
        status,
        limit,
        event: 'dlq.get_jobs.failed',
      })
      return []
    }
  }

  /**
   * Get DLQ statistics
   */
  async getStats(): Promise<{
    waiting: number
    completed: number
    failed: number
    total: number
  }> {
    try {
      const [waiting, completed, failed] = await Promise.all([
        this.dlqQueue.getWaitingCount(),
        this.dlqQueue.getCompletedCount(),
        this.dlqQueue.getFailedCount(),
      ])

      return {
        waiting,
        completed,
        failed,
        total: waiting + completed + failed,
      }
    } catch (error) {
      logger.error('Failed to get DLQ stats', error, {
        event: 'dlq.stats.failed',
      })
      return { waiting: 0, completed: 0, failed: 0, total: 0 }
    }
  }

  /**
   * Clean up old DLQ jobs
   */
  async cleanup(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000
      let cleaned = 0

      const jobs = await this.getDLQJobs('all', 1000)

      for (const job of jobs) {
        const dlqData = job.data as DLQJobData
        if (dlqData.lastFailedAt < cutoffTime) {
          await job.remove()
          cleaned++
        }
      }

      logger.info('DLQ cleanup completed', {
        cleaned,
        olderThanDays,
        event: 'dlq.cleanup.completed',
      })

      return cleaned
    } catch (error) {
      logger.error('DLQ cleanup failed', error, {
        event: 'dlq.cleanup.failed',
      })
      return 0
    }
  }

  /**
   * Close DLQ
   */
  async close(): Promise<void> {
    await this.dlqQueue.close()
    logger.info('Dead Letter Queue closed', {
      event: 'dlq.closed',
    })
  }
}
