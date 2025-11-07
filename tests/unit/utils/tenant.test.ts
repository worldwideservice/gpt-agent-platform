import { describe, it, expect } from 'vitest'
import { generateTenantId, parseTenantId, getTenantIdFromOrganization } from '@/lib/utils/tenant'

describe('Tenant Utils', () => {
  describe('generateTenantId', () => {
    it('should generate tenant-id from organization id and slug', () => {
      const organizationId = '00000000-0000-4000-8000-000000000456'
      const slug = 'test-organization'
      
      const tenantId = generateTenantId(organizationId, slug)
      
      expect(tenantId).toContain(slug)
      expect(tenantId).toMatch(/^\d+-test-organization$/)
    })

    it('should handle different organization IDs', () => {
      const orgId1 = '00000000-0000-4000-8000-000000000001'
      const orgId2 = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
      const slug = 'test-org'
      
      const tenantId1 = generateTenantId(orgId1, slug)
      const tenantId2 = generateTenantId(orgId2, slug)
      
      expect(tenantId1).not.toBe(tenantId2)
      expect(tenantId1).toMatch(/^\d+-test-org$/)
      expect(tenantId2).toMatch(/^\d+-test-org$/)
    })

    it('should handle slug with special characters', () => {
      const organizationId = '00000000-0000-4000-8000-000000000456'
      const slug = 'test-org-123'
      
      const tenantId = generateTenantId(organizationId, slug)
      
      expect(tenantId).toBe(`${tenantId.split('-')[0]}-test-org-123`)
    })
  })

  describe('parseTenantId', () => {
    it('should parse valid tenant-id', () => {
      const tenantId = '1234567-test-organization'
      const result = parseTenantId(tenantId)
      
      expect(result).not.toBeNull()
      expect(result?.slug).toBe('test-organization')
    })

    it('should parse tenant-id with multiple dashes in slug', () => {
      const tenantId = '1234567-test-org-123'
      const result = parseTenantId(tenantId)
      
      expect(result).not.toBeNull()
      expect(result?.slug).toBe('test-org-123')
    })

    it('should return null for invalid tenant-id format', () => {
      expect(parseTenantId('invalid')).toBeNull() // Нет дефиса
      expect(parseTenantId('')).toBeNull() // Пустая строка
      expect(parseTenantId('1234567')).toBeNull() // Нет дефиса
      // 'no-dash' имеет дефис, поэтому вернет { slug: 'dash' }, что валидно
    })

    it('should handle tenant-id with only numeric part', () => {
      const tenantId = '1234567-slug'
      const result = parseTenantId(tenantId)
      
      expect(result?.slug).toBe('slug')
    })
  })

  describe('getTenantIdFromOrganization', () => {
    it('should generate tenant-id from organization object', () => {
      const organization = {
        id: '00000000-0000-4000-8000-000000000456',
        slug: 'test-organization',
      }
      
      const tenantId = getTenantIdFromOrganization(organization)
      
      expect(tenantId).toContain('test-organization')
      expect(tenantId).toMatch(/^\d+-test-organization$/)
    })

    it('should work with different organization objects', () => {
      const org1 = {
        id: '00000000-0000-4000-8000-000000000001',
        slug: 'org-1',
      }
      const org2 = {
        id: '00000000-0000-4000-8000-000000000002',
        slug: 'org-2',
      }
      
      const tenantId1 = getTenantIdFromOrganization(org1)
      const tenantId2 = getTenantIdFromOrganization(org2)
      
      expect(tenantId1).not.toBe(tenantId2)
      expect(tenantId1).toContain('org-1')
      expect(tenantId2).toContain('org-2')
    })
  })
})

