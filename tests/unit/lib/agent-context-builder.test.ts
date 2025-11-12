import { beforeEach, describe, expect, it, vi } from 'vitest'

// Мокаем кэш, чтобы не требовался реальный Redis в тестах
vi.mock('@/lib/cache', () => {
  const memory = new Map<string, unknown>()

  return {
    cached: vi.fn(async <T>(key: string, fn: () => Promise<T>) => {
      if (memory.has(key)) {
        return memory.get(key) as T
      }
      const result = await fn()
      memory.set(key, result)
      return result
    }),
    cacheConfig: {
      agentContextStatic: 60,
      agentKnowledgeGraph: 60,
      agentInstructions: 60,
      aiConfig: 60,
    },
    cacheKeys: {
      agentStaticContext: (
        orgId: string,
        agentId: string | null,
        stageId: string | null,
      ) => `agent-context:${orgId}:${agentId ?? 'global'}:${stageId ?? 'all'}`,
      agentKnowledgeGraph: (orgId: string, hash: string) =>
        `agent-kg:${orgId}:${hash}`,
      agentInstructions: (orgId: string, agentId: string) =>
        `agent-instructions:${orgId}:${agentId}`,
      aiConfig: (orgId: string) => `ai-config:${orgId}`,
    },
    cache: {
      get: vi.fn(),
      set: vi.fn(),
      delPattern: vi.fn(),
    },
  }
})

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
  formatMemoryContext: vi.fn((memory) =>
    memory
      ? `Факты: ${(memory.facts ?? []).join(', ')}\nПредпочтения: ${(memory.preferences ?? []).join(', ')}`
      : '',
  ),
  extractAndSaveMemoryFromConversation: vi.fn(),
}))

describe('Agent Context Builder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('buildAgentContext', () => {
    it('строит расширенный контекст агента со всеми компонентами', async () => {
      const {
        getCompanyKnowledgeForContext,
        getSalesScriptForStage,
        getObjectionResponses,
      } = await import('@/lib/repositories/company-knowledge')
      const { getRelatedEntities } = await import(
        '@/lib/services/knowledge-graph'
      )
      const { searchKnowledgeBase } = await import(
        '@/lib/repositories/knowledge-search'
      )
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
          content: 'Hello, {{client}}!',
          scriptType: 'greeting',
          variables: { client: 'string' },
          organizationId: 'org-123',
        },
      ])

      vi.mocked(getObjectionResponses).mockResolvedValue([
        {
          id: '1',
          objectionType: 'price',
          responseScript: 'Price response',
          organizationId: 'org-123',
        },
      ])

      vi.mocked(getRelatedEntities).mockResolvedValue([
        {
          id: 'ent-1',
          name: 'Company ABC',
          type: 'organization',
          relationships: [{ type: 'provides', target: 'Product X' }],
        },
      ])

      vi.mocked(searchKnowledgeBase).mockResolvedValue([
        {
          id: 'chunk-1',
          content: 'Knowledge chunk',
          similarity: 0.92,
          metadata: { articleTitle: 'Doc 1' },
        },
      ])

      vi.mocked(getMemoryContext).mockResolvedValue({
        facts: ['Клиент любит быстрые ответы'],
        preferences: ['Связь через email'],
        recentContext: [],
        interactionHistory: [],
      })

      const { buildAgentContext } = await import(
        '@/lib/services/agent-context-builder'
      )

      const context = await buildAgentContext({
        organizationId: 'org-123',
        agentId: 'agent-456',
        pipelineStageId: 'stage-789',
        userMessage: 'Расскажите про Company ABC',
        clientIdentifier: 'client@example.com',
        scriptContext: {
          agentName: 'Анна',
          customVariables: { client: 'Иван' },
          crmData: {},
        },
        agentInstructions: 'Всегда упоминай выгоды продукта.',
      })

      expect(context.companyKnowledge).toContain('Знания о компании')
      expect(context.salesScripts).toContain('Скрипты продаж')
      expect(context.objectionResponses).toContain('Работа с возражениями')
      expect(context.vectorSearch).toContain('Релевантная информация')
      expect(context.knowledgeGraph).toContain('Связанные сущности')
      expect(context.agentMemory).toContain(
        'Факты: Клиент любит быстрые ответы',
      )
      expect(context.instructions).toBe('Всегда упоминай выгоды продукта.')
    })

    it('не добавляет память, если не указан идентификатор клиента', async () => {
      const {
        getCompanyKnowledgeForContext,
        getSalesScriptForStage,
        getObjectionResponses,
      } = await import('@/lib/repositories/company-knowledge')
      const { searchKnowledgeBase } = await import(
        '@/lib/repositories/knowledge-search'
      )
      const { getMemoryContext } = await import('@/lib/services/agent-memory')

      vi.mocked(getCompanyKnowledgeForContext).mockResolvedValue([])
      vi.mocked(getSalesScriptForStage).mockResolvedValue([])
      vi.mocked(getObjectionResponses).mockResolvedValue([])
      vi.mocked(searchKnowledgeBase).mockResolvedValue([])

      const { buildAgentContext } = await import(
        '@/lib/services/agent-context-builder'
      )

      await buildAgentContext({
        organizationId: 'org-123',
        agentId: 'agent-456',
        userMessage: 'Привет',
      })

      expect(getMemoryContext).not.toHaveBeenCalled()
    })
  })

  describe('composeSystemPrompt', () => {
    it('формирует системный промпт из инструкций и контекста', async () => {
      const { composeSystemPrompt } = await import(
        '@/lib/services/agent-context-builder'
      )

      const prompt = composeSystemPrompt(
        {
          companyKnowledge: '## Знания\n',
          salesScripts: '## Скрипты\n',
          objectionResponses: '',
          knowledgeGraph: '',
          vectorSearch: '',
          agentMemory: '',
          clientMemory: '',
          instructions: 'Всегда вежливо приветствуй.',
        },
        'Ты — лучший ассистент.',
      )

      expect(prompt).toContain('Ты — лучший ассистент.')
      expect(prompt).toContain('## Знания')
      expect(prompt).toContain('## Скрипты')
      expect(prompt).toContain('Критические правила поведения')
    })
  })

  describe('processConversationMemory', () => {
    it('сохраняет память из разговора, если достаточно сообщений', async () => {
      const { extractAndSaveMemoryFromConversation } = await import(
        '@/lib/services/agent-memory'
      )
      const { processConversationMemory } = await import(
        '@/lib/services/agent-context-builder'
      )

      vi.mocked(extractAndSaveMemoryFromConversation).mockResolvedValue(
        undefined,
      )

      await processConversationMemory({
        organizationId: 'org-123',
        agentId: 'agent-456',
        clientIdentifier: 'client@example.com',
        conversationMessages: [
          { role: 'user', content: 'Привет' },
          { role: 'assistant', content: 'Здравствуйте!' },
        ],
      })

      expect(extractAndSaveMemoryFromConversation).toHaveBeenCalled()
    })

    it('не сохраняет память при отсутствии идентификатора клиента', async () => {
      const { extractAndSaveMemoryFromConversation } = await import(
        '@/lib/services/agent-memory'
      )
      const { processConversationMemory } = await import(
        '@/lib/services/agent-context-builder'
      )

      await processConversationMemory({
        organizationId: 'org-123',
        agentId: 'agent-456',
        conversationMessages: [
          { role: 'user', content: 'Привет' },
          { role: 'assistant', content: 'Здравствуйте!' },
        ],
      })

      expect(extractAndSaveMemoryFromConversation).not.toHaveBeenCalled()
    })
  })
})
