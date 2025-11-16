/* eslint-disable no-console */
import { expect, test } from '@playwright/test'

/**
 * E2E Security Tests: Tenant Access Control
 *
 * Проверяет, что middleware корректно блокирует доступ
 * к API endpoints других организаций (tenants).
 *
 * CRITICAL Security Test для OWASP A01:2021 - Broken Access Control
 */

test.describe('Security: Tenant Access Control', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу логина
    await page.goto('/login')
  })

  test('должен ЗАПРЕТИТЬ доступ к API другого tenant через подмену URL (403 Forbidden)', async ({ page, request }) => {
    // 1. Логинимся как обычный пользователь
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 2. Ожидаем редиректа на dashboard своей организации
    await page.waitForURL(/\/manage\/[^/]+/)
    const currentUrl = page.url()
    const match = currentUrl.match(/\/manage\/([^/]+)/)
    const currentTenantId = match?.[1]

    expect(currentTenantId).toBeTruthy()
    console.log(`[TEST] Current user's tenant: ${currentTenantId}`)

    // 3. Получаем cookies сессии
    const cookies = await page.context().cookies()

    // 4. Пытаемся получить доступ к API чужой организации
    const maliciousTenantId = 'malicious-tenant-999'

    const response = await request.get(
      `/api/manage/${maliciousTenantId}/dashboard/stats`,
      {
        headers: {
          cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
        },
      }
    )

    // 5. Ожидаемый результат: 403 Forbidden
    expect(response.status()).toBe(403)

    const json = await response.json()
    expect(json.error).toContain('Forbidden')

    console.log(`[TEST] ✅ Access to malicious tenant correctly blocked with 403`)
  })

  test('должен РАЗРЕШИТЬ доступ к API своего tenant (200 OK)', async ({ page, request }) => {
    // 1. Логинимся
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 2. Получаем tenantId своей организации
    await page.waitForURL(/\/manage\/[^/]+/)
    const currentUrl = page.url()
    const match = currentUrl.match(/\/manage\/([^/]+)/)
    const currentTenantId = match?.[1]

    expect(currentTenantId).toBeTruthy()

    // 3. Получаем cookies
    const cookies = await page.context().cookies()

    // 4. Запрашиваем данные своей организации
    const response = await request.get(
      `/api/manage/${currentTenantId}/dashboard/stats`,
      {
        headers: {
          cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
        },
      }
    )

    // 5. Ожидаемый результат: 200 OK (или 404 если данных нет)
    expect([200, 404]).toContain(response.status())

    console.log(`[TEST] ✅ Access to own tenant correctly allowed with ${response.status()}`)
  })

  test('должен возвращать 401 для не авторизованных пользователей', async ({ request }) => {
    // 1. Пытаемся получить доступ без сессии
    const response = await request.get('/api/manage/any-tenant/dashboard/stats')

    // 2. Ожидаемый результат: 401 Unauthorized
    expect(response.status()).toBe(401)

    const json = await response.json()
    expect(json.error).toContain('Unauthorized')

    console.log(`[TEST] ✅ Unauthenticated request correctly blocked with 401`)
  })

  test('должен возвращать 400 для невалидного tenantId', async ({ page, request }) => {
    // 1. Логинимся
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/manage\/[^/]+/)

    // 2. Получаем cookies
    const cookies = await page.context().cookies()

    // 3. Пытаемся получить доступ с пустым tenantId
    const response = await request.get('/api/manage//dashboard/stats', {
      headers: {
        cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
      },
    })

    // 4. Ожидаемый результат: 400 Bad Request или 404
    expect([400, 404]).toContain(response.status())

    console.log(`[TEST] ✅ Invalid tenantId correctly rejected with ${response.status()}`)
  })
})

test.describe('Security: SQL Injection Prevention', () => {
  test('должен безопасно обрабатывать SQL injection попытки в tenantId', async ({ page, request }) => {
    // 1. Логинимся
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/manage\/[^/]+/)

    // 2. Получаем cookies
    const cookies = await page.context().cookies()

    // 3. Пытаемся SQL injection через tenantId
    const maliciousTenantId = "tenant' OR '1'='1"

    const response = await request.get(
      `/api/manage/${encodeURIComponent(maliciousTenantId)}/dashboard/stats`,
      {
        headers: {
          cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
        },
      }
    )

    // 4. Ожидаемый результат: 403 или 400, НЕ 200 (не должен вернуть данные)
    expect(response.status()).not.toBe(200)
    expect([400, 403, 404]).toContain(response.status())

    console.log(`[TEST] ✅ SQL Injection attempt safely handled with ${response.status()}`)
  })
})
