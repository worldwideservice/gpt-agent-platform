import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock billing services
vi.mock('@/lib/services/billing', () => ({
  getBillingPlans: vi.fn(),
  getOrganizationSubscription: vi.fn(),
  createSubscriptionSession: vi.fn(),
  cancelSubscription: vi.fn(),
  resumeSubscription: vi.fn(),
  getUsageStats: vi.fn(),
}))

describe('API: /api/billing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/billing', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return billing plans', async () => {
      const { auth } = await import('@/auth')
      const { getBillingPlans } = await import('@/lib/services/billing')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockPlans = [
        { id: 'plan-1', name: 'Free', price: 0 },
        { id: 'plan-2', name: 'Pro', price: 29 },
      ]

      vi.mocked(getBillingPlans).mockResolvedValue(mockPlans as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing?action=plans')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockPlans)
    })

    it('should return subscription', async () => {
      const { auth } = await import('@/auth')
      const { getOrganizationSubscription } = await import('@/lib/services/billing')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSubscription = {
        id: 'sub-123',
        planId: 'plan-2',
        status: 'active',
      }

      vi.mocked(getOrganizationSubscription).mockResolvedValue(mockSubscription as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing?action=subscription')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSubscription)
    })

    it('should return usage stats', async () => {
      const { auth } = await import('@/auth')
      const { getUsageStats } = await import('@/lib/services/billing')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUsage = {
        agents: 10,
        conversations: 100,
      }

      vi.mocked(getUsageStats).mockResolvedValue(mockUsage as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing?action=usage&start_date=2024-01-01&end_date=2024-01-31')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUsage)
    })

    it('should return 400 for missing date parameters', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing?action=usage')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for unknown action', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing?action=unknown')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/billing', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_session',
          planId: 'plan-2',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create subscription session', async () => {
      const { auth } = await import('@/auth')
      const { createSubscriptionSession } = await import('@/lib/services/billing')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSessionUrl = 'https://checkout.stripe.com/session-123'

      vi.mocked(createSubscriptionSession).mockResolvedValue(mockSessionUrl)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_subscription_session',
          plan_id: 'plan-2',
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.session_url).toBe(mockSessionUrl)
      expect(createSubscriptionSession).toHaveBeenCalledWith('org-123', 'plan-2', 'https://example.com/success', 'https://example.com/cancel')
    })

    it('should cancel subscription', async () => {
      const { auth } = await import('@/auth')
      const { cancelSubscription } = await import('@/lib/services/billing')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(cancelSubscription).mockResolvedValue(true)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing', {
        method: 'POST',
        body: JSON.stringify({
          action: 'cancel_subscription',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(cancelSubscription).toHaveBeenCalledWith('org-123', true)
    })

    it('should return 400 for invalid action', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/billing/route')
      const request = new NextRequest('http://localhost:3000/api/billing', {
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
