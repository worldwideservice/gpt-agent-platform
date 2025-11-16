import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем все зависимости
vi.mock('@/lib/repositories/company-knowledge', () => ({
  getCompanyKnowledgeForContext: vi.fn(),
  getSalesScriptForStage: vi.fn(),
  getObjectionResponses: vi.fn(),
}))

vi.mock('@/lib/services/knowledge-graph', () => ({
  getRelatedEntities: vi.fn(),
}))

vi.mock('@/lib/repositories/knowledge-search', () => ({
  searchKnowledgeBase: vi.fn(),
}))

vi.mock('@/lib/services/agent-memory', () => ({
  getMemoryContext: vi.fn(),
  formatMemoryContext: vi.fn((memory) => memory ? 'Formatted memory' : ''),
  extractAndSaveMemoryFromConversation: vi.fn(),
}))

describe('Agent Context Builder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('buildAgentContext', () => {
    it('should build context with all components', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')
      const { getMemoryContext } = await import('@/lib/services/agent-memory')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([
        {
          id: '1',
          title: 'Product Info',
          content: 'Product description',
          category: 'product',
          organizationId: 'org-123',
        },
      ])

      vi.mocked(getSalesScriptForStage).mockResolvedValue([
        {
          id: '1',
          title: 'Greeting Script',
          content: 'Hello!',
          scriptType: 'greeting',
          variables: {},
          organizationId: 'org-123',
        },
      ])

      vi.mocked(getObjectionResponses).mockResolvedValue([
        {
          id: '1',
          objectionType: 'price',
          response: 'Price response',
          organizationId: 'org-123',
        },
      ])

      vi.mocked(searchKnowledgeBase).mockResolvedValue([
        {
          id: '1',
          content: 'Knowledge chunk',
          score: 0.9,
          metadata: {},
        },
      ])

      vi.mocked(getMemoryContext).mockResolvedValue({
        facts: ['Client prefers email'],
        preferences: ['Fast response'],
        recentContext: [],
        interactionHistory: [],
      })

      const { buildAgentContext } = await import('@/lib/services/agent-context-builder')

      const result = await buildAgentContext({
        organizationId: 'org-123',
        agentId: 'agent-456',
        pipelineStageId: 'stage-789',
        userMessage: 'Hello, I need help',
        clientIdentifier: 'client@example.com',
      })

      expect(result).toBeDefined()
      expect(result.companyKnowledge).toContain('Знания о компании')
      expect(result.salesScripts).toContain('Скрипты продаж')
      expect(result.objectionResponses).toContain('Работа с возражениями')
      expect(result.vectorSearch).toBeDefined()
      expect(result.clientMemory).toBeDefined()
    })

    it('should handle empty knowledge base', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { buildAgentContext } = await import('@/lib/services/agent-context-builder')

      const result = await buildAgentContext({
        organizationId: 'org-123',
        agentId: null,
      })

      expect(result).toBeDefined()
      expect(result.companyKnowledge).toBe('')
      expect(result.salesScripts).toBe('')
      expect(result.objectionResponses).toBe('')
    })

    it('should extract entities from user message', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { buildAgentContext } = await import('@/lib/services/agent-context-builder')

      const result = await buildAgentContext({
        organizationId: 'org-123',
        agentId: null,
        userMessage: 'Hello, my name is John and I work with Maria',
      })

      expect(result.knowledgeGraph).toContain('Упомянутые сущности')
      expect(result.knowledgeGraph).toContain('John')
      expect(result.knowledgeGraph).toContain('Maria')
    })

    it('should not include memory when clientIdentifier is not provided', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { getMemoryContext } = await import('@/lib/services/agent-memory')

      const { buildAgentContext } = await import('@/lib/services/agent-context-builder')

      await buildAgentContext({
        organizationId: 'org-123',
        agentId: null,
      })

      expect(getMemoryContext).not.toHaveBeenCalled()
    })
  })

  describe('buildFullSystemPrompt', () => {
    it('should build full system prompt with agent instructions', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')

      const result = await buildFullSystemPrompt({
        organizationId: 'org-123',
        agentId: 'agent-456',
        userMessage: 'Hello',
        agentInstructions: 'You are a helpful assistant',
      })

      expect(result).toBeDefined()
      expect(result).toContain('You are a helpful assistant')
    })

    it('should handle missing agent instructions', async () => {
      const { getCompanyKnowledgeForContext, getSalesScriptForStage, getObjectionResponses } = await import(
        '@/lib/repositories/company-knowledge',
      )
      const { searchKnowledgeBase } = await import('@/lib/repositories/knowledge-search')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { buildFullSystemPrompt } = await import('@/lib/services/agent-context-builder')

      const result = await buildFullSystemPrompt({
        organizationId: 'org-123',
        agentId: null,
        userMessage: 'Hello',
      })

      expect(result).toBeDefined()
    })
  })

  describe('processConversationMemory', () => {
    it('should process conversation and save memory', async () => {
      const { extractAndSaveMemoryFromConversation } = await import('@/lib/services/agent-memory')

      vi.mocked(extractAndSaveMemoryFromConversation).mockResolvedValue(undefined)

      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')

      await processConversationMemory({
        organizationId: 'org-123',
        agentId: 'agent-456',
        clientIdentifier: 'client@example.com',
        conversationMessages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      })

      expect(extractAndSaveMemoryFromConversation).toHaveBeenCalledWith(
        'org-123',
        'agent-456',
        'client@example.com',
        expect.arrayContaining([
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ]),
      )
    })

    it('should not process conversation with less than 2 messages', async () => {
      const { extractAndSaveMemoryFromConversation } = await import('@/lib/services/agent-memory')

      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')

      await processConversationMemory({
        organizationId: 'org-123',
        agentId: null,
        clientIdentifier: 'client@example.com',
        conversationMessages: [
          { role: 'user', content: 'Test' }, // Только 1 сообщение - недостаточно
        ],
      })

      expect(extractAndSaveMemoryFromConversation).not.toHaveBeenCalled()
    })

    it('should not process conversation without clientIdentifier', async () => {
      const { extractAndSaveMemoryFromConversation } = await import('@/lib/services/agent-memory')

      const { processConversationMemory } = await import('@/lib/services/agent-context-builder')

      await processConversationMemory({
        organizationId: 'org-123',
        agentId: null,
        conversationMessages: [
          { role: 'user', content: 'Test' },
          { role: 'assistant', content: 'Response' },
        ],
      })

      expect(extractAndSaveMemoryFromConversation).not.toHaveBeenCalled()
    })
  })
})

