import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright конфигурация для E2E тестирования
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
 // Папка с тестами
 testDir: './tests',
 
 // Исключаем unit тесты и integration тесты (они используют vitest, не Playwright)
 testIgnore: [
   '**/unit/**',
   '**/integration/**',
   '**/*.test.ts', // Исключаем файлы с расширением .test.ts (vitest тесты)
 ],
 
 // Папка для скриншотов и артефактов
 outputDir: './test-results',
 
 // Максимальное время выполнения одного теста (оптимизировано)
 timeout: 60 * 1000,

 // Настройки expect()
 expect: {
 // Максимальное время ожидания для проверок (оптимизировано)
 timeout: 5000,
 },

 // Настройки запуска тестов
 fullyParallel: true,
 forbidOnly: !!process.env.CI,
 retries: process.env.CI ? 2 : 0,
 workers: process.env.CI ? 1 : 4, // Увеличено количество воркеров
 
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
 
 // Скриншот только при падении для скорости
 screenshot: 'only-on-failure',

 // Видео отключено для скорости
 video: 'off',
 
 // Трейс для отладки
 trace: 'on-first-retry',
 
 // Viewport
 viewport: { width: 1280, height: 720 },
 
 // Locale
 locale: 'ru-RU',
 
 // Timezone
 timezoneId: 'Europe/Moscow',
 },

 // Проекты - только Chromium для быстрого тестирования
 projects: [
 {
 name: 'chromium',
 use: {
 ...devices['Desktop Chrome'],
 contextOptions: {
 strictSelectors: true,
 },
 },
 },
 ],

 // Веб-сервер для автоматического управления тестами
 webServer: {
 command: 'npm run dev',
 url: 'http://localhost:3000',
 reuseExistingServer: process.env.REUSE_SERVER !== 'false', // Используем существующий сервер, если он запущен
 timeout: 300 * 1000,
 env: {
 ...process.env,
 E2E_ONBOARDING_FAKE: '1',
 NODE_ENV: 'development',
 DEMO_MODE: 'true',
 NEXT_PUBLIC_SUPABASE_URL: 'https://demo.supabase.co',
 NEXT_PUBLIC_SUPABASE_ANON_KEY: 'demo-anon-key',
 SUPABASE_URL: 'https://demo.supabase.co',
 SUPABASE_ANON_KEY: 'demo-anon-key',
 SUPABASE_SERVICE_ROLE_KEY: 'demo-service-role-key',
 SUPABASE_DEFAULT_ORGANIZATION_ID: '550e8400-e29b-41d4-a716-446655440000',
 NEXTAUTH_SECRET: 'demo-nextauth-secret',
 NEXTAUTH_URL: 'http://localhost:3000',
 BACKEND_API_URL: 'http://localhost:4000',
 OPENROUTER_API_KEY: 'demo-openrouter-key',
 REDIS_URL: 'redis://localhost:6379',
 NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
 },
 },
})
