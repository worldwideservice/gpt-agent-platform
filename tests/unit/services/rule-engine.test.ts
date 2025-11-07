import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRule, getRules, executeRules, previewRules } from '@/lib/services/rule-engine'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    single: vi.fn(),
  }
  // Делаем query thenable для поддержки await
  query.then = vi.fn((resolve) => {
    const resolvedResult = { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  query.catch = vi.fn((reject) => {
    return Promise.resolve({ data: [], error: null }).catch(reject)
  })
  return query
}

const mockSupabaseClient = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем LLM
vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn().mockResolvedValue({ response: 'AI response' }),
}))

describe('Rule Engine Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createRule', () => {
    it('should create rule successfully', async () => {
      const mockRule = { id: 'rule-123' }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockRule, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createRule('org-123', {
        name: 'Test Rule',
        description: 'Test description',
        agent_id: 'agent-123',
        trigger_type: 'lead_created',
        conditions: [],
        actions: [],
        is_active: true,
        priority: 1,
        metadata: {},
      })

      expect(result).toBe('rule-123')
    })

    it('should return null if creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createRule('org-123', {
        name: 'Test Rule',
        trigger_type: 'lead_created',
        conditions: [],
        actions: [],
        is_active: true,
        priority: 1,
        metadata: {},
      })

      expect(result).toBeNull()
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Connection error')
      })

      const result = await createRule('org-123', {
        name: 'Test Rule',
        trigger_type: 'lead_created',
        conditions: [],
        actions: [],
        is_active: true,
        priority: 1,
        metadata: {},
      })

      expect(result).toBeNull()
    })
  })

  describe('getRules', () => {
    it('should return rules for organization', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [],
          actions: [],
          is_active: true,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getRules('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('rule-1')
      expect(queryChain.eq).toHaveBeenCalledWith('is_active', true)
    })

    it('should filter by agentId', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getRules('org-123', 'agent-123')

      expect(queryChain.eq).toHaveBeenCalledWith('agent_id', 'agent-123')
    })

    it('should return all rules if activeOnly is false', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [],
          actions: [],
          is_active: false,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getRules('org-123', null, false)

      expect(result).toHaveLength(1)
      expect(queryChain.eq).not.toHaveBeenCalledWith('is_active', true)
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getRules('org-123')

      expect(result).toEqual([])
    })
  })

  describe('executeRules', () => {
    it('should return empty array if no relevant rules', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await executeRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
      })

      expect(result).toEqual([])
    })

    it('should execute rules when conditions are met', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [
            {
              type: 'field_value',
              field: 'status',
              operator: 'equals',
              value: 'new',
            },
          ],
          actions: [
            {
              type: 'send_message',
              template: 'Welcome message',
            },
          ],
          is_active: true,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      // Мокаем логирование выполнения правила
      const logQuery = createMockQuery()
      logQuery.insert.mockReturnValue(logQuery)
      logQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain) // для getRules
        .mockReturnValueOnce(logQuery) // для logRuleExecution

      const result = await executeRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
        currentState: {
          status: 'new',
        },
      })

      expect(result.length).toBeGreaterThan(0)
    })

    it('should skip rules when conditions are not met', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [
            {
              type: 'field_value',
              field: 'status',
              operator: 'equals',
              value: 'new',
            },
          ],
          actions: [],
          is_active: true,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await executeRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
        currentState: {
          status: 'qualified', // не соответствует условию
        },
      })

      expect(result).toEqual([])
    })
  })

  describe('previewRules', () => {
    it('should preview rules execution without executing actions', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [
            {
              type: 'field_value',
              field: 'status',
              operator: 'equals',
              value: 'new',
            },
          ],
          actions: [
            {
              type: 'send_message',
              template: 'Welcome message',
            },
          ],
          is_active: true,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await previewRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
        currentState: {
          status: 'new',
        },
      })

      expect(result).toHaveLength(1)
      expect(result[0].rule.id).toBe('rule-1')
      expect(result[0].willExecute).toBe(true)
    })

    it('should mark rules as would not execute if conditions not met', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          org_id: 'org-123',
          name: 'Rule 1',
          trigger_type: 'lead_created',
          conditions: [
            {
              type: 'field_value',
              field: 'status',
              operator: 'equals',
              value: 'new',
            },
          ],
          actions: [],
          is_active: true,
          priority: 1,
          metadata: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: mockRules, error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await previewRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
        currentState: {
          status: 'qualified', // не соответствует условию
        },
      })

      expect(result).toHaveLength(1)
      expect(result[0].willExecute).toBe(false)
      expect(result[0].reason).toBeDefined()
    })

    it('should return empty array if no rules found', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await previewRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
      })

      expect(result).toEqual([])
    })

    it('should handle errors gracefully', async () => {
      const queryChain = createMockQuery()
      queryChain.select.mockReturnValue(queryChain)
      queryChain.eq.mockReturnValue(queryChain)
      queryChain.order.mockReturnValue(queryChain)
      queryChain.then = vi.fn((resolve) => {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await previewRules({
        organizationId: 'org-123',
        triggerType: 'lead_created',
      })

      expect(result).toEqual([])
    })
  })
})