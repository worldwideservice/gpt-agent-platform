import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/agents/route'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  getAgents: vi.fn(),
  createAgent: vi.fn(),
}))

// Mock activity logger
vi.mock('@/lib/services/activity-logger', () => ({
  ActivityLogger: {
    agentCreated: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('API: /api/agents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return list of agents', async () => {
      const { auth } = await import('@/auth')
      const { getAgents } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getAgents).mockResolvedValue({
        agents: [
          {
            id: 'agent-1',
            name: 'Test Agent',
            status: 'active',
          },
        ],
        total: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.agents).toHaveLength(1)
      expect(data.pagination).toBeDefined()
    })

    it('should handle errors correctly', async () => {
      const { auth } = await import('@/auth')
      const { getAgents } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getAgents).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.code).toBe('AGENTS_LIST_ERROR')
    })
  })

  describe('POST /api/agents', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Agent',
          model: 'gpt-4',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create agent with valid data', async () => {
      const { auth } = await import('@/auth')
      const { createAgent } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createAgent).mockResolvedValue({
        id: 'agent-1',
        name: 'Test Agent',
        status: 'draft',
      } as any)

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Agent',
          model: 'gpt-4',
          instructions: 'Test instructions',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })
  })
})

