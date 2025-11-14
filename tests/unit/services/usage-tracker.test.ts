import { describe, it, expect, vi, beforeEach } from 'vitest'

// Создаем мок для createMockQuery
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}

  let singleResult: { data: any; error: any } | undefined = undefined

  query.select = vi.fn().mockImplementation(() => query)
  query.insert = vi.fn().mockImplementation(() => query)
  query.update = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.gte = vi.fn().mockImplementation(() => query)
  query.lte = vi.fn().mockImplementation(() => query)
  query.order = vi.fn().mockImplementation(() => query)
  query.limit = vi.fn().mockImplementation(() => query)

  query.single = vi.fn().mockImplementation(() => {
    query.__singleCalled__ = true
    return query
  })

  query.maybeSingle = vi.fn().mockImplementation(() => {
    query.__singleCalled__ = true
    return query
  })

  query.setSingleResult = (res: { data: any; error: any }) => {
    singleResult = res
    return query
  }

  query.then = vi.fn((resolve) => {
    if (query.__singleCalled__ && singleResult !== undefined) {
      return Promise.resolve(singleResult).then(resolve)
    }

    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })

  query.catch = vi.fn((reject) => {
    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).catch(reject)
  })

  return query
}

const mockSupabaseClient = createMockQuery()
// Добавляем from как mock функцию
mockSupabaseClient.from = vi.fn(() => mockSupabaseClient)

const mockGetOrganizationSubscription = vi.fn()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('@/lib/services/billing', () => ({
  getOrganizationSubscription: (...args: any[]) => mockGetOrganizationSubscription(...args),
}))

