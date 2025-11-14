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
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('должен вернуть список конверсаций', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [
          {
            id: 'conv-1',
            agent_id: 'agent-123',
            org_id: 'org-123',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'conv-2',
            agent_id: 'agent-123',
            org_id: 'org-123',
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        total: 2,
      } as any)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.conversations).toHaveLength(2)
      expect(data.data.total).toBe(2)
    })

    it('должен фильтровать по agentId', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [
          {
            id: 'conv-1',
            agent_id: 'agent-456',
            org_id: 'org-123',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        total: 1,
      } as any)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations?agentId=agent-456')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.conversations).toHaveLength(1)
      expect(getConversations).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          agentId: 'agent-456',
        })
      )
    })

    it('должен применять pagination с limit и offset', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 100,
      } as any)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations?limit=10&offset=20')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getConversations).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          limit: 10,
          offset: 20,
        })
      )
    })

    it('должен использовать дефолтные значения для limit и offset', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 0,
      } as any)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')

      await route.GET(request)

      expect(getConversations).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          limit: 50,
          offset: 0,
        })
      )
    })

    it('должен вернуть 500 при ошибке БД', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить список диалогов')
    })

    it('должен передавать userId в getConversations', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-999',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 0,
      } as any)

      const route = await import('@/app/api/chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/chat/conversations')

      await route.GET(request)

      expect(getConversations).toHaveBeenCalledWith(
        'org-123',
        expect.objectContaining({
          userId: 'user-999',
        })
      )
    })
  })
})
