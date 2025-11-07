import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock services
vi.mock('@/lib/services/sequences', () => ({
  getSequences: vi.fn(),
  createSequence: vi.fn(),
  startSequence: vi.fn(),
  updateSequence: vi.fn(),
  deleteSequence: vi.fn(),
}))

describe('API: /api/agents/[id]/sequences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/agents/[id]/sequences', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return list of sequences', async () => {
      const { auth } = await import('@/auth')
      const { getSequences } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockSequences = [
        {
          id: 'sequence-1',
          name: 'Test Sequence',
          trigger_type: 'manual',
          is_active: true,
        },
      ]

      vi.mocked(getSequences).mockResolvedValue(mockSequences as any)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSequences)
      expect(getSequences).toHaveBeenCalledWith('org-123', 'agent-123', false)
    })

    it('should filter by active_only parameter', async () => {
      const { auth } = await import('@/auth')
      const { getSequences } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getSequences).mockResolvedValue([])

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences?active_only=true')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getSequences).toHaveBeenCalledWith('org-123', 'agent-123', true)
    })

    it('should handle errors when getting sequences', async () => {
      const { auth } = await import('@/auth')
      const { getSequences } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getSequences).mockRejectedValue(new Error('Database error'))

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences')
      const params = { id: 'agent-123' }

      const response = await route.GET(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить последовательности')
    })
  })

  describe('POST /api/agents/[id]/sequences', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Sequence',
          trigger_type: 'manual',
          steps: [],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create a new sequence', async () => {
      const { auth } = await import('@/auth')
      const { createSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createSequence).mockResolvedValue('sequence-123')

      const sequenceData = {
        name: 'Test Sequence',
        trigger_type: 'manual',
        steps: [
          {
            step_order: 1,
            delay_minutes: 0,
            action_type: 'send_message',
          },
        ],
      }

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences', {
        method: 'POST',
        body: JSON.stringify(sequenceData),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('sequence-123')
      expect(createSequence).toHaveBeenCalledWith('org-123', expect.objectContaining({
        name: sequenceData.name,
        trigger_type: sequenceData.trigger_type,
        agent_id: 'agent-123',
        is_active: true,
        metadata: {},
      }))
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Некорректные данные')
    })

    it('should handle errors when creating sequence', async () => {
      const { auth } = await import('@/auth')
      const { createSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createSequence).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Sequence',
          trigger_type: 'manual',
          steps: [
            {
              step_order: 1,
              delay_minutes: 0,
              action_type: 'send_message',
            },
          ],
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /api/agents/[id]/sequences - Start sequence', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences?sequenceId=seq-123', {
        method: 'PUT',
        body: JSON.stringify({
          lead_id: 'lead-123',
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should start a sequence', async () => {
      const { auth } = await import('@/auth')
      const { startSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(startSequence).mockResolvedValue('execution-123')

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences?sequenceId=seq-123', {
        method: 'PUT',
        body: JSON.stringify({
          lead_id: 'lead-123',
          contact_id: 'contact-123',
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.execution_id).toBe('execution-123')
      expect(startSequence).toHaveBeenCalledWith(
        'seq-123',
        'org-123',
        'lead-123',
        'contact-123',
        {},
      )
    })

    it('should return 400 if sequenceId is missing', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/sequences/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences', {
        method: 'PUT',
        body: JSON.stringify({
          lead_id: 'lead-123',
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.PUT(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('ID последовательности обязателен')
    })
  })

  describe('PATCH /api/agents/[id]/sequences/[sequenceId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Sequence',
        }),
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should update a sequence', async () => {
      const { auth } = await import('@/auth')
      const { updateSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(updateSequence).mockResolvedValue(true)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Sequence',
        }),
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(updateSequence).toHaveBeenCalledWith('seq-123', 'org-123', { name: 'Updated Sequence' })
    })

    it('should return 400 for invalid update data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'PATCH',
        body: JSON.stringify({
          trigger_type: 'invalid_type', // Invalid enum value
        }),
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.PATCH(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/agents/[id]/sequences/[sequenceId]', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should delete a sequence', async () => {
      const { auth } = await import('@/auth')
      const { deleteSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteSequence).mockResolvedValue(true)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(deleteSequence).toHaveBeenCalledWith('seq-123', 'org-123')
    })

    it('should handle errors when deleting sequence', async () => {
      const { auth } = await import('@/auth')
      const { deleteSequence } = await import('@/lib/services/sequences')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(deleteSequence).mockResolvedValue(false)

      const route = await import('@/app/api/agents/[id]/sequences/[sequenceId]/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/sequences/seq-123', {
        method: 'DELETE',
      })
      const params = { id: 'agent-123', sequenceId: 'seq-123' }

      const response = await route.DELETE(request, { params: Promise.resolve(params) })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })
})

