import { describe, it, expect, vi, beforeEach } from 'vitest'

// Создаем мок для createMockQuery
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {}

  query.select = vi.fn().mockImplementation(() => query)
  query.eq = vi.fn().mockImplementation(() => query)
  query.maybeSingle = vi.fn().mockImplementation(() => query)

  query.then = vi.fn((resolve) => {
    const resolvedResult = result !== undefined ? result : { data: null, error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })

  query.catch = vi.fn((reject) => {
    const resolvedResult = result !== undefined ? result : { data: null, error: null }
    return Promise.resolve(resolvedResult).catch(reject)
  })

  return query
}

const mockSupabaseClient = createMockQuery()
mockSupabaseClient.from = vi.fn(() => mockSupabaseClient)

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('@/lib/utils', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

import { getOrganizationAiSettings } from '@/lib/repositories/organization-settings'

describe('Organization Settings Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrganizationAiSettings', () => {
    it('должен вернуть настройки AI для организации', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openrouter',
        openrouter_api_key: 'sk_test_123',
        openrouter_default_model: 'gpt-4',
        openrouter_embedding_model: 'text-embedding-3-small',
        openai_api_key: null,
        openai_model: null,
        provider_configs: {
          openrouter: {
            apiKey: 'sk_test_123',
            defaultModel: 'gpt-4',
          },
        },
        metadata: {
          custom_field: 'value',
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result).toBeDefined()
      expect(result?.orgId).toBe('org-123')
      expect(result?.aiProvider).toBe('openrouter')
      expect(result?.openrouterApiKey).toBe('sk_test_123')
      expect(result?.openrouterDefaultModel).toBe('gpt-4')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_settings')
    })

    it('должен вернуть null если настройки не найдены', async () => {
      const selectQuery = createMockQuery({ data: null, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result).toBeNull()
    })

    it('должен вернуть null при ошибке БД', async () => {
      const selectQuery = createMockQuery({
        data: null,
        error: { message: 'Database error' },
      })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result).toBeNull()
    })

    it('должен корректно маппить настройки OpenRouter', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openrouter',
        openrouter_api_key: 'sk_test_openrouter',
        openrouter_default_model: 'anthropic/claude-3-opus',
        openrouter_embedding_model: 'openai/text-embedding-3-small',
        openai_api_key: null,
        openai_model: null,
        provider_configs: null,
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.aiProvider).toBe('openrouter')
      expect(result?.providerConfigs.openrouter).toBeDefined()
      expect(result?.providerConfigs.openrouter.apiKey).toBe('sk_test_openrouter')
      expect(result?.providerConfigs.openrouter.defaultModel).toBe('anthropic/claude-3-opus')
    })

    it('должен корректно маппить настройки OpenAI', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openai',
        openrouter_api_key: null,
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: 'sk_test_openai',
        openai_model: 'gpt-4-turbo',
        provider_configs: null,
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.aiProvider).toBe('openai')
      expect(result?.providerConfigs.openai).toBeDefined()
      expect(result?.providerConfigs.openai.apiKey).toBe('sk_test_openai')
      expect(result?.providerConfigs.openai.defaultModel).toBe('gpt-4-turbo')
    })

    it('должен использовать openrouter по умолчанию если provider не указан', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: null,
        openrouter_api_key: 'sk_test',
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: null,
        openai_model: null,
        provider_configs: null,
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.aiProvider).toBe('openrouter')
    })

    it('должен корректно обрабатывать provider_configs', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'anthropic',
        openrouter_api_key: null,
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: null,
        openai_model: null,
        provider_configs: {
          anthropic: {
            apiKey: 'sk_test_anthropic',
            defaultModel: 'claude-3-opus',
            baseUrl: 'https://api.anthropic.com',
          },
          google: {
            apiKey: 'sk_test_google',
            defaultModel: 'gemini-pro',
          },
        },
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.providerConfigs.anthropic).toBeDefined()
      expect(result?.providerConfigs.anthropic.apiKey).toBe('sk_test_anthropic')
      expect(result?.providerConfigs.anthropic.baseUrl).toBe('https://api.anthropic.com')
      expect(result?.providerConfigs.google).toBeDefined()
      expect(result?.providerConfigs.google.apiKey).toBe('sk_test_google')
    })

    it('должен игнорировать некорректные provider_configs', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openrouter',
        openrouter_api_key: 'sk_test',
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: null,
        openai_model: null,
        provider_configs: 'invalid_string', // Некорректное значение
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.providerConfigs).toBeDefined()
      expect(result?.providerConfigs.openrouter).toBeDefined() // Должен создать дефолтный config
    })

    it('должен корректно обрабатывать metadata', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openrouter',
        openrouter_api_key: 'sk_test',
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: null,
        openai_model: null,
        provider_configs: null,
        metadata: {
          environment: 'production',
          region: 'us-east-1',
          custom_setting: true,
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.metadata).toBeDefined()
      expect(result?.metadata?.environment).toBe('production')
      expect(result?.metadata?.region).toBe('us-east-1')
      expect(result?.metadata?.custom_setting).toBe(true)
    })

    it('должен использовать updated_at если он есть, иначе created_at', async () => {
      const mockSettings1 = {
        org_id: 'org-123',
        ai_provider: 'openrouter',
        openrouter_api_key: 'sk_test',
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: null,
        openai_model: null,
        provider_configs: null,
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
      }

      const selectQuery1 = createMockQuery({ data: mockSettings1, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery1)

      const result1 = await getOrganizationAiSettings('org-123')
      expect(result1?.updatedAt).toBe('2024-01-05T00:00:00Z')

      // Без updated_at
      vi.clearAllMocks()
      const mockSettings2 = {
        ...mockSettings1,
        updated_at: null,
      }

      const selectQuery2 = createMockQuery({ data: mockSettings2, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery2)

      const result2 = await getOrganizationAiSettings('org-123')
      expect(result2?.updatedAt).toBe('2024-01-01T00:00:00Z')
    })

    it('должен корректно обрабатывать embeddingModel в provider configs', async () => {
      const mockSettings = {
        org_id: 'org-123',
        ai_provider: 'openai',
        openrouter_api_key: null,
        openrouter_default_model: null,
        openrouter_embedding_model: null,
        openai_api_key: 'sk_test',
        openai_model: 'gpt-4',
        provider_configs: {
          openai: {
            apiKey: 'sk_test',
            defaultModel: 'gpt-4',
            embeddingModel: 'text-embedding-3-large',
          },
        },
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      }

      const selectQuery = createMockQuery({ data: mockSettings, error: null })
      mockSupabaseClient.from.mockReturnValue(selectQuery)

      const result = await getOrganizationAiSettings('org-123')

      expect(result?.providerConfigs.openai.embeddingModel).toBe('text-embedding-3-large')
    })
  })
})
