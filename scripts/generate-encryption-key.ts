#!/usr/bin/env tsx

/**
 * Generate a secure encryption key for AES-256-GCM
 *
 * Usage:
 *   npx tsx scripts/generate-encryption-key.ts
 *
 * Output:
 *   64-character hex string (32 bytes)
 *   Copy this to your .env file as ENCRYPTION_KEY
 */

import { randomBytes } from 'crypto'

function generateKey(): string {
  return randomBytes(32).toString('hex')
}

function main() {
  const key = generateKey()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔐 Encryption Key Generated')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Copy this key to your .env file:')
  console.log('')
  console.log(`ENCRYPTION_KEY=${key}`)
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  IMPORTANT:')
  console.log('  - Keep this key secure and private')
  console.log('  - Do NOT commit it to git')
  console.log('  - Use the same key across all environments')
  console.log('  - Losing this key means you cannot decrypt existing data')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
