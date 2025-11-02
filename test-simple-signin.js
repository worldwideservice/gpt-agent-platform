const { chromium } = require('playwright');

async function testSimpleSignIn() {
  console.log('🔧 Простой тест signIn...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('🔐')) {
      console.log('🌐', msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:3000/login', { timeout: 10000 });
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('valid-test@example.com');
    await passwordInput.fill('Test123456!');
    
    console.log('📝 Форма заполнена, нажимаем вход...');
    await submitButton.click();
    
    // Ждем только 2 секунды
    await page.waitForTimeout(2000);
    
    console.log('✅ Тест завершен');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
  }
}

testSimpleSignIn();
