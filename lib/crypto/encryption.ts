/**
 * AES-256-GCM Encryption for sensitive data (tokens, secrets)
 *
 * Security features:
 * - AES-256-GCM (authenticated encryption)
 * - Random IV per encryption (prevents pattern detection)
 * - Authentication tag (prevents tampering)
 * - Key derived from environment variable
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { logger } from '@/lib/utils/logger'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // 128 bits for GCM
const AUTH_TAG_LENGTH = 16 // 128 bits
const KEY_LENGTH = 32 // 256 bits

/**
 * Get encryption key from environment
 * Key must be 64 hex characters (32 bytes)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY is required in production')
    }
    // Development fallback (NOT SECURE - for testing only)
    logger.warn('Using development encryption key - NOT SECURE FOR PRODUCTION')
    return Buffer.from('0'.repeat(64), 'hex')
  }

  // Validate key format
  if (!/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error(
      'ENCRYPTION_KEY must be 64 hexadecimal characters (32 bytes). ' +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }

  return Buffer.from(key, 'hex')
}

/**
 * Encrypt a string using AES-256-GCM
 *
 * Format: iv:encrypted:authTag (all hex-encoded)
 *
 * @param plaintext - String to encrypt
 * @returns Encrypted string in format "iv:encrypted:authTag"
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    return plaintext
  }

  try {
    const key = getEncryptionKey()
    const iv = randomBytes(IV_LENGTH)

    const cipher = createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Format: iv:encrypted:authTag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`
  } catch (error) {
    logger.error('Encryption failed', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt a string encrypted with AES-256-GCM
 *
 * @param encryptedData - String in format "iv:encrypted:authTag"
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    return encryptedData
  }

  // Check if data is already in encrypted format
  if (!encryptedData.includes(':')) {
    // Data is not encrypted (plain text) - return as is
    // This handles migration period where some tokens may not be encrypted yet
    logger.debug('Decrypting plain text token (not encrypted)')
    return encryptedData
  }

  try {
    const key = getEncryptionKey()
    const parts = encryptedData.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format. Expected: iv:encrypted:authTag')
    }

    const [ivHex, encryptedHex, authTagHex] = parts

    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, undefined, 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    logger.error('Decryption failed', error)
    throw new Error('Failed to decrypt data. Verify ENCRYPTION_KEY is correct.')
  }
}

/**
 * Check if a value is encrypted (contains colons separating iv:encrypted:authTag)
 */
export function isEncrypted(value: string | null | undefined): boolean {
  if (!value) return false

  // Encrypted format: hexIV:hexEncrypted:hexAuthTag
  // Each part should be hex characters, separated by exactly 2 colons
  const parts = value.split(':')
  if (parts.length !== 3) return false

  // Validate each part is hex
  return parts.every(part => /^[0-9a-f]+$/i.test(part))
}

/**
 * Encrypt if not already encrypted (idempotent)
 */
export function encryptIfNeeded(value: string | null | undefined): string | null {
  if (!value) return value || null

  if (isEncrypted(value)) {
    logger.debug('Value already encrypted, skipping')
    return value
  }

  return encrypt(value)
}

/**
 * Safely decrypt - returns original if not encrypted
 */
export function safeDecrypt(value: string | null | undefined): string | null {
  if (!value) return value || null

  if (!isEncrypted(value)) {
    logger.debug('Value not encrypted, returning as-is')
    return value
  }

  return decrypt(value)
}

/**
 * Encrypt multiple fields in an object
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj }

  for (const field of fields) {
    const value = obj[field]
    if (typeof value === 'string' && value) {
      result[field] = encrypt(value) as any
    }
  }

  return result
}

/**
 * Decrypt multiple fields in an object
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj }

  for (const field of fields) {
    const value = obj[field]
    if (typeof value === 'string' && value) {
      result[field] = safeDecrypt(value) as any
    }
  }

  return result
}

/**
 * Generate a new encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return randomBytes(KEY_LENGTH).toString('hex')
}
