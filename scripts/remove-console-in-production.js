#!/usr/bin/env node

/**
 * Script to remove console.log statements in production builds
 * 
 * Usage: node scripts/remove-console-in-production.js
 * 
 * This script should be run as part of the build process
 * to remove console.log statements from production code.
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const CONSOLE_PATTERNS = [
  /console\.(log|debug|info)\([^)]*\);?/g,
  /console\.(log|debug|info)\([^)]*\)/g,
]

const ALLOWED_CONSOLE = [
  'console.error',
  'console.warn',
]

function shouldProcessFile(filePath) {
  // Skip node_modules, .next, and other build directories
  const skipPatterns = [
    'node_modules',
    '.next',
    'dist',
    'build',
    '.git',
    'coverage',
    'playwright-report',
  ]

  return !skipPatterns.some(pattern => filePath.includes(pattern))
}

function removeConsoleLogs(content, filePath) {
  let modified = content
  let removed = 0

  // Remove console.log, console.debug, console.info
  CONSOLE_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        // Check if it's an allowed console method
        const isAllowed = ALLOWED_CONSOLE.some(allowed => match.includes(allowed))
        if (!isAllowed) {
          modified = modified.replace(match, '')
          removed++
        }
      })
    }
  })

  // Clean up multiple empty lines
  modified = modified.replace(/\n\s*\n\s*\n/g, '\n\n')

  return { modified, removed }
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const { modified, removed } = removeConsoleLogs(content, filePath)

    if (removed > 0) {
      fs.writeFileSync(filePath, modified, 'utf8')
      console.log(`✓ Removed ${removed} console.log from ${filePath}`)
      return removed
    }

    return 0
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message)
    return 0
  }
}

function main() {
  const args = process.argv.slice(2)
  const directory = args[0] || process.cwd()

  console.log(`🔍 Scanning for console.log in ${directory}...`)

  const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
    cwd: directory,
    absolute: true,
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
    ],
  })

  let totalRemoved = 0
  let filesProcessed = 0

  files.forEach(file => {
    if (shouldProcessFile(file)) {
      const removed = processFile(file)
      if (removed > 0) {
        filesProcessed++
        totalRemoved += removed
      }
    }
  })

  console.log(`\n✅ Done!`)
  console.log(`   Files processed: ${filesProcessed}`)
  console.log(`   Console.log removed: ${totalRemoved}`)
}

if (require.main === module) {
  main()
}

module.exports = { removeConsoleLogs, processFile }

