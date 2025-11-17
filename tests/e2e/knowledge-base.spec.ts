/**
 * Knowledge Base E2E Tests
 * Tests for document upload, search, and management
 */

import { test, expect } from './fixtures/auth.fixture'
import { generateRandomDocument } from './fixtures/test-data'
import path from 'path'

test.describe('Knowledge Base', () => {
  test('should display knowledge base page', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Check page title
    await expect(
      page.locator('h1, h2').filter({ hasText: /База знаний|Knowledge Base|Документы|Documents/i }).first()
    ).toBeVisible()
  })

  test('should show upload document button', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Find upload button
    const uploadButton = page.locator('button, a').filter({
      hasText: /Загрузить|Upload|Добавить|Add/i,
    })

    await expect(uploadButton.first()).toBeVisible({ timeout: 5000 })
  })

  test('should open document upload modal', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Click upload button
    await page.click('button:has-text("Загрузить"), button:has-text("Upload")')

    // Wait for upload modal/form
    await expect(
      page.locator('input[type="file"], input[name="file"], [data-testid="file-upload"]')
    ).toBeVisible({ timeout: 5000 })
  })

  test('should upload document file', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Click upload
    await page.click('button:has-text("Загрузить"), button:has-text("Upload")')

    // Create test file
    const testFilePath = path.join(__dirname, 'fixtures', 'test-document.txt')

    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-document.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test document for E2E testing.'),
    })

    // Fill additional fields if present
    const titleInput = page.locator('input[name="title"]')
    if (await titleInput.isVisible({ timeout: 1000 })) {
      await titleInput.fill(generateRandomDocument().title)
    }

    // Submit upload
    await page.click('button[type="submit"], button:has-text("Загрузить"), button:has-text("Upload")')

    // Wait for success
    await expect(page.locator('text=/Успешно|Success|загружен|uploaded/i')).toBeVisible({
      timeout: 15000,
    })
  })

  test('should search documents', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"], input[placeholder*="Search"]')

    if (await searchInput.isVisible({ timeout: 3000 })) {
      // Enter search query
      await searchInput.fill('test')

      // Wait for search results or no results message
      await expect(
        page
          .locator('[data-testid="search-results"], .search-results, text=/Результат|Result|Найден|Found/')
          .or(page.locator('text=/Не найдено|No results|Ничего/i'))
      ).toBeVisible({ timeout: 5000 })
    }
  })

  test('should filter documents by category', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Find category filter
    const categoryFilter = page.locator('select[name="category"], [data-testid="category-filter"]')

    if (await categoryFilter.isVisible({ timeout: 3000 })) {
      // Select a category
      await categoryFilter.selectOption({ index: 1 })

      // Wait for filtered results
      await page.waitForTimeout(1000)

      // Check that URL or results updated
      expect(page.url()).toMatch(/category=|filter=/)
    }
  })

  test('should view document details', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Find first document
    const documentLink = page.locator('a[href*="/documents/"], button').filter({
      hasText: /Просмотр|View|Открыть/,
    }).first()

    if (await documentLink.isVisible({ timeout: 3000 })) {
      await documentLink.click()

      // Should show document details
      await expect(page.locator('h1, h2').first()).toBeVisible()

      // Check for document content or metadata
      await expect(
        page.locator('text=/Содержание|Content|Метаданные|Metadata/i')
      ).toBeVisible({ timeout: 5000 })
    }
  })

  test('should delete document', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Find delete button
    const deleteButton = page
      .locator('button')
      .filter({ hasText: /Удалить|Delete/ })
      .first()

    if (await deleteButton.isVisible({ timeout: 3000 })) {
      await deleteButton.click()

      // Confirm deletion
      const confirmButton = page.locator('button').filter({
        hasText: /Подтвердить|Confirm|Удалить|Delete/,
      }).last()

      if (await confirmButton.isVisible({ timeout: 3000 })) {
        await confirmButton.click()

        // Wait for success
        await expect(page.locator('text=/Успешно|Success|удален|deleted/i')).toBeVisible({
          timeout: 5000,
        })
      }
    }
  })

  test('should show document statistics', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/knowledge-base')

    // Check for stats cards
    const statsCards = page.locator('[data-testid*="stat"], .stat-card, text=/Всего|Total|Документов|Documents/i')

    await expect(statsCards.first()).toBeVisible({ timeout: 5000 })
  })

  test('should handle empty knowledge base', async ({ authenticatedPage: page }) => {
    // Navigate to knowledge base that might be empty
    await page.goto('/manage/test-org/knowledge-base')

    // Should show empty state or documents list
    await expect(
      page
        .locator('text=/Нет документов|No documents|Загрузите первый|Upload first/i')
        .or(page.locator('[data-testid="documents-list"]'))
    ).toBeVisible({ timeout: 5000 })
  })
})
