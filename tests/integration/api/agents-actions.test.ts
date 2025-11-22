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

// Mock services - create a shared instance
const mockAgentActionsService = {
  getAvailableActions: vi.fn(),
  analyzeAndSuggestActions: vi.fn(),
  executeSuggestedAction: vi.fn(),
}

class MockAgentActionsService {
  constructor() {
    return mockAgentActionsService
  }
}

vi.mock('@/lib/services/agent-actions', () => ({
  AgentActionsService: MockAgentActionsService,
}))

describe('API: /api/agents/[id]/actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock implementations and set default return values
    vi.mocked(mockAgentActionsService.getAvailableActions).mockReset().mockReturnValue([])
    vi.mocked(mockAgentActionsService.analyzeAndSuggestActions).mockReset().mockResolvedValue([])
    vi.mocked(mockAgentActionsService.executeSuggestedAction).mockReset().mockResolvedValue({ success: true })
  })

  describe('POST /api/agents/[id]/actions', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'POST',
        body: JSON.stringify({
          action: 'test',
          data: {},
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should analyze actions', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(mockAgentActionsService.analyzeAndSuggestActions).mockResolvedValue([
        { type: 'send_message', confidence: 0.9, reason: 'Test reason' },
      ])

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
          conversationHistory: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.suggestions).toBeDefined()
    })

    it('should return 400 for invalid action data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required message field
        }),
      })
      const params = { id: 'agent-123' }

      const response = await route.POST(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should get available actions', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(mockAgentActionsService.getAvailableActions).mockReturnValue([
        { type: 'send_message', name: 'Send Message' },
        { type: 'create_sequence', name: 'Create Sequence' },
      ])

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions')
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.actions).toBeDefined()
    })
  })

  describe('PUT /api/agents/[id]/actions', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'send_message',
            confidence: 0.9,
            reason: 'Test reason',
          },
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should execute action successfully', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockResult = {
        success: true,
        actionType: 'send_message',
        message: 'Action executed',
      }

      vi.mocked(mockAgentActionsService.executeSuggestedAction).mockResolvedValue(mockResult)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'send_message',
            confidence: 0.9,
            reason: 'Test reason',
          },
          conversationHistory: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.result).toEqual(mockResult)
      expect(data.message).toBe('Действие выполнено успешно')
    })

    it('should execute Kommo action', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockResult = {
        success: true,
        actionType: 'kommo_action',
      }

      vi.mocked(mockAgentActionsService.executeSuggestedAction).mockResolvedValue(mockResult)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'kommo_action',
            confidence: 0.9,
            reason: 'Test reason',
            kommoAction: {
              type: 'update_lead',
              data: { status_id: 123 },
              entityId: 456,
              entityType: 'leads',
            },
          },
          leadId: 456,
          conversationHistory: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.result).toEqual(mockResult)
    })

    it('should return 400 for invalid action data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'invalid_type', // Invalid: not in enum
            confidence: 0.9,
            reason: 'Test reason',
          },
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should return 400 for invalid confidence value', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'send_message',
            confidence: 1.5, // Invalid: > 1
            reason: 'Test reason',
          },
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle execution errors gracefully', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(mockAgentActionsService.executeSuggestedAction).mockRejectedValue(
        new Error('Execution failed')
      )

      const route = await import('@/app/api/agents/[id]/actions/route')
      const request = new NextRequest('http://localhost:3000/api/agents/agent-123/actions', {
        method: 'PUT',
        body: JSON.stringify({
          action: {
            type: 'send_message',
            confidence: 0.9,
            reason: 'Test reason',
          },
          conversationHistory: [],
        }),
      })
      const params = Promise.resolve({ id: 'agent-123' })

      const response = await route.PUT(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось выполнить действие')
    })
  })
})

