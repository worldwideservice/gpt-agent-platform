import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем Supabase перед импортом UserRepository
const mockSupabaseClient = {
  from: vi.fn(),
}

// Мокаем getSupabaseServiceRoleClient для поддержки динамических импортов
// Используем vi.mock для статических импортов (hoisted)
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

import { UserRepository, getSupabaseClient } from '@/lib/repositories/users'

// Мокаем bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}))

// Мокаем env для Supabase чтобы избежать ошибок валидации
vi.mock('@/lib/env/supabase', () => ({
  loadSupabaseServerEnv: vi.fn(() => ({
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_SERVICE_ROLE_KEY: 'test-key',
    SUPABASE_ANON_KEY: 'test-anon-key',
  })),
  parseEnv: vi.fn((env) => env),
}))

// Мокаем UserTier
vi.mock('@/lib/rate-limit', () => ({
  UserTier: {
    FREE: 'free',
    PREMIUM: 'premium',
    VIP: 'vip',
  },
}))

// Мокаем Supabase - создаем функцию для создания query chain
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {
    from: vi.fn().mockImplementation(() => query),
    select: vi.fn().mockImplementation(() => query),
    eq: vi.fn().mockImplementation(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    update: vi.fn().mockImplementation(() => query),
    insert: vi.fn().mockImplementation(() => query),
    range: vi.fn().mockImplementation(() => query),
    order: vi.fn().mockImplementation(() => query),
    or: vi.fn().mockImplementation(() => query),
    limit: vi.fn().mockImplementation(() => query),
  }
  
  // Делаем query thenable для поддержки .then() и async/await
  query.then = vi.fn((resolve) => {
    const resolvedResult = result || { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  
  query.catch = vi.fn((reject) => {
    return Promise.resolve(result || { data: [], error: null }).catch(reject)
  })
  
  return query
}

// mockSupabaseClient уже объявлен выше перед импортом UserRepository

// Вспомогательная функция для применения мока к динамическому импорту
// Используем vi.doMock для каждого теста, так как он применяется к последующим динамическим импортам
async function ensureMockApplied() {
  // Используем vi.doMock для динамических импортов (не hoisted)
  vi.doMock('@/lib/supabase/admin', () => ({
    getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
  }))
  
  // Импортируем модуль и применяем мок
  const adminModule = await import('@/lib/supabase/admin')
  // Убеждаемся что мок возвращает mockSupabaseClient
  const mockFn = vi.mocked(adminModule.getSupabaseServiceRoleClient)
  // Устанавливаем mockImplementation чтобы мок всегда возвращал mockSupabaseClient
  mockFn.mockImplementation(() => mockSupabaseClient)
  // Также устанавливаем mockReturnValue для надежности
  mockFn.mockReturnValue(mockSupabaseClient)
}

describe('User Repository', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Сбрасываем мок from для каждого теста
    mockSupabaseClient.from.mockReset()
    
    // КРИТИЧНО: Используем vi.doMock для динамических импортов
    // vi.doMock не hoisted и применяется к последующим динамическим импортам
    vi.doMock('@/lib/supabase/admin', () => ({
      getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
    }))
    
    // Убеждаемся что мок применяется к динамическому импорту
    // Импортируем модуль заново чтобы применить мок
    const adminModule = await import('@/lib/supabase/admin')
    const { getSupabaseServiceRoleClient } = adminModule
    
    // Убеждаемся что мок возвращает mockSupabaseClient
    vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockSupabaseClient)
    vi.mocked(getSupabaseServiceRoleClient).mockImplementation(() => mockSupabaseClient)
    
    // Проверяем что мок действительно работает
    const testResult = getSupabaseServiceRoleClient()
    if (testResult !== mockSupabaseClient) {
      console.warn('Mock не применяется правильно, результат:', testResult)
    }
    
    // Не устанавливаем mockImplementation по умолчанию - каждый тест должен настроить свой мок
  })

  describe('getUserById', () => {
    it('should return user with subscription and organization', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        org_id: 'org-123',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        subscriptions: [
          {
            id: 'sub-123',
            plan_id: 'plan-premium',
            status: 'active',
            current_period_start: '2025-01-01T00:00:00Z',
            current_period_end: '2025-02-01T00:00:00Z',
            cancel_at_period_end: false,
            stripe_subscription_id: 'stripe-123',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
        ],
        organizations: {
          id: 'org-123',
          name: 'Test Org',
          tier: 'premium',
        },
      }

      // В users.ts getSupabaseClient() вызывается один раз (строка 28)
      // На строке 28: const supabase = await getSupabaseClient()
      // На строке 29: await supabase.from('users') - используется результат первого вызова
      // Поэтому mockSupabaseClient.from должен возвращать query chain с настроенным single
      const queryChain = createMockQuery({ data: mockUser, error: null })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: mockUser, error: null })
      
      // getSupabaseServiceRoleClient возвращает mockSupabaseClient, который имеет метод from()
      // from() возвращает query chain
      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserById('user-123')

      expect(user).toBeDefined()
      expect(user?.id).toBe('user-123')
      expect(user?.email).toBe('test@example.com')
      expect(user?.subscription).toBeDefined()
    })

    it('should return null if user not found', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Not found' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserById('user-123')

      expect(user).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockRejectedValue(new Error('Database error'))
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserById('user-123')

      expect(user).toBeNull()
    })
  })

  describe('getUserTier', () => {
    it('should return FREE tier if no userId provided', async () => {
      const tier = await UserRepository.getUserTier()

      expect(tier).toBe('free')
    })

    it('should return tier from active subscription', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      // Сначала сбрасываем предыдущий мок
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))
      
      // Импортируем модуль заново чтобы применить мок
      const adminModule = await import('@/lib/supabase/admin')
      vi.mocked(adminModule.getSupabaseServiceRoleClient).mockReturnValue(mockSupabaseClient)
      vi.mocked(adminModule.getSupabaseServiceRoleClient).mockImplementation(() => mockSupabaseClient)
      
      // Проверяем что мок работает
      const testClient = adminModule.getSupabaseServiceRoleClient()
      if (testClient !== mockSupabaseClient) {
        console.error('Mock не работает! Результат:', testClient, 'Ожидалось:', mockSupabaseClient)
      }
      
      const mockSubscription = {
        plan_id: 'plan-premium',
        status: 'active',
      }

      const subscriptionQuery = createMockQuery({ data: mockSubscription, error: null })
      subscriptionQuery.select.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.eq.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.single.mockResolvedValue({ data: mockSubscription, error: null })
      // Настраиваем then для async/await
      subscriptionQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockSubscription, error: null }).then(resolve)
      })

      const planQuery = createMockQuery({ data: { tier: 'premium' }, error: null })
      planQuery.select.mockImplementation(() => planQuery)
      planQuery.eq.mockImplementation(() => planQuery)
      planQuery.single.mockResolvedValue({ data: { tier: 'premium' }, error: null })
      // Настраиваем then для async/await
      planQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: { tier: 'premium' }, error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(subscriptionQuery)
        .mockReturnValueOnce(planQuery)

      const tier = await UserRepository.getUserTier('user-123')

      expect(tier).toBe('premium')
    })

    it('should return tier from organization if no subscription', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const subscriptionQuery = createMockQuery({ data: null, error: { message: 'Not found' } })
      subscriptionQuery.select.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.eq.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      subscriptionQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      const orgQuery = createMockQuery({ data: { tier: 'vip' }, error: null })
      orgQuery.select.mockImplementation(() => orgQuery)
      orgQuery.eq.mockImplementation(() => orgQuery)
      orgQuery.single.mockResolvedValue({ data: { tier: 'vip' }, error: null })
      orgQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: { tier: 'vip' }, error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(subscriptionQuery)
        .mockReturnValueOnce(orgQuery)

      const tier = await UserRepository.getUserTier('user-123', 'org-123')

      expect(tier).toBe('vip')
    })

    it('should return FREE tier as default', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const subscriptionQuery = createMockQuery({ data: null, error: { message: 'Not found' } })
      subscriptionQuery.select.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.eq.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      subscriptionQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      const orgQuery = createMockQuery({ data: null, error: null })
      orgQuery.select.mockImplementation(() => orgQuery)
      orgQuery.eq.mockImplementation(() => orgQuery)
      orgQuery.single.mockResolvedValue({ data: null, error: null })
      orgQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(subscriptionQuery)
        .mockReturnValueOnce(orgQuery)

      const tier = await UserRepository.getUserTier('user-123', 'org-123')

      expect(tier).toBe('free')
    })

    it('should handle errors gracefully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const subscriptionQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      subscriptionQuery.select.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.eq.mockImplementation(() => subscriptionQuery)
      subscriptionQuery.single.mockRejectedValue(new Error('Database error'))
      subscriptionQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(subscriptionQuery)

      const tier = await UserRepository.getUserTier('user-123')

      expect(tier).toBe('free')
    })
  })

  describe('getTierByPlanId', () => {
    it('should return tier for plan', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const planQuery = createMockQuery({ data: { tier: 'premium' }, error: null })
      planQuery.select.mockImplementation(() => planQuery)
      planQuery.eq.mockImplementation(() => planQuery)
      planQuery.single.mockResolvedValue({ data: { tier: 'premium' }, error: null })
      planQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: { tier: 'premium' }, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(planQuery)

      const tier = await UserRepository.getTierByPlanId('plan-123')

      expect(tier).toBe('premium')
    })

    it('should return null if plan not found', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const planQuery = createMockQuery({ data: null, error: { message: 'Not found' } })
      planQuery.select.mockImplementation(() => planQuery)
      planQuery.eq.mockImplementation(() => planQuery)
      planQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      planQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(planQuery)

      const tier = await UserRepository.getTierByPlanId('plan-123')

      expect(tier).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const planQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      planQuery.select.mockImplementation(() => planQuery)
      planQuery.eq.mockImplementation(() => planQuery)
      planQuery.single.mockRejectedValue(new Error('Database error'))
      planQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(planQuery)

      const tier = await UserRepository.getTierByPlanId('plan-123')

      expect(tier).toBeNull()
    })
  })

  describe('updateUserTier', () => {
    it('should update user tier', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: null })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserTier('user-123', 'premium' as any)

      expect(result).toBe(true)
      expect(updateQuery.update).toHaveBeenCalled()
      expect(updateQuery.eq).toHaveBeenCalledWith('id', 'user-123')
    })

    it('should return false on error', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: { message: 'Update failed' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Update failed' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserTier('user-123', 'premium' as any)

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: { message: 'Database error' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockRejectedValue(new Error('Database error'))
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserTier('user-123', 'premium' as any)

      expect(result).toBe(false)
    })
  })

  describe('getUsers', () => {
    it('should return users with pagination', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const mockUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          name: 'User 1',
          image: null,
          org_id: 'org-123',
          tier: 'free',
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
          subscriptions: [],
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          name: 'User 2',
          image: null,
          org_id: 'org-123',
          tier: 'premium',
          created_at: '2025-01-25T00:00:00Z',
          updated_at: '2025-01-25T00:00:00Z',
          subscriptions: [],
        },
      ]

      const queryChain = createMockQuery({ data: mockUsers, error: null })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.range.mockImplementation(() => queryChain)
      queryChain.order.mockImplementation(() => queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockUsers, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const users = await UserRepository.getUsers(50, 0)

      expect(users).toHaveLength(2)
      expect(users[0].id).toBe('user-1')
      expect(users[1].id).toBe('user-2')
    })

    it('should return empty array on error', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.range.mockImplementation(() => queryChain)
      queryChain.order.mockImplementation(() => queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const users = await UserRepository.getUsers()

      expect(users).toEqual([])
    })

    it('should handle exceptions gracefully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.range.mockImplementation(() => queryChain)
      queryChain.order.mockImplementation(() => queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const users = await UserRepository.getUsers()

      expect(users).toEqual([])
    })
  })

  describe('searchUsers', () => {
    it('should search users by name or email', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const mockUsers = [
        {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
          org_id: 'org-123',
          tier: 'free',
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
          subscriptions: [],
        },
      ]

      const queryChain = createMockQuery({ data: mockUsers, error: null })
      queryChain.order.mockImplementation(() => queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockUsers, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const users = await UserRepository.searchUsers('test')

      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('test@example.com')
      expect(queryChain.or).toHaveBeenCalled()
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.or.mockImplementation(() => queryChain)
      queryChain.limit.mockImplementation(() => queryChain)
      queryChain.order.mockImplementation(() => queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const users = await UserRepository.searchUsers('test')

      expect(users).toEqual([])
    })
  })

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery({ data: mockUser, error: null })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: mockUser, error: null })
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockUser, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.findUserByEmail('test@example.com')

      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
    })

    it('should return null if user not found', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Not found' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.findUserByEmail('test@example.com')

      expect(user).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockRejectedValue(new Error('Database error'))
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.findUserByEmail('test@example.com')

      expect(user).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user with subscription info', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        default_org_id: 'org-123',
        tier: 'premium',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        subscriptions: [
          {
            id: 'sub-123',
            plan_id: 'plan-premium',
            status: 'active',
            token_quota: 10000,
            token_used: 5000,
            renews_at: '2025-02-01T00:00:00Z',
            created_at: '2025-01-01T00:00:00Z',
          },
        ],
      }

      const queryChain = createMockQuery({ data: mockUser, error: null })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: mockUser, error: null })
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockUser, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserByEmail('test@example.com')

      expect(user).toBeDefined()
      expect(user?.id).toBe('user-123')
      expect(user?.email).toBe('test@example.com')
      expect(user?.subscription).toBeDefined()
    })

    it('should return null if user not found', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Not found' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserByEmail('test@example.com')

      expect(user).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })
      queryChain.select.mockImplementation(() => queryChain)
      queryChain.eq.mockImplementation(() => queryChain)
      queryChain.single.mockRejectedValue(new Error('Database error'))
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const user = await UserRepository.getUserByEmail('test@example.com')

      expect(user).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: null })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUser('user-123', {
        name: 'Updated Name',
        image: 'https://example.com/avatar.jpg',
      })

      expect(result).toBe(true)
      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          image: 'https://example.com/avatar.jpg',
        })
      )
    })

    it('should return false on error', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Update failed' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Update failed' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUser('user-123', {
        name: 'Updated Name',
      })

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Database error' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockRejectedValue(new Error('Database error'))
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUser('user-123', {
        name: 'Updated Name',
      })

      expect(result).toBe(false)
    })
  })

  describe('updateUserPasswordHash', () => {
    it('should update password hash successfully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: null })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserPasswordHash('user-123', 'new_hash')

      expect(result).toBe(true)
      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          password_hash: 'new_hash',
        })
      )
    })

    it('should return false on error', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Update failed' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Update failed' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserPasswordHash('user-123', 'new_hash')

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Database error' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockRejectedValue(new Error('Database error'))
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserPasswordHash('user-123', 'new_hash')

      expect(result).toBe(false)
    })
  })

  describe('updateUserLastSignIn', () => {
    it('should update last sign in successfully', async () => {
      // КРИТИЧНО: vi.doMock должен быть вызван перед каждым динамическим импортом
      vi.doUnmock('@/lib/supabase/admin')
      vi.doMock('@/lib/supabase/admin', () => ({
        getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
      }))

      const updateQuery = createMockQuery({ error: null })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserLastSignIn('user-123')

      expect(result).toBe(true)
      expect(updateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          last_sign_in_at: expect.any(String),
        })
      )
    })

    it('should return false on error', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Update failed' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockImplementation(() => updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Update failed' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserLastSignIn('user-123')

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      const updateQuery = createMockQuery({ error: { message: 'Database error' } })
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockRejectedValue(new Error('Database error'))
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const result = await UserRepository.updateUserLastSignIn('user-123')

      expect(result).toBe(false)
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        password_hash: 'hashed_password',
        default_org_id: null,
        avatar_url: null,
        locale: null,
        invited_at: null,
        last_sign_in_at: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery({ data: mockUser, error: null })
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockUser, error: null })
      insertQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockUser, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const user = await UserRepository.createUser({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })

      expect(user).toBeDefined()
      expect(user?.id).toBe('user-123')
      expect(user?.email).toBe('test@example.com')
    })

    it('should throw error if insert fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        UserRepository.createUser({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow()
    })

    it('should throw error if no data returned', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        UserRepository.createUser({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow()
    })
  })
})

