import { test, expect, Page } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'founder@example.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'Demo1234!'
const tenantId = process.env.E2E_TENANT_ID ?? '0-demo-org'
const agentId = process.env.E2E_AGENT_ID ?? '10000000-0000-4000-8000-000000000100'
const agentDetailPath = `/manage/${tenantId}/ai-agents/${agentId}`
const integrationsPath = `/manage/${tenantId}/integrations`

async function loginIfRequired(page: Page) {
  const loginHeading = page.getByRole('heading', { name: 'Вход в GPT Agent' })
  if (await loginHeading.isVisible().catch(() => false)) {
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Пароль').fill(adminPassword)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: 'Войти' }).click(),
    ])
  }
}

async function cleanupRule(page: Page, agentId: string, ruleName: string) {
  await page.evaluate(
    async ([agentId, ruleName]) => {
      const response = await fetch(`/api/agents/${agentId}/rules`)
      if (!response.ok) return
      const payload = await response.json()
      if (!payload?.success) return
      const rule = (payload.data ?? []).find((item: { name: string }) => item.name === ruleName)
      if (!rule?.id) return
      await fetch(`/api/rules/${rule.id}`, { method: 'DELETE' })
    },
    [agentId, ruleName],
  )
}

async function createTestWebhookEvent(
  page: Page,
  data: { eventType?: string; status?: string; payload?: Record<string, unknown>; error?: string } = {},
) {
  return page.evaluate(
    async (payload) => {
      const response = await fetch('/api/test/webhook-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await response.json()
      if (!response.ok || !body.success) {
        throw new Error(body.error || 'Не удалось создать тестовое webhook событие')
      }
      return body.data
    },
    data,
  )
}

async function deleteTestWebhookEvent(page: Page, eventId: string) {
  await page.evaluate(
    async (id) => {
      await fetch(`/api/test/webhook-event?eventId=${id}`, { method: 'DELETE' })
    },
    eventId,
  )
}

test.describe('Rule engine & Kommo sync flows', () => {
  test('executes mocked rule action flow', async ({ request }) => {
    const response = await request.post('/api/test/rule-engine-flow', {
      data: { action: 'send_message', value: 'Hello from Playwright' },
    })
    const payload = await response.json()

    expect(response.status()).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.result).toBe(true)
  })

  test('performs mocked Kommo sync', async ({ request }) => {
    const response = await request.post('/api/test/kommo-sync', {
      data: { triggeredBy: 'playwright' },
    })
    const payload = await response.json()

    expect(response.status()).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.message).toContain('Mocked Kommo sync')
    expect(payload.payload?.triggeredBy).toBe('playwright')
  })

  test('workspace summary exposes Kommo stats', async ({ request }) => {
    const response = await request.get('/api/manage/test-tenant/summary')
    const payload = await response.json()

    expect(response.status()).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.data).toBeDefined()
    expect(payload.data.integrations).toHaveProperty('kommoConnected')
  })

  test('creates rule via UI and previews execution', async ({ page }) => {
    await page.goto(agentDetailPath, { waitUntil: 'networkidle' })
    await loginIfRequired(page)
    await page.goto(agentDetailPath, { waitUntil: 'networkidle' })
    await page.goto(agentDetailPath, { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: 'Rule Engine' })).toBeVisible()

    const ruleName = `Playwright rule ${Date.now()}`
    await page.fill('#rule-name', ruleName)
    await page.fill('input[placeholder="Значение"]', 'playwright-e2e')

    try {
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes(`/api/agents/${agentId}/rules`) &&
            response.request().method() === 'POST' &&
            response.status() === 200,
        ),
        page.getByRole('button', { name: 'Создать правило' }).click(),
      ])

      await expect(page.getByText(ruleName)).toBeVisible()

      await page.getByRole('button', { name: 'Запустить предпросмотр' }).click()
      await expect(page.getByText('Правила выполнены. Проверьте логи выполнения.')).toBeVisible()
    } finally {
      await cleanupRule(page, agentId, ruleName)
    }
  })

  test('retries webhook event from Kommo panel', async ({ page }) => {
    await page.goto(agentDetailPath, { waitUntil: 'networkidle' })
    await loginIfRequired(page)

    const eventType = `playwright.webhook.${Date.now()}`
    const event = await createTestWebhookEvent(page, {
      eventType,
      status: 'failed',
      payload: { source: 'playwright-e2e' },
    })

    try {
      await page.goto(integrationsPath, { waitUntil: 'networkidle' })
      await expect(page.getByRole('heading', { name: 'Интеграции' })).toBeVisible()

      const eventCard = page.locator('div', { hasText: eventType }).first()
      await expect(eventCard).toBeVisible()

      const retryButton = eventCard.getByRole('button', { name: 'Повторить' })
      const retryResponse = page.waitForResponse(
        (response) =>
          response.url().includes(`/api/integrations/kommo/webhook/events/${event.id}`) &&
          response.request().method() === 'POST' &&
          response.status() === 200,
      )

      await retryButton.click()
      await retryResponse

      await expect(eventCard.getByRole('button', { name: 'Повторить' })).toBeVisible()
    } finally {
      await deleteTestWebhookEvent(page, event.id)
    }
  })
})
