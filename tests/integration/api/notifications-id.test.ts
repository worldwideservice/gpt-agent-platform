import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/notifications', () => ({
  markNotificationAsRead: vi.fn(),
  deleteNotification: vi.fn(),
}))

describe('API: /api/notifications/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Note: GET endpoint doesn't exist in /api/notifications/[id]/route.ts
  // Only PATCH and DELETE are available

  describe('PATCH /api/notifications/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/notifications/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/notif-123', {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      })
      const params = Promise.resolve({ id: 'notif-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should mark notification as read', async () => {
      const { auth } = await import('@/auth')
      const { markNotificationAsRead } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(markNotificationAsRead).mockResolvedValue(undefined)

      const route = await import('@/app/api/notifications/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/notif-123', {
        method: 'PATCH',
        body: JSON.stringify({ isRead: true }),
      })
      const params = Promise.resolve({ id: 'notif-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(markNotificationAsRead).toHaveBeenCalledWith('notif-123', 'org-123')
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/notifications/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/notif-123', {
        method: 'PATCH',
        body: JSON.stringify({ isRead: false }),
      })
      const params = Promise.resolve({ id: 'notif-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/notifications/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/notifications/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/notif-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'notif-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete notification', async () => {
      const { auth } = await import('@/auth')
      const { deleteNotification } = await import('@/lib/repositories/notifications')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteNotification).mockResolvedValue(undefined)

      const route = await import('@/app/api/notifications/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/notifications/notif-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'notif-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteNotification).toHaveBeenCalledWith('notif-123', 'org-123')
    })
  })
})

