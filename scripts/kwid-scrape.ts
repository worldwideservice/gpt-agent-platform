import { chromium, type Browser, type BrowserContext, type Locator, type Page, type Route } from 'playwright'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

type ParsedJSON = Record<string, unknown>

const MANUAL_GENERATION_KEYS = [
  'data.manual_generation',
  'manual_generation',
  'data.copilot_enabled',
  'copilot_enabled',
]

type Argv = {
  scenario?: string
  task?: string
  headless: boolean
  persistAuth: boolean
  storageState: string
  outputDir: string
}

type Scenario = (session: ScrapeSession) => Promise<void>

type LivewireWatcher = {
  label: string
  predicate: (payload: LivewirePayload) => boolean
  saveAs: {
    request: string
    response: string
    parsed?: string
  }
  parse?: (payload: LivewirePayload) => ParsedJSON | Promise<ParsedJSON>
  resolve: (value: LivewirePayload) => void
  reject: (reason?: unknown) => void
}

type LivewirePayload = {
  url: string
  component: string
  actionNames: string[]
  requestBody: ParsedJSON
  responseBody: ParsedJSON | string
  timestamp: number
}

const DEFAULT_STORAGE_STATE = path.join(process.cwd(), 'playwright', '.auth', 'kwid.json')
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'kwid', 'raw', 'scrape')

const isCI = process.env.CI === 'true'

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

async function saveJson(targetPath: string, data: unknown) {
  await ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, JSON.stringify(data, null, 2), 'utf8')
}

async function saveText(targetPath: string, contents: string) {
  await ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, contents, 'utf8')
}

async function saveBuffer(targetPath: string, contents: Buffer) {
  await ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, contents)
}

function parseArgs(): Argv {
  const args = process.argv.slice(2)
  const options: Argv = {
    scenario: undefined,
    task: undefined,
    headless: !process.env.PLAYWRIGHT_HEADFUL && !args.includes('--headed') && !args.includes('--headful'),
    persistAuth: !args.includes('--no-persist-auth'),
    storageState: process.env.KWID_STORAGE_STATE ?? DEFAULT_STORAGE_STATE,
    outputDir: process.env.KWID_SCRAPE_OUTPUT ?? DEFAULT_OUTPUT_DIR,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    switch (arg) {
      case '--scenario':
      case '-s':
        options.scenario = args[i + 1]
        i += 1
        break
      case '--task':
      case '-t':
        options.task = args[i + 1]
        i += 1
        break
      case '--headless':
        options.headless = true
        break
      case '--headed':
      case '--headful':
        options.headless = false
        break
      case '--storage-state':
        options.storageState = args[i + 1]
        i += 1
        break
      case '--output':
        options.outputDir = args[i + 1]
        i += 1
        break
      case '--persist-auth':
        options.persistAuth = true
        break
      case '--no-persist-auth':
        options.persistAuth = false
        break
      default:
        break
    }
  }

  return options
}

class LivewireRecorder {
  private watchers: LivewireWatcher[] = []

  private page?: Page
  private readonly outputDir: string
  private boundHandler?: (route: Route) => Promise<void>

  constructor(outputDir: string) {
    this.outputDir = outputDir
  }

  async attach(page: Page) {
    if (this.page && this.boundHandler) {
      await this.page.unroute('**/livewire/message/**', this.boundHandler)
    }

    this.page = page
    this.boundHandler = (route: Route) => this.handleRoute(route)
    await this.page.route('**/livewire/message/**', this.boundHandler)
  }

  waitFor(options: Omit<LivewireWatcher, 'resolve' | 'reject'>): Promise<LivewirePayload> {
    return new Promise((resolve, reject) => {
      this.watchers.push({ ...options, resolve, reject })
    })
  }

  private async handleRoute(route: Route) {
    const request = route.request()
    const now = Date.now()

    let requestBody: ParsedJSON = {}
    const postData = request.postData()
    if (postData) {
      try {
        requestBody = JSON.parse(postData)
      } catch (error) {
        console.warn('Failed to parse Livewire request payload', error)
      }
    }

    const response = await route.fetch()
    const responseBuffer = await response.body()

    let responseBody: ParsedJSON | string = responseBuffer.toString()
    try {
      responseBody = JSON.parse(responseBuffer.toString())
    } catch {
      // responses like 204/no-content
    }

    const component = request.url().split('/').pop() ?? 'unknown'
    const actionNames = extractActionNames(requestBody)

    const payload: LivewirePayload = {
      url: request.url(),
      component,
      actionNames,
      requestBody,
      responseBody,
      timestamp: now,
    }

    await route.fulfill({ response, body: responseBuffer })

    this.emit(payload)
  }

  private emit(payload: LivewirePayload) {
    const pending: LivewireWatcher[] = []
    for (const watcher of this.watchers) {
      if (watcher.predicate(payload)) {
        const { saveAs, parse, label } = watcher
        void this.persist(payload, saveAs, parse).catch((error) => {
          console.error(`Failed to persist Livewire capture for ${label}`, error)
        })
        watcher.resolve(payload)
      } else {
        pending.push(watcher)
      }
    }
    this.watchers = pending
  }

  private async persist(
    payload: LivewirePayload,
    saveAs: LivewireWatcher['saveAs'],
    parse?: LivewireWatcher['parse'],
  ) {
    const baseDir = this.outputDir
    await saveJson(path.join(baseDir, 'actions', `${saveAs.request}.json`), payload.requestBody)
    await saveJson(path.join(baseDir, 'actions', `${saveAs.response}.json`), payload.responseBody)

    if (saveAs.parsed) {
      let parsed: ParsedJSON = {}
      if (parse) {
        parsed = await Promise.resolve(parse(payload))
      } else {
        parsed = defaultParseLivewire(payload)
      }
      await saveJson(path.join(baseDir, 'actions', 'parsed', `${saveAs.parsed}.json`), parsed)
    }
  }
}

function extractActionNames(requestBody: ParsedJSON): string[] {
  const components = (requestBody.components as ParsedJSON[]) ?? []
  const names: string[] = []

  for (const component of components) {
    const calls = component.calls as ParsedJSON[] | undefined
    const updates = component.updates as ParsedJSON | undefined
    if (Array.isArray(calls)) {
      for (const call of calls) {
        const method = typeof call.method === 'string' ? call.method : undefined
        if (method) {
          names.push(method)
        }
      }
    }
    if (updates && typeof updates === 'object') {
      for (const key of Object.keys(updates)) {
        names.push(key)
      }
    }
  }

  return names
}

function defaultParseLivewire(payload: LivewirePayload): ParsedJSON {
  const components = payload.requestBody.components as ParsedJSON[] | undefined
  const component = components?.[0] as ParsedJSON | undefined
  if (!component) {
    return { raw: payload.responseBody }
  }

  const memo = component.memo ?? {}
  const updates = component.updates ?? {}
  const calls = component.calls ?? []

  return {
    url: payload.url,
    component: memo,
    calls,
    updates,
    response: payload.responseBody,
  } as ParsedJSON
}

function getValueByPath(target: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object') {
      if (Array.isArray(acc)) {
        const index = Number(segment)
        if (Number.isInteger(index) && index >= 0 && index < acc.length) {
          return acc[index]
        }
        return undefined
      }
      return (acc as Record<string, unknown>)[segment]
    }
    return undefined
  }, target)
}

function extractBooleanValue(source: ParsedJSON | undefined, keys: string[]): boolean | undefined {
  if (!source || typeof source !== 'object') return undefined

  for (const key of keys) {
    if (key.includes('.')) {
      const value = getValueByPath(source, key.split('.'))
      if (typeof value === 'boolean') return value
    } else {
      const value = (source as Record<string, unknown>)[key]
      if (typeof value === 'boolean') return value
    }
  }

  return undefined
}

function extractManualGenerationValue(payload: LivewirePayload): boolean | undefined {
  const components = payload.requestBody.components as ParsedJSON[] | undefined

  if (components) {
    for (const component of components) {
      const updates = component.updates as ParsedJSON | undefined
      const data = component.data as ParsedJSON | undefined
      const snapshot = component.snapshot as ParsedJSON | undefined
      const memo = snapshot?.data as ParsedJSON | undefined

      const fromUpdates = extractBooleanValue(updates, MANUAL_GENERATION_KEYS)
      if (typeof fromUpdates === 'boolean') return fromUpdates

      const fromData = extractBooleanValue(data, MANUAL_GENERATION_KEYS)
      if (typeof fromData === 'boolean') return fromData

      const fromMemo = extractBooleanValue(memo, MANUAL_GENERATION_KEYS)
      if (typeof fromMemo === 'boolean') return fromMemo
    }
  }

  const response = payload.responseBody as ParsedJSON | undefined
  const serverMemo = typeof response === 'object' ? (response?.serverMemo as ParsedJSON | undefined) : undefined
  const responseData = serverMemo?.data as ParsedJSON | undefined

  return extractBooleanValue(responseData, MANUAL_GENERATION_KEYS)
}

function manualGenerationPredicate(expected: boolean, options: { strict?: boolean } = {}) {
  const { strict = false } = options
  return (payload: LivewirePayload) => {
    if (!payload.actionNames.includes('save')) return false
    let containsManualKey = false
    try {
      containsManualKey = JSON.stringify(payload.requestBody).includes('manual_generation')
    } catch {
      // ignore
    }
    console.log(
      `[manual-toggle] save payload component=${payload.component} containsManual=${containsManualKey} expected=${expected}`,
    )
    const value = extractManualGenerationValue(payload)
    // Если в payload пришло явно требуемое значение — отлично
    if (typeof value === 'boolean') {
      return value === expected
    }

    // Если данные не пришли, пробуем найти признак изменения manual_generation в requestBody
    const components = payload.requestBody.components as ParsedJSON[] | undefined
    if (components) {
      for (const component of components) {
        const updates = component.updates as ParsedJSON | undefined
        const data = component.data as ParsedJSON | undefined
        const snapshot = component.snapshot as ParsedJSON | undefined
        const memo = snapshot?.data as ParsedJSON | undefined

        const fromUpdates = extractBooleanValue(updates, MANUAL_GENERATION_KEYS)
        if (typeof fromUpdates === 'boolean') {
          return fromUpdates === expected
        }

        const fromData = extractBooleanValue(data, MANUAL_GENERATION_KEYS)
        if (typeof fromData === 'boolean') {
          return fromData === expected
        }

        const fromMemo = extractBooleanValue(memo, MANUAL_GENERATION_KEYS)
        if (typeof fromMemo === 'boolean') {
          return fromMemo === expected
        }
      }
    }

    // Последний fallback — проверяем, фигурирует ли manual_generation в сыром теле запроса.
    if (containsManualKey) {
      return true
    }

    return !strict
  }
}

function parseManualGenerationPayload(payload: LivewirePayload) {
  const value = extractManualGenerationValue(payload)
  return {
    url: payload.url,
    actionNames: payload.actionNames,
    manualGeneration: value,
    request: payload.requestBody,
    response: payload.responseBody,
  }
}

class ScrapeSession {
  static async create(options: Argv) {
    const browser = await chromium.launch({
      headless: options.headless ?? !isCI,
    })

    const storageStateExists = await fileExists(options.storageState)
    const context = storageStateExists
      ? await browser.newContext({
          storageState: options.storageState,
          viewport: { width: 1440, height: 900 },
          ignoreHTTPSErrors: true,
        })
      : await browser.newContext({
          viewport: { width: 1440, height: 900 },
          ignoreHTTPSErrors: true,
        })

    // Сразу проверяем все открытые страницы - может быть KWID уже открыт
    const allPages = context.pages()
    let page: Page | undefined
    let kwidPageFound = false
    
    for (const existingPage of allPages) {
      const url = existingPage.url()
      if (url.includes('aai.widgets.wearekwid.com') || url.includes('wearekwid.com')) {
        console.log('✅ Страница KWID уже открыта! Использую её...')
        page = existingPage
        await existingPage.bringToFront()
        await existingPage.waitForLoadState('networkidle')
        kwidPageFound = true
        break
      }
    }
    
    // Если не нашли KWID - используем первую открытую страницу или создаем новую
    if (!kwidPageFound) {
      // Используем первую открытую страницу, если есть
      if (allPages.length > 0) {
        page = allPages[0]
        const currentUrl = page.url()
        // НЕ делаем goto если страница уже открыта - просто используем её!
        if (currentUrl.includes('kommo.com') || currentUrl.includes('wearekwid.com')) {
          console.log(`✅ Использую уже открытую страницу: ${currentUrl.substring(0, 80)}...`)
        } else if (currentUrl === 'about:blank' || currentUrl === '') {
          // Только если страница пустая - открываем Kommo
          console.log('')
          console.log('🌐 Открываю Kommo для ручной авторизации...')
          await page.goto('https://worldwideservices.kommo.com/leads/pipeline/10586055/?skip_filter=Y', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          })
        } else {
          console.log(`✅ Использую уже открытую страницу: ${currentUrl.substring(0, 80)}...`)
        }
      } else {
        // Если нет открытых страниц - создаем новую
        page = await context.newPage()
        console.log('')
        console.log('🌐 Открываю Kommo для ручной авторизации...')
        await page.goto('https://worldwideservices.kommo.com/leads/pipeline/10586055/?skip_filter=Y', {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
      }
      
      console.log('📍 После авторизации:')
      console.log('   1. Перейдите в Настройки → Интеграции')
      console.log('   2. Найдите GPT Agent')
      console.log('   3. Нажмите "Открыть настройки"')
      console.log('   4. Скрипт автоматически найдет открытую вкладку KWID и продолжит работу')
      console.log('')
      console.log('✅ Браузер готов! Выполните авторизацию и переход на KWID...')
      console.log('')
    }
    
    if (!page) {
      throw new Error('Failed to create or find page')
    }
    
    page.setDefaultTimeout(45_000)

    const recorder = new LivewireRecorder(options.outputDir)
    await recorder.attach(page)

    const session = new ScrapeSession(browser, context, page, recorder, options)

    // Если страница KWID уже открыта - сразу возвращаем сессию
    if (kwidPageFound) {
      console.log('✅ Страница KWID готова! Продолжаю работу...')
      return session
    }

    // Если нет - ждем открытия KWID в любой вкладке
    if (!storageStateExists) {
      await session.login()
    }

    return session
  }

  private readonly browser: Browser
  readonly context: BrowserContext
  readonly recorder: LivewireRecorder
  readonly options: Argv
  private _page: Page

  private constructor(
    browser: Browser,
    context: BrowserContext,
    page: Page,
    recorder: LivewireRecorder,
    options: Argv,
  ) {
    this.browser = browser
    this.context = context
    this._page = page
    this.recorder = recorder
    this.options = options
  }

  get page() {
    return this._page
  }

  private async setActivePage(page: Page) {
    if (this._page === page) return
    this._page = page
    await this.recorder.attach(page)
    page.setDefaultTimeout(45_000)
  }

  async closeModalsAndPopups() {
    // Закрываем все модалки и попапы
    const modalSelectors = [
      '[role="dialog"] button[aria-label*="close"]',
      '[role="dialog"] button[aria-label*="Close"]',
      '[role="dialog"] button:has-text("×")',
      '[role="dialog"] button:has-text("✕")',
      '.modal button[aria-label*="close"]',
      '.modal button[aria-label*="Close"]',
      '.modal .close',
      '.modal-header button',
      '[data-dismiss="modal"]',
      '.popup button[aria-label*="close"]',
      '.popup .close',
      '.overlay button[aria-label*="close"]',
      'button:has-text("Закрыть")',
      'button:has-text("Close")',
      '[data-modal-close]',
      '[data-popup-close]',
    ]

    for (const selector of modalSelectors) {
      try {
        const closeButton = this.page.locator(selector).first()
        if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await closeButton.click({ force: true })
          await this.page.waitForTimeout(500)
          console.log(`   ✓ Закрыл модалку через: ${selector.substring(0, 50)}...`)
        }
      } catch {
        // Игнорируем ошибки
      }
    }

    // Нажимаем Escape для закрытия модалок
    try {
      await this.page.keyboard.press('Escape')
      await this.page.waitForTimeout(300)
    } catch {
      // Игнорируем ошибки
    }

    // Проверяем, есть ли еще видимые модалки
    const visibleModals = await this.page.locator('[role="dialog"]:visible, .modal:visible, .popup:visible').count()
    if (visibleModals > 0) {
      console.log(`   ⚠️  Осталось ${visibleModals} видимых модалок, пробую закрыть через клик вне модалки`)
      // Кликаем вне модалки
      try {
        await this.page.click('body', { position: { x: 10, y: 10 } })
        await this.page.waitForTimeout(500)
      } catch {
        // Игнорируем ошибки
      }
    }
  }

