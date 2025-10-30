import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright конфигурация для E2E тестирования
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Папка с тестами
  testDir: './tests',
  
  // Папка для скриншотов и артефактов
  outputDir: './test-results',
  
  // Максимальное время выполнения одного теста
  timeout: 120 * 1000,
  
  // Настройки expect()
  expect: {
    // Максимальное время ожидания для проверок
    timeout: 5000,
  },
  
  // Настройки запуска тестов
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Репортеры
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  // Настройки для всех тестов
  use: {
    // Base URL для тестов
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Скриншот всегда для полного сканирования
    screenshot: 'on',
    
    // Видео при падении теста
    video: 'retain-on-failure',
    
    // Трейс для отладки
    trace: 'on-first-retry',
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Locale
    locale: 'ru-RU',
    
    // Timezone
    timezoneId: 'Europe/Moscow',
  },

  // Проекты для разных браузеров
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Accessibility тесты в Chromium
        contextOptions: {
          // Включаем accessibility tree
          strictSelectors: true,
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Мобильные устройства
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Планшеты
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Веб-сервер для тестов
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      E2E_ONBOARDING_FAKE: '1',
    },
  },
})

