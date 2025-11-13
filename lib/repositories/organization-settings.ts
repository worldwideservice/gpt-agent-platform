import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils'

import type { Json, OrganizationSettingsRow } from '@/types/supabase'

export type AiProvider =
  | 'openrouter'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure_openai'

export interface ProviderConfiguration {
  apiKey?: string | null
  defaultModel?: string | null
  embeddingModel?: string | null
  baseUrl?: string | null
  metadata?: Record<string, unknown> | null
  [key: string]: unknown
}

export interface OrganizationAiSettings {
  orgId: string
  aiProvider: AiProvider
  openrouterApiKey?: string | null
  openrouterDefaultModel?: string | null
  openrouterEmbeddingModel?: string | null
  openaiApiKey?: string | null
  openaiModel?: string | null
  providerConfigs: Record<string, ProviderConfiguration>
  metadata?: Record<string, unknown> | null
  updatedAt?: string | null
}

const normalizeProviderConfigs = (
  value: Json | null,
): Record<string, ProviderConfiguration> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const entries = Object.entries(value)
    .filter(
      ([, config]) =>
        config && typeof config === 'object' && !Array.isArray(config),
    )
    .map(([provider, config]) => {
      const normalizedConfig: ProviderConfiguration = {}
      const configRecord = config as Record<string, unknown>

      if (typeof configRecord.apiKey === 'string') {
        normalizedConfig.apiKey = configRecord.apiKey
      }

      if (typeof configRecord.defaultModel === 'string') {
        normalizedConfig.defaultModel = configRecord.defaultModel
      }

      if (typeof configRecord.embeddingModel === 'string') {
        normalizedConfig.embeddingModel = configRecord.embeddingModel
      }

      if (typeof configRecord.baseUrl === 'string') {
        normalizedConfig.baseUrl = configRecord.baseUrl
      }

      if (
        configRecord.metadata &&
        typeof configRecord.metadata === 'object' &&
        !Array.isArray(configRecord.metadata)
      ) {
        normalizedConfig.metadata = configRecord.metadata as Record<
          string,
          unknown
        >
      }

      // Сохраняем остальные значения как есть
      for (const [key, raw] of Object.entries(configRecord)) {
        if (!(key in normalizedConfig)) {
          normalizedConfig[key] = raw as unknown
        }
      }

      return [provider, normalizedConfig] as const
    })

  return Object.fromEntries(entries)
}

const mapRowToSettings = (
  row: OrganizationSettingsRow,
): OrganizationAiSettings => {
  const providerConfigs = normalizeProviderConfigs(
    row.provider_configs as Json | null,
  )

  if (!providerConfigs.openrouter) {
    providerConfigs.openrouter = {
      apiKey: row.openrouter_api_key ?? undefined,
      defaultModel: row.openrouter_default_model ?? undefined,
      embeddingModel: row.openrouter_embedding_model ?? undefined,
    }
  }

  if (!providerConfigs.openai && (row.openai_api_key || row.openai_model)) {
    providerConfigs.openai = {
      apiKey: row.openai_api_key ?? undefined,
      defaultModel: row.openai_model ?? undefined,
    }
  }

  return {
    orgId: row.org_id,
    aiProvider: (row.ai_provider as AiProvider | null) ?? 'openrouter',
    openrouterApiKey: row.openrouter_api_key,
    openrouterDefaultModel: row.openrouter_default_model,
    openrouterEmbeddingModel: row.openrouter_embedding_model,
    openaiApiKey: row.openai_api_key,
    openaiModel: row.openai_model,
    providerConfigs,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    updatedAt: row.updated_at ?? row.created_at,
  }
}

export const getOrganizationAiSettings = async (
  organizationId: string,
): Promise<OrganizationAiSettings | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('organization_settings')
    .select('*')
    .eq('org_id', organizationId)
    .maybeSingle()

  if (error) {
    logger.error('Failed to load organization settings', error instanceof Error ? error : new Error(String(error)), { organizationId })
    return null
  }

  if (!data) {
    return null
  }

  return mapRowToSettings(data as OrganizationSettingsRow)
}
