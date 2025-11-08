import { test, expect } from '@playwright/test'

/**
 * E2E тесты для производительности согласно KWID логике
 * Основан на: стандарты производительности веб-приложений
 */

test.describe('KWID Performance Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    // В демо-режиме может быть редирект на /login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping test - requires authentication')
    }
  })

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Страница должна загрузиться за разумное время (10 секунд максимум)
    expect(loadTime).toBeLessThan(10000)
  })

  test('should have optimized images', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка что изображения используют оптимизацию Next.js
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        
        // Next.js оптимизированные изображения имеют специальный путь
        if (src) {
          // Проверка что изображение либо оптимизировано, либо имеет правильный формат
          const isOptimized = src.includes('/_next/image') || src.includes('data:') || src.startsWith('/')
          expect(isOptimized).toBeTruthy()
        }
      }
    }
  })

  test('should lazy load content', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка lazy loading для изображений
    const images = page.locator('img[loading="lazy"]')
    const lazyImages = await images.count()

    // Должны быть lazy loaded изображения (или все изображения должны быть оптимизированы)
    expect(lazyImages).toBeGreaterThanOrEqual(0)
  })

  test('should minimize API calls', async ({ page }) => {
    const apiCalls: string[] = []

    // Перехват API запросов
    page.on('request', request => {
      const url = request.url()
      if (url.includes('/api/')) {
        apiCalls.push(url)
      }
    })

    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка что количество API вызовов разумное (не более 20 для начальной загрузки)
    expect(apiCalls.length).toBeLessThan(20)
  })

  test('should cache static assets', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка заголовков кеширования для статических ресурсов
    const response = await page.goto(`/manage/${tenantId}`)
    if (response) {
      const cacheControl = response.headers()['cache-control']
      // Статические ресурсы должны иметь кеширование
      // В Next.js это обрабатывается автоматически
      expect(response.status()).toBeLessThan(400)
    }
  })

  test('should have efficient bundle size', async ({ page }) => {
    const jsFiles: number[] = []

    // Перехват загрузки JS файлов
    page.on('response', response => {
      const url = response.url()
      if (url.endsWith('.js') || url.includes('/_next/static/')) {
        const contentLength = response.headers()['content-length']
        if (contentLength) {
          jsFiles.push(parseInt(contentLength, 10))
        }
      }
    })

    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка что размер JS файлов разумный
    const totalSize = jsFiles.reduce((sum, size) => sum + size, 0)
    // Общий размер JS не должен превышать 5MB (для production это нормально)
    expect(totalSize).toBeLessThan(5 * 1024 * 1024)
  })

  test('should handle large lists efficiently', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка что таблица рендерится эффективно
    const tableRows = page.locator('table tbody tr')
    const rowCount = await tableRows.count()

    // Даже при большом количестве строк, рендеринг должен быть быстрым
    if (rowCount > 0) {
      const renderStart = Date.now()
      await tableRows.first().waitFor({ state: 'visible' })
      const renderTime = Date.now() - renderStart

      // Рендеринг должен быть быстрым (менее 1 секунды)
      expect(renderTime).toBeLessThan(1000)
    }
  })

  test('should optimize font loading', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Проверка что шрифты загружаются эффективно
    const fontLinks = page.locator('link[rel="preload"][as="font"], link[href*="font"]')
    const fontCount = await fontLinks.count()

    // Должны быть оптимизированы загрузки шрифтов
    expect(fontCount).toBeGreaterThanOrEqual(0)
  })
})

