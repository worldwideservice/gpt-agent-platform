import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock onboarding
vi.mock('@/lib/onboarding/server', () => ({
  getOnboardingState: vi.fn(),
}))

describe('API: /api/onboarding/status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/onboarding/status', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/onboarding/status/route')
      const request = new NextRequest('http://localhost:3000/api/onboarding/status')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should return onboarding status', async () => {
      const { auth } = await import('@/auth')
      const { getOnboardingState } = await import('@/lib/onboarding/server')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const mockState = {
        isCompleted: false,
        currentStep: 'agent_creation',
        completedSteps: ['welcome'],
      }

      vi.mocked(getOnboardingState).mockResolvedValue(mockState as any)

      const route = await import('@/app/api/onboarding/status/route')
      const request = new NextRequest('http://localhost:3000/api/onboarding/status')
      const response = await route.GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.state).toEqual(mockState)
    })
  })
})

