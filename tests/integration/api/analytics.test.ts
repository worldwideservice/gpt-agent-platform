import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock services
vi.mock('@/lib/services/analytics', () => ({
  generateDashboardStats: vi.fn(),
}))

describe('API: /api/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/analytics', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/analytics/route')
      const request = new NextRequest('http://localhost:3000/api/analytics')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return analytics data', async () => {
      const { auth } = await import('@/auth')
      const { generateDashboardStats } = await import('@/lib/services/analytics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockStats = {
        totalAgents: 10,
        activeAgents: 5,
        totalConversations: 100,
      }

      vi.mocked(generateDashboardStats).mockResolvedValue(mockStats as any)

      const route = await import('@/app/api/analytics/route')
      const request = new NextRequest('http://localhost:3000/api/analytics')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockStats)
    })

    it('should use custom date range', async () => {
      const { auth } = await import('@/auth')
      const { generateDashboardStats } = await import('@/lib/services/analytics')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(generateDashboardStats).mockResolvedValue({} as any)

      const route = await import('@/app/api/analytics/route')
      const request = new NextRequest('http://localhost:3000/api/analytics?range=30d')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(generateDashboardStats).toHaveBeenCalled()
    })

    it('should return 400 for invalid range', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/analytics/route')
      const request = new NextRequest('http://localhost:3000/api/analytics?range=invalid')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

