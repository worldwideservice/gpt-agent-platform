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

// Mock queue
vi.mock('@/lib/queue', () => ({
  addJobToQueue: vi.fn(),
}))

describe('API: /api/agents/[id]/integrations/[integrationId]/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/agents/[id]/integrations/[integrationId]/sync', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
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

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })

    it('should return 400 if integration is not Kommo', async () => {
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
        integration_type: 'other',
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

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Kommo')
    })

    it('should return 404 if CRM connection not found', async () => {
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
      }

      // Mock for integration select
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: mockIntegration,
        error: null,
      })
      const mockEq3Int = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockEq2Int = vi.fn().mockReturnValue({ eq: mockEq3Int })
      const mockEq1Int = vi.fn().mockReturnValue({ eq: mockEq2Int })
      const mockSelectInt = vi.fn().mockReturnValue({ eq: mockEq1Int })

      // Mock for CRM connection select (should return null)
      const mockSingle2 = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })
      const mockEq2Crm = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockEq1Crm = vi.fn().mockReturnValue({ eq: mockEq2Crm })
      const mockSelectCrm = vi.fn().mockReturnValue({ eq: mockEq1Crm })

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'agent_integrations') {
          return { select: mockSelectInt }
        }
        if (table === 'crm_connections') {
          return { select: mockSelectCrm }
        }
        return { select: mockSelectInt }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toContain('CRM подключение')
    })

    it('should successfully trigger sync', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { addJobToQueue } = await import('@/lib/queue')

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
        settings: {},
      }

      const mockCrmConnection = {
        id: 'crm-123',
        org_id: 'org-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
      }

      // Mock for integration select
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: mockIntegration,
        error: null,
      })
      const mockEq3Int = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockEq2Int = vi.fn().mockReturnValue({ eq: mockEq3Int })
      const mockEq1Int = vi.fn().mockReturnValue({ eq: mockEq2Int })
      const mockSelectInt = vi.fn().mockReturnValue({ eq: mockEq1Int })

      // Mock for CRM connection select
      const mockSingle2 = vi.fn().mockResolvedValue({
        data: mockCrmConnection,
        error: null,
      })
      const mockEq2Crm = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockEq1Crm = vi.fn().mockReturnValue({ eq: mockEq2Crm })
      const mockSelectCrm = vi.fn().mockReturnValue({ eq: mockEq1Crm })

      // Mock for update integration
      const mockUpdateResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEqUpdate = vi.fn().mockReturnValue({ update: mockUpdateResult })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqUpdate })

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'agent_integrations') {
          return {
            select: mockSelectInt,
            update: mockUpdate,
          }
        }
        if (table === 'crm_connections') {
          return { select: mockSelectCrm }
        }
        return { select: mockSelectInt }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(addJobToQueue).mockResolvedValue({
        id: 'job-123',
      } as any)

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Синхронизация запущена')
      expect(data.details.jobId).toBe('job-123')
      expect(addJobToQueue).toHaveBeenCalledWith('crm:sync-pipelines', {
        provider: 'kommo',
        orgId: 'org-123',
        connectionId: 'crm-123',
        baseDomain: 'test.kommo.com',
      })
    })

    it('should handle sync error gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { addJobToQueue } = await import('@/lib/queue')

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
        settings: {},
      }

      const mockCrmConnection = {
        id: 'crm-123',
        org_id: 'org-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
      }

      // Mock for integration select
      const mockSingle1 = vi.fn().mockResolvedValue({
        data: mockIntegration,
        error: null,
      })
      const mockEq3Int = vi.fn().mockReturnValue({ single: mockSingle1 })
      const mockEq2Int = vi.fn().mockReturnValue({ eq: mockEq3Int })
      const mockEq1Int = vi.fn().mockReturnValue({ eq: mockEq2Int })
      const mockSelectInt = vi.fn().mockReturnValue({ eq: mockEq1Int })

      // Mock for CRM connection select
      const mockSingle2 = vi.fn().mockResolvedValue({
        data: mockCrmConnection,
        error: null,
      })
      const mockEq2Crm = vi.fn().mockReturnValue({ single: mockSingle2 })
      const mockEq1Crm = vi.fn().mockReturnValue({ eq: mockEq2Crm })
      const mockSelectCrm = vi.fn().mockReturnValue({ eq: mockEq1Crm })

      // Mock for update integration (for error handling)
      const mockUpdateResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEqUpdate = vi.fn().mockReturnValue({ update: mockUpdateResult })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqUpdate })

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'agent_integrations') {
          return {
            select: mockSelectInt,
            update: mockUpdate,
          }
        }
        if (table === 'crm_connections') {
          return { select: mockSelectCrm }
        }
        return { select: mockSelectInt }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(addJobToQueue).mockRejectedValue(new Error('Queue error'))

      const route = await import('@/app/api/agents/[id]/integrations/[integrationId]/sync/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/integrations/int-123/sync', {
        method: 'POST',
      })
      const params = Promise.resolve({ id: 'agent-123', integrationId: 'int-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось запустить синхронизацию')
    })
  })
})

