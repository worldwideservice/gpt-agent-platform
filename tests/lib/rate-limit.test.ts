import { beforeEach, describe, expect, it, vi } from 'vitest'

const getUserTierMock = vi.fn()

vi.mock('@/lib/repositories/users', () => ({
  UserRepository: {
    getUserTier: getUserTierMock,
  },
}))

describe('rate-limit utils', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useRealTimers()
    getUserTierMock.mockReset()
  })

  it('ограничивает количество запросов в памяти', async () => {
    const { rateLimit } = await import('@/lib/rate-limit')
    const config = { window: '1m', max: 2 } as const

    const first = await rateLimit('user-1', config)
    const second = await rateLimit('user-1', config)
    const third = await rateLimit('user-1', config)

    expect(first.success).toBe(true)
    expect(second.success).toBe(true)
    expect(third.success).toBe(false)
    expect(third.remaining).toBe(0)
  })

  it('сбрасывает счётчик после истечения окна', async () => {
    vi.useFakeTimers()
    const { rateLimit } = await import('@/lib/rate-limit')
    const config = { window: '1s', max: 1 } as const

    const first = await rateLimit('user-1', config)
    expect(first.success).toBe(true)

    vi.advanceTimersByTime(1000)

    const second = await rateLimit('user-1', config)
    expect(second.success).toBe(true)

    vi.useRealTimers()
  })

  it('возвращает ответ 429 при превышении лимита тарифа', async () => {
    const module = await import('@/lib/rate-limit')
    getUserTierMock.mockResolvedValue(module.UserTier.FREE)

    const originalConfig = module.tierRateLimitConfigs[module.UserTier.FREE].api
    module.tierRateLimitConfigs[module.UserTier.FREE].api = { window: '1m', max: 1 }

    const request = new Request('https://example.com/resource', {
      headers: { 'x-forwarded-for': '10.0.0.1' },
    })

    try {
      const allowed = await module.checkTierRateLimit(request, 'api', 'user-1', 'org-1')
      expect(allowed).toBeNull()

      const blocked = await module.checkTierRateLimit(request, 'api', 'user-1', 'org-1')

      expect(blocked).toBeInstanceOf(Response)
      expect(blocked?.status).toBe(429)
    } finally {
      module.tierRateLimitConfigs[module.UserTier.FREE].api = originalConfig
    }
  })

  it('применяет базовый лимит на запросы', async () => {
    const module = await import('@/lib/rate-limit')
    const config = { window: '1s', max: 1 } as const
    const request = new Request('https://example.com/resource', {
      headers: { 'x-real-ip': '127.0.0.1' },
    })

    const first = await module.checkRateLimit(request, config)
    expect(first).toBeNull()

    const second = await module.checkRateLimit(request, config)
    expect(second).toBeInstanceOf(Response)
    expect(second?.status).toBe(429)
  })
})
