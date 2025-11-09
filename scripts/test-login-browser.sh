#!/bin/bash

# Скрипт для тестирования входа через браузер
set -e

echo "🧪 Тестирование входа через браузер..."

# Запускаем Playwright в headed режиме для тестирования
npx playwright test --headed --project=chromium -g "login" 2>&1 || {
  echo "⚠️ Playwright тесты не найдены, создаю временный тест..."
  
  # Создаем временный тест файл
  cat > /tmp/test-login-temp.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('Login test', async ({ page }) => {
  await page.goto('https://gpt-agent-kwid.vercel.app/login');
  await page.waitForLoadState('networkidle');
  
  // Вводим email
  await page.fill('input[type="email"]', 'admin@worldwideservice.eu');
  
  // Вводим пароль
  await page.fill('input[type="password"]', 'l1tmw6u977c9!Q');
  
  // Нажимаем кнопку входа
  await page.click('button[type="submit"]');
  
  // Ждем редиректа или ошибки
  await page.waitForTimeout(10000);
  
  // Проверяем URL
  const url = page.url();
  console.log('Current URL:', url);
  
  // Делаем скриншот
  await page.screenshot({ path: '/tmp/login-test-result.png', fullPage: true });
  
  // Проверяем что мы не на странице логина (успешный вход)
  expect(url).not.toContain('/login');
});
EOF

  npx playwright test /tmp/test-login-temp.spec.ts --headed
}


