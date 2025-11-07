import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTenantIdFromSession, redirectToTenantPath } from '@/lib/utils/getTenantRedirect'

// Мокаем зависимости
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/repositories/organizations', () => ({
  getOrganizationsForUser: vi.fn(),
}))

vi.mock('@/lib/utils/tenant', () => ({
  generateTenantId: vi.fn(),
}))

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

vi.mock('@/lib/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    performance: vi.fn(),
  },
}))

vi.mock('@/lib/utils/tenant-cache', () => ({
  tenantCache: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))


vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

describe('getTenantRedirect Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTenantIdFromSession', () => {
    it('should return tenant-id from session', async () => {
      const { auth } = await import('@/auth')
      const { getOrganizationsForUser } = await import('@/lib/repositories/organizations')
      const { generateTenantId } = await import('@/lib/utils/tenant')
      const { tenantCache } = await import('@/lib/utils/tenant-cache')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(tenantCache.get).mockReturnValue(null)
      vi.mocked(getOrganizationsForUser).mockResolvedValue([
        {
          id: 'org-123',
          name: 'Test Org',
          slug: 'test-org',
        },
      ] as any)

      vi.mocked(generateTenantId).mockReturnValue('123-test-org')

      const result = await getTenantIdFromSession()

      expect(result).toBe('123-test-org')
    })

    it('should return null if no session', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const result = await getTenantIdFromSession()

      expect(result).toBeNull()
    })

    it('should return cached tenant-id if available', async () => {
      const { auth } = await import('@/auth')
      const { tenantCache } = await import('@/lib/utils/tenant-cache')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(tenantCache.get).mockReturnValue('cached-tenant-id')

      const result = await getTenantIdFromSession()

      expect(result).toBe('cached-tenant-id')
    })
  })

  describe('redirectToTenantPath', () => {
    it('should redirect to tenant path', async () => {
      const { redirect } = await import('next/navigation')
      const { auth } = await import('@/auth')
      const { tenantCache } = await import('@/lib/utils/tenant-cache')
      const { generateTenantId } = await import('@/lib/utils/tenant')
      
      // Мокаем зависимости getTenantIdFromSession чтобы вернуть нужное значение
      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)
      vi.mocked(tenantCache.get).mockReturnValue('123-test-org')
      vi.mocked(generateTenantId).mockReturnValue('123-test-org')

      try {
        await redirectToTenantPath('/dashboard')
      } catch (e) {
        // redirect throws, so we catch it
      }

      expect(redirect).toHaveBeenCalledWith('/manage/123-test-org/dashboard')
    })

    it('should redirect to fallback if no tenant-id', async () => {
      const { redirect } = await import('next/navigation')
      const { auth } = await import('@/auth')
      
      // Мокаем auth чтобы вернуть null (нет сессии)
      vi.mocked(auth).mockResolvedValue(null)

      try {
        await redirectToTenantPath('/dashboard', '/login')
      } catch (e) {
        // redirect throws, so we catch it
      }

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})

