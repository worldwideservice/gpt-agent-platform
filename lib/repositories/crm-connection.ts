import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { KommoAPI, type KommoConfig } from '@/lib/crm/kommo'

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
  const supabase = getSupabaseServiceRoleClient()

  // Получаем connection
  const { data: connection, error: connectionError } = await supabase
    .from('crm_connections')
    .select('*')
    .eq('org_id', organizationId)
    .eq('provider', provider)
    .maybeSingle()

  if (connectionError) {
    console.error('Failed to fetch CRM connection', connectionError)
  }

  // Получаем credentials (для refresh token нужны, но не критичны для базовых операций)
  const { data: credentials, error: credentialsError } = await supabase
    .from('crm_credentials')
    .select('client_id, client_secret, redirect_uri')
    .eq('org_id', organizationId)
    .eq('provider', provider)
    .maybeSingle()

  if (credentialsError) {
    console.error('Failed to fetch CRM credentials', credentialsError)
  }

  return {
    connection: connection ? {
      id: connection.id,
      org_id: connection.org_id,
      provider: connection.provider,
      base_domain: connection.base_domain,
      access_token: connection.access_token,
      refresh_token: connection.refresh_token,
      expires_at: connection.expires_at,
    } : null,
    credentials: credentials ? {
      client_id: credentials.client_id,
      client_secret: credentials.client_secret, // Зашифрован, но для базовых операций не критично
      redirect_uri: credentials.redirect_uri,
    } : null,
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
    console.error('Failed to create KommoAPI for org', error)
    return null
  }
}

