import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock Supabase admin
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
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return webhook events list with default pagination', async () => {
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
          event_subtype: null,
          entity_type: 'lead',
          entity_id: '12345',
          status: 'completed',
          retry_count: 0,
          max_retries: 3,
          error: null,
          created_at: '2025-01-26T00:00:00Z',
          processed_at: '2025-01-26T00:01:00Z',
          next_retry_at: null,
          payload: { lead_id: 12345 },
        },
      ]

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockEvents,
          error: null,
          count: 1,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(20)
      expect(data.pagination.total).toBe(1)
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

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?status=failed')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Проверяем, что был вызван eq для фильтрации по status
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'failed')
    })

    it('should filter events by event_type', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?event_type=lead.created')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockQuery.eq).toHaveBeenCalledWith('event_type', 'lead.created')
    })

    it('should use custom pagination parameters', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 50,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?page=2&limit=10')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.totalPages).toBe(5) // 50 / 10
      // Проверяем, что range был вызван с правильными параметрами (offset=10, limit=10)
      expect(mockQuery.range).toHaveBeenCalledWith(10, 19)
    })

    it('should return 400 for invalid status', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?status=invalid-status')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should return 400 for invalid page number', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?page=0')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should return 400 for limit exceeding max', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks?limit=200')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные параметры запроса')
    })

    it('should filter events by date range', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest(
        'http://localhost:3000/api/webhooks?start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z',
      )
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockQuery.gte).toHaveBeenCalledWith('created_at', '2025-01-01T00:00:00Z')
      expect(mockQuery.lte).toHaveBeenCalledWith('created_at', '2025-01-31T23:59:59Z')
    })

    it('should handle database errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockQuery = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
          count: null,
        }),
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockQuery as any)

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось получить события')
    })

    it('should handle unexpected errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getSupabaseServiceRoleClient).mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const route = await import('@/app/api/webhooks/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Внутренняя ошибка сервера')
    })
  })
})


