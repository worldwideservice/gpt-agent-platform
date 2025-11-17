/**
 * Tests for AES-256-GCM encryption
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  encrypt,
  decrypt,
  isEncrypted,
  encryptIfNeeded,
  safeDecrypt,
  encryptFields,
  decryptFields,
  generateEncryptionKey,
} from './encryption'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('Encryption', () => {
  const originalEnv = process.env.ENCRYPTION_KEY

  beforeEach(() => {
    // Set test encryption key
    process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  })

  afterEach(() => {
    // Restore original env
    if (originalEnv) {
      process.env.ENCRYPTION_KEY = originalEnv
    } else {
      delete process.env.ENCRYPTION_KEY
    }
  })

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt a string', () => {
      const plaintext = 'my-secret-token'
      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
      expect(encrypted).not.toBe(plaintext)
    })

    it('should produce different ciphertext for same plaintext (random IV)', () => {
      const plaintext = 'same-token'
      const encrypted1 = encrypt(plaintext)
      const encrypted2 = encrypt(plaintext)

      expect(encrypted1).not.toBe(encrypted2)
      expect(decrypt(encrypted1)).toBe(plaintext)
      expect(decrypt(encrypted2)).toBe(plaintext)
    })

    it('should encrypt in format iv:encrypted:authTag', () => {
      const plaintext = 'test-token'
      const encrypted = encrypt(plaintext)

      const parts = encrypted.split(':')
      expect(parts).toHaveLength(3)

      // Each part should be hex
      parts.forEach(part => {
        expect(part).toMatch(/^[0-9a-f]+$/i)
      })
    })

    it('should handle empty strings', () => {
      expect(encrypt('')).toBe('')
      expect(decrypt('')).toBe('')
    })

    it('should handle special characters', () => {
      const special = '!@#$%^&*()_+-={}[]|:;<>,.?/~`'
      const encrypted = encrypt(special)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(special)
    })

    it('should handle unicode characters', () => {
      const unicode = '你好世界 🚀 Привет мир'
      const encrypted = encrypt(unicode)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(unicode)
    })

    it('should throw on invalid encrypted format', () => {
      expect(() => decrypt('invalid-format')).toThrow()
      expect(() => decrypt('only:two:parts:extra')).toThrow()
    })

    it('should throw on tampered data', () => {
      const plaintext = 'secret'
      const encrypted = encrypt(plaintext)

      // Tamper with encrypted data
      const parts = encrypted.split(':')
      parts[1] = parts[1].substring(0, parts[1].length - 2) + 'ff' // Change last byte

      const tampered = parts.join(':')

      expect(() => decrypt(tampered)).toThrow()
    })

    it('should return plain text if not in encrypted format (migration)', () => {
      const plaintext = 'plain-token'
      const result = decrypt(plaintext)

      expect(result).toBe(plaintext)
    })
  })

  describe('isEncrypted', () => {
    it('should detect encrypted values', () => {
      const encrypted = encrypt('test')
      expect(isEncrypted(encrypted)).toBe(true)
    })

    it('should detect plain text', () => {
      expect(isEncrypted('plain-text')).toBe(false)
      expect(isEncrypted('no-colons')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isEncrypted(null)).toBe(false)
      expect(isEncrypted(undefined)).toBe(false)
      expect(isEncrypted('')).toBe(false)
      expect(isEncrypted('one:two')).toBe(false) // Only 2 parts
      expect(isEncrypted('one:two:three:four')).toBe(false) // Too many parts
      expect(isEncrypted('not:hex:data!')).toBe(false) // Non-hex characters
    })
  })

  describe('encryptIfNeeded', () => {
    it('should encrypt plain text', () => {
      const plaintext = 'my-token'
      const result = encryptIfNeeded(plaintext)

      expect(isEncrypted(result)).toBe(true)
      expect(decrypt(result!)).toBe(plaintext)
    })

    it('should not re-encrypt already encrypted data', () => {
      const plaintext = 'my-token'
      const encrypted = encrypt(plaintext)
      const result = encryptIfNeeded(encrypted)

      expect(result).toBe(encrypted)
    })

    it('should handle null/undefined', () => {
      expect(encryptIfNeeded(null)).toBe(null)
      expect(encryptIfNeeded(undefined)).toBe(null)
    })
  })

  describe('safeDecrypt', () => {
    it('should decrypt encrypted data', () => {
      const plaintext = 'secret'
      const encrypted = encrypt(plaintext)
      const result = safeDecrypt(encrypted)

      expect(result).toBe(plaintext)
    })

    it('should return plain text as-is', () => {
      const plaintext = 'plain-token'
      const result = safeDecrypt(plaintext)

      expect(result).toBe(plaintext)
    })

    it('should handle null/undefined', () => {
      expect(safeDecrypt(null)).toBe(null)
      expect(safeDecrypt(undefined)).toBe(null)
    })
  })

  describe('encryptFields/decryptFields', () => {
    it('should encrypt specified fields', () => {
      const obj = {
        id: '123',
        token: 'secret-token',
        apiKey: 'api-key-123',
        name: 'Test',
      }

      const encrypted = encryptFields(obj, ['token', 'apiKey'])

      expect(encrypted.id).toBe('123')
      expect(encrypted.name).toBe('Test')
      expect(isEncrypted(encrypted.token)).toBe(true)
      expect(isEncrypted(encrypted.apiKey)).toBe(true)
    })

    it('should decrypt specified fields', () => {
      const obj = {
        id: '123',
        token: encrypt('secret-token'),
        apiKey: encrypt('api-key-123'),
        name: 'Test',
      }

      const decrypted = decryptFields(obj, ['token', 'apiKey'])

      expect(decrypted.id).toBe('123')
      expect(decrypted.name).toBe('Test')
      expect(decrypted.token).toBe('secret-token')
      expect(decrypted.apiKey).toBe('api-key-123')
    })

    it('should handle mixed encrypted/plain fields', () => {
      const obj = {
        encrypted: encrypt('secret'),
        plain: 'plain-text',
        empty: '',
      }

      const decrypted = decryptFields(obj, ['encrypted', 'plain', 'empty'])

      expect(decrypted.encrypted).toBe('secret')
      expect(decrypted.plain).toBe('plain-text')
      expect(decrypted.empty).toBe('')
    })
  })

  describe('generateEncryptionKey', () => {
    it('should generate valid encryption key', () => {
      const key = generateEncryptionKey()

      expect(key).toHaveLength(64) // 32 bytes = 64 hex chars
      expect(key).toMatch(/^[0-9a-f]{64}$/i)
    })

    it('should generate unique keys', () => {
      const key1 = generateEncryptionKey()
      const key2 = generateEncryptionKey()

      expect(key1).not.toBe(key2)
    })

    it('generated key should work for encryption', () => {
      const key = generateEncryptionKey()
      process.env.ENCRYPTION_KEY = key

      const plaintext = 'test-data'
      const encrypted = encrypt(plaintext)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plaintext)
    })
  })

  describe('encryption key validation', () => {
    it('should throw if key is missing in production', () => {
      delete process.env.ENCRYPTION_KEY
      process.env.NODE_ENV = 'production'

      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY is required in production')
    })

    it('should throw if key is invalid format', () => {
      process.env.ENCRYPTION_KEY = 'too-short'

      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY must be 64 hexadecimal characters')
    })

    it('should accept valid 64-char hex key', () => {
      const validKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
      process.env.ENCRYPTION_KEY = validKey

      const encrypted = encrypt('test')
      expect(isEncrypted(encrypted)).toBe(true)
    })
  })
})
