import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { KommoAPI, type KommoConfig } from '@/lib/crm/kommo'
import { logger } from '@/lib/utils/logger'
import { safeDecrypt, encrypt } from '@/lib/crypto/encryption'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemo = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemo(process.env.DEMO_MODE) ||
  matchesDemo(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemo(process.env.PLAYWRIGHT_DEMO_MODE)

export interface CrmConnectionData {
 connection: {
 id: string
 org_id: string
 provider: string
 base_domain: string
 access_token: string
 refresh_token: string | null
 expires_at: string | null
 } | null
 credentials: {
 client_id: string
 client_secret: string
 redirect_uri: string | null
 } | null
}

/**
 * Получает CRM connection и credentials для организации
 * Для получения расшифрованного client_secret нужен encryption key
 * Но для создания KommoAPI достаточно connection (access_token)
 */
export const getCrmConnectionData = async (
  organizationId: string,
  provider: string = 'kommo',
): Promise<CrmConnectionData> => {
  const isDemoMode = isDemoEnvironment()

  if (isDemoMode) {
    return {
      connection: {
        id: `demo-${provider}-connection`,
        org_id: organizationId,
        provider,
        base_domain: process.env.KOMMO_DOMAIN ?? 'demo.kommo.com',
        access_token: process.env.KOMMO_ACCESS_TOKEN ?? 'demo-access-token',
        refresh_token: process.env.KOMMO_REFRESH_TOKEN ?? 'demo-refresh-token',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      credentials: {
        client_id: process.env.KOMMO_CLIENT_ID ?? 'demo-client-id',
        client_secret: process.env.KOMMO_CLIENT_SECRET ?? 'demo-client-secret',
        redirect_uri: process.env.KOMMO_REDIRECT_URI ?? 'https://demo.kommo/callback',
      },
    }
  }

  const supabase = getSupabaseServiceRoleClient()

  // Получаем connection
  const { data: connection, error: connectionError } = await supabase
    .from('crm_connections')
    .select('*')
    .eq('org_id', organizationId)
    .eq('provider', provider)
    .maybeSingle()

  if (connectionError) {
    logger.error('Failed to fetch CRM connection', connectionError)
  }

  // Получаем credentials (для refresh token нужны, но не критичны для базовых операций)
  const { data: credentials, error: credentialsError } = await supabase
    .from('crm_credentials')
    .select('client_id, client_secret, redirect_uri')
    .eq('org_id', organizationId)
    .eq('provider', provider)
    .maybeSingle()

  if (credentialsError) {
    logger.error('Failed to fetch CRM credentials', credentialsError)
  }

  return {
    connection: connection
      ? {
          id: connection.id,
          org_id: connection.org_id,
          provider: connection.provider,
          base_domain: connection.base_domain,
          // Decrypt tokens when reading from database
          access_token: safeDecrypt(connection.access_token) || '',
          refresh_token: safeDecrypt(connection.refresh_token),
          expires_at: connection.expires_at,
        }
      : null,
    credentials: credentials
      ? {
          client_id: credentials.client_id,
          // Decrypt client_secret when reading from database
          client_secret: safeDecrypt(credentials.client_secret) || '',
          redirect_uri: credentials.redirect_uri,
        }
      : null,
  }
}

/**
 * Создает экземпляр KommoAPI для организации
 */
export const createKommoApiForOrg = async (
  organizationId: string,
): Promise<KommoAPI | null> => {
  try {
 const { connection, credentials } = await getCrmConnectionData(organizationId, 'kommo')

 if (!connection || !connection.access_token) {
 return null
 }

 // Для работы с Kommo API достаточно connection (access_token)
 // credentials нужны только для refresh token, но не критичны для получения данных
 const config: KommoConfig = {
 domain: connection.base_domain,
 clientId: credentials?.client_id || process.env.KOMMO_CLIENT_ID || '',
 clientSecret: credentials?.client_secret || process.env.KOMMO_CLIENT_SECRET || '',
 redirectUri: credentials?.redirect_uri || process.env.KOMMO_REDIRECT_URI || '',
 accessToken: connection.access_token,
 refreshToken: connection.refresh_token,
 }

 return new KommoAPI(config)
 } catch (error) {
 logger.error('Failed to create KommoAPI for org', error)
 return null
 }
}

/**
 * Update CRM connection tokens (encrypts automatically)
 */
export const updateCrmConnectionTokens = async (
  connectionId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: string | null
): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('crm_connections')
    .update({
      access_token: encrypt(accessToken),
      refresh_token: refreshToken ? encrypt(refreshToken) : null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', connectionId)

  if (error) {
    logger.error('Failed to update CRM connection tokens', error, { connectionId })
    throw new Error('Failed to update tokens')
  }

  logger.info('CRM connection tokens updated', { connectionId })
}

/**
 * Save new CRM connection with encrypted tokens
 */
export const saveCrmConnection = async (params: {
  orgId: string
  provider: string
  baseDomain: string
  accessToken: string
  refreshToken: string | null
  expiresAt: string | null
}): Promise<string> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('crm_connections')
    .insert({
      org_id: params.orgId,
      provider: params.provider,
      base_domain: params.baseDomain,
      access_token: encrypt(params.accessToken),
      refresh_token: params.refreshToken ? encrypt(params.refreshToken) : null,
      expires_at: params.expiresAt,
    })
    .select('id')
    .single()

  if (error || !data) {
    logger.error('Failed to save CRM connection', error)
    throw new Error('Failed to save CRM connection')
  }

  logger.info('CRM connection saved', { connectionId: data.id, provider: params.provider })
  return data.id
}

/**
 * Save CRM credentials with encrypted client_secret
 */
export const saveCrmCredentials = async (params: {
  orgId: string
  provider: string
  clientId: string
  clientSecret: string
  redirectUri: string | null
}): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('crm_credentials')
    .insert({
      org_id: params.orgId,
      provider: params.provider,
      client_id: params.clientId,
      client_secret: encrypt(params.clientSecret),
      redirect_uri: params.redirectUri,
    })

  if (error) {
    logger.error('Failed to save CRM credentials', error)
    throw new Error('Failed to save CRM credentials')
  }

  logger.info('CRM credentials saved', { provider: params.provider })
}
