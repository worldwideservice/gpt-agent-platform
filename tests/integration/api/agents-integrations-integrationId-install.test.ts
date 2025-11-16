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

describe('API: /api/agents/[id]/integrations/[integrationId]/install', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/agents/[id]/integrations/[integrationId]/install', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/install/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/install', {
        method: 'POST',
        body: JSON.stringify({ integration_type: 'kommo' }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should install new integration', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // Mock for checking existing integration (should return null)
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })
      const mockEq3Check = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockEq2Check = vi.fn().mockReturnValue({ eq: mockEq3Check })
      const mockEq1Check = vi.fn().mockReturnValue({ eq: mockEq2Check })
      const mockSelectCheck = vi.fn().mockReturnValue({ eq: mockEq1Check })

      // Mock for creating new integration
      const mockNewIntegration = {
        id: 'int-123',
        agent_id: 'agent-123',
        org_id: 'org-123',
        integration_type: 'kommo',
        is_installed: true,
        is_active: false,
        settings: {},
      }

      const mockSingle2 = vi.fn().mockResolvedValue({
        data: mockNewIntegration,
        error: null,
      })
      const mockSelectCreate = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectCreate })

      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelectCheck,
        insert: mockInsert,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/install/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/install', {
        method: 'POST',
        body: JSON.stringify({ integration_type: 'kommo' }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.integration).toEqual(mockNewIntegration)
    })

    it('should update existing integration', async () => {
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
        integration_type: 'kommo',
        is_installed: false,
      }

      const mockUpdated = {
        ...mockExisting,
        is_installed: true,
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

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/install/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/install', {
        method: 'POST',
        body: JSON.stringify({ integration_type: 'kommo' }),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.integration.is_installed).toBe(true)
    })

    it('should return 400 if integration_type is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/install/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/install', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

