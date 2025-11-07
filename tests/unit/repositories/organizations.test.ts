import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'test-id-123'),
}))

// Мокаем slugify
vi.mock('@/lib/utils', () => ({
  slugify: vi.fn((str: string) => str.toLowerCase().replace(/\s+/g, '-')),
}))

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    order: vi.fn(() => query),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('Organizations Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createOrganizationWithOwner', () => {
    it('should create organization with unique slug', async () => {
      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-organization',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      // Проверка уникальности slug (не найден)
      const checkSlugQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      // Создание организации
      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      // Добавление владельца
      const addMemberChain = {
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      // Обновление пользователя
      const updateUserChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery) // проверка slug
        .mockReturnValueOnce(createOrgChain) // создание организации
        .mockReturnValueOnce(addMemberChain) // добавление владельца
        .mockReturnValueOnce(updateUserChain) // обновление пользователя

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      const result = await createOrganizationWithOwner({
        name: 'Test Organization',
        ownerId: 'user-123',
      })

      expect(result.id).toBe('org-123')
      expect(result.name).toBe('Test Organization')
      expect(result.slug).toBe('test-organization')
    })

    it('should generate unique slug if slug already exists', async () => {
      const { nanoid } = await import('nanoid')
      vi.mocked(nanoid).mockReturnValueOnce('test-id').mockReturnValueOnce('unique-id')

      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-organization-unique-id',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      // Первая проверка - slug существует
      const checkSlugQuery1: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: { id: 'existing-org' }, error: null })),
      }

      // Вторая проверка - новый slug уникален
      const checkSlugQuery2: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      const addMemberChain = {
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const updateUserChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery1) // первая проверка - существует
        .mockReturnValueOnce(checkSlugQuery2) // вторая проверка - уникален
        .mockReturnValueOnce(createOrgChain)
        .mockReturnValueOnce(addMemberChain)
        .mockReturnValueOnce(updateUserChain)

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      const result = await createOrganizationWithOwner({
        name: 'Test Organization',
        ownerId: 'user-123',
      })

      expect(result.slug).toBe('test-organization-unique-id')
    })

    it('should throw error if organization creation fails', async () => {
      const checkSlugQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery)
        .mockReturnValueOnce(createOrgChain)

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      await expect(
        createOrganizationWithOwner({
          name: 'Test Organization',
          ownerId: 'user-123',
        }),
      ).rejects.toThrow()
    })

    it('should throw error if organization data is null after creation', async () => {
      const checkSlugQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })), // Нет ошибки, но data = null
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery)
        .mockReturnValueOnce(createOrgChain)

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      await expect(
        createOrganizationWithOwner({
          name: 'Test Organization',
          ownerId: 'user-123',
        }),
      ).rejects.toThrow('Failed to create organization')
    })

    it('should throw error if member creation fails', async () => {
      const mockOrganization = {
        id: 'org-123',
        name: 'Test Organization',
        slug: 'test-organization',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const checkSlugQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      const addMemberChain = {
        insert: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Member error' } })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery)
        .mockReturnValueOnce(createOrgChain)
        .mockReturnValueOnce(addMemberChain)

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      await expect(
        createOrganizationWithOwner({
          name: 'Test Organization',
          ownerId: 'user-123',
        }),
      ).rejects.toThrow()
    })

    it('should handle empty name and generate slug from nanoid', async () => {
      const { nanoid } = await import('nanoid')
      const { slugify } = await import('@/lib/utils')
      
      vi.mocked(nanoid).mockReturnValueOnce('test-id').mockReturnValueOnce('unique-id')
      vi.mocked(slugify).mockReturnValue('') // Пустой slug

      const mockOrganization = {
        id: 'org-123',
        name: '',
        slug: 'org-test-id',
        created_at: '2025-01-26T00:00:00Z',
        updated_at: '2025-01-26T00:00:00Z',
      }

      const checkSlugQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const createOrgChain = {
        insert: vi.fn(() => createOrgChain),
        select: vi.fn(() => createOrgChain),
        single: vi.fn(() => Promise.resolve({ data: mockOrganization, error: null })),
      }

      const addMemberChain = {
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      const updateUserChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(checkSlugQuery)
        .mockReturnValueOnce(createOrgChain)
        .mockReturnValueOnce(addMemberChain)
        .mockReturnValueOnce(updateUserChain)

      const { createOrganizationWithOwner } = await import('@/lib/repositories/organizations')

      const result = await createOrganizationWithOwner({
        name: '',
        ownerId: 'user-123',
      })

      expect(result.slug).toBe('org-test-id')
    })
  })

  describe('getOrganizationsForUser', () => {
    it('should return organizations for user', async () => {
      const mockData = [
        {
          role: 'owner',
          organizations: {
            id: 'org-1',
            name: 'Organization 1',
            slug: 'org-1',
          },
        },
        {
          role: 'member',
          organizations: {
            id: 'org-2',
            name: 'Organization 2',
            slug: 'org-2',
          },
        },
      ]

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: mockData, error: null }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')

      const result = await getOrganizationsForUser('user-123')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('org-1')
      expect(result[0].name).toBe('Organization 1')
      expect(result[1].id).toBe('org-2')
    })

    it('should throw error on database error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        order: vi.fn(function (this: any) {
          return this
        }),
        then: vi.fn((resolve) => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve)
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')

      await expect(getOrganizationsForUser('user-123')).rejects.toThrow()
    })
  })

  describe('ensureUserMembership', () => {
    it('should return membership data', async () => {
      const mockMembership = {
        role: 'member',
      }

      const checkMembershipQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: mockMembership, error: null })),
      }

      mockSupabaseClient.from.mockReturnValueOnce(checkMembershipQuery)

      const { ensureUserMembership } = await import('@/lib/repositories/organizations')

      const result = await ensureUserMembership('user-123', 'org-123')

      expect(result).toEqual(mockMembership)
      expect(checkMembershipQuery.eq).toHaveBeenCalledTimes(3) // user_id, org_id, status
    })

    it('should throw error on database error', async () => {
      const checkMembershipQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from.mockReturnValueOnce(checkMembershipQuery)

      const { ensureUserMembership } = await import('@/lib/repositories/organizations')

      await expect(ensureUserMembership('user-123', 'org-123')).rejects.toThrow()
    })
  })

  describe('setDefaultOrganizationForUser', () => {
    it('should set default organization for user', async () => {
      const updateChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(updateChain)

      const { setDefaultOrganizationForUser } = await import('@/lib/repositories/organizations')

      await setDefaultOrganizationForUser('user-123', 'org-123')

      expect(updateChain.update).toHaveBeenCalledWith({ default_org_id: 'org-123' })
      expect(updateChain.eq).toHaveBeenCalledWith('id', 'user-123')
    })

    it('should throw error on update failure', async () => {
      const updateChain: any = {
        update: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Update error' } })),
      }

      mockSupabaseClient.from.mockReturnValue(updateChain)

      const { setDefaultOrganizationForUser } = await import('@/lib/repositories/organizations')

      await expect(setDefaultOrganizationForUser('user-123', 'org-123')).rejects.toThrow()
    })
  })
})

