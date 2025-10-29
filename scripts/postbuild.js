#!/usr/bin/env node

const { mkdirSync, writeFileSync } = require('fs')
const { join } = require('path')

const outputDir = join(process.cwd(), '.next', 'server', 'app', '(protected)')

try {
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(join(outputDir, 'page_client-reference-manifest.js'), 'module.exports = {}\n')
  console.log('postbuild: ensured page_client-reference-manifest.js exists')
} catch (error) {
  console.warn('postbuild: failed to create manifest stub', error)
}
