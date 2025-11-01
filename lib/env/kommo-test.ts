import type { KommoConfig } from '@/lib/crm/kommo'

type DisabledState = {
  enabled: false
  status: number
  message: string
  missing?: string[]
}

type EnabledState = {
  enabled: true
  config: KommoConfig
}

export type KommoTestState = DisabledState | EnabledState

const variableMap: Array<{ env: string; key: keyof KommoConfig }> = [
  { env: 'KOMMO_TEST_DOMAIN', key: 'domain' },
  { env: 'KOMMO_TEST_CLIENT_ID', key: 'clientId' },
  { env: 'KOMMO_TEST_CLIENT_SECRET', key: 'clientSecret' },
  { env: 'KOMMO_TEST_REDIRECT_URI', key: 'redirectUri' },
  { env: 'KOMMO_TEST_ACCESS_TOKEN', key: 'accessToken' },
]

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === '1' || normalized === 'true'
}

const collectMissingVariables = (): string[] => {
  return variableMap
    .map(({ env }) => {
      const value = process.env[env]
      return !value || value.trim() === '' ? env : null
    })
    .filter(Boolean) as string[]
}

const buildConfigFromEnv = (): KommoConfig => ({
  domain: process.env.KOMMO_TEST_DOMAIN!,
  clientId: process.env.KOMMO_TEST_CLIENT_ID!,
  clientSecret: process.env.KOMMO_TEST_CLIENT_SECRET!,
  redirectUri: process.env.KOMMO_TEST_REDIRECT_URI!,
  accessToken: process.env.KOMMO_TEST_ACCESS_TOKEN!,
  refreshToken: process.env.KOMMO_TEST_REFRESH_TOKEN ?? null,
})

/**
 * Evaluates the Kommo test configuration and returns either a ready-to-use config
 * or a detailed disabled state describing why testing is unavailable.
 */
export const evaluateKommoTestConfig = (): KommoTestState => {
  const isProduction = process.env.NODE_ENV === 'production'
  const enabled = parseBoolean(process.env.KOMMO_TEST_ENABLED)

  if (isProduction && !enabled) {
    return {
      enabled: false,
      status: 403,
      message: 'Kommo test endpoint is disabled in production.',
    }
  }

  if (!enabled) {
    return {
      enabled: false,
      status: 503,
      message: 'Kommo test endpoint is disabled.',
    }
  }

  const missing = collectMissingVariables()

  if (missing.length > 0) {
    return {
      enabled: false,
      status: 400,
      message: 'Kommo test credentials are not fully configured.',
      missing,
    }
  }

  return {
    enabled: true,
    config: buildConfigFromEnv(),
  }
}

export const kommoTestRequiredEnvKeys = variableMap.map(({ env }) => env)
