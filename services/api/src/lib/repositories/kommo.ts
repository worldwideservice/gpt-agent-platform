import type { SupabaseClient } from '@supabase/supabase-js'

import {
  createCrmOAuthState,
  consumeCrmOAuthState,
  deleteCrmCredentials,
  getCrmConnection,
  getCrmConnectionByBaseDomain,
  getCrmCredentials,
  saveCrmConnection,
  saveCrmCredentials,
  type CreateCrmOAuthStateInput,
  type SaveCrmConnectionInput,
  type SaveCrmCredentialsInput,
} from './crm'
import type { Database } from '../types'

const DEFAULT_PROVIDER = 'kommo'

type KommoCredentialsInput = Omit<SaveCrmCredentialsInput, 'provider'> & { provider?: string }
type KommoConnectionInput = Omit<SaveCrmConnectionInput, 'provider'> & { provider?: string }

type KommoOAuthStateInput = Omit<CreateCrmOAuthStateInput, 'provider'> & { provider?: string }

type KommoCredentialsRow = Database['public']['Tables']['crm_credentials']['Row']
type KommoConnectionRow = Database['public']['Tables']['crm_connections']['Row']

type KommoOAuthStateRow = Database['public']['Tables']['oauth_states']['Row']

export const saveKommoCredentials = async (
  supabase: SupabaseClient<Database>,
  encryptionKey: string,
  input: KommoCredentialsInput,
): Promise<KommoCredentialsRow> => {
  return saveCrmCredentials(supabase, encryptionKey, {
    ...input,
    provider: input.provider ?? DEFAULT_PROVIDER,
  })
}

export const getKommoCredentials = async (
  supabase: SupabaseClient<Database>,
  encryptionKey: string,
  orgId: string,
  provider: string = DEFAULT_PROVIDER,
) => {
  return getCrmCredentials(supabase, encryptionKey, orgId, provider)
}

export const removeKommoCredentials = async (
  supabase: SupabaseClient<Database>,
  orgId: string,
  provider: string = DEFAULT_PROVIDER,
) => {
  await deleteCrmCredentials(supabase, orgId, provider)
}

export const saveKommoConnection = async (
  supabase: SupabaseClient<Database>,
  input: KommoConnectionInput,
): Promise<KommoConnectionRow> => {
  return saveCrmConnection(supabase, {
    ...input,
    provider: input.provider ?? DEFAULT_PROVIDER,
  })
}

export const getKommoConnection = async (
  supabase: SupabaseClient<Database>,
  orgId: string,
  provider: string = DEFAULT_PROVIDER,
) => {
  return getCrmConnection(supabase, orgId, provider)
}

export const getKommoConnectionByBaseDomain = async (
  supabase: SupabaseClient<Database>,
  baseDomain: string,
  provider: string = DEFAULT_PROVIDER,
) => {
  return getCrmConnectionByBaseDomain(supabase, baseDomain, provider)
}

export const createOAuthState = async (
  supabase: SupabaseClient<Database>,
  input: KommoOAuthStateInput,
): Promise<KommoOAuthStateRow> => {
  return createCrmOAuthState(supabase, {
    ...input,
    provider: input.provider ?? DEFAULT_PROVIDER,
  })
}

export const consumeOAuthState = async (
  supabase: SupabaseClient<Database>,
  provider: string,
  state: string,
) => {
  return consumeCrmOAuthState(supabase, provider ?? DEFAULT_PROVIDER, state)
}
