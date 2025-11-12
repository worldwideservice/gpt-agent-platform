import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { OrganizationSettingsRow } from '@/types/supabase'

export type AiProvider = 'openrouter' | 'openai'

export interface OrganizationAiSettings {
  orgId: string
  aiProvider: AiProvider
  openrouterApiKey?: string | null
  openrouterDefaultModel?: string | null
  openrouterEmbeddingModel?: string | null
  openaiApiKey?: string | null
  openaiModel?: string | null
  metadata?: Record<string, unknown> | null
  updatedAt?: string | null
}

const mapRowToSettings = (row: OrganizationSettingsRow): OrganizationAiSettings => ({
  orgId: row.org_id,
  aiProvider: (row.ai_provider as AiProvider) ?? 'openrouter',
  openrouterApiKey: row.openrouter_api_key,
  openrouterDefaultModel: row.openrouter_default_model,
  openrouterEmbeddingModel: row.openrouter_embedding_model,
  openaiApiKey: row.openai_api_key,
  openaiModel: row.openai_model,
  metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  updatedAt: row.updated_at ?? row.created_at,
})

export const getOrganizationAiSettings = async (organizationId: string): Promise<OrganizationAiSettings | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('organization_settings')
    .select('*')
    .eq('org_id', organizationId)
    .maybeSingle()

  if (error) {
    console.error('Failed to load organization settings', error)
    return null
  }

  if (!data) {
    return null
  }

  return mapRowToSettings(data as OrganizationSettingsRow)
}
