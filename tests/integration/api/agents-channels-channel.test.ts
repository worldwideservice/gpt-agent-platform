import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agent-sequences', () => ({
  upsertAgentChannel: vi.fn(),
  deleteAgentChannel: vi.fn(),
}))

describe('API: /api/agents/[id]/channels/[channel]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PATCH /api/agents/[id]/channels/[channel]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/channels/[channel]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels/telegram', {
        method: 'PATCH',
        body: JSON.stringify({
          isEnabled: true,
        }),
      })
      const params = Promise.resolve({ id: 'agent-123', channel: 'telegram' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update channel', async () => {
      const { auth } = await import('@/auth')
      const { upsertAgentChannel } = await import('@/lib/repositories/agent-sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockUpdatedChannel = {
        id: 'channel-123',
        agent_id: 'agent-123',
        channel: 'telegram',
        isEnabled: true,
      }

      vi.mocked(upsertAgentChannel).mockResolvedValue(mockUpdatedChannel as any)

      const route = await import('@/app/api/agents/[id]/channels/[channel]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels/telegram', {
        method: 'PATCH',
        body: JSON.stringify({
          isEnabled: true,
          settings: { token: 'test-token' },
        }),
      })
      const params = Promise.resolve({ id: 'agent-123', channel: 'telegram' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUpdatedChannel)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/channels/[channel]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels/telegram', {
        method: 'PATCH',
        body: JSON.stringify({
          isEnabled: 'not-a-boolean', // Invalid data
        }),
      })
      const params = Promise.resolve({ id: 'agent-123', channel: 'telegram' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]/channels/[channel]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/channels/[channel]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels/telegram', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', channel: 'telegram' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete channel', async () => {
      const { auth } = await import('@/auth')
      const { deleteAgentChannel } = await import('@/lib/repositories/agent-sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteAgentChannel).mockResolvedValue(undefined)

      const route = await import('@/app/api/agents/[id]/channels/[channel]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/channels/telegram', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', channel: 'telegram' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteAgentChannel).toHaveBeenCalledWith('org-123', 'agent-123', 'telegram')
    })
  })
})

