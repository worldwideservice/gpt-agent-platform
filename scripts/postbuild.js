#!/usr/bin/env node

/**
 * Post-build helper to patch Next.js manifests for hybrid App/Pages projects.
 *
 * - Ensures the legacy Pages Router manifest exists when we only ship API routes.
 * - Keeps the protected app directory manifest that some runtime paths expect.
 */

const { mkdirSync, writeFileSync, existsSync, readdirSync } = require('fs')
const { join } = require('path')

const projectRoot = process.cwd()
const nextDir = join(projectRoot, '.next')
const serverDir = join(nextDir, 'server')

function ensureProtectedAppManifest() {
  const protectedDir = join(serverDir, 'app', '(protected)')
  const manifestPath = join(protectedDir, 'page_client-reference-manifest.js')

  try {
    mkdirSync(protectedDir, { recursive: true })
    writeFileSync(manifestPath, 'module.exports = {}\n')
    console.log('postbuild: ensured page_client-reference-manifest.js exists')
  } catch (error) {
    console.warn('postbuild: failed to prepare protected app manifest:', error.message)
  }
}

function collectApiRoutes(apiDir) {
  const manifestEntries = {}

  const traverse = (filesystemPath, routeSegments = []) => {
    const entries = readdirSync(filesystemPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryFsPath = join(filesystemPath, entry.name)
      const entrySegments = [...routeSegments, entry.name]

      if (entry.isDirectory()) {
        traverse(entryFsPath, entrySegments)
        continue
      }

      if (!entry.isFile()) continue

      const routeWithoutExt = entrySegments.join('/').replace(/\.[^/.]+$/, '')
      if (routeWithoutExt === entrySegments.join('/')) continue // skip non-code files

      let normalizedRoute = routeWithoutExt.replace(/\\/g, '/')
      if (normalizedRoute.endsWith('/index')) {
        normalizedRoute = normalizedRoute.slice(0, -6)
      }

      const routePath = normalizedRoute ? `/api/${normalizedRoute}` : '/api'
      const filePath = `pages/api/${normalizedRoute || 'index'}`

      manifestEntries[routePath] = filePath
    }
  }

  traverse(apiDir, [])
  return manifestEntries
}

function ensurePagesManifest() {
  const pagesDir = join(projectRoot, 'pages')
  const apiDir = join(pagesDir, 'api')
  const pagesManifestPath = join(serverDir, 'pages-manifest.json')

  if (!existsSync(pagesDir) || !existsSync(apiDir)) {
    console.log('postbuild: no legacy pages/api routes detected, skipping pages-manifest.json')
    return
  }

  const manifest = existsSync(pagesManifestPath)
    ? (() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          return require(pagesManifestPath)
        } catch {
          return {}
        }
      })()
    : {}

  const apiRoutes = collectApiRoutes(apiDir)
  let updated = false

  for (const [route, target] of Object.entries(apiRoutes)) {
    if (manifest[route] !== target) {
      manifest[route] = target
      updated = true
    }
  }

  if (!updated && existsSync(pagesManifestPath)) {
    console.log('postbuild: pages-manifest.json already up to date')
    return
  }

  try {
    mkdirSync(serverDir, { recursive: true })
    writeFileSync(pagesManifestPath, JSON.stringify(manifest, null, 2))
    console.log(
      'postbuild: ensured pages-manifest.json with routes:',
      Object.keys(manifest).join(', ') || '(none)'
    )
  } catch (error) {
    console.warn('postbuild: failed to write pages-manifest.json:', error.message)
  }
}

ensureProtectedAppManifest()
ensurePagesManifest()
