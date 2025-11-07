import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  createNotification,
} from '@/lib/repositories/notifications'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    is: vi.fn(() => query),
    or: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Notifications Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getNotifications', () => {
    it('should return notifications for organization', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          org_id: 'org-123',
          user_id: 'user-123',
          type: 'info',
          title: 'Test Notification',
          message: 'Test message',
          link_url: null,
          link_text: null,
          is_read: false,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockNotifications, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getNotifications('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('notif-1')
      expect(result[0].orgId).toBe('org-123')
      expect(result[0].type).toBe('info')
    })

    it('should filter notifications by userId', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.or.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getNotifications('org-123', 'user-123')

      expect(queryChain.or).toHaveBeenCalled()
    })

    it('should filter by read status', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq (org_id)
        .mockReturnValueOnce(queryChain) // второй eq (is_read)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getNotifications('org-123', null, { unreadOnly: true })

      expect(queryChain.eq).toHaveBeenCalledWith('is_read', false)
    })

    it('should throw error on error', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с ошибкой
      queryChain.then = vi.fn((resolve, reject) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve).catch(reject)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(getNotifications('org-123')).rejects.toThrow('Не удалось загрузить уведомления')
    })
  })

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ error: null }) // второй eq возвращает промис

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await markNotificationAsRead('notif-123', 'org-123')

      expect(updateQuery.update).toHaveBeenCalledWith({ is_read: true })
      expect(updateQuery.eq).toHaveBeenCalledWith('id', 'notif-123')
      expect(updateQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should handle errors gracefully', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // второй eq возвращает промис с ошибкой

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(markNotificationAsRead('notif-123', 'org-123')).rejects.toThrow()
    })
  })

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read for organization', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (org_id)
        .mockReturnValueOnce(updateQuery) // второй eq (is_read)
      updateQuery.is.mockReturnValue(updateQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await markAllNotificationsAsRead('org-123')

      expect(updateQuery.update).toHaveBeenCalledWith({ is_read: true })
      expect(updateQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(updateQuery.eq).toHaveBeenCalledWith('is_read', false)
    })

    it('should mark all notifications as read for specific user', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (org_id)
        .mockReturnValueOnce(updateQuery) // второй eq (is_read)
      updateQuery.or.mockReturnValue(updateQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await markAllNotificationsAsRead('org-123', 'user-123')

      expect(updateQuery.or).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (org_id)
        .mockReturnValueOnce(updateQuery) // второй eq (is_read)
      updateQuery.is.mockReturnValue(updateQuery)
      // Когда вызывается await на queryChain, возвращаем промис с ошибкой
      updateQuery.then = vi.fn((resolve, reject) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve).catch(reject)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(markAllNotificationsAsRead('org-123')).rejects.toThrow()
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ error: null }) // второй eq возвращает промис

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteNotification('notif-123', 'org-123')

      expect(deleteQuery.delete).toHaveBeenCalled()
      expect(deleteQuery.eq).toHaveBeenCalledWith('id', 'notif-123')
      expect(deleteQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should handle errors gracefully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // первый eq возвращает queryChain
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // второй eq возвращает промис с ошибкой

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteNotification('notif-123', 'org-123')).rejects.toThrow()
    })
  })

  describe('deleteAllNotifications', () => {
    it('should delete all notifications for organization', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq.mockReturnValue(deleteQuery)
      deleteQuery.is.mockReturnValue(deleteQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      deleteQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteAllNotifications('org-123')

      expect(deleteQuery.delete).toHaveBeenCalled()
      expect(deleteQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should delete all notifications for specific user', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq.mockReturnValue(deleteQuery)
      deleteQuery.or.mockReturnValue(deleteQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      deleteQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteAllNotifications('org-123', 'user-123')

      expect(deleteQuery.or).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq.mockReturnValue(deleteQuery)
      deleteQuery.is.mockReturnValue(deleteQuery)
      // Когда вызывается await на queryChain, возвращаем промис с ошибкой
      deleteQuery.then = vi.fn((resolve, reject) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve).catch(reject)
      })

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteAllNotifications('org-123')).rejects.toThrow()
    })
  })

  describe('getUnreadCount', () => {
    it('should return unread count for organization', async () => {
      const queryChain = createMockQuery()
      // getUnreadCount использует select('id', { count: 'exact', head: true })
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq (org_id)
        .mockReturnValueOnce(queryChain) // второй eq (is_read)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с count
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ count: 5, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUnreadCount('org-123')

      expect(result).toBe(5)
      expect(queryChain.eq).toHaveBeenCalledWith('is_read', false)
      expect(queryChain.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should return unread count for specific user', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq (org_id)
        .mockReturnValueOnce(queryChain) // второй eq (is_read)
      queryChain.or.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с count
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ count: 3, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUnreadCount('org-123', 'user-123')

      expect(result).toBe(3)
      expect(queryChain.or).toHaveBeenCalled()
    })

    it('should return 0 on error', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq (org_id)
        .mockReturnValueOnce(queryChain) // второй eq (is_read)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с ошибкой
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ count: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUnreadCount('org-123')

      expect(result).toBe(0)
    })

    it('should return 0 if count is null', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq
        .mockReturnValueOnce(queryChain) // первый eq (org_id)
        .mockReturnValueOnce(queryChain) // второй eq (is_read)
      queryChain.is.mockReturnValue(queryChain)
      // Когда вызывается await на queryChain, возвращаем промис с null count
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ count: null, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUnreadCount('org-123')

      expect(result).toBe(0)
    })
  })

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      const mockNotification = {
        id: 'notif-123',
        org_id: 'org-123',
        user_id: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
        link_url: null,
        link_text: null,
        is_read: false,
        metadata: {},
        created_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockNotification, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createNotification('org-123', {
        userId: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('notif-123')
      expect(result.title).toBe('Test Notification')
    })

    it('should create notification with all optional fields', async () => {
      const mockNotification = {
        id: 'notif-123',
        org_id: 'org-123',
        user_id: null,
        type: 'warning',
        title: 'Warning',
        message: 'Warning message',
        link_url: 'https://example.com',
        link_text: 'View',
        is_read: false,
        metadata: { key: 'value' },
        created_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockNotification, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createNotification('org-123', {
        userId: null,
        type: 'warning',
        title: 'Warning',
        message: 'Warning message',
        linkUrl: 'https://example.com',
        linkText: 'View',
        metadata: { key: 'value' },
      })

      expect(result).toBeDefined()
      expect(result.type).toBe('warning')
      expect(result.linkUrl).toBe('https://example.com')
    })

    it('should throw error if creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        createNotification('org-123', {
          type: 'info',
          title: 'Test',
        })
      ).rejects.toThrow()
    })
  })
})

