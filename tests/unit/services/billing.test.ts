import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createStripeCustomer,
  createSubscriptionSession,
  getOrganizationSubscription,
  getBillingPlans,
  recordUsage,
  getUsageStats,
  cancelSubscription,
  resumeSubscription,
} from '@/lib/services/billing'

// Мокаем Stripe - создаем класс-мок
const mockStripe = {
  customers: {
    create: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
  subscriptions: {
    retrieve: vi.fn(),
    cancel: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock('stripe', () => {
  class MockStripe {
    customers = mockStripe.customers
    checkout = mockStripe.checkout
    subscriptions = mockStripe.subscriptions
    
    constructor() {
      return mockStripe
    }
  }
  return {
    default: MockStripe,
  }
})

// Мокаем Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}
  
  // Специальное свойство для хранения результата single()/maybeSingle()
  // Устанавливается через setSingleResult() и используется в then()
  let singleResult: { data: any; error: any } | undefined = undefined
  
  // Все методы возвращают query для поддержки цепочки
  // Используем mockImplementation чтобы всегда возвращать query
  query.select = vi.fn().mockImplementation(() => query)
  query.insert = vi.fn().mockImplementation(() => query)
  query.update = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.gte = vi.fn().mockImplementation(() => query)
  query.lte = vi.fn().mockImplementation(() => query)
  query.order = vi.fn().mockImplementation(() => query)
  query.limit = vi.fn().mockImplementation(() => query)
  
  // КРИТИЧНО: single() и maybeSingle() должны возвращать query для поддержки await на query chain
  // В реальном Supabase, single() возвращает промис, но await работает с thenable объектами
  // Поэтому мы возвращаем query, который является thenable (имеет then метод)
  // Но мы также устанавливаем флаг __singleCalled__, чтобы then() знал, что нужно вернуть singleResult
  query.single = vi.fn().mockImplementation(() => {
    query.__singleCalled__ = true
    return query
  })
  query.maybeSingle = vi.fn().mockImplementation(() => {
    query.__singleCalled__ = true
    return query
  })
  
  // Вспомогательная функция для установки результата single()
  // Используется в тестах вместо mockResolvedValue
  query.setSingleResult = (res: { data: any; error: any }) => {
    singleResult = res
    return query
  }
  
  // Делаем query thenable для поддержки .then() и async/await
  // КРИТИЧНО: when await is used on query.single(), JavaScript calls .then on the query
  // после того как single() вернул query. Поэтому проверяем __singleCalled__ флаг.
  query.then = vi.fn((resolve) => {
    // Если single() был вызван И singleResult был установлен, используем singleResult
    // ВАЖНО: проверяем __singleCalled__, а НЕ singleResult !== null, потому что
    // singleResult может быть объектом { data: null, error: null }
    if (query.__singleCalled__ && singleResult !== undefined) {
      return Promise.resolve(singleResult).then(resolve)
    }
    
    // Если result передан (включая null), используем его, иначе используем дефолтное значение
    // Важно: проверяем result !== undefined, а не result, чтобы поддерживать null значения
    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  
  query.catch = vi.fn((reject) => {
    // Если result передан, используем его, иначе используем дефолтное значение
    // Важно: проверяем result !== undefined, а не result, чтобы поддерживать null значения
    const resolvedResult = result !== undefined ? result : { data: [], error: null }
    return Promise.resolve(resolvedResult).catch(reject)
  })
  
  return query
}

const mockSupabaseClient = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Billing Service', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    
    // Сбрасываем кэш stripe в billing.ts через динамический импорт
    // Это нужно для того, чтобы getStripe() создал новый экземпляр с моком
    const billingModule = await vi.importActual('@/lib/services/billing')
    // @ts-ignore - доступ к приватной переменной через модуль
    if ((billingModule as any).stripe !== undefined) {
      // @ts-ignore
      ;(billingModule as any).stripe = null
    }
  })

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY
  })

  describe('createStripeCustomer', () => {
    it('should create Stripe customer successfully', async () => {
      const mockCustomer = { id: 'cus_123' }

      mockStripe.customers.create.mockResolvedValue(mockCustomer)

      const updateQuery: any = createMockQuery()
      // update и eq уже настроены в createMockQuery для цепочки
      // Переопределяем для совместимости с другими тестами
      updateQuery.update = vi.fn().mockReturnValue(updateQuery)
      // Настраиваем then для возврата результата без ошибки
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await createStripeCustomer('org-123', 'test@example.com', 'Test User')

      expect(result).toBe('cus_123')
      expect(mockStripe.customers.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
        })
      )
    })

    it('should return null on error', async () => {
      mockStripe.customers.create.mockRejectedValue(new Error('Stripe error'))

      const result = await createStripeCustomer('org-123', 'test@example.com')

      expect(result).toBeNull()
    })
  })

  describe('createSubscriptionSession', () => {
    it('should create subscription session successfully', async () => {
      const mockOrg = {
        stripe_customer_id: 'cus_123',
        name: 'Test Org',
      }

      const mockPlan = {
        id: 'plan-1',
        stripe_price_id: 'price_123',
        is_active: true,
      }

      const mockSession = {
        url: 'https://checkout.stripe.com/session-123',
      }

      const orgQuery: any = createMockQuery()
      orgQuery.select.mockReturnValue(orgQuery)
      orgQuery.eq.mockReturnValue(orgQuery)
      orgQuery.single.mockResolvedValue({ data: mockOrg, error: null })

      const planQuery: any = createMockQuery()
      planQuery.select.mockReturnValue(planQuery)
      planQuery.eq.mockReturnValue(planQuery)
      planQuery.single.mockResolvedValue({ data: mockPlan, error: null })

      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession)

      mockSupabaseClient.from
        .mockReturnValueOnce(orgQuery) // для org
        .mockReturnValueOnce(planQuery) // для plan

      const result = await createSubscriptionSession('org-123', 'plan-1', '/success', '/cancel')

      expect(result).toBe('https://checkout.stripe.com/session-123')
    })

    it('should create customer if not exists', async () => {
      const mockOrg = {
        stripe_customer_id: null,
        name: 'Test Org',
      }

      const mockPlan = {
        id: 'plan-1',
        stripe_price_id: 'price_123',
        is_active: true,
      }

      const mockCustomer = { id: 'cus_123' }
      const mockSession = {
        url: 'https://checkout.stripe.com/session-123',
      }

      const orgQuery: any = createMockQuery()
      orgQuery.select.mockReturnValue(orgQuery)
      orgQuery.eq.mockReturnValue(orgQuery)
      orgQuery.single.mockResolvedValue({ data: mockOrg, error: null })

      const planQuery: any = createMockQuery()
      planQuery.select.mockReturnValue(planQuery)
      planQuery.eq.mockReturnValue(planQuery)
      planQuery.single.mockResolvedValue({ data: mockPlan, error: null })

      const updateQuery: any = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      // eq уже настроен в createMockQuery для цепочки
      // Настраиваем then для возврата результата без ошибки
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockStripe.customers.create.mockResolvedValue(mockCustomer)
      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession)

      mockSupabaseClient.from
        .mockReturnValueOnce(orgQuery) // для org
        .mockReturnValueOnce(planQuery) // для plan
        .mockReturnValueOnce(updateQuery) // для update org with customer_id

      const result = await createSubscriptionSession('org-123', 'plan-1', '/success', '/cancel')

      expect(result).toBe('https://checkout.stripe.com/session-123')
      expect(mockStripe.customers.create).toHaveBeenCalled()
    })

    it('should return null if organization not found', async () => {
      const orgQuery = createMockQuery()
      orgQuery.select.mockReturnValue(orgQuery)
      orgQuery.single.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(orgQuery)

      const result = await createSubscriptionSession('org-123', 'plan-1', '/success', '/cancel')

      expect(result).toBeNull()
    })

    it('should return null if plan not found', async () => {
      const mockOrg = {
        stripe_customer_id: 'cus_123',
        name: 'Test Org',
      }

      const orgQuery = createMockQuery()
      orgQuery.select.mockReturnValue(orgQuery)
      orgQuery.single.mockResolvedValue({ data: mockOrg, error: null })

      const planQuery = createMockQuery()
      planQuery.select.mockReturnValue(planQuery)
      planQuery.single.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(orgQuery)
        .mockReturnValueOnce(planQuery)

      const result = await createSubscriptionSession('org-123', 'plan-1', '/success', '/cancel')

      expect(result).toBeNull()
    })
  })

  describe('getOrganizationSubscription', () => {
    it('should return subscription data', async () => {
      const mockSubscription = {
        id: 'sub-123',
        org_id: 'org-123',
        plan: 'premium',
        status: 'active',
        token_quota: 10000,
        token_used: 5000,
        renews_at: '2025-02-01T00:00:00Z',
        usage_limits: {},
        current_period_start: '2025-01-01T00:00:00Z',
        current_period_end: '2025-02-01T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.limit.mockReturnValue(queryChain)
      queryChain.single.mockResolvedValue({ data: mockSubscription, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getOrganizationSubscription('org-123')

      expect(result).toBeDefined()
      expect(result?.plan).toBe('premium')
    })

    it('should return null if subscription not found', async () => {
      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.limit.mockReturnValue(queryChain)
      queryChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getOrganizationSubscription('org-123')

      expect(result).toBeNull()
    })
  })

  describe('getBillingPlans', () => {
    it('should return billing plans', async () => {
      const mockPlans = [
        {
          id: 'plan-1',
          name: 'Premium',
          stripe_price_id: 'price_123',
          price_cents: 1000,
          currency: 'usd',
          interval: 'month',
          features: {},
          limits: {
            agents: 10,
            tokens_per_month: 10000,
            messages_per_month: 1000,
            storage_gb: 10,
          },
          is_active: true,
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockResolvedValue({ data: mockPlans, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getBillingPlans()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Premium')
    })

    it('should return multiple plans sorted by price', async () => {
      const mockPlans = [
        {
          id: 'plan-1',
          name: 'Basic',
          price_cents: 500,
          is_active: true,
        },
        {
          id: 'plan-2',
          name: 'Premium',
          price_cents: 1000,
          is_active: true,
        },
        {
          id: 'plan-3',
          name: 'Enterprise',
          price_cents: 2000,
          is_active: true,
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockResolvedValue({ data: mockPlans, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getBillingPlans()

      expect(result).toHaveLength(3)
      expect(result[0].price_cents).toBe(500)
      expect(result[2].price_cents).toBe(2000)
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getBillingPlans()

      expect(result).toEqual([])
    })

    it('should return empty array when data is null', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getBillingPlans()

      expect(result).toEqual([])
    })

    it('should filter only active plans', async () => {
      const mockPlans = [
        {
          id: 'plan-1',
          name: 'Active Plan',
          is_active: true,
        },
        {
          id: 'plan-2',
          name: 'Inactive Plan',
          is_active: false,
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockResolvedValue({ data: mockPlans.filter(p => p.is_active), error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getBillingPlans()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Active Plan')
    })
  })

  describe('recordUsage', () => {
    it('should record usage successfully', async () => {
      const mockSubscription = {
        id: 'sub-123',
        status: 'active',
        usage_limits: {},
        current_period_start: '2025-01-01T00:00:00Z',
        current_period_end: '2025-02-01T00:00:00Z',
      }

      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      const insertQuery: any = createMockQuery({ data: null, error: null })
      insertQuery.insert.mockReturnValue(insertQuery)

      // checkUsageLimits вызывает getOrganizationSubscription и getUsageStats
      // Нужно замокать эти вызовы
      const usageStatsQuery: any = createMockQuery({ data: [], error: null })
      usageStatsQuery.select.mockReturnValue(usageStatsQuery)
      usageStatsQuery.eq.mockReturnValue(usageStatsQuery)
      usageStatsQuery.gte.mockReturnValue(usageStatsQuery)
      usageStatsQuery.lte.mockReturnValue(usageStatsQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для getOrganizationSubscription (в recordUsage)
        .mockReturnValueOnce(insertQuery) // для insert usage
        .mockReturnValueOnce(selectQuery) // для getOrganizationSubscription (в checkUsageLimits)
        .mockReturnValueOnce(usageStatsQuery) // для getUsageStats (в checkUsageLimits)

      const result = await recordUsage('org-123', 'ai_response', 1)

      expect(result).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: null })

      const insertQuery: any = createMockQuery()
      insertQuery.insert.mockReturnValue({ error: { message: 'Database error' } })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(insertQuery)

      const result = await recordUsage('org-123', 'ai_response', 1)

      expect(result).toBe(false)
    })
  })

  describe('getUsageStats', () => {
    it('should return usage stats', async () => {
      const mockStats = [
        {
          resource_type: 'ai_response',
          amount: 100,
        },
      ]

      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.gte.mockReturnValue(queryChain)
      queryChain.lte.mockResolvedValue({ data: mockStats, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUsageStats('org-123', new Date('2025-01-01'), new Date('2025-01-31'))

      expect(result).toBeDefined()
      expect(result['ai_response']).toBe(100)
    })

    it('should aggregate multiple usage records', async () => {
      const mockStats = [
        { resource_type: 'ai_response', amount: 50 },
        { resource_type: 'ai_response', amount: 75 },
        { resource_type: 'api_calls', amount: 100 },
      ]

      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.gte.mockReturnValue(queryChain)
      queryChain.lte.mockResolvedValue({ data: mockStats, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUsageStats('org-123', new Date('2025-01-01'), new Date('2025-01-31'))

      expect(result['ai_response']).toBe(125) // 50 + 75
      expect(result['api_calls']).toBe(100)
    })

    it('should return empty object on error', async () => {
      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.gte.mockReturnValue(queryChain)
      queryChain.lte.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUsageStats('org-123', new Date('2025-01-01'), new Date('2025-01-31'))

      expect(result).toEqual({})
    })

    it('should handle empty data array', async () => {
      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.gte.mockReturnValue(queryChain)
      queryChain.lte.mockResolvedValue({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUsageStats('org-123', new Date('2025-01-01'), new Date('2025-01-31'))

      expect(result).toEqual({})
    })

    it('should handle null data', async () => {
      const queryChain: any = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.gte.mockReturnValue(queryChain)
      queryChain.lte.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getUsageStats('org-123', new Date('2025-01-01'), new Date('2025-01-31'))

      expect(result).toEqual({})
    })
  })

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripe_subscription_id: 'sub_123',
        status: 'active',
      }

      const mockStripeSubscription = {
        id: 'sub_123',
        status: 'canceled',
      }

      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      mockStripe.subscriptions.update.mockResolvedValue(mockStripeSubscription)

      const updateQuery: any = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      // eq уже настроен в createMockQuery для цепочки
      // Настраиваем then для возврата результата без ошибки
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для getOrganizationSubscription

      const result = await cancelSubscription('org-123', true)

      expect(result).toBe(true)
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: true,
      })
    })

    it('should cancel subscription immediately when cancelAtPeriodEnd is false', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripe_subscription_id: 'sub_123',
        status: 'active',
      }

      const mockStripeSubscription = {
        id: 'sub_123',
        status: 'canceled',
      }

      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      mockStripe.subscriptions.cancel.mockResolvedValue(mockStripeSubscription)

      mockSupabaseClient.from.mockReturnValueOnce(selectQuery)

      const result = await cancelSubscription('org-123', false)

      expect(result).toBe(true)
      expect(mockStripe.subscriptions.cancel).toHaveBeenCalledWith('sub_123')
      expect(mockStripe.subscriptions.update).not.toHaveBeenCalled()
    })

    it('should return false if subscription not found', async () => {
      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await cancelSubscription('org-123')

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripe_subscription_id: 'sub_123',
        status: 'active',
      }

      const selectQuery: any = createMockQuery({ data: mockSubscription, error: null })
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      // Мокаем ошибку Stripe
      mockStripe.subscriptions.cancel.mockRejectedValueOnce(new Error('Stripe error'))

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await cancelSubscription('org-123', false)

      expect(result).toBe(false)
    })
  })

  describe('resumeSubscription', () => {
    it('should resume subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripe_subscription_id: 'sub_123',
        status: 'canceled',
      }

      const mockStripeSubscription = {
        id: 'sub_123',
        status: 'active',
      }

      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      mockStripe.subscriptions.update.mockResolvedValue(mockStripeSubscription)

      const updateQuery: any = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      // eq уже настроен в createMockQuery для цепочки
      // Настраиваем then для возврата результата без ошибки
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для getOrganizationSubscription
        .mockReturnValueOnce(updateQuery) // для update subscription

      const result = await resumeSubscription('org-123')

      expect(result).toBe(true)
    })

    it('should return false if subscription not found', async () => {
      // Используем setSingleResult для установки результата single()
      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      // Устанавливаем результат single() через setSingleResult
      selectQuery.setSingleResult({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await resumeSubscription('org-123')

      expect(result).toBe(false)
      // Не проверяем single() был вызван, так как это внутренняя деталь реализации
      // Главное - что result корректный (false когда subscription not found)
    })

    it('should return false on error', async () => {
      const mockSubscription = {
        id: 'sub_123',
        stripe_subscription_id: 'sub_123',
        status: 'canceled',
      }

      const selectQuery: any = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.order.mockReturnValue(selectQuery)
      selectQuery.limit.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSubscription, error: null })

      mockStripe.subscriptions.update.mockRejectedValue(new Error('Stripe error'))

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await resumeSubscription('org-123')

      expect(result).toBe(false)
    })
  })
})

