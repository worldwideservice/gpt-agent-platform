import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const tenantId = 'test-tenant-id'
const fixedNow = new Date('2024-01-15T10:00:00Z').valueOf()

async function freezeTime(page: Page) {
  await page.addInitScript((now) => {
    const OriginalDate = Date
    class MockDate extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(now)
        } else {
          super(...args)
        }
      }

      static now() {
        return now
      }
    }

    // @ts-expect-error override for tests
    Date = MockDate
  }, fixedNow)
}

async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: '* , *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }',
  })
}

test.describe('Управление workspace /manage', () => {
  test('дашборд отображается стабильно (визуальный снимок)', async ({ page }) => {
    await freezeTime(page)
    await disableAnimations(page)

    await page.goto(`/manage/${tenantId}/dashboard`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Рабочее пространство')
    await expect(page).toHaveScreenshot('manage-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    })
  })

  test('управление агентами — создание, обновление и удаление', async ({ page }) => {
    const agents = [
      {
        id: 'seed-agent',
        name: 'Demo Agent',
        status: 'active',
        model: 'gpt-4o',
        ownerName: 'Demo Owner',
        updatedAt: '2024-01-10T10:00:00.000Z',
      },
    ]

    await page.route('**/api/agents**', async (route, request) => {
      const url = new URL(request.url())
      const method = request.method()

      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, data: agents, timestamp: new Date(fixedNow).toISOString() }),
          headers: { 'content-type': 'application/json' },
        })
      }

      if (method === 'POST') {
        const payload = JSON.parse(request.postData() ?? '{}')
        const newAgent = {
          id: `agent-${agents.length + 1}`,
          name: payload.name,
          status: payload.status ?? 'draft',
          model: payload.model ?? 'gpt-4o-mini',
          ownerName: 'Playwright',
          updatedAt: new Date(fixedNow).toISOString(),
        }
        agents.push(newAgent)
        return route.fulfill({
          status: 201,
          body: JSON.stringify({ success: true, data: newAgent }),
          headers: { 'content-type': 'application/json' },
        })
      }

      if (method === 'PATCH') {
        const agentId = url.pathname.split('/').pop() ?? ''
        const payload = JSON.parse(request.postData() ?? '{}')
        const target = agents.find((agent) => agent.id === agentId)
        if (target) {
          Object.assign(target, payload, { updatedAt: new Date(fixedNow).toISOString() })
        }
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, data: target ?? null }),
          headers: { 'content-type': 'application/json' },
        })
      }

      if (method === 'DELETE') {
        const agentId = url.pathname.split('/').pop() ?? ''
        const index = agents.findIndex((agent) => agent.id === agentId)
        if (index >= 0) {
          agents.splice(index, 1)
        }
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
          headers: { 'content-type': 'application/json' },
        })
      }

      return route.fallback()
    })

    await freezeTime(page)
    await page.goto(`/manage/${tenantId}/ai-agents`)
    await page.waitForLoadState('networkidle')

    const table = page.getByRole('table')
    await expect(table).toContainText('Demo Agent')

    await page.getByLabel('Название').fill('Playwright Agent')
    await page.getByLabel('Модель').fill('gpt-4o-mini')
    await page.getByRole('button', { name: 'Создать агента' }).click()
    await expect(page.getByText('Агент создан')).toBeVisible()

    await page.getByRole('button', { name: 'Обновить' }).click()
    await expect(table).toContainText('Playwright Agent')

    await page.evaluate(async () => {
      await fetch('/api/agents/agent-2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Agent', status: 'inactive' }),
      })
    })
    await page.getByRole('button', { name: 'Обновить' }).click()
    await expect(table).toContainText('Updated Agent')

    await page.evaluate(async () => {
      await fetch('/api/agents/agent-2', { method: 'DELETE' })
    })
    await page.getByRole('button', { name: 'Обновить' }).click()
    await expect(table).not.toContainText('Updated Agent')
  })

  test('загрузка знаний из файла отображает уведомление об успехе', async ({ page }) => {
    await page.route('**/api/agents/*/assets', async (route, request) => {
      if (request.method() === 'POST') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
          headers: { 'content-type': 'application/json' },
        })
      }
      return route.fallback()
    })

    await freezeTime(page)
    await page.goto(`/manage/${tenantId}/knowledge-base`)
    await page.waitForLoadState('networkidle')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({ name: 'demo.md', mimeType: 'text/markdown', buffer: Buffer.from('# Demo file') })
    await page.getByRole('button', { name: 'Загрузить' }).click()

    await expect(page.getByText('Файл загружен и отправлен на обработку')).toBeVisible()
  })

  test('старт OAuth Kommo показывает сообщение и сохраняет редирект', async ({ page }) => {
    await page.route('**/api/integrations/kommo/oauth/start', async (route, request) => {
      if (request.method() === 'POST') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, authUrl: 'https://kommo.example/oauth' }),
          headers: { 'content-type': 'application/json' },
        })
      }
      return route.fallback()
    })

    await page.addInitScript(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: { href: '', assign(url: string) { this.href = url }, reload() {} },
      })
    })

    await page.goto(`/manage/${tenantId}/integrations`)
    await page.waitForLoadState('networkidle')

    const domainField = page.getByLabel('Домен Kommo')
    await domainField.fill('demo.kommo.com')
    await page.getByRole('button', { name: 'Подключить' }).click()

    await expect(page.getByText('Переходим к авторизации…')).toBeVisible()
    await expect.poll(async () => page.evaluate(() => window.location.href)).toBe('https://kommo.example/oauth')
  })
})
