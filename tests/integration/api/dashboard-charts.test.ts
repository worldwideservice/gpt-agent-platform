import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getMonthlyResponsesSeries: vi.fn(),
  getDailyResponsesSeries: vi.fn(),
  getWeeklyBarChartData: vi.fn(),
}))

describe('API: /api/dashboard/charts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/dashboard/charts', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return monthly chart data', async () => {
      const { auth } = await import('@/auth')
      const { getMonthlyResponsesSeries } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockData = {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 15, 20],
      }

      vi.mocked(getMonthlyResponsesSeries).mockResolvedValue(mockData as any)

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts?type=monthly')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockData)
    })

    it('should return daily chart data', async () => {
      const { auth } = await import('@/auth')
      const { getDailyResponsesSeries } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockData = {
        labels: ['Mon', 'Tue', 'Wed'],
        data: [5, 10, 15],
      }

      vi.mocked(getDailyResponsesSeries).mockResolvedValue(mockData as any)

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts?type=daily')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockData)
    })

    it('should return weekly chart data', async () => {
      const { auth } = await import('@/auth')
      const { getWeeklyBarChartData } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockData = {
        labels: ['Week 1', 'Week 2', 'Week 3'],
        data: [100, 150, 200],
      }

      vi.mocked(getWeeklyBarChartData).mockResolvedValue(mockData as any)

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts?type=weekly')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockData)
    })

    it('should return 400 for invalid type', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts?type=invalid')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getMonthlyResponsesSeries } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getMonthlyResponsesSeries).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/dashboard/charts/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard/charts?type=monthly')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

