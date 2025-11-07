import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSubscription, updateSubscription } from '@/lib/repositories/subscriptions'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Subscriptions Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSubscription', () => {
    it('should return subscription data', async () => {
      const mockSubscription = {
        plan: 'premium',
        status: 'active',
        token_quota: 10000,
        token_used: 5000,
        renews_at: '2025-02-01T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getSubscription('org-123')

      expect(result).toBeDefined()
      expect(result?.plan).toBe('premium')
      expect(result?.status).toBe('active')
      expect(result?.tokenQuota).toBe(10000)
      expect(result?.tokenUsed).toBe(5000)
      expect(result?.renewsAt).toBe('2025-02-01T00:00:00Z')
    })

    it('should return null if subscription not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getSubscription('org-123')

      expect(result).toBeNull()
    })

    it('should return null on error', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getSubscription('org-123')

      expect(result).toBeNull()
    })
  })

  describe('updateSubscription', () => {
    it('should update subscription with all fields', async () => {
      const mockUpdatedSubscription = {
        plan: 'vip',
        status: 'active',
        token_quota: 20000,
        token_used: 10000,
        renews_at: '2025-03-01T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockUpdatedSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await updateSubscription('org-123', {
        plan: 'vip',
        status: 'active',
        tokenQuota: 20000,
        tokenUsed: 10000,
        renewsAt: '2025-03-01T00:00:00Z',
      })

      expect(result.plan).toBe('vip')
      expect(result.status).toBe('active')
      expect(result.tokenQuota).toBe(20000)
      expect(result.tokenUsed).toBe(10000)
      expect(updateQuery.update).toHaveBeenCalledWith({
        plan: 'vip',
        status: 'active',
        token_quota: 20000,
        token_used: 10000,
        renews_at: '2025-03-01T00:00:00Z',
      })
    })

    it('should update subscription with partial fields', async () => {
      const mockUpdatedSubscription = {
        plan: 'premium',
        status: 'cancelled',
        token_quota: 10000,
        token_used: 5000,
        renews_at: null,
      }

      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockUpdatedSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await updateSubscription('org-123', {
        status: 'cancelled',
      })

      expect(result.status).toBe('cancelled')
      expect(updateQuery.update).toHaveBeenCalledWith({
        status: 'cancelled',
      })
    })

    it('should update only tokenQuota', async () => {
      const mockUpdatedSubscription = {
        plan: 'premium',
        status: 'active',
        token_quota: 15000,
        token_used: 5000,
        renews_at: null,
      }

      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockUpdatedSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await updateSubscription('org-123', {
        tokenQuota: 15000,
      })

      expect(result.tokenQuota).toBe(15000)
      expect(updateQuery.update).toHaveBeenCalledWith({
        token_quota: 15000,
      })
    })

    it('should update only tokenUsed', async () => {
      const mockUpdatedSubscription = {
        plan: 'premium',
        status: 'active',
        token_quota: 10000,
        token_used: 7500,
        renews_at: null,
      }

      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockUpdatedSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await updateSubscription('org-123', {
        tokenUsed: 7500,
      })

      expect(result.tokenUsed).toBe(7500)
      expect(updateQuery.update).toHaveBeenCalledWith({
        token_used: 7500,
      })
    })

    it('should update renewsAt to null', async () => {
      const mockUpdatedSubscription = {
        plan: 'premium',
        status: 'active',
        token_quota: 10000,
        token_used: 5000,
        renews_at: null,
      }

      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: mockUpdatedSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await updateSubscription('org-123', {
        renewsAt: null,
      })

      expect(result.renewsAt).toBeNull()
      expect(updateQuery.update).toHaveBeenCalledWith({
        renews_at: null,
      })
    })

    it('should throw error if update fails', async () => {
      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(updateSubscription('org-123', { status: 'active' })).rejects.toThrow('Не удалось обновить подписку')
    })

    it('should throw error if subscription not found after update', async () => {
      const updateQuery = createMockQuery()
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(updateSubscription('org-123', { status: 'active' })).rejects.toThrow('Подписка не найдена')
    })
  })
})

