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
  // НЕ создаём манифесты для App Router route groups
  // Next.js создаёт их автоматически только для страниц (page.tsx), не для layouts
  // Создание манифеста для (protected) layout может конфликтовать с реальными манифестами
  // и вызывать ошибку "Cannot read properties of undefined (reading 'clientModules')"
  // Если Next.js не создал манифест для route group, значит он не нужен
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

function validateAppRouterManifests() {
  // Проверяем наличие манифестов для критических страниц App Router
  const criticalPages = [
    'app/page_client-reference-manifest.js', // Главная страница
  ]

  let allValid = true

  for (const relPath of criticalPages) {
    const manifestPath = join(serverDir, relPath)

    if (!existsSync(manifestPath)) {
      console.warn(`postbuild: ⚠️  Missing manifest: ${relPath}`)
      allValid = false
      continue
    }

    try {
      // Читаем и проверяем структуру манифеста
      const content = require('fs').readFileSync(manifestPath, 'utf8')
      
      // Проверяем наличие ключевых полей
      const hasClientModules = content.includes('"clientModules"') || content.includes("'clientModules'")
      
      if (!hasClientModules) {
        console.warn(`postbuild: ⚠️  Manifest ${relPath} missing clientModules`)
        allValid = false
      } else {
        // Пытаемся проверить структуру через eval (безопасно, т.к. это наш код)
        try {
          // Извлекаем ключ манифеста из содержимого
          const keyMatch = content.match(/__RSC_MANIFEST\["([^"]+)"\]/)
          if (keyMatch) {
            console.log(`postbuild: ✓ Manifest ${relPath} has key "${keyMatch[1]}" and clientModules`)
          }
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
      }
    } catch (error) {
      console.warn(`postbuild: ⚠️  Failed to validate ${relPath}:`, error.message)
      allValid = false
    }
  }

  if (allValid) {
    console.log('postbuild: ✓ All App Router manifests validated')
  } else {
    console.warn('postbuild: ⚠️  Some App Router manifests are missing or invalid')
  }
}

// Создаём только pages-manifest.json для Pages Router
// НЕ создаём манифесты для App Router - Next.js делает это сам
ensurePagesManifest()

// Валидируем манифесты App Router для диагностики
validateAppRouterManifests()
