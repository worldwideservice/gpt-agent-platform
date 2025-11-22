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

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: vi.fn(),
}))

describe('API: /api/agents/[id]/assets/[assetId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Note: GET endpoint doesn't exist in /api/agents/[id]/assets/[assetId]/route.ts
  // Only DELETE is available

  describe('DELETE /api/agents/[id]/assets/[assetId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/assets/[assetId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets/asset-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', assetId: 'asset-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete asset', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { getSupabaseServerClient } = await import('@/lib/supabase/server')

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

      const mockAsset = {
        id: 'asset-123',
        storage_path: 'agents/org-123/agent-123/file.pdf',
      }

      // Chain for select: .select().eq().eq().eq().single()
      // The route calls: supabase.from('agent_assets').select('storage_path').eq('id').eq('agent_id').eq('org_id').single()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockAsset,
        error: null,
      })
      const mockEq3Select = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq2Select = vi.fn().mockReturnValue({ eq: mockEq3Select })
      const mockEq1Select = vi.fn().mockReturnValue({ eq: mockEq2Select })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1Select })

      const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockFromStorage = vi.fn().mockReturnValue({ remove: mockRemove })

      // Chain for delete: .delete().eq('id').eq('agent_id').eq('org_id')
      // The route calls: supabase.from('agent_assets').delete().eq('id').eq('agent_id').eq('org_id')
      // delete() returns an object with eq() method, then eq() is chained
      const mockDeleteResult = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq3Delete = vi.fn().mockReturnValue({ delete: mockDeleteResult })
      const mockEq2Delete = vi.fn().mockReturnValue({ eq: mockEq3Delete })
      const mockEq1Delete = vi.fn().mockReturnValue({ eq: mockEq2Delete })
      const mockDeleteMethod = vi.fn().mockReturnValue({ eq: mockEq1Delete })
      
      // Make sure the same from() instance is used for both select and delete
      // The route uses the same supabase instance, so from() should return the same object
      const agentAssetsFrom = {
        select: mockSelect,
        delete: mockDeleteMethod,
      }
      
      const mockFromWithBoth = vi.fn().mockImplementation((table: string) => {
        if (table === 'agent_assets') {
          return agentAssetsFrom
        }
        return { select: mockSelect }
      })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFromWithBoth,
      } as any)

      vi.mocked(getSupabaseServerClient).mockReturnValue({
        storage: {
          from: mockFromStorage,
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/assets/[assetId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/assets/asset-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', assetId: 'asset-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

