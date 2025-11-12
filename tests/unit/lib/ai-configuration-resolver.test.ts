import { beforeEach, describe, expect, it, vi } from 'vitest'

const cacheMemory = new Map<string, unknown>()

vi.mock('@/lib/cache', () => ({
  cached: vi.fn(async <T>(key: string, fn: () => Promise<T>) => {
    if (cacheMemory.has(key)) {
      return cacheMemory.get(key) as T
    }
    const result = await fn()
    cacheMemory.set(key, result)
    return result
  }),
  cacheConfig: { aiConfig: 60 },
  cacheKeys: { aiConfig: (orgId: string) => `ai-config:${orgId}` },
}))

vi.mock('@/lib/repositories/organization-settings', () => ({
  getOrganizationAiSettings: vi.fn(),
}))

describe('resolveOrganizationAiConfiguration', () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    cacheMemory.clear()
    process.env.OPENROUTER_API_KEY = 'env-openrouter'
    process.env.OPENROUTER_DEFAULT_MODEL = 'env-model'
    process.env.OPENROUTER_EMBEDDING_MODEL = 'env-embedding'
    process.env.OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  it('возвращает настройки по умолчанию без идентификатора организации', async () => {
    const { resolveOrganizationAiConfiguration } = await import(
      '@/lib/services/ai/configuration-resolver'
    )

    const config = await resolveOrganizationAiConfiguration()

    expect(config.provider).toBe('openrouter')
    expect(config.apiKey).toBe('env-openrouter')
    expect(config.defaultModel).toBe('env-model')
    expect(config.embeddingModel).toBe('env-embedding')
  })

  it('использует настройки организации для OpenRouter', async () => {
    const { getOrganizationAiSettings } = await import(
      '@/lib/repositories/organization-settings'
    )
    vi.mocked(getOrganizationAiSettings).mockResolvedValue({
      orgId: 'org-2',
      aiProvider: 'openrouter',
      openrouterApiKey: 'org-key',
      openrouterDefaultModel: 'org-model',
      openrouterEmbeddingModel: 'org-embed',
      openaiApiKey: null,
      openaiModel: null,
      providerConfigs: {
        openrouter: {
          apiKey: 'org-key',
          defaultModel: 'org-model',
          embeddingModel: 'org-embed',
          baseUrl: 'https://custom.base',
        },
      },
      metadata: null,
      updatedAt: '2024-01-01T00:00:00Z',
    })

    const { resolveOrganizationAiConfiguration } = await import(
      '@/lib/services/ai/configuration-resolver'
    )

    const config = await resolveOrganizationAiConfiguration('org-2')

    expect(config.apiKey).toBe('org-key')
    expect(config.defaultModel).toBe('org-model')
    expect(config.embeddingModel).toBe('org-embed')
    expect(config.baseUrl).toBe('https://custom.base')
  })

  it('откатывается к провайдеру по умолчанию, если для выбранного нет ключа', async () => {
    const { getOrganizationAiSettings } = await import(
      '@/lib/repositories/organization-settings'
    )
    vi.mocked(getOrganizationAiSettings).mockResolvedValue({
      orgId: 'org-2',
      aiProvider: 'openai',
      openrouterApiKey: 'fallback-key',
      openrouterDefaultModel: 'fallback-model',
      openrouterEmbeddingModel: 'fallback-embedding',
      openaiApiKey: null,
      openaiModel: null,
      providerConfigs: {
        openrouter: {
          apiKey: 'fallback-key',
          defaultModel: 'fallback-model',
          embeddingModel: 'fallback-embedding',
        },
      },
      metadata: null,
      updatedAt: '2024-01-01T00:00:00Z',
    })

    const { resolveOrganizationAiConfiguration } = await import(
      '@/lib/services/ai/configuration-resolver'
    )

    const config = await resolveOrganizationAiConfiguration('org-2')

    expect(config.provider).toBe('openrouter')
    expect(config.apiKey).toBe('fallback-key')
  })
})
