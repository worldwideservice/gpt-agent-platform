import type { SupabaseClient } from '@supabase/supabase-js'

import { decryptSecret, encryptSecret } from '../crypto'
import type { Database } from '../types'

const CREDENTIALS_TABLE = 'crm_credentials'
const CONNECTIONS_TABLE = 'crm_connections'
const OAUTH_STATES_TABLE = 'oauth_states'

export type CrmCredentialsRow = Database['public']['Tables']['crm_credentials']['Row']
export type CrmConnectionRow = Database['public']['Tables']['crm_connections']['Row']
export type CrmOAuthStateRow = Database['public']['Tables']['oauth_states']['Row']

const normalizeProvider = (provider?: string) => {
  if (!provider) {
    return 'kommo'
  }

  return provider.trim().toLowerCase()
}

export type SaveCrmCredentialsInput = {
  orgId: string
  provider?: string
  clientId: string
  clientSecret: string
  redirectUri?: string | null
}

export const saveCrmCredentials = async (
  supabase: SupabaseClient<Database>,
  encryptionKey: string,
  input: SaveCrmCredentialsInput,
): Promise<CrmCredentialsRow> => {
  const provider = normalizeProvider(input.provider)
  const encryptedSecret = encryptSecret(input.clientSecret, encryptionKey)

  const { data, error } = await supabase
    .from(CREDENTIALS_TABLE)
    .upsert(
      {
        org_id: input.orgId,
        provider,
        client_id: input.clientId,
        client_secret: encryptedSecret,
        redirect_uri: input.redirectUri ?? null,
      },
      { onConflict: 'org_id,provider' },
    )
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Failed to save CRM credentials')
  }

  return data
}

export const getCrmCredentials = async (
  supabase: SupabaseClient<Database>,
  encryptionKey: string,
  orgId: string,
  provider?: string,
) => {
  const normalizedProvider = normalizeProvider(provider)

  const { data, error } = await supabase
    .from(CREDENTIALS_TABLE)
    .select('*')
    .eq('org_id', orgId)
    .eq('provider', normalizedProvider)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return {
    ...data,
    client_secret: decryptSecret(data.client_secret, encryptionKey),
  }
}

export const deleteCrmCredentials = async (
  supabase: SupabaseClient<Database>,
  orgId: string,
  provider?: string,
) => {
  const normalizedProvider = normalizeProvider(provider)

  const { error } = await supabase
    .from(CREDENTIALS_TABLE)
    .delete()
    .eq('org_id', orgId)
    .eq('provider', normalizedProvider)

  if (error) {
    throw error
  }
}

export type SaveCrmConnectionInput = {
  orgId: string
  provider?: string
  baseDomain: string
  accessToken: string
  refreshToken?: string | null
  expiresAt?: string | null
  scope?: string[] | null
  accountId?: string | null
  metadata?: Record<string, unknown>
}

export const saveCrmConnection = async (
  supabase: SupabaseClient<Database>,
  input: SaveCrmConnectionInput,
): Promise<CrmConnectionRow> => {
  const provider = normalizeProvider(input.provider)

  const { data, error } = await supabase
    .from(CONNECTIONS_TABLE)
    .upsert(
      {
        org_id: input.orgId,
        provider,
        base_domain: input.baseDomain,
        access_token: input.accessToken,
        refresh_token: input.refreshToken ?? null,
        expires_at: input.expiresAt ?? null,
        scope: input.scope ?? null,
        account_id: input.accountId ?? null,
        metadata: input.metadata ?? {},
      },
      { onConflict: 'org_id,provider,base_domain' },
    )
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Failed to save CRM connection')
  }

  return data
}

export const getCrmConnection = async (
  supabase: SupabaseClient<Database>,
  orgId: string,
  provider?: string,
) => {
  const normalizedProvider = normalizeProvider(provider)

  const { data, error } = await supabase
    .from(CONNECTIONS_TABLE)
    .select('*')
    .eq('org_id', orgId)
    .eq('provider', normalizedProvider)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export const getCrmConnectionById = async (
  supabase: SupabaseClient<Database>,
  connectionId: string,
) => {
  const { data, error } = await supabase
    .from(CONNECTIONS_TABLE)
    .select('*')
    .eq('id', connectionId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export const getCrmConnectionByBaseDomain = async (
  supabase: SupabaseClient<Database>,
  baseDomain: string,
  provider?: string,
) => {
  const normalizedProvider = normalizeProvider(provider)

  const { data, error } = await supabase
    .from(CONNECTIONS_TABLE)
    .select('*')
    .eq('provider', normalizedProvider)
    .eq('base_domain', baseDomain)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export const listCrmConnections = async (
  supabase: SupabaseClient<Database>,
  orgId: string,
  provider?: string,
) => {
  const normalizedProvider = provider ? normalizeProvider(provider) : null

  let query = supabase
    .from(CONNECTIONS_TABLE)
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (normalizedProvider) {
    query = query.eq('provider', normalizedProvider)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data ?? []
}

export const deleteCrmConnection = async (
  supabase: SupabaseClient<Database>,
  connectionId: string,
) => {
  const { error } = await supabase
    .from(CONNECTIONS_TABLE)
    .delete()
    .eq('id', connectionId)

  if (error) {
    throw error
  }
}

export type CreateCrmOAuthStateInput = {
  orgId: string
  provider?: string
  state: string
  redirectUri: string
  baseDomain: string
}

export const createCrmOAuthState = async (
  supabase: SupabaseClient<Database>,
  input: CreateCrmOAuthStateInput,
): Promise<CrmOAuthStateRow> => {
  const provider = normalizeProvider(input.provider)

  const { data, error } = await supabase
    .from(OAUTH_STATES_TABLE)
    .insert({
      org_id: input.orgId,
      provider,
      state: input.state,
      redirect_uri: input.redirectUri,
      base_domain: input.baseDomain,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Failed to create CRM OAuth state')
  }

  return data
}

export const consumeCrmOAuthState = async (
  supabase: SupabaseClient<Database>,
  provider: string,
  state: string,
) => {
  const normalizedProvider = normalizeProvider(provider)

  const { data, error } = await supabase
    .from(OAUTH_STATES_TABLE)
    .delete()
    .eq('provider', normalizedProvider)
    .eq('state', state)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}
