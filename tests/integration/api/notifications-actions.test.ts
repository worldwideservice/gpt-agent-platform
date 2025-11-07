import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/notifications', () => ({
  markAllNotificationsAsRead: vi.fn(),
  deleteAllNotifications: vi.fn(),
}))

describe('API: /api/notifications/actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/notifications/actions', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/notifications/actions/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/actions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'mark_read',
          notificationId: 'notif-123',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should mark all notifications as read', async () => {
      const { auth } = await import('@/auth')
      const { markAllNotificationsAsRead } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(markAllNotificationsAsRead).mockResolvedValue(undefined)

      const route = await import('@/app/api/notifications/actions/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/actions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'mark_all_read',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(markAllNotificationsAsRead).toHaveBeenCalledWith('org-123', 'user-123')
    })

    it('should delete all notifications', async () => {
      const { auth } = await import('@/auth')
      const { deleteAllNotifications } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteAllNotifications).mockResolvedValue(undefined)

      const route = await import('@/app/api/notifications/actions/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/actions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'delete_all',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteAllNotifications).toHaveBeenCalledWith('org-123', 'user-123')
    })

    it('should return 400 for invalid action', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/notifications/actions/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/actions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalid_action',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