  async login() {
    // Постоянно проверяем все открытые вкладки - ждем пока пользователь откроет KWID
    console.log('')
    console.log('⏳ Ожидаю открытия страницы KWID...')
    console.log('📍 После авторизации в Kommo:')
    console.log('   1. Перейдите в Настройки → Интеграции')
    console.log('   2. Найдите GPT Agent')
    console.log('   3. Нажмите "Открыть настройки"')
    console.log('   4. Скрипт автоматически найдет открытую вкладку KWID')
    console.log('')
    
    const maxWaitTime = 600_000 // 10 минут
    const checkInterval = 1000
    const startTime = Date.now()
    let checkCount = 0
    
    while (Date.now() - startTime < maxWaitTime) {
      checkCount++
      
      // Проверяем все открытые вкладки
      const allPages = this.context.pages()
      for (const page of allPages) {
        const pageUrl = page.url()
        if (pageUrl.includes('aai.widgets.wearekwid.com') || pageUrl.includes('wearekwid.com')) {
          console.log('✅ Страница KWID найдена в открытой вкладке! Использую её...')
          await this.setActivePage(page)
          await page.bringToFront()
          await page.waitForLoadState('networkidle')
          // Сохраняем авторизацию для следующих запусков
          await this.persistAuth()
          return
        }
      }
      
      // Проверяем текущую страницу
      const currentUrl = this.page.url()
      if (currentUrl.includes('aai.widgets.wearekwid.com') || currentUrl.includes('wearekwid.com')) {
        console.log('✅ Уже на странице KWID, продолжаю работу')
        await this.page.waitForLoadState('networkidle')
        // Сохраняем авторизацию для следующих запусков
        await this.persistAuth()
        return
      }
      
      // Логируем каждые 10 проверок
      if (checkCount % 10 === 0) {
        const allPagesCheck = this.context.pages()
        const urls = allPagesCheck.map(p => p.url()).join(', ')
        console.log(`🔍 Проверка #${checkCount}, открытые вкладки: ${allPagesCheck.length}, URLs: ${urls.substring(0, 100)}...`)
      }
      
      await this.page.waitForTimeout(checkInterval)
    }
    
    throw new Error('Timeout: Не удалось открыть страницу KWID за 10 минут')
  }

  async gotoRelative(
    pathname: string,
    waitUntil: NonNullable<Parameters<Page['goto']>[1]>['waitUntil'] = 'domcontentloaded',
  ) {
    // Закрываем модалки перед навигацией
    await this.closeModalsAndPopups()

    const baseUrl =
      process.env.KWID_BASE_URL ?? 'https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices'

    const isAbsoluteUrl = /^https?:\/\//i.test(pathname)
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname
    const target = isAbsoluteUrl ? pathname : new URL(normalizedPath, normalizedBase).toString()

    await this.page.goto(target, {
      waitUntil,
      timeout: 60_000,
    })

    if (waitUntil === 'domcontentloaded') {
      await this.page.waitForTimeout(2000)
    }

    // Закрываем модалки после навигации
    await this.closeModalsAndPopups()
  }

  async capturePageSnapshot(slug: string, options?: { captureTables?: boolean }) {
    const page = this.page
    const base = path.join(this.options.outputDir, `${slug}`)

    await ensureDir(this.options.outputDir)

    const html = await page.content()
    await saveText(`${base}.html`, html)

    const textContent = await page.evaluate(() => document.body.innerText)
    await saveText(`${base}.txt`, textContent)

    const screenshot = await page.screenshot({ fullPage: true })
    await saveBuffer(`${base}.png`, screenshot)

    if (options?.captureTables) {
      const tables = await page.evaluate(captureTableStructure)
      await saveJson(`${base}.tables.json`, {
        title: await page.title(),
        url: page.url(),
        tables,
      })
    }
  }

  async captureFormSnapshot(slug: string, options?: { includeFields?: boolean }) {
    await this.capturePageSnapshot(path.join('forms', slug), { captureTables: false })

    if (options?.includeFields) {
      const data = await this.page.evaluate(extractFormFields)
      await saveJson(path.join(this.options.outputDir, 'forms', `${slug}.fields.json`), data)
    }
  }

  async captureFormBehavior(slug: string) {
    const [validations, dependencies, states] = await Promise.all([
      this.page.evaluate(extractFormValidationsSnapshot),
      this.page.evaluate(extractFieldDependenciesSnapshot),
      this.page.evaluate(extractComponentStatesSnapshot),
    ])

    await this.saveBehaviorSnapshot(`${slug}.validations.json`, validations)
    await this.saveBehaviorSnapshot(`${slug}.dependencies.json`, dependencies)
    await this.saveBehaviorSnapshot(`${slug}.states.json`, states)
  }

  async captureComponentMapping(fileName: string) {
    const components = await this.page.evaluate(extractComponentMappingSnapshot)
    await this.saveMappingSnapshot(fileName, components)
  }

  async saveBehaviorSnapshot(fileName: string, data: unknown) {
    await saveJson(path.join(this.options.outputDir, 'behavior', fileName), data)
  }

  async saveMappingSnapshot(fileName: string, data: unknown) {
    await saveJson(path.join(this.options.outputDir, 'mapping', fileName), data)
  }

  async updateMagicLink() {
    // Обновить magic link через Kommo интеграцию
    const kommoUrl = process.env.KOMMO_ENTRY_URL ?? 'https://worldwideservices.kommo.com'
    const integrationsUrl = `${kommoUrl}/settings/integrations`
    
    console.log('🔄 Обновляю magic link через Kommo...')
    
    // Открыть страницу интеграций
    await this.page.goto(integrationsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await this.page.waitForTimeout(2000)
    
    // Найти GPT Agent / KWID интеграцию
    const integrationCard = this.page
      .locator('text=/KWID|kwid|GPT агент|GPT Agent|ChatGPT/i')
      .first()
    
    if (await integrationCard.isVisible({ timeout: 10000 }).catch(() => false)) {
      await integrationCard.scrollIntoViewIfNeeded()
      await this.page.waitForTimeout(500)
      
      // Найти кнопку "Открыть настройки" или "Обновить"
      const openButton = integrationCard
        .locator('xpath=ancestor::*[contains(@class,"widget") or contains(@class,"card")][1]//button[contains(., "Открыть") or contains(., "Open")]')
        .first()
      
      if (await openButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        const [newPage] = await Promise.all([
          this.context.waitForEvent('page').catch(() => undefined),
          openButton.click(),
        ])
        
        if (newPage) {
          await newPage.waitForLoadState('domcontentloaded')
          await this.setActivePage(newPage)
          await this.page.waitForURL('**/aai.widgets.wearekwid.com/**', { timeout: 30000 })
          console.log('✅ Magic link обновлен, KWID открыт')
          return true
        }
      }
    }
    
    console.log('⚠️  Не удалось автоматически обновить magic link')
    return false
  }

  async cleanupTemporaryEntities() {
    console.log('🧹 Очищаю временные сущности...')
    
    // Удалить временных агентов
    await this.gotoRelative('/ai-agents')
    await this.page.waitForTimeout(3000)
    
    const tempAgents = await this.page
      .locator('tbody tr')
      .filter({ hasText: /Temp Agent|Snapshot|Test Agent/i })
      .all()
    
    for (const agent of tempAgents) {
      try {
        const deleteButton = agent
          .getByRole('button', { name: /Удалить|Delete/i })
          .first()
        
        if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteButton.click()
          await this.page.waitForTimeout(500)
          
          const confirmButton = this.page
            .getByRole('button', { name: /Подтвердить|Confirm|Удалить|Delete/i })
            .first()
          
          if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmButton.click()
            await this.page.waitForTimeout(1000)
          }
        }
      } catch (error) {
        console.log(`⚠️  Не удалось удалить временного агента: ${error}`)
      }
    }
    
    // Удалить временные статьи/категории
    await this.gotoRelative('/knowledge-items')
    await this.page.waitForTimeout(2000)
    
    const tempItems = await this.page
      .locator('tbody tr')
      .filter({ hasText: /Snapshot|Test|Temp/i })
      .all()
    
