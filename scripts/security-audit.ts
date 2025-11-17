#!/usr/bin/env tsx
/**
 * Security Audit Script
 * Verifies security configuration and best practices
 *
 * Usage:
 *   npm run security:audit
 *   tsx scripts/security-audit.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

interface AuditResult {
  category: string
  check: string
  status: 'pass' | 'fail' | 'warn'
  message: string
  details?: string
}

const results: AuditResult[] = []

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function addResult(category: string, check: string, status: 'pass' | 'fail' | 'warn', message: string, details?: string) {
  results.push({ category, check, status, message, details })
}

async function checkEnvironmentVariables() {
  log('\n📋 Checking Environment Variables...', colors.blue)

  const requiredVars = [
    { name: 'NODE_ENV', description: 'Node environment' },
    { name: 'NEXTAUTH_URL', description: 'NextAuth URL' },
    { name: 'NEXTAUTH_SECRET', description: 'NextAuth secret key' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase URL' },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase anon key' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Supabase service role key' },
  ]

  const optionalVars = [
    { name: 'ENCRYPTION_KEY', description: 'Encryption key for sensitive data' },
    { name: 'REDIS_URL', description: 'Redis connection URL' },
    { name: 'OPENROUTER_API_KEY', description: 'OpenRouter API key' },
    { name: 'OPENAI_API_KEY', description: 'OpenAI API key' },
  ]

  // Check required variables
  for (const { name, description } of requiredVars) {
    const value = process.env[name]

    if (!value) {
      addResult('Environment', name, 'fail', `Missing required variable: ${description}`)
    } else if (value.includes('your_') || value.includes('placeholder')) {
      addResult('Environment', name, 'fail', `Variable contains placeholder value: ${description}`)
    } else if (value.length < 10 && name.includes('SECRET')) {
      addResult('Environment', name, 'warn', `Variable is too short (< 10 chars): ${description}`)
    } else {
      addResult('Environment', name, 'pass', `Configured: ${description}`)
    }
  }

  // Check optional variables
  for (const { name, description } of optionalVars) {
    const value = process.env[name]

    if (!value) {
      addResult('Environment', name, 'warn', `Optional variable not set: ${description}`)
    } else if (value.includes('your_') || value.includes('placeholder')) {
      addResult('Environment', name, 'warn', `Optional variable contains placeholder: ${description}`)
    } else {
      addResult('Environment', name, 'pass', `Configured: ${description}`)
    }
  }

  // Check secret key lengths
  const secrets = ['NEXTAUTH_SECRET', 'ENCRYPTION_KEY']
  for (const secret of secrets) {
    const value = process.env[secret]
    if (value && value.length < 32) {
      addResult('Environment', `${secret}_LENGTH`, 'warn', `${secret} should be at least 32 characters for security`)
    }
  }

  // Check for .env files in production
  if (process.env.NODE_ENV === 'production') {
    const envFiles = ['.env', '.env.local', '.env.development']
    for (const file of envFiles) {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        addResult('Environment', 'ENV_FILES', 'warn', `Found ${file} in production directory - ensure it's in .gitignore`)
      }
    }
  }
}

async function checkDatabaseSecurity() {
  log('\n🔒 Checking Database Security...', colors.blue)

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if we can connect
    const { data, error } = await supabase.from('agents').select('id').limit(1)

    if (error) {
      addResult('Database', 'CONNECTION', 'fail', `Cannot connect to database: ${error.message}`)
      return
    }

    addResult('Database', 'CONNECTION', 'pass', 'Database connection successful')

    // Note: RLS check requires direct PostgreSQL access
    // For Supabase, recommend checking via dashboard
    addResult('Database', 'RLS', 'warn', 'Row Level Security should be verified manually in Supabase dashboard',
      'Ensure all tables have RLS enabled and appropriate policies')

    // Check for common security tables
    const securityTables = ['organizations', 'organization_members', 'api_keys']
    for (const table of securityTables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (!error) {
          addResult('Database', `TABLE_${table.toUpperCase()}`, 'pass', `Security table exists: ${table}`)
        }
      } catch {
        addResult('Database', `TABLE_${table.toUpperCase()}`, 'warn', `Security table may not exist: ${table}`)
      }
    }
  } catch (error) {
    addResult('Database', 'CHECK', 'fail', `Database security check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function checkRateLimiting() {
  log('\n⏱️  Checking Rate Limiting...', colors.blue)

  try {
    // Check if rate limiting is configured
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL

    if (!redisUrl || redisUrl.includes('your-redis-host')) {
      addResult('Rate Limiting', 'REDIS', 'warn', 'Redis not configured - rate limiting may use in-memory fallback')
    } else {
      addResult('Rate Limiting', 'REDIS', 'pass', 'Redis configured for rate limiting')
    }

    // Check for rate limit middleware
    const middlewarePath = path.join(process.cwd(), 'lib', 'rate-limit.ts')
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf-8')

      if (content.includes('rateLimit') || content.includes('RateLimiter')) {
        addResult('Rate Limiting', 'MIDDLEWARE', 'pass', 'Rate limiting middleware found')
      } else {
        addResult('Rate Limiting', 'MIDDLEWARE', 'warn', 'Rate limiting file exists but implementation unclear')
      }

      // Check for configuration
      if (content.includes('points') && content.includes('duration')) {
        addResult('Rate Limiting', 'CONFIG', 'pass', 'Rate limiting appears configured with points and duration')
      }
    } else {
      addResult('Rate Limiting', 'MIDDLEWARE', 'fail', 'Rate limiting middleware not found')
    }
  } catch (error) {
    addResult('Rate Limiting', 'CHECK', 'fail', `Rate limiting check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function checkEncryption() {
  log('\n🔐 Checking Encryption...', colors.blue)

  const encryptionKey = process.env.ENCRYPTION_KEY

  if (!encryptionKey) {
    addResult('Encryption', 'KEY', 'fail', 'ENCRYPTION_KEY not configured')
  } else if (encryptionKey.length < 32) {
    addResult('Encryption', 'KEY', 'fail', 'ENCRYPTION_KEY is too short (should be at least 32 hex characters)')
  } else if (!/^[0-9a-f]{32,}$/i.test(encryptionKey)) {
    addResult('Encryption', 'KEY', 'warn', 'ENCRYPTION_KEY should be hexadecimal (use: openssl rand -hex 32)')
  } else {
    addResult('Encryption', 'KEY', 'pass', 'ENCRYPTION_KEY properly configured')
  }

  // Check for encryption utilities
  const encryptPath = path.join(process.cwd(), 'lib', 'utils', 'encryption.ts')
  if (fs.existsSync(encryptPath)) {
    const content = fs.readFileSync(encryptPath, 'utf-8')

    if (content.includes('encrypt') && content.includes('decrypt')) {
      addResult('Encryption', 'UTILS', 'pass', 'Encryption utilities found')

      // Check for AES-256-GCM (recommended)
      if (content.includes('aes-256-gcm')) {
        addResult('Encryption', 'ALGORITHM', 'pass', 'Using AES-256-GCM (recommended)')
      } else if (content.includes('aes')) {
        addResult('Encryption', 'ALGORITHM', 'warn', 'Using AES but not AES-256-GCM')
      }
    }
  } else {
    addResult('Encryption', 'UTILS', 'warn', 'Encryption utilities not found')
  }
}

async function checkDependencies() {
  log('\n📦 Checking Dependencies...', colors.blue)

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    )

    // Check for known vulnerable packages (example)
    const securityDeps = [
      { name: 'helmet', description: 'Security headers middleware' },
      { name: 'bcrypt', description: 'Password hashing' },
      { name: 'zod', description: 'Schema validation' },
    ]

    for (const { name, description } of securityDeps) {
      const hasInDeps = packageJson.dependencies?.[name]
      const hasInDevDeps = packageJson.devDependencies?.[name]

      if (hasInDeps || hasInDevDeps) {
        addResult('Dependencies', name.toUpperCase(), 'pass', `Security package installed: ${description}`)
      } else {
        addResult('Dependencies', name.toUpperCase(), 'warn', `Consider adding: ${description}`)
      }
    }

    // Check for package-lock.json
    if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
      addResult('Dependencies', 'LOCKFILE', 'pass', 'package-lock.json exists (dependency locking)')
    } else {
      addResult('Dependencies', 'LOCKFILE', 'warn', 'No package-lock.json found - dependencies not locked')
    }

    addResult('Dependencies', 'AUDIT', 'warn', 'Run "npm audit" to check for known vulnerabilities',
      'Command: npm audit --production')
  } catch (error) {
    addResult('Dependencies', 'CHECK', 'fail', `Dependency check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function checkSecurityHeaders() {
  log('\n🛡️  Checking Security Headers...', colors.blue)

  // Check for Next.js config with security headers
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')

  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf-8')

    const headers = [
      { name: 'X-Frame-Options', pattern: /X-Frame-Options/i },
      { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/i },
      { name: 'Referrer-Policy', pattern: /Referrer-Policy/i },
      { name: 'Content-Security-Policy', pattern: /Content-Security-Policy/i },
    ]

    for (const { name, pattern } of headers) {
      if (pattern.test(content)) {
        addResult('Security Headers', name, 'pass', `${name} configured`)
      } else {
        addResult('Security Headers', name, 'warn', `${name} not found in next.config.mjs`)
      }
    }
  } else {
    addResult('Security Headers', 'CONFIG', 'warn', 'next.config.mjs not found')
  }

  // Check for middleware
  const middlewarePath = path.join(process.cwd(), 'middleware.ts')
  if (fs.existsSync(middlewarePath)) {
    addResult('Security Headers', 'MIDDLEWARE', 'pass', 'middleware.ts exists')
  } else {
    addResult('Security Headers', 'MIDDLEWARE', 'warn', 'middleware.ts not found - security headers may not be applied')
  }
}

async function checkGitSecurity() {
  log('\n🔍 Checking Git Security...', colors.blue)

  // Check .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore')

  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8')

    const patterns = [
      { name: 'ENV_FILES', pattern: /\.env/i, description: 'Environment files' },
      { name: 'NODE_MODULES', pattern: /node_modules/i, description: 'Node modules' },
      { name: 'SECRETS', pattern: /secrets|credentials/i, description: 'Secrets and credentials' },
    ]

    for (const { name, pattern, description } of patterns) {
      if (pattern.test(content)) {
        addResult('Git Security', name, 'pass', `${description} ignored in .gitignore`)
      } else {
        addResult('Git Security', name, 'warn', `${description} should be in .gitignore`)
      }
    }
  } else {
    addResult('Git Security', 'GITIGNORE', 'fail', '.gitignore not found')
  }

  // Check for accidentally committed secrets
  const envFiles = ['.env', '.env.local', '.env.production']
  for (const file of envFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      addResult('Git Security', `FILE_${file.toUpperCase().replace(/\./g, '_')}`, 'warn',
        `${file} exists - ensure it's not committed to git`)
    }
  }
}

function printResults() {
  log('\n' + '='.repeat(80), colors.bold)
  log('SECURITY AUDIT RESULTS', colors.bold)
  log('='.repeat(80), colors.bold)

  const categories = [...new Set(results.map((r) => r.category))]

  for (const category of categories) {
    log(`\n${category}:`, colors.bold)

    const categoryResults = results.filter((r) => r.category === category)

    for (const result of categoryResults) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️ ' : '❌'
      const color = result.status === 'pass' ? colors.green : result.status === 'warn' ? colors.yellow : colors.red

      log(`  ${icon} ${result.check}: ${result.message}`, color)

      if (result.details) {
        log(`     ℹ️  ${result.details}`, colors.reset)
      }
    }
  }

  // Summary
  const passed = results.filter((r) => r.status === 'pass').length
  const warnings = results.filter((r) => r.status === 'warn').length
  const failed = results.filter((r) => r.status === 'fail').length
  const total = results.length

  log('\n' + '='.repeat(80), colors.bold)
  log('SUMMARY', colors.bold)
  log('='.repeat(80), colors.bold)
  log(`✅ Passed: ${passed}/${total}`, colors.green)
  log(`⚠️  Warnings: ${warnings}/${total}`, colors.yellow)
  log(`❌ Failed: ${failed}/${total}`, colors.red)

  const score = Math.round((passed / total) * 100)
  const scoreColor = score >= 80 ? colors.green : score >= 60 ? colors.yellow : colors.red
  log(`\n📊 Security Score: ${score}%`, scoreColor)

  if (failed > 0) {
    log('\n⚠️  ATTENTION: Critical security issues found!', colors.red + colors.bold)
    log('Please address all failed checks before deploying to production.', colors.red)
  } else if (warnings > 0) {
    log('\n⚠️  Security warnings found. Review and address before production deployment.', colors.yellow)
  } else {
    log('\n✅ All security checks passed!', colors.green + colors.bold)
  }

  log('\n' + '='.repeat(80), colors.bold)
}

async function main() {
  log('🔒 GPT Agent Platform - Security Audit', colors.bold + colors.blue)
  log('Running security checks...\n', colors.blue)

  try {
    await checkEnvironmentVariables()
    await checkDatabaseSecurity()
    await checkRateLimiting()
    await checkEncryption()
    await checkDependencies()
    await checkSecurityHeaders()
    await checkGitSecurity()

    printResults()

    // Exit with error code if there are failures
    const failed = results.filter((r) => r.status === 'fail').length
    process.exit(failed > 0 ? 1 : 0)
  } catch (error) {
    log('\n❌ Security audit failed with error:', colors.red)
    console.error(error)
    process.exit(1)
  }
}

main()
