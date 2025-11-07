import { test, expect, Page } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'founder@example.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'Demo1234!'
const tenantId = process.env.E2E_TENANT_ID ?? '0-demo-org'
const agentId = process.env.E2E_AGENT_ID ?? '10000000-0000-4000-8000-000000000100'

const agentEditPath = `/manage/${tenantId}/ai-agents/${agentId}/edit`

async function loginIfRequired(page: Page) {
  const loginHeading = page.getByRole('heading', { name: 'Вход в GPT Agent' })
  if (!(await loginHeading.isVisible().catch(() => false))) {
    return
  }

  const emailInput = page.getByLabel('Email')
  const passwordInput = page.getByLabel('Пароль')

  await emailInput.fill(adminEmail)
  await passwordInput.fill(adminPassword)

  const loginButton = page.getByRole('button', { name: 'Войти' })
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    loginButton.click(),
  ])
}

test.describe('Редактирование агента — каналы', () => {
  test('переключение каналов сохраняется и восстанавливается', async ({ page }) => {
    await page.goto(agentEditPath, { waitUntil: 'networkidle' })

    if (page.url().includes('/login')) {
      await loginIfRequired(page)
      await page.goto(agentEditPath, { waitUntil: 'networkidle' })
    }

    await expect(page.getByRole('heading', { name: 'Профиль агента' })).toBeVisible()

    const allChannelsSwitch = page.getByTestId('channels-all-switch')
    await expect(allChannelsSwitch).toHaveAttribute('data-state', 'checked')

    await allChannelsSwitch.click()
    await expect(allChannelsSwitch).toHaveAttribute('data-state', 'unchecked')

    const emailSwitch = page.getByTestId('channel-switch-email')
    await expect(emailSwitch).toHaveAttribute('data-state', 'checked')
    await emailSwitch.click()
    await expect(emailSwitch).toHaveAttribute('data-state', 'unchecked')

    await page.getByRole('button', { name: 'Сохранить' }).first().click()
    await page.waitForTimeout(1000)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Профиль агента' })).toBeVisible()

    const allSwitchAfterReload = page.getByTestId('channels-all-switch')
    await expect(allSwitchAfterReload).toHaveAttribute('data-state', 'unchecked')

    const emailSwitchAfterReload = page.getByTestId('channel-switch-email')
    await expect(emailSwitchAfterReload).toHaveAttribute('data-state', 'unchecked')

    await allSwitchAfterReload.click()
    await expect(allSwitchAfterReload).toHaveAttribute('data-state', 'checked')

    await page.getByRole('button', { name: 'Сохранить' }).first().click()
    await page.waitForTimeout(1000)
  })
})

