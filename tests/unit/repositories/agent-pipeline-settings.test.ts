import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Agent Pipeline Settings Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isAgentConfiguredForStage', () => {
    it('should return true if agent is active and all_stages is true', async () => {
      const mockSettings = {
        id: 'setting-1',
        org_id: 'org-123',
        agent_id: 'agent-456',
        pipeline_id: 'pipeline-789',
        is_active: true,
        all_stages: true,
        selected_stages: [],
        stage_instructions: {},
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
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789')

      expect(result).toBe(true)
      expect(mockQuery.eq).toHaveBeenCalledWith('agent_id', 'agent-456')
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('pipeline_id', 'pipeline-789')
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true)
    })

    it('should return true if agent is active and stage is in selected_stages', async () => {
      const mockSettings = {
        id: 'setting-1',
        org_id: 'org-123',
        agent_id: 'agent-456',
        pipeline_id: 'pipeline-789',
        is_active: true,
        all_stages: false,
        selected_stages: ['stage-1', 'stage-2'],
        stage_instructions: {},
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
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789', 'stage-1')

      expect(result).toBe(true)
    })

    it('should return false if stage is not in selected_stages', async () => {
      const mockSettings = {
        id: 'setting-1',
        org_id: 'org-123',
        agent_id: 'agent-456',
        pipeline_id: 'pipeline-789',
        is_active: true,
        all_stages: false,
        selected_stages: ['stage-1', 'stage-2'],
        stage_instructions: {},
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
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789', 'stage-3')

      expect(result).toBe(false)
    })

    it('should return false if agent is not active', async () => {
      const mockSettings = {
        id: 'setting-1',
        org_id: 'org-123',
        agent_id: 'agent-456',
        pipeline_id: 'pipeline-789',
        is_active: false,
        all_stages: true,
        selected_stages: [],
        stage_instructions: {},
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
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789')

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      // Мокаем supabase.from чтобы он выбрасывал ошибку
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789')

      expect(result).toBe(false)
    })

    it('should return false if settings not found', async () => {
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

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789')

      expect(result).toBe(false)
    })

    it('should return false if stage not provided and selected_stages is not empty', async () => {
      const mockSettings = {
        id: 'setting-1',
        org_id: 'org-123',
        agent_id: 'agent-456',
        pipeline_id: 'pipeline-789',
        is_active: true,
        all_stages: false,
        selected_stages: ['stage-1'],
        stage_instructions: {},
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
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789', null)

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
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

      const { isAgentConfiguredForStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await isAgentConfiguredForStage('agent-456', 'org-123', 'pipeline-789')

      expect(result).toBe(false)
    })
  })

  describe('getAgentPipelineSettings', () => {
    it('should return agent pipeline settings', async () => {
      const mockSettings = [
        {
          id: 'setting-1',
          org_id: 'org-123',
          agent_id: 'agent-456',
          pipeline_id: 'pipeline-789',
          is_active: true,
          all_stages: true,
          selected_stages: [],
          stage_instructions: {},
          created_at: '2025-01-26T00:00:00Z',
          updated_at: '2025-01-26T00:00:00Z',
        },
        {
          id: 'setting-2',
          org_id: 'org-123',
          agent_id: 'agent-456',
          pipeline_id: 'pipeline-790',
          is_active: false,
          all_stages: false,
          selected_stages: ['stage-1'],
          stage_instructions: {},
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
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockSettings, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentPipelineSettings } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentPipelineSettings('agent-456', 'org-123')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('setting-1')
      expect(result[1].id).toBe('setting-2')
      expect(mockQuery.eq).toHaveBeenCalledWith('agent_id', 'agent-456')
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
    })

    it('should return empty array if no settings found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentPipelineSettings } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentPipelineSettings('agent-456', 'org-123')

      expect(result).toEqual([])
    })

    it('should return empty array on error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentPipelineSettings } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentPipelineSettings('agent-456', 'org-123')

      expect(result).toEqual([])
    })
  })

  describe('getAgentsForPipelineStage', () => {
    it('should return agents configured for pipeline stage', async () => {
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'Agent 1',
          org_id: 'org-123',
        },
        {
          id: 'agent-2',
          name: 'Agent 2',
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
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockAgents, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentsForPipelineStage('org-123', 'pipeline-789', 'stage-1')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('pipeline_id', 'pipeline-789')
    })

    it('should return empty array if no agents found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentsForPipelineStage('org-123', 'pipeline-789', 'stage-1')

      expect(result).toEqual([])
    })

    it('should handle null stageId', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: [], error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      await getAgentsForPipelineStage('org-123', 'pipeline-789', null)

      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('pipeline_id', 'pipeline-789')
    })

    it('should handle agents with all_stages set to true', async () => {
      const mockAgents = [
        {
          agent_id: 'agent-1',
          all_stages: true,
          selected_stages: [],
        },
        {
          agent_id: 'agent-2',
          all_stages: false,
          selected_stages: ['stage-1'],
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockAgents, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentsForPipelineStage('org-123', 'pipeline-789', 'stage-2')

      // agent-1 должен быть включен (all_stages = true), agent-2 нет (stage-2 не в selected_stages)
      expect(result).toContain('agent-1')
      expect(result).not.toContain('agent-2')
    })

    it('should handle exceptions gracefully', async () => {
      // Мокаем supabase.from чтобы он выбрасывал ошибку
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentsForPipelineStage('org-123', 'pipeline-789', 'stage-1')

      expect(result).toEqual([])
    })

    it('should return empty array if data is null', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getAgentsForPipelineStage } = await import('@/lib/repositories/agent-pipeline-settings')

      const result = await getAgentsForPipelineStage('org-123', 'pipeline-789', 'stage-1')

      expect(result).toEqual([])
    })
  })
})

