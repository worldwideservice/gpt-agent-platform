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

vi.mock('@/lib/repositories/agent-sequences', () => ({
  getAgentChannels: vi.fn(),
  upsertAgentChannel: vi.fn(),
}))

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

describe('API: /api/agents/[id]/channels', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/channels', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return agent channels', async () => {
      const { auth } = await import('@/auth')
      const { getAgentChannels } = await import('@/lib/repositories/agent-sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockChannels = [
        { id: 'channel-1', name: 'Email', isActive: true },
        { id: 'channel-2', name: 'Chat', isActive: false },
      ]

      vi.mocked(getAgentChannels).mockResolvedValue(mockChannels)

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockChannels)
      expect(getAgentChannels).toHaveBeenCalledWith('org-123', 'agent-123')
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getAgentChannels } = await import('@/lib/repositories/agent-sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgentChannels).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/channels', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels', {
        method: 'POST',
        body: JSON.stringify({
          allChannelsEnabled: true,
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update agent channels', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { upsertAgentChannel } = await import('@/lib/repositories/agent-sequences')
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

      vi.mocked(upsertAgentChannel).mockResolvedValue(undefined)

      const mockEq2 = vi.fn().mockResolvedValue(undefined)
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete })

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: mockFrom,
      } as any)

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels', {
        method: 'POST',
        body: JSON.stringify({
          allChannelsEnabled: false,
          channels: [
            { id: 'channel-1', isActive: true },
            { id: 'channel-2', isActive: false },
          ],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
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

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels', {
        method: 'POST',
        body: JSON.stringify({
          // Missing allChannelsEnabled
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
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

      const route = await import('@/app/api/agents/[id]/channels/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels', {
        method: 'POST',
        body: JSON.stringify({
          allChannelsEnabled: true,
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })
})

