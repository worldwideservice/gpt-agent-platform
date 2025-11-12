import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTriggers,
  getTriggerById,
  createTrigger,
  updateTrigger,
  deleteTrigger,
  updateTriggerStatus,
} from '@/lib/repositories/triggers'

const ORGANIZATION_ID = 'org-123'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Triggers Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTriggers', () => {
    it('should return triggers for agent', async () => {
      const mockTriggers = [
        {
          id: 'trigger-1',
          org_id: ORGANIZATION_ID,
          agent_id: 'agent-123',
          name: 'Test Trigger',
          description: 'Test description',
          is_active: true,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: mockTriggers, error: null })

      // Мокаем запросы для conditions и actions
      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain) // для triggers
        .mockReturnValueOnce(conditionsQuery) // для conditions
        .mockReturnValueOnce(actionsQuery) // для actions

      const result = await getTriggers(ORGANIZATION_ID, 'agent-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('trigger-1')
      expect(result[0].name).toBe('Test Trigger')
    })

    it('should include conditions and actions', async () => {
      const mockTriggers = [
        {
          id: 'trigger-1',
          org_id: ORGANIZATION_ID,
          agent_id: 'agent-123',
          name: 'Test Trigger',
          description: null,
          is_active: true,
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const mockConditions = [
        {
          id: 'cond-1',
          trigger_id: 'trigger-1',
          condition_type: 'message_contains',
          payload: { text: 'test' },
          ordering: 1,
        },
      ]

      const mockActions = [
        {
          id: 'action-1',
          trigger_id: 'trigger-1',
          action_type: 'send_message',
          payload: { message: 'Hello' },
          ordering: 1,
        },
      ]

      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: mockTriggers, error: null })

      const conditionsQuery = createMockQuery()
      conditionsQuery.order.mockResolvedValue({ data: mockConditions, error: null })

      const actionsQuery = createMockQuery()
      actionsQuery.order.mockResolvedValue({ data: mockActions, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await getTriggers(ORGANIZATION_ID, 'agent-123')

      expect(result[0].conditions).toHaveLength(1)
      expect(result[0].conditions[0].conditionType).toBe('message_contains')
      expect(result[0].actions).toHaveLength(1)
      expect(result[0].actions[0].actionType).toBe('send_message')
    })

    it('should throw error on database error', async () => {
      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(getTriggers(ORGANIZATION_ID, 'agent-123')).rejects.toThrow('Не удалось загрузить триггеры')
    })
  })

  describe('getTriggerById', () => {
    it('should return trigger by id', async () => {
              org_id: ORGANIZATION_ID,
        org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'Test Trigger',
        description: 'Test description',
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockTrigger, error: null })

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(queryChain)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await getTriggerById(ORGANIZATION_ID, 'trigger-1', 'agent-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('trigger-1')
      expect(result?.name).toBe('Test Trigger')
    })

    it('should return null if trigger not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getTriggerById(ORGANIZATION_ID, 'trigger-1', 'agent-123')

      expect(result).toBeNull()
    })

    it('should throw error on database error', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await expect(
        getTriggerById(ORGANIZATION_ID, 'trigger-1', 'agent-123'),
      ).rejects.toThrow('Не удалось загрузить триггер')
    })
  })

  describe('createTrigger', () => {
    it('should create trigger with conditions and actions', async () => {
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'New Trigger',
        description: 'New description',
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockTrigger, error: null })

      const conditionsInsertQuery = createMockQuery()
      conditionsInsertQuery.insert.mockResolvedValue({ error: null })

      const actionsInsertQuery = createMockQuery()
      actionsInsertQuery.insert.mockResolvedValue({ error: null })

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для trigger insert
        .mockReturnValueOnce(conditionsInsertQuery) // для conditions insert
        .mockReturnValueOnce(actionsInsertQuery) // для actions insert
        .mockReturnValueOnce(conditionsQuery) // для conditions select
        .mockReturnValueOnce(actionsQuery) // для actions select

      const result = await createTrigger(ORGANIZATION_ID, 'agent-123', {
        name: 'New Trigger',
        description: 'New description',
        isActive: true,
        conditions: [
          {
            conditionType: 'message_contains',
            payload: { text: 'test' },
            ordering: 1,
          },
        ],
        actions: [
          {
            actionType: 'send_message',
            payload: { message: 'Hello' },
            ordering: 1,
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('New Trigger')
    })

    it('should create trigger without conditions and actions', async () => {
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'New Trigger',
        description: null,
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockTrigger, error: null })

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await createTrigger(ORGANIZATION_ID, 'agent-123', {
        name: 'New Trigger',
        conditions: [],
        actions: [],
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('New Trigger')
    })

    it('should throw error if trigger creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        createTrigger(ORGANIZATION_ID, 'agent-123', {
          name: 'New Trigger',
          conditions: [],
          actions: [],
        })
      ).rejects.toThrow('Не удалось создать триггер')
    })

    it('should throw error if conditions creation fails', async () => {
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'New Trigger',
        description: null,
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockTrigger, error: null })

      const conditionsInsertQuery = createMockQuery()
      conditionsInsertQuery.insert.mockResolvedValue({ error: { message: 'Database error' } })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery)
        .mockReturnValueOnce(conditionsInsertQuery)

      await expect(
        createTrigger(ORGANIZATION_ID, 'agent-123', {
          name: 'New Trigger',
          conditions: [
            {
              conditionType: 'message_contains',
              payload: { text: 'test' },
              ordering: 1,
            },
          ],
          actions: [],
        })
      ).rejects.toThrow('Не удалось создать условия триггера')
    })

    it('should throw error if actions creation fails', async () => {
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'New Trigger',
        description: null,
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockTrigger, error: null })

      // conditions пустой массив, поэтому insert не вызывается
      const actionsInsertQuery = createMockQuery()
      actionsInsertQuery.insert.mockResolvedValue({ error: { message: 'Database error' } })

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для trigger insert
        .mockReturnValueOnce(actionsInsertQuery) // для actions insert (будет вызван, так как actions.length > 0)
        .mockReturnValueOnce(conditionsQuery) // для conditions select (mapTriggerRowToDomain)
        .mockReturnValueOnce(actionsQuery) // для actions select (mapTriggerRowToDomain)

      await expect(
        createTrigger(ORGANIZATION_ID, 'agent-123', {
          name: 'New Trigger',
          conditions: [],
          actions: [
            {
              actionType: 'send_message',
              payload: { message: 'Hello' },
              ordering: 1,
            },
          ],
        })
      ).rejects.toThrow('Не удалось создать действия триггера')
    })
  })

  describe('updateTrigger', () => {
    it('should update trigger basic fields', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'Updated Trigger',
        description: 'Updated description',
        is_active: false,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // eq('id')
        .mockReturnValueOnce(updateQuery) // eq('org_id')
        .mockReturnValueOnce(updateQuery) // eq('agent_id')
      // select() возвращает объект с single(), который возвращает промис
      // Используем функцию, которая создает новый объект каждый раз при вызове
      const selectQuery: any = {
        single: vi.fn(() =>
          Promise.resolve({
            data: {
              id: mockTrigger.id,
              agent_id: mockTrigger.agent_id,
              name: mockTrigger.name,
              description: mockTrigger.description,
              is_active: mockTrigger.is_active,
              created_at: mockTrigger.created_at,
              updated_at: mockTrigger.updated_at,
            },
            error: null,
          }),
        ),
      }
      updateQuery.select.mockReturnValue(selectQuery)

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await updateTrigger('trigger-1', ORGANIZATION_ID, 'agent-123', {
        name: 'Updated Trigger',
        description: 'Updated description',
        isActive: false,
      })

      expect(result.name).toBe('Updated Trigger')
      expect(result.description).toBe('Updated description')
      expect(result.isActive).toBe(false)
    })

    it('should update trigger conditions', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'Trigger',
        description: null,
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (id)
        .mockReturnValueOnce(updateQuery) // второй eq (agent_id)
      // select() возвращает объект с single(), который возвращает промис
      // Используем функцию, которая создает новый объект каждый раз при вызове
      const selectQuery: any = {
        single: vi.fn(() =>
          Promise.resolve({
            data: {
              id: mockTrigger.id,
              agent_id: mockTrigger.agent_id,
              name: mockTrigger.name,
              description: mockTrigger.description,
              is_active: mockTrigger.is_active,
              created_at: mockTrigger.created_at,
              updated_at: mockTrigger.updated_at,
            },
            error: null,
          }),
        ),
      }
      updateQuery.select.mockReturnValue(selectQuery)

      const deleteConditionsQuery = createMockQuery()
      deleteConditionsQuery.delete.mockReturnValue(deleteConditionsQuery)
      deleteConditionsQuery.eq.mockResolvedValue({ error: null })

      const insertConditionsQuery = createMockQuery()
      insertConditionsQuery.insert.mockResolvedValue({ error: null })

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(deleteConditionsQuery)
        .mockReturnValueOnce(insertConditionsQuery)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await updateTrigger('trigger-1', ORGANIZATION_ID, 'agent-123', {
        conditions: [
          {
            conditionType: 'message_contains',
            payload: { text: 'updated' },
            ordering: 1,
          },
        ],
      })

      expect(result).toBeDefined()
    })

    it('should throw error if trigger update fails', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (id)
        .mockReturnValueOnce(updateQuery) // второй eq (agent_id)
      const selectQuery = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })
      updateQuery.select.mockReturnValue(selectQuery)

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(updateTrigger('trigger-1', ORGANIZATION_ID, 'agent-123', { name: 'Updated' })).rejects.toThrow('Не удалось обновить триггер')
    })

    it('should throw error if trigger not found', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (id)
        .mockReturnValueOnce(updateQuery) // второй eq (agent_id)
      const selectQuery = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: null })
      updateQuery.select.mockReturnValue(selectQuery)

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(updateTrigger('trigger-1', ORGANIZATION_ID, 'agent-123', { name: 'Updated' })).rejects.toThrow('Триггер не найден')
    })
  })

  describe('deleteTrigger', () => {
    it('should delete trigger successfully', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
      // deleteTrigger вызывает: from().delete().eq('id', triggerId).eq('agent_id', agentId)
      // Второй eq должен вернуть Promise с результатом { error: null }
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      
      // Первый eq возвращает query, второй eq возвращает Promise
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // eq('id')
        .mockReturnValueOnce(deleteQuery) // eq('org_id')
        .mockResolvedValueOnce({ error: null }) // eq('agent_id') возвращает Promise

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteTrigger(ORGANIZATION_ID, 'trigger-1', 'agent-123')

      expect(deleteQuery.delete).toHaveBeenCalled()
      expect(deleteQuery.eq).toHaveBeenCalledWith('id', 'trigger-1')
      expect(deleteQuery.eq).toHaveBeenCalledWith('org_id', ORGANIZATION_ID)
      expect(deleteQuery.eq).toHaveBeenCalledWith('agent_id', 'agent-123')
    })

    it('should throw error if delete fails', async () => {
      // Очищаем mockSupabaseClient.from перед тестом (mockReset очищает mockReturnValueOnce)
      mockSupabaseClient.from.mockReset()
      
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery)
        .mockReturnValueOnce(deleteQuery)
        .mockResolvedValueOnce({ error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteTrigger(ORGANIZATION_ID, 'trigger-1', 'agent-123')).rejects.toThrow('Не удалось удалить триггер')
    })
  })

  describe('updateTriggerStatus', () => {
    it('should update trigger status to active', async () => {
      // Очищаем только mockSupabaseClient.from, чтобы избежать влияния других тестов
      mockSupabaseClient.from.mockClear()
      
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'Trigger',
        description: null,
        is_active: true,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      // Очищаем все моки перед настройкой
      updateQuery.update.mockClear()
      updateQuery.select.mockClear()
      updateQuery.eq.mockClear()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (id)
        .mockReturnValueOnce(updateQuery) // второй eq (agent_id)
      // select() возвращает объект с single(), который возвращает промис
      // Используем функцию, которая создает новый объект каждый раз при вызове
      const selectQuery: any = {
        single: vi.fn(() =>
          Promise.resolve({
            data: {
              id: mockTrigger.id,
              agent_id: mockTrigger.agent_id,
              name: mockTrigger.name,
              description: mockTrigger.description,
              is_active: mockTrigger.is_active,
              created_at: mockTrigger.created_at,
              updated_at: mockTrigger.updated_at,
            },
            error: null,
          }),
        ),
      }
      updateQuery.select.mockReturnValue(selectQuery)

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await updateTriggerStatus(ORGANIZATION_ID, 'trigger-1', 'agent-123', true)

      expect(result.isActive).toBe(true)
      expect(updateQuery.update).toHaveBeenCalledWith({ is_active: true })
    })

    it('should update trigger status to inactive', async () => {
      // Очищаем только mockSupabaseClient.from, чтобы избежать влияния других тестов
      mockSupabaseClient.from.mockClear()
      
              org_id: ORGANIZATION_ID,
        agent_id: 'agent-123',
        name: 'Trigger',
        description: null,
        is_active: false,
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const updateQuery = createMockQuery()
      // Очищаем все моки перед настройкой
      updateQuery.update.mockClear()
      updateQuery.select.mockClear()
      updateQuery.eq.mockClear()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // первый eq (id)
        .mockReturnValueOnce(updateQuery) // второй eq (agent_id)
      // select() возвращает объект с single(), который возвращает промис
      // Используем функцию, которая создает новый объект каждый раз при вызове
      // Используем явное значение false для is_active, чтобы гарантировать правильность
      const selectQuery: any = {
        single: vi.fn(() =>
          Promise.resolve({
            data: {
              id: 'trigger-1',
              agent_id: 'agent-123',
              name: 'Trigger',
              description: null,
              is_active: false, // Явное значение false
              created_at: '2025-01-26T00:00:00Z',
              updated_at: '2025-01-26T00:00:00Z',
            },
            error: null,
          }),
        ),
      }
      updateQuery.select.mockReturnValue(selectQuery)

      const conditionsQuery = createMockQuery()
      conditionsQuery.select.mockReturnValue(conditionsQuery)
      conditionsQuery.eq.mockReturnValue(conditionsQuery)
      conditionsQuery.order.mockReturnValue(conditionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      conditionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      const actionsQuery = createMockQuery()
      actionsQuery.select.mockReturnValue(actionsQuery)
      actionsQuery.eq.mockReturnValue(actionsQuery)
      actionsQuery.order.mockReturnValue(actionsQuery)
      // Когда вызывается await на queryChain, возвращаем промис
      actionsQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(conditionsQuery)
        .mockReturnValueOnce(actionsQuery)

      const result = await updateTriggerStatus(ORGANIZATION_ID, 'trigger-1', 'agent-123', false)

      expect(result.isActive).toBe(false)
      expect(updateQuery.update).toHaveBeenCalledWith({ is_active: false })
    })
  })
})

