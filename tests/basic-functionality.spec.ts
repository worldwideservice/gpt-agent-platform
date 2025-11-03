import { test, expect } from '@playwright/test'

test.describe('Basic Functionality', () => {
 test('should load main pages correctly', async ({ page }) => {
 // Test home page
 await page.goto('/')
 await expect(page).toHaveTitle('GPT Agent - Trainable virtual employee')
 await expect(page.getByRole('heading', { name: 'Обучаемый виртуальный сотрудник' })).toBeVisible()
 await expect(page.getByRole('link', { name: 'Начать бесплатно' })).toBeVisible()

 // Test login page accessibility
 await page.goto('/login')
 await expect(page).toHaveTitle('Вход в GPT Agent')
 await expect(page.getByRole('heading', { name: 'Вход в GPT Agent' })).toBeVisible()
 await expect(page.getByLabel('Email')).toBeVisible()
 await expect(page.getByLabel('Пароль')).toBeVisible()

 // Test register page accessibility
 await page.goto('/register')
 await expect(page).toHaveTitle('Регистрация в GPT Agent')
 await expect(page.getByRole('heading', { name: 'Регистрация в GPT Agent' })).toBeVisible()
 await expect(page.getByLabel('Имя')).toBeVisible()
 await expect(page.getByLabel('Фамилия')).toBeVisible()
 await expect(page.getByLabel('Email')).toBeVisible()
 await expect(page.getByLabel('Пароль')).toBeVisible()

 // Test API docs page
 await page.goto('/api-docs')
 await expect(page).toHaveTitle('GPT Agent - Trainable virtual employee')
 // API docs loads Swagger UI
 await page.waitForSelector('.swagger-ui', { timeout: 10000 })
 })

 test('should validate registration form', async ({ page }) => {
 await page.goto('/register')

 // Test password mismatch validation
 await page.getByLabel('Имя').fill('Test')
 await page.getByLabel('Фамилия').fill('User')
 await page.getByLabel('Email').fill('test@example.com')
 await page.getByLabel('Пароль').fill('password123')
 await page.getByLabel('Подтверждение пароля').fill('differentpassword')

 await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

 // Should stay on registration page
 await expect(page).toHaveTitle('Регистрация в GPT Agent')
 })

 test('should redirect protected pages to login', async ({ page }) => {
 // Test account page redirects to login
 await page.goto('/account')
 await page.waitForURL('**/login**')
 await expect(page).toHaveTitle('Вход в GPT Agent')

 // Test agents page redirects to login
 await page.goto('/agents')
 await page.waitForURL('**/login**')
 await expect(page).toHaveTitle('Вход в GPT Agent')
 })

 test('should handle login with invalid credentials', async ({ page }) => {
 await page.goto('/login')

 await page.getByLabel('Email').fill('nonexistent@example.com')
 await page.getByLabel('Пароль').fill('wrongpassword')

 await page.getByRole('button', { name: 'Войти' }).click()

 // Should stay on login page
 await expect(page).toHaveTitle('Вход в GPT Agent')
 })

 test('should navigate between pages', async ({ page }) => {
 await page.goto('/')

 // Click on login link
 await page.getByRole('link', { name: 'Войти' }).click()
 await expect(page).toHaveTitle('Вход в GPT Agent')

 // Go back to home
 await page.goto('/')
 await expect(page).toHaveTitle('GPT Agent - Trainable virtual employee')

 // Click on register link
 await page.getByRole('link', { name: 'Начать' }).first().click()
 await page.waitForURL('**/login**')
 await expect(page).toHaveTitle('Вход в GPT Agent')
 })
})
