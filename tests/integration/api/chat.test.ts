import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))
vi.mock('@/lib/repositories/conversations')
vi.mock('@/lib/repositories/agents')
vi.mock('@/lib/services/llm')
vi.mock('@/lib/services/agent-actions')
vi.mock('@/lib/services/agent-context-builder', () => ({
  buildFullSystemPrompt: vi.fn(),
  processConversationMemory: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/repositories/knowledge-search', () => ({
  searchKnowledgeBase: vi.fn(),
  formatKnowledgeContext: vi.fn(),
}))
vi.mock('@/lib/repositories/crm-connection', () => ({
  createKommoApiForOrg: vi.fn(),
}))
vi.mock('@/lib/repositories/agent-pipeline-settings', () => ({
  isAgentConfiguredForStage: vi.fn(),
}))
vi.mock('@/lib/services/agent-memory', () => ({
  extractAndSaveMemoryFromConversation: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/services/activity-logger', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
  ActivityLogger: {
    agentCreated: vi.fn().mockResolvedValue(undefined),
    agentResponse: vi.fn().mockResolvedValue(undefined),
    actionExecuted: vi.fn().mockResolvedValue(undefined),
    leadCreated: vi.fn().mockResolvedValue(undefined),
    leadUpdated: vi.fn().mockResolvedValue(undefined),
    leadStatusChanged: vi.fn().mockResolvedValue(undefined),
    conversationStarted: vi.fn().mockResolvedValue(undefined),
    conversationEnded: vi.fn().mockResolvedValue(undefined),
    taskCreated: vi.fn().mockResolvedValue(undefined),
    taskCompleted: vi.fn().mockResolvedValue(undefined),
    callCompleted: vi.fn().mockResolvedValue(undefined),
    errorOccurred: vi.fn().mockResolvedValue(undefined),
    integrationConnected: vi.fn().mockResolvedValue(undefined),
    integrationSynced: vi.fn().mockResolvedValue(undefined),
    ruleExecuted: vi.fn().mockResolvedValue(undefined),
    sequenceExecuted: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('API: /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
      }),
    })

    const route = await import('@/app/api/chat/route')
    const response = await route.POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Не авторизовано')
  })

  it('should return 400 for invalid message', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        orgId: 'org-123',
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: '', // Empty message
      }),
    })

    const route = await import('@/app/api/chat/route')
    const response = await route.POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('should create new conversation and return response', async () => {
    const { auth } = await import('@/auth')
    const { createConversation, addMessageToConversation, getConversationMessages } = await import(
      '@/lib/repositories/conversations',
    )
    const { generateChatResponse } = await import('@/lib/services/llm')
    const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        orgId: 'org-123',
      },
    } as any)

    vi.mocked(createConversation).mockResolvedValue({
      id: 'conv-123',
      organizationId: 'org-123',
      agentId: null,
      userId: 'user-123',
      leadId: null,
      title: 'Test message',
      metadata: {},
      createdAt: '2025-01-26T00:00:00Z',
      updatedAt: '2025-01-26T00:00:00Z',
    })

    vi.mocked(addMessageToConversation).mockResolvedValueOnce({
      id: 'msg-user-1',
      conversationId: 'conv-123',
      role: 'user',
      content: 'Hello',
      metadata: {},
      createdAt: '2025-01-26T00:00:00Z',
    })

    vi.mocked(getConversationMessages).mockResolvedValue([
      {
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'Hello',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      },
    ])

    vi.mocked(buildFullSystemPrompt).mockResolvedValue(null)

    vi.mocked(generateChatResponse).mockResolvedValue({
      content: 'Hello! How can I help you?',
      usage: {
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15,
      },
      model: 'gpt-4o-mini',
    })

    vi.mocked(addMessageToConversation).mockResolvedValueOnce({
      id: 'msg-assistant-1',
      conversationId: 'conv-123',
      role: 'assistant',
      content: 'Hello! How can I help you?',
      metadata: {
        model: 'gpt-4o-mini',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
      },
      createdAt: '2025-01-26T00:01:00Z',
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        useKnowledgeBase: false, // Отключаем базу знаний для упрощения
      }),
    })

    const route = await import('@/app/api/chat/route')
    const response = await route.POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.conversationId).toBe('conv-123')
    expect(data.data.message.content).toBe('Hello! How can I help you?')
    expect(createConversation).toHaveBeenCalled()
    expect(addMessageToConversation).toHaveBeenCalledTimes(2)
  })

  it('should return 404 if conversation not found', async () => {
    const { auth } = await import('@/auth')
    const { getConversationById } = await import('@/lib/repositories/conversations')

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        orgId: 'org-123',
      },
    } as any)

    vi.mocked(getConversationById).mockResolvedValue(null)

    // Используем валидный UUID формат для conversationId
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        conversationId: '00000000-0000-4000-8000-000000000000', // Валидный UUID
      }),
    })

    const route = await import('@/app/api/chat/route')
    const response = await route.POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Диалог не найден')
  })

  // Тест для существующего диалога требует сложного мокирования всех зависимостей
  // (агент, CRM, pipeline settings, контекст билдер и т.д.)
  // Оставляем базовые тесты выше для покрытия основных сценариев

  it('should handle errors gracefully', async () => {
    const { auth } = await import('@/auth')
    const { createConversation } = await import('@/lib/repositories/conversations')

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        orgId: 'org-123',
      },
    } as any)

    vi.mocked(createConversation).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
      }),
    })

    const route = await import('@/app/api/chat/route')
    const response = await route.POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Не удалось обработать сообщение')
  })

  describe('GET /api/chat', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/chat')
      const route = await import('@/app/api/chat/route')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не авторизовано')
    })

    it('should return messages for conversation', async () => {
      const { auth } = await import('@/auth')
      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
        {
          id: 'msg-2',
          conversationId: 'conv-123',
          role: 'assistant',
          content: 'Hi there!',
          metadata: {},
          createdAt: '2025-01-26T00:01:00Z',
        },
      ])

      const request = new NextRequest('http://localhost:3000/api/chat?conversationId=conv-123')
      const route = await import('@/app/api/chat/route')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.messages).toBeDefined()
      expect(Array.isArray(data.data.messages)).toBe(true)
      expect(getConversationMessages).toHaveBeenCalledWith('conv-123')
    })

    it('should return conversations list when conversationId is missing', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [
          {
            id: 'conv-1',
            organizationId: 'org-123',
            agentId: null,
            userId: 'user-123',
            leadId: null,
            title: 'Conversation 1',
            metadata: {},
            createdAt: '2025-01-26T00:00:00Z',
            updatedAt: '2025-01-26T00:00:00Z',
          },
        ],
        total: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/chat')
      const route = await import('@/app/api/chat/route')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(getConversations).toHaveBeenCalledWith('org-123', {
        agentId: null,
        userId: 'user-123',
        limit: 50,
      })
    })

    it('should filter conversations by agentId when provided', async () => {
      const { auth } = await import('@/auth')
      const { getConversations } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const agentId = '00000000-0000-4000-8000-000000000456'

      vi.mocked(getConversations).mockResolvedValue({
        conversations: [],
        total: 0,
      })

      const request = new NextRequest(`http://localhost:3000/api/chat?agentId=${agentId}`)
      const route = await import('@/app/api/chat/route')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getConversations).toHaveBeenCalledWith('org-123', {
        agentId: agentId,
        userId: 'user-123',
        limit: 50,
      })
    })

    it('should handle errors in GET request', async () => {
      const { auth } = await import('@/auth')
      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(getConversationMessages).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/chat?conversationId=conv-123')
      const route = await import('@/app/api/chat/route')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Не удалось загрузить данные')
    })
  })

  describe('POST /api/chat - edge cases', () => {
    it('should handle request with agentId', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt, processConversationMemory } = await import('@/lib/services/agent-context-builder')
      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const agentId = '00000000-0000-4000-8000-000000000456'
      
      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: agentId,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })
      
      vi.mocked(getAgentById).mockResolvedValue({
        id: agentId,
        name: 'Test Agent',
        status: 'active',
        organizationId: 'org-123',
        model: 'gpt-4',
        instructions: 'Agent instructions',
        temperature: 0.7,
        maxTokens: 2048,
        responseDelaySeconds: 0,
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        settings: {},
      } as any)

      vi.mocked(isAgentConfiguredForStage).mockResolvedValue(true)

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'Hello',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt with agent instructions')
      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'Hello! How can I help you?',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        model: 'gpt-4',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'Hello! How can I help you?',
        metadata: {
          model: 'gpt-4',
          usage: {
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          agentId: '00000000-0000-4000-8000-000000000456',
          useKnowledgeBase: false,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(getAgentById).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000456', 'org-123')
    })

    it('should handle request with clientIdentifier', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt, processConversationMemory } = await import('@/lib/services/agent-context-builder')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: null,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'Hello',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      vi.mocked(buildFullSystemPrompt).mockResolvedValue(null)
      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'Hello! How can I help you?',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        model: 'gpt-4o-mini',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'Hello! How can I help you?',
        metadata: {
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          clientIdentifier: 'user@example.com',
          useKnowledgeBase: false,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle request with useKnowledgeBase enabled', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { searchKnowledgeBase, formatKnowledgeContext } = await import('@/lib/repositories/knowledge-search')
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt, processConversationMemory } = await import('@/lib/services/agent-context-builder')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: null,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'What is your product?',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'What is your product?',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      vi.mocked(searchKnowledgeBase).mockResolvedValue([
        {
          id: 'kb-1',
          content: 'Our product is amazing',
          relevance: 0.9,
        },
      ])

      vi.mocked(formatKnowledgeContext).mockReturnValue('Knowledge: Our product is amazing')

      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt with knowledge')
      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'Our product is amazing!',
        usage: {
          promptTokens: 20,
          completionTokens: 10,
          totalTokens: 30,
        },
        model: 'gpt-4o-mini',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'Our product is amazing!',
        metadata: {
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 20,
            completionTokens: 10,
            totalTokens: 30,
          },
          usedKnowledgeBase: true,
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'What is your product?',
          useKnowledgeBase: true,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // searchKnowledgeBase вызывается только в fallback случае, когда buildFullSystemPrompt падает
      // В данном тесте buildFullSystemPrompt успешно возвращает результат, поэтому searchKnowledgeBase не вызывается
      expect(data.data.message.metadata.usedKnowledgeBase).toBe(true)
    })

    it('should handle invalid JSON in request body', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      // Создаем request с невалидным JSON
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Мокаем request.json() чтобы выбросить ошибку
      const originalJson = request.json.bind(request)
      request.json = vi.fn().mockRejectedValue(new SyntaxError('Unexpected token'))

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should return 403 when agent is not configured for pipeline stage', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { getAgentById } = await import('@/lib/repositories/agents')
      const { createKommoApiForOrg } = await import('@/lib/repositories/crm-connection')
      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const agentId = '00000000-0000-4000-8000-000000000456'

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: agentId,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {
          leadId: 12345, // leadId в metadata
        },
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getAgentById).mockResolvedValue({
        id: agentId,
        name: 'Test Agent',
        status: 'active',
        organizationId: 'org-123',
        model: 'gpt-4',
        instructions: 'Agent instructions',
        temperature: 0.7,
        maxTokens: 2048,
        responseDelaySeconds: 0,
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        settings: {},
      } as any)

      // Мокаем Kommo API для получения lead
      const mockKommoApi = {
        getLead: vi.fn().mockResolvedValue({
          id: 12345,
          pipeline_id: 'pipeline-789',
          status_id: 'stage-456',
        }),
      }
      vi.mocked(createKommoApiForOrg).mockResolvedValue(mockKommoApi as any)

      // Агент НЕ настроен для этого этапа
      vi.mocked(isAgentConfiguredForStage).mockResolvedValue(false)

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'Hello',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          agentId: agentId,
          useKnowledgeBase: false,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.error).toContain('не настроен для использования на данном этапе воронки')
    })

    it('should handle fallback when buildFullSystemPrompt fails', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { searchKnowledgeBase, formatKnowledgeContext } = await import('@/lib/repositories/knowledge-search')
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')
      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: null,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'What is your product?',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'What is your product?',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      // buildFullSystemPrompt выбрасывает ошибку
      vi.mocked(buildFullSystemPrompt).mockRejectedValue(new Error('Failed to build context'))

      // Fallback: searchKnowledgeBase должен быть вызван
      vi.mocked(searchKnowledgeBase).mockResolvedValue([
        {
          id: 'kb-1',
          content: 'Our product is amazing',
          relevance: 0.9,
        },
      ])

      vi.mocked(formatKnowledgeContext).mockReturnValue('Knowledge: Our product is amazing')
      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'Our product is amazing!',
        usage: {
          promptTokens: 20,
          completionTokens: 10,
          totalTokens: 30,
        },
        model: 'gpt-4o-mini',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'Our product is amazing!',
        metadata: {
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 20,
            completionTokens: 10,
            totalTokens: 30,
          },
          usedKnowledgeBase: true,
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'What is your product?',
          useKnowledgeBase: true,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Должен быть вызван fallback searchKnowledgeBase
      expect(searchKnowledgeBase).toHaveBeenCalled()
    })

    it('should handle fallback when both buildFullSystemPrompt and searchKnowledgeBase fail', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')
      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: null,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'What is your product?',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'What is your product?',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      // buildFullSystemPrompt выбрасывает ошибку
      vi.mocked(buildFullSystemPrompt).mockRejectedValue(new Error('Failed to build context'))

      // Fallback searchKnowledgeBase также выбрасывает ошибку
      vi.mocked(searchKnowledgeBase).mockRejectedValue(new Error('Search failed'))

      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'I can help you!',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        model: 'gpt-4o-mini',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'I can help you!',
        metadata: {
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'What is your product?',
          useKnowledgeBase: true,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Должен использоваться agentInstructions как финальный fallback
    })

    it('should handle case when searchKnowledgeBase returns empty array in fallback', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { searchKnowledgeBase, formatKnowledgeContext } = await import('@/lib/repositories/knowledge-search')
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')
      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')
      const { getAgentById } = await import('@/lib/repositories/agents')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const agentId = '00000000-0000-4000-8000-000000000456'

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: agentId,
        userId: 'user-123',
        leadId: null,
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getAgentById).mockResolvedValue({
        id: agentId,
        name: 'Test Agent',
        status: 'active',
        organizationId: 'org-123',
        model: 'gpt-4',
        instructions: 'Agent instructions',
        temperature: 0.7,
        maxTokens: 2048,
        responseDelaySeconds: 0,
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        settings: {},
      } as any)

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'What is your product?',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'What is your product?',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      // buildFullSystemPrompt выбрасывает ошибку
      vi.mocked(buildFullSystemPrompt).mockRejectedValue(new Error('Failed to build context'))

      // Fallback searchKnowledgeBase возвращает пустой массив
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'I can help you!',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        model: 'gpt-4',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'I can help you!',
        metadata: {
          model: 'gpt-4',
          usage: {
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'What is your product?',
          useKnowledgeBase: true,
          agentId: agentId,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Должен использоваться agentInstructions когда searchKnowledgeBase возвращает пустой массив
    })

    it('should handle conversation with leadId for action analysis', async () => {
      const { auth } = await import('@/auth')
      const { createConversation, addMessageToConversation, getConversationMessages } = await import(
        '@/lib/repositories/conversations',
      )
      const { generateChatResponse } = await import('@/lib/services/llm')
      const { buildFullSystemPrompt, processConversationMemory } = await import('@/lib/services/agent-context-builder')
      const { AgentActionsService } = await import('@/lib/services/agent-actions')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(createConversation).mockResolvedValue({
        id: 'conv-123',
        organizationId: 'org-123',
        agentId: null,
        userId: 'user-123',
        leadId: 12345, // leadId в conversation
        title: 'Test message',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-user-1',
        conversationId: 'conv-123',
        role: 'user',
        content: 'Hello',
        metadata: {},
        createdAt: '2025-01-26T00:00:00Z',
      })

      vi.mocked(getConversationMessages).mockResolvedValue([
        {
          id: 'msg-user-1',
          conversationId: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: {},
          createdAt: '2025-01-26T00:00:00Z',
        },
      ])

      vi.mocked(buildFullSystemPrompt).mockResolvedValue(null)
      vi.mocked(processConversationMemory).mockResolvedValue(undefined)

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'Hello! How can I help you?',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
        model: 'gpt-4o-mini',
      })

      vi.mocked(addMessageToConversation).mockResolvedValueOnce({
        id: 'msg-assistant-1',
        conversationId: 'conv-123',
        role: 'assistant',
        content: 'Hello! How can I help you?',
        metadata: {
          model: 'gpt-4o-mini',
          usage: {
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
        createdAt: '2025-01-26T00:01:00Z',
      })

      // Мокаем AgentActionsService
      const mockAnalyzeAndSuggestActions = vi.fn().mockResolvedValue([])
      const mockExecuteSuggestedAction = vi.fn().mockResolvedValue(undefined)
      vi.mocked(AgentActionsService).mockImplementation(() => ({
        analyzeAndSuggestActions: mockAnalyzeAndSuggestActions,
        executeSuggestedAction: mockExecuteSuggestedAction,
      } as any))

      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          useKnowledgeBase: false,
        }),
      })

      const route = await import('@/app/api/chat/route')
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Должен быть вызван анализ действий (асинхронно)
      // Проверяем, что AgentActionsService был создан
      expect(AgentActionsService).toHaveBeenCalled()
    })
  })
})

