/**
 * Documents API Integration Tests
 * Tests for knowledge base documents API
 */

import { test, expect } from '@playwright/test'
import { apiEndpoints } from '../e2e/fixtures/test-data'

test.describe('Documents API', () => {
  let authToken: string
  let documentId: string

  test.beforeAll(async ({ request }) => {
    // Login
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

  test('GET /api/documents - should return documents list', async ({ request }) => {
    const response = await request.get(apiEndpoints.documents.list, {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('documents')
  })

  test('POST /api/documents/upload - should upload text file', async ({ request }) => {
    const response = await request.post(apiEndpoints.documents.upload, {
      headers: {
        Cookie: authToken,
      },
      multipart: {
        file: {
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Test document content for API testing.'),
        },
        title: 'API Test Document',
        category: 'test',
      },
    })

    expect(response.ok()).toBeTruthy()
    expect([200, 201]).toContain(response.status())

    const data = await response.json()
    expect(data.document || data).toHaveProperty('id')

    documentId = (data.document || data).id
  })

  test('POST /api/documents/search - should search documents', async ({ request }) => {
    const response = await request.post(apiEndpoints.documents.search, {
      headers: {
        Cookie: authToken,
        'Content-Type': 'application/json',
      },
      data: {
        query: 'test',
        match_threshold: 0.7,
        match_count: 5,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBeTruthy()
  })

  test('GET /api/documents/:id - should return document details', async ({ request }) => {
    if (!documentId) test.skip()

    const response = await request.get(apiEndpoints.documents.get(documentId), {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.document || data).toHaveProperty('id', documentId)
  })

  test('DELETE /api/documents/:id - should delete document', async ({ request }) => {
    if (!documentId) test.skip()

    const response = await request.delete(apiEndpoints.documents.delete(documentId), {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()
    expect([200, 204]).toContain(response.status())
  })

  test('POST /api/documents/upload - should validate file type', async ({ request }) => {
    const response = await request.post(apiEndpoints.documents.upload, {
      headers: {
        Cookie: authToken,
      },
      multipart: {
        file: {
          name: 'test.invalid',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from('Invalid file'),
        },
      },
    })

    expect(response.status()).toBe(400)
  })

  test('POST /api/documents/upload - should validate file size', async ({ request }) => {
    // Create large buffer (>50MB)
    const largeBuffer = Buffer.alloc(51 * 1024 * 1024)

    const response = await request.post(apiEndpoints.documents.upload, {
      headers: {
        Cookie: authToken,
      },
      multipart: {
        file: {
          name: 'large.txt',
          mimeType: 'text/plain',
          buffer: largeBuffer,
        },
      },
    })

    expect(response.status()).toBe(413)
  })

  test('GET /api/documents - should support filtering by category', async ({ request }) => {
    const response = await request.get(`${apiEndpoints.documents.list}?category=test`, {
      headers: {
        Cookie: authToken,
      },
    })

    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    const docs = data.documents

    if (docs && docs.length > 0) {
      docs.forEach((doc: any) => {
        expect(doc.category).toBe('test')
      })
    }
  })

  test('should return 401 for unauthorized requests', async ({ request }) => {
    const response = await request.get(apiEndpoints.documents.list)

    expect([401, 403]).toContain(response.status())
  })
})
