import { z } from 'zod'

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { Database } from '@/types/supabase'

const CRM_PROVIDER = 'kommo'
const isE2EMode = process.env.E2E_ONBOARDING_FAKE === '1'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const syncMetadataSchema = z
  .object({
    status: z.enum(['queued', 'running', 'completed', 'failed']).optional(),
    requestedAt: z.string().datetime().optional(),
    startedAt: z.string().datetime().optional(),
    completedAt: z.string().datetime().optional(),
    failedAt: z.string().datetime().optional(),
    provider: z.string().optional(),
    baseDomain: z.string().optional(),
    pipelinesCount: z.number().optional(),
    stagesCount: z.number().optional(),
    pipelinesPreview: z
      .array(
        z.object({
          externalId: z.string(),
          name: z.string(),
          stages: z.array(z.string()),
        }),
      )
      .optional(),
    error: z.string().nullable().optional(),
  })
  .transform((value) => {
    return {
      status: value.status ?? 'queued',
      requestedAt: value.requestedAt ?? null,
      startedAt: value.startedAt ?? null,
      completedAt: value.completedAt ?? null,
      failedAt: value.failedAt ?? null,
      provider: value.provider ?? CRM_PROVIDER,
      baseDomain: value.baseDomain ?? null,
      pipelinesCount: value.pipelinesCount ?? 0,
      stagesCount: value.stagesCount ?? 0,
      pipelinesPreview: value.pipelinesPreview ?? [],
      error: value.error ?? null,
    }
  })

const sanitizeSyncMetadata = (metadata: Record<string, unknown> | null | undefined) => {
  if (!isRecord(metadata?.sync)) {
    return null
  }

  const result = syncMetadataSchema.safeParse(metadata?.sync)

  if (!result.success) {
    return null
  }

  return result.data
}

export interface OnboardingCrmState {
  provider: string
  credentialsConfigured: boolean
  connectionConfigured: boolean
  credentials: {
    clientId: string
    redirectUri: string | null
    updatedAt: string | null
  } | null
  connection: {
    id: string
    baseDomain: string
    createdAt: string
    updatedAt: string
    metadata: Record<string, unknown> | null
  } | null
  sync: ReturnType<typeof sanitizeSyncMetadata>
}

export interface OnboardingAgentState {
  id: string
  name: string
  status: string
  defaultModel: string | null
  createdAt: string
}

export interface OnboardingState {
  crm: OnboardingCrmState
  agent: OnboardingAgentState | null
  isCompleted: boolean
}

let cachedSupabase: ReturnType<typeof getSupabaseServiceRoleClient> | null = null

const getSupabase = () => {
  if (!cachedSupabase) {
    cachedSupabase = getSupabaseServiceRoleClient()
  }

  return cachedSupabase
}

type AgentRow = Database['public']['Tables']['agents']['Row']

type CrmCredentialsRow = Database['public']['Tables']['crm_credentials']['Row']

type CrmConnectionRow = Database['public']['Tables']['crm_connections']['Row']

const buildEmptyState = (orgId: string): OnboardingState => {
  return {
    crm: {
      provider: CRM_PROVIDER,
      credentialsConfigured: false,
      connectionConfigured: false,
      credentials: null,
      connection: null,
      sync: null,
    },
    agent: null,
    isCompleted: false,
  }
}

const fetchCrmCredentials = async (orgId: string) => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('crm_credentials')
    .select('client_id, redirect_uri, updated_at')
    .eq('org_id', orgId)
    .eq('provider', CRM_PROVIDER)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as Pick<CrmCredentialsRow, 'client_id' | 'redirect_uri' | 'updated_at'> | null
}

const fetchCrmConnection = async (orgId: string) => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('crm_connections')
    .select('*')
    .eq('org_id', orgId)
    .eq('provider', CRM_PROVIDER)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as CrmConnectionRow | null
}

const fetchExistingAgent = async (orgId: string) => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, status, default_model, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as Pick<AgentRow, 'id' | 'name' | 'status' | 'default_model' | 'created_at'> | null
}

export const getOnboardingState = async (orgId: string): Promise<OnboardingState> => {
  if (isE2EMode) {
    return buildEmptyState(orgId)
  }

  const [credentials, connection, agent] = await Promise.all([
    fetchCrmCredentials(orgId),
    fetchCrmConnection(orgId),
    fetchExistingAgent(orgId),
  ])

  const sync = sanitizeSyncMetadata(connection?.metadata as Record<string, unknown> | null | undefined)

  const crmState: OnboardingCrmState = {
    provider: CRM_PROVIDER,
    credentialsConfigured: Boolean(credentials),
    connectionConfigured: Boolean(connection),
    credentials: credentials
      ? {
          clientId: credentials.client_id,
          redirectUri: credentials.redirect_uri,
          updatedAt: credentials.updated_at,
        }
      : null,
    connection: connection
      ? {
          id: connection.id,
          baseDomain: connection.base_domain,
          createdAt: connection.created_at,
          updatedAt: connection.updated_at,
          metadata: connection.metadata as Record<string, unknown> | null,
        }
      : null,
    sync,
  }

  const agentState: OnboardingAgentState | null = agent
    ? {
        id: agent.id,
        name: agent.name,
        status: agent.status,
        defaultModel: agent.default_model,
        createdAt: agent.created_at,
      }
    : null

  const isCrmReady =
    crmState.credentialsConfigured &&
    crmState.connectionConfigured &&
    crmState.sync?.status === 'completed'

  return {
    crm: crmState,
    agent: agentState,
    isCompleted: Boolean(isCrmReady && agentState),
  }
}

export type CreateOnboardingAgentInput = {
  orgId: string
  name: string
  model: string
  goal: string
  channels: string[]
  schedule: string
}

const buildAgentSettings = (input: CreateOnboardingAgentInput) => {
  return {
    channels: input.channels,
    schedule: input.schedule,
    goal: input.goal,
  }
}

export const upsertOnboardingAgent = async (
  input: CreateOnboardingAgentInput,
): Promise<AgentRow> => {
  const supabase = getSupabase()

  if (isE2EMode) {
    return {
      id: 'agent-e2e',
      org_id: input.orgId,
      name: input.name,
      status: 'active',
      connection_id: null,
      default_model: input.model,
      owner_name: null,
      messages_total: 0,
      last_activity_at: null,
      temperature: 0.7,
      max_tokens: 2048,
      instructions: input.goal,
      system_prompt: input.goal,
      response_delay_seconds: 0,
      settings: buildAgentSettings(input),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const connection = await fetchCrmConnection(input.orgId)

  if (!connection) {
    throw new Error('CRM connection is required before creating an agent')
  }

  const existingAgent = await fetchExistingAgent(input.orgId)
  const settings = buildAgentSettings(input)

  if (existingAgent) {
    const { data, error } = await supabase
      .from('agents')
      .update({
        name: input.name,
        default_model: input.model,
        status: 'active',
        connection_id: connection.id,
        instructions: input.goal,
        system_prompt: input.goal,
        settings,
      })
      .eq('id', existingAgent.id)
      .select('*')
      .single()

    if (error || !data) {
      throw error ?? new Error('Не удалось обновить агента')
    }

    return data as AgentRow
  }

  const { data, error } = await supabase
    .from('agents')
    .insert({
      org_id: input.orgId,
      connection_id: connection.id,
      name: input.name,
      status: 'active',
      default_model: input.model,
      instructions: input.goal,
      system_prompt: input.goal,
      settings,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Не удалось создать агента')
  }

  return data as AgentRow
}
