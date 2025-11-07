import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Stripe
const mockConstructEvent = vi.fn()
const mockStripeInstance = {
  webhooks: {
    constructEvent: mockConstructEvent,
  },
}

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      webhooks = {
        constructEvent: mockConstructEvent,
      }
      constructor() {
        return mockStripeInstance
      }
    },
  }
})

// Mock billing service
vi.mock('@/lib/services/billing', () => ({
  handleStripeWebhook: vi.fn(),
}))

// Mock headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

describe('API: /api/billing/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set environment variables
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
  })

  describe('POST /api/billing/webhook', () => {
    it('should return 400 if signature is missing', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue(null),
      } as any)

      const route = await import('@/app/api/billing/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/billing/webhook', {
        method: 'POST',
        body: 'test body',
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing signature')
    })

    it('should return 400 if signature is invalid', async () => {
      const { headers } = await import('next/headers')

      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue('invalid-signature'),
      } as any)

      mockConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const route = await import('@/app/api/billing/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/billing/webhook', {
        method: 'POST',
        body: 'test body',
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid signature')
    })

    it('should process webhook successfully', async () => {
      const { headers } = await import('next/headers')
      const { handleStripeWebhook } = await import('@/lib/services/billing')

      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue('valid-signature'),
      } as any)

      const mockEvent = {
        id: 'evt_123',
        type: 'customer.subscription.updated',
        data: {},
      } as any

      mockConstructEvent.mockReturnValue(mockEvent)
      vi.mocked(handleStripeWebhook).mockResolvedValue(true)

      const route = await import('@/app/api/billing/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/billing/webhook', {
        method: 'POST',
        body: 'test body',
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.received).toBe(true)
      expect(handleStripeWebhook).toHaveBeenCalledWith(mockEvent)
    })

    it('should return 500 if webhook processing fails', async () => {
      const { headers } = await import('next/headers')
      const { handleStripeWebhook } = await import('@/lib/services/billing')

      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue('valid-signature'),
      } as any)

      const mockEvent = {
        id: 'evt_123',
        type: 'customer.subscription.updated',
        data: {},
      } as any

      mockConstructEvent.mockReturnValue(mockEvent)
      vi.mocked(handleStripeWebhook).mockResolvedValue(false)

      const route = await import('@/app/api/billing/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/billing/webhook', {
        method: 'POST',
        body: 'test body',
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Webhook processing failed')
    })

    it('should handle unexpected errors in constructEvent', async () => {
      const { headers } = await import('next/headers')

      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue('valid-signature'),
      } as any)

      mockConstructEvent.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const route = await import('@/app/api/billing/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/billing/webhook', {
        method: 'POST',
        body: 'test body',
      })

      const response = await route.POST(request)
      const data = await response.json()

      // constructEvent errors are caught and return 400
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid signature')
    })
  })
})

