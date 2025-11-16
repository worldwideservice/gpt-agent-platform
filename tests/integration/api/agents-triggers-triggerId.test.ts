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
  getTriggerById: vi.fn(),
  updateTrigger: vi.fn(),
  updateTriggerStatus: vi.fn(),
  deleteTrigger: vi.fn(),
}))

describe('API: /api/agents/[id]/triggers/[triggerId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/triggers/[triggerId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123')
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return trigger by id', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getTriggerById } = await import('@/lib/repositories/triggers')

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
        name: 'Test Trigger',
        isActive: true,
      }

      vi.mocked(getTriggerById).mockResolvedValue(mockTrigger as any)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123')
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTrigger)
    })

    it('should return 404 if trigger not found', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { getTriggerById } = await import('@/lib/repositories/triggers')

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

      vi.mocked(getTriggerById).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123')
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('PATCH /api/agents/[id]/triggers/[triggerId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Trigger' }),
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update trigger status', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { updateTriggerStatus } = await import('@/lib/repositories/triggers')

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

      const mockUpdatedTrigger = {
        id: 'trigger-123',
        agent_id: 'agent-123',
        isActive: false,
      }

      vi.mocked(updateTriggerStatus).mockResolvedValue(mockUpdatedTrigger as any)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'PATCH',
        body: JSON.stringify({ isActive: false }),
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUpdatedTrigger)
    })

    it('should update trigger', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { updateTrigger } = await import('@/lib/repositories/triggers')

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

      const mockUpdatedTrigger = {
        id: 'trigger-123',
        agent_id: 'agent-123',
        name: 'Updated Trigger',
        description: 'Updated description',
      }

      vi.mocked(updateTrigger).mockResolvedValue(mockUpdatedTrigger as any)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Trigger', description: 'Updated description' }),
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUpdatedTrigger)
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

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: '' }), // Invalid: empty string
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]/triggers/[triggerId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete trigger', async () => {
      const { auth } = await import('@/auth')
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { deleteTrigger } = await import('@/lib/repositories/triggers')

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

      vi.mocked(deleteTrigger).mockResolvedValue(undefined)

      const route = await import('@/app/api/agents/[id]/triggers/[triggerId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/triggers/trigger-123', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'agent-123', triggerId: 'trigger-123' })

      const response = await route.DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteTrigger).toHaveBeenCalledWith('trigger-123', 'agent-123')
    })
  })
})

