import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  notifyOrganization,
  notifyLimitReached,
  notifyLimitApproaching,
  notifyIntegrationConnected,
  notifyIntegrationError,
  notifyAgentCreated,
  notifySystemEvent,
} from '@/lib/utils/notifications'

// Мокаем createNotification
vi.mock('@/lib/repositories/notifications', () => ({
  createNotification: vi.fn().mockResolvedValue({
    id: 'notif-123',
    orgId: 'org-123',
    title: 'Test',
  }),
}))

describe('Notifications Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('notifyOrganization', () => {
    it('should create notification successfully', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyOrganization('org-123', {
        title: 'Test Notification',
        message: 'Test message',
      })

      expect(createNotification).toHaveBeenCalledWith('org-123', {
        title: 'Test Notification',
        message: 'Test message',
      })
    })

    it('should handle errors gracefully', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')
      vi.mocked(createNotification).mockRejectedValueOnce(new Error('Database error'))

      await expect(
        notifyOrganization('org-123', {
          title: 'Test',
        })
      ).resolves.not.toThrow()
    })
  })

  describe('notifyLimitReached', () => {
    it('should create limit reached notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyLimitReached('org-123', 'user-123', {
        currentUsage: 1000,
        limit: 1000,
        planName: 'Free',
      })

      expect(createNotification).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          type: 'warning',
          title: expect.stringContaining('лимит достигнут'),
          userId: 'user-123',
        })
      )
    })
  })

  describe('notifyLimitApproaching', () => {
    it('should create limit approaching notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyLimitApproaching('org-123', 'user-123', {
        currentUsage: 800,
        limit: 1000,
        percentage: 80,
      })

      expect(createNotification).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          type: 'warning',
          title: expect.stringContaining('Приближение к лимиту'),
          userId: 'user-123',
        })
      )
    })
  })

  describe('notifyIntegrationConnected', () => {
    it('should create integration connected notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyIntegrationConnected('org-123', 'user-123', 'Kommo')

      expect(createNotification).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          type: 'success',
          title: expect.stringContaining('Интеграция'),
          userId: 'user-123',
        })
      )
    })
  })

  describe('notifyIntegrationError', () => {
    it('should create integration error notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyIntegrationError('org-123', 'user-123', 'Kommo', 'Connection failed')

      expect(createNotification).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          type: 'error',
          title: expect.stringContaining('Ошибка интеграции'),
          userId: 'user-123',
        })
      )
    })
  })

  describe('notifyAgentCreated', () => {
    it('should create agent created notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifyAgentCreated('org-123', 'user-123', 'Test Agent', 'agent-123')

      expect(createNotification).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          type: 'success',
          title: expect.stringContaining('Агент'),
          userId: 'user-123',
        })
      )
    })
  })

  describe('notifySystemEvent', () => {
    it('should create system event notification', async () => {
      const { createNotification } = await import('@/lib/repositories/notifications')

      await notifySystemEvent('org-123', 'user-123', 'System Update', 'Update completed', 'info')

      expect(createNotification).toHaveBeenCalledWith('org-123', {
        userId: 'user-123',
        type: 'info',
        title: 'System Update',
        message: 'Update completed',
      })
    })
  })
})

