# Testing Guide

Comprehensive testing strategy for the GPT Agent Platform.

## Overview

Testing stack:
- **E2E Tests:** Playwright (browser automation)
- **API Tests:** Playwright Test (API testing)
- **Unit Tests:** Vitest (fast unit testing)
- **Component Tests:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── fixtures/          # Test data and helpers
│   │   ├── test-data.ts  # Reusable test data
│   │   └── auth.fixture.ts  # Authentication fixtures
│   ├── auth.spec.ts      # Authentication tests
│   ├── agents.spec.ts    # AI agents tests
│   ├── knowledge-base.spec.ts  # Documents tests
│   └── analytics.spec.ts # Analytics tests
├── api/                   # API integration tests
│   ├── agents.api.spec.ts
│   ├── documents.api.spec.ts
│   └── analytics.api.spec.ts
├── unit/                  # Unit tests
│   └── lib/              # Library function tests
└── components/            # Component tests
    └── ui/               # UI component tests
```

## Running Tests

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (debugging)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode
npx playwright test --debug

# Update snapshots
npx playwright test --update-snapshots
```

### API Tests

```bash
# Run API integration tests
npm run test:api

# Run specific API test
npx playwright test tests/api/agents.api.spec.ts

# Generate API test report
npx playwright show-report
```

### Unit Tests

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test
npm run test -- lib/cache
```

### All Tests

```bash
# Run all tests (E2E + API + Unit)
npm run test:all

# Run in CI mode
CI=true npm run test:all
```

## Writing E2E Tests

### Basic Test

```typescript
import { test, expect } from '@playwright/test'

test('should display homepage', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toBeVisible()
  await expect(page).toHaveTitle(/GPT Agent Platform/)
})
```

### Authenticated Test

```typescript
import { test, expect } from './fixtures/auth.fixture'

test('should display dashboard', async ({ authenticatedPage: page }) => {
  // Already logged in
  await page.goto('/manage/test-org/dashboard')

  await expect(page.locator('h1')).toContainText('Dashboard')
})
```

### Form Interaction

```typescript
test('should create agent', async ({ authenticatedPage: page }) => {
  await page.goto('/manage/test-org/ai-agents')

  // Click create button
  await page.click('button:has-text("Create Agent")')

  // Fill form
  await page.fill('input[name="name"]', 'Test Agent')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.selectOption('select[name="model"]', 'gpt-4-turbo')

  // Submit
  await page.click('button[type="submit"]')

  // Verify success
  await expect(page.locator('text=/Success|Created/')).toBeVisible()
})
```

### API Calls in E2E

```typescript
test('should handle API response', async ({ page }) => {
  // Wait for specific API call
  const responsePromise = page.waitForResponse('/api/agents')

  await page.goto('/manage/test-org/ai-agents')

  const response = await responsePromise
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(data.agents).toBeDefined()
})
```

## Writing API Tests

### Basic API Test

```typescript
import { test, expect } from '@playwright/test'

test('GET /api/agents - should return agents', async ({ request }) => {
  const response = await request.get('/api/agents')

  expect(response.ok()).toBeTruthy()
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(Array.isArray(data.agents)).toBeTruthy()
})
```

### POST Request

```typescript
test('POST /api/agents - should create agent', async ({ request }) => {
  const response = await request.post('/api/agents', {
    data: {
      name: 'Test Agent',
      model: 'gpt-4-turbo',
      temperature: 0.7,
    },
  })

  expect(response.ok()).toBeTruthy()
  expect(response.status()).toBe(201)

  const data = await response.json()
  expect(data.agent.id).toBeDefined()
})
```

### File Upload

```typescript
test('POST /api/documents/upload - should upload file', async ({ request }) => {
  const response = await request.post('/api/documents/upload', {
    multipart: {
      file: {
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content'),
      },
      title: 'Test Document',
    },
  })

  expect(response.ok()).toBeTruthy()
})
```

## Test Fixtures

### Test Data

```typescript
// tests/e2e/fixtures/test-data.ts
export const testAgent = {
  name: 'Test AI Agent',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  systemPrompt: 'You are a helpful assistant.',
}

