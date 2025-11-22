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

describe('API: /api/agents/[id]/integrations/[integrationId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/integrations/[integrationId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123')
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return integration by id', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockIntegration = {
        id: 'int-123',
        agent_id: 'agent-123',
        org_id: 'org-123',
        integration_type: 'kommo',
        is_active: true,
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockIntegration,
        error: null,
      })
      const mockEq3 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123')
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.integration).toEqual(mockIntegration)
    })

    it('should return 404 if integration not found', async () => {
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
        error: { code: 'PGRST116' },
      })
      const mockEq3 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123')
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('PATCH /api/agents/[id]/integrations/[integrationId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123', {
        method: 'PATCH',
        body: JSON.stringify({ is_active: true }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update integration', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockExisting = {
        id: 'int-123',
        agent_id: 'agent-123',
        org_id: 'org-123',
        is_active: false,
      }

      const mockUpdated = {
        ...mockExisting,
        is_active: true,
      }

      // Mock for checking existing integration
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: mockExisting,
        error: null,
      })
      const mockEq3Check = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockEq2Check = vi.fn().mockReturnValue({ eq: mockEq3Check })
      const mockEq1Check = vi.fn().mockReturnValue({ eq: mockEq2Check })
      const mockSelectCheck = vi.fn().mockReturnValue({ eq: mockEq1Check })

      // Mock for updating integration: .update().eq().select().single()
      const mockSingle2 = vi.fn().mockResolvedValue({
        data: mockUpdated,
        error: null,
      })
      const mockSelectUpdate = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockEq1Update = vi.fn().mockReturnValue({ select: mockSelectUpdate })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1Update })

      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelectCheck,
        update: mockUpdate,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123', {
        method: 'PATCH',
        body: JSON.stringify({ is_active: true }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.integration.is_active).toBe(true)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123', {
        method: 'PATCH',
        body: JSON.stringify({ is_active: 'not-a-boolean' }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

