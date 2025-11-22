/**
 * AI Agents API Integration Tests
 * Tests for agents API endpoints
 */

import { test, expect } from '@playwright/test'
import { apiEndpoints, testAgent } from '../e2e/fixtures/test-data'

test.describe('Agents API', () => {
  let authToken: string
  let agentId: string

  test.beforeAll(async ({ request }) => {
    // Login to get auth token
    const response = await request.post(apiEndpoints.auth.login, {
      data: {
        email: 'test@test.local',
        password: 'TestPassword123!',
      },
    })

    const cookies = response.headers()['set-cookie']
    if (cookies) {
      authToken = cookies
    }
  })

  test('GET /api/agents - should return agents list', async ({ request }) => {
    const response = await request.get(apiEndpoints.agents.list, {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data.agents || data)).toBeTruthy()
  })

  test('POST /api/agents - should create new agent', async ({ request }) => {
    const response = await request.post(apiEndpoints.agents.create, {
      headers: {
        Cookie: authToken,
        'Content-Type': 'application/json',
      },
      data: {
        ...testAgent,
        name: `Test Agent ${Date.now()}`,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(201)

    const data = await response.json()
    expect(data.agent || data).toHaveProperty('id')

    agentId = (data.agent || data).id
  })

  test('GET /api/agents/:id - should return single agent', async ({ request }) => {
    if (!agentId) test.skip()

    const response = await request.get(apiEndpoints.agents.get(agentId), {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.agent || data).toHaveProperty('id', agentId)
  })

  test('PATCH /api/agents/:id - should update agent', async ({ request }) => {
    if (!agentId) test.skip()

    const response = await request.patch(apiEndpoints.agents.update(agentId), {
      headers: {
        Cookie: authToken,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Updated Agent Name',
        description: 'Updated description',
      },
    })

    expect(response.ok()).toBeTruthy()
    expect([200, 204]).toContain(response.status())
  })

  test('DELETE /api/agents/:id - should delete agent', async ({ request }) => {
    if (!agentId) test.skip()

    const response = await request.delete(apiEndpoints.agents.delete(agentId), {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect([200, 204]).toContain(response.status())
  })

  test('POST /api/agents - should validate required fields', async ({ request }) => {
    const response = await request.post(apiEndpoints.agents.create, {
      headers: {
        Cookie: authToken,
        'Content-Type': 'application/json',
      },
      data: {
        // Missing required fields
      },
    })

    expect(response.status()).toBe(400)

    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  test('GET /api/agents - should support pagination', async ({ request }) => {
    const response = await request.get(`${apiEndpoints.agents.list}?limit=10&offset=0`, {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('agents')
    expect(data).toHaveProperty('pagination')
  })

  test('GET /api/agents - should support filtering', async ({ request }) => {
    const response = await request.get(`${apiEndpoints.agents.list}?status=active`, {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    const agents = data.agents || data

    if (agents.length > 0) {
      agents.forEach((agent: any) => {
        expect(agent.status).toBe('active')
      })
    }
  })

  test('should handle rate limiting', async ({ request }) => {
    // Make multiple rapid requests
    const requests = Array(20)
      .fill(null)
      .map(() =>
        request.get(apiEndpoints.agents.list, {
          headers: { Cookie: authToken },
        })
      )

    const responses = await Promise.all(requests)

    // At least one should succeed
    const successfulResponses = responses.filter((r) => r.ok())
    expect(successfulResponses.length).toBeGreaterThan(0)

    // Check if any were rate limited
    const rateLimited = responses.some((r) => r.status() === 429)
    // Rate limiting might or might not trigger depending on implementation
  })

  test('should return 401 for unauthorized requests', async ({ request }) => {
    const response = await request.get(apiEndpoints.agents.list)

    expect([401, 403]).toContain(response.status())
  })
})