vi.mock('@/lib/utils', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

// Импортируем после моков
import {
  recordUsage,
  checkUsageLimit,
  useResource,
} from '@/lib/services/usage-tracker'

describe('Usage Tracker Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('recordUsage', () => {
    it('должен записать использование ресурса с подпиской', async () => {
      const mockSubscription = {
        id: 'sub-123',
        plan_id: 'plan-1',
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const insertQuery = createMockQuery({ data: null, error: null })
      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await recordUsage('org-123', 'tokens', 1000, 'Test usage')

      expect(mockGetOrganizationSubscription).toHaveBeenCalledWith('org-123')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('usage_records')
      expect(insertQuery.insert).toHaveBeenCalledWith({
        org_id: 'org-123',
        subscription_id: 'sub-123',
        resource_type: 'tokens',
        amount: 1000,
        description: 'Test usage',
        metadata: {},
      })
    })

    it('должен записать использование без подписки (subscription_id = null)', async () => {
      mockGetOrganizationSubscription.mockResolvedValue(null)

      const insertQuery = createMockQuery({ data: null, error: null })
      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await recordUsage('org-123', 'messages', 5)

      expect(insertQuery.insert).toHaveBeenCalledWith({
        org_id: 'org-123',
        subscription_id: null,
        resource_type: 'messages',
        amount: 5,
        description: 'Использование messages',
        metadata: {},
      })
    })

    it('должен записать использование с metadata', async () => {
      mockGetOrganizationSubscription.mockResolvedValue({ id: 'sub-123' })

      const insertQuery = createMockQuery({ data: null, error: null })
      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const metadata = { agent_id: 'agent-1', request_id: 'req-456' }
      await recordUsage('org-123', 'storage', 100, 'File upload', metadata)

      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata,
        })
      )
    })

    it('не должен выбрасывать ошибку при проблемах с БД', async () => {
      mockGetOrganizationSubscription.mockResolvedValue({ id: 'sub-123' })

      const insertQuery = createMockQuery({
        data: null,
        error: { message: 'Database error' },
      })
      mockSupabaseClient.from.mockReturnValue(insertQuery)

      // Не должно выбросить ошибку
      await expect(recordUsage('org-123', 'tokens', 1000)).resolves.toBeUndefined()
    })
  })

  describe('checkUsageLimit', () => {
    it('должен разрешить использование если в пределах лимита', async () => {
      const mockSubscription = {
        id: 'sub-123',
        plan_id: 'plan-1',
      }

      const mockPlan = {
        limits: {
          tokens_per_month: 100000,
          messages_per_month: 1000,
          storage_gb: 10,
          agents: 5,
        },
      }

      const mockUsageRecords = [
        { amount: 10000 },
        { amount: 5000 },
      ]

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: mockUsageRecords, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery) // для плана
        .mockReturnValueOnce(usageQuery) // для usage_records

      const result = await checkUsageLimit('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: true,
        current: 15000,
        limit: 100000,
      })
    })

    it('должен запретить использование если превышен лимит', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: 10000,
        },
      }
      const mockUsageRecords = [{ amount: 9500 }]

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: mockUsageRecords, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery)
        .mockReturnValueOnce(usageQuery)

      const result = await checkUsageLimit('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: false,
        current: 9500,
        limit: 10000,
      })
    })

    it('должен разрешить неограниченное использование если лимит = -1', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: -1, // Неограниченно
        },
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      mockSupabaseClient.from.mockReturnValueOnce(planQuery)

      const result = await checkUsageLimit('org-123', 'tokens', 999999)

      expect(result).toEqual({
        allowed: true,
        current: 0,
        limit: -1,
      })
    })

    it('должен запретить использование если нет подписки', async () => {
      mockGetOrganizationSubscription.mockResolvedValue(null)

      const result = await checkUsageLimit('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: false,
        current: 0,
        limit: 0,
      })
    })

    it('должен запретить использование если план не найден', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValueOnce(planQuery)

      const result = await checkUsageLimit('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: false,
        current: 0,
        limit: 0,
      })
    })

    it('должен корректно проверять разные типы ресурсов', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: 100000,
          messages_per_month: 1000,
          storage_gb: 10,
          agents: 5,
        },
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      // Проверяем messages
      const planQueryMessages = createMockQuery()
      planQueryMessages.setSingleResult({ data: mockPlan, error: null })

      const usageQueryMessages = createMockQuery({ data: [{ amount: 500 }], error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQueryMessages)
        .mockReturnValueOnce(usageQueryMessages)

      const resultMessages = await checkUsageLimit('org-123', 'messages', 100)

      expect(resultMessages.limit).toBe(1000)
      expect(resultMessages.current).toBe(500)

      // Проверяем storage
      vi.clearAllMocks()
      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQueryStorage = createMockQuery()
      planQueryStorage.setSingleResult({ data: mockPlan, error: null })

      const usageQueryStorage = createMockQuery({ data: [{ amount: 3 }], error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQueryStorage)
        .mockReturnValueOnce(usageQueryStorage)

      const resultStorage = await checkUsageLimit('org-123', 'storage', 2)

      expect(resultStorage.limit).toBe(10)
      expect(resultStorage.current).toBe(3)
    })

    it('должен разрешать использование при ошибке (fail-open)', async () => {
      mockGetOrganizationSubscription.mockRejectedValue(new Error('DB error'))

      const result = await checkUsageLimit('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: true,
        current: 0,
        limit: -1,
      })
    })

    it('должен корректно считать текущее использование за месяц', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: 100000,
        },
      }
      const mockUsageRecords = [
        { amount: 1000 },
        { amount: 2000 },
        { amount: 3000 },
        { amount: 4000 },
      ]

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: mockUsageRecords, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery)
        .mockReturnValueOnce(usageQuery)

      const result = await checkUsageLimit('org-123', 'tokens', 500)

      expect(result.current).toBe(10000) // 1000 + 2000 + 3000 + 4000
      expect(result.allowed).toBe(true) // 10000 + 500 <= 100000
    })
  })

  describe('useResource', () => {
    it('должен записать использование если лимит не превышен', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: 100000,
        },
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: [{ amount: 10000 }], error: null })
      const insertQuery = createMockQuery({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery) // для checkUsageLimit
        .mockReturnValueOnce(usageQuery) // для checkUsageLimit
        .mockReturnValueOnce(insertQuery) // для recordUsage

      const result = await useResource('org-123', 'tokens', 1000, 'API call')

      expect(result).toEqual({
        allowed: true,
        current: 10000,
        limit: 100000,
      })

      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          org_id: 'org-123',
          resource_type: 'tokens',
          amount: 1000,
          description: 'API call',
        })
      )
    })

    it('НЕ должен записывать использование если лимит превышен', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          tokens_per_month: 10000,
        },
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: [{ amount: 9500 }], error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery)
        .mockReturnValueOnce(usageQuery)
      // НЕ должно быть третьего вызова для insert

      const result = await useResource('org-123', 'tokens', 1000)

      expect(result).toEqual({
        allowed: false,
        current: 9500,
        limit: 10000,
      })

      // Проверяем что insert НЕ был вызван
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(2)
    })

    it('должен передавать metadata при записи использования', async () => {
      const mockSubscription = { id: 'sub-123', plan_id: 'plan-1' }
      const mockPlan = {
        limits: {
          messages_per_month: 1000,
        },
      }

      mockGetOrganizationSubscription.mockResolvedValue(mockSubscription)

      const planQuery = createMockQuery()
      planQuery.setSingleResult({ data: mockPlan, error: null })

      const usageQuery = createMockQuery({ data: [], error: null })
      const insertQuery = createMockQuery({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(planQuery)
        .mockReturnValueOnce(usageQuery)
        .mockReturnValueOnce(insertQuery)

      const metadata = { user_id: 'user-123', action: 'send_message' }
      await useResource('org-123', 'messages', 1, 'User message', metadata)

      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata,
        })
      )
    })
  })
})