    for (const item of tempItems.slice(0, 5)) { // Ограничиваем до 5 для безопасности
      try {
        const deleteButton = item
          .getByRole('button', { name: /Удалить|Delete/i })
          .first()
        
        if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteButton.click()
          await this.page.waitForTimeout(500)
          
          const confirmButton = this.page
            .getByRole('button', { name: /Подтвердить|Confirm/i })
            .first()
          
          if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmButton.click()
            await this.page.waitForTimeout(1000)
          }
        }
      } catch (error) {
        console.log(`⚠️  Не удалось удалить временную статью: ${error}`)
      }
    }
    
    console.log('✅ Очистка временных сущностей завершена')
  }

  async captureWebSocketMessages(timeout: number = 10000): Promise<Array<{ type: string; data: unknown; timestamp: number }>> {
    const messages: Array<{ type: string; data: unknown; timestamp: number }> = []
    
    try {
      // Перехватываем WebSocket сообщения через CDP
      const client = await this.page.context().newCDPSession(this.page)
      
      await client.send('Network.enable')
      await client.send('Runtime.enable')
      
      const receivedHandler = (event: { response: { payloadData: string } }) => {
        try {
          const data = JSON.parse(event.response.payloadData)
          messages.push({
            type: 'websocket-received',
            data,
            timestamp: Date.now(),
          })
        } catch {
          messages.push({
            type: 'websocket-received',
            data: event.response.payloadData,
            timestamp: Date.now(),
          })
        }
      }
      
      const sentHandler = (event: { response: { payloadData: string } }) => {
        try {
          const data = JSON.parse(event.response.payloadData)
          messages.push({
            type: 'websocket-sent',
            data,
            timestamp: Date.now(),
          })
        } catch {
          messages.push({
            type: 'websocket-sent',
            data: event.response.payloadData,
            timestamp: Date.now(),
          })
        }
      }
      
      client.on('Network.webSocketFrameReceived', receivedHandler)
      client.on('Network.webSocketFrameSent', sentHandler)
      
      // Ждем указанное время
      await this.page.waitForTimeout(timeout)
      
      // Очищаем обработчики
      client.off('Network.webSocketFrameReceived', receivedHandler)
      client.off('Network.webSocketFrameSent', sentHandler)
    } catch (error) {
      console.log('⚠️  Не удалось перехватить WebSocket сообщения через CDP:', error)
      // Fallback: перехватываем через перехват сетевых запросов
      const networkMessages: Array<{ url: string; method: string; data?: unknown }> = []
      
      this.page.on('request', (request) => {
        const url = request.url()
        if (url.includes('ws://') || url.includes('wss://') || url.includes('websocket')) {
          const postData = request.postData()
          if (postData) {
            try {
              const data = JSON.parse(postData)
              networkMessages.push({ url, method: request.method(), data })
            } catch {
              networkMessages.push({ url, method: request.method(), data: postData })
            }
          }
        }
      })
      
      await this.page.waitForTimeout(timeout)
      
      // Конвертируем сетевые сообщения в формат WebSocket
      for (const msg of networkMessages) {
        messages.push({
          type: 'websocket-network',
          data: msg,
          timestamp: Date.now(),
        })
      }
    }
    
    return messages
  }

  async captureLivewire<T extends LivewirePayload>(
    watcher: Omit<LivewireWatcher, 'resolve' | 'reject'>,
    action: () => Promise<unknown>,
    options?: { retries?: number; timeout?: number; skipOnTimeout?: boolean },
  ): Promise<T> {
    const retries = options?.retries ?? 3
    const timeout = options?.timeout ?? 25_000
    const skipOnTimeout = options?.skipOnTimeout ?? false
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Закрываем модалки перед действием
        await this.closeModalsAndPopups()
        
        console.log(`   🔄 Попытка ${attempt}/${retries} для ${watcher.label}...`)
        
        const waitPromise = this.recorder.waitFor({
          ...watcher,
          predicate: (payload) => {
            try {
              return watcher.predicate(payload)
            } catch {
              return false
            }
          },
        }) as Promise<T>
        
        // Увеличиваем таймаут для Livewire
        const timeoutPromise = new Promise<T>((_, reject) => {
          setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
        })
        
        // Выполняем действие
        const actionPromise = action()
        
        // Ждем либо ответ, либо таймаут
        try {
          const result = await Promise.race([waitPromise, timeoutPromise])
          await actionPromise.catch(() => {}) // Игнорируем ошибки действия
          
          // Закрываем модалки после действия
          await this.closeModalsAndPopups()
          
          console.log(`   ✅ ${watcher.label} - успешно получен ответ`)
          return result
        } catch (timeoutError) {
          // Если таймаут и разрешено пропускать - возвращаем пустой результат
          if (skipOnTimeout && attempt === retries) {
            console.log(`   ⚠️  ${watcher.label} - таймаут, но продолжаю...`)
            await this.closeModalsAndPopups()
            // Сохраняем хотя бы request
            const baseDir = this.options.outputDir
            await saveJson(
              path.join(baseDir, 'actions', `${watcher.saveAs.request}.json`),
              { timeout: true, label: watcher.label }
            )
            return { url: '', component: '', actionNames: [], requestBody: {}, responseBody: {}, timestamp: Date.now() } as unknown as T
          }
          throw timeoutError
        }
      } catch (error) {
        if (attempt < retries) {
          console.log(`   ⚠️  Попытка ${attempt}/${retries} не удалась: ${error}`)
          await this.closeModalsAndPopups()
          await this.page.waitForTimeout(3000)
          continue
        }
        console.log(`   ❌ Все попытки исчерпаны для ${watcher.label}`)
        throw error
      }
    }
    
    throw new Error('All retries exhausted')
  }

  async safeClick(selector: string | Locator, options?: { timeout?: number; retries?: number }) {
    const timeout = options?.timeout ?? 10_000
    const retries = options?.retries ?? 3
    const locator = typeof selector === 'string' ? this.page.locator(selector).first() : selector
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.closeModalsAndPopups()
        await locator.waitFor({ state: 'visible', timeout })
        await locator.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(500)
        await locator.click({ force: true, timeout })
        await this.page.waitForTimeout(1000)
        return
      } catch (error) {
        if (attempt < retries) {
          console.log(`   ⚠️  Клик не удался (попытка ${attempt}/${retries}), повторяю...`)
          await this.closeModalsAndPopups()
          await this.page.waitForTimeout(2000)
          continue
        }
        throw error
      }
    }
  }

  async safeFill(selector: string | Locator, text: string, options?: { timeout?: number; retries?: number }) {
    const timeout = options?.timeout ?? 10_000
    const retries = options?.retries ?? 3
    const locator = typeof selector === 'string' ? this.page.locator(selector).first() : selector
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.closeModalsAndPopups()
        await locator.waitFor({ state: 'visible', timeout })
        await locator.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(500)
        await locator.clear()
        await locator.fill(text, { timeout })
        await this.page.waitForTimeout(500)
        return
      } catch (error) {
        if (attempt < retries) {
          console.log(`   ⚠️  Заполнение не удалось (попытка ${attempt}/${retries}), повторяю...`)
          await this.closeModalsAndPopups()
          await this.page.waitForTimeout(2000)
          continue
        }
        throw error
      }
    }
  }

  async persistAuth() {
    if (!this.options.persistAuth) return
    await ensureDir(path.dirname(this.options.storageState))
    await this.context.storageState({ path: this.options.storageState })
  }

  async dispose() {
    await this.browser.close()
  }

  private async consumeMagicLink(link: string) {
    await this.page.goto(link, { waitUntil: 'networkidle' })
    await this.page.waitForURL((url) => url.toString().includes('/manage/'), { timeout: 30_000 })
  }

  private async loginViaKommo(email: string, password: string) {
    const entryUrl =
      process.env.KOMMO_ENTRY_URL ??
      'https://worldwideservices.kommo.com/leads/pipeline/10586055/?skip_filter=Y'

    await this.page.goto(entryUrl, { waitUntil: 'domcontentloaded' })

    await this.ensureKommoLogin(email, password)
    await this.openKWIDFromKommo()
    await this.page.waitForLoadState('networkidle')
  }

  private async ensureKommoLogin(email: string, password: string) {
    const loginSelectors = ['input[name="email"]', 'input[name="username"]']
    for (const selector of loginSelectors) {
      const input = this.page.locator(selector)
      if (await input.first().isVisible().catch(() => false)) {
        await input.first().fill(email)
        const passwordInput = this.page.locator('input[name="password"]')
        await passwordInput.fill(password)
        
        const submitButton = this.page
          .getByRole('button', { name: /login|log in|войти/i })
          .filter({ hasText: /login|log in|войти/i })
          .first()

        const clickTarget = (await submitButton.isVisible().catch(() => false))
          ? submitButton
          : this.page.locator('button[type="submit"]').first()

        // Кликаем и ждем навигации отдельно, чтобы избежать ошибок
        await clickTarget.click()
        try {
          await this.page.waitForURL('**', { timeout: 10000, waitUntil: 'domcontentloaded' })
        } catch {
          // Игнорируем ошибки навигации
        }
        await this.page.waitForTimeout(3000)
        // Ждем только domcontentloaded, не networkidle
        try {
          await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 })
        } catch {
          // Игнорируем таймаут
        }
        break
      }
    }
  }

  private async openKWIDFromKommo() {
    // Пробуем разные способы найти настройки
    const settingsTriggers = [
      'a[href*="settings"]',
      'a[href*="/settings/"]',
      'button:has-text("Настройки")',
      'a:has-text("Настройки")',
      'button:has-text("Settings")',
      'a:has-text("Settings")',
      '[data-testid*="settings"]',
      '[aria-label*="Настройки"]',
      '[aria-label*="Settings"]',
    ]
    await this.clickFirstVisible(settingsTriggers)
    await this.page.waitForTimeout(1000)
    await this.page.waitForLoadState('domcontentloaded')

    const integrationsTriggers = [
      'a[href*="integrations"]',
      'a[href*="widgets"]',
      'a[href*="/integrations"]',
      'a[href*="/widgets"]',
      'a:has-text("Интеграции")',
      'button:has-text("Интеграции")',
      'a:has-text("Integrations")',
      'button:has-text("Integrations")',
      '[data-testid="nav-settings-integrations"]',
      '[data-testid*="integration"]',
    ]
    await this.clickFirstVisible(integrationsTriggers)
    await this.page.waitForTimeout(1000)
    await this.page.waitForLoadState('domcontentloaded')
    
    // Задержка для загрузки списка интеграций
    await this.page.waitForTimeout(2000)

    // Приоритетный поиск: сначала KWID, затем GPT агент
    const searchPatterns = [
      /KWID/i,
      /kwid/i,
      /wearekwid/i,
      /GPT агент/i,
      /GPT Agent/i,
      /ChatGPT/i,
    ]

    let target: Locator | null = null
    let foundPattern: string | null = null

    // Ищем карточку интеграции по паттернам
    for (const pattern of searchPatterns) {
      const integrationCard = this.page.locator(`text=${pattern}`).first()
      
      if (await integrationCard.isVisible().catch(() => false)) {
        await integrationCard.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(500)
        
        const openButtons = integrationCard.locator(
          'xpath=ancestor::*[contains(@class,"widget") or contains(@class,"card") or contains(@class,"integration")][1]//button[contains(normalize-space(.), "Открыть") or contains(normalize-space(.), "Open")]',
        )

        if (await openButtons.first().isVisible().catch(() => false)) {
          target = openButtons.first()
          foundPattern = pattern.toString()
          console.log(`✅ Найден сервис по паттерну: ${foundPattern}`)
          break
        }
      }
    }

    // Fallback: поиск по кнопкам "Открыть настройки" с фильтрацией
    if (!target) {
      const clickables = [
        'button:has-text("Открыть настройки")',
        'button:has-text("Open Settings")',
        'a:has-text("Открыть настройки")',
        'a:has-text("Open Settings")',
      ]
      
      for (const selector of clickables) {
        const candidate = this.page.locator(selector).filter({ hasText: /KWID|kwid|GPT|ChatGPT/i })
        if (await candidate.first().isVisible().catch(() => false)) {
          target = candidate.first()
          break
        }
      }
    }

    // Последний fallback: любая кнопка "Открыть настройки"
    if (!target) {
      const fallback = this.page.locator(
        'button:has-text("Открыть настройки"), button:has-text("Open Settings"), a:has-text("Открыть настройки"), a:has-text("Open Settings")',
      )
      if (await fallback.first().isVisible().catch(() => false)) {
        target = fallback.first()
      } else {
        // Сохраняем скриншот для отладки
        const screenshot = await this.page.screenshot({ fullPage: true })
        await saveBuffer(
          path.join(this.options.outputDir, 'debug', `kommo-integrations-${Date.now()}.png`),
          screenshot
        )
        throw new Error('Failed to locate "Open Settings" for KWID/GPT Agent integration in Kommo. Screenshot saved in debug/')
      }
    }

    const [newPage] = await Promise.all([
      this.context.waitForEvent('page').catch(() => undefined),
      target.click(),
    ])
    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded')
      await newPage.waitForURL('**/aai.widgets.wearekwid.com/**', { timeout: 30_000 })
      await this.setActivePage(newPage)
    } else {
      await this.page.waitForURL('**/aai.widgets.wearekwid.com/**', { timeout: 30_000 })
    }

    await this.handleKommoOAuth()
  }

  private async handleKommoOAuth() {
    const oauthButtons = [
      'button:has-text("Authorize")',
      'button:has-text("Allow")',
      'button:has-text("Grant access")',
      'button:has-text("Разрешить")',
      'button:has-text("Продолжить")',
    ]
    for (const selector of oauthButtons) {
      const locator = this.page.locator(selector)
      if (await locator.first().isVisible().catch(() => false)) {
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => undefined),
          locator.first().click(),
        ])
        break
      }
    }
  }

  private async clickFirstVisible(selectors: string[]) {
    for (const selector of selectors) {
      const locator = this.page.locator(selector)
      if (await locator.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await locator.first().click()
        return
      }
    }
    // Если ничего не найдено - не падаем, просто продолжаем
    console.log(`⚠️  Не найдены элементы: ${selectors.slice(0, 3).join(', ')}... Продолжаю...`)
  }

  private async loginWithPassword(email: string, password: string) {
    const loginUrl = process.env.KWID_LOGIN_URL ?? 'https://aai.widgets.wearekwid.com/login'
    await this.page.goto(loginUrl, { waitUntil: 'domcontentloaded' })

    const emailField = this.page.locator('input[type="email"]')
    const passwordField = this.page.locator('input[type="password"]')
    const submitButton = this.page.locator('button[type="submit"]')

    await emailField.fill(email)
    await passwordField.fill(password)

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      submitButton.click(),
    ])
  }
}

async function fileExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function captureTableStructure() {
  const tables: {
    caption: string | null
    headers: string[]
    rows: string[][]
  }[] = []

  const elements = Array.from(document.querySelectorAll('table'))
  for (const element of elements) {
    const headers = Array.from(element.querySelectorAll('thead th')).map((cell) => (cell as HTMLElement).innerText.trim())
    const rows = Array.from(element.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => (cell as HTMLElement).innerText.trim()),
    )

    tables.push({
      caption: element.querySelector('caption')?.innerText.trim() ?? null,
      headers,
      rows,
    })
  }

  return tables
}

function extractFormFields() {
  const form = document.querySelector('form')
  if (!form) {
    return { error: 'Form not found' }
  }

  const fields: Record<
    string,
    {
      type: string
      label: string | null
      required: boolean
      placeholder: string | null
      helpText: string | null
    }
  > = {}

  const elements = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input, select, textarea',
  )

  for (const element of Array.from(elements)) {
    const name = element.getAttribute('name') ?? element.getAttribute('wire:model') ?? 'unknown'
    const label =
      element
        .closest('.filament-forms-field-wrapper')
        ?.querySelector<HTMLElement>('label, .fi-fo-field-label')
        ?.innerText.trim() ?? null

    const helpText =
      element
        .closest('.filament-forms-field-wrapper')
        ?.querySelector<HTMLElement>('.fi-fo-field-helper-text, .text-sm.text-gray-500')
        ?.innerText.trim() ?? null

    fields[name] = {
      type: element.getAttribute('type') ?? element.tagName.toLowerCase(),
      label,
      required: element.hasAttribute('required'),
      placeholder: element.getAttribute('placeholder'),
      helpText,
    }
  }

  return { fields }
}

function extractFormValidationsSnapshot() {
  const wrappers = Array.from(
    document.querySelectorAll<HTMLElement>('.filament-forms-field-wrapper, .fi-fo-field'),
  )

  const result: Record<
    string,
    {
      label: string | null
      required: boolean
      rules: {
        minlength?: string | null
        maxlength?: string | null
        pattern?: string | null
      }
      errorMessage: string | null
    }
  > = {}

  for (const wrapper of wrappers) {
    const field =
      wrapper.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input[name], select[name], textarea[name]',
      ) ??
      wrapper.querySelector<HTMLInputElement>('input[wire\\:model]')

    const label =
      wrapper.querySelector<HTMLElement>('label, .fi-fo-field-label')?.innerText.trim() ?? null
    const key =
      field?.getAttribute('name') ??
      field?.getAttribute('wire:model') ??
      wrapper.getAttribute('data-field-name') ??
      label ??
      `field-${wrappers.indexOf(wrapper)}`

    if (!field) continue

    result[key] = {
      label,
      required: field.hasAttribute('required') || wrapper.classList.contains('fi-required'),
      rules: {
        minlength: field.getAttribute('minlength'),
        maxlength: field.getAttribute('maxlength'),
        pattern: field.getAttribute('pattern'),
      },
      errorMessage:
        wrapper.querySelector<HTMLElement>('.fi-fo-field-error-message, .text-danger')
          ?.innerText.trim() ?? null,
    }
  }

  return result
}

function extractFieldDependenciesSnapshot() {
  const wrappers = Array.from(
    document.querySelectorAll<HTMLElement>('.filament-forms-field-wrapper, .fi-fo-field'),
  )

  const dependencies: Record<
    string,
    {
      conditions: Array<{ type: string; expression: string }>
    }
  > = {}

  for (const wrapper of wrappers) {
    const field =
      wrapper.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input[name], select[name], textarea[name]',
      ) ??
      wrapper.querySelector<HTMLInputElement>('input[wire\\:model]')

    const key =
      field?.getAttribute('name') ??
      field?.getAttribute('wire:model') ??
      wrapper.getAttribute('data-field-name') ??
      wrapper.querySelector<HTMLElement>('label, .fi-fo-field-label')?.innerText.trim() ??
      `field-${wrappers.indexOf(wrapper)}`

    const conditionAttributes = wrapper
      .getAttributeNames()
      .filter((name) => name.startsWith('x-show') || name.startsWith('x-bind'))

    const datasetConditions =
      wrapper.getAttribute('data-conditional') ?? wrapper.getAttribute('data-condition')

    const conditions: Array<{ type: string; expression: string }> = []

    for (const attrName of conditionAttributes) {
      const value = wrapper.getAttribute(attrName)
      if (value) {
        conditions.push({ type: attrName, expression: value })
      }
    }

    if (datasetConditions) {
      conditions.push({ type: 'data-conditional', expression: datasetConditions })
    }

    if (conditions.length > 0) {
      dependencies[key] = { conditions }
    }
  }

  return dependencies
}

