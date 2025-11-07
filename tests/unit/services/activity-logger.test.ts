import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ActivityLogger, logActivity } from '@/lib/services/activity-logger'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    insert: vi.fn(() => query),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Activity Logger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseClient.from.mockImplementation(() => createMockQuery())
  })

  describe('logActivity', () => {
    it('should log activity successfully', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await logActivity({
        orgId: 'org-123',
        activityType: 'agent_created',
        title: 'Agent was created',
        description: 'Agent was created',
        metadata: { agentId: 'agent-123' },
      })
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should handle errors gracefully when logging activity', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: { message: 'Database error' } })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      // Должно не выбрасывать ошибку, а просто логировать
      await expect(
        logActivity({
          orgId: 'org-123',
          activityType: 'agent_created',
          title: 'Agent was created',
        })
      ).resolves.not.toThrow()
    })
  })

  describe('ActivityLogger', () => {
    it('should be an object with methods', () => {
      expect(ActivityLogger).toBeDefined()
      expect(typeof ActivityLogger).toBe('object')
      expect(ActivityLogger.agentCreated).toBeDefined()
      expect(ActivityLogger.actionExecuted).toBeDefined()
      expect(ActivityLogger.errorOccurred).toBeDefined()
    })

    it('should log agent created', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.agentCreated('org-123', 'user-123', 'agent-123', 'Test Agent')
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log agent response', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.agentResponse('org-123', 'agent-123', 'conv-123', 100)
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log action executed', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.actionExecuted('org-123', 'agent-123', 'create_lead', { leadId: 'lead-456' })
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log lead updated', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.leadUpdated('org-123', 123, 'status_changed', 'Status updated')
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log error occurred', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.errorOccurred('org-123', 'api_error', 'API call failed', { endpoint: '/api/test' })
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log integration synced', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.integrationSynced('org-123', 'kommo', true)
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })

    it('should log rule executed', async () => {
      const insertQuery = createMockQuery()
      insertQuery.insert.mockResolvedValue({ error: null })
      
      mockSupabaseClient.from.mockReturnValue(insertQuery)
      
      await ActivityLogger.ruleExecuted('org-123', 'rule-123', 'Test Rule', true)
      
      expect(insertQuery.insert).toHaveBeenCalled()
    })
  })
})
