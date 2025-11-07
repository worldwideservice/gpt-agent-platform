import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getDashboardStats: vi.fn(),
}))

describe('API: /api/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/dashboard', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/dashboard/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return dashboard stats', async () => {
      const { auth } = await import('@/auth')
      const { getDashboardStats } = await import('@/lib/repositories/agents')

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

      vi.mocked(getDashboardStats).mockResolvedValue(mockStats as any)

      const route = await import('@/app/api/dashboard/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockStats)
      expect(getDashboardStats).toHaveBeenCalledWith('org-123')
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getDashboardStats } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getDashboardStats).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/dashboard/route')
      const request = new NextRequest('http://localhost:3000/api/dashboard')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

