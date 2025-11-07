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

describe('API: /api/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/webhooks', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return webhook events with pagination', async () => {
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
          event_type: 'lead.created',
          event_subtype: 'created',
          entity_type: 'lead',
          entity_id: 'lead-123',
          status: 'completed',
          retry_count: 0,
          max_retries: 3,
          error: null,
          created_at: '2024-01-01T00:00:00Z',
          processed_at: '2024-01-01T00:00:01Z',
          next_retry_at: null,
          payload: { test: 'data' },
        },
      ]

      const mockRange = vi.fn().mockResolvedValue({
        data: mockEvents,
        error: null,
        count: 1,
      })
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?page=1&limit=20')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(20)
    })

    it('should filter events by status and event_type', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockRange = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      })
      const mockEq3 = vi.fn().mockReturnValue({ range: mockRange })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: mockEq2 }) })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?status=completed&event_type=lead.created')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 400 for invalid query parameters', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?page=0') // Invalid: page must be >= 1
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

