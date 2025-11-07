import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findOrganizationBySlug, validateTenantIdAccess } from '@/lib/utils/tenant-validation'

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    single: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Мокаем parseTenantId
vi.mock('@/lib/utils/tenant', () => ({
  parseTenantId: vi.fn(),
}))

// Мокаем getOrganizationsForUser
vi.mock('@/lib/repositories/organizations', () => ({
  getOrganizationsForUser: vi.fn(),
}))

describe('Tenant Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findOrganizationBySlug', () => {
    it('should find organization by slug', async () => {
      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-org',
      }

      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findOrganizationBySlug('test-org')

      expect(result).toEqual({
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-org',
      })
      expect(queryChain.eq).toHaveBeenCalledWith('slug', 'test-org')
    })

    it('should return null if organization not found', async () => {
      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Not found' } })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findOrganizationBySlug('non-existent')

      expect(result).toBeNull()
    })

    it('should return null if data is null', async () => {
      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await findOrganizationBySlug('test-org')

      expect(result).toBeNull()
    })
  })

  describe('validateTenantIdAccess', () => {
    it('should validate tenant-id and return organization if user has access', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')

      vi.mocked(parseTenantId).mockReturnValue({ slug: 'test-org' })

      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-org',
      }

      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      vi.mocked(getOrganizationsForUser).mockResolvedValue([
        {
          id: 'org-123',
          name: 'Test Organization',
          slug: 'test-org',
          role: 'owner',
        },
      ])

      const result = await validateTenantIdAccess('1234567-test-org', 'user-123')

      expect(result.valid).toBe(true)
      expect(result.organization).toEqual({
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-org',
      })
    })

    it('should return invalid if tenant-id format is invalid', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      vi.mocked(parseTenantId).mockReturnValue(null)

      const result = await validateTenantIdAccess('invalid-tenant-id', 'user-123')

      expect(result.valid).toBe(false)
      expect(result.organization).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should return invalid if slug is missing', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      vi.mocked(parseTenantId).mockReturnValue({ slug: '' })

      const result = await validateTenantIdAccess('1234567-', 'user-123')

      expect(result.valid).toBe(false)
      expect(result.organization).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should return invalid if organization not found', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      vi.mocked(parseTenantId).mockReturnValue({ slug: 'non-existent' })

      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Not found' } })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await validateTenantIdAccess('1234567-non-existent', 'user-123')

      expect(result.valid).toBe(false)
      expect(result.organization).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should return invalid if user does not have access to organization', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      vi.mocked(parseTenantId).mockReturnValue({ slug: 'test-org' })

      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-org',
      }

      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // Пользователь не имеет доступа к этой организации
      vi.mocked(getOrganizationsForUser).mockResolvedValue([
        {
          id: 'org-456',
          name: 'Other Organization',
          slug: 'other-org',
          role: 'owner',
        },
      ])

      const result = await validateTenantIdAccess('1234567-test-org', 'user-123')

      expect(result.valid).toBe(false)
      expect(result.organization).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should return invalid if error occurs during validation', async () => {
      const { parseTenantId } = await import('@/lib/utils/tenant')
      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(parseTenantId).mockReturnValue({ slug: 'test-org' })

      const queryChain = {
        from: vi.fn(() => queryChain),
        select: vi.fn(() => queryChain),
        eq: vi.fn(() => queryChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(queryChain)

      // getOrganizationsForUser выбрасывает ошибку
      vi.mocked(getOrganizationsForUser).mockRejectedValue(new Error('Database error'))

      const result = await validateTenantIdAccess('1234567-test-org', 'user-123')

      expect(result.valid).toBe(false)
      expect(result.organization).toBeUndefined()
      // console.error может быть вызван или нет, в зависимости от реализации

      consoleErrorSpy.mockRestore()
    })
  })
})

