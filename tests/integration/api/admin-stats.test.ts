import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock admin
vi.mock('@/lib/admin', () => ({
  checkAdminAccess: vi.fn(),
  getAdminStats: vi.fn(),
}))

describe('API: /api/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/stats', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/admin/stats/route')
      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not admin', async () => {
      const { auth } = await import('@/auth')
      const { checkAdminAccess } = await import('@/lib/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      vi.mocked(checkAdminAccess).mockResolvedValue(false)

      const route = await import('@/app/api/admin/stats/route')
      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Admin access required')
    })

    it('should return admin stats for admin user', async () => {
      const { auth } = await import('@/auth')
      const { checkAdminAccess, getAdminStats } = await import('@/lib/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      vi.mocked(checkAdminAccess).mockResolvedValue(true)

      const mockStats = {
        totalUsers: 100,
        totalAgents: 50,
        totalOrganizations: 10,
        activeSubscriptions: 5,
      }

      vi.mocked(getAdminStats).mockResolvedValue(mockStats)

      const route = await import('@/app/api/admin/stats/route')
      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockStats)
      expect(checkAdminAccess).toHaveBeenCalledWith('user-123')
      expect(getAdminStats).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { checkAdminAccess } = await import('@/lib/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      vi.mocked(checkAdminAccess).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/admin/stats/route')
      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})

