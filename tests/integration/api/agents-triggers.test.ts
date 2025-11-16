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

vi.mock('@/lib/repositories/triggers', () => ({
  getTriggers: vi.fn(),
  createTrigger: vi.fn(),
}))

describe('API: /api/agents/[id]/triggers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/triggers', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return triggers for agent', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getTriggers } = await import('@/lib/repositories/triggers')

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

      const mockTriggers = [
        {
          id: 'trigger-1',
          name: 'New Lead',
          isActive: true,
        },
      ]

      vi.mocked(getTriggers).mockResolvedValue(mockTriggers as any)

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTriggers)
      expect(getTriggers).toHaveBeenCalledWith('agent-123')
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

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('POST /api/agents/[id]/triggers', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Trigger',
          conditions: [],
          actions: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create trigger', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createTrigger } = await import('@/lib/repositories/triggers')

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

      const mockTrigger = {
        id: 'trigger-123',
        agent_id: 'agent-123',
        name: 'New Trigger',
        isActive: true,
      }

      vi.mocked(createTrigger).mockResolvedValue(mockTrigger as any)

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Trigger',
          conditions: [],
          actions: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTrigger)
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

      const route = await import('@/app/api/agents/[id]/triggers/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required name field
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

