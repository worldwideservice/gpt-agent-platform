import { chromium } from 'playwright'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'founder@example.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Demo1234!'

async function openAgentEditPage() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()
  
  try {
    // Логинимся
    console.log('Вход в систему...')
    await page.goto(`${baseURL}/login`)
    await page.waitForLoadState('networkidle')
    
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Пароль').fill(adminPassword)
    await page.getByRole('button', { name: 'Войти' }).click()
    
    // Ждем редиректа
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 })
    await page.waitForLoadState('networkidle')
    
    console.log('Переход на страницу агентов...')
    // Переходим на страницу агентов
    await page.goto(`${baseURL}/agents`)
    await page.waitForLoadState('networkidle')
    
    // Пытаемся найти первого агента или кнопку создания
    const agentLink = page.locator('a[href*="/agents/"]:not([href*="/agents/new"]):not([href*="/agents/create"])').first()
    
    const agentExists = await agentLink.isVisible({ timeout: 3000 }).catch(() => false)
    
    if (agentExists) {
      // Получаем href первого агента
      const href = await agentLink.getAttribute('href')
      if (href) {
        console.log(`Найден агент: ${href}`)
        // Переходим на страницу редактирования
        const agentId = href.split('/agents/')[1]?.split('/')[0]
        if (agentId) {
          await page.goto(`${baseURL}/agents/${agentId}/edit`)
          await page.waitForLoadState('networkidle')
          console.log(`✅ Страница настроек агента открыта: ${baseURL}/agents/${agentId}/edit`)
          
          // Ждем чтобы пользователь мог посмотреть
          console.log('Браузер останется открытым. Нажмите Ctrl+C чтобы закрыть.')
          // Не закрываем браузер - оставляем открытым
          await new Promise(() => {}) // Бесконечное ожидание
        }
      }
    } else {
      // Если агентов нет, открываем страницу создания
      console.log('Агенты не найдены. Открываем страницу создания нового агента...')
      await page.goto(`${baseURL}/agents/new`)
      await page.waitForLoadState('networkidle')
      console.log(`✅ Страница создания агента открыта: ${baseURL}/agents/new`)
      
      // Ждем
      console.log('Браузер останется открытым. Нажмите Ctrl+C чтобы закрыть.')
      await new Promise(() => {})
    }
  } catch (error) {
    console.error('Ошибка:', error)
    await browser.close()
    process.exit(1)
  }
}

openAgentEditPage().catch(console.error)





