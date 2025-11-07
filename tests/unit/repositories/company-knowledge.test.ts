import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    or: vi.fn(() => query),
    in: vi.fn(() => query),
    is: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    single: vi.fn(),
    rpc: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Company Knowledge Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCompanyKnowledgeForContext', () => {
    it('should return company knowledge for context', async () => {
      const mockKnowledge = [
        {
          id: 'knowledge-1',
          org_id: 'org-123',
          agent_id: 'agent-456',
          category: 'product',
          title: 'Product Info',
          content: 'Product description',
          metadata: {},
          pipeline_stage_id: null,
          is_global: true,
          priority: 10,
          usage_count: 5,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockKnowledge, error: null }).then(resolve)
        }),
        catch: vi.fn((reject) => {
          return Promise.resolve({ data: mockKnowledge, error: null }).catch(reject)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      const result = await getCompanyKnowledgeForContext('org-123', 'agent-456')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('knowledge-1')
      expect(result[0].category).toBe('product')
      expect(result[0].title).toBe('Product Info')
    })

    it('should filter by categories', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        in: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
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

      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      await getCompanyKnowledgeForContext('org-123', 'agent-456', null, ['product', 'service'])

      expect(mockQuery.in).toHaveBeenCalledWith('category', ['product', 'service'])
    })

    it('should filter by pipeline stage', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
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

      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      await getCompanyKnowledgeForContext('org-123', 'agent-456', 'stage-123')

      expect(mockQuery.or).toHaveBeenCalled()
    })

    it('should throw error on database error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
        catch: vi.fn((reject) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).catch(reject)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCompanyKnowledgeForContext } = await import('@/lib/repositories/company-knowledge')

      await expect(getCompanyKnowledgeForContext('org-123', 'agent-456')).rejects.toThrow('Не удалось загрузить знания компании')
    })
  })

  describe('getSalesScriptForStage', () => {
    it('should return sales script for stage', async () => {
      const mockScript = [
        {
          id: 'script-1',
          org_id: 'org-123',
          agent_id: 'agent-456',
          pipeline_stage_id: 'stage-123',
          title: 'Greeting Script',
          script_type: 'greeting',
          content: 'Hello, how can I help you?',
          variables: {},
          conditions: {},
          effectiveness_score: 0.9,
          usage_count: 10,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockScript, error: null }).then(resolve)
        }),
        catch: vi.fn((reject) => {
          return Promise.resolve({ data: mockScript, error: null }).catch(reject)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getSalesScriptForStage } = await import('@/lib/repositories/company-knowledge')

      const result = await getSalesScriptForStage('org-123', 'stage-123', 'greeting')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].id).toBe('script-1')
      expect(result[0].title).toBe('Greeting Script')
    })

    it('should return null if no script found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        or: vi.fn(function (this: any) {
          return this
        }),
        is: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
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

      const { getSalesScriptForStage } = await import('@/lib/repositories/company-knowledge')

      const result = await getSalesScriptForStage('org-123', 'stage-123')

      expect(result).toEqual([])
    })
  })

  describe('getObjectionResponses', () => {
    it('should return objection responses', async () => {
      const mockResponses = [
        {
          id: 'response-1',
          org_id: 'org-123',
          objection_type: 'price',
          objection_text: 'Too expensive',
          response_script: 'Let me explain the value...',
          context: {},
          effectiveness_score: 0.8,
          usage_count: 5,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
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
        limit: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockResponses, error: null }).then(resolve)
        }),
        catch: vi.fn((reject) => {
          return Promise.resolve({ data: mockResponses, error: null }).catch(reject)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getObjectionResponses } = await import('@/lib/repositories/company-knowledge')

      const result = await getObjectionResponses('org-123', 'price')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('response-1')
      expect(result[0].objectionType).toBe('price')
    })

    it('should return empty array if no responses', async () => {
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
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getObjectionResponses } = await import('@/lib/repositories/company-knowledge')

      const result = await getObjectionResponses('org-123', 'price')

      expect(result).toEqual([])
    })
  })

  describe('createCompanyKnowledge', () => {
    it('should create company knowledge', async () => {
      const mockKnowledge = {
        id: 'knowledge-new',
        org_id: 'org-123',
        agent_id: 'agent-456',
        category: 'product',
        title: 'New Knowledge',
        content: 'New content',
        metadata: {},
        pipeline_stage_id: null,
        is_global: false,
        priority: 5,
        usage_count: 0,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockKnowledge, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      const result = await createCompanyKnowledge('org-123', {
        agentId: 'agent-456',
        category: 'product',
        title: 'New Knowledge',
        content: 'New content',
      })

      expect(result.id).toBe('knowledge-new')
      expect(result.title).toBe('New Knowledge')
      expect(mockInsertChain.insert).toHaveBeenCalled()
    })

    it('should throw error on creation failure', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createCompanyKnowledge } = await import('@/lib/repositories/company-knowledge')

      await expect(
        createCompanyKnowledge('org-123', {
          category: 'product',
          title: 'New Knowledge',
          content: 'New content',
        }),
      ).rejects.toThrow()
    })
  })

  describe('incrementKnowledgeUsage', () => {
    it('should increment knowledge usage count via RPC', async () => {
      // incrementKnowledgeUsage использует supabase.rpc
      mockSupabaseClient.rpc = vi.fn(() => Promise.resolve({ data: null, error: null }))

      const { incrementKnowledgeUsage } = await import('@/lib/repositories/company-knowledge')

      await incrementKnowledgeUsage('knowledge-123')

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('increment_usage_count', {
        table_name: 'company_knowledge',
        row_id: 'knowledge-123',
      })
    })

    it('should fallback to update if RPC fails', async () => {
      // Сначала RPC возвращает ошибку
      mockSupabaseClient.rpc = vi.fn(() => Promise.resolve({ data: null, error: { message: 'RPC not found' } }))

      // Затем fallback на update
      const mockSelectChain: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: { usage_count: 5 }, error: null })),
      }

      const mockUpdateChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce(mockUpdateChain)

      const { incrementKnowledgeUsage } = await import('@/lib/repositories/company-knowledge')

      await incrementKnowledgeUsage('knowledge-123')

      expect(mockSupabaseClient.rpc).toHaveBeenCalled()
      expect(mockUpdateChain.update).toHaveBeenCalled()
    })
  })
})

