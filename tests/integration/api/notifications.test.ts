import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/notifications', () => ({
  getNotifications: vi.fn(),
  getUnreadCount: vi.fn(),
}))

describe('API: /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/notifications', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/notifications/route')
      const request = new NextRequest('http://localhost:3000/api/notifications')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return notifications list', async () => {
      const { auth } = await import('@/auth')
      const { getNotifications, getUnreadCount } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'info',
          title: 'Test Notification',
          message: 'Test message',
          read: false,
          created_at: '2024-01-01T00:00:00Z',
        },
      ]

      vi.mocked(getNotifications).mockResolvedValue(mockNotifications)
      vi.mocked(getUnreadCount).mockResolvedValue(1)

      const route = await import('@/app/api/notifications/route')
      const request = new NextRequest('http://localhost:3000/api/notifications')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.unreadCount).toBe(1)
    })

    it('should filter notifications by read status', async () => {
      const { auth } = await import('@/auth')
      const { getNotifications, getUnreadCount } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getNotifications).mockResolvedValue([])
      vi.mocked(getUnreadCount).mockResolvedValue(0)

      const route = await import('@/app/api/notifications/route')
      const request = new NextRequest('http://localhost:3000/api/notifications?unreadOnly=true')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getNotifications).toHaveBeenCalledWith('org-123', 'user-123', { unreadOnly: true, limit: undefined })
    })
  })

  describe('Error handling', () => {
    it('should handle errors when getting notifications', async () => {
      const { auth } = await import('@/auth')
      const { getNotifications, getUnreadCount } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getNotifications).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/notifications/route')
      const request = new NextRequest('http://localhost:3000/api/notifications')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

