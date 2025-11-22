import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем Supabase - создаем объект с методами, которые возвращают сам объект
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    insert: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    gte: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    or: vi.fn(() => query),
    is: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    lt: vi.fn(() => Promise.resolve({ data: null, error: null })),
    single: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем LLM для calculateSemanticSimilarity
vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn(),
}))

describe('Agent Memory Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveMemoryItem', () => {
    it('should save memory item successfully', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: { id: 'memory-123' }, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { saveMemoryItem } = await import('@/lib/services/agent-memory')

      const result = await saveMemoryItem(
        'org-123',
        'agent-456',
        'client@example.com',
        'fact',
        'Client prefers email communication',
      )

      expect(result).toBe('memory-123')
      expect(mockInsertChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          org_id: 'org-123',
          agent_id: 'agent-456',
          client_identifier: 'client@example.com',
          memory_type: 'fact',
          content: 'Client prefers email communication',
          importance: 5,
          confidence: 0.8,
          source: 'conversation',
        }),
      )
    })

    it('should return null if save fails', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }
      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { saveMemoryItem } = await import('@/lib/services/agent-memory')

      const result = await saveMemoryItem(
        'org-123',
        null,
        'client@example.com',
        'preference',
        'Test content',
      )

      expect(result).toBeNull()
    })

    it('should use custom importance and confidence', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: { id: 'memory-123' }, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { saveMemoryItem } = await import('@/lib/services/agent-memory')

      await saveMemoryItem(
        'org-123',
        'agent-456',
        'client@example.com',
        'fact',
        'Important fact',
        10, // importance
        0.95, // confidence
      )

      expect(mockInsertChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          importance: 10,
          confidence: 0.95,
        }),
      )
    })
  })

  describe('getClientMemory', () => {
    it('should return memory items for client', async () => {
      const mockMemories = [
        {
          id: 'memory-1',
          org_id: 'org-123',
          client_identifier: 'client@example.com',
          content: 'Memory 1',
          importance: 5,
          confidence: 0.8,
        },
        {
          id: 'memory-2',
          org_id: 'org-123',
          client_identifier: 'client@example.com',
          content: 'Memory 2',
          importance: 7,
          confidence: 0.9,
        },
      ]

      // Настраиваем цепочку вызовов (order вызывается дважды, затем await query)
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockMemories, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getClientMemory } = await import('@/lib/services/agent-memory')

      const result = await getClientMemory('org-123', 'client@example.com')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('memory-1')
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('client_identifier', 'client@example.com')
      expect(mockQuery.gte).toHaveBeenCalledWith('importance', 3)
      expect(mockQuery.gte).toHaveBeenCalledWith('confidence', 0.6)
      expect(mockQuery.order).toHaveBeenCalled()
    })

    it('should filter by agent_id if provided', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getClientMemory } = await import('@/lib/services/agent-memory')

      await getClientMemory('org-123', 'client@example.com', 'agent-456')

      expect(mockQuery.or).toHaveBeenCalled()
    })

    it('should return empty array if query fails', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getClientMemory } = await import('@/lib/services/agent-memory')

      const result = await getClientMemory('org-123', 'client@example.com')

      expect(result).toEqual([])
    })

    it('should use custom limit', async () => {
      const mockMemories = Array.from({ length: 30 }, (_, i) => ({
        id: `memory-${i}`,
        org_id: 'org-123',
        client_identifier: 'client@example.com',
        content: `Memory ${i}`,
        importance: 5,
        confidence: 0.8,
      }))

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockMemories.slice(0, 10), error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getClientMemory } = await import('@/lib/services/agent-memory')

      const result = await getClientMemory('org-123', 'client@example.com', null, 10)

      expect(mockQuery.limit).toHaveBeenCalledWith(10)
      expect(result).toHaveLength(10)
    })
  })

  describe('getMemoryContext', () => {
    it('should format memory context by type', async () => {
      const mockMemories = [
        {
          id: 'memory-1',
          org_id: 'org-123',
          client_identifier: 'client@example.com',
          memory_type: 'fact',
          content: 'Fact 1',
          importance: 5,
          confidence: 0.8,
        },
        {
          id: 'memory-2',
          memory_type: 'preference',
          content: 'Preference 1',
          importance: 7,
          confidence: 0.9,
        },
        {
          id: 'memory-3',
          memory_type: 'context',
          content: 'Context 1',
          importance: 6,
          confidence: 0.85,
        },
        {
          id: 'memory-4',
          memory_type: 'interaction',
          content: 'Interaction 1',
          importance: 4,
          confidence: 0.7,
        },
      ] as any[]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockMemories, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getMemoryContext } = await import('@/lib/services/agent-memory')

      const result = await getMemoryContext('org-123', 'client@example.com')

      expect(result.facts).toContain('Fact 1')
      expect(result.preferences).toContain('Preference 1')
      expect(result.recentContext).toContain('Context 1')
      expect(result.interactionHistory).toContain('Interaction 1')
    })

    it('should return empty context if no memories', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getMemoryContext } = await import('@/lib/services/agent-memory')

      const result = await getMemoryContext('org-123', 'client@example.com')

      expect(result.facts).toEqual([])
      expect(result.preferences).toEqual([])
      expect(result.recentContext).toEqual([])
      expect(result.interactionHistory).toEqual([])
    })
  })

  describe('formatMemoryContext', () => {
    it('should format memory context to string', async () => {
      const { formatMemoryContext } = await import('@/lib/services/agent-memory')

      const context = {
        facts: ['Fact 1', 'Fact 2'],
        preferences: ['Preference 1'],
        recentContext: ['Context 1'],
        interactionHistory: ['Interaction 1'],
      }

      const result = formatMemoryContext(context)

      expect(result).toContain('Известные факты о клиенте')
      expect(result).toContain('Fact 1')
      expect(result).toContain('Fact 2')
      expect(result).toContain('Предпочтения клиента')
      expect(result).toContain('Preference 1')
    })

    it('should return empty string for empty context', async () => {
      const { formatMemoryContext } = await import('@/lib/services/agent-memory')

      const result = formatMemoryContext({
        facts: [],
        preferences: [],
        recentContext: [],
        interactionHistory: [],
      })

      expect(result).toBe('')
    })
  })

  describe('getRelevantMemory', () => {
    it('should return relevant memories based on similarity', async () => {
      const { generateChatResponse } = await import('@/lib/services/llm')

      vi.mocked(generateChatResponse)
        .mockResolvedValueOnce({ content: '0.9', usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, model: 'test' })
        .mockResolvedValueOnce({ content: '0.5', usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, model: 'test' })

      const mockMemories = [
        {
          id: 'memory-1',
          content: 'Relevant memory',
          importance: 10,
        },
        {
          id: 'memory-2',
          content: 'Less relevant memory',
          importance: 5,
        },
      ] as any[]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockMemories, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getRelevantMemory } = await import('@/lib/services/agent-memory')

      const result = await getRelevantMemory('org-123', 'client@example.com', 'test query')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return empty array if no memories', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        gte: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getRelevantMemory } = await import('@/lib/services/agent-memory')

      const result = await getRelevantMemory('org-123', 'client@example.com', 'test query')

      expect(result).toEqual([])
    })
  })

  describe('updateMemoryImportance', () => {
    it('should update memory importance', async () => {
      const mockUpdateChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        select: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() =>
          Promise.resolve({
            data: { id: 'memory-123', importance: 8 },
            error: null,
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateMemoryImportance } = await import('@/lib/services/agent-memory')

      const result = await updateMemoryImportance('memory-123', 'org-123', 8)

      expect(result).toBe(true)
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('id', 'memory-123')
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should return false if update fails', async () => {
      const mockUpdateChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        // updateMemoryImportance не использует select().single(), только update().eq().eq()
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateMemoryImportance } = await import('@/lib/services/agent-memory')

      const result = await updateMemoryImportance('memory-123', 'org-123', 8)

      // updateMemoryImportance возвращает !error, поэтому если error есть, возвращается false
      expect(result).toBe(false)
    })
  })

  describe('cleanupExpiredMemory', () => {
    it('should delete expired memory items', async () => {
      const mockDeleteChain: any = {
        delete: vi.fn(function (this: any) {
          return this
        }),
        lt: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockDeleteChain)

      const { cleanupExpiredMemory } = await import('@/lib/services/agent-memory')

      await cleanupExpiredMemory()

      expect(mockDeleteChain.lt).toHaveBeenCalled()
    })
  })

  describe('extractAndSaveMemoryFromConversation', () => {
    it('should extract and save memory from conversation', async () => {
      const { generateChatResponse } = await import('@/lib/services/llm')

      vi.mocked(generateChatResponse).mockResolvedValue({
        content: '{"information": [{"type": "preference", "content": "Client prefers email communication", "importance": 7, "confidence": 0.9}]}',
        usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
        model: 'test',
      })

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: { id: 'memory-new' }, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { extractAndSaveMemoryFromConversation } = await import('@/lib/services/agent-memory')

      await extractAndSaveMemoryFromConversation(
        'org-123',
        'agent-456',
        'client@example.com',
        [
          { role: 'user', content: 'Hello, I prefer email communication' },
          { role: 'assistant', content: 'How can I help you?' },
        ],
      )

      // Функция должна выполниться без ошибок
      // Проверяем что generateChatResponse был вызван для извлечения информации
      expect(generateChatResponse).toHaveBeenCalled()
    })

    it('should not process conversation with less than 2 messages', async () => {
      const { extractAndSaveMemoryFromConversation } = await import('@/lib/services/agent-memory')

      await extractAndSaveMemoryFromConversation('org-123', 'agent-456', 'client@example.com', [
        { role: 'user', content: 'Hello' },
      ])

      // Функция должна вернуться раньше, не вызывая никаких операций
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })
  })
})

