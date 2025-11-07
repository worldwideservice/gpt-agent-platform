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

// Mock error handler
vi.mock('@/lib/utils/error-handler', () => ({
  createErrorResponse: vi.fn((error, options) => {
    return {
      response: {
        success: false,
        error: error.message || 'Error',
        ...(options?.details ? { details: options.details } : {}),
      },
      status: options?.code === 'AUTHENTICATION_ERROR' ? 401 : options?.code === 'VALIDATION_ERROR' ? 400 : 500,
    }
  }),
}))

describe('API: /api/agents/[id]/scripts/[scriptId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PATCH /api/agents/[id]/scripts/[scriptId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/[scriptId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts/script-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Script' }),
      })
      const params = Promise.resolve({ id: 'agent-123', scriptId: 'script-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update script', async () => {
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

      const mockUpdatedScript = {
        id: 'script-123',
        agent_id: 'agent-123',
        org_id: 'org-123',
        title: 'Updated Script',
        content: 'Updated content',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockUpdatedScript,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq2 = vi.fn().mockReturnValue({ select: mockSelect })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })

      const mockFrom = vi.fn().mockReturnValue({
        update: mockUpdate,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/[scriptId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts/script-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Script' }),
      })
      const params = Promise.resolve({ id: 'agent-123', scriptId: 'script-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUpdatedScript)
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

      const route = await import('@/app/api/agents/[id]/scripts/[scriptId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts/script-123', {
        method: 'PATCH',
        body: JSON.stringify({ scriptType: 'invalid-type' }),
      })
      const params = Promise.resolve({ id: 'agent-123', scriptId: 'script-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]/scripts/[scriptId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/scripts/[scriptId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts/script-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', scriptId: 'script-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete script', async () => {
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
      }

      // Chain for select: .select().eq().eq().single()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockScript,
        error: null,
      })
      const mockEq2Select = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1Select = vi.fn().mockReturnValue({ eq: mockEq2Select })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1Select })

      // Chain for delete: .delete().eq().eq()
      const mockDeleteResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2Delete = vi.fn().mockReturnValue({ delete: mockDeleteResult })
      const mockEq1Delete = vi.fn().mockReturnValue({ eq: mockEq2Delete })
      const mockDeleteMethod = vi.fn().mockReturnValue({ eq: mockEq1Delete })

      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
        delete: mockDeleteMethod,
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/scripts/[scriptId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/scripts/script-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', scriptId: 'script-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

