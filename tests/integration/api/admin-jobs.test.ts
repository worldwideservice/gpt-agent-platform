import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock queue module
vi.mock('@/lib/queue', () => ({
  getQueueStats: vi.fn(),
  getJobsByStatus: vi.fn(),
  addJobToQueue: vi.fn(),
  getJobById: vi.fn(),
  removeJob: vi.fn(),
  retryJob: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

describe('API: /api/admin/jobs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/jobs', () => {
    it('should return queue stats without jobs when no status param', async () => {
      const { getQueueStats } = await import('@/lib/queue')

      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      })

      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.stats).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      })
      expect(data.jobs).toBeNull()
    })

    it('should return stats and jobs when status param provided', async () => {
      const { getQueueStats, getJobsByStatus } = await import('@/lib/queue')

      vi.mocked(getQueueStats).mockResolvedValue({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      })

      vi.mocked(getJobsByStatus).mockResolvedValue([
        {
          id: 'job-1',
          name: 'test-job',
          data: { test: 'data' },
          timestamp: 1234567890,
          processedOn: 1234567900,
          finishedOn: 1234567910,
          failedReason: undefined,
          attemptsMade: 1,
        } as any,
      ])

      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs?status=completed&limit=5')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.jobs).toHaveLength(1)
      expect(data.jobs[0].id).toBe('job-1')
      expect(getJobsByStatus).toHaveBeenCalledWith('completed', 5)
    })

    it('should handle errors gracefully', async () => {
      const { getQueueStats } = await import('@/lib/queue')

      vi.mocked(getQueueStats).mockRejectedValue(new Error('Redis connection failed'))

      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Redis connection failed')
    })
  })

  describe('POST /api/admin/jobs', () => {
    it('should create a new job', async () => {
      const { addJobToQueue } = await import('@/lib/queue')

      vi.mocked(addJobToQueue).mockResolvedValue({
        id: 'new-job-123',
        name: 'webhook-event',
        data: { payload: { test: 'data' } },
      } as any)

      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs', {
        method: 'POST',
        body: JSON.stringify({
          jobName: 'webhook-event',
          payload: { test: 'data' },
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.job.id).toBe('new-job-123')
      expect(data.job.name).toBe('webhook-event')
      expect(addJobToQueue).toHaveBeenCalledWith('webhook-event', { test: 'data' })
    })

    it('should return 400 if jobName is missing', async () => {
      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs', {
        method: 'POST',
        body: JSON.stringify({
          payload: { test: 'data' },
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Job name is required')
    })

    it('should handle errors when creating job', async () => {
      const { addJobToQueue } = await import('@/lib/queue')

      vi.mocked(addJobToQueue).mockRejectedValue(new Error('Queue is full'))

      const route = await import('@/app/api/admin/jobs/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs', {
        method: 'POST',
        body: JSON.stringify({
          jobName: 'test-job',
          payload: {},
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Queue is full')
    })
  })

  describe('GET /api/admin/jobs/[id]', () => {
    it('should return job details', async () => {
      const { getJobById } = await import('@/lib/queue')

      vi.mocked(getJobById).mockResolvedValue({
        id: 'job-123',
        name: 'test-job',
        data: { test: 'data' },
        opts: { attempts: 3 },
        timestamp: 1234567890,
        processedOn: 1234567900,
        finishedOn: 1234567910,
        failedReason: undefined,
        stacktrace: [],
        returnvalue: { success: true },
        attemptsMade: 1,
        progress: 100,
      } as any)

      const route = await import('@/app/api/admin/jobs/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/job-123')
      const response = await route.GET(request, { params: { id: 'job-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.job.id).toBe('job-123')
      expect(data.job.progress).toBe(100)
    })

    it('should return 404 if job not found', async () => {
      const { getJobById } = await import('@/lib/queue')

      vi.mocked(getJobById).mockResolvedValue(null)

      const route = await import('@/app/api/admin/jobs/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/non-existent')
      const response = await route.GET(request, { params: { id: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Job not found')
    })
  })

  describe('DELETE /api/admin/jobs/[id]', () => {
    it('should remove job successfully', async () => {
      const { removeJob } = await import('@/lib/queue')

      vi.mocked(removeJob).mockResolvedValue(true)

      const route = await import('@/app/api/admin/jobs/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/job-123', {
        method: 'DELETE',
      })
      const response = await route.DELETE(request, { params: { id: 'job-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('removed successfully')
      expect(removeJob).toHaveBeenCalledWith('job-123')
    })

    it('should return 404 if job not found', async () => {
      const { removeJob } = await import('@/lib/queue')

      vi.mocked(removeJob).mockResolvedValue(false)

      const route = await import('@/app/api/admin/jobs/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/non-existent', {
        method: 'DELETE',
      })
      const response = await route.DELETE(request, { params: { id: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Job not found or already removed')
    })
  })

  describe('POST /api/admin/jobs/[id]/retry', () => {
    it('should retry job successfully', async () => {
      const { retryJob } = await import('@/lib/queue')

      vi.mocked(retryJob).mockResolvedValue(true)

      const route = await import('@/app/api/admin/jobs/[id]/retry/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/failed-job/retry', {
        method: 'POST',
      })
      const response = await route.POST(request, { params: { id: 'failed-job' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('retried successfully')
      expect(retryJob).toHaveBeenCalledWith('failed-job')
    })

    it('should return 404 if job cannot be retried', async () => {
      const { retryJob } = await import('@/lib/queue')

      vi.mocked(retryJob).mockResolvedValue(false)

      const route = await import('@/app/api/admin/jobs/[id]/retry/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/non-existent/retry', {
        method: 'POST',
      })
      const response = await route.POST(request, { params: { id: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Job not found or cannot be retried')
    })
  })

  describe('GET /api/admin/jobs/test', () => {
    it('should return usage instructions', async () => {
      const route = await import('@/app/api/admin/jobs/test/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/test')
      const response = await route.GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Test job endpoint')
      expect(data.usage).toBeDefined()
      expect(data.usage.createTestJob).toBeDefined()
      expect(data.usage.checkQueueStats).toBeDefined()
      expect(data.availableJobTypes).toBeInstanceOf(Array)
    })
  })

  describe('POST /api/admin/jobs/test', () => {
    it('should create test job', async () => {
      const { addJobToQueue } = await import('@/lib/queue')

      vi.mocked(addJobToQueue).mockResolvedValue({
        id: 'test-job-456',
        name: 'test-job',
        data: { test: true, message: 'Test message' },
      } as any)

      const route = await import('@/app/api/admin/jobs/test/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/test', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Test job created')
      expect(data.job.id).toBe('test-job-456')
      expect(data.job.name).toBe('test-job')
      expect(data.instructions).toBeDefined()
      expect(addJobToQueue).toHaveBeenCalledWith(
        'test-job',
        expect.objectContaining({
          test: true,
          message: 'Test message',
        })
      )
    })

    it('should create test job with default message', async () => {
      const { addJobToQueue } = await import('@/lib/queue')

      vi.mocked(addJobToQueue).mockResolvedValue({
        id: 'test-job-789',
        name: 'test-job',
        data: { test: true },
      } as any)

      const route = await import('@/app/api/admin/jobs/test/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/test', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(addJobToQueue).toHaveBeenCalledWith(
        'test-job',
        expect.objectContaining({
          test: true,
          message: 'Test job from API',
        })
      )
    })

    it('should handle errors when creating test job', async () => {
      const { addJobToQueue } = await import('@/lib/queue')

      vi.mocked(addJobToQueue).mockRejectedValue(new Error('Redis unavailable'))

      const route = await import('@/app/api/admin/jobs/test/route')
      const request = new NextRequest('http://localhost:3000/api/admin/jobs/test', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Redis unavailable')
    })
  })
})
