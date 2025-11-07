import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Supabase Environment', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('loadSupabaseServerEnv', () => {
    it('should load valid server environment variables', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      const env = loadSupabaseServerEnv()

      expect(env.SUPABASE_URL).toBe('https://test.supabase.co')
      expect(env.SUPABASE_ANON_KEY).toBe('test-anon-key')
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe('test-service-role-key')
      expect(env.SUPABASE_DEFAULT_ORGANIZATION_ID).toBeUndefined()
    })

    it('should include optional SUPABASE_DEFAULT_ORGANIZATION_ID if provided', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
      process.env.SUPABASE_DEFAULT_ORGANIZATION_ID = '00000000-0000-4000-8000-000000000001'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      const env = loadSupabaseServerEnv()

      expect(env.SUPABASE_DEFAULT_ORGANIZATION_ID).toBe('00000000-0000-4000-8000-000000000001')
    })

    it('should ignore empty SUPABASE_DEFAULT_ORGANIZATION_ID', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
      process.env.SUPABASE_DEFAULT_ORGANIZATION_ID = '   '

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      const env = loadSupabaseServerEnv()

      expect(env.SUPABASE_DEFAULT_ORGANIZATION_ID).toBeUndefined()
    })

    it('should throw error if SUPABASE_URL is missing', async () => {
      delete process.env.SUPABASE_URL
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseServerEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if SUPABASE_URL is invalid URL', async () => {
      process.env.SUPABASE_URL = 'not-a-url'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseServerEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if SUPABASE_ANON_KEY is missing', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      delete process.env.SUPABASE_ANON_KEY
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseServerEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if SUPABASE_SERVICE_ROLE_KEY is missing', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      delete process.env.SUPABASE_SERVICE_ROLE_KEY

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseServerEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if SUPABASE_DEFAULT_ORGANIZATION_ID is invalid UUID', async () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
      process.env.SUPABASE_DEFAULT_ORGANIZATION_ID = 'invalid-uuid'

      const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseServerEnv()).toThrow('Supabase environment validation failed')
    })
  })

  describe('loadSupabaseClientEnv', () => {
    it('should load valid client environment variables', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

      const { loadSupabaseClientEnv } = await import('@/lib/env/supabase')

      const env = loadSupabaseClientEnv()

      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
    })

    it('should throw error if NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

      const { loadSupabaseClientEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseClientEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if NEXT_PUBLIC_SUPABASE_URL is invalid URL', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-url'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

      const { loadSupabaseClientEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseClientEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const { loadSupabaseClientEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseClientEnv()).toThrow('Supabase environment validation failed')
    })

    it('should throw error if NEXT_PUBLIC_SUPABASE_ANON_KEY is empty', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ''

      const { loadSupabaseClientEnv } = await import('@/lib/env/supabase')

      expect(() => loadSupabaseClientEnv()).toThrow('Supabase environment validation failed')
    })
  })
})