export function generateRandomAgent() {
  return {
    ...testAgent,
    name: `Test Agent ${Math.random().toString(36).substring(7)}`,
  }
}
```

### Auth Fixture

```typescript
// tests/e2e/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@test.local')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/manage/**')

    await use(page)

    // Logout after test
    await page.goto('/api/auth/signout')
  },
})
```

## Best Practices

### 1. Test Isolation

✅ **DO:**
```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/')
})

test.afterEach(async ({ page }) => {
  // Clean up after test
  await page.close()
})
```

❌ **DON'T:**
```typescript
// Tests that depend on each other
test('create item', async ({ page }) => {
  // Creates item
})

test('edit item', async ({ page }) => {
  // Assumes item exists from previous test
})
```

### 2. Selectors

✅ **DO:**
```typescript
// Use test IDs
await page.click('[data-testid="create-button"]')

// Use accessible roles
await page.click('button[role="button"]')

// Use text content
await page.click('button:has-text("Create")')
```

❌ **DON'T:**
```typescript
// Fragile CSS selectors
await page.click('.btn-primary.btn-lg.mx-2')

// XPath
await page.click('//div[@class="container"]/button[1]')
```

### 3. Waits

✅ **DO:**
```typescript
// Wait for specific condition
await page.waitForSelector('[data-testid="content"]')
await page.waitForURL('/dashboard')
await page.waitForResponse('/api/data')

// Auto-waiting with assertions
await expect(page.locator('h1')).toBeVisible()
```

❌ **DON'T:**
```typescript
// Arbitrary timeouts
await page.waitForTimeout(5000)
```

### 4. Assertions

✅ **DO:**
```typescript
// Specific assertions
await expect(page.locator('h1')).toContainText('Dashboard')
await expect(page.locator('input')).toHaveValue('test')
await expect(response.status()).toBe(200)
```

❌ **DON'T:**
```typescript
// Weak assertions
expect(true).toBeTruthy()
expect(data).toBeDefined()
```

## Debugging

### Playwright UI Mode

```bash
npx playwright test --ui
```

Features:
- Visual test runner
- Time travel debugging
- Watch mode
- Pick locator

### Debug Mode

```bash
npx playwright test --debug
```

Opens browser with DevTools and pauses execution.

### Trace Viewer

```bash
# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Screenshots

Automatically captured on failure. Manual capture:

```typescript
await page.screenshot({ path: 'screenshot.png' })
await page.screenshot({ path: 'screenshot.png', fullPage: true })
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop
- Pull requests
- Manual trigger

### Artifacts

- **Test Reports:** Stored for 30 days
- **Screenshots:** Stored for 7 days (on failure)
- **Videos:** Stored for 7 days (on failure)

### Status Checks

Required checks:
- E2E Tests (chromium)
- API Integration Tests
- Unit Tests

## Performance Testing

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run tests/load/api-load-test.js
```

### Lighthouse

```bash
# Run Lighthouse audit
npm run lighthouse

# CI integration
lighthouse https://your-site.com --output=html --output-path=./lighthouse-report.html
```

## Coverage

### Generate Coverage Report

```bash
# Unit test coverage
npm run test:coverage

# E2E coverage (requires instrumentation)
npm run test:e2e:coverage
```

### Coverage Thresholds

```json
{
  "coverage": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}
```

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout for slow tests
test.setTimeout(60000) // 60 seconds

// Or globally in config
timeout: 60 * 1000
```

### Flaky Tests

```typescript
// Retry flaky tests
test.describe.configure({ retries: 2 })

// Or use soft assertions
await expect.soft(locator).toBeVisible()
```

### Authentication Issues

```typescript
// Reuse authentication state
await page.context().storageState({ path: 'auth.json' })

// Load saved state
await context.addCookies(cookies)
```

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
