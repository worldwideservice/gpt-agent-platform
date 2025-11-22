import { chromium, type Page } from 'playwright'
import * as path from 'path'
import * as fs from 'fs/promises'

const PAGES = [
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/edit',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/leads-contacts',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/triggers',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/sequences',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/available-integrations',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/advanced-settings',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/create',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/test-chat',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/knowledge-categories',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/knowledge-categories?tableFilters[category_filter][parent_id]=582',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/knowledge-categories/create',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/knowledge-items',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/knowledge-items/create',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/account-settings',
  'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/pricing',
]

interface ButtonInfo {
  text: string
  type: string
  selector: string
  ariaLabel?: string
  href?: string
  onClick?: string
  wireClick?: string
  disabled: boolean
  visible: boolean
  position: { x: number; y: number }
}

async function analyzePage(page: Page, url: string) {
  console.log(`\n📄 Анализирую: ${url}`)
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000)
  
  // Закрываем модалки
  try {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  } catch {}
  
  const slug = url.split('/').pop() || 'index'
  const outputDir = path.join('kwid/raw/scrape/pages', slug)
  await fs.mkdir(outputDir, { recursive: true })
  
  // Скриншот
  await page.screenshot({ path: path.join(outputDir, 'full-page.png'), fullPage: true })
  
  // HTML
  const html = await page.content()
  await fs.writeFile(path.join(outputDir, 'page.html'), html)
  
  // Анализ всех кнопок и элементов
  const buttons = await page.evaluate(() => {
    const elements: ButtonInfo[] = []
    
    // Все кликабельные элементы
    const selectors = [
      'button',
      'a[href]',
      '[role="button"]',
      '[onclick]',
      '[wire\\:click]',
      '[x-on\\:click]',
      'input[type="submit"]',
      'input[type="button"]',
      '[data-action]',
      '[data-wire-click]',
    ]
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el: Element) => {
        const rect = el.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          const text = (el.textContent || '').trim().substring(0, 100)
          const ariaLabel = el.getAttribute('aria-label') || undefined
          const href = (el as HTMLElement).getAttribute('href') || undefined
          const onClick = el.getAttribute('onclick') || undefined
          const wireClick = el.getAttribute('wire:click') || el.getAttribute('data-wire-click') || undefined
          
          elements.push({
            text,
            type: el.tagName.toLowerCase(),
            selector: `${el.tagName.toLowerCase()}${el.className ? '.' + el.className.split(' ').join('.') : ''}`,
            ariaLabel,
            href,
            onClick,
            wireClick,
            disabled: (el as HTMLButtonElement).disabled || false,
            visible: true,
            position: { x: rect.left, y: rect.top },
          })
        }
      })
    })
    
    return elements
  })
  
  // Сохраняем анализ
  const analysis = {
    url,
    timestamp: new Date().toISOString(),
    title: await page.title(),
    buttons: buttons,
    totalButtons: buttons.length,
  }
  
  await fs.writeFile(
    path.join(outputDir, 'analysis.json'),
    JSON.stringify(analysis, null, 2)
  )
  
  console.log(`   ✅ Найдено кнопок: ${buttons.length}`)
  console.log(`   📁 Сохранено в: ${outputDir}`)
  
  return analysis
}

async function main() {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  })
  
  const page = await context.newPage()
  page.setDefaultTimeout(30000)
  
  // АВТОРИЗАЦИЯ В KOMMO CRM
  const kommoDomain = process.env.KOMMO_DOMAIN || 'worldwideservices.kommo.com'
  console.log('🌐 Открываю Kommo CRM...')
  await page.goto(`https://${kommoDomain}/`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  })
  
  await page.waitForTimeout(2000)
  
  // Авторизация
  console.log('🔐 Авторизуюсь в Kommo...')
  try {
    const kommoEmail = process.env.KOMMO_EMAIL || 'admin@worldwideservice.eu'
    const kommoPassword = process.env.KOMMO_PASSWORD || 'l1tmw6u977c9!Q'
    
    if (!kommoEmail || !kommoPassword) {
      throw new Error('KOMMO_EMAIL и KOMMO_PASSWORD должны быть установлены в .env')
    }
    
    // Ищем поле email
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', kommoEmail)
    await page.waitForTimeout(500)
    
    // Ищем поле password
    await page.fill('input[type="password"], input[name="password"]', kommoPassword)
    await page.waitForTimeout(500)
    
    // Ищем кнопку входа
    await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Войти"), button:has-text("Вход")')
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 })
    console.log('✅ Авторизован в Kommo!')
  } catch (error) {
    console.log(`⚠️  Ошибка авторизации: ${error}`)
  }
  
  await page.waitForTimeout(3000)
  
  // Переходим в настройки интеграций
  console.log('🔧 Перехожу в настройки интеграций...')
  try {
    await page.goto(`https://${kommoDomain}/settings/integrations`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(3000)
    
    // Ищем GPT Agent или KWID виджет
    const widgetLink = page.locator('a:has-text("GPT Agent"), a:has-text("KWID"), a:has-text("GPT"), [href*="kwid"], [href*="gpt"]').first()
    if (await widgetLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await widgetLink.click()
      await page.waitForTimeout(2000)
    }
    
    // Ищем кнопку "Открыть настройки" или "Open Settings"
    const settingsButton = page.locator('button:has-text("Открыть настройки"), button:has-text("Open Settings"), a:has-text("Открыть настройки"), a:has-text("Open Settings")').first()
    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click()
      await page.waitForTimeout(3000)
    }
  } catch (error) {
    console.log(`⚠️  Не удалось автоматически открыть настройки: ${error}`)
    console.log('📍 Откройте вручную: Настройки → Интеграции → GPT Agent → Открыть настройки')
  }
  
  // Ждем пока откроется KWID
  console.log('⏳ Жду открытия KWID...')
  let kwidPage: Page | null = null
  for (let i = 0; i < 30; i++) {
    const pages = context.pages()
    for (const p of pages) {
      const url = p.url()
      if (url.includes('wearekwid.com') || url.includes('aai.widgets')) {
        kwidPage = p
        await p.bringToFront()
        await p.waitForLoadState('networkidle')
        console.log('✅ KWID открыт!')
        break
      }
    }
    if (kwidPage) break
    await page.waitForTimeout(1000)
  }
  
  if (!kwidPage) {
    console.log('⚠️  KWID не открыт автоматически, использую текущую страницу')
    kwidPage = page
  }
  
  const activePage = kwidPage
  
  const results = []
  
  // Теперь анализируем каждую страницу, переходя через навигацию KWID
  for (const url of PAGES) {
    try {
      const analysis = await analyzePage(activePage, url)
      results.push(analysis)
      await activePage.waitForTimeout(2000)
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error}`)
    }
  }
  
  // Сохраняем общий отчет
  const report = {
    totalPages: PAGES.length,
    analyzedPages: results.length,
    timestamp: new Date().toISOString(),
    results: results.map(r => ({
      url: r.url,
      title: r.title,
      totalButtons: r.totalButtons,
    })),
  }
  
  await fs.writeFile(
    'kwid/raw/scrape/pages/REPORT.json',
    JSON.stringify(report, null, 2)
  )
  
  console.log(`\n✅ Анализ завершен!`)
  console.log(`   📊 Проанализировано: ${results.length}/${PAGES.length} страниц`)
  console.log(`   📁 Результаты: kwid/raw/scrape/pages/`)
  
  await browser.close()
}

main().catch(console.error)
