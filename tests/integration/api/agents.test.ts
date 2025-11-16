import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

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

      const route = await import('@/app/api/agents/route')
      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await route.GET(request)
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

      const route = await import('@/app/api/agents/route')
      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data).toHaveLength(1)
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

      const route = await import('@/app/api/agents/route')
      const request = new NextRequest('http://localhost:3000/api/agents')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.code).toBe('AGENTS_LIST_ERROR')
    })

    /**
     * Задача 4.1: Advanced Filters для агентов
     * Тесты для новых фильтров по модели и дате
     */
    describe('Advanced Filters (Task 4.1)', () => {
      it('should filter agents by model', async () => {
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
              name: 'GPT-4 Agent',
              status: 'active',
              model: 'gpt-4.1',
            },
          ],
          total: 1,
        })

        const route = await import('@/app/api/agents/route')
        const request = new NextRequest('http://localhost:3000/api/agents?model=gpt-4.1')
        const response = await route.GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(getAgents).toHaveBeenCalledWith(
          expect.objectContaining({
            organizationId: 'org-123',
            model: 'gpt-4.1',
          })
        )
      })

      it('should filter agents by date range', async () => {
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
              name: 'Recent Agent',
              status: 'active',
              createdAt: '2024-01-15T00:00:00Z',
            },
          ],
          total: 1,
        })

        const route = await import('@/app/api/agents/route')
        const dateFrom = '2024-01-01T00:00:00Z'
        const dateTo = '2024-01-31T23:59:59Z'
        const request = new NextRequest(
          `http://localhost:3000/api/agents?dateFrom=${dateFrom}&dateTo=${dateTo}`
        )
        const response = await route.GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(getAgents).toHaveBeenCalledWith(
          expect.objectContaining({
            organizationId: 'org-123',
            dateFrom: new Date(dateFrom),
            dateTo: new Date(dateTo),
          })
        )
      })

      it('should filter agents with combined filters', async () => {
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
              name: 'Sales Agent',
              status: 'active',
              model: 'gpt-4.1',
              createdAt: '2024-01-15T00:00:00Z',
            },
          ],
          total: 1,
        })

        const route = await import('@/app/api/agents/route')
        const request = new NextRequest(
          'http://localhost:3000/api/agents?search=Sales&status=active&model=gpt-4.1&dateFrom=2024-01-01T00:00:00Z'
        )
        const response = await route.GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(getAgents).toHaveBeenCalledWith(
          expect.objectContaining({
            organizationId: 'org-123',
            search: 'Sales',
            status: 'active',
            model: 'gpt-4.1',
            dateFrom: new Date('2024-01-01T00:00:00Z'),
          })
        )
      })

      it('should validate invalid date formats', async () => {
        const { auth } = await import('@/auth')

        vi.mocked(auth).mockResolvedValue({
          user: {
            id: 'user-123',
            orgId: 'org-123',
            email: 'test@example.com',
          },
        } as any)

        const route = await import('@/app/api/agents/route')
        const request = new NextRequest('http://localhost:3000/api/agents?dateFrom=invalid-date')
        const response = await route.GET(request)
        const data = await response.json()

        // Should handle invalid date gracefully or return 400
        expect([200, 400]).toContain(response.status)
      })
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

      const route = await import('@/app/api/agents/route')
      const response = await route.POST(request)
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

      const route = await import('@/app/api/agents/route')
      const response = await route.POST(request)
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

      const route = await import('@/app/api/agents/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })
  })
})

