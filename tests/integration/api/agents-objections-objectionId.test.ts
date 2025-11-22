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

describe('API: /api/agents/[id]/objections/[objectionId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('DELETE /api/agents/[id]/objections/[objectionId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/objections/[objectionId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/objections/objection-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', objectionId: 'objection-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete objection', async () => {
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

      const mockObjection = {
        id: 'objection-123',
        org_id: 'org-123',
      }

      // Chain for select: .select().eq().eq().single()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockObjection,
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

      const route = await import('@/app/api/agents/[id]/objections/[objectionId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/objections/objection-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', objectionId: 'objection-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 404 if objection not found', async () => {
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

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/objections/[objectionId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/objections/objection-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', objectionId: 'objection-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })
})

