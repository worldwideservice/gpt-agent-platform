#!/usr/bin/env tsx

/**
 * Migration script to encrypt existing tokens in database
 *
 * This script:
 * 1. Reads all tokens from crm_connections and crm_credentials
 * 2. Encrypts plain text tokens
 * 3. Updates database with encrypted values
 *
 * Usage:
 *   npx tsx scripts/migrate-encrypt-tokens.ts [--dry-run]
 *
 * Requirements:
 *   - ENCRYPTION_KEY must be set in environment
 *   - Supabase credentials must be configured
 */

import { getSupabaseServiceRoleClient } from '../lib/supabase/admin'
import { encrypt, isEncrypted } from '../lib/crypto/encryption'
import { logger } from '../lib/utils/logger'

const DRY_RUN = process.argv.includes('--dry-run')

interface CrmConnection {
  id: string
  org_id: string
  provider: string
  access_token: string | null
  refresh_token: string | null
}

interface CrmCredential {
  id: string
  org_id: string
  provider: string
  client_secret: string | null
}

async function migrateCrmConnections() {
  const supabase = getSupabaseServiceRoleClient()

  logger.info('🔍 Fetching CRM connections...')

  const { data: connections, error } = await supabase
    .from('crm_connections')
    .select('id, org_id, provider, access_token, refresh_token')

  if (error) {
    logger.error('Failed to fetch CRM connections', error)
    throw new Error('Failed to fetch connections')
  }

  if (!connections || connections.length === 0) {
    logger.info('No CRM connections found')
    return { total: 0, encrypted: 0, skipped: 0 }
  }

  logger.info(`Found ${connections.length} CRM connections`)

  let encrypted = 0
  let skipped = 0

  for (const conn of connections as CrmConnection[]) {
    let updated = false
    const updates: { access_token?: string; refresh_token?: string | null } = {}

    // Check access_token
    if (conn.access_token) {
      if (isEncrypted(conn.access_token)) {
        logger.debug(`Connection ${conn.id}: access_token already encrypted`)
      } else {
        logger.info(`Connection ${conn.id}: encrypting access_token`)
        updates.access_token = encrypt(conn.access_token)
        updated = true
      }
    }

    // Check refresh_token
    if (conn.refresh_token) {
      if (isEncrypted(conn.refresh_token)) {
        logger.debug(`Connection ${conn.id}: refresh_token already encrypted`)
      } else {
        logger.info(`Connection ${conn.id}: encrypting refresh_token`)
        updates.refresh_token = encrypt(conn.refresh_token)
        updated = true
      }
    }

    if (updated) {
      if (DRY_RUN) {
        logger.info(`[DRY RUN] Would update connection ${conn.id}`, updates)
        encrypted++
      } else {
        const { error: updateError } = await supabase
          .from('crm_connections')
          .update(updates)
          .eq('id', conn.id)

        if (updateError) {
          logger.error(`Failed to update connection ${conn.id}`, updateError)
          throw new Error(`Failed to update connection ${conn.id}`)
        }

        logger.info(`✅ Updated connection ${conn.id}`)
        encrypted++
      }
    } else {
      skipped++
    }
  }

  return {
    total: connections.length,
    encrypted,
    skipped,
  }
}

async function migrateCrmCredentials() {
  const supabase = getSupabaseServiceRoleClient()

  logger.info('🔍 Fetching CRM credentials...')

  const { data: credentials, error } = await supabase
    .from('crm_credentials')
    .select('id, org_id, provider, client_secret')

  if (error) {
    logger.error('Failed to fetch CRM credentials', error)
    throw new Error('Failed to fetch credentials')
  }

  if (!credentials || credentials.length === 0) {
    logger.info('No CRM credentials found')
    return { total: 0, encrypted: 0, skipped: 0 }
  }

  logger.info(`Found ${credentials.length} CRM credentials`)

  let encrypted = 0
  let skipped = 0

  for (const cred of credentials as CrmCredential[]) {
    if (!cred.client_secret) {
      skipped++
      continue
    }

    if (isEncrypted(cred.client_secret)) {
      logger.debug(`Credential ${cred.id}: client_secret already encrypted`)
      skipped++
    } else {
      logger.info(`Credential ${cred.id}: encrypting client_secret`)

      if (DRY_RUN) {
        logger.info(`[DRY RUN] Would update credential ${cred.id}`)
        encrypted++
      } else {
        const { error: updateError } = await supabase
          .from('crm_credentials')
          .update({ client_secret: encrypt(cred.client_secret) })
          .eq('id', cred.id)

        if (updateError) {
          logger.error(`Failed to update credential ${cred.id}`, updateError)
          throw new Error(`Failed to update credential ${cred.id}`)
        }

        logger.info(`✅ Updated credential ${cred.id}`)
        encrypted++
      }
    }
  }

  return {
    total: credentials.length,
    encrypted,
    skipped,
  }
}

async function main() {
  logger.info('🚀 Starting token encryption migration')

  if (DRY_RUN) {
    logger.info('🔥 DRY RUN MODE - No changes will be made')
  }

  // Validate encryption key
  if (!process.env.ENCRYPTION_KEY) {
    logger.error('ENCRYPTION_KEY environment variable is required')
    logger.info('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
    process.exit(1)
  }

  try {
    // Migrate CRM connections
    logger.info('\n📦 Migrating CRM connections...')
    const connectionsResult = await migrateCrmConnections()

    logger.info('\n📦 Migrating CRM credentials...')
    const credentialsResult = await migrateCrmCredentials()

    // Summary
    logger.info('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    logger.info('✨ Migration Complete!')
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    logger.info('\nCRM Connections:')
    logger.info(`  Total:     ${connectionsResult.total}`)
    logger.info(`  Encrypted: ${connectionsResult.encrypted}`)
    logger.info(`  Skipped:   ${connectionsResult.skipped}`)

    logger.info('\nCRM Credentials:')
    logger.info(`  Total:     ${credentialsResult.total}`)
    logger.info(`  Encrypted: ${credentialsResult.encrypted}`)
    logger.info(`  Skipped:   ${credentialsResult.skipped}`)

    const totalEncrypted = connectionsResult.encrypted + credentialsResult.encrypted
    logger.info(`\n🔐 Total items encrypted: ${totalEncrypted}`)

    if (DRY_RUN) {
      logger.info('\n⚠️  This was a DRY RUN. Run without --dry-run to apply changes.')
    } else {
      logger.info('\n✅ All tokens encrypted successfully!')
    }
  } catch (error) {
    logger.error('Migration failed', error)
    process.exit(1)
  }
}

// Run migration
main()
  .then(() => {
    logger.info('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    logger.error('Fatal error', error)
    process.exit(1)
  })
