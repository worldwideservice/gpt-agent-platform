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

describe('API: /api/agents/[id]/integrations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/integrations', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/integrations/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return list of integrations', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockIntegrations = [
        {
          id: 'integration-1',
          agent_id: 'agent-123',
          integration_type: 'kommo',
          is_active: true,
        },
      ]

      const mockEq2 = vi.fn().mockResolvedValue({
        data: mockIntegrations,
        error: null,
      })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.integrations).toEqual(mockIntegrations)
    })

    it('should handle errors when getting integrations', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEq2 = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось получить список интеграций')
    })
  })
})

