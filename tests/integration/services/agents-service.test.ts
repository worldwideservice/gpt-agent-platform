import { describe, it, expect, beforeEach, vi } from 'vitest'

import { listAgents, createAgent } from '@/lib/services/agents'
import { cloneTables, createInMemorySupabaseClient } from '@/tests/integration/support/inMemorySupabase'

const ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001'

if (typeof (globalThis as any).Element === 'undefined') {
  ;(globalThis as any).Element = class {}
  ;(globalThis as any).Element.prototype = {}
}

const now = new Date().toISOString()

const baseTables = {
  agents: [
    {
      id: 'agent-1',
      org_id: ORGANIZATION_ID,
      name: 'Demo agent',
      status: 'active',
      default_model: 'gpt-4-mini',
      created_at: now,
      updated_at: now,
      owner_name: 'Owner',
      messages_total: 10,
      temperature: 0.7,
      max_tokens: 2048,
      response_delay_seconds: 0,
      instructions: null,
      settings: {},
    },
  ],
}

const getClientMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: getClientMock,
}))

vi.mock('@/lib/utils/cache', () => ({
  getCachedAgent: vi.fn(),
  setCachedAgent: vi.fn(),
  invalidateAgentCache: vi.fn(() => Promise.resolve()),
}))

describe('AgentsService integration', () => {
  beforeEach(() => {
    getClientMock.mockReset()
    const client = createInMemorySupabaseClient(cloneTables(baseTables))
    getClientMock.mockReturnValue(client)
  })

  it('lists agents for organization using in-memory Supabase', async () => {
    const result = await listAgents(ORGANIZATION_ID, { page: 1, limit: 10 })

    expect(result.total).toBe(1)
    expect(result.agents).toHaveLength(1)
    expect(result.agents[0].name).toBe('Demo agent')
  })

  it('creates agent via service and returns domain model', async () => {
    const agent = await createAgent(ORGANIZATION_ID, {
      name: 'New Agent',
      status: 'draft',
      model: 'gpt-test',
      instructions: 'Be helpful',
      temperature: 0.8,
      maxTokens: 1024,
    })

    expect(agent.name).toBe('New Agent')
    expect(agent.status).toBe('draft')
    expect(agent.model).toBe('gpt-test')

    const lastCallClient = getClientMock.mock.results.at(-1)?.value
    const agentTable = lastCallClient?.from('agents')
    const { data } = await agentTable?.select('*')
    expect(Array.isArray(data)).toBe(true)
    expect((data as any[]).some((row) => row.name === 'New Agent')).toBe(true)
  })
})
