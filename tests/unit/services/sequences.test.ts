import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSequence, getSequences, startSequence } from '@/lib/services/sequences'

// Мокаем Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}
  
  // Все методы возвращают query для поддержки цепочки
  query.from = vi.fn().mockImplementation(() => query)
  query.select = vi.fn().mockImplementation(() => query)
  query.insert = vi.fn().mockImplementation(() => query)
  query.update = vi.fn().mockImplementation(() => query)
  query.delete = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.order = vi.fn().mockImplementation(() => query)
  query.single = vi.fn()
  
  // Делаем query thenable для поддержки .then() и async/await
  query.then = vi.fn((resolve) => {
    const resolvedResult = result || { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  
  query.catch = vi.fn((reject) => {
    return Promise.resolve(result || { data: [], error: null }).catch(reject)
  })
  
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем activity-logger
vi.mock('@/lib/services/activity-logger', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

// Мокаем scheduleNextStep (внутренняя функция)
vi.mock('@/lib/services/sequences', async () => {
  const actual = await vi.importActual('@/lib/services/sequences')
  return {
    ...actual,
    scheduleNextStep: vi.fn().mockResolvedValue(undefined),
  }
})

describe('Sequences Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createSequence', () => {
    it('should create sequence successfully', async () => {
      const mockSequence = { id: 'seq-123' }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для sequence insert
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ error: null }),
        }) // для steps insert

      const result = await createSequence('org-123', {
        name: 'Test Sequence',
        description: 'Test description',
        agent_id: 'agent-123',
        trigger_type: 'manual',
        is_active: true,
        steps: [
          {
            step_order: 1,
            delay_minutes: 0,
            action_type: 'send_message',
            metadata: {},
          },
        ],
        metadata: {},
      })

      expect(result).toBe('seq-123')
    })

    it('should create sequence without steps', async () => {
      const mockSequence = { id: 'seq-123' }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createSequence('org-123', {
        name: 'Test Sequence',
        trigger_type: 'manual',
        is_active: true,
        steps: [],
        metadata: {},
      })

      expect(result).toBe('seq-123')
    })

    it('should return null if sequence creation fails', async () => {
      const insertQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await createSequence('org-123', {
        name: 'Test Sequence',
        trigger_type: 'manual',
        is_active: true,
        steps: [],
        metadata: {},
      })

      expect(result).toBeNull()
    })

    it('should return null if steps creation fails', async () => {
      const mockSequence = { id: 'seq-123' }

      const insertQuery = createMockQuery({ data: mockSequence, error: null })
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      const deleteQuery = createMockQuery({ data: null, error: null })
      deleteQuery.delete.mockImplementation(() => deleteQuery)
      deleteQuery.eq.mockImplementation(() => deleteQuery)

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для sequence insert
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ error: { message: 'Steps error' } }),
        }) // для steps insert (ошибка)
        .mockReturnValueOnce(deleteQuery) // для delete sequence

      const result = await createSequence('org-123', {
        name: 'Test Sequence',
        trigger_type: 'manual',
        is_active: true,
        steps: [
          {
            step_order: 1,
            delay_minutes: 0,
            action_type: 'send_message',
            metadata: {},
          },
        ],
        metadata: {},
      })

      expect(result).toBeNull()
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Connection error')
      })

      const result = await createSequence('org-123', {
        name: 'Test Sequence',
        trigger_type: 'manual',
        is_active: true,
        steps: [],
        metadata: {},
      })

      expect(result).toBeNull()
    })
  })

  describe('getSequences', () => {
    it('should return sequences for organization', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          name: 'Sequence 1',
          steps: [],
        },
      ]

      const queryChain = createMockQuery({ data: mockSequences, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getSequences('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('seq-1')
    })

    it('should filter by agentId', async () => {
      const queryChain = createMockQuery({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getSequences('org-123', 'agent-123')

      // Проверяем, что eq был вызван для agent_id
      expect(queryChain.eq).toHaveBeenCalledWith('agent_id', 'agent-123')
    })

    it('should filter by activeOnly', async () => {
      const queryChain = createMockQuery({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getSequences('org-123', null, true)

      // Проверяем, что eq был вызван для is_active
      expect(queryChain.eq).toHaveBeenCalledWith('is_active', true)
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getSequences('org-123')

      expect(result).toEqual([])
    })
  })

  describe('startSequence', () => {
    it('should start sequence successfully', async () => {
      const mockSequence = {
        id: 'seq-123',
        org_id: 'org-123',
        name: 'Test Sequence',
        is_active: true,
        agent_id: 'agent-123',
        steps: [
          {
            id: 'step-1',
            sequence_id: 'seq-123',
            step_order: 1,
            delay_minutes: 0,
            action_type: 'send_message',
          },
        ],
      }

      const mockExecution = { id: 'exec-123' }

      const selectQuery = createMockQuery({ data: mockSequence, error: null })
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      const insertQuery = createMockQuery({ data: mockExecution, error: null })
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockExecution, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для select sequence
        .mockReturnValueOnce(insertQuery) // для insert execution

      const result = await startSequence('seq-123', 'org-123', 'lead-123')

      expect(result).toBe('exec-123')
    })

    it('should return null if sequence not found', async () => {
      const selectQuery = createMockQuery({ data: null, error: { message: 'Not found' } })
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await startSequence('seq-123', 'org-123', 'lead-123')

      expect(result).toBeNull()
    })

    it('should return null if sequence is inactive', async () => {
      const mockSequence = {
        id: 'seq-123',
        org_id: 'org-123',
        name: 'Test Sequence',
        is_active: false,
        agent_id: null,
        steps: [],
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await startSequence('seq-123', 'org-123', 'lead-123')

      expect(result).toBeNull()
    })

    it('should return null if execution creation fails', async () => {
      const mockSequence = {
        id: 'seq-123',
        org_id: 'org-123',
        name: 'Test Sequence',
        is_active: true,
        agent_id: null,
        steps: [],
      }

      const selectQuery = createMockQuery({ data: mockSequence, error: null })
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      const insertQuery = createMockQuery({ data: null, error: { message: 'Insert error' } })
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Insert error' } })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(insertQuery)

      const result = await startSequence('seq-123', 'org-123', 'lead-123')

      expect(result).toBeNull()
    })
  })
})

