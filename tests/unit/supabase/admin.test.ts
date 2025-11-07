import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем зависимости
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })),
}))

vi.mock('@/lib/env/supabase', () => ({
  loadSupabaseServerEnv: vi.fn(),
}))

describe('Supabase Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Очищаем кэш клиента перед каждым тестом
    vi.resetModules()
  })

  it('should create and return Supabase service role client', async () => {
    const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')
    const { createClient } = await import('@supabase/supabase-js')

    vi.mocked(loadSupabaseServerEnv).mockReturnValue({
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    })

    const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

    const client = getSupabaseServiceRoleClient()

    expect(client).toBeDefined()
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-service-role-key',
      expect.objectContaining({
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }),
    )
  })

  it('should return cached client on subsequent calls', async () => {
    const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')
    const { createClient } = await import('@supabase/supabase-js')

    vi.mocked(loadSupabaseServerEnv).mockReturnValue({
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    })

    const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

    const client1 = getSupabaseServiceRoleClient()
    const client2 = getSupabaseServiceRoleClient()

    expect(client1).toBe(client2)
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('should use environment variables from loadSupabaseServerEnv', async () => {
    const { loadSupabaseServerEnv } = await import('@/lib/env/supabase')
    const { createClient } = await import('@supabase/supabase-js')

    vi.mocked(loadSupabaseServerEnv).mockReturnValue({
      SUPABASE_URL: 'https://custom.supabase.co',
      SUPABASE_ANON_KEY: 'custom-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'custom-service-role-key',
      SUPABASE_DEFAULT_ORGANIZATION_ID: '00000000-0000-4000-8000-000000000001',
    })

    const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

    getSupabaseServiceRoleClient()

    expect(createClient).toHaveBeenCalledWith(
      'https://custom.supabase.co',
      'custom-service-role-key',
      expect.any(Object),
    )
  })
})


