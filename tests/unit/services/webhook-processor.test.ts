import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveWebhookEvent, processWebhookEvent, getEventsForRetry } from '@/lib/services/webhook-processor'

// Мокаем Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}
  
  // Все методы возвращают query для поддержки цепочки
  query.from = vi.fn().mockImplementation(() => query)
  query.select = vi.fn().mockImplementation(() => query)
  query.insert = vi.fn().mockImplementation(() => query)
  query.update = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.lte = vi.fn().mockImplementation(() => query)
  query.lt = vi.fn().mockImplementation(() => query)
  query.in = vi.fn().mockImplementation(() => query)
  query.order = vi.fn().mockImplementation(() => query)
  query.limit = vi.fn().mockImplementation(() => query)
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

const mockSupabaseClient: any = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем зависимости
vi.mock('@/lib/services/rule-engine', () => ({
  executeRules: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/services/sequences', () => ({
  startSequence: vi.fn().mockResolvedValue('exec-123'),
}))

vi.mock('@/lib/queue', () => ({
  addJobToQueue: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/services/activity-logger', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/repositories/crm-connection', () => ({
  getCrmConnectionData: vi.fn().mockResolvedValue({
    connection: {
      id: 'conn-1',
      org_id: 'org-123',
      provider: 'kommo',
      base_domain: 'test.kommo.com',
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_at: null,
    },
    credentials: null,
  }),
}))

vi.mock('@/lib/crm/kommo', () => {
  const mockKommoAPI = {
    getLead: vi.fn(),
    getContact: vi.fn(),
  }
  return {
    KommoAPI: vi.fn(() => mockKommoAPI),
  }
})

describe('Webhook Processor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveWebhookEvent', () => {
    it('should save webhook event successfully', async () => {
      const mockEvent = { id: 'event-123' }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await saveWebhookEvent('org-123', 'kommo', 'leads', { key: 'value' })

      expect(result).toBe('event-123')
      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          org_id: 'org-123',
          provider: 'kommo',
          event_type: 'leads',
          status: 'pending',
          retry_count: 0,
          max_retries: 3,
        })
      )
    })

    it('should save webhook event with metadata', async () => {
      const mockEvent = { id: 'event-123' }

      const insertQuery = createMockQuery()
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await saveWebhookEvent('org-123', 'kommo', 'leads', { key: 'value' }, {
        eventSubtype: 'lead_created',
        entityId: 'lead-123',
        entityType: 'leads',
      })

      expect(result).toBe('event-123')
      expect(insertQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_subtype: 'lead_created',
          entity_id: 'lead-123',
          entity_type: 'leads',
        })
      )
    })

    it('should throw error if save fails', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockImplementation(() => insertQuery)
      insertQuery.select.mockImplementation(() => insertQuery)
      insertQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      await expect(saveWebhookEvent('org-123', 'kommo', 'leads', {})).rejects.toThrow('Failed to save webhook event')
    })
  })

  describe('processWebhookEvent', () => {
    it('should return false if event not found', async () => {
      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await processWebhookEvent('event-123')

      expect(result).toBe(false)
    })

    it('should return false if event is already processing', async () => {
      const mockEvent = {
        id: 'event-123',
        org_id: 'org-123',
        event_type: 'leads',
        event_subtype: 'lead_created',
        status: 'processing',
        payload: {},
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await processWebhookEvent('event-123')

      expect(result).toBe(false)
    })

    it('should process lead event successfully', async () => {
      const mockEvent = {
        id: 'event-123',
        org_id: 'org-123',
        event_type: 'leads',
        event_subtype: 'lead_created',
        status: 'pending',
        payload: { lead_id: 123 },
        entity_id: 'lead-123',
        entity_type: 'leads',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для select event
        .mockReturnValueOnce(updateQuery) // для update status to processing
        .mockReturnValueOnce(updateQuery) // для update status to completed

      const result = await processWebhookEvent('event-123')

      expect(result).toBe(true)
    })

    it('should process contact event successfully', async () => {
      const mockEvent = {
        id: 'event-124',
        org_id: 'org-123',
        event_type: 'contacts',
        event_subtype: 'contact_created',
        status: 'pending',
        payload: { contact_id: 456 },
        entity_id: 'contact-456',
        entity_type: 'contacts',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-124')

      expect(result).toBe(true)
    })

    it('should process task event successfully', async () => {
      const mockEvent = {
        id: 'event-125',
        org_id: 'org-123',
        event_type: 'tasks',
        event_subtype: 'task_created',
        status: 'pending',
        payload: { task_id: 789 },
        entity_id: 'task-789',
        entity_type: 'tasks',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-125')

      expect(result).toBe(true)
    })

    it('should process message event successfully', async () => {
      const mockEvent = {
        id: 'event-126',
        org_id: 'org-123',
        event_type: 'messages',
        event_subtype: 'message_received',
        status: 'pending',
        payload: { message_id: 101 },
        entity_id: 'message-101',
        entity_type: 'messages',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-126')

      expect(result).toBe(true)
    })

    it('should process call event successfully', async () => {
      const mockEvent = {
        id: 'event-127',
        org_id: 'org-123',
        event_type: 'calls',
        event_subtype: 'call_ended',
        status: 'pending',
        payload: { call_id: 202 },
        entity_id: 'call-202',
        entity_type: 'calls',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-127')

      expect(result).toBe(true)
    })

    it('should process customer event successfully', async () => {
      const mockEvent = {
        id: 'event-128',
        org_id: 'org-123',
        event_type: 'customers',
        event_subtype: 'company_created',
        status: 'pending',
        payload: { company_id: 303 },
        entity_id: 'company-303',
        entity_type: 'customers',
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-128')

      expect(result).toBe(true)
    })

    it('should handle unknown event type', async () => {
      const mockEvent = {
        id: 'event-129',
        org_id: 'org-123',
        event_type: 'unknown_type',
        event_subtype: null,
        status: 'pending',
        payload: {},
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(updateQuery)

      const result = await processWebhookEvent('event-129')

      expect(result).toBe(true) // Обрабатывается, но success = false внутри
    })

    it('should handle errors during processing', async () => {
      // Тест проверяет обработку ошибок при получении события
      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValueOnce(selectQuery)

      const result = await processWebhookEvent('event-123')

      expect(result).toBe(false)
    })
  })

  describe('getEventsForRetry', () => {
    it('should return events for retry', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          org_id: 'org-123',
          event_type: 'leads',
          status: 'failed',
          retry_count: 1,
          max_retries: 3,
          next_retry_at: new Date(Date.now() - 1000).toISOString(), // В прошлом
        },
      ]

      const queryChain: any = {
        select: vi.fn(function (this: any) { return this }),
        in: vi.fn(function (this: any) { return this }),
        lt: vi.fn(function (this: any) { return this }),
        lte: vi.fn(function (this: any) { return this }),
        order: vi.fn(function (this: any) { return this }),
      }
      
      // Делаем limit thenable (await ожидает thenable от последнего метода)
      queryChain.limit = vi.fn(function (this: any) {
        const thenable = {
          then: (resolve: any) => {
            return Promise.resolve({ data: mockEvents, error: null }).then(resolve)
          },
        }
        return thenable
      })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getEventsForRetry(10)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('event-1')
    })

    it('should return empty array on error', async () => {
      const queryChain: any = {
        select: vi.fn(function (this: any) { return this }),
        in: vi.fn(function (this: any) { return this }),
        lt: vi.fn(function (this: any) { return this }),
        lte: vi.fn(function (this: any) { return this }),
        order: vi.fn(function (this: any) { return this }),
        limit: vi.fn(function (this: any) { return this }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getEventsForRetry()

      expect(result).toEqual([])
    })

    it('should return empty array when no events', async () => {
      const queryChain: any = {
        select: vi.fn(function (this: any) { return this }),
        in: vi.fn(function (this: any) { return this }),
        lt: vi.fn(function (this: any) { return this }),
        lte: vi.fn(function (this: any) { return this }),
        order: vi.fn(function (this: any) { return this }),
        limit: vi.fn(function (this: any) {
          const thenable = {
            then: (resolve: any) => {
              return Promise.resolve({ data: [], error: null }).then(resolve)
            },
          }
          return thenable
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getEventsForRetry(5)

      expect(result).toEqual([])
    })

    it('should handle custom limit parameter', async () => {
      const mockEvents = Array(20).fill(null).map((_, i) => ({
        id: `event-${i}`,
        org_id: 'org-123',
        event_type: 'leads',
        status: 'retrying',
        retry_count: 2,
        max_retries: 3,
        next_retry_at: new Date(Date.now() - 1000).toISOString(),
      }))

      const queryChain: any = {
        select: vi.fn(function (this: any) { return this }),
        in: vi.fn(function (this: any) { return this }),
        lt: vi.fn(function (this: any) { return this }),
        lte: vi.fn(function (this: any) { return this }),
        order: vi.fn(function (this: any) { return this }),
        limit: vi.fn(function (this: any) {
          const thenable = {
            then: (resolve: any) => {
              return Promise.resolve({ data: mockEvents.slice(0, 15), error: null }).then(resolve)
            },
          }
          return thenable
        }),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getEventsForRetry(15)

      expect(result).toHaveLength(15)
      expect(queryChain.limit).toHaveBeenCalledWith(15)
    })
  })

  describe('processWebhookEvent - edge cases', () => {
    it('should handle lead_status_changed event with sequences', async () => {
      const mockEvent = {
        id: 'event-130',
        org_id: 'org-123',
        event_type: 'leads',
        event_subtype: 'lead_status_changed',
        status: 'pending',
        payload: { leads: { status: [{ id: 123 }] } },
        entity_id: 'lead-123',
        entity_type: 'leads',
        retry_count: 0,
        max_retries: 3,
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery = createMockQuery()
      updateQuery.update.mockImplementation(() => updateQuery)
      updateQuery.eq.mockResolvedValue({ error: null })

      const sequencesQuery = createMockQuery()
      sequencesQuery.select.mockReturnValue(sequencesQuery)
      sequencesQuery.eq.mockReturnValue(sequencesQuery)
      sequencesQuery.in.mockReturnValue(sequencesQuery)
      sequencesQuery.then = vi.fn((resolve) => {
        return Promise.resolve({ data: [{ id: 'seq-1', trigger_type: 'stage_changed' }], error: null }).then(resolve)
      })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery)
        .mockReturnValueOnce(updateQuery)
        .mockReturnValueOnce(sequencesQuery)
        .mockReturnValueOnce(updateQuery)

      const { executeRules } = await import('@/lib/services/rule-engine')
      vi.mocked(executeRules).mockResolvedValue([])

      const { startSequence } = await import('@/lib/services/sequences')
      vi.mocked(startSequence).mockResolvedValue('exec-123')

      const result = await processWebhookEvent('event-130')

      expect(result).toBe(true)
      expect(executeRules).toHaveBeenCalled()
      expect(startSequence).toHaveBeenCalled()
    })

    it('should handle retry with max retries exceeded', async () => {
      const mockEvent = {
        id: 'event-131',
        org_id: 'org-123',
        event_type: 'leads',
        event_subtype: 'lead_created',
        status: 'pending',
        payload: { leads: { add: [{ id: 123 }] } }, // Добавляем валидные данные для обработки
        entity_id: 'lead-123',
        entity_type: 'leads',
        retry_count: 3,
        max_retries: 3,
      }

      const selectQuery = createMockQuery()
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery1 = createMockQuery()
      updateQuery1.update.mockImplementation(() => updateQuery1)
      updateQuery1.eq.mockResolvedValue({ error: null })

      // Мок для update в блоке catch ошибки
      const updateQuery2 = createMockQuery()
      updateQuery2.update.mockImplementation(() => updateQuery2)
      updateQuery2.eq.mockResolvedValue({ error: null })

      // Мок для triggerSequences (использует supabase.from('sequences'))
      const sequencesQuery = createMockQuery({ data: [], error: null })
      sequencesQuery.select.mockImplementation(() => sequencesQuery)
      sequencesQuery.eq.mockImplementation(() => sequencesQuery)
      sequencesQuery.in.mockImplementation(() => sequencesQuery)

      // Мок для update status to completed (выбросим ошибку здесь, чтобы она была поймана в catch)
      const updateQueryCompleted = createMockQuery()
      updateQueryCompleted.update.mockImplementation(() => updateQueryCompleted)
      updateQueryCompleted.eq.mockRejectedValue(new Error('Processing failed'))

      // Мок для update в блоке catch ошибки (используется после ошибки)
      const updateQuery3 = createMockQuery()
      updateQuery3.update.mockImplementation(() => updateQuery3)
      updateQuery3.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для select event
        .mockReturnValueOnce(updateQuery1) // для update status to processing
        .mockReturnValueOnce(sequencesQuery) // для triggerSequences (supabase.from('sequences'))
        .mockReturnValueOnce(updateQueryCompleted) // для update status to completed (выбросит ошибку)
        .mockReturnValueOnce(updateQuery3) // для update status to failed в catch

      const result = await processWebhookEvent('event-131')

      expect(result).toBe(false)
    })

    it('should handle error in logActivity gracefully', async () => {
      const mockEvent = {
        id: 'event-132',
        org_id: 'org-123',
        event_type: 'leads',
        event_subtype: 'lead_created',
        status: 'pending',
        payload: { leads: { add: [{ id: 123 }] } },
        entity_id: 'lead-123',
        entity_type: 'leads',
        retry_count: 0,
        max_retries: 3,
      }

      const selectQuery = createMockQuery({ data: mockEvent, error: null })
      selectQuery.select.mockImplementation(() => selectQuery)
      selectQuery.eq.mockImplementation(() => selectQuery)
      selectQuery.single.mockResolvedValue({ data: mockEvent, error: null })

      const updateQuery1 = createMockQuery()
      updateQuery1.update.mockImplementation(() => updateQuery1)
      updateQuery1.eq.mockResolvedValue({ error: null })

      // Мок для triggerSequences (использует supabase.from('sequences'))
      const sequencesQuery = createMockQuery({ data: [], error: null })
      sequencesQuery.select.mockImplementation(() => sequencesQuery)
      sequencesQuery.eq.mockImplementation(() => sequencesQuery)
      sequencesQuery.in.mockImplementation(() => sequencesQuery)

      const updateQuery2 = createMockQuery()
      updateQuery2.update.mockImplementation(() => updateQuery2)
      updateQuery2.eq.mockResolvedValue({ error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(selectQuery) // для select event
        .mockReturnValueOnce(updateQuery1) // для update status to processing
        .mockReturnValueOnce(sequencesQuery) // для triggerSequences (supabase.from('sequences'))
        .mockReturnValueOnce(updateQuery2) // для update status to completed

      // Мокаем logActivity чтобы выбросить ошибку
      const { logActivity } = await import('@/lib/services/activity-logger')
      vi.mocked(logActivity).mockRejectedValue(new Error('Logging failed'))

      const result = await processWebhookEvent('event-132')

      // Ошибка логирования не должна прервать обработку
      expect(result).toBe(true)
    })
  })
})

