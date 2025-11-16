/**
 * CSRF Protection Tests
 *
 * Задача 5.1: Security Audit
 * Тесты для проверки CSRF защиты
 */

import { describe, it, expect } from 'vitest'
import {
  generateCSRFToken,
  validateCSRF,
  requiresCSRFProtection,
  CSRF_TOKEN_LENGTH,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from '@/lib/security/csrf'
import { NextRequest } from 'next/server'

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('should generate a token of correct length', () => {
      const token = generateCSRFToken()
      expect(token).toBeDefined()
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken()
      const token2 = generateCSRFToken()
      expect(token1).not.toBe(token2)
    })

    it('should generate tokens using base64url encoding', () => {
      const token = generateCSRFToken()
      // base64url использует только [A-Za-z0-9_-]
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
    })
  })

  describe('requiresCSRFProtection', () => {
    it('should require CSRF protection for POST requests', () => {
      expect(requiresCSRFProtection('POST')).toBe(true)
    })

    it('should require CSRF protection for PUT requests', () => {
      expect(requiresCSRFProtection('PUT')).toBe(true)
    })

    it('should require CSRF protection for PATCH requests', () => {
      expect(requiresCSRFProtection('PATCH')).toBe(true)
    })

    it('should require CSRF protection for DELETE requests', () => {
      expect(requiresCSRFProtection('DELETE')).toBe(true)
    })

    it('should not require CSRF protection for GET requests', () => {
      expect(requiresCSRFProtection('GET')).toBe(false)
    })

    it('should not require CSRF protection for HEAD requests', () => {
      expect(requiresCSRFProtection('HEAD')).toBe(false)
    })

    it('should not require CSRF protection for OPTIONS requests', () => {
      expect(requiresCSRFProtection('OPTIONS')).toBe(false)
    })
  })

  describe('validateCSRF', () => {
    it('should return false when cookie token is missing', () => {
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          [CSRF_HEADER_NAME]: 'test-token',
        },
      })

      expect(validateCSRF(request)).toBe(false)
    })

    it('should return false when header token is missing', () => {
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
      })

      // Manually set cookie
      request.cookies.set(CSRF_COOKIE_NAME, 'test-token')

      expect(validateCSRF(request)).toBe(false)
    })

    it('should return false when tokens do not match', () => {
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          [CSRF_HEADER_NAME]: 'token-1',
        },
      })

      request.cookies.set(CSRF_COOKIE_NAME, 'token-2')

      expect(validateCSRF(request)).toBe(false)
    })

    it('should return true when tokens match', () => {
      const token = generateCSRFToken()
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          [CSRF_HEADER_NAME]: token,
        },
      })

      request.cookies.set(CSRF_COOKIE_NAME, token)

      expect(validateCSRF(request)).toBe(true)
    })

    it('should return false when tokens have different lengths', () => {
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          [CSRF_HEADER_NAME]: 'short',
        },
      })

      request.cookies.set(CSRF_COOKIE_NAME, 'much-longer-token')

      expect(validateCSRF(request)).toBe(false)
    })

    it('should handle malformed tokens gracefully', () => {
      const request = new NextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          [CSRF_HEADER_NAME]: '',
        },
      })

      request.cookies.set(CSRF_COOKIE_NAME, '')

      expect(validateCSRF(request)).toBe(false)
    })
  })
})
