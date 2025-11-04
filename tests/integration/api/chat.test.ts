import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/chat/route'

// Mock dependencies
vi.mock('@/auth')
vi.mock('@/lib/repositories/conversations')
vi.mock('@/lib/repositories/agents')
vi.mock('@/lib/services/llm')
vi.mock('@/lib/services/agent-actions')

describe('API: /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Не авторизовано')
  })

  it('should return 400 for invalid message', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        orgId: 'org-123',
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: '', // Empty message
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  // More tests would require mocking complex dependencies
  // This is a basic structure for integration tests
})

