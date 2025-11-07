import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAgentSequences,
  getAgentSequenceById,
  createAgentSequence,
  updateAgentSequence,
  deleteAgentSequence,
  getAgentChannels,
  upsertAgentChannel,
  deleteAgentChannel,
} from '@/lib/repositories/agent-sequences'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    upsert: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Agent Sequences Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAgentSequences', () => {
    it('should return sequences for agent', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          agent_id: 'agent-123',
          name: 'Sequence 1',
          description: 'Test',
          is_active: true,
          sort_order: 1,
          settings: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
          agent_sequence_steps: [],
        },
      ]

      const queryChain = createMockQuery()
      // Первый order() возвращает queryChain, второй order() возвращает промис
      queryChain.order
        .mockReturnValueOnce(queryChain) // для первого order('sort_order')
        .mockResolvedValueOnce({ data: mockSequences, error: null }) // для второго order('created_at')

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentSequences('org-123', 'agent-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('seq-1')
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.order
        .mockReturnValueOnce(queryChain) // для первого order
        .mockResolvedValueOnce({ data: null, error: { message: 'Database error' } }) // для второго order

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // Функция выбрасывает ошибку при error, нужно это проверить
      await expect(getAgentSequences('org-123', 'agent-123')).rejects.toThrow('Не удалось загрузить цепочки')
    })
  })

  describe('getAgentSequenceById', () => {
    it('should return sequence by id', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        agent_id: 'agent-123',
        name: 'Sequence 1',
        description: 'Test',
        is_active: true,
        sort_order: 1,
        settings: {},
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        steps: [],
      }

      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentSequenceById('seq-1', 'org-123')

      expect(result).toBeDefined()
      expect(result?.id).toBe('seq-1')
    })

    it('should return null if sequence not found', async () => {
      const queryChain = createMockQuery()
      queryChain.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentSequenceById('seq-1', 'org-123')

      expect(result).toBeNull()
    })
  })

  describe('createAgentSequence', () => {
    it('should create sequence successfully', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        agent_id: 'agent-123',
        name: 'New Sequence',
        description: 'Test',
        is_active: true,
        sort_order: 1,
        settings: {},
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        agent_sequence_steps: [],
      }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockSequence, error: null })

      // Для getAgentSequenceById после создания
      const selectQuery = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.maybeSingle.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(insertQuery) // для insert sequence
        .mockReturnValueOnce(selectQuery) // для getAgentSequenceById

      const result = await createAgentSequence('org-123', 'agent-123', {
        name: 'New Sequence',
        description: 'Test',
        isActive: true,
        sortOrder: 1,
        settings: {},
        steps: [],
      })

      expect(result).toBeDefined()
      expect(result.id).toBe('seq-1')
    })

    it('should throw error if creation fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(
        createAgentSequence('org-123', 'agent-123', {
          name: 'New Sequence',
          isActive: true,
          sortOrder: 1,
          settings: {},
          steps: [],
        })
      ).rejects.toThrow()
    })
  })

  describe('updateAgentSequence', () => {
    it('should update sequence successfully', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        agent_id: 'agent-123',
        name: 'Updated Sequence',
        description: 'Updated',
        is_active: false,
        sort_order: 2,
        settings: {},
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
        steps: [],
      }

      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      // Первые два eq() возвращают queryChain, третий возвращает промис
      updateQuery.eq
        .mockReturnValueOnce(updateQuery) // для eq('id', sequenceId)
        .mockReturnValueOnce(updateQuery) // для eq('org_id', organizationId)
        .mockResolvedValueOnce({ error: null }) // для eq('agent_id', agentId)

      // Для delete старых шагов (если input.steps есть, но здесь нет steps)
      // Для getAgentSequenceById после обновления
      const selectQuery = createMockQuery()
      selectQuery.select.mockReturnValue(selectQuery)
      selectQuery.eq.mockReturnValue(selectQuery)
      selectQuery.maybeSingle.mockResolvedValue({ data: mockSequence, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(updateQuery) // для update sequence
        .mockReturnValueOnce(selectQuery) // для getAgentSequenceById

      const result = await updateAgentSequence('org-123', 'agent-123', 'seq-1', {
        name: 'Updated Sequence',
        isActive: false,
      })

      expect(result).toBeDefined()
      expect(result.name).toBe('Updated Sequence')
    })

    it('should throw error if update fails', async () => {
      const updateQuery = createMockQuery()
      updateQuery.update.mockReturnValue(updateQuery)
      updateQuery.select.mockReturnValue(updateQuery)
      updateQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(updateQuery)

      await expect(
        updateAgentSequence('org-123', 'agent-123', 'seq-1', {
          name: 'Updated',
        })
      ).rejects.toThrow()
    })
  })

  describe('deleteAgentSequence', () => {
    it('should delete sequence successfully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      // Первые два eq() возвращают queryChain, третий возвращает промис
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // для eq('id', sequenceId)
        .mockReturnValueOnce(deleteQuery) // для eq('org_id', organizationId)
        .mockResolvedValueOnce({ error: null }) // для eq('agent_id', agentId)

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteAgentSequence('org-123', 'agent-123', 'seq-1')

      expect(deleteQuery.delete).toHaveBeenCalled()
    })

    it('should throw error if delete fails', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // для eq('id', sequenceId)
        .mockReturnValueOnce(deleteQuery) // для eq('org_id', organizationId)
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // для eq('agent_id', agentId)

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteAgentSequence('org-123', 'agent-123', 'seq-1')).rejects.toThrow('Не удалось удалить цепочку')
    })
  })

  describe('getAgentChannels', () => {
    it('should return channels for agent', async () => {
      const mockChannels = [
        {
          id: 'channel-1',
          agent_id: 'agent-123',
          org_id: 'org-123',
          channel: 'email',
          is_enabled: true,
          settings: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
      ]

      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: mockChannels, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAgentChannels('org-123', 'agent-123')

      expect(result).toHaveLength(1)
      expect(result[0].channel).toBe('email')
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // Функция выбрасывает ошибку при error, нужно это проверить
      await expect(getAgentChannels('org-123', 'agent-123')).rejects.toThrow('Не удалось загрузить каналы')
    })
  })

  describe('upsertAgentChannel', () => {
    it('should upsert channel successfully', async () => {
      const mockChannel = {
        id: 'channel-1',
        agent_id: 'agent-123',
        org_id: 'org-123',
        channel: 'email',
        is_enabled: true,
        settings: {},
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const upsertQuery = createMockQuery()
      upsertQuery.upsert.mockReturnValue(upsertQuery)
      upsertQuery.select.mockReturnValue(upsertQuery)
      upsertQuery.single.mockResolvedValue({ data: mockChannel, error: null })

      mockSupabaseClient.from.mockReturnValue(upsertQuery)

      const result = await upsertAgentChannel('org-123', 'agent-123', 'email', {
        isEnabled: true,
        settings: {},
      })

      expect(result).toBeDefined()
      expect(result.channel).toBe('email')
    })

    it('should throw error if upsert fails', async () => {
      const upsertQuery = createMockQuery()
      upsertQuery.upsert.mockReturnValue(upsertQuery)
      upsertQuery.select.mockReturnValue(upsertQuery)
      upsertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(upsertQuery)

      await expect(
        upsertAgentChannel('org-123', 'agent-123', 'email', {
          isEnabled: true,
          settings: {},
        })
      ).rejects.toThrow()
    })
  })

  describe('deleteAgentChannel', () => {
    it('should delete channel successfully', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      // Первые два eq() возвращают queryChain, третий возвращает промис
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // для eq('org_id', organizationId)
        .mockReturnValueOnce(deleteQuery) // для eq('agent_id', agentId)
        .mockResolvedValueOnce({ error: null }) // для eq('channel', channel)

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await deleteAgentChannel('org-123', 'agent-123', 'email')

      expect(deleteQuery.delete).toHaveBeenCalled()
    })

    it('should throw error if delete fails', async () => {
      const deleteQuery = createMockQuery()
      deleteQuery.delete.mockReturnValue(deleteQuery)
      deleteQuery.eq
        .mockReturnValueOnce(deleteQuery) // для eq('org_id', organizationId)
        .mockReturnValueOnce(deleteQuery) // для eq('agent_id', agentId)
        .mockResolvedValueOnce({ error: { message: 'Database error' } }) // для eq('channel', channel)

      mockSupabaseClient.from.mockReturnValue(deleteQuery)

      await expect(deleteAgentChannel('org-123', 'agent-123', 'email')).rejects.toThrow()
    })
  })
})

