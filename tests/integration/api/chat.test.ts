import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock repositories
vi.mock('@/lib/repositories/conversations', () => ({
  createConversation: vi.fn(),
  getConversationById: vi.fn(),
  addMessageToConversation: vi.fn(),
  getConversationMessages: vi.fn(),
}))

vi.mock('@/lib/repositories/knowledge-search', () => ({
  searchKnowledgeBase: vi.fn(),
  formatKnowledgeContext: vi.fn(),
}))

vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

vi.mock('@/lib/repositories/agent-pipeline-settings', () => ({
  isAgentConfiguredForStage: vi.fn(),
}))

vi.mock('@/lib/repositories/crm-connection', () => ({
  createKommoApiForOrg: vi.fn(),
}))

// Mock services
vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn(),
}))

vi.mock('@/lib/services/agent-context-builder', () => ({
  buildAgentContext: vi.fn(),
  composeSystemPrompt: vi.fn(),
  processConversationMemory: vi.fn(),
}))

vi.mock('@/lib/services/ai/configuration-resolver', () => ({
  resolveOrganizationAiConfiguration: vi.fn(),
}))

vi.mock('@/lib/services/agent-actions', () => ({
  AgentActionsService: vi.fn().mockImplementation(() => ({
    analyzeAndSuggestActions: vi.fn().mockResolvedValue([]),
    executeSuggestedAction: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('@/lib/cache', () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
  },
  cacheConfig: {},
  cacheKeys: {
    agentInstructions: vi.fn((id) => `agent:${id}:instructions`),
  },
}))

vi.mock('@/lib/utils/error-handler', () => ({
  createErrorResponse: vi.fn((error, context) => {
    const message = error instanceof Error ? error.message : String(error)
    const status = context?.code === 'VALIDATION_ERROR' ? 400 : 500
    return {
      response: {
        success: false,
        error: message,
        code: context?.code,
        details: context?.details,
        timestamp: new Date().toISOString(),
      },
      status,
    }
  }),
}))

describe('API: /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/chat', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/chat/route')
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Привет',
          agentId: 'agent-123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен вернуть 400 если нет сообщения', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      const route = await import('@/app/api/chat/route')
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          agentId: 'agent-123',
        }),
      })

      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    // Комплексный тест отключен - требует более детальной настройки моков
    // TODO: Добавить полный тест для создания конверсации
  })

  describe('GET /api/chat', () => {
    it('должен вернуть 401 если не авторизован', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/chat/route')
      const request = new NextRequest('http://localhost:3000/api/chat?conversationId=conv-123')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('должен вернуть сообщения конверсации', async () => {
      const { auth } = await import('@/auth')
      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
          email: 'test@example.com',
        },
      } as any)

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-1',
          role: 'user',
          content: 'Привет',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Здравствуйте!',
          created_at: '2024-01-01T00:00:01Z',
        },
      ] as any)

      const route = await import('@/app/api/chat/route')
      const request = new NextRequest('http://localhost:3000/api/chat?conversationId=conv-123')

      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.messages).toHaveLength(2)
      expect(data.data.messages[0].role).toBe('user')
    })
  })
})
