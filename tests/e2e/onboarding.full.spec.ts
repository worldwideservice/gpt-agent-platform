import { test, expect } from '@playwright/test'

test.describe('Полный мастер онбординга', () => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'founder@example.com'
  const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'Demo1234!'

  test('подключение CRM и запуск агента', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Полный мастер прогоняется только в Chromium для ускорения')

    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globalAny = window as unknown as Record<string, any>
      globalAny.open = (url: string) => {
        globalAny.__lastOpenedUrl = url
        return window
      }
    })

    let credentialsConfigured = false
    let connectionConfigured = false
    let syncStatus: 'queued' | 'running' | 'completed' = 'queued'
    let agent: {
      id: string
      name: string
      status: string
      defaultModel: string | null
      createdAt: string
    } | null = null

    const buildSync = () => {
      if (!connectionConfigured) {
        return null
      }

      return {
        status: syncStatus,
        requestedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        completedAt: syncStatus === 'completed' ? new Date().toISOString() : null,
        failedAt: null,
        provider: 'kommo',
        baseDomain: 'example.amocrm.ru',
        pipelinesCount: syncStatus === 'completed' ? 2 : 0,
        stagesCount: syncStatus === 'completed' ? 6 : 0,
        pipelinesPreview:
          syncStatus === 'completed'
            ? [
                { externalId: 'pip-1', name: 'Основная воронка', stages: ['Новое', 'В работе', 'Контракт'] },
                { externalId: 'pip-2', name: 'Upsell', stages: ['Старт', 'Переговоры', 'Оплата'] },
              ]
            : [],
        error: null,
      }
    }

    const buildState = () => {
      const sync = buildSync()
      const completed = Boolean(credentialsConfigured && connectionConfigured && syncStatus === 'completed' && agent)

      return {
        crm: {
          provider: 'kommo',
          credentialsConfigured,
          connectionConfigured,
          credentials: credentialsConfigured
            ? {
                clientId: 'client-id-demo',
                redirectUri: 'https://app.example.com/integrations/kommo/oauth/callback',
                updatedAt: new Date().toISOString(),
              }
            : null,
          connection: connectionConfigured
            ? {
                id: 'connection-1',
                baseDomain: 'example.amocrm.ru',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                metadata: {},
              }
            : null,
          sync,
        },
        agent,
        isCompleted: completed,
      }
    }

    await page.route('**/api/integrations/kommo/credentials', async (route) => {
      credentialsConfigured = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await page.route('**/api/integrations/kommo/oauth/start', async (route) => {
      connectionConfigured = true
      syncStatus = 'completed'
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, authUrl: 'https://oauth.example.com' }),
      })
    })

    await page.route('**/api/onboarding/status', async (route) => {
      const state = buildState()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, state }),
      })
    })

    await page.route('**/api/onboarding/agent', async (route) => {
      const payload = (await route.request().postDataJSON()) as {
        name: string
        model: string
        goal: string
        channels: string[]
        schedule: string
      }

      agent = {
        id: 'agent-1',
        name: payload.name,
        status: 'active',
        defaultModel: payload.model,
        createdAt: new Date().toISOString(),
      }

      const state = buildState()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, state }),
      })
    })

    await page.goto('/login')

    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Пароль').fill(adminPassword)

    await Promise.all([
      page.waitForURL((url) => ['/', '/onboarding'].includes(url.pathname), { waitUntil: 'networkidle' }),
      page.getByRole('button', { name: 'Войти' }).click(),
    ])

    if (new URL(page.url()).pathname !== '/onboarding') {
      await page.goto('/onboarding')
    }

    await expect(page.getByText('Добро пожаловать! Настроим систему за 3 шага')).toBeVisible()

    await page.getByLabel('Client ID / Integration ID').fill('client-id-demo')
    await page.getByLabel('Client Secret / OAuth Secret').fill('secret-demo')
    await page.getByLabel('Redirect URI').fill('https://app.example.com/integrations/kommo/oauth/callback')
    await page.getByLabel('Домен CRM').fill('example.amocrm.ru')

    await page.getByRole('button', { name: 'Подключить CRM' }).click()

    await page.waitForTimeout(200)

    await page.evaluate(() => {
      window.postMessage(
        {
          type: 'kommo-oauth-result',
          result: {
            success: true,
            connection: {
              id: 'connection-1',
              base_domain: 'example.amocrm.ru',
            },
          },
        },
        window.location.origin,
      )
    })

    await expect(page.getByLabel('Название агента')).toBeVisible()

    await page.getByLabel('Название агента').fill('AI Менеджер продаж')
    await page.getByLabel('Основная задача агента').fill('Квалифицировать лидов и передавать менеджеру')

    await page.getByRole('button', { name: 'Сохранить настройки' }).click()

    await expect(page.getByText('CRM успешно подключена')).toBeVisible()
    await expect(page.getByText('AI агент')).toBeVisible()

    await page.getByRole('button', { name: 'Запустить агента' }).click()

    await expect(page).toHaveURL((url) => url.pathname === '/')
  })
})
