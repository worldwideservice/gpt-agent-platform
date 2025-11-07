import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock services
vi.mock('@/lib/services/rule-engine', () => ({
  getRules: vi.fn(),
  createRule: vi.fn(),
  executeRules: vi.fn(),
  previewRules: vi.fn(),
}))

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/agents/[id]/rules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/rules', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return list of rules', async () => {
      const { auth } = await import('@/auth')
      const { getRules } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockRules = [
        {
          id: 'rule-1',
          name: 'Test Rule',
          trigger_type: 'lead_created',
          is_active: true,
        },
      ]

      vi.mocked(getRules).mockResolvedValue(mockRules as any)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockRules)
      expect(getRules).toHaveBeenCalledWith('org-123', 'agent-123', true)
    })

    it('should filter by active_only parameter', async () => {
      const { auth } = await import('@/auth')
      const { getRules } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getRules).mockResolvedValue([])

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules?active_only=false')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getRules).toHaveBeenCalledWith('org-123', 'agent-123', false)
    })

    it('should handle errors when getting rules', async () => {
      const { auth } = await import('@/auth')
      const { getRules } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getRules).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить правила')
    })
  })

  describe('POST /api/agents/[id]/rules', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Rule',
          trigger_type: 'lead_created',
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create a new rule', async () => {
      const { auth } = await import('@/auth')
      const { createRule } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createRule).mockResolvedValue('rule-123')

      const ruleData = {
        name: 'Test Rule',
        trigger_type: 'lead_created',
        conditions: [],
        actions: [],
      }

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'POST',
        body: JSON.stringify(ruleData),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('rule-123')
      expect(createRule).toHaveBeenCalledWith('org-123', expect.objectContaining({
        ...ruleData,
        agent_id: 'agent-123',
        is_active: true,
        priority: 10,
      }))
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should handle errors when creating rule', async () => {
      const { auth } = await import('@/auth')
      const { createRule } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createRule).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Rule',
          trigger_type: 'lead_created',
          conditions: [],
          actions: [],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /api/agents/[id]/rules', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'PUT',
        body: JSON.stringify({
          triggerType: 'lead_created',
          triggerData: {},
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should execute rules in preview mode', async () => {
      const { auth } = await import('@/auth')
      const { previewRules } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockPreviewResults = [
        {
          ruleId: 'rule-1',
          wouldExecute: true,
          actions: [],
        },
      ]

      vi.mocked(previewRules).mockResolvedValue(mockPreviewResults as any)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules?preview=true', {
        method: 'PUT',
        body: JSON.stringify({
          triggerType: 'lead_created',
          triggerData: {},
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.preview).toBe(true)
      expect(data.data.rules).toEqual(mockPreviewResults)
    })

    it('should execute rules in real mode', async () => {
      const { auth } = await import('@/auth')
      const { executeRules } = await import('@/lib/services/rule-engine')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockExecutionResults = [
        {
          ruleId: 'rule-1',
          executed: true,
          actions: [],
        },
      ]

      vi.mocked(executeRules).mockResolvedValue(mockExecutionResults as any)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'PUT',
        body: JSON.stringify({
          triggerType: 'lead_created',
          triggerData: {},
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.preview).toBe(false)
      expect(data.data.executions).toEqual(mockExecutionResults)
    })

    it('should return 400 for invalid execution data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/rules/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules', {
        method: 'PUT',
        body: JSON.stringify({
          // Missing required triggerType
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('PATCH /api/agents/[id]/rules/[ruleId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Rule',
        }),
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update a rule', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'rule-123',
          name: 'Updated Rule',
          is_active: true,
        },
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq3 = vi.fn().mockReturnValue({ select: mockSelect })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate })

      const mockSupabase = {
        from: mockFrom,
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockSupabase as any)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Rule',
        }),
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Updated Rule')
    })

    it('should return 400 for invalid update data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'PATCH',
        body: JSON.stringify({
          trigger_type: 'invalid_type', // Invalid enum value
        }),
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]/rules/[ruleId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete a rule', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEq3 = vi.fn().mockResolvedValue({ error: null })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete })

      const mockSupabase = {
        from: mockFrom,
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockSupabase as any)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle errors when deleting rule', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockEq3 = vi.fn().mockResolvedValue({ error: new Error('Database error') })
      const mockEq2 = vi.fn().mockReturnValue({ eq: mockEq3 })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete })

      const mockSupabase = {
        from: mockFrom,
      }

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue(mockSupabase as any)

      const route = await import('@/app/api/agents/[id]/rules/[ruleId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/rules/rule-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', ruleId: 'rule-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