function extractComponentStatesSnapshot() {
  const wrappers = Array.from(
    document.querySelectorAll<HTMLElement>('.filament-forms-field-wrapper, .fi-fo-field'),
  )

  const states: Record<
    string,
    {
      statePath?: string | null
      disabled: boolean
      hidden: boolean
      alpineBindings: Record<string, string>
    }
  > = {}

  for (const wrapper of wrappers) {
    const field =
      wrapper.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input[name], select[name], textarea[name]',
      ) ??
      wrapper.querySelector<HTMLInputElement>('input[wire\\:model]')

    const key =
      field?.getAttribute('name') ??
      field?.getAttribute('wire:model') ??
      wrapper.getAttribute('data-field-name') ??
      wrapper.querySelector<HTMLElement>('label, .fi-fo-field-label')?.innerText.trim() ??
      `field-${wrappers.indexOf(wrapper)}`

    const alpineBindings: Record<string, string> = {}
    for (const attr of wrapper.getAttributeNames()) {
      if (attr.startsWith('x-bind:') || attr.startsWith(':')) {
        const expression = wrapper.getAttribute(attr)
        if (expression) {
          const keyName = attr.replace(/^x-bind:/, '').replace(/^:/, '')
          alpineBindings[keyName] = expression
        }
      }
    }

    states[key] = {
      statePath: wrapper.getAttribute('data-state-path'),
      disabled: wrapper.querySelector('[disabled]') !== null,
      hidden: wrapper.getAttribute('x-show') === 'false' || wrapper.getAttribute('hidden') !== null,
      alpineBindings,
    }
  }

  return states
}

function extractComponentMappingSnapshot() {
  const wrappers = Array.from(
    document.querySelectorAll<HTMLElement>('.filament-forms-field-wrapper, .fi-fo-field'),
  )

  const components: Array<{
    key: string
    label: string | null
    componentType: string
    classes: string[]
    shadcnEquivalent: { component: string; import: string } | null
  }> = []

  for (const wrapper of wrappers) {
    const interactive =
      wrapper.querySelector<HTMLElement>(
        'input, select, textarea, button[role="switch"], [data-field-type]',
      ) ?? undefined

    if (!interactive) continue

    const label =
      wrapper.querySelector<HTMLElement>('label, .fi-fo-field-label')?.innerText.trim() ?? null
    const classes = interactive.className ? interactive.className.split(/\s+/) : []

    const key =
      interactive.getAttribute('name') ??
      interactive.getAttribute('wire:model') ??
      wrapper.getAttribute('data-field-name') ??
      label ??
      `component-${wrappers.indexOf(wrapper)}`

    let componentType = 'unknown'
    if (classes.some((cls) => cls.includes('filament-forms-text-input'))) {
      componentType = 'TextInput'
    } else if (classes.some((cls) => cls.includes('filament-forms-select'))) {
      componentType = 'Select'
    } else if (classes.some((cls) => cls.includes('filament-forms-toggle'))) {
      componentType = 'Toggle'
    } else if (classes.some((cls) => cls.includes('filament-forms-textarea'))) {
      componentType = 'Textarea'
    } else if (classes.some((cls) => cls.includes('filament-forms-radio'))) {
      componentType = 'Radio'
    } else if (interactive.getAttribute('role') === 'switch') {
      componentType = 'Toggle'
    } else if (interactive.tagName === 'TEXTAREA') {
      componentType = 'Textarea'
    } else if (interactive.tagName === 'SELECT') {
      componentType = 'Select'
    } else if (interactive.tagName === 'INPUT') {
      const type = (interactive as HTMLInputElement).type
      componentType = type === 'checkbox' ? 'Checkbox' : type === 'radio' ? 'Radio' : 'TextInput'
    }

    let shadcnEquivalent: { component: string; import: string } | null = null
    switch (componentType) {
      case 'TextInput':
        shadcnEquivalent = { component: 'Input', import: '@/components/ui/input' }
        break
      case 'Select':
        shadcnEquivalent = { component: 'Select', import: '@/components/ui/select' }
        break
      case 'Toggle':
      case 'Checkbox':
        shadcnEquivalent = { component: 'Switch', import: '@/components/ui/switch' }
        break
      case 'Textarea':
        shadcnEquivalent = { component: 'Textarea', import: '@/components/ui/textarea' }
        break
      case 'Radio':
        shadcnEquivalent = { component: 'RadioGroup', import: '@/components/ui/radio-group' }
        break
      default:
        shadcnEquivalent = null
    }

    components.push({
      key,
      label,
      componentType,
      classes,
      shadcnEquivalent,
    })
  }

  return components
}

function requireScenario(name?: string, scenarios?: Record<string, Scenario>): Scenario {
  if (!name) {
    throw new Error('Scenario name is required. Pass via --scenario <name>.')
  }

  if (!scenarios || !scenarios[name]) {
    const available = scenarios ? Object.keys(scenarios).join(', ') : 'n/a'
    throw new Error(`Unknown scenario "${name}". Available: ${available}`)
  }

  return scenarios[name]
}

