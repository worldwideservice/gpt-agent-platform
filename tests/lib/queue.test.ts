import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { Queue, Job } from 'bullmq'
import type Redis from 'ioredis'

// Create mock instances
const mockQuit = vi.fn().mockResolvedValue('OK')
const mockAdd = vi.fn()
const mockGetJob = vi.fn()
const mockGetJobs = vi.fn()
const mockGetWaiting = vi.fn()
const mockGetActive = vi.fn()
const mockGetCompleted = vi.fn()
const mockGetFailed = vi.fn()
const mockGetDelayed = vi.fn()
const mockClean = vi.fn()
const mockClose = vi.fn()

// Mock Redis class
class MockRedis {
  quit = mockQuit
}

// Mock Queue class
class MockQueue {
  add = mockAdd
  getJob = mockGetJob
  getJobs = mockGetJobs
  getWaiting = mockGetWaiting
  getActive = mockGetActive
  getCompleted = mockGetCompleted
  getFailed = mockGetFailed
  getDelayed = mockGetDelayed
  clean = mockClean
  close = mockClose
}

// Mock modules
vi.mock('ioredis', () => ({
  default: MockRedis,
}))

vi.mock('bullmq', () => ({
  Queue: MockQueue,
}))

// Mock logger
vi.mock('@/lib/utils', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('Queue Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up environment
    process.env.REDIS_URL = 'redis://localhost:6379'

    // Reset module cache to ensure fresh instance
    vi.resetModules()
  })

  afterEach(async () => {
    // Clean up modules
    vi.resetModules()
  })

  describe('addJobToQueue', () => {
    it('should add job to queue successfully', async () => {
      const mockJob = {
        id: 'job-123',
        name: 'test-job',
        data: { test: 'data' },
      } as unknown as Job

      mockAdd.mockResolvedValue(mockJob)

      const { addJobToQueue } = await import('@/lib/queue')

      const result = await addJobToQueue('test-job', { test: 'data' })

      expect(result).toEqual({
        id: 'job-123',
        name: 'test-job',
        data: { test: 'data' },
      })
      expect(mockAdd).toHaveBeenCalledWith(
        'test-job',
        { test: 'data' },
        expect.objectContaining({
          priority: 4,
          delay: 0,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        })
      )
    })

    it('should handle empty payload', async () => {
      const mockJob = {
        id: 'job-456',
        name: 'empty-job',
        data: {},
      } as unknown as Job

      mockAdd.mockResolvedValue(mockJob)

      const { addJobToQueue } = await import('@/lib/queue')

      const result = await addJobToQueue('empty-job', {})

      expect(result.id).toBe('job-456')
      expect(result.data).toEqual({})
    })
  })

  describe('getJobById', () => {
    it('should retrieve job by ID successfully', async () => {
      const mockJob = {
        id: 'job-123',
        name: 'test-job',
        data: { test: 'data' },
      } as unknown as Job

      mockGetJob.mockResolvedValue(mockJob)

      const { getJobById } = await import('@/lib/queue')

      const result = await getJobById('job-123')

      expect(result).toEqual(mockJob)
      expect(mockGetJob).toHaveBeenCalledWith('job-123')
    })

    it('should return null for non-existent job', async () => {
      mockGetJob.mockResolvedValue(null)

      const { getJobById } = await import('@/lib/queue')

      const result = await getJobById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getJobsByStatus', () => {
    it('should retrieve waiting jobs', async () => {
      const mockJobs = [
        { id: 'job-1', name: 'job-1', data: {} },
        { id: 'job-2', name: 'job-2', data: {} },
      ] as unknown as Job[]

      mockGetJobs.mockResolvedValue(mockJobs)

      const { getJobsByStatus } = await import('@/lib/queue')

      const result = await getJobsByStatus('waiting', 10)

      expect(result).toEqual(mockJobs)
      expect(mockGetJobs).toHaveBeenCalledWith(['waiting'], 0, 9)
    })

    it('should retrieve failed jobs with custom limit', async () => {
      const mockJobs = [
        { id: 'failed-1', name: 'failed-1', data: {} },
      ] as unknown as Job[]

      mockGetJobs.mockResolvedValue(mockJobs)

      const { getJobsByStatus } = await import('@/lib/queue')

      const result = await getJobsByStatus('failed', 5)

      expect(result).toEqual(mockJobs)
      expect(mockGetJobs).toHaveBeenCalledWith(['failed'], 0, 4)
    })

    it('should handle all status types', async () => {
      const statuses = ['active', 'waiting', 'completed', 'failed'] as const

      for (const status of statuses) {
        mockGetJobs.mockResolvedValue([])

        const { getJobsByStatus } = await import('@/lib/queue')
        await getJobsByStatus(status)

        expect(mockGetJobs).toHaveBeenCalledWith([status], 0, 9)
      }
    })
  })

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      const waitingJobs = [{ id: '1' }, { id: '2' }] as unknown as Job[]
      const activeJobs = [{ id: '3' }] as unknown as Job[]
      const completedJobs = [{ id: '4' }, { id: '5' }, { id: '6' }] as unknown as Job[]
      const failedJobs = [] as unknown as Job[]
      const delayedJobs = [{ id: '7' }] as unknown as Job[]

      mockGetWaiting.mockResolvedValue(waitingJobs)
      mockGetActive.mockResolvedValue(activeJobs)
      mockGetCompleted.mockResolvedValue(completedJobs)
      mockGetFailed.mockResolvedValue(failedJobs)
      mockGetDelayed.mockResolvedValue(delayedJobs)

      const { getQueueStats } = await import('@/lib/queue')

      const result = await getQueueStats()

      expect(result).toEqual({
        waiting: 2,
        active: 1,
        completed: 3,
        failed: 0,
        delayed: 1,
      })
    })

    it('should handle empty queue', async () => {
      mockGetWaiting.mockResolvedValue([])
      mockGetActive.mockResolvedValue([])
      mockGetCompleted.mockResolvedValue([])
      mockGetFailed.mockResolvedValue([])
      mockGetDelayed.mockResolvedValue([])

      const { getQueueStats } = await import('@/lib/queue')

      const result = await getQueueStats()

      expect(result).toEqual({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      })
    })
  })

  describe('retryJob', () => {
    it('should retry existing failed job', async () => {
      const mockJob = {
        id: 'failed-job',
        retry: vi.fn().mockResolvedValue(undefined),
      } as unknown as Job

      mockGetJob.mockResolvedValue(mockJob)

      const { retryJob } = await import('@/lib/queue')

      const result = await retryJob('failed-job')

      expect(result).toBe(true)
      expect(mockGetJob).toHaveBeenCalledWith('failed-job')
      expect(mockJob.retry).toHaveBeenCalled()
    })

    it('should return false for non-existent job', async () => {
      mockGetJob.mockResolvedValue(null)

      const { retryJob } = await import('@/lib/queue')

      const result = await retryJob('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('removeJob', () => {
    it('should remove existing job', async () => {
      const mockJob = {
        id: 'job-to-remove',
        remove: vi.fn().mockResolvedValue(undefined),
      } as unknown as Job

      mockGetJob.mockResolvedValue(mockJob)

      const { removeJob } = await import('@/lib/queue')

      const result = await removeJob('job-to-remove')

      expect(result).toBe(true)
      expect(mockGetJob).toHaveBeenCalledWith('job-to-remove')
      expect(mockJob.remove).toHaveBeenCalled()
    })

    it('should return false for non-existent job', async () => {
      mockGetJob.mockResolvedValue(null)

      const { removeJob } = await import('@/lib/queue')

      const result = await removeJob('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('cleanupOldJobs', () => {
    it('should clean up old completed and failed jobs', async () => {
      mockClean.mockResolvedValue([])

      const { cleanupOldJobs } = await import('@/lib/queue')

      await cleanupOldJobs()

      expect(mockClean).toHaveBeenCalledTimes(2)
      // Completed jobs older than 24 hours
      expect(mockClean).toHaveBeenCalledWith(24 * 60 * 60 * 1000, 100, 'completed')
      // Failed jobs older than 7 days
      expect(mockClean).toHaveBeenCalledWith(7 * 24 * 60 * 60 * 1000, 50, 'failed')
    })
  })

  describe('closeQueue', () => {
    it('should close queue and connection gracefully', async () => {
      const mockJob = {
        id: 'job-123',
        name: 'test-job',
        data: {},
      } as unknown as Job

      // First initialize the queue by calling a queue function
      mockAdd.mockResolvedValue(mockJob)
      const { addJobToQueue, closeQueue } = await import('@/lib/queue')
      await addJobToQueue('test-job', {})

      // Now setup mocks for close
      mockClose.mockResolvedValue()
      mockQuit.mockResolvedValue('OK' as any)

      await closeQueue()

      expect(mockClose).toHaveBeenCalled()
      expect(mockQuit).toHaveBeenCalled()
    })
  })
})
