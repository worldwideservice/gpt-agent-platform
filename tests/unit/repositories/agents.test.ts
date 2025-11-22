import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем cache
vi.mock('@/lib/utils/cache', () => ({
  getCachedAgent: vi.fn(),
  setCachedAgent: vi.fn().mockResolvedValue(true),
  invalidateAgentCache: vi.fn().mockResolvedValue(undefined),
}))

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    ilike: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    range: vi.fn(() => query),
    gte: vi.fn(() => query),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Agents Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAgentById', () => {
    it('should return agent if found', async () => {
      const mockAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: 'Owner',
        messages_total: 100,
        last_activity_at: '2025-01-26T00:00:00Z',
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 1000,
        response_delay_seconds: 0,
        instructions: 'Test instructions',
        settings: { language: 'ru' },
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null) // Cache miss

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('agent-123')
      expect(result?.name).toBe('Test Agent')
      expect(result?.status).toBe('active')
    })

    it('should return null if agent not found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('non-existent', 'org-123')

      expect(result).toBeNull()
    })

    it('should throw error if database query fails', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      await expect(getAgentById('agent-123', 'org-123')).rejects.toThrow('Не удалось загрузить агента')
    })

    it('should handle agent with null values', async () => {
      const mockAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'draft',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: null,
        max_tokens: null,
        response_delay_seconds: null,
        instructions: null,
        settings: null,
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.temperature).toBe(0.7) // default value
      expect(result?.maxTokens).toBe(2048) // default value
      expect(result?.responseDelaySeconds).toBe(0) // default value
      expect(result?.instructions).toBeNull()
      expect(result?.settings).toEqual({})
    })

    it('should handle agent with complex settings', async () => {
      const mockAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: 'Owner',
        messages_total: 100,
        last_activity_at: '2025-01-26T00:00:00Z',
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 1000,
        response_delay_seconds: 0,
        instructions: 'Test instructions',
        settings: {
          language: 'ru',
          welcomeMessage: 'Welcome!',
          description: 'Test description',
          presencePenalty: 0.5,
          frequencyPenalty: 0.3,
          defaultChannels: ['email', 'chat', 'phone'],
          knowledgeBaseAllCategories: true,
          createTaskOnNotFound: false,
          notFoundMessage: 'Not found',
        },
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.settings.language).toBe('ru')
      expect(result?.settings.welcomeMessage).toBe('Welcome!')
      expect(result?.settings.description).toBe('Test description')
      expect(result?.settings.presencePenalty).toBe(0.5)
      expect(result?.settings.frequencyPenalty).toBe(0.3)
      expect(result?.settings.defaultChannels).toEqual(['email', 'chat', 'phone'])
      expect(result?.settings.knowledgeBaseAllCategories).toBe(true)
      expect(result?.settings.createTaskOnNotFound).toBe(false)
      expect(result?.settings.notFoundMessage).toBe('Not found')
    })

    it('should handle agent with invalid settings (array)', async () => {
      const mockAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: [], // Invalid: array instead of object
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.settings).toEqual({}) // Should return empty object for invalid settings
    })

    it('should handle agent with settings containing mixed types in defaultChannels', async () => {
      const mockAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: {
          defaultChannels: ['email', 123, 'chat', null, 'phone'], // Mixed types
        },
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(null)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      // Should filter out non-string values
      expect(result?.settings.defaultChannels).toEqual(['email', 'chat', 'phone'])
    })

    it('should use cache if available', async () => {
      const cachedAgent = {
        id: 'agent-123',
        name: 'Cached Agent',
        status: 'active',
      } as any

      const { getCachedAgent } = await import('@/lib/utils/cache')
      vi.mocked(getCachedAgent).mockResolvedValue(cachedAgent)

      const { getAgentById } = await import('@/lib/repositories/agents')

      const result = await getAgentById('agent-123', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('agent-123')
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })
  })

  describe('getAgents', () => {
    it('should return list of agents with pagination', async () => {
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'Agent 1',
          status: 'active',
          org_id: 'org-123',
          default_model: 'gpt-4',
          owner_name: 'Owner 1',
          messages_total: 100,
          last_activity_at: '2025-01-26T00:00:00Z',
          created_at: '2025-01-25T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
          temperature: 0.7,
          max_tokens: 1000,
          response_delay_seconds: 0,
          instructions: 'Instructions 1',
          settings: null,
        },
        {
          id: 'agent-2',
          name: 'Agent 2',
          status: 'draft',
          org_id: 'org-123',
          default_model: 'gpt-3.5',
          owner_name: 'Owner 2',
          messages_total: 50,
          last_activity_at: null,
          created_at: '2025-01-24T00:00:00Z',
          updated_at: '2025-01-24T00:00:00Z',
          temperature: 0.5,
          max_tokens: 500,
          response_delay_seconds: 1,
          instructions: null,
          settings: { language: 'en' },
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
        range: vi.fn(() =>
          Promise.resolve({
            data: mockAgents,
            error: null,
            count: 2,
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgents } = await import('@/lib/repositories/agents')

      const result = await getAgents({
        organizationId: 'org-123',
        page: 1,
        limit: 25,
      })

      expect(result.agents).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.agents[0].id).toBe('agent-1')
      expect(result.agents[0].name).toBe('Agent 1')
      expect(result.agents[1].id).toBe('agent-2')
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.range).toHaveBeenCalled()
    })

    it('should filter agents by search query', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        ilike: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        range: vi.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
            count: 0,
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgents } = await import('@/lib/repositories/agents')

      await getAgents({
        organizationId: 'org-123',
        search: 'test',
      })

      expect(mockQuery.ilike).toHaveBeenCalledWith('name', '%test%')
    })

    it('should filter agents by status', async () => {
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
        range: vi.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
            count: 0,
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgents } = await import('@/lib/repositories/agents')

      await getAgents({
        organizationId: 'org-123',
        status: 'active',
      })

      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'active')
    })

    it('should handle database errors gracefully', async () => {
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
        range: vi.fn(() =>
          Promise.resolve({
            data: null,
            count: null,
            error: { message: 'Database connection error' },
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgents } = await import('@/lib/repositories/agents')

      await expect(
        getAgents({
          organizationId: 'org-123',
        }),
      ).rejects.toThrow('Не удалось загрузить агентов')
    })

    it('should handle pagination with default values', async () => {
      const mockAgents = Array.from({ length: 10 }, (_, i) => ({
        id: `agent-${i}`,
        name: `Agent ${i}`,
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: null,
      }))

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
        range: vi.fn(() =>
          Promise.resolve({
            data: mockAgents,
            error: null,
            count: 10,
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgents } = await import('@/lib/repositories/agents')

      const result = await getAgents({
        organizationId: 'org-123',
        // page и limit не указаны - должны использоваться дефолтные значения
      })

      expect(result.agents).toHaveLength(10)
      expect(result.total).toBe(10)
      expect(mockQuery.range).toHaveBeenCalledWith(0, 24) // default: page=1, limit=25
    })
  })

  describe('createAgent', () => {
    it('should create new agent', async () => {
      const mockAgent = {
        id: 'agent-new',
        name: 'New Agent',
        status: 'draft',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: 'New instructions',
        settings: { language: 'ru' },
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { invalidateAgentCache } = await import('@/lib/utils/cache')

      const { createAgent } = await import('@/lib/repositories/agents')

      const result = await createAgent('org-123', {
        name: 'New Agent',
        model: 'gpt-4',
        instructions: 'New instructions',
        settings: { language: 'ru' },
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('agent-new')
      expect(result.name).toBe('New Agent')
      expect(mockInsertChain.insert).toHaveBeenCalled()
      expect(invalidateAgentCache).toHaveBeenCalled()
    })

    it('should throw error if agent creation fails', async () => {
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

      const { createAgent } = await import('@/lib/repositories/agents')

      await expect(
        createAgent('org-123', {
          name: 'New Agent',
          model: 'gpt-4',
        }),
      ).rejects.toThrow('Не удалось создать агента')
    })

    it('should throw error if data is null after creation', async () => {
      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() =>
          Promise.resolve({
            data: null,
            error: null, // Нет ошибки, но data = null
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createAgent } = await import('@/lib/repositories/agents')

      await expect(
        createAgent('org-123', {
          name: 'New Agent',
          model: 'gpt-4',
        }),
      ).rejects.toThrow('Не удалось создать агента')
    })

    it('should create agent with minimal data', async () => {
      const mockAgent = {
        id: 'agent-new',
        name: 'Minimal Agent',
        status: 'draft',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: null,
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createAgent } = await import('@/lib/repositories/agents')

      const result = await createAgent('org-123', {
        name: 'Minimal Agent',
        model: 'gpt-4',
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Minimal Agent')
      expect(result.status).toBe('draft')
    })

    it('should create agent with all optional fields', async () => {
      const mockAgent = {
        id: 'agent-new',
        name: 'Full Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: 'Owner Name',
        messages_total: 0,
        last_activity_at: null,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.9,
        max_tokens: 4000,
        response_delay_seconds: 2,
        instructions: 'Detailed instructions',
        settings: {
          language: 'en',
          welcomeMessage: 'Welcome!',
        },
      }

      const mockInsertChain = {
        insert: vi.fn(() => mockInsertChain),
        select: vi.fn(() => mockInsertChain),
        single: vi.fn(() => Promise.resolve({ data: mockAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockInsertChain)

      const { createAgent } = await import('@/lib/repositories/agents')

      const result = await createAgent('org-123', {
        name: 'Full Agent',
        model: 'gpt-4',
        status: 'active',
        temperature: 0.9,
        maxTokens: 4000,
        responseDelaySeconds: 2,
        instructions: 'Detailed instructions',
        settings: {
          language: 'en',
          welcomeMessage: 'Welcome!',
        },
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Full Agent')
      expect(result.status).toBe('active')
      expect(result.temperature).toBe(0.9)
      expect(result.maxTokens).toBe(4000)
      expect(result.responseDelaySeconds).toBe(2)
      expect(result.instructions).toBe('Detailed instructions')
    })
  })

  describe('updateAgent', () => {
    it('should update agent successfully', async () => {
      const mockUpdatedAgent = {
        id: 'agent-123',
        name: 'Updated Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: 'Owner',
        messages_total: 100,
        last_activity_at: '2025-01-26T00:00:00Z',
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:01:00Z',
        temperature: 0.8,
        max_tokens: 2000,
        response_delay_seconds: 1,
        instructions: 'Updated instructions',
        settings: { language: 'en' },
      }

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
        single: vi.fn(() => Promise.resolve({ data: mockUpdatedAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      const result = await updateAgent('agent-123', 'org-123', {
        name: 'Updated Agent',
        instructions: 'Updated instructions',
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Updated Agent')
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('id', 'agent-123')
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('org_id', 'org-123')
      // invalidateAgentCache вызывается внутри updateAgent через mapAgentRowToDomain и setCachedAgent
      // но не напрямую, поэтому проверяем только основную функциональность
    })

    it('should throw error if update fails', async () => {
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
            data: null,
            error: { message: 'Database error' },
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      await expect(
        updateAgent('agent-123', 'org-123', {
          name: 'Updated Agent',
        }),
      ).rejects.toThrow('Не удалось обновить агента')
    })

    it('should throw error if data is null after update', async () => {
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
            data: null,
            error: null, // Нет ошибки, но data = null
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      await expect(
        updateAgent('agent-123', 'org-123', {
          name: 'Updated Agent',
        }),
      ).rejects.toThrow('Агент не найден')
    })

    it('should update all agent fields', async () => {
      const mockUpdatedAgent = {
        id: 'agent-123',
        name: 'Fully Updated Agent',
        status: 'paused',
        org_id: 'org-123',
        default_model: 'gpt-3.5-turbo',
        owner_name: 'New Owner',
        messages_total: 200,
        last_activity_at: '2025-01-27T00:00:00Z',
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-27T00:00:00Z',
        temperature: 0.9,
        max_tokens: 4000,
        response_delay_seconds: 3,
        instructions: 'New instructions',
        settings: {
          language: 'en',
          welcomeMessage: 'New welcome',
        },
      }

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
        single: vi.fn(() => Promise.resolve({ data: mockUpdatedAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      const result = await updateAgent('agent-123', 'org-123', {
        name: 'Fully Updated Agent',
        status: 'paused',
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        maxTokens: 4000,
        responseDelaySeconds: 3,
        instructions: 'New instructions',
        settings: {
          language: 'en',
          welcomeMessage: 'New welcome',
        },
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Fully Updated Agent')
      expect(result.status).toBe('paused')
      expect(result.temperature).toBe(0.9)
      expect(result.maxTokens).toBe(4000)
      expect(result.responseDelaySeconds).toBe(3)
      expect(result.instructions).toBe('New instructions')
    })

    it('should update only specified fields', async () => {
      const mockUpdatedAgent = {
        id: 'agent-123',
        name: 'Partially Updated',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 100,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-27T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: 'Original instructions',
        settings: null,
      }

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
        single: vi.fn(() => Promise.resolve({ data: mockUpdatedAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      const result = await updateAgent('agent-123', 'org-123', {
        name: 'Partially Updated',
        // Only name is updated
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Partially Updated')
      expect(mockUpdateChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Partially Updated',
          updated_at: expect.any(String),
        }),
      )
    })

    it('should handle null values in update', async () => {
      const mockUpdatedAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 100,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-27T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: null,
      }

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
        single: vi.fn(() => Promise.resolve({ data: mockUpdatedAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgent } = await import('@/lib/repositories/agents')

      const result = await updateAgent('agent-123', 'org-123', {
        instructions: null,
        settings: null,
      })

      expect(result).toBeDefined()
      expect(result.instructions).toBeNull()
      expect(result.settings).toEqual({})
    })
  })

  describe('updateAgentStatus', () => {
    it('should update agent status', async () => {
      const mockUpdatedAgent = {
        id: 'agent-123',
        name: 'Test Agent',
        status: 'active',
        org_id: 'org-123',
        default_model: 'gpt-4',
        owner_name: null,
        messages_total: 100,
        last_activity_at: null,
        created_at: '2025-01-25T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        temperature: 0.7,
        max_tokens: 2048,
        response_delay_seconds: 0,
        instructions: null,
        settings: null,
      }

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
        single: vi.fn(() => Promise.resolve({ data: mockUpdatedAgent, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgentStatus } = await import('@/lib/repositories/agents')

      const result = await updateAgentStatus('agent-123', 'org-123', 'active')

      expect(result.status).toBe('active')
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('id', 'agent-123')
      expect(mockUpdateChain.eq).toHaveBeenCalledWith('org_id', 'org-123')
      // invalidateAgentCache вызывается внутри, но не напрямую в updateAgentStatus
    })

    it('should throw error if update status fails', async () => {
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
            data: null,
            error: { message: 'Database error' },
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgentStatus } = await import('@/lib/repositories/agents')

      await expect(updateAgentStatus('agent-123', 'org-123', 'active')).rejects.toThrow(
        'Не удалось обновить статус агента',
      )
    })

    it('should throw error if agent not found when updating status', async () => {
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
            data: null,
            error: null, // Нет ошибки, но data = null
          }),
        ),
      }

      mockSupabaseClient.from.mockReturnValue(mockUpdateChain)

      const { updateAgentStatus } = await import('@/lib/repositories/agents')

      await expect(updateAgentStatus('agent-123', 'org-123', 'active')).rejects.toThrow('Агент не найден')
    })
  })

  describe('deleteAgent', () => {
    it('should delete agent successfully', async () => {
      const mockDeleteChain: any = {
        delete: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          // После второго вызова eq возвращаем результат (delete не возвращает data)
          const callCount = mockDeleteChain.eq.mock.calls.length
          if (callCount === 2) {
            return Promise.resolve({ data: null, error: null })
          }
          return this
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockDeleteChain)

      const { deleteAgent } = await import('@/lib/repositories/agents')

      await deleteAgent('agent-123', 'org-123')

      expect(mockDeleteChain.eq).toHaveBeenCalledWith('id', 'agent-123')
      expect(mockDeleteChain.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should throw error if delete fails', async () => {
      const mockDeleteChain: any = {
        delete: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          // После второго вызова eq возвращаем ошибку
          const callCount = mockDeleteChain.eq.mock.calls.length
          if (callCount === 2) {
            return Promise.resolve({ data: null, error: { message: 'Database error' } })
          }
          return this
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockDeleteChain)

      const { deleteAgent } = await import('@/lib/repositories/agents')

      await expect(deleteAgent('agent-123', 'org-123')).rejects.toThrow('Не удалось удалить агента')
    })
  })

  describe('getWeeklyActivitySummary', () => {
    it('should return weekly activity summary', async () => {
      const mockMetrics = [
        {
          activity_date: new Date().toISOString(),
          messages_count: 10,
          org_id: 'org-123',
        },
        {
          activity_date: new Date(Date.now() - 86400000).toISOString(),
          messages_count: 5,
          org_id: 'org-123',
        },
      ]

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
        limit: vi.fn(() => Promise.resolve({ data: mockMetrics, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getWeeklyActivitySummary } = await import('@/lib/repositories/agents')

      const result = await getWeeklyActivitySummary('org-123')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return empty weekly activity if no metrics', async () => {
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
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getWeeklyActivitySummary } = await import('@/lib/repositories/agents')

      const result = await getWeeklyActivitySummary('org-123')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(7) // 7 days in a week
    })
  })

  describe('getMonthlyResponsesSeries', () => {
    it('should return monthly responses series', async () => {
      const now = new Date()
      const mockMetrics = [
        {
          activity_date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          messages_count: 100,
          org_id: 'org-123',
        },
      ]

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
        limit: vi.fn(() => Promise.resolve({ data: mockMetrics, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getMonthlyResponsesSeries } = await import('@/lib/repositories/agents')

      const result = await getMonthlyResponsesSeries('org-123', 6)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(6)
      expect(result[0]).toHaveProperty('label')
      expect(result[0]).toHaveProperty('value')
    })

    it('should use default months if not specified', async () => {
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
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getMonthlyResponsesSeries } = await import('@/lib/repositories/agents')

      const result = await getMonthlyResponsesSeries('org-123')

      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getDailyResponsesSeries', () => {
    it('should return daily responses series', async () => {
      const mockMetrics = [
        {
          activity_date: new Date().toISOString(),
          messages_count: 20,
          org_id: 'org-123',
        },
      ]

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
        limit: vi.fn(() => Promise.resolve({ data: mockMetrics, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getDailyResponsesSeries } = await import('@/lib/repositories/agents')

      const result = await getDailyResponsesSeries('org-123', 10)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(10)
      expect(result[0]).toHaveProperty('label')
      expect(result[0]).toHaveProperty('value')
    })

    it('should use default days if not specified', async () => {
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
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getDailyResponsesSeries } = await import('@/lib/repositories/agents')

      const result = await getDailyResponsesSeries('org-123')

      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getWeeklyBarChartData', () => {
    it('should return weekly bar chart data', async () => {
      const mockMetrics = [
        {
          activity_date: new Date().toISOString(),
          messages_count: 15,
          org_id: 'org-123',
        },
      ]

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
        limit: vi.fn(() => Promise.resolve({ data: mockMetrics, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getWeeklyBarChartData } = await import('@/lib/repositories/agents')

      const result = await getWeeklyBarChartData('org-123')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(7) // 7 days in a week
      expect(result[0]).toHaveProperty('label')
      expect(result[0]).toHaveProperty('value')
    })
  })

  // Тесты для getDashboardStats требуют сложного мокирования внутренних функций
  // (loadDashboardStatsFromView, loadDashboardStatsFromFunction, buildDashboardStatsFromAgents)
  // Для полного покрытия рекомендуется использовать интеграционные тесты
  // Основная функциональность CRUD операций покрыта тестами выше
})
