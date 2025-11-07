import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем Supabase
const createMockQuery = () => {
  const query = {
    from: vi.fn(() => query),
    insert: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    range: vi.fn(() => query),
    update: vi.fn(() => query),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Conversations Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createConversation', () => {
    it('should create conversation successfully', async () => {
      const mockConversation = {
        id: 'conv-123',
        org_id: 'org-123',
        agent_id: 'agent-456',
        user_id: 'user-789',
        lead_id: 123,
        title: 'Test Conversation',
        metadata: { key: 'value' },
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockConversation, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createConversation } = await import('@/lib/repositories/conversations')

      const result = await createConversation('org-123', {
        agentId: 'agent-456',
        userId: 'user-789',
        leadId: 123,
        title: 'Test Conversation',
      })

      expect(result.id).toBe('conv-123')
      expect(result.organizationId).toBe('org-123')
      expect(result.agentId).toBe('agent-456')
      expect(result.userId).toBe('user-789')
      expect(result.leadId).toBe(123)
      expect(result.title).toBe('Test Conversation')
      expect(mockInsertChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          org_id: 'org-123',
          agent_id: 'agent-456',
          user_id: 'user-789',
          lead_id: 123,
          title: 'Test Conversation',
        }),
      )
    })

    it('should handle null values', async () => {
      const mockConversation = {
        id: 'conv-123',
        org_id: 'org-123',
        agent_id: null,
        user_id: null,
        lead_id: null,
        title: null,
        metadata: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockConversation, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createConversation } = await import('@/lib/repositories/conversations')

      const result = await createConversation('org-123', {})

      expect(result.id).toBe('conv-123')
      expect(result.agentId).toBeNull()
      expect(result.userId).toBeNull()
      expect(result.leadId).toBeNull()
      expect(result.title).toBeNull()
    })

    it('should throw error if creation fails', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() =>
          Promise.resolve({
            data: null,
            error: { message: 'Database error', code: '23505' },
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createConversation } = await import('@/lib/repositories/conversations')

      await expect(createConversation('org-123', {})).rejects.toThrow('Не удалось создать диалог')
    })
  })

  describe('getConversations', () => {
    it('should return list of conversations', async () => {
      const mockConversations = [
        {
          id: 'conv-1',
          org_id: 'org-123',
          agent_id: 'agent-456',
          user_id: 'user-789',
          title: 'Conversation 1',
          metadata: null,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:01:00Z',
        },
        {
          id: 'conv-2',
          org_id: 'org-123',
          agent_id: 'agent-456',
          user_id: null,
          title: 'Conversation 2',
          metadata: { key: 'value' },
          created_at: '2025-01-25T00:00:00Z',
          updated_at: '2025-01-25T00:01:00Z',
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockConversations, count: 2, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversations } = await import('@/lib/repositories/conversations')

      const result = await getConversations('org-123')

      expect(result.conversations).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.conversations[0].id).toBe('conv-1')
      expect(result.conversations[1].id).toBe('conv-2')
    })

    it('should filter conversations by agentId', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], count: 0, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversations } = await import('@/lib/repositories/conversations')

      await getConversations('org-123', { agentId: 'agent-456' })

      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('agent_id', 'agent-456')
    })

    it('should filter conversations by userId', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], count: 0, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversations } = await import('@/lib/repositories/conversations')

      await getConversations('org-123', { userId: 'user-789' })

      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-789')
    })

    it('should apply limit and offset', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        range: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], count: 0, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversations } = await import('@/lib/repositories/conversations')

      await getConversations('org-123', { limit: 10, offset: 20 })

      expect(mockQuery.limit).toHaveBeenCalledWith(10)
      expect(mockQuery.range).toHaveBeenCalledWith(20, 29)
    })

    it('should return empty array on error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, count: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversations } = await import('@/lib/repositories/conversations')

      const result = await getConversations('org-123')

      expect(result.conversations).toEqual([])
      expect(result.total).toBe(0)
    })
  })

  describe('getConversationById', () => {
    it('should return conversation if found', async () => {
      const mockConversation = {
        id: 'conv-123',
        org_id: 'org-123',
        agent_id: 'agent-456',
        user_id: 'user-789',
        lead_id: null,
        title: 'Test Conversation',
        metadata: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockConversation, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationById } = await import('@/lib/repositories/conversations')

      const result = await getConversationById('conv-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('conv-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'conv-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should return null if conversation not found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationById } = await import('@/lib/repositories/conversations')

      const result = await getConversationById('non-existent', 'org-123')

      expect(result).toBeNull()
    })
  })

  describe('addMessageToConversation', () => {
    it('should add message successfully', async () => {
      const mockMessage = {
        id: 'msg-123',
        conversation_id: 'conv-123',
        role: 'user' as const,
        content: 'Hello, world!',
        metadata: { key: 'value' },
        created_at: '2025-01-26T00:00:00Z',
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockMessage, error: null })),
      }

      const mockUpdateChain = {
        from: vi.fn(() => mockUpdateChain),
        update: vi.fn(() => mockUpdateChain),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockInsertChain) // для message_logs
        .mockReturnValueOnce(mockUpdateChain) // для agent_conversations

      const { addMessageToConversation } = await import('@/lib/repositories/conversations')

      const result = await addMessageToConversation('conv-123', {
        role: 'user',
        content: 'Hello, world!',
        metadata: { key: 'value' },
      })

      expect(result.id).toBe('msg-123')
      expect(result.conversationId).toBe('conv-123')
      expect(result.role).toBe('user')
      expect(result.content).toBe('Hello, world!')
      expect(result.metadata).toEqual({ key: 'value' })
      expect(mockInsertChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          conversation_id: 'conv-123',
          role: 'user',
          content: 'Hello, world!',
          metadata: { key: 'value' },
        }),
      )
    })

    it('should throw error if message creation fails', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() =>
          Promise.resolve({
            data: null,
            error: { message: 'Database error' },
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { addMessageToConversation } = await import('@/lib/repositories/conversations')

      await expect(
        addMessageToConversation('conv-123', {
          role: 'user',
          content: 'Test',
        }),
      ).rejects.toThrow('Не удалось сохранить сообщение')
    })
  })

  describe('getConversationMessages', () => {
    it('should return messages for conversation', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          conversation_id: 'conv-123',
          role: 'user',
          content: 'Hello',
          metadata: null,
          created_at: '2025-01-26T00:00:00Z',
        },
        {
          id: 'msg-2',
          conversation_id: 'conv-123',
          role: 'assistant',
          content: 'Hi there!',
          metadata: null,
          created_at: '2025-01-26T00:01:00Z',
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(() => Promise.resolve({ data: mockMessages, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      const result = await getConversationMessages('conv-123', { limit: 10 })

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('msg-1')
      expect(result[0].role).toBe('user')
      expect(result[1].id).toBe('msg-2')
      expect(result[1].role).toBe('assistant')
      expect(mockQuery.eq).toHaveBeenCalledWith('conversation_id', 'conv-123')
    })

    it('should return empty array if no messages found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      const result = await getConversationMessages('conv-123')

      expect(result).toEqual([])
    })

    it('should apply limit and offset', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        range: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      await getConversationMessages('conv-123', { limit: 20, offset: 10 })

      expect(mockQuery.limit).toHaveBeenCalledWith(20)
      expect(mockQuery.range).toHaveBeenCalledWith(10, 29)
    })

    it('should return empty array on error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getConversationMessages } = await import('@/lib/repositories/conversations')

      const result = await getConversationMessages('conv-123')

      expect(result).toEqual([])
    })
  })
})

