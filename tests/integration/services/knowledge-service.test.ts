import { describe, it, expect, beforeEach, vi } from 'vitest'

import { getKnowledgeOverview } from '@/lib/services/knowledge'
import { cloneTables, createInMemorySupabaseClient } from '@/tests/integration/support/inMemorySupabase'

const ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001'

const getClientMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: getClientMock,
}))

vi.mock('@/lib/utils/cache', () => ({
  getCachedAgent: vi.fn(),
  setCachedAgent: vi.fn(),
  invalidateAgentCache: vi.fn(() => Promise.resolve()),
}))

const baseNow = new Date().toISOString()

const baseTables = {
  agents: [
    {
      id: 'agent-1',
      org_id: ORGANIZATION_ID,
      name: 'Sales Bot',
      status: 'active',
      default_model: 'gpt-4-mini',
      created_at: baseNow,
      updated_at: baseNow,
      owner_name: 'Owner',
      messages_total: 42,
      temperature: 0.7,
      max_tokens: 2048,
      response_delay_seconds: 0,
      instructions: null,
      settings: {},
    },
  ],
  knowledge_base_categories: [
    {
      id: 'category-1',
      org_id: ORGANIZATION_ID,
      name: 'FAQ',
      description: 'Частые вопросы',
      parent_id: null,
      sort_order: 1,
      created_at: baseNow,
      updated_at: baseNow,
    },
  ],
  knowledge_base_articles: [
    {
      id: 'article-1',
      org_id: ORGANIZATION_ID,
      category_id: 'category-1',
      title: 'Как подключиться',
      content: 'Инструкция по подключению',
      slug: 'setup',
      is_published: true,
      views_count: 10,
      created_at: baseNow,
      updated_at: baseNow,
    },
    {
      id: 'article-2',
      org_id: ORGANIZATION_ID,
      category_id: 'category-1',
      title: 'Черновик ответа',
      content: 'Черновик статьи',
      slug: 'draft',
      is_published: false,
      views_count: 0,
      created_at: new Date(Date.now() - 1000).toISOString(),
      updated_at: new Date(Date.now() - 1000).toISOString(),
    },
  ],
  agent_assets: [
    {
      id: 'asset-1',
      agent_id: 'agent-1',
      org_id: ORGANIZATION_ID,
      type: 'document',
      source_name: 'Памятка',
      storage_path: null,
      status: 'pending',
      error: null,
      file_size: null,
      mime_type: null,
      chunks_count: 0,
      processing_error: null,
      created_at: baseNow,
      processed_at: null,
    },
  ],
}

describe('KnowledgeService integration', () => {
  beforeEach(() => {
    getClientMock.mockReset()
    const client = createInMemorySupabaseClient(cloneTables(baseTables))
    getClientMock.mockReturnValue(client)
  })

  it('aggregates overview data with stats, categories, articles and agents', async () => {
    const overview = await getKnowledgeOverview(ORGANIZATION_ID)

    expect(overview.stats).toEqual({
      categoriesCount: 1,
      publishedArticlesCount: 1,
      pendingAssetsCount: 1,
    })
    expect(overview.categories).toHaveLength(1)
    expect(overview.categories[0]).toMatchObject({
      id: 'category-1',
      name: 'FAQ',
      articlesCount: 2,
    })
    expect(overview.articles).toHaveLength(2)
    expect(overview.history).toHaveLength(1)
    expect(overview.agentOptions).toEqual([{ id: 'agent-1', name: 'Sales Bot' }])
  })

  it('returns safe fallback when repositories fail', async () => {
    getClientMock.mockImplementation(() => {
      throw new Error('Supabase unavailable')
    })

    const overview = await getKnowledgeOverview(ORGANIZATION_ID)

    expect(overview).toEqual({
      stats: null,
      categories: [],
      articles: [],
      history: [],
      agentOptions: [],
    })
  })

  it('respects includeAgentOptions flag', async () => {
    const overview = await getKnowledgeOverview(ORGANIZATION_ID, {
      includeAgentOptions: false,
    })

    expect(overview.agentOptions).toEqual([])
  })
})
