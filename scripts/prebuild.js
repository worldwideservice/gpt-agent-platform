#!/usr/bin/env node

/**
 * Prebuild script - создаёт pages-manifest.json ДО сборки,
 * чтобы Next.js мог его прочитать во время "Collecting page data"
 */

const { mkdirSync, writeFileSync, existsSync, readdirSync } = require('fs')
const { join } = require('path')

const pagesDir = join(process.cwd(), 'pages')
const pagesManifestPath = join(process.cwd(), '.next', 'server', 'pages-manifest.json')

if (existsSync(pagesDir)) {
  const apiDir = join(pagesDir, 'api')
  const hasApiRoutes = existsSync(apiDir) && readdirSync(apiDir, { recursive: true }).some(f => 
    f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')
  )

  if (hasApiRoutes) {
    try {
      const pagesManifest = {}
      
      // Рекурсивно находим все routes в pages/api
      const findRoutes = (dir, basePath = []) => {
        if (!existsSync(dir)) return
        
        const entries = readdirSync(dir, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name)
          const newBasePath = [...basePath, entry.name]
          
          if (entry.isDirectory()) {
            findRoutes(fullPath, newBasePath)
          } else if (entry.isFile()) {
            // Проверяем, что это TypeScript/JavaScript файл
            if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
              // Формируем route (например, /api/socket/io из pages/api/socket/io.ts)
              const routeParts = newBasePath.slice(0, -1) // Убираем имя файла
              const fileName = newBasePath[newBasePath.length - 1]
              
              // Формируем путь маршрута
              let route = '/api'
              if (routeParts.length > 0) {
                route += '/' + routeParts.join('/')
              }
              // Добавляем имя файла без расширения (если не index)
              const baseFileName = fileName.replace(/\.(ts|tsx|js|jsx)$/, '')
              if (baseFileName !== 'index') {
                route += '/' + baseFileName
              }
              
              // Путь к исходному файлу (относительно корня проекта)
              const filePath = 'pages/api/' + newBasePath.join('/')
              
              pagesManifest[route] = filePath
            }
          }
        }
      }

      findRoutes(apiDir, '')

      // Убеждаемся, что директория .next/server существует
      mkdirSync(join(process.cwd(), '.next', 'server'), { recursive: true })

      // Создаём минимальный pages-manifest.json
      // Next.js ожидает этот файл, даже если он пустой (или с минимальным содержимым)
      if (Object.keys(pagesManifest).length === 0) {
        // Если routes не найдены, создаём пустой объект
        // Next.js может перезаписать его во время сборки
        writeFileSync(pagesManifestPath, JSON.stringify({}, null, 2))
        console.log('prebuild: created empty pages-manifest.json (Next.js will populate it during build)')
      } else {
        writeFileSync(pagesManifestPath, JSON.stringify(pagesManifest, null, 2))
        console.log('prebuild: created pages-manifest.json with', Object.keys(pagesManifest).length, 'routes')
        console.log('prebuild: routes:', Object.keys(pagesManifest).join(', '))
      }
    } catch (error) {
      console.warn('prebuild: failed to create pages-manifest.json:', error.message)
    }
  } else {
    console.log('prebuild: no API routes found in pages/, skipping pages-manifest.json')
  }
} else {
  console.log('prebuild: no pages/ directory found, skipping pages-manifest.json')
}

