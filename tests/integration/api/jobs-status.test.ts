import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock Supabase client - create a shared mock instance
const mockSupabaseFrom = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: mockSupabaseFrom,
  },
}))

describe('API: /api/jobs/status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/jobs/status', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/jobs/status/route')
      const request = new NextRequest('http://localhost:3000/api/jobs/status')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return specific job status', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      const mockJob = {
        id: 'job-123',
        user_id: 'user-123',
        status: 'completed',
        type: 'test',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockJob,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      mockSupabaseFrom.mockReturnValue({ select: mockSelect })

      const route = await import('@/app/api/jobs/status/route')
      const request = new NextRequest('http://localhost:3000/api/jobs/status?jobId=job-123')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.job).toEqual(mockJob)
    })

    it('should return list of jobs', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      const mockJobs = [
        {
          id: 'job-1',
          user_id: 'user-123',
          status: 'pending',
        },
        {
          id: 'job-2',
          user_id: 'user-123',
          status: 'completed',
        },
      ]

      const mockRange = vi.fn().mockResolvedValue({
        data: mockJobs,
        error: null,
      })
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      mockSupabaseFrom.mockReturnValue({ select: mockSelect })

      const route = await import('@/app/api/jobs/status/route')
      const request = new NextRequest('http://localhost:3000/api/jobs/status?limit=10&offset=0')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data.jobs)).toBe(true)
      expect(data.jobs).toEqual(mockJobs)
    })

    it('should return 404 if job not found', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      mockSupabaseFrom.mockReturnValue({ select: mockSelect })

      const route = await import('@/app/api/jobs/status/route')
      const request = new NextRequest('http://localhost:3000/api/jobs/status?jobId=job-123')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Job not found')
    })
  })
})

