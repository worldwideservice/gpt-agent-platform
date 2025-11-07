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

describe('API: /api/crm/pipelines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/crm/pipelines', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/crm/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/crm/pipelines')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return pipelines and stages', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockConnections = [
        {
          id: 'conn-1',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          metadata: {},
        },
      ]

      const mockPipelines = [
        {
          id: 'pipeline-1',
          connection_id: 'conn-1',
          external_id: 'ext-1',
          name: 'Sales Pipeline',
          is_active: true,
          sort_order: 1,
          metadata: {},
        },
      ]

      const mockStages = [
        {
          id: 'stage-1',
          pipeline_id: 'pipeline-1',
          external_id: 'stage-ext-1',
          name: 'New',
          sort_order: 1,
          metadata: {},
        },
      ]

      // Mock connections query
      const mockEq1 = vi.fn().mockResolvedValue({
        data: mockConnections,
        error: null,
      })
      const mockSelect1 = vi.fn().mockReturnValue({ eq: mockEq1 })

      // Mock pipelines query
      const mockOrder1 = vi.fn().mockResolvedValue({
        data: mockPipelines,
        error: null,
      })
      const mockIn1 = vi.fn().mockReturnValue({ order: mockOrder1 })
      const mockSelect2 = vi.fn().mockReturnValue({ in: mockIn1 })

      // Mock stages query
      const mockOrder2 = vi.fn().mockResolvedValue({
        data: mockStages,
        error: null,
      })
      const mockIn2 = vi.fn().mockReturnValue({ order: mockOrder2 })
      const mockSelect3 = vi.fn().mockReturnValue({ in: mockIn2 })

      let callCount = 0
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'crm_connections') {
          return { select: mockSelect1 }
        }
        if (table === 'crm_pipelines') {
          return { select: mockSelect2 }
        }
        if (table === 'crm_pipeline_stages') {
          return { select: mockSelect3 }
        }
        return { select: vi.fn() }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/crm/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/crm/pipelines')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.pipelines).toEqual(mockPipelines)
      expect(data.data.stages).toEqual(mockStages)
      expect(data.data.connections).toEqual(mockConnections)
    })

    it('should return empty arrays if no connections', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEq = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/crm/pipelines/route')
      const request = new NextRequest('http://localhost:3000/api/crm/pipelines')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.pipelines).toEqual([])
      expect(data.data.stages).toEqual([])
    })
  })
})

