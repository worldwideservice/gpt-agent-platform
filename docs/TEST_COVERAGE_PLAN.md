# Test Coverage Improvement Plan

## 📊 Current Status

- **Total files in lib/**: 80
- **Total tests**: 218
- **Target coverage**: 80% lines / 75% statements
- **Current thresholds** (vitest.config.ts):
  - lines: 70%
  - statements: 70%
  - functions: 65%
  - branches: 50%

## 🎯 Coverage Goals

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Lines | 70% | 80% | +10% |
| Statements | 70% | 75% | +5% |
| Functions | 65% | 75% | +10% |
| Branches | 50% | 65% | +15% |

## 📋 Files Without Tests

### Critical Services (High Priority)
- `services/agents.ts` - Core agent logic
- `services/knowledge.ts` - Knowledge base operations
- `services/usage-tracker.ts` - Usage tracking and billing
- `services/script-processor.ts` - Script execution

### AI Services (Medium Priority)
- `services/ai/configuration-resolver.ts`
- `services/ai/openai-brain.client.ts`
- `services/ai/openrouter-resolver.ts`
- `services/ai/openrouter.client.ts`

### Repositories (Medium Priority)
- `repositories/organization-settings.ts`
- `repositories/manage-summary.ts`

### Other Services (Low Priority)
- `services/integrations.ts` - Already has tests
- `services/agent-context-builder.ts` - Already has tests

## 🛠️ DevOps Strategy

### Phase 1: Automation & CI/CD ✅
- [x] Create test template generator script
- [ ] Setup GitHub Actions for coverage
- [ ] Add coverage badges to README
- [ ] Setup codecov.io integration

### Phase 2: Critical Path Testing (Week 1)
Priority: Services that handle money, auth, and data integrity
- [ ] `services/usage-tracker.ts` - Usage and billing
- [ ] `services/agents.ts` - Core agent creation/updates
- [ ] `services/knowledge.ts` - Knowledge base CRUD

**Estimated impact**: +15% coverage

### Phase 3: AI Services Testing (Week 2)
Priority: AI configuration and client interactions
- [ ] `services/ai/configuration-resolver.ts`
- [ ] `services/ai/openai-brain.client.ts`
- [ ] `services/ai/openrouter-resolver.ts`

**Estimated impact**: +10% coverage

### Phase 4: Repository Layer (Week 3)
Priority: Data access layer consistency
- [ ] `repositories/organization-settings.ts`
- [ ] `repositories/manage-summary.ts`

**Estimated impact**: +5% coverage

### Phase 5: Edge Cases & Integration (Week 4)
- [ ] Increase branch coverage (error paths)
- [ ] Add integration tests for critical flows
- [ ] Add E2E tests for money-related features

**Estimated impact**: +10% coverage

## 📝 Testing Best Practices

### Unit Test Structure
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle happy path', () => {
      // Arrange
      const input = { ... }

      // Act
      const result = service.method(input)

      // Assert
      expect(result).toEqual(expected)
    })

    it('should handle error case', () => {
      // Test error handling
    })

    it('should validate input', () => {
      // Test validation
    })
  })
})
```

### Coverage Requirements
- **Happy path**: Main functionality working correctly
- **Error paths**: All error cases handled
- **Edge cases**: Boundary conditions, null/undefined, empty arrays
- **Validation**: Input validation and type checking

### Mocking Strategy
- **Database**: Mock Supabase client
- **External APIs**: Mock HTTP clients (OpenAI, Kommo, etc.)
- **Redis**: Mock cache client
- **Time**: Mock Date.now() for deterministic tests

## 🚀 Quick Start

### Run all tests
```bash
npm run vitest
```

### Run with coverage
```bash
VITEST_COVERAGE=true npm run vitest
```

### Run specific test file
```bash
npx vitest run tests/unit/services/billing.test.ts
```

### Generate test template
```bash
node scripts/generate-test-template.js lib/services/agents.ts
```

## 🔍 Coverage Analysis

### View HTML coverage report
```bash
VITEST_COVERAGE=true npm run vitest
open coverage/index.html
```

### Check coverage thresholds
Coverage thresholds are defined in `vitest.config.ts` and will fail the build if not met.

## 📈 Tracking Progress

### Weekly Coverage Report
Run and commit coverage report:
```bash
VITEST_COVERAGE=true npm run vitest
git add coverage/coverage-summary.json
git commit -m "chore: update coverage report"
```

### CI/CD Integration
GitHub Actions will automatically:
- Run tests on every PR
- Generate coverage report
- Comment coverage diff on PR
- Block merge if coverage decreases

## 🎯 Success Metrics

- ✅ 80% line coverage
- ✅ 75% statement coverage
- ✅ 75% function coverage
- ✅ 65% branch coverage
- ✅ All critical paths tested
- ✅ No flaky tests
- ✅ Fast test execution (<2 minutes)

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)
