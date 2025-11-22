import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock onboarding
vi.mock('@/lib/onboarding/server', () => ({
  getOnboardingState: vi.fn(),
  upsertOnboardingAgent: vi.fn(),
}))

describe('API: /api/onboarding/agent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/onboarding/agent', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/onboarding/agent/route')
      const request = new NextRequest('http://localhost:3000/api/onboarding/agent', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Agent',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('should create agent during onboarding', async () => {
      const { auth } = await import('@/auth')
      const { getOnboardingState, upsertOnboardingAgent } = await import('@/lib/onboarding/server')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      vi.mocked(upsertOnboardingAgent).mockResolvedValue(undefined)

      const mockState = {
        isCompleted: true,
        currentStep: 'completed',
        completedSteps: ['welcome', 'agent_creation'],
      }

      vi.mocked(getOnboardingState).mockResolvedValue(mockState as any)

      const route = await import('@/app/api/onboarding/agent/route')
      const request = new NextRequest('http://localhost:3000/api/onboarding/agent', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Agent',
          model: 'gpt-4',
          goal: 'Test goal for the agent',
          channels: ['telegram'],
          schedule: '9-18',
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.state).toEqual(mockState)
    })

    it('should return 400 for invalid data', async () => {
      const { auth } = await import('@/auth')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
          orgId: 'org-123',
        },
      } as any)

      const route = await import('@/app/api/onboarding/agent/route')
      const request = new NextRequest('http://localhost:3000/api/onboarding/agent', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required name field
        }),
      })
      const response = await route.POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })
})

