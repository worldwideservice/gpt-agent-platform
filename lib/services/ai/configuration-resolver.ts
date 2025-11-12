import { cached, cacheConfig, cacheKeys } from '@/lib/cache'
import {
  getOrganizationAiSettings,
  type AiProvider,
  type OrganizationAiSettings,
} from '@/lib/repositories/organization-settings'

export interface ResolvedAiConfiguration {
  provider: AiProvider
  apiKey?: string
  defaultModel?: string
  embeddingModel?: string
  baseUrl?: string
  metadata?: Record<string, unknown> | null
  updatedAt?: string | null
}

const DEFAULT_PROVIDER: AiProvider = 'openrouter'

const resolveDefaultConfiguration = (): ResolvedAiConfiguration => ({
  provider: DEFAULT_PROVIDER,
  apiKey: process.env.OPENROUTER_API_KEY || undefined,
  defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || undefined,
  embeddingModel: process.env.OPENROUTER_EMBEDDING_MODEL || undefined,
  baseUrl: process.env.OPENROUTER_BASE_URL || undefined,
  metadata: null,
  updatedAt: null,
})

const buildOpenRouterConfiguration = (
  settings: OrganizationAiSettings,
): ResolvedAiConfiguration => {
  const providerConfig = settings.providerConfigs[DEFAULT_PROVIDER] ?? {}

  return {
    provider: DEFAULT_PROVIDER,
    apiKey: providerConfig.apiKey ?? settings.openrouterApiKey ?? undefined,
    defaultModel:
      providerConfig.defaultModel ??
      settings.openrouterDefaultModel ??
      undefined,
    embeddingModel:
      providerConfig.embeddingModel ??
      settings.openrouterEmbeddingModel ??
      undefined,
    baseUrl: providerConfig.baseUrl ?? undefined,
    metadata: providerConfig.metadata ?? settings.metadata ?? null,
    updatedAt: settings.updatedAt ?? null,
  }
}

const mergeConfiguration = (
  settings: OrganizationAiSettings,
  provider: AiProvider,
): ResolvedAiConfiguration => {
  if (provider === DEFAULT_PROVIDER) {
    return buildOpenRouterConfiguration(settings)
  }

  const providerConfig = settings.providerConfigs[provider] ?? {}

  return {
    provider,
    apiKey: providerConfig.apiKey ?? undefined,
    defaultModel: providerConfig.defaultModel ?? undefined,
    embeddingModel: providerConfig.embeddingModel ?? undefined,
    baseUrl: providerConfig.baseUrl ?? undefined,
    metadata: providerConfig.metadata ?? settings.metadata ?? null,
    updatedAt: settings.updatedAt ?? null,
  }
}

export const resolveOrganizationAiConfiguration = async (
  organizationId?: string | null,
): Promise<ResolvedAiConfiguration> => {
  if (!organizationId) {
    return resolveDefaultConfiguration()
  }

  return cached(
    cacheKeys.aiConfig(organizationId),
    async () => {
      const settings = await getOrganizationAiSettings(organizationId)

      if (!settings) {
        return resolveDefaultConfiguration()
      }

      const provider = settings.aiProvider ?? DEFAULT_PROVIDER
      const resolved = mergeConfiguration(settings, provider)

      if (!resolved.apiKey && provider !== DEFAULT_PROVIDER) {
        return buildOpenRouterConfiguration(settings)
      }

      return resolved
    },
    cacheConfig.aiConfig,
  )
}
