#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const MIGRATIONS_DIR = path.join(__dirname, '../../supabase/migrations')

async function getExecutedMigrations() {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')
    .order('version')

  if (error) {
    console.error('Failed to fetch executed migrations:', error)
    return []
  }

  return data.map(m => m.version)
}

async function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort()

  return files.map(file => ({
    filename: file,
    version: path.basename(file, '.sql'),
    filepath: path.join(MIGRATIONS_DIR, file)
  }))
}

async function executeMigration(migration) {
  console.log(`Executing migration: ${migration.version}`)

  const sql = fs.readFileSync(migration.filepath, 'utf8')

  // Execute migration using the helper function
  const { data, error } = await supabase.rpc('execute_migration', {
    migration_version: migration.version,
    migration_name: migration.filename,
    migration_sql: sql
  })

  if (error) {
    console.error(`Failed to execute migration ${migration.version}:`, error)
    return false
  }

  if (data) {
    console.log(`✅ Migration ${migration.version} executed successfully`)
    return true
  } else {
    console.log(`⏭️  Migration ${migration.version} already executed`)
    return true
  }
}

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...')

    const executedMigrations = await getExecutedMigrations()
    const migrationFiles = await getMigrationFiles()

    console.log(`Found ${migrationFiles.length} migration files`)
    console.log(`Found ${executedMigrations.length} executed migrations`)

    let executedCount = 0

    for (const migration of migrationFiles) {
      if (!executedMigrations.includes(migration.version)) {
        const success = await executeMigration(migration)
        if (success) {
          executedCount++
        } else {
          console.error(`❌ Migration failed: ${migration.version}`)
          process.exit(1)
        }
      } else {
        console.log(`⏭️  Skipping already executed migration: ${migration.version}`)
      }
    }

    console.log(`✅ Migration complete! Executed ${executedCount} migrations`)

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

async function showStatus() {
  try {
    console.log('📊 Migration Status\n')

    const executedMigrations = await getExecutedMigrations()
    const migrationFiles = await getMigrationFiles()

    console.log('Migration Files:')
    migrationFiles.forEach(migration => {
      const executed = executedMigrations.includes(migration.version)
      const status = executed ? '✅' : '⏳'
      console.log(`  ${status} ${migration.version}`)
    })

    console.log(`\nTotal: ${migrationFiles.length} files, ${executedMigrations.length} executed`)

  } catch (error) {
    console.error('Failed to get migration status:', error)
    process.exit(1)
  }
}

async function rollbackMigration(version) {
  try {
    console.log(`🔄 Rolling back migration: ${version}`)

    // Get the migration SQL
    const migrationFile = path.join(MIGRATIONS_DIR, `${version}.sql`)
    if (!fs.existsSync(migrationFile)) {
      console.error(`Migration file not found: ${migrationFile}`)
      process.exit(1)
    }

    // For rollback, we'd need down migrations or manual rollback SQL
    // This is a simplified version - in production you'd have down migrations
    console.log('⚠️  Rollback requires manual intervention or down migration files')
    console.log('Please create a rollback script or down migration file')

    process.exit(1)

  } catch (error) {
    console.error('Rollback failed:', error)
    process.exit(1)
  }
}

// CLI interface
const command = process.argv[2]

switch (command) {
  case 'up':
  case 'migrate':
    runMigrations()
    break
  case 'status':
    showStatus()
    break
  case 'rollback':
    const version = process.argv[3]
    if (!version) {
      console.error('Please specify migration version to rollback')
      process.exit(1)
    }
    rollbackMigration(version)
    break
  default:
    console.log('Usage:')
    console.log('  node migrate.js migrate   - Run pending migrations')
    console.log('  node migrate.js status    - Show migration status')
    console.log('  node migrate.js rollback <version> - Rollback specific migration')
    process.exit(1)
}
