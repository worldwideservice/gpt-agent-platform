import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleStripeWebhook } from '@/lib/services/billing'
import type Stripe from 'stripe'

// Мокаем Stripe - создаем класс-мок, который возвращает один и тот же экземпляр
let mockStripeInstance: any = null

vi.mock('stripe', () => {
  class MockStripe {
    subscriptions = {
      retrieve: vi.fn(),
    }
    
    constructor() {
      if (!mockStripeInstance) {
        mockStripeInstance = {
          subscriptions: {
            retrieve: vi.fn(),
          },
        }
      }
      return mockStripeInstance
    }
  }
  return {
    default: MockStripe,
  }
})

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
  }
  // Делаем query thenable для поддержки await
  query.then = vi.fn((resolve) => {
    const resolvedResult = { error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  query.catch = vi.fn((reject) => {
    return Promise.resolve({ error: null }).catch(reject)
  })
  return query
}

const mockSupabaseClient = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Billing Webhook Service', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    // Сбрасываем mockStripeInstance и инициализируем его
    mockStripeInstance = null
    const { default: Stripe } = require('stripe')
    new Stripe('sk_test_123') // Инициализируем mockStripeInstance
    
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

  describe('handleStripeWebhook', () => {
    it('should handle checkout.session.completed event', async () => {
      const mockSession = {
        id: 'cs_test_123',
        subscription: 'sub_123',
        metadata: {
          org_id: 'org-123',
          plan_id: 'plan-1',
        },
      }

      const mockSubscription = {
        id: 'sub_123',
        customer: 'cus_123',
        status: 'active',
        current_period_start: 1640995200,
        current_period_end: 1643587200,
        cancel_at_period_end: false,
      }

      // Создаем экземпляр Stripe, чтобы инициализировать mockStripeInstance
      const { default: Stripe } = await import('stripe')
      new Stripe('sk_test_123')
      
      mockStripeInstance.subscriptions.retrieve = vi.fn().mockResolvedValue(mockSubscription)

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: mockSession,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
      expect(mockStripeInstance.subscriptions.retrieve).toHaveBeenCalledWith('sub_123')
    })

    it('should return false if metadata missing in checkout.session.completed', async () => {
      const mockSession = {
        id: 'cs_test_123',
        subscription: 'sub_123',
        metadata: {},
      }

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: mockSession,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(false)
    })

    it('should handle invoice.payment_succeeded event', async () => {
      const mockInvoice = {
        id: 'in_123',
        customer: 'cus_123',
      }

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'invoice.payment_succeeded',
        data: {
          object: mockInvoice,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
    })

    it('should handle invoice.payment_failed event', async () => {
      const mockInvoice = {
        id: 'in_123',
        customer: 'cus_123',
      }

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'invoice.payment_failed',
        data: {
          object: mockInvoice,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
    })

    it('should handle customer.subscription.updated event', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'active',
        current_period_start: 1640995200,
        current_period_end: 1643587200,
        cancel_at_period_end: false,
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockReturnValue(updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.updated',
        data: {
          object: mockSubscription,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
    })

    it('should handle customer.subscription.deleted event', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'canceled',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq.mockReturnValue(updateQuery)
      updateQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'customer.subscription.deleted',
        data: {
          object: mockSubscription,
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
    })

    it('should handle unknown event types', async () => {
      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'unknown.event',
        data: {
          object: {},
        },
      } as any

      const result = await handleStripeWebhook(event)

      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      // Используем vi.doMock для мокирования модуля billing с заменой getStripe()
      // Это нужно потому что vi.spyOn не работает для внутренних вызовов методов
      const { default: Stripe } = await import('stripe')
      new Stripe('sk_test_123')
      
      // Мокируем retrieve чтобы он выбрасывал ошибку
      const mockRetrieve = vi.fn().mockRejectedValue(new Error('Stripe error'))
      mockStripeInstance.subscriptions.retrieve = mockRetrieve

      // Сбрасываем модули перед мокированием
      vi.resetModules()
      
      // Используем vi.doMock для мокирования getStripe() внутри модуля
      // Это работает для внутренних вызовов методов
      vi.doMock('@/lib/services/billing', async (importOriginal) => {
        const originalModule = await importOriginal<typeof import('@/lib/services/billing')>()
        return {
          ...originalModule,
          getStripe: vi.fn(() => mockStripeInstance),
        }
      })

      // Динамически импортируем handleStripeWebhook после мокирования
      const { handleStripeWebhook: handleStripeWebhookDynamic } = await import('@/lib/services/billing')

      const event: Stripe.Event = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            subscription: 'sub_123',
            metadata: {
              org_id: 'org-123',
              plan_id: 'plan-1',
            },
          },
        },
      } as any
      
      // Вызываем handleStripeWebhook - он должен поймать ошибку и вернуть false
      const result = await handleStripeWebhookDynamic(event)

      expect(result).toBe(false)
      // Проверяем что retrieve был вызван
      expect(mockRetrieve).toHaveBeenCalledWith('sub_123')
      
      // Снимаем мок
      vi.doUnmock('@/lib/services/billing')
    })
  })
})
