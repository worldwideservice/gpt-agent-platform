import { describe, it, expect, beforeEach, vi } from 'vitest'

import { getIntegrationOverview } from '@/lib/services/integrations'
import { cloneTables, createInMemorySupabaseClient } from '@/tests/integration/support/inMemorySupabase'

const ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001'

const getClientMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: getClientMock,
}))

const now = new Date().toISOString()

const baseTables = {
  crm_connections: [
    {
      id: 'connection-1',
      org_id: ORGANIZATION_ID,
      provider: 'kommo',
      base_domain: 'example.amocrm.ru',
      access_token: 'token',
      refresh_token: 'refresh',
      expires_at: now,
      scope: null,
      account_id: null,
      metadata: {},
      created_at: now,
      updated_at: now,
    },
  ],
  crm_credentials: [
    {
      id: 'credentials-1',
      org_id: ORGANIZATION_ID,
      provider: 'kommo',
      client_id: 'client-id',
      client_secret: 'client-secret',
      redirect_uri: 'https://example.com/callback',
      created_at: now,
      updated_at: now,
    },
  ],
}

describe('IntegrationsService integration', () => {
  beforeEach(() => {
    getClientMock.mockReset()
    const client = createInMemorySupabaseClient(cloneTables(baseTables))
    getClientMock.mockReturnValue(client)
  })

  it('returns overview with connection and credentials', async () => {
    const overview = await getIntegrationOverview(ORGANIZATION_ID)

    expect(overview.provider).toBe('kommo')
    expect(overview.connected).toBe(true)
    expect(overview.connection).toMatchObject({
      base_domain: 'example.amocrm.ru',
      access_token: 'token',
    })
    expect(overview.credentials).toMatchObject({
      client_id: 'client-id',
      client_secret: 'client-secret',
    })
  })

  it('handles missing connection gracefully', async () => {
    const client = createInMemorySupabaseClient(
      cloneTables({ crm_connections: [], crm_credentials: [] }),
    )
    getClientMock.mockReturnValue(client)

    const overview = await getIntegrationOverview(ORGANIZATION_ID)

    expect(overview.connected).toBe(false)
    expect(overview.connection).toBeNull()
    expect(overview.credentials).toBeNull()
  })

  it('wraps repository errors into domain error', async () => {
    getClientMock.mockImplementation(() => {
      throw new Error('Supabase down')
    })

    await expect(getIntegrationOverview(ORGANIZATION_ID)).rejects.toThrow(
      'Не удалось загрузить данные интеграции',
    )
  })
})
