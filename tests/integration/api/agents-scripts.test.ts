import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/agents/[id]/scripts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/scripts', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return scripts for agent', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const mockScripts = [
        {
          id: 'script-1',
          script_type: 'opening',
          script_content: 'Hello!',
          effectiveness_score: 0.8,
        },
      ]

      // Chain: .eq('org_id').or(...).order(...).order(...)
      const mockOrder2 = vi.fn().mockResolvedValue({
        data: mockScripts,
        error: null,
      })
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 })
      const mockOr1 = vi.fn().mockReturnValue({ order: mockOrder1 })
      const mockEq = vi.fn().mockReturnValue({ or: mockOr1 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should filter scripts by stageId and scriptType', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      // Chain: .eq('org_id').or(...).or(...).eq('script_type').order(...).order(...)
      const mockOrder2 = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      })
      const mockOrder1 = vi.fn().mockReturnValue({ order: mockOrder2 })
      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder1 })
      const mockOr2 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockOr1 = vi.fn().mockReturnValue({ or: mockOr2 })
      const mockEq1 = vi.fn().mockReturnValue({ or: mockOr1 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts?stageId=stage-123&scriptType=opening')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 404 if agent not found', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/scripts', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          scriptType: 'opening',
          scriptContent: 'Hello!',
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create script', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const mockScript = {
        id: 'script-123',
        org_id: 'org-123',
        agent_id: 'agent-123',
        pipeline_stage_id: null,
        title: 'Test Script',
        script_type: 'greeting',
        content: 'Hello!',
        variables: {},
        conditions: {},
        effectiveness_score: 0.5,
        usage_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockScript,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Script',
          scriptType: 'greeting',
          content: 'Hello!',
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        org_id: 'org-123',
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

