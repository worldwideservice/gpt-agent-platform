import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCrmConnectionData, createKommoApiForOrg } from '@/lib/repositories/crm-connection'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    eq: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('CRM Connection Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseClient.from.mockImplementation(() => createMockQuery())
  })

  describe('getCrmConnectionData', () => {
    it('should return CRM connection data', async () => {
      const mockConnection = {
        id: 'conn-123',
        org_id: 'org-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: '2025-12-31T23:59:59Z',
      }

      const mockCredentials = {
        client_id: 'client-123',
        client_secret: 'secret-123',
        redirect_uri: 'https://example.com/callback',
      }

      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: mockConnection, error: null })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: mockCredentials, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await getCrmConnectionData('org-123', 'kommo')

      expect(result).toBeDefined()
      expect(result.connection?.id).toBe('conn-123')
      expect(result.connection?.provider).toBe('kommo')
      expect(result.connection?.access_token).toBe('token-123')
      expect(result.credentials?.client_id).toBe('client-123')
    })

    it('should return null connection if not found', async () => {
      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await getCrmConnectionData('org-123', 'kommo')

      expect(result.connection).toBeNull()
      expect(result.credentials).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await getCrmConnectionData('org-123', 'kommo')

      expect(result.connection).toBeNull()
    })
  })

  describe('createKommoApiForOrg', () => {
    it('should create KommoAPI instance successfully', async () => {
      const mockConnection = {
        id: 'conn-123',
        org_id: 'org-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: '2025-12-31T23:59:59Z',
      }

      const mockCredentials = {
        client_id: 'client-123',
        client_secret: 'secret-123',
        redirect_uri: 'https://example.com/callback',
      }

      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: mockConnection, error: null })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: mockCredentials, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await createKommoApiForOrg('org-123')

      expect(result).toBeDefined()
      expect(result).not.toBeNull()
    })

    it('should return null if connection not found', async () => {
      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await createKommoApiForOrg('org-123')

      expect(result).toBeNull()
    })

    it('should return null if access_token missing', async () => {
      const mockConnection = {
        id: 'conn-123',
        org_id: 'org-123',
        provider: 'kommo',
        base_domain: 'test.kommo.com',
        access_token: null,
        refresh_token: 'refresh-123',
        expires_at: '2025-12-31T23:59:59Z',
      }

      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockResolvedValue({ data: mockConnection, error: null })

      const credentialsQuery = createMockQuery()
      credentialsQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

      mockSupabaseClient.from
        .mockReturnValueOnce(connectionQuery)
        .mockReturnValueOnce(credentialsQuery)

      const result = await createKommoApiForOrg('org-123')

      expect(result).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const connectionQuery = createMockQuery()
      connectionQuery.maybeSingle.mockRejectedValue(new Error('Database error'))

      mockSupabaseClient.from.mockReturnValue(connectionQuery)

      const result = await createKommoApiForOrg('org-123')

      expect(result).toBeNull()
    })
  })
})
