import { test, expect } from '@playwright/test'

test.describe('Production Login Test', () => {
  test('should login admin user on production', async ({ page }) => {
    // Перехватываем консольные логи
    const consoleLogs: string[] = []
    const consoleErrors: string[] = []
    
    page.on('console', msg => {
      const text = msg.text()
      if (msg.type() === 'error') {
        consoleErrors.push(text)
        console.log('🔴 Console Error:', text)
      } else {
        consoleLogs.push(text)
        if (text.includes('LoginClient') || text.includes('tenant') || text.includes('error')) {
          console.log('📝 Console Log:', text)
        }
      }
    })
    
    page.on('pageerror', error => {
      console.log('💥 Page Error:', error.message)
    })
    
    // Перехватываем сетевые запросы
    page.on('response', async response => {
      const url = response.url()
      if (url.includes('get-tenant-redirect') || url.includes('signIn') || url.includes('auth')) {
        const status = response.status()
        const body = await response.text().catch(() => '')
        console.log(`🌐 ${response.request().method()} ${url} - Status: ${status}`)
        if (status !== 200 || body.includes('error')) {
          console.log('📄 Response body:', body.substring(0, 500))
        }
      }
    })
    
    // Переходим на страницу входа
    await page.goto('https://gpt-agent-kwid.vercel.app/login')
    await page.waitForLoadState('networkidle')
    
    console.log('📄 Страница входа загружена')
    
    // Делаем скриншот до входа
    await page.screenshot({ path: 'test-results/login-before.png', fullPage: true })
    
    // Вводим email
    const emailInput = page.getByLabel('Email')
    await emailInput.waitFor({ state: 'visible', timeout: 10000 })
    await emailInput.fill('admin@worldwideservice.eu')
    console.log('✅ Email введен')
    
    // Вводим пароль
    const passwordInput = page.getByLabel('Пароль')
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
    await passwordInput.fill('l1tmw6u977c9!Q')
    console.log('✅ Пароль введен')
    
    // Делаем скриншот формы
    await page.screenshot({ path: 'test-results/login-form-filled.png', fullPage: true })
    
    // Нажимаем кнопку входа
    const loginButton = page.getByRole('button', { name: /войти/i })
    await loginButton.waitFor({ state: 'visible', timeout: 10000 })
    console.log('🖱️ Нажимаю кнопку входа...')
    await loginButton.click()
    
    // Ждем и проверяем что происходит
    console.log('⏳ Ожидаю обработку входа...')
    
    // Ждем до 30 секунд для получения tenant-id и редиректа
    let finalUrl = ''
    let attempts = 0
    const maxAttempts = 30
    
    while (attempts < maxAttempts) {
      await page.waitForTimeout(1000)
      finalUrl = page.url()
      console.log(`Попытка ${attempts + 1}/${maxAttempts}: Текущий URL: ${finalUrl}`)
      
      // Если мы не на странице логина - успех
      if (!finalUrl.includes('/login')) {
        console.log('✅ Редирект произошел!')
        break
      }
      
      // Ищем реальные сообщения об ошибках (не лейблы полей)
      const errorTexts = await page.locator('text=/Ошибка входа|не удалось|failed|error/i').all()
      for (const errorEl of errorTexts) {
        const text = await errorEl.textContent()
        if (text && !text.includes('Email') && !text.includes('Пароль') && !text.includes('Запомнить')) {
          console.log('❌ Сообщение об ошибке на странице:', text.trim())
        }
      }
      
      // Проверяем toast сообщения
      const toastMessages = await page.locator('[data-sonner-toast], [role="alert"], .toast, [class*="toast"]').all()
      for (const toast of toastMessages) {
        const text = await toast.textContent()
        if (text) {
          console.log('🔔 Toast сообщение:', text.trim())
        }
      }
      
      attempts++
    }
    
    // Делаем финальный скриншот
    await page.screenshot({ path: 'test-results/login-after.png', fullPage: true })
    
    // Проверяем результат
    console.log(`\n📊 Финальный URL: ${finalUrl}`)
    
    if (finalUrl.includes('/login')) {
      console.log('\n📊 АНАЛИЗ ОШИБКИ:')
      console.log('='.repeat(50))
      
      // Выводим все консольные ошибки
      if (consoleErrors.length > 0) {
        console.log('\n🔴 Ошибки в консоли:')
        consoleErrors.forEach(err => console.log('  -', err))
      }
      
      // Ищем сообщения об ошибках на странице
      const allErrorTexts = await page.locator('body').textContent()
      const errorMatch = allErrorTexts?.match(/Ошибка[^.]*|не удалось[^.]*/gi)
      if (errorMatch) {
        console.log('\n❌ Найденные ошибки на странице:')
        errorMatch.forEach(err => console.log('  -', err))
      }
      
      // Проверяем toast
      const toasts = await page.locator('[data-sonner-toast], [role="alert"]').all()
      if (toasts.length > 0) {
        console.log('\n🔔 Toast сообщения:')
        for (const toast of toasts) {
          const text = await toast.textContent()
          console.log('  -', text)
        }
      }
      
      console.log('='.repeat(50))
      
      throw new Error('Вход не выполнен - остались на странице логина')
    }
    
    // Проверяем что мы попали на платформу
    expect(finalUrl).toContain('/manage/')
    console.log('✅ Успешный вход! Редирект на:', finalUrl)
  })
})
