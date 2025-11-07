import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/agents', () => ({
  updateAgentStatus: vi.fn(),
}))

describe('API: /api/agents/[id]/status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PATCH /api/agents/[id]/status', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/status/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'active' }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update agent status', async () => {
      const { auth } = await import('@/auth')
      const { updateAgentStatus } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockAgent = {
        id: 'agent-123',
        org_id: 'org-123',
        status: 'active',
      }

      vi.mocked(updateAgentStatus).mockResolvedValue(mockAgent as any)

      const route = await import('@/app/api/agents/[id]/status/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'active' }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('active')
      expect(updateAgentStatus).toHaveBeenCalledWith('agent-123', 'org-123', 'active')
    })

    it('should return 400 for invalid status', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/status/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'invalid' }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

