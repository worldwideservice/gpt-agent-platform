import { Queue } from 'bullmq'
import Redis from 'ioredis'

// Lazy initialization for Redis connection (to avoid connection during build)
let connection: Redis | null = null
let jobQueue: Queue | null = null

function getRedisConnection(): Redis {
  if (!connection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    // Skip connection if using placeholder URL (for build time)
    if (redisUrl.includes('your-redis-host')) {
      throw new Error('Redis URL not configured')
    }
    connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true, // Don't connect immediately
    })
  }
  return connection
}

function getJobQueue(): Queue {
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
      console.warn('Redis not available, queue operations will fail:', error)
      throw error
    }
  }
  return jobQueue
}

export interface JobPayload {
  [key: string]: any
}

export interface QueuedJob {
  id: string
  name: string
  data: JobPayload
  opts: any
  progress: number
  attemptsMade: number
  finishedOn?: number
  processedOn?: number
  failedReason?: string
  returnvalue?: any
}

// Add job to queue
export async function addJobToQueue(jobName: string, payload: JobPayload) {
  const queue = getJobQueue()
  const job = await queue.add(jobName, payload, {
    priority: 4, // Default priority
    delay: 0,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  })

  return {
    id: job.id,
    name: job.name,
    data: job.data,
  }
}

// Get job by ID
export async function getJobById(jobId: string) {
  const queue = getJobQueue()
  const job = await queue.getJob(jobId)
  return job
}

// Get jobs by status
export async function getJobsByStatus(status: 'active' | 'waiting' | 'completed' | 'failed', limit = 10) {
  const queue = getJobQueue()
  const jobs = await queue.getJobs([status], 0, limit - 1)
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
