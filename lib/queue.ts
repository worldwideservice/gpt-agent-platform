import { Queue, type Job, type JobsOptions } from 'bullmq'
import Redis from 'ioredis'
import { logger } from '@/lib/utils/logger'

// Lazy initialization for Redis connection (to avoid connection during build)
let connection: Redis | null = null

export type JobPayload = Record<string, unknown>
export type QueuedJob = Job<JobPayload, unknown, string>

let jobQueue: Queue<JobPayload, unknown, string> | null = null

function getRedisConnection(): Redis {
  if (!connection) {
    const redisUrl = process.env.REDIS_URL

    // CRITICAL: Don't use localhost as fallback in production
    if (!redisUrl || redisUrl.includes('your-redis-host')) {
      const message = 'Redis URL not configured - queue operations unavailable'
      logger.error(message)
      throw new Error(message)
    }

    connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true, // Don't connect immediately
    })
  }
  return connection
}

function getJobQueue(): Queue<JobPayload, unknown, string> {
  if (!jobQueue) {
    try {
      const conn = getRedisConnection()
      jobQueue = new Queue('app-jobs', {
        connection: conn,
        defaultJobOptions: {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 50, // Keep last 50 failed jobs
        },
      })
    } catch (error) {
      logger.warn('Redis not available, queue operations will fail', { error: error instanceof Error ? error.message : String(error) })
      throw error
    }
  }
  return jobQueue
}

// Add job to queue
const defaultJobOptions: JobsOptions = {
  priority: 4,
  delay: 0,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
}

export async function addJobToQueue(jobName: string, payload: JobPayload) {
  const queue = getJobQueue()
  const job = await queue.add(jobName, payload, defaultJobOptions)

  return {
    id: job.id,
    name: job.name,
    data: job.data,
  }
}

// Get job by ID
export async function getJobById(jobId: string): Promise<Job<JobPayload, unknown, string> | null> {
  const queue = getJobQueue()
  const job = await queue.getJob(jobId)
  return job ?? null
}

// Get jobs by status
export async function getJobsByStatus(
  status: 'active' | 'waiting' | 'completed' | 'failed',
  limit = 10,
  start = 0,
): Promise<Job<JobPayload, unknown, string>[]> {
  const queue = getJobQueue()
  const jobs = await queue.getJobs([status], start, start + limit - 1)
  return jobs
}

// Get queue statistics
export async function getQueueStats() {
  const queue = getJobQueue()
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getCompleted(),
    queue.getFailed(),
    queue.getDelayed(),
  ])

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length,
  }
}

// Clean up old jobs
export async function cleanupOldJobs() {
  const queue = getJobQueue()
  await queue.clean(24 * 60 * 60 * 1000, 100, 'completed') // Remove completed jobs older than 24 hours
  await queue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed') // Remove failed jobs older than 7 days
}

// Retry failed job
export async function retryJob(jobId: string) {
  const queue = getJobQueue()
  const job = await queue.getJob(jobId)
  if (job) {
    await job.retry()
    return true
  }
  return false
}

// Remove job from queue
export async function removeJob(jobId: string) {
  const queue = getJobQueue()
  const job = await queue.getJob(jobId)
  if (job) {
    await job.remove()
    return true
  }
  return false
}

// Graceful shutdown
export async function closeQueue() {
  if (jobQueue) {
    await jobQueue.close()
    jobQueue = null
  }
  if (connection) {
    await connection.quit()
    connection = null
  }
}