const scenarios: Record<string, Scenario> = {
  'prep:update-magic-link': async (session) => {
    // Обновить magic link перед началом сбора данных
    await session.updateMagicLink()
  },
  'prep:cleanup-temp': async (session) => {
    // Очистить временные сущности перед сбором
    await session.cleanupTemporaryEntities()
  },
  'prep:all': async (session) => {
    // Выполнить все подготовительные операции
    console.log('🔄 Выполняю подготовительные операции...')
    await session.updateMagicLink()
    await session.page.waitForTimeout(2000)
    await session.cleanupTemporaryEntities()
    console.log('✅ Подготовка завершена')
  },
  'snapshot:ai-agents': async (session) => {
    await session.gotoRelative('/ai-agents')
    await session.capturePageSnapshot('ai-agents', { captureTables: true })
  },
  'snapshot:test-chat': async (session) => {
    await session.gotoRelative('/test-chat')
    await session.capturePageSnapshot('test-chat', { captureTables: true })
  },
  'form:ai-agent-edit': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)
    await session.page.waitForTimeout(3000) // Даем время на загрузку формы
    await session.captureFormSnapshot('ai-agent-edit', { includeFields: true })
  },
  'form:ai-agent-edit-behavior': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)
    await session.captureFormBehavior('ai-agent-edit')
    await session.captureComponentMapping('ai-agent-edit.components.json')
  },
  'agents:toggle-manual-generation': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)

    // Ждем загрузки страницы
    // Убираем waitForLoadState - уже ждем в gotoRelative
    await session.page.waitForTimeout(3000) // Увеличиваем паузу для загрузки

    // Пробуем разные селекторы для toggle
    const toggleLocator = session.page
      .getByRole('switch', {
        name: /Генерировать ответ вручную|Проверять перед отправкой|Manual Generation|Manual review/i,
      })
      .first()
    
    // Увеличиваем таймаут и делаем более гибкий поиск
    let actualToggle = toggleLocator
    try {
      await toggleLocator.waitFor({ state: 'visible', timeout: 15000 })
    } catch {
      // Если не нашли через role, пробуем другие способы
      const altToggle = session.page
        .locator(
          'input[type="checkbox"][aria-label*="Manual"], input[type="checkbox"][aria-label*="Провер"], [role="switch"][aria-label*="Manual"], [role="switch"][aria-label*="Генер"], [role="switch"][aria-label*="Провер"]',
        )
        .first()
      if (await altToggle.isVisible({ timeout: 10000 }).catch(() => false)) {
        actualToggle = altToggle
      } else {
        // Пробуем найти любой switch на странице
        const anySwitch = session.page.locator('[role="switch"]').first()
        if (await anySwitch.isVisible({ timeout: 8000 }).catch(() => false)) {
          actualToggle = anySwitch
        } else {
          // Если toggle не найден - просто пропускаем этот шаг
          console.log('⚠️  Toggle для Manual Generation не найден, пропускаю...')
          return
        }
      }
    }

    const saveButton = session.page.getByRole('button', { name: /Сохранить|Save/i }).first()
    const hasSaveButton = await saveButton.isVisible({ timeout: 15000 }).catch(() => false)
    if (!hasSaveButton) {
      console.log('⚠️  Кнопка "Сохранить" не найдена, пропускаю сценарий...')
      return
    }

    const getState = async () => {
      const aria = await actualToggle.getAttribute('aria-checked')
      return aria === 'true'
    }

    const setState = async (value: boolean) => {
      const desired = value ? 'true' : 'false'
      if ((await actualToggle.getAttribute('aria-checked')) !== desired) {
        await actualToggle.scrollIntoViewIfNeeded().catch(() => undefined)
        await actualToggle.click({ force: true })
        await session.page.waitForTimeout(250)
      }
    }

    const waitForLivewire = async (
      label: string,
      capture: () => Promise<LivewirePayload>,
      retries: number = 2,
    ): Promise<LivewirePayload> => {
      const timeoutMs = 20_000 // Уменьшаем таймаут чтобы не зависать
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        let timeoutId: NodeJS.Timeout | undefined
        try {
          // Закрываем модалки перед каждой попыткой
          await session.closeModalsAndPopups()
          
          console.log(`   ⏳ Ожидаю Livewire ответ для ${label} (попытка ${attempt}/${retries})...`)
          
          const result = await Promise.race([
            capture(),
            new Promise<LivewirePayload>((_, reject) => {
              timeoutId = setTimeout(
                () => reject(new Error(`Timeout waiting Livewire payload for ${label}`)),
                timeoutMs,
              )
            }),
          ])
          if (timeoutId) clearTimeout(timeoutId)
          console.log(`   ✅ ${label} - получен ответ`)
          return result
        } catch (error) {
          if (timeoutId) clearTimeout(timeoutId)
          
          if (attempt < retries) {
            console.log(`   ⚠️  ${label}: Попытка ${attempt}/${retries} не удалась, повторяю через 2 сек...`)
            await session.closeModalsAndPopups()
            await session.page.waitForTimeout(2000)
            continue
          }
          
          // На последней попытке - сохраняем скриншот и продолжаем
          const debugDir = path.join(session.options.outputDir, 'debug')
          await ensureDir(debugDir)
          const debugPath = path.join(debugDir, `manual-generation-${label}-${Date.now()}.png`)
          await session.page.screenshot({ path: debugPath, fullPage: true }).catch(() => undefined)
          console.log(`⚠️  ${label}: Livewire не ответил после ${retries} попыток`)
          console.log(`   📸 Скриншот сохранен: ${debugPath}`)
          console.log(`   ⚠️  Продолжаю работу несмотря на ошибку...`)
          
          // Возвращаем пустой payload чтобы не ломать выполнение
          return {
            url: '',
            component: '',
            actionNames: [],
            requestBody: {},
            responseBody: { timeout: true, label },
            timestamp: Date.now(),
          } as unknown as LivewirePayload
        }
      }
      
      // Fallback - возвращаем пустой payload
      return {
        url: '',
        component: '',
        actionNames: [],
        requestBody: {},
        responseBody: { timeout: true, label, allRetriesExhausted: true },
        timestamp: Date.now(),
      } as unknown as LivewirePayload
    }

    const captureToggle = (value: boolean, label: string, saveAsSuffix: string) =>
      waitForLivewire(label, () =>
        session.captureLivewire(
          {
            label,
            predicate: manualGenerationPredicate(value),
            saveAs: {
              request: `agent_toggle_manual_generation.${saveAsSuffix}.request`,
              response: `agent_toggle_manual_generation.${saveAsSuffix}.response`,
              parsed: `agent_toggle_manual_generation.${saveAsSuffix}.parsed`,
            },
            parse: parseManualGenerationPayload,
          },
          async () => {
            await setState(value)
            await session.safeClick(saveButton)
          },
          { retries: 2, timeout: 25_000, skipOnTimeout: true },
        ),
      )

    const enable = async () => {
      try {
        console.log('   🔄 Включаю manual_generation...')
        await captureToggle(true, 'agent.toggle.manual_generation.enable', 'enable')
        console.log('   ✅ Manual generation включен')
      } catch (error) {
        console.log(`   ⚠️  Ошибка при включении: ${error}`)
        throw error
      }
    }
    
    const disable = async () => {
      try {
        console.log('   🔄 Выключаю manual_generation...')
        await captureToggle(false, 'agent.toggle.manual_generation.disable', 'disable')
        console.log('   ✅ Manual generation выключен')
      } catch (error) {
        console.log(`   ⚠️  Ошибка при выключении: ${error}`)
        throw error
      }
    }

    try {
      const currentState = await getState()
      console.log(`   📊 Текущее состояние manual_generation: ${currentState}`)
      
      if (currentState) {
        await disable()
        await session.page.waitForTimeout(1000)
        await enable()
      } else {
        await enable()
        await session.page.waitForTimeout(1000)
        await disable()
      }
      
      console.log('   ✅ Сценарий manual_generation выполнен успешно')
    } catch (error) {
      console.log(`   ❌ Ошибка в сценарии manual_generation: ${error}`)
      // Не бросаем ошибку дальше - продолжаем работу
      console.log('   ⚠️  Продолжаю несмотря на ошибку...')
    }
  },
  'agents:copy': async (session) => {
    await session.gotoRelative('/ai-agents')
    // Убираем waitForLoadState - уже ждем в gotoRelative
    // await session.page.waitForLoadState('domcontentloaded')
    await session.page.waitForTimeout(3000) // Увеличиваем паузу для загрузки таблицы

    // Ждем появления таблицы - пробуем разные селекторы
    const tableSelectors = [
      '.fi-ta-table tbody tr',
      '[data-table-record]',
      'table tbody tr',
      '[role="row"]',
      'tr[data-id]',
    ]
    let firstRow: Locator | null = null
    let tableFound = false
    
    for (const selector of tableSelectors) {
      const row = session.page.locator(selector).first()
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        firstRow = row
        tableFound = true
        break
      }
    }
    
    if (!firstRow) {
      // Если таблица не найдена, ждем еще и пробуем снова
      await session.page.waitForTimeout(2000)
      const fallbackSelector = '.fi-ta-table tbody tr, table tbody tr, [role="row"], [data-table-record]'
      firstRow = session.page.locator(fallbackSelector).first()
      tableFound = await firstRow.isVisible({ timeout: 5000 }).catch(() => false)
    }
    
    if (!tableFound) {
      const debugDir = path.join(session.options.outputDir, 'debug')
      await ensureDir(debugDir)
      const debugPath = path.join(debugDir, `agents-copy-table-missing-${Date.now()}.png`)
      await session.page.screenshot({ path: debugPath, fullPage: true }).catch(() => undefined)
      throw new Error(`Таблица агентов не найдена. Скриншот: ${debugPath}`)
    }

    // Найти кнопку "Копировать" в строке - пробуем разные варианты
    let copyButton = firstRow
      .getByRole('button', { name: /Копировать|Copy/i })
      .first()
    
    // Если не нашли через role, пробуем через текст
    if (!(await copyButton.isVisible({ timeout: 8000 }).catch(() => false))) {
      copyButton = firstRow.locator('a:has-text("Копировать"), a:has-text("Copy"), button:has-text("Копировать"), button:has-text("Copy")').first()
    }

    const hasCopyButton = await copyButton.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasCopyButton) {
      console.log('⚠️  Кнопка "Копировать" не найдена, пропускаю сценарий...')
      return
    }

    await session.captureLivewire(
      {
        label: 'agent.copy',
        predicate: (payload) => payload.actionNames.includes('copy') || payload.actionNames.includes('tableAction'),
        saveAs: {
          request: 'ai_agent_copy.request',
          response: 'ai_agent_copy.response',
          parsed: 'ai_agent_copy.parsed',
        },
      },
      async () => {
        await copyButton.click()
        await session.page.waitForTimeout(2000)
      },
    )
  },
  'agents:pagination': async (session) => {
    await session.gotoRelative('/ai-agents')
    try {
      await session.page.waitForLoadState('networkidle', { timeout: 30000 })
    } catch {
      console.log('⚠️  Страница не загрузилась полностью, продолжаю...')
    }

    // Найти пагинацию
    const nextPageButton = session.page
      .locator('button:has-text("Следующая"), button:has-text("Next")')
      .or(session.page.locator('a:has-text("Следующая"), a:has-text("Next")'))
      .first()

    const hasNextPage = await nextPageButton.isVisible().catch(() => false)

    if (hasNextPage) {
      await session.captureLivewire(
        {
          label: 'agents.pagination',
          predicate: (payload) => {
            // Пагинация обычно обновляет таблицу
            return payload.actionNames.includes('mount') || payload.url.includes('livewire')
          },
          saveAs: {
            request: 'ai_agents_pagination.request',
            response: 'ai_agents_pagination.response',
            parsed: 'ai_agents_pagination.parsed',
          },
        },
        async () => {
          await nextPageButton.click()
          await session.page.waitForTimeout(2000)
        },
      )
    } else {
      console.log('No pagination available (only one page)')
    }
  },
  'agents:knowledge-task-configure': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)
    
    // Ждем загрузки страницы
    await session.page.waitForTimeout(3000)

    // Включить "Создать задачу, если ответ не найден" - пробуем разные селекторы
    let taskToggle = session.page
      .getByRole('switch', {
        name: /Создать задачу|Create task|knowledge_not_found_task|Если ответ не найден/i,
      })
      .first()
    
    // Если не нашли через role, пробуем альтернативные способы
    try {
      await taskToggle.waitFor({ state: 'visible', timeout: 15000 })
    } catch {
      // Пробуем найти через другие селекторы
      const altToggle = session.page.locator('[role="switch"][aria-label*="задач"], [role="switch"][aria-label*="task"], input[type="checkbox"][aria-label*="задач"], input[type="checkbox"][aria-label*="ответ не найден"]').first()
      if (await altToggle.isVisible({ timeout: 10000 }).catch(() => false)) {
        taskToggle = altToggle
      } else {
        // Пробуем найти через текст на странице
        const textToggle = session.page.locator('text=/Создать задачу|Если ответ не найден/i').locator('..').locator('[role="switch"], input[type="checkbox"]').first()
        if (await textToggle.isVisible({ timeout: 8000 }).catch(() => false)) {
          taskToggle = textToggle
        } else {
          console.log('⚠️  Toggle для knowledge task не найден, пропускаю...')
          return
        }
      }
    }

    // Включить тоггл, если выключен
    const isEnabled = (await taskToggle.getAttribute('aria-checked')) === 'true'
    if (!isEnabled) {
      await taskToggle.click()
      await session.page.waitForTimeout(1000) // Увеличиваем паузу для появления полей
    }

    // Подождать появления поля конфигурации задачи (если есть)
    await session.page.waitForTimeout(2000)

    // Попробовать заполнить поле конфигурации задачи, если оно появилось
    const taskConfigFields = [
      'input[name*="task"]',
      'textarea[name*="task"]',
      'select[name*="task"]',
      'input[placeholder*="задач"]',
      'textarea[placeholder*="задач"]',
    ]
    
    for (const selector of taskConfigFields) {
      const field = session.page.locator(selector).first()
      if (await field.isVisible({ timeout: 2000 }).catch(() => false)) {
        const fieldType = await field.evaluate((el) => el.tagName.toLowerCase())
        if (fieldType === 'select') {
          // Выбрать первую доступную опцию
          const options = await field.locator('option').all()
          if (options.length > 1) {
            const value = await options[1].getAttribute('value')
            if (value) await field.selectOption(value)
          }
        } else {
          // Заполнить текстовое поле
          await field.fill('Создать задачу в CRM при отсутствии ответа в базе знаний')
        }
        await session.page.waitForTimeout(500)
        break
      }
    }

    // Сохранить форму с включенной задачей
    const saveButton = session.page.getByRole('button', { name: /Сохранить|Save/i }).first()
    
    const hasSaveButton = await saveButton.isVisible({ timeout: 15000 }).catch(() => false)
    if (!hasSaveButton) {
      console.log('⚠️  Кнопка "Сохранить" не найдена, пропускаю сценарий...')
      return
    }

    // Сохранить поведение формы перед сохранением
    await session.captureFormBehavior('ai-agent-edit-knowledge-task')

    await session.captureLivewire(
      {
        label: 'agent.knowledge_task.configure',
        predicate: (payload) => {
          // Проверяем наличие knowledge_not_found_task в данных
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          if (components) {
            for (const component of components) {
              const data = component.data as ParsedJSON | undefined
              const updates = component.updates as ParsedJSON | undefined
              const snapshot = component.snapshot as ParsedJSON | undefined
              const memo = snapshot?.data as ParsedJSON | undefined
              
              // Проверяем все возможные места, где может быть конфигурация задачи
              if (
                data?.knowledge_not_found_task === true ||
                updates?.knowledge_not_found_task === true ||
                data?.task !== undefined ||
                updates?.task !== undefined ||
                memo?.knowledge_not_found_task === true ||
                memo?.task !== undefined ||
                JSON.stringify(payload.requestBody).includes('knowledge_not_found_task') ||
                JSON.stringify(payload.requestBody).includes('task')
              ) {
                return true
              }
            }
          }
          return false
        },
        saveAs: {
          request: 'knowledge_not_found_task.configure.request',
          response: 'knowledge_not_found_task.configure.response',
          parsed: 'knowledge_not_found_task.configure.parsed',
        },
        parse: async (payload) => {
          // Расширенный парсинг конфигурации задачи
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          const component = components?.[0] as ParsedJSON | undefined
          
          const result: ParsedJSON = {
            url: payload.url,
            actionNames: payload.actionNames,
            knowledge_not_found_task: undefined,
            task: undefined,
            request: payload.requestBody,
            response: payload.responseBody,
          }
          
          if (component) {
            const data = component.data as ParsedJSON | undefined
            const updates = component.updates as ParsedJSON | undefined
            const snapshot = component.snapshot as ParsedJSON | undefined
            const memo = snapshot?.data as ParsedJSON | undefined
            
            result.knowledge_not_found_task = 
              data?.knowledge_not_found_task ?? 
              updates?.knowledge_not_found_task ?? 
              memo?.knowledge_not_found_task
            
            result.task = 
              data?.task ?? 
              updates?.task ?? 
              memo?.task
            
            // Извлекаем полную конфигурацию задачи
            if (typeof payload.responseBody === 'object') {
              const response = payload.responseBody as ParsedJSON
              const serverMemo = response.serverMemo as ParsedJSON | undefined
              const responseData = serverMemo?.data as ParsedJSON | undefined
              
              if (responseData) {
                result.responseData = {
                  knowledge_not_found_task: responseData.knowledge_not_found_task,
                  task: responseData.task,
                }
              }
            }
          }
          
          return result
        },
      },
      async () => {
        await saveButton.click()
        await session.page.waitForTimeout(3000) // Увеличиваем паузу для полного ответа
      },
    )
  },
  'agents:fallback-with-url': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)
    await session.page.waitForTimeout(3000)

    // Найти и включить fallback сообщение (если есть тоггл)
    const fallbackToggleSelectors = [
      '[role="switch"][aria-label*="fallback"]',
      '[role="switch"][aria-label*="сообщение"]',
      'input[type="checkbox"][aria-label*="fallback"]',
      'input[type="checkbox"][aria-label*="сообщение"]',
      'text=/fallback|сообщение при отсутствии/i >> .. >> [role="switch"], input[type="checkbox"]',
    ]
    
    let fallbackToggle: Locator | null = null
    for (const selector of fallbackToggleSelectors) {
      const toggle = session.page.locator(selector).first()
      if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        fallbackToggle = toggle
        break
      }
    }

    if (fallbackToggle) {
      const isEnabled = (await fallbackToggle.getAttribute('aria-checked') ?? 'false') === 'true'
      if (!isEnabled) {
        await fallbackToggle.click()
        await session.page.waitForTimeout(1000) // Даем время на появление полей
      }
    }

    // Найти поле для URL (если появляется)
    const urlFieldSelectors = [
      'input[name*="url"]',
      'input[name*="fallback_url"]',
      'input[placeholder*="URL"]',
      'input[placeholder*="ссылка"]',
      'input[placeholder*="https://"]',
    ]
    
    let urlField: Locator | null = null
    for (const selector of urlFieldSelectors) {
      const field = session.page.locator(selector).first()
      if (await field.isVisible({ timeout: 2000 }).catch(() => false)) {
        urlField = field
        break
      }
    }

    if (urlField) {
      await urlField.fill('https://example.com/help')
      await session.page.waitForTimeout(500)
    } else {
      console.log('⚠️  Поле URL не найдено, продолжаю без URL...')
    }

    // Найти поле fallback сообщения
    const fallbackFieldSelectors = [
      'textarea[name*="fallback"]',
      'textarea[name*="fallback_message"]',
      'textarea[placeholder*="сообщение"]',
      'textarea[placeholder*="fallback"]',
      'input[name*="fallback"]',
    ]
    
    let fallbackField: Locator | null = null
    for (const selector of fallbackFieldSelectors) {
      const field = session.page.locator(selector).first()
      if (await field.isVisible({ timeout: 3000 }).catch(() => false)) {
        fallbackField = field
        break
      }
    }

    if (fallbackField) {
      await fallbackField.fill('Это сообщение будет показано, когда агент не сможет найти релевантную информацию. Перейдите по ссылке для получения дополнительной помощи.')
      await session.page.waitForTimeout(500)
    } else {
      console.log('⚠️  Поле fallback сообщения не найдено, пропускаю заполнение...')
    }

    const saveButton = session.page.getByRole('button', { name: /Сохранить|Save/i }).first()
    
    const hasSaveButton = await saveButton.isVisible({ timeout: 15000 }).catch(() => false)
    if (!hasSaveButton) {
      console.log('⚠️  Кнопка "Сохранить" не найдена, пропускаю сценарий...')
      return
    }

    await session.captureLivewire(
      {
        label: 'agent.fallback_message.with_url',
        predicate: (payload) => {
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          const requestStr = JSON.stringify(payload.requestBody)
          
          // Проверяем наличие fallback сообщения или URL в payload
          if (
            requestStr.includes('fallback') ||
            requestStr.includes('fallback_message') ||
            requestStr.includes('fallback_url')
          ) {
            return true
          }
          
          if (components) {
            for (const component of components) {
              const updates = component.updates as ParsedJSON | undefined
              const data = component.data as ParsedJSON | undefined
              const snapshot = component.snapshot as ParsedJSON | undefined
              const memo = snapshot?.data as ParsedJSON | undefined
              
              if (
                updates?.knowledge_base_fallback_message ||
                data?.knowledge_base_fallback_message ||
                updates?.fallback_url ||
                data?.fallback_url ||
                memo?.knowledge_base_fallback_message ||
                memo?.fallback_url
              ) {
                return true
              }
            }
          }
          return false
        },
        saveAs: {
          request: 'fallback_message.with_url.request',
          response: 'fallback_message.with_url.response',
          parsed: 'fallback_message.with_url.parsed',
        },
        parse: async (payload) => {
          // Расширенный парсинг fallback сообщения с URL
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          const component = components?.[0] as ParsedJSON | undefined
          
          const result: ParsedJSON = {
            url: payload.url,
            actionNames: payload.actionNames,
            fallback_message: undefined,
            fallback_url: undefined,
            request: payload.requestBody,
            response: payload.responseBody,
          }
          
          if (component) {
            const data = component.data as ParsedJSON | undefined
            const updates = component.updates as ParsedJSON | undefined
            const snapshot = component.snapshot as ParsedJSON | undefined
            const memo = snapshot?.data as ParsedJSON | undefined
            
            result.fallback_message = 
              updates?.knowledge_base_fallback_message ?? 
              data?.knowledge_base_fallback_message ?? 
              memo?.knowledge_base_fallback_message
            
            result.fallback_url = 
              updates?.fallback_url ?? 
              data?.fallback_url ?? 
              memo?.fallback_url
            
            // Извлекаем из response
            if (typeof payload.responseBody === 'object') {
              const response = payload.responseBody as ParsedJSON
              const serverMemo = response.serverMemo as ParsedJSON | undefined
              const responseData = serverMemo?.data as ParsedJSON | undefined
              
              if (responseData) {
                result.responseData = {
                  fallback_message: responseData.knowledge_base_fallback_message,
                  fallback_url: responseData.fallback_url,
                }
              }
            }
          }
          
          return result
        },
      },
      async () => {
        await saveButton.click()
        await session.page.waitForTimeout(3000)
      },
    )
  },
  'knowledge:item-create-success': async (session) => {
    await session.gotoRelative('/knowledge-items/create')
    await session.page.waitForTimeout(3000)

    // Выбрать существующую категорию (ID 582 или первую доступную)
    const categorySelectSelectors = [
      'select[name*="category"]',
      'select[name*="category_id"]',
      '[name*="category"]',
      '[name*="category_id"]',
    ]
    
    let categorySelect: Locator | null = null
    for (const selector of categorySelectSelectors) {
      const select = session.page.locator(selector).first()
      if (await select.isVisible({ timeout: 3000 }).catch(() => false)) {
        categorySelect = select
        break
      }
    }

    if (categorySelect) {
      // Выбрать первую доступную категорию (не пустую)
      const options = await categorySelect.locator('option').all()
      for (const option of options.slice(1)) {
        // Пропускаем первую опцию (обычно "Выберите...")
        const value = await option.getAttribute('value')
        if (value && value !== '' && value !== '0') {
          await categorySelect.selectOption(value)
          await session.page.waitForTimeout(500)
          break
        }
      }
    } else {
      console.log('⚠️  Поле выбора категории не найдено, продолжаю без категории...')
    }

    // Заполнить обязательные поля - пробуем разные селекторы
    const titleSelectors = [
      'input[name*="title"]',
      'input[name*="name"]',
      'input[type="text"]',
      'input[placeholder*="название"], input[placeholder*="title"], input[placeholder*="name"]'
    ]
    
    let titleField = null
    for (const selector of titleSelectors) {
      const field = session.page.locator(selector).first()
      if (await field.isVisible({ timeout: 3000 }).catch(() => false)) {
        titleField = field
        break
      }
    }
    
    if (!titleField) {
      // Если не нашли, пробуем найти любое текстовое поле
      titleField = session.page.locator('input[type="text"]').first()
    }
    
    const hasTitleField = await titleField.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasTitleField) {
      console.log('⚠️  Поле названия не найдено, пропускаю сценарий...')
      return
    }
    await titleField.fill(`Test Article ${Date.now()}`)

    const contentField = session.page.locator('textarea[name*="content"], textarea[name*="body"]').first()
    const hasContentField = await contentField.isVisible().catch(() => false)
    if (hasContentField) {
      await contentField.fill('Test article content for successful creation')
    }

    const createButton = session.page.getByRole('button', { name: /Создать|Create/i }).first()
    
    const hasCreateButton = await createButton.isVisible({ timeout: 15000 }).catch(() => false)
    if (!hasCreateButton) {
      console.log('⚠️  Кнопка "Создать" не найдена, пропускаю сценарий...')
      return
    }

    await session.captureLivewire(
      {
        label: 'knowledge.item.create.success',
        predicate: (payload) => {
          const actionNames = payload.actionNames
          const requestStr = JSON.stringify(payload.requestBody)
          
          // Проверяем, что это запрос на создание
          if (
            actionNames.includes('create') ||
            actionNames.includes('save') ||
            requestStr.includes('create') ||
            requestStr.includes('knowledge_item')
          ) {
            // Успешный ответ должен содержать record
            if (typeof payload.responseBody === 'object') {
              const response = payload.responseBody as ParsedJSON
              const serverMemo = response.serverMemo as ParsedJSON | undefined
              const data = serverMemo?.data as ParsedJSON | undefined
              
              // Проверяем наличие record в разных местах
              return (
                response.record !== undefined ||
                data?.record !== undefined ||
                response.id !== undefined ||
                data?.id !== undefined
              )
            }
          }
          return false
        },
        saveAs: {
          request: 'knowledge_item_create.success.request',
          response: 'knowledge_item_create.success.response',
          parsed: 'knowledge_item_create.success.parsed',
        },
        parse: async (payload) => {
          // Расширенный парсинг успешного создания статьи
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          const component = components?.[0] as ParsedJSON | undefined
          
          const result: ParsedJSON = {
            url: payload.url,
            actionNames: payload.actionNames,
            request: payload.requestBody,
            response: payload.responseBody,
            record: undefined,
            success: false,
          }
          
          // Извлекаем record из response
          if (typeof payload.responseBody === 'object') {
            const response = payload.responseBody as ParsedJSON
            const serverMemo = response.serverMemo as ParsedJSON | undefined
            const responseData = serverMemo?.data as ParsedJSON | undefined
            
            // Ищем record в разных местах
            const responseRecord = response as { record?: unknown; data?: { record?: unknown; id?: unknown }; id?: unknown }
            result.record = 
              responseRecord.record ?? 
              responseData?.record ?? 
              responseRecord.data?.record
            
            result.id = 
              responseRecord.id ?? 
              responseData?.id ?? 
              responseRecord.data?.id
            
            result.success = result.record !== undefined || result.id !== undefined
            
            // Извлекаем данные из request для полной картины
            if (component) {
              const data = component.data as ParsedJSON | undefined
              const updates = component.updates as ParsedJSON | undefined
              
              result.requestData = {
                title: data?.title ?? updates?.title,
                content: data?.content ?? updates?.content,
                category_id: data?.category_id ?? updates?.category_id,
              }
            }
          }
          
          return result
        },
      },
      async () => {
        await createButton.click()
        await session.page.waitForTimeout(5000) // Увеличиваем паузу для полного ответа
      },
    )
  },
  'knowledge\:item-delete': async (session) => {
    await session.gotoRelative('/knowledge-items')
    await session.page.waitForTimeout(2000)
    // Убираем waitForLoadState - уже ждем в gotoRelative
    await session.page.waitForTimeout(4000) // Увеличиваем паузу для загрузки таблицы

    // Найти первую строку таблицы - пробуем разные селекторы
    const tableSelectors = ['tbody tr', 'table tbody tr', '[role="row"]', 'tr[data-id]']
    let firstRow = null
    
    for (const selector of tableSelectors) {
      const row = session.page.locator(selector).first()
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        firstRow = row
        break
      }
    }
    
    if (!firstRow) {
      await session.page.waitForTimeout(2000)
      firstRow = session.page.locator('tbody tr, table tbody tr, [role="row"]').first()
    }
    
    const hasRow = await firstRow.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasRow) {
      console.log('⚠️  Таблица пуста, пропускаю удаление...')
      return
    }

    // Найти кнопку "Удалить" - пробуем разные варианты
    let deleteButton = firstRow
      .getByRole('button', { name: /Удалить|Delete/i })
      .first()
    
    // Если не нашли через role, пробуем через текст
    if (!(await deleteButton.isVisible({ timeout: 8000 }).catch(() => false))) {
      deleteButton = firstRow.locator('a:has-text("Удалить"), a:has-text("Delete"), button:has-text("Удалить"), button:has-text("Delete"), [aria-label*="Удалить"], [aria-label*="Delete"]').first()
    }

    const hasDeleteButton = await deleteButton.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasDeleteButton) {
      console.log('⚠️  Кнопка "Удалить" не найдена, пропускаю сценарий...')
      return
    }

    // Кликнуть удалить и подтвердить
    await session.captureLivewire(
      {
        label: 'knowledge.item.delete',
        predicate: (payload) =>
          payload.actionNames.includes('delete') ||
          payload.actionNames.includes('tableAction') ||
          payload.url.includes('delete'),
        saveAs: {
          request: 'knowledge_item_delete.request',
          response: 'knowledge_item_delete.response',
          parsed: 'knowledge_item_delete.parsed',
        },
      },
      async () => {
        await deleteButton.click()
        await session.page.waitForTimeout(1000)

        // Подтвердить удаление в модалке (если есть)
        const confirmButton = session.page
          .getByRole('button', { name: /Подтвердить|Confirm|Удалить|Delete/i })
          .first()
        const hasConfirm = await confirmButton.isVisible().catch(() => false)
        if (hasConfirm) {
          await confirmButton.click()
        }

        await session.page.waitForTimeout(2000)
      },
    )
  },
  'knowledge\:category-crud': async (session) => {
    // Создание категории
    await session.gotoRelative('/knowledge-categories/create')
    await session.page.waitForTimeout(2000)
    // Убираем waitForLoadState - уже ждем в gotoRelative
    // await session.page.waitForLoadState('domcontentloaded')

    const nameField = session.page.locator('input[name*="name"], input[name*="title"]').first()
    const hasNameField = await nameField.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasNameField) {
      console.log('⚠️  Поле имени категории не найдено, пропускаю создание...')
      return
    }
    await nameField.fill(`Test Category ${Date.now()}`)

    const createButton = session.page.getByRole('button', { name: /Создать|Create/i }).first()

    await session.captureLivewire(
      {
        label: 'knowledge.category.create.success',
        predicate: (payload) => {
          if (typeof payload.responseBody === 'object') {
            const response = payload.responseBody as ParsedJSON
            const data = response.data as ParsedJSON | undefined
            return response.record !== undefined || data?.record !== undefined
          }
          return false
        },
        saveAs: {
          request: 'knowledge_category_create.success.request',
          response: 'knowledge_category_create.success.response',
          parsed: 'knowledge_category_create.success.parsed',
        },
      },
      async () => {
        await createButton.click()
        await session.page.waitForTimeout(3000)
      },
    )

    // Удаление категории
    await session.gotoRelative('/knowledge-categories')
    await session.page.waitForTimeout(3000) // Даем время на загрузку таблицы
    // Убираем waitForLoadState - уже ждем в gotoRelative
    // await session.page.waitForLoadState('networkidle')

    const firstRow = session.page.locator('tbody tr').first()
    const hasRow = await firstRow.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasRow) {
      console.log('⚠️  Таблица категорий пуста, пропускаю удаление...')
      return
    }

    const deleteButton = firstRow
      .getByRole('button', { name: /Удалить|Delete/i })
      .or(firstRow.locator('a:has-text("Удалить"), a:has-text("Delete")'))
      .first()

    await deleteButton.waitFor({ state: 'visible' })

    await session.captureLivewire(
      {
        label: 'knowledge.category.delete',
        predicate: (payload) =>
          payload.actionNames.includes('delete') ||
          payload.actionNames.includes('tableAction') ||
          payload.url.includes('delete'),
        saveAs: {
          request: 'knowledge_category_delete.request',
          response: 'knowledge_category_delete.response',
          parsed: 'knowledge_category_delete.parsed',
        },
      },
      async () => {
        await deleteButton.click()
        await session.page.waitForTimeout(1000)

        const confirmButton = session.page
          .getByRole('button', { name: /Подтвердить|Confirm|Удалить|Delete/i })
          .first()
        const hasConfirm = await confirmButton.isVisible().catch(() => false)
        if (hasConfirm) {
          await confirmButton.click()
        }

        await session.page.waitForTimeout(2000)
      },
    )
  },
  'knowledge:bulk-delete': async (session) => {
    await session.gotoRelative('/knowledge-items')
    try {
      await session.page.waitForLoadState('networkidle', { timeout: 30000 })
    } catch {
      console.log('⚠️  Страница не загрузилась полностью, продолжаю...')
    }

    // Выбрать несколько строк через чекбоксы
    const checkboxes = session.page.locator('tbody tr input[type="checkbox"]')
    const count = await checkboxes.count()

    if (count >= 2) {
      // Выбрать первые 2 строки
      await checkboxes.nth(0).check()
      await checkboxes.nth(1).check()
      await session.page.waitForTimeout(500)

      // Найти bulk action "Удалить выбранные"
      const bulkDeleteButton = session.page
        .getByRole('button', { name: /Удалить выбранные|Delete selected/i })
        .first()

      const hasBulkAction = await bulkDeleteButton.isVisible().catch(() => false)

      if (hasBulkAction) {
        await session.captureLivewire(
          {
            label: 'knowledge.bulk.delete',
            predicate: (payload) =>
              payload.actionNames.includes('bulkDelete') ||
              payload.actionNames.includes('deleteMany') ||
              payload.url.includes('bulk'),
            saveAs: {
              request: 'knowledge_bulk_delete.request',
              response: 'knowledge_bulk_delete.response',
              parsed: 'knowledge_bulk_delete.parsed',
            },
          },
          async () => {
            await bulkDeleteButton.click()
            await session.page.waitForTimeout(1000)

            const confirmButton = session.page
              .getByRole('button', { name: /Подтвердить|Confirm/i })
              .first()
            const hasConfirm = await confirmButton.isVisible().catch(() => false)
            if (hasConfirm) {
              await confirmButton.click()
            }

            await session.page.waitForTimeout(2000)
          },
        )
      } else {
        console.log('Bulk delete action not found')
      }
    } else {
      console.log('Not enough items for bulk delete test')
    }
  },
  'knowledge:filters-search': async (session) => {
    await session.gotoRelative('/knowledge-items')
    await session.page.waitForLoadState('networkidle')

    // Применить фильтр по категории
    const filterButton = session.page.getByRole('button', { name: /Фильтр|Filter/i }).first()
    const hasFilter = await filterButton.isVisible().catch(() => false)

    if (hasFilter) {
      await filterButton.click()
      await session.page.waitForTimeout(500)

      // Выбрать категорию в фильтре
      const categoryFilter = session.page
        .locator('select[name*="category"], [name*="category_id"]')
        .first()
      const hasCategoryFilter = await categoryFilter.isVisible().catch(() => false)

      if (hasCategoryFilter) {
        const options = await categoryFilter.locator('option').all()
        if (options.length > 1) {
          const value = await options[1].getAttribute('value')
          if (value && value !== '' && value !== '0') {
            await session.captureLivewire(
              {
                label: 'knowledge.filters',
                predicate: (payload) => payload.actionNames.includes('filter') || payload.url.includes('filter'),
                saveAs: {
                  request: 'knowledge_filters.request',
                  response: 'knowledge_filters.response',
                  parsed: 'knowledge_filters.parsed',
                },
              },
              async () => {
                await categoryFilter.selectOption(value)
                await session.page.waitForTimeout(2000)
              },
            )
          }
        }
      }
    }

    // Протестировать поиск
    const searchInput = session.page.locator('input[placeholder*="Поиск"], input[placeholder*="Search"]').first()
    const hasSearch = await searchInput.isVisible().catch(() => false)

    if (hasSearch) {
      await session.captureLivewire(
        {
          label: 'knowledge.search',
          predicate: (payload) => payload.actionNames.includes('search') || payload.url.includes('search'),
          saveAs: {
            request: 'knowledge_search.request',
            response: 'knowledge_search.response',
            parsed: 'knowledge_search.parsed',
          },
        },
        async () => {
          await searchInput.fill('test')
          await session.page.waitForTimeout(2000)
        },
      )
    }
  },
  'test-chat:new': async (session) => {
    await session.gotoRelative('/test-chat')
    await session.page.waitForTimeout(3000)

    // Найти кнопку "Новый чат" - пробуем разные селекторы
    const newChatButtonSelectors = [
      'button:has-text("Новый чат")',
      'button:has-text("New Chat")',
      'button:has-text("Создать чат")',
      'button:has-text("Create Chat")',
      '[aria-label*="Новый чат"]',
      '[aria-label*="New Chat"]',
      'a:has-text("Новый чат")',
      'a:has-text("New Chat")',
    ]
    
    let newChatButton: Locator | null = null
    for (const selector of newChatButtonSelectors) {
      const button = session.page.locator(selector).first()
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        newChatButton = button
        break
      }
    }

    if (newChatButton) {
      await session.captureLivewire(
        {
          label: 'test_chat.new',
          predicate: (payload) => {
            const actionNames = payload.actionNames
            const requestStr = JSON.stringify(payload.requestBody)
            
            return (
              actionNames.includes('newChat') ||
              actionNames.includes('createChat') ||
              actionNames.includes('resetChat') ||
              requestStr.includes('newChat') ||
              requestStr.includes('createChat') ||
              payload.url.includes('new') ||
              payload.url.includes('create')
            )
          },
          saveAs: {
            request: 'test_chat_new.request',
            response: 'test_chat_new.response',
            parsed: 'test_chat_new.parsed',
          },
          parse: async (payload) => {
            // Парсинг создания нового чата
            const components = payload.requestBody.components as ParsedJSON[] | undefined
            const component = components?.[0] as ParsedJSON | undefined
            
            const result: ParsedJSON = {
              url: payload.url,
              actionNames: payload.actionNames,
              request: payload.requestBody,
              response: payload.responseBody,
            }
            
            // Извлекаем данные о новом чате из response
            if (typeof payload.responseBody === 'object') {
              const response = payload.responseBody as ParsedJSON
              const serverMemo = response.serverMemo as ParsedJSON | undefined
              const responseData = serverMemo?.data as ParsedJSON | undefined
              
              if (responseData) {
                result.chatId = responseData.chat_id ?? responseData.id
                result.messages = responseData.messages ?? []
                result.sessionId = responseData.session_id
              }
            }
            
            return result
          },
        },
        async () => {
          await newChatButton!.click()
          await session.page.waitForTimeout(3000) // Даем время на создание чата
        },
      )
    } else {
      console.log('⚠️  Кнопка "Новый чат" не найдена')
    }
  },
  'test-chat:complete-response': async (session) => {
    await session.gotoRelative('/test-chat')
    await session.page.waitForTimeout(3000)

    // Найти поле ввода сообщения
    const messageInputSelectors = [
      'textarea[placeholder*="сообщение"]',
      'textarea[placeholder*="message"]',
      'textarea[name*="message"]',
      'input[type="text"][placeholder*="сообщение"]',
    ]
    
    let messageInput: Locator | null = null
    for (const selector of messageInputSelectors) {
      const input = session.page.locator(selector).first()
      if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
        messageInput = input
        break
      }
    }
    
    if (!messageInput) {
      console.log('⚠️  Поле ввода сообщения не найдено, пропускаю сценарий...')
      return
    }

    // Найти кнопку отправки
    const sendButtonSelectors = [
      'button:has-text("Отправить")',
      'button:has-text("Send")',
      'button[type="submit"]',
      '[aria-label*="Отправить"]',
      '[aria-label*="Send"]',
    ]
    
    let sendButton: Locator | null = null
    for (const selector of sendButtonSelectors) {
      const button = session.page.locator(selector).first()
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        sendButton = button
        break
      }
    }
    
    if (!sendButton) {
      console.log('⚠️  Кнопка отправки не найдена, пропускаю сценарий...')
      return
    }

    // Начать перехват WebSocket сообщений
    const websocketPromise = session.captureWebSocketMessages(15000)

    await session.captureLivewire(
      {
        label: 'test_chat.response.complete',
        predicate: (payload) => {
          // Проверяем наличие полного ответа в messages
          const actionNames = payload.actionNames
          const requestStr = JSON.stringify(payload.requestBody)
          
          if (
            actionNames.includes('sendMessage') ||
            actionNames.includes('send') ||
            requestStr.includes('message') ||
            requestStr.includes('send')
          ) {
            // Проверяем response на наличие полного ответа
            if (typeof payload.responseBody === 'object') {
              const response = payload.responseBody as ParsedJSON
              const serverMemo = response.serverMemo as ParsedJSON | undefined
              const data = serverMemo?.data as ParsedJSON | undefined
              const messages = data?.messages as unknown[] | undefined
              
              // Проверяем, что есть сообщения и последнее - от ассистента
              if (Array.isArray(messages) && messages.length > 0) {
                const lastMessage = messages[messages.length - 1] as ParsedJSON | undefined
                return lastMessage?.role === 'assistant' || lastMessage?.type === 'assistant'
              }
            }
          }
          return false
        },
        saveAs: {
          request: 'test_chat_response_complete.request',
          response: 'test_chat_response_complete.response',
          parsed: 'test_chat_response_complete.parsed',
        },
        parse: async (payload) => {
          // Расширенный парсинг полного ответа
          const components = payload.requestBody.components as ParsedJSON[] | undefined
          const component = components?.[0] as ParsedJSON | undefined
          
          const result: ParsedJSON = {
            url: payload.url,
            actionNames: payload.actionNames,
            request: payload.requestBody,
            response: payload.responseBody,
            messages: [],
            assistantMessage: undefined,
          }
          
          // Извлекаем сообщения из response
          if (typeof payload.responseBody === 'object') {
            const response = payload.responseBody as ParsedJSON
            const serverMemo = response.serverMemo as ParsedJSON | undefined
            const responseData = serverMemo?.data as ParsedJSON | undefined
            
            if (responseData) {
              const messages = responseData.messages as unknown[] | undefined
              if (Array.isArray(messages)) {
                result.messages = messages
                
                // Находим последнее сообщение ассистента
                const assistantMessages = messages.filter(
                  (msg: unknown) => {
                    const m = msg as ParsedJSON
                    return m?.role === 'assistant' || m?.type === 'assistant'
                  }
                )
                
                if (assistantMessages.length > 0) {
                  result.assistantMessage = assistantMessages[assistantMessages.length - 1]
                }
              }
              
              result.chatId = responseData.chat_id ?? responseData.id
              result.sessionId = responseData.session_id
            }
          }
          
          return result
        },
      },
      async () => {
        await messageInput.fill('Hello, test message for complete response')
        await sendButton.click()

        // Дождаться полного ответа (может быть streaming)
        await session.page.waitForTimeout(15000) // Увеличиваем время для полной генерации

        // Сохранить полный список сообщений из DOM
        const domMessages = await session.page.evaluate(() => {
          const messageElements = Array.from(
            document.querySelectorAll('[data-message], .message, .chat-message, [role="article"]')
          )
          return messageElements.map((el) => ({
            text: el.textContent?.trim(),
            role: el.getAttribute('data-role') || 
                  el.getAttribute('data-type') || 
                  (el.classList.contains('assistant') || el.classList.contains('ai') ? 'assistant' : 'user'),
            timestamp: el.getAttribute('data-timestamp'),
          })).filter((m) => m.text)
        })

        await session.saveBehaviorSnapshot('test-chat.messages.complete.json', {
          domMessages,
          timestamp: Date.now(),
        })
      },
    )
    
    // Сохранить WebSocket сообщения, если они были
    try {
      const wsMessages = await websocketPromise
      if (wsMessages.length > 0) {
        await session.saveBehaviorSnapshot('test-chat.websocket.json', {
          messages: wsMessages,
          timestamp: Date.now(),
        })
        console.log(`✅ Захвачено ${wsMessages.length} WebSocket сообщений`)
      }
    } catch (error) {
      console.log('⚠️  WebSocket сообщения не были захвачены:', error)
    }
  },
  'global:notifications': async (session) => {
    await session.gotoRelative('/')
    await session.page.waitForTimeout(2000)

    // Найти индикатор уведомлений - пробуем разные селекторы
    const notificationButtonSelectors = [
      'button[aria-label*="уведомлен"]',
      'button[aria-label*="notification"]',
      'button:has-text("22")',
      '[data-testid*="notification"]',
      '[data-testid="notifications"]',
      'button[title*="уведомлен"]',
      'button[title*="notification"]',
      '.notification-bell',
      '.notifications-button',
    ]
    
    let notificationButton: Locator | null = null
    for (const selector of notificationButtonSelectors) {
      const button = session.page.locator(selector).first()
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        notificationButton = button
        break
      }
    }

    if (notificationButton) {
      // Сохранить DOM состояние до клика
      const beforeClickDOM = await session.page.evaluate(() => {
        const button = document.querySelector('[data-testid*="notification"], button[aria-label*="уведомлен"]')
        return {
          text: button?.textContent?.trim(),
          ariaLabel: button?.getAttribute('aria-label'),
          badge: button?.querySelector('.badge, .count, [data-count]')?.textContent?.trim(),
        }
      })
      
      await notificationButton.click()
      await session.page.waitForTimeout(1000)

      // Сделать скриншот модалки уведомлений
      const modalSelectors = [
        '[role="dialog"]',
        '.modal',
        '[data-modal]',
        '.dropdown-menu',
        '.notifications-dropdown',
        '[data-dropdown]',
      ]
      
      let modal: Locator | null = null
      for (const selector of modalSelectors) {
        const m = session.page.locator(selector).first()
        if (await m.isVisible({ timeout: 2000 }).catch(() => false)) {
          modal = m
          break
        }
      }

      if (modal) {
        // Сохранить полный DOM модалки
        const modalDOM = await session.page.evaluate(() => {
          const modalEl = document.querySelector('[role="dialog"], .modal, [data-modal]')
          if (!modalEl) return null
          
          return {
            html: modalEl.outerHTML.substring(0, 10000), // Ограничиваем размер
            text: modalEl.textContent?.trim().substring(0, 1000),
            notifications: Array.from(modalEl.querySelectorAll('.notification, [data-notification], li')).map((el) => ({
              text: el.textContent?.trim(),
              read: el.classList.contains('read') || el.getAttribute('data-read') === 'true',
              timestamp: el.getAttribute('data-timestamp'),
            })),
          }
        })
        
        await session.saveBehaviorSnapshot('notifications.modal.dom.json', {
          beforeClick: beforeClickDOM,
          modal: modalDOM,
          timestamp: Date.now(),
        })
        
        await session.capturePageSnapshot('modals/notifications', { captureTables: false })

        // Кликнуть "Отметить все прочитанными"
        const markAllReadButtonSelectors = [
          'button:has-text("Отметить все")',
          'button:has-text("Mark all read")',
          '[aria-label*="Отметить все"]',
          '[aria-label*="Mark all"]',
        ]
        
        let markAllReadButton: Locator | null = null
        for (const selector of markAllReadButtonSelectors) {
          const button = session.page.locator(selector).first()
          if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
            markAllReadButton = button
            break
          }
        }

        if (markAllReadButton) {
          await session.captureLivewire(
            {
              label: 'notifications.mark_all_read',
              predicate: (payload) => {
                const actionNames = payload.actionNames
                const requestStr = JSON.stringify(payload.requestBody)
                
                return (
                  actionNames.includes('markAllRead') ||
                  actionNames.includes('readAll') ||
                  actionNames.includes('markAsRead') ||
                  requestStr.includes('notifications') ||
                  requestStr.includes('read') ||
                  payload.url.includes('notifications')
                )
              },
              saveAs: {
                request: 'notifications_mark_all_read.request',
                response: 'notifications_mark_all_read.response',
                parsed: 'notifications_mark_all_read.parsed',
              },
              parse: async (payload) => {
                // Парсинг API уведомлений
                const result: ParsedJSON = {
                  url: payload.url,
                  actionNames: payload.actionNames,
                  request: payload.requestBody,
                  response: payload.responseBody,
                }
                
                // Извлекаем данные из response
                if (typeof payload.responseBody === 'object') {
                  const response = payload.responseBody as ParsedJSON
                  const serverMemo = response.serverMemo as ParsedJSON | undefined
                  const responseData = serverMemo?.data as ParsedJSON | undefined
                  
                  if (responseData) {
                    result.notifications = responseData.notifications
                    result.unreadCount = responseData.unread_count ?? responseData.unreadCount
                  }
                }
                
                return result
              },
            },
            async () => {
              await markAllReadButton!.click()
              await session.page.waitForTimeout(2000)
            },
          )
        }
      }
    } else {
      console.log('⚠️  Кнопка уведомлений не найдена')
    }
  },
  'global\:theme-toggle': async (session) => {
    await session.gotoRelative('/')
    await session.page.waitForTimeout(2000)
    // Убираем waitForLoadState - уже ждем в gotoRelative
    // await session.page.waitForLoadState('domcontentloaded')

    // Найти меню пользователя
    const userMenu = session.page.locator('[data-testid*="user-menu"], button:has-text("Admin")').first()
    const hasUserMenu = await userMenu.isVisible({ timeout: 20000 }).catch(() => false)
    if (!hasUserMenu) {
      console.log('⚠️  Меню пользователя не найдено, пропускаю сценарий...')
      return
    }
    await userMenu.click()
    await session.page.waitForTimeout(1000) // Увеличиваем паузу для открытия меню

    // Найти переключатели темы
    const themeButtons = {
      light: session.page.getByRole('button', { name: /Светлый|Light/i }).first(),
      dark: session.page.getByRole('button', { name: /Тёмный|Dark/i }).first(),
      system: session.page.getByRole('button', { name: /Системный|System/i }).first(),
    }

    for (const [theme, button] of Object.entries(themeButtons)) {
      const isVisible = await button.isVisible().catch(() => false)
      if (isVisible) {
        await session.captureLivewire(
          {
            label: `theme.toggle.${theme}`,
            predicate: (payload) =>
              payload.actionNames.includes('toggleTheme') ||
              payload.actionNames.includes('setTheme') ||
              payload.url.includes('theme'),
            saveAs: {
              request: `theme_toggle.${theme}.request`,
              response: `theme_toggle.${theme}.response`,
              parsed: `theme_toggle.${theme}.parsed`,
            },
          },
          async () => {
            await button.click()
            await session.page.waitForTimeout(2000)
          },
        )
        break // Используем первый доступный
      }
    }
  },
  'global:breadcrumbs': async (session) => {
    const agentId = process.env.KWID_AGENT_ID ?? '553'
    await session.gotoRelative(`/ai-agents/${agentId}/edit`)
    await session.page.waitForTimeout(2000)

    // Сохранить breadcrumbs перед навигацией
    const breadcrumbsBefore = await session.page.evaluate(() => {
      const breadcrumbEl = document.querySelector('.breadcrumbs, [data-breadcrumbs], nav[aria-label*="breadcrumb"]')
      if (!breadcrumbEl) return null
      
      return {
        html: breadcrumbEl.outerHTML,
        items: Array.from(breadcrumbEl.querySelectorAll('a, [role="link"]')).map((el) => ({
          text: el.textContent?.trim(),
          href: (el as HTMLElement).getAttribute('href'),
        })),
      }
    })
    
    await session.saveBehaviorSnapshot('breadcrumbs.initial.json', {
      breadcrumbs: breadcrumbsBefore,
      url: session.page.url(),
      timestamp: Date.now(),
    })

    // Переключаться между вкладками
    const tabs = ['Основные', 'Сделки и контакты', 'Триггеры', 'Цепочки', 'Интеграции', 'Дополнительно']

    for (const tabName of tabs) {
      const tabSelectors = [
        `[role="tab"][aria-label*="${tabName}"]`,
        `[role="tab"]:has-text("${tabName}")`,
        `button:has-text("${tabName}")`,
        `a:has-text("${tabName}")`,
        `[data-tab="${tabName}"]`,
      ]
      
      let tab: Locator | null = null
      for (const selector of tabSelectors) {
        const t = session.page.locator(selector).first()
        if (await t.isVisible({ timeout: 2000 }).catch(() => false)) {
          tab = t
          break
        }
      }

      if (tab) {
        // Сохранить URL до переключения
        const urlBefore = session.page.url()
        
        await session.captureLivewire(
          {
            label: `navigation.tab_switch.${tabName.toLowerCase()}`,
            predicate: (payload) => {
              const actionNames = payload.actionNames
              const requestStr = JSON.stringify(payload.requestBody)
              
              return (
                actionNames.includes('navigate') ||
                actionNames.includes('switchTab') ||
                actionNames.includes('mount') ||
                requestStr.includes('tab') ||
                requestStr.includes('navigate') ||
                payload.url.includes('tab')
              )
            },
            saveAs: {
              request: `navigation_tab_switch.${tabName.toLowerCase()}.request`,
              response: `navigation_tab_switch.${tabName.toLowerCase()}.response`,
              parsed: `navigation_tab_switch.${tabName.toLowerCase()}.parsed`,
            },
            parse: async (payload) => {
              // Парсинг навигации
              const result: ParsedJSON = {
                url: payload.url,
                actionNames: payload.actionNames,
                request: payload.requestBody,
                response: payload.responseBody,
                urlBefore,
                urlAfter: session.page.url(),
              }
              
              // Извлекаем данные о навигации из response
              if (typeof payload.responseBody === 'object') {
                const response = payload.responseBody as ParsedJSON
                const serverMemo = response.serverMemo as ParsedJSON | undefined
                const responseData = serverMemo?.data as ParsedJSON | undefined
                
                if (responseData) {
                  result.activeTab = responseData.active_tab ?? responseData.activeTab
                }
              }
              
              // Сохранить breadcrumbs после навигации
              const breadcrumbsAfter = await session.page.evaluate(() => {
                const breadcrumbEl = document.querySelector('.breadcrumbs, [data-breadcrumbs], nav[aria-label*="breadcrumb"]')
                if (!breadcrumbEl) return null
                
                return {
                  html: breadcrumbEl.outerHTML,
                  items: Array.from(breadcrumbEl.querySelectorAll('a, [role="link"]')).map((el) => ({
                    text: el.textContent?.trim(),
                    href: (el as HTMLElement).getAttribute('href'),
                  })),
                }
              })
              
              result.breadcrumbsAfter = breadcrumbsAfter
              
              return result
            },
          },
          async () => {
            await tab!.click()
            await session.page.waitForTimeout(2000) // Даем время на обновление breadcrumbs
          },
        )
        break // Используем первую доступную вкладку
      }
    }
  },
  'global\:search': async (session) => {
    await session.gotoRelative('/')
    await session.page.waitForTimeout(2000) // Даем время на загрузку
    // Убираем waitForLoadState - уже ждем в gotoRelative
    // await session.page.waitForLoadState('domcontentloaded')

    // Найти глобальный поиск
    const searchInput = session.page
      .locator('input[placeholder*="Глобальный поиск"], input[placeholder*="Global search"]')
      .first()

    const hasSearch = await searchInput.isVisible({ timeout: 10000 }).catch(() => false)

    if (hasSearch) {
      await searchInput.fill('test')
      await session.page.waitForTimeout(2000)

      // Сохранить результаты поиска
      const results = await session.page.evaluate(() => {
        const resultElements = Array.from(
          document.querySelectorAll('[data-search-result], .search-result, .autocomplete-item'),
        )
        return resultElements.map((el) => ({
          text: el.textContent?.trim(),
          href: (el as HTMLElement).getAttribute('href'),
        }))
      })

      await session.saveBehaviorSnapshot('global-search.json', {
        query: 'test',
        results,
        timestamp: Date.now(),
      })

      // Перехватить запрос поиска (если есть)
      await session.captureLivewire(
        {
          label: 'global.search',
          predicate: (payload) => payload.url.includes('search') || payload.actionNames.includes('search'),
          saveAs: {
            request: 'global_search.request',
            response: 'global_search.response',
            parsed: 'global_search.parsed',
          },
        },
        async () => {
          // Поиск уже выполнен выше
          await session.page.waitForTimeout(1000)
        },
      )
    } else {
      console.log('Global search not found')
    }
  },
  'kommo:widget-settings': async (session) => {
    // Открыть Kommo и перейти к настройкам виджета
    const kommoUrl = process.env.KOMMO_ENTRY_URL ?? 'https://worldwideservices.kommo.com'
    const widgetUrl = `${kommoUrl}/settings/widgets/aia_chatgpt_leadsbot/`
    
    console.log(`🌐 Открываю настройки виджета: ${widgetUrl}`)
    
    // Настроить перехват сетевых запросов ДО загрузки страницы
    const requests: Array<{ url: string; method: string; headers?: Record<string, string>; data?: unknown; timestamp: number }> = []
    const responses: Array<{ url: string; status: number; headers?: Record<string, string>; data?: unknown; timestamp: number }> = []
    
    const requestHandler = async (request: { url: () => string; method: () => string; headers: () => Record<string, string>; postData: () => string | null }) => {
      const url = request.url()
      if (url.includes('widget') || url.includes('settings') || url.includes('api') || url.includes('aia_chatgpt')) {
        const postData = request.postData()
        const headers = request.headers()
        
        const requestData: { url: string; method: string; headers?: Record<string, string>; data?: unknown; timestamp: number } = {
          url,
          method: request.method(),
          headers,
          timestamp: Date.now(),
        }
        
        if (postData) {
          try {
            requestData.data = JSON.parse(postData)
          } catch {
            requestData.data = postData
          }
        }
        
        requests.push(requestData)
        
        // Сохраняем после каждого запроса
        await saveJson(
          path.join(session.options.outputDir, 'kommo-widget-requests.json'),
          requests
        )
      }
    }
    
    const responseHandler = async (response: { url: () => string; status: () => number; headers: () => Record<string, string>; json: () => Promise<unknown>; text: () => Promise<string> }) => {
      const url = response.url()
      if (url.includes('widget') || url.includes('settings') || url.includes('api') || url.includes('aia_chatgpt')) {
        const status = response.status()
        const headers = response.headers()
        
        const responseData: { url: string; status: number; headers?: Record<string, string>; data?: unknown; timestamp: number } = {
          url,
          status,
          headers,
          timestamp: Date.now(),
        }
        
        try {
          responseData.data = await response.json()
        } catch {
          try {
            responseData.data = await response.text()
          } catch {
            responseData.data = null
          }
        }
        
        responses.push(responseData)
        
        // Сохраняем после каждого ответа
        await saveJson(
          path.join(session.options.outputDir, 'kommo-widget-responses.json'),
          responses
        )
      }
    }
    
    session.page.on('request', requestHandler)
    session.page.on('response', responseHandler)
    
    await session.page.goto(widgetUrl, {
      waitUntil: 'networkidle',
      timeout: 60000,
    })
    
    await session.page.waitForTimeout(5000) // Даем время на полную загрузку
    
    // Сделать скриншот всей страницы
    await session.capturePageSnapshot('kommo-widget-settings', { captureTables: true })
    
    // Сохранить полный HTML структуру
    const html = await session.page.content()
    await saveText(
      path.join(session.options.outputDir, 'kommo-widget-settings.html'),
      html
    )
    
    // Извлечь полный DOM настроек с детальной информацией
    const widgetData = await session.page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'))
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
      const sections = Array.from(document.querySelectorAll('section, .section, [data-section], .widget-section, .tab-content, [role="tabpanel"]'))
      
      return {
        url: window.location.href,
        title: document.title,
        forms: forms.map(form => ({
          action: form.action,
          method: form.method,
          id: form.id,
          className: form.className,
          fields: Array.from(form.querySelectorAll('input, select, textarea')).map(field => {
            const fieldEl = field as HTMLElement
            return {
              name: fieldEl.getAttribute('name'),
              type: fieldEl.getAttribute('type') || field.tagName.toLowerCase(),
              value: (field as HTMLInputElement).value,
              label: (field.closest('label')?.textContent?.trim()) || 
                     (field.previousElementSibling?.textContent?.trim()) || 
                     (field.closest('.form-group, .field')?.querySelector('label')?.textContent?.trim()) || null,
              id: fieldEl.id,
              placeholder: fieldEl.getAttribute('placeholder'),
              required: fieldEl.hasAttribute('required'),
              disabled: fieldEl.hasAttribute('disabled'),
              checked: (field as HTMLInputElement).checked,
            }
          }),
        })),
        allInputs: inputs.map(input => {
          const inputEl = input as HTMLElement
          return {
            name: inputEl.getAttribute('name'),
            type: inputEl.getAttribute('type') || input.tagName.toLowerCase(),
            value: (input as HTMLInputElement).value,
            id: inputEl.id,
            placeholder: inputEl.getAttribute('placeholder'),
            required: inputEl.hasAttribute('required'),
            disabled: inputEl.hasAttribute('disabled'),
            className: inputEl.className,
          }
        }),
        sections: sections.map(section => ({
          title: section.querySelector('h1, h2, h3, .title, .section-title')?.textContent?.trim() || null,
          content: section.textContent?.trim().substring(0, 1000),
          className: section.className,
          id: section.id,
          html: section.outerHTML.substring(0, 5000), // Ограничиваем размер
        })),
        buttons: Array.from(document.querySelectorAll('button, a.button, input[type="submit"]')).map(btn => {
          const btnEl = btn as HTMLElement
          return {
            text: btnEl.textContent?.trim(),
            type: btnEl.getAttribute('type'),
            onclick: btnEl.getAttribute('onclick'),
            id: btnEl.id,
            className: btnEl.className,
            disabled: btnEl.hasAttribute('disabled'),
            dataAttributes: Array.from(btnEl.attributes)
              .filter(attr => attr.name.startsWith('data-'))
              .reduce((acc, attr) => {
                acc[attr.name] = attr.value
                return acc
              }, {} as Record<string, string>),
          }
        }),
        // Экспорт JSON конфигурации (если доступен через window или data-атрибуты)
        config: (() => {
          try {
            // Пробуем найти конфигурацию в window объекте
            const win = window as unknown as { widgetConfig?: unknown; config?: unknown }
            return win.widgetConfig || win.config || null
          } catch {
            return null
          }
        })(),
      }
    })
    
    await saveJson(
      path.join(session.options.outputDir, 'kommo-widget-settings.json'),
      widgetData
    )
    
    console.log('✅ Полный DOM и JSON конфигурация сохранены. Ищу кнопки...')
    
    // Попробовать найти и кликнуть кнопки сохранения/проверки
    const saveButtonSelectors = [
      'button:has-text("Сохранить")',
      'button:has-text("Save")',
      'button[type="submit"]',
      'input[type="submit"]',
      '[data-action="save"]',
      '[data-testid="save-button"]',
    ]
    
    const checkButtonSelectors = [
      'button:has-text("Проверить")',
      'button:has-text("Check")',
      'button:has-text("Проверить подключение")',
      'button:has-text("Test connection")',
      '[data-action="check"]',
      '[data-testid="check-button"]',
    ]
    
    let saveButton: Locator | null = null
    let checkButton: Locator | null = null
    
    for (const selector of checkButtonSelectors) {
      const button = session.page.locator(selector).first()
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        checkButton = button
        break
      }
    }
    
    for (const selector of saveButtonSelectors) {
      const button = session.page.locator(selector).first()
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        saveButton = button
        break
      }
    }
    
    if (checkButton) {
      console.log('🔍 Найдена кнопка "Проверить подключение". Кликаю...')
      await checkButton.click()
      await session.page.waitForTimeout(5000) // Увеличиваем время для полного ответа
    }
    
    if (saveButton) {
      console.log('💾 Найдена кнопка "Сохранить". Кликаю...')
      await saveButton.click()
      await session.page.waitForTimeout(5000) // Увеличиваем время для полного ответа
    } else {
      console.log('⏳ Кнопка "Сохранить" не найдена автоматически. Ожидаю 30 секунд для ручного сохранения...')
      await session.page.waitForTimeout(30000)
    }
    
    // Удаляем обработчики после завершения
    session.page.off('request', requestHandler)
    session.page.off('response', responseHandler)
    
    console.log(`✅ Сбор данных по Kommo Widget завершен! Захвачено ${requests.length} запросов и ${responses.length} ответов.`)
  },
}

async function main() {
  const argv = parseArgs()
  const scenario = argv.scenario ? requireScenario(argv.scenario, scenarios) : undefined

  const session = await ScrapeSession.create(argv)

  try {
    if (scenario) {
      console.log('')
      console.log('✅ Страница KWID готова! Запускаю сценарий...')
      console.log('')
      
      await scenario(session)
    } else {
      console.log('No scenario provided. Session authenticated and ready.')
    }
  } finally {
    await session.dispose()
  }
}

if (isMainModule()) {
  main().catch((error) => {
    console.error('[kwid-scrape] fatal error', error)
    process.exitCode = 1
  })
}

function isMainModule() {
  const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined
  if (!entryPath) return true
  return fileURLToPath(import.meta.url) === entryPath
}
