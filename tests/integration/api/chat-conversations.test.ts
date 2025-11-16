import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/conversations', () => ({
  getConversations: vi.fn(),
}))

describe('API: /api/chat/conversations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/chat/conversations', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return conversations list', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockResult = {
        conversations: [
          { id: 'conv-1', agentId: 'agent-123', userId: 'user-123' },
        ],
        total: 1,
      }

      vi.mocked(getConversations).mockResolvedValue(mockResult)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.conversations).toEqual(mockResult.conversations)
      expect(data.data.total).toBe(1)
    })

    it('should filter conversations by agentId', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 0,
      })

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations?agentId=agent-123')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getConversations).toHaveBeenCalledWith('org-123', {
        agentId: 'agent-123',
        userId: 'user-123',
        limit: 50,
        offset: 0,
      })
    })

    it('should use custom pagination parameters', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 0,
      })

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations?limit=20&offset=10')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getConversations).toHaveBeenCalledWith('org-123', {
        agentId: undefined,
        userId: 'user-123',
        limit: 20,
        offset: 10,
      })
    })

    it('should handle errors gracefully', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversations).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

