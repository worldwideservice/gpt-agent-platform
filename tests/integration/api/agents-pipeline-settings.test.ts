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

describe('API: /api/agents/[id]/pipeline-settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/pipeline-settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
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

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
    })

    it('should return pipeline settings', async () => {
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
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      const mockSettings = [
        {
          id: 'setting-1',
          agent_id: 'agent-123',
          org_id: 'org-123',
          pipeline_id: 'pipeline-1',
          is_active: true,
          all_stages: false,
          selected_stages: ['stage-1', 'stage-2'],
          stage_instructions: {},
        },
      ]

      const createQuery = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: mockSettings,
            error: null,
          }).then(resolve)
        })
        return chain
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(createQuery()),
        }),
      } as any)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSettings)
    })

    it('should handle database errors', async () => {
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
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      const createQueryWithError = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({
            data: null,
            error: { message: 'Database error' },
          }).then(resolve)
        })
        return chain
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(createQueryWithError()),
        }),
      } as any)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить настройки воронок')
    })
  })

  describe('POST /api/agents/[id]/pipeline-settings', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings', {
        method: 'POST',
        body: JSON.stringify([]),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
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

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings', {
        method: 'POST',
        body: JSON.stringify([]),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Агент не найден')
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
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings', {
        method: 'POST',
        body: JSON.stringify([
          {
            // Missing required pipelineId
            isActive: true,
            allStages: false,
            selectedStages: [],
          },
        ]),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should save pipeline settings successfully', async () => {
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
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      const mockSettings = [
        {
          id: 'setting-1',
          agent_id: 'agent-123',
          org_id: 'org-123',
          pipeline_id: 'pipeline-1',
          is_active: true,
          all_stages: false,
          selected_stages: ['stage-1'],
          stage_instructions: {},
        },
      ]

      // Mock for delete chain: .from().delete().eq().eq()
      const createDeleteChain = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({ data: null, error: null }).then(resolve)
        })
        return chain
      }

      // Mock for insert chain: .from().insert().select()
      const mockSelect = vi.fn().mockResolvedValue({
        data: mockSettings,
        error: null,
      })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'agent_pipeline_settings') {
            return {
              delete: vi.fn().mockReturnValue(createDeleteChain()),
              insert: mockInsert,
            }
          }
          return {}
        }),
      } as any)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings', {
        method: 'POST',
        body: JSON.stringify([
          {
            pipelineId: 'pipeline-1',
            isActive: true,
            allStages: false,
            selectedStages: ['stage-1'],
          },
        ]),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSettings)
    })

    it('should handle database errors on save', async () => {
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
        name: 'Test Agent',
        org_id: 'org-123',
      } as any)

      // Mock for delete chain: .from().delete().eq().eq()
      const createDeleteChain = () => {
        const chain: any = {
          eq: vi.fn().mockImplementation(() => chain),
        }
        chain.then = vi.fn().mockImplementation((resolve) => {
          return Promise.resolve({ data: null, error: null }).then(resolve)
        })
        return chain
      }

      // Mock for insert with error: .from().insert().select()
      const mockSelect = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'agent_pipeline_settings') {
            return {
              delete: vi.fn().mockReturnValue(createDeleteChain()),
              insert: mockInsert,
            }
          }
          return {}
        }),
      } as any)

      const route = await import('@/app/api/agents/[id]/pipeline-settings/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/pipeline-settings', {
        method: 'POST',
        body: JSON.stringify([
          {
            pipelineId: 'pipeline-1',
            isActive: true,
            allStages: false,
            selectedStages: ['stage-1'],
          },
        ]),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось сохранить настройки воронок')
    })
  })
})
