#!/usr/bin/env node

/**
 * Bootstrap script to initialize migration system
 * This script applies the initial migration (000_init_migration_system.sql) directly
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function bootstrap() {
  try {
    console.log('🔧 Bootstrapping migration system...')
    
    const initMigrationPath = path.join(__dirname, '../../supabase/migrations/000_init_migration_system.sql')
    
    if (!fs.existsSync(initMigrationPath)) {
      console.error(`❌ Initial migration file not found: ${initMigrationPath}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(initMigrationPath, 'utf8')
    
    console.log('📝 Applying initial migration...')
    console.log('⚠️  Note: Supabase REST API does not support direct SQL execution.')
    console.log('   This script will attempt to use alternative methods.\n')
    
    // Try to execute via Supabase SQL Editor API (if available)
    // Since Supabase REST API doesn't support arbitrary SQL, we'll provide instructions
    console.log('💡 To bootstrap migration system, please:')
    console.log('   1. Open Supabase Dashboard → SQL Editor')
    console.log(`   2. Copy and paste the contents of: ${initMigrationPath}`)
    console.log('   3. Run the SQL')
    console.log('\n   Or use Supabase CLI:')
    console.log(`   supabase db execute --file ${initMigrationPath}`)
    console.log('\n   Or apply via browser automation (if configured)')
    
    // Check if we can verify the bootstrap was successful
    const { error: checkError } = await supabase
      .from('schema_migrations')
      .select('version')
      .limit(1)
    
    if (!checkError) {
      console.log('\n✅ Migration system already initialized!')
      return true
    }
    
    console.log('\n⚠️  Migration system not yet initialized.')
    console.log('   Please follow the instructions above to bootstrap.')
    
    return false
    
  } catch (error) {
    console.error('❌ Bootstrap failed:', error.message)
    return false
  }
}

bootstrap().then(success => {
  if (success) {
    console.log('\n✅ Bootstrap complete!')
    process.exit(0)
  } else {
    console.log('\n⚠️  Bootstrap requires manual intervention.')
    process.exit(1)
  }
})

