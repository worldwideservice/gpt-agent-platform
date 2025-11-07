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

// Mock webhook processor
vi.mock('@/lib/services/webhook-processor', () => ({
  processWebhookEvent: vi.fn(),
}))

describe('API: /api/webhooks/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/webhooks/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123')
      const params = { id: 'webhook-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return webhook event by id', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEvent = {
        id: 'webhook-123',
        provider: 'kommo',
        event_type: 'leads',
        event_subtype: 'lead_created',
        entity_type: 'lead',
        entity_id: 'lead-123',
        status: 'completed',
        retry_count: 0,
        max_retries: 3,
        error: null,
        payload: { test: 'data' },
        execution_context: {},
        created_at: '2024-01-01T00:00:00Z',
        processed_at: '2024-01-01T00:01:00Z',
        processing_started_at: '2024-01-01T00:00:30Z',
        next_retry_at: null,
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockEvent,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123')
      const params = { id: 'webhook-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('webhook-123')
      expect(data.data.provider).toBe('kommo')
      expect(data.data.eventType).toBe('leads')
    })

    it('should return 404 if webhook event not found', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123')
      const params = { id: 'webhook-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Событие не найдено')
    })
  })

  describe('POST /api/webhooks/[id] - Retry', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123', {
        method: 'POST',
      })
      const params = { id: 'webhook-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should retry webhook event', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { processWebhookEvent } = await import('@/lib/services/webhook-processor')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEvent = {
        id: 'webhook-123',
        status: 'failed',
        retry_count: 1,
        max_retries: 3,
      }

      // For GET query: .select().eq().eq().single()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockEvent,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      
      // For UPDATE query: .update().eq()
      const mockEqAfterUpdate = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqAfterUpdate })
      
      const mockFrom = vi.fn().mockReturnValue({ 
        select: mockSelect,
        update: mockUpdate,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(processWebhookEvent).mockResolvedValue(undefined)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123', {
        method: 'POST',
      })
      const params = { id: 'webhook-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Событие поставлено в очередь для повторной обработки')
      expect(processWebhookEvent).toHaveBeenCalledWith('webhook-123')
    })

    it('should return 400 if event is already completed', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEvent = {
        id: 'webhook-123',
        status: 'completed',
        retry_count: 0,
        max_retries: 3,
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockEvent,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123', {
        method: 'POST',
      })
      const params = { id: 'webhook-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Событие уже успешно обработано')
    })

    it('should return 400 if max retries reached', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEvent = {
        id: 'webhook-123',
        status: 'failed',
        retry_count: 3,
        max_retries: 3,
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockEvent,
        error: null,
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/webhooks/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/webhooks/webhook-123', {
        method: 'POST',
      })
      const params = { id: 'webhook-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Достигнут лимит попыток обработки')
    })
  })
})

