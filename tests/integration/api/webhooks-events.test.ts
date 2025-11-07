import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/webhooks/events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/webhooks/events', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/webhooks/events/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/events')
      const response = await route.GET(request)

      expect(response.status).toBe(401)
    })

    it('should return webhook events', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEvents = [
        {
          id: 'event-1',
          org_id: 'org-123',
          event_type: 'lead.created',
          status: 'completed',
        },
      ]

      // Create a chainable query object that supports reassignment
      // The route reassigns query, so we need a mutable object that returns itself
      // The route does: let query = supabase.from(...).select(...).eq(...).order(...).range(...)
      // Then: if (status) query = query.eq('status', ...)
      // So the chain must return itself
      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
          order: vi.fn().mockImplementation(() => chain),
          range: vi.fn().mockResolvedValue({
            data: mockEvents,
            error: null,
            count: 1,
          }),
          or: vi.fn().mockImplementation(() => chain),
        }
        return chain
      }

      const mockSelect = vi.fn().mockReturnValue(createQuery())
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/events/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/events')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.count).toBe(1)
    })

    it('should filter events by status', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // Create a chainable query object that supports reassignment
      // The route reassigns query, so we need a mutable object that returns itself
      // The route does: let query = supabase.from(...).select(...).eq(...).order(...).range(...)
      // Then: if (status) query = query.eq('status', ...)
      // So the chain must return itself
      // IMPORTANT: range() returns a chain, not a promise. The promise is only when awaited
      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
          order: vi.fn().mockImplementation(() => chain),
          range: vi.fn().mockImplementation(() => chain), // Return chain for chaining
          or: vi.fn().mockImplementation(() => chain),
        }
        // Make the chain awaitable (thenable)
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: [],
            error: null,
            count: 0,
          }).then(resolve)
        })
        return chain
      }

      const mockSelect = vi.fn().mockReturnValue(createQuery())
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/events/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/events?status=pending')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should filter events by search', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // Create a chainable query object that supports reassignment
      // The route reassigns query, so we need a mutable object that returns itself
      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
          order: vi.fn().mockImplementation(() => chain),
          range: vi.fn().mockImplementation(() => chain), // Return chain for chaining
          or: vi.fn().mockImplementation(() => chain),
        }
        // Make the chain awaitable (thenable)
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: [],
            error: null,
            count: 0,
          }).then(resolve)
        })
        return chain
      }

      const mockSelect = vi.fn().mockReturnValue(createQuery())
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/events/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/events?search=lead')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

