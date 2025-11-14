# Frontend Development Action Plan

> **Дата:** 2025-11-14
> **Базируется на:** FRONTEND_ANALYSIS_REPORT.md + references-kwid/
> **Цель:** Конкретный план действий для достижения 100% соответствия с KWID

---

## 📋 Содержание

1. [Immediate Actions (Следующие 2 недели)](#immediate-actions)
2. [Component Development Checklist](#component-development-checklist)
3. [Page-by-Page Implementation](#page-by-page-implementation)
4. [Design System Tasks](#design-system-tasks)
5. [Performance & Quality](#performance--quality)

---

## Immediate Actions (Следующие 2 недели)

### Week 1: Foundation Components

#### Day 1-2: Breadcrumbs Component

**Файл:** `components/ui/breadcrumb.tsx` (уже существует, требует улучшения)

**Референс:** `references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md` (строки 77-83)

**Требования:**
```typescript
// components/ui/breadcrumbs.tsx
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

<Breadcrumb items={[
  { label: 'Dashboard', href: '/manage/[tenantId]' },
  { label: 'AI Agents', href: '/manage/[tenantId]/ai-agents' },
  { label: 'Edit Agent' } // последний без href
]} />
```

**Дизайн:**
- Размер текста: 14px
- Цвет: text-gray-600
- Separator: `/` или `>`
- Hover: text-primary

**Checklist:**
- [ ] Создать/обновить компонент Breadcrumbs
- [ ] Добавить в ManageLayout для автоматического определения
- [ ] Протестировать на всех /manage страницах
- [ ] Добавить в Storybook

---

#### Day 3-4: Empty States Component

**Файл:** `components/ui/empty-state.tsx` (создать новый)

**Референс:** `references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md` (раздел "Пустые состояния")

**Варианты:**
1. **No Data** - когда таблица пуста
2. **No Results** - когда поиск не дал результатов
3. **No Access** - когда нет прав
4. **Error State** - когда произошла ошибка

```typescript
// components/ui/empty-state.tsx
interface EmptyStateProps {
  type: 'no-data' | 'no-results' | 'no-access' | 'error'
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
}

// Пример использования
<EmptyState
  type="no-data"
  title="Нет агентов"
  description="Создайте первого AI агента для начала работы"
  action={{
    label: 'Создать агента',
    onClick: () => router.push('/manage/[tenantId]/ai-agents/create')
  }}
/>
```

**Дизайн:**
- Icon: 64x64px, gray-400
- Title: text-xl, font-semibold, gray-900
- Description: text-sm, gray-600
- Action button: primary variant
- Padding: py-12

**Checklist:**
- [ ] Создать EmptyState component
- [ ] Создать 4 варианта
- [ ] Добавить иконки для каждого типа
- [ ] Использовать в AgentsTable
- [ ] Использовать в других таблицах
- [ ] Добавить в Storybook

---

#### Day 5-7: Skeleton Loaders

**Файл:** `components/ui/skeleton.tsx` (уже существует, требует расширения)

**Референс:** `references-kwid/HEADER_DETAILED_REPORT.md` (строки 929-941)

**Варианты:**
1. **Table Skeleton** - для таблиц
2. **Card Skeleton** - для карточек
3. **Form Skeleton** - для форм
4. **List Skeleton** - для списков

```typescript
// components/ui/skeleton-variants.tsx

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  )
}
```

**Checklist:**
- [ ] Создать TableSkeleton
- [ ] Создать CardSkeleton
- [ ] Создать FormSkeleton
- [ ] Создать ListSkeleton
- [ ] Добавить shimmer animation
- [ ] Использовать в AgentsTable
- [ ] Использовать в Dashboard
- [ ] Добавить в Storybook

---

### Week 2: Core Functionality

#### Day 8-10: Toast Notification System

**Файл:** `components/ui/toast.tsx` (уже существует), `components/ui/toaster.tsx`

**Референс:** `references-kwid/HEADER_DETAILED_REPORT.md` (строки 1154-1158)

**Требования:**
- Success (зеленый, checkmark icon)
- Error (красный, X icon)
- Warning (оранжевый, warning icon)
- Info (синий, info icon)

```typescript
// lib/hooks/use-toast.ts (расширить существующий)

toast.success('Агент успешно создан', {
  description: 'Теперь вы можете настроить его параметры',
  action: {
    label: 'Открыть',
    onClick: () => router.push(`/manage/[tenantId]/ai-agents/${agentId}`)
  }
})

toast.error('Не удалось создать агента', {
  description: 'Проверьте введенные данные и попробуйте снова'
})
```

**Позиционирование:**
- Position: bottom-right
- Max: 3 одновременных toast'а
- Auto-dismiss: 5 seconds (кроме error - 10s)
- Dismissible: true (X button)

**Checklist:**
- [ ] Обновить toast component
- [ ] Добавить все 4 варианта
- [ ] Добавить auto-dismiss
- [ ] Добавить action buttons
- [ ] Интегрировать во все формы
- [ ] Добавить в API error handling
- [ ] Тестировать с multiple toasts
- [ ] Добавить в Storybook

---

#### Day 11-14: Form Validation System

**Библиотеки:** React Hook Form + Zod

**Референс:** `references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md` (раздел "Валидация форм")

**Setup:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Шаблон формы:**
```typescript
// components/features/agents/AgentForm.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const agentSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Максимум 100 символов'),
  description: z.string().max(500, 'Максимум 500 символов').optional(),
  instructions: z.string().min(10, 'Минимум 10 символов'),
  model: z.string().min(1, 'Выберите модель'),
  temperature: z.number().min(0).max(2),
  isActive: z.boolean()
})

type AgentFormData = z.infer<typeof agentSchema>

export function AgentForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema)
  })

  const onSubmit = async (data: AgentFormData) => {
    try {
      await createAgent(data)
      toast.success('Агент создан')
      router.push('/manage/[tenantId]/ai-agents')
    } catch (error) {
      toast.error('Ошибка создания агента', {
        description: error.message
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        label="Название"
        error={errors.name?.message}
        required
      >
        <Input
          {...register('name')}
          placeholder="Мой AI агент"
          className={errors.name ? 'border-red-500' : ''}
        />
      </Field>

      {/* ... другие поля ... */}

      <Button type="submit" loading={isSubmitting}>
        Создать агента
      </Button>
    </form>
  )
}
```

**Field Component:**
```typescript
// components/ui/field.tsx (уже существует, улучшить)

interface FieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, error, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

**Checklist:**
- [ ] Install dependencies
- [ ] Создать validation schemas для всех форм
- [ ] Обновить AgentForm (create/edit)
- [ ] Обновить Knowledge upload form
- [ ] Обновить Integration forms
- [ ] Обновить Settings forms
- [ ] Добавить field-level validation
- [ ] Добавить success states
- [ ] Тестировать все формы
- [ ] Документация в Storybook

---

## Component Development Checklist

### Header Components

#### GlobalSearch
**Статус:** 🟡 Частично реализован

**Референс:** `references-kwid/HEADER_DETAILED_REPORT.md` (строки 66-108)

**Недостает:**
- [ ] Keyboard navigation (Arrow Up/Down)
- [ ] Highlight selected result
- [ ] Skeleton loader во время поиска
- [ ] Категории результатов (Agents, Articles, Settings)
- [ ] Recent searches (localStorage)

**Код:**
```typescript
// components/layout/GlobalSearch.tsx

// Добавить:
const [selectedIndex, setSelectedIndex] = useState(0)

// Keyboard handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url)
        }
        break
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isOpen, results, selectedIndex])
```

---

#### NotificationsPanel
**Статус:** 🟡 Базовый функционал

**Референс:** `references-kwid/NOTIFICATIONS_MODAL_DETAILED_REPORT.md`

**Недостает:**
- [ ] Real-time updates (WebSocket or polling)
- [ ] Pagination для большого количества
- [ ] Фильтры (All, Unread, Read)
- [ ] Notification types (info, warning, error, success)
- [ ] Action buttons в уведомлениях

---

#### UserMenu
**Статус:** ✅ Реализован

**Проверить:**
- [x] Theme switcher (light/dark/system)
- [x] Logout
- [ ] User avatar (если нет, показать инициалы)
- [ ] Settings link

---

### Sidebar Components

#### WorkspaceSelector
**Статус:** ❌ Заглушка

**Референс:** `references-kwid/SIDEBAR_DETAILED_REPORT.md` (строки 65-81)

**Требуется:**
```typescript
// components/layout/WorkspaceSelector.tsx

interface Workspace {
  id: string
  name: string
  avatar?: string
  slug: string
}

export function WorkspaceSelector({ workspaces, activeId }: {
  workspaces: Workspace[]
  activeId: string
}) {
  if (workspaces.length === 1) {
    // Показывать только название без dropdown
    return <WorkspaceDisplay workspace={workspaces[0]} />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Avatar src={active.avatar} fallback={active.name[0]} />
          <span>{active.name}</span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {workspaces.map(workspace => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => switchWorkspace(workspace)}
          >
            <Avatar src={workspace.avatar} fallback={workspace.name[0]} />
            <span>{workspace.name}</span>
            {workspace.id === activeId && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createWorkspace}>
          <Plus className="mr-2 h-4 w-4" />
          Создать workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Checklist:**
- [ ] Создать WorkspaceSelector component
- [ ] Fetch workspaces from API
- [ ] Switch workspace logic
- [ ] Persist active workspace в localStorage
- [ ] Create workspace flow
- [ ] Avatar с fallback на инициалы
- [ ] Поиск в dropdown (если >5 workspaces)

---

#### Navigation Menu
**Статус:** ✅ Базовая реализация

**Улучшения:**
- [ ] Collapsible sections (сейчас все открыты)
- [ ] External link indicator (icon)
- [ ] Badge для новых items
- [ ] Tooltip для collapsed sidebar (mobile)

---

## Page-by-Page Implementation

### AI Agents Page

**Референс:** `references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md`

#### Список агентов (`/manage/[tenantId]/ai-agents`)

**Текущий статус:** 70%

**Недостает:**
- [ ] Breadcrumbs: "Dashboard > AI Agents"
- [ ] Column Toggle (частично есть)
- [ ] Sorting columns
- [ ] Pagination
- [ ] Bulk actions (select multiple, delete, activate/deactivate)
- [ ] Empty state with "Create Agent" CTA
- [ ] Skeleton loader

**Чек-лист:**
```typescript
// app/manage/[tenantId]/ai-agents/page.tsx

✅ Page header
✅ Create button
✅ Search box
🟡 Column toggle (улучшить)
❌ Breadcrumbs
❌ Sorting
❌ Pagination
❌ Bulk actions
❌ Empty state
❌ Skeleton loader
```

---

#### Создание агента (`/manage/[tenantId]/ai-agents/create`)

**Текущий статус:** 60%

**Недостает:**
- [ ] Breadcrumbs: "Dashboard > AI Agents > Create"
- [ ] Form validation (Zod schema)
- [ ] Field-level errors
- [ ] Success toast после создания
- [ ] Redirect после создания
- [ ] Cancel button с confirmation
- [ ] Auto-save draft (localStorage)

---

#### Редактирование агента (6 табов)

**Текущий статус:** 75%

**Табы:**
1. ✅ Basics - реализовано
2. ✅ Integrations - реализовано
3. ✅ Sequences - реализовано
4. ✅ Triggers - реализовано
5. ✅ Leads/Contacts - реализовано
6. ✅ Advanced Settings - реализовано

**Общие улучшения для всех табов:**
- [ ] Breadcrumbs
- [ ] Unsaved changes warning
- [ ] Auto-save
- [ ] Loading states
- [ ] Error handling
- [ ] Success feedback

---

### Dashboard Page

**Референс:** `references-kwid/DASHBOARD_PAGE_DETAILED_REPORT.md`

**Текущий статус:** 60%

**Есть:**
- ✅ Stats cards
- ✅ Charts (daily/monthly)

**Недостает:**
- [ ] Breadcrumbs
- [ ] Recent activity feed
- [ ] Quick actions section
- [ ] Agent status overview
- [ ] Notifications count
- [ ] Loading states для charts
- [ ] Empty state если нет данных
- [ ] Период selection (last 7/30/90 days)

---

### Knowledge Base Page

**Референс:** `references-kwid/CATEGORIES_PAGE_DETAILED_REPORT.md`, `references-kwid/ARTICLES_PAGE_DETAILED_REPORT.md`

**Текущий статус:** 50%

**Недостает:**
- [ ] Breadcrumbs
- [ ] Categories tree view
- [ ] Articles table
- [ ] Upload files dialog
- [ ] Processing status
- [ ] Search in knowledge base
- [ ] Filters (by category, type, status)
- [ ] Bulk delete

---

### Test Chat Page

**Референс:** `references-kwid/TEST_CHAT_PAGE_DETAILED_REPORT.md`

**Текущий статус:** 65%

**Недостает:**
- [ ] Breadcrumbs
- [ ] Agent selector в chat
- [ ] Chat history (сохранять conversations)
- [ ] Clear chat confirmation
- [ ] Export chat
- [ ] Code syntax highlighting в ответах
- [ ] Markdown rendering в ответах
- [ ] Typing indicator
- [ ] Error recovery

---

### Integrations Page

**Текущий статус:** 55%

**Недостает:**
- [ ] Breadcrumbs
- [ ] Integration cards design
- [ ] OAuth flow UI
- [ ] Connected status
- [ ] Disconnect confirmation
- [ ] Settings для каждой интеграции
- [ ] Test connection button

---

### Settings Page

**Референс:** `references-kwid/ACCOUNT_SETTINGS_PAGE_DETAILED_REPORT.md`

**Текущий статус:** 40%

**Недостает:**
- [ ] Breadcrumbs
- [ ] Tabs (Profile, Security, Billing, Team)
- [ ] Profile settings form
- [ ] Avatar upload
- [ ] Password change
- [ ] API keys management
- [ ] Billing information
- [ ] Delete account с confirmation

---

## Design System Tasks

### 1. Storybook Setup

**Приоритет:** Высокий

```bash
npm install --save-dev @storybook/nextjs @storybook/react @storybook/addon-essentials
npx storybook@latest init
```

**Структура:**
```
.storybook/
├── main.ts
├── preview.ts
└── manager.ts

stories/
├── Introduction.mdx
├── ui/
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   ├── Table.stories.tsx
│   └── ...
├── layout/
│   ├── Header.stories.tsx
│   ├── Sidebar.stories.tsx
│   └── ...
└── features/
    ├── AgentsTable.stories.tsx
    └── ...
```

**Checklist:**
- [ ] Install Storybook
- [ ] Configure для Next.js + Tailwind
- [ ] Создать stories для всех UI компонентов
- [ ] Добавить dark mode toggle
- [ ] Добавить viewport addon для responsive
- [ ] Добавить accessibility addon
- [ ] Deploy Storybook на Vercel/Netlify

---

### 2. Design Tokens Documentation

**Файл:** `docs/DESIGN_TOKENS_GUIDE.md`

**Содержание:**
- Цветовая палитра (с hex кодами)
- Типографика (размеры, веса, line-heights)
- Spacing scale (4, 8, 12, 16, 24, 32, 48, 64...)
- Border radius (sm, md, lg, xl, 2xl, full)
- Shadows (sm, md, lg, xl)
- Breakpoints (sm, md, lg, xl, 2xl)
- z-index scale

**Checklist:**
- [ ] Создать DESIGN_TOKENS_GUIDE.md
- [ ] Добавить примеры использования
- [ ] Создать visual guide (Figma/Storybook)
- [ ] Синхронизировать с design-tokens.ts

---

### 3. Accessibility Audit

**Чек-лист WCAG 2.1 Level AA:**

#### Color Contrast
- [ ] Text vs background: ≥ 4.5:1
- [ ] Large text vs background: ≥ 3:1
- [ ] UI components vs background: ≥ 3:1

#### Keyboard Navigation
- [ ] Все интерактивные элементы focusable
- [ ] Tab order логичный
- [ ] Focus visible (outline)
- [ ] Keyboard shortcuts не конфликтуют

#### ARIA
- [ ] Все buttons с labels
- [ ] All forms с labels
- [ ] All images с alt
- [ ] Modals с aria-labelledby
- [ ] Dropdowns с aria-expanded

#### Screen Readers
- [ ] Тестирование с NVDA (Windows)
- [ ] Тестирование с VoiceOver (macOS)
- [ ] Landmarks (nav, main, aside, footer)
- [ ] Skip to main content link

**Tools:**
- axe DevTools (Chrome extension)
- Lighthouse (accessibility score ≥ 90)
- WAVE (Web Accessibility Evaluation Tool)

**Checklist:**
- [ ] Run axe audit на всех страницах
- [ ] Fix все violations
- [ ] Run Lighthouse
- [ ] Тест с screen reader
- [ ] Документировать findings
- [ ] Create accessibility checklist для новых features

---

### 4. Responsive Design Review

**Breakpoints:**
```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet portrait
  'lg': '1024px',  // Tablet landscape / Desktop
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
}
```

**Тестировать на:**
- iPhone SE (375x667)
- iPhone 12/13 (390x844)
- iPad (768x1024)
- iPad Pro (1024x1366)
- Desktop (1920x1080)
- Large Desktop (2560x1440)

**Чек-лист по страницам:**

#### Header
- [ ] ≤ 640px: Hamburger menu, скрыть search
- [ ] 641-1023px: Partial search
- [ ] ≥ 1024px: Full header

#### Sidebar
- [ ] ≤ 1023px: Overlay sidebar с button toggle
- [ ] ≥ 1024px: Fixed sidebar

#### Tables
- [ ] ≤ 768px: Card view вместо table
- [ ] ≥ 769px: Full table

#### Forms
- [ ] ≤ 768px: Single column
- [ ] ≥ 769px: Two columns где applicable

**Checklist:**
- [ ] Test все страницы на всех breakpoints
- [ ] Fix overflow issues
- [ ] Fix touch targets (min 44x44px)
- [ ] Test на реальных устройствах
- [ ] Document responsive patterns

---

## Performance & Quality

### Performance Optimization

**Checklist:**

#### Bundle Size
- [ ] Analyze bundle: `npm run build && npx @next/bundle-analyzer`
- [ ] Code splitting для routes
- [ ] Dynamic imports для heavy components
- [ ] Tree-shaking verification

**Targets:**
- Initial bundle: < 200KB (gzipped)
- Total bundle: < 500KB (gzipped)

---

#### Images
- [ ] Use Next.js Image component
- [ ] Lazy loading для below-fold images
- [ ] WebP format where possible
- [ ] Responsive images (srcset)

---

#### Fonts
- [ ] Self-host fonts (не external)
- [ ] font-display: swap
- [ ] Preload critical fonts
- [ ] Subset fonts

---

#### JavaScript
- [ ] Remove unused dependencies
- [ ] Debounce/throttle где нужно
- [ ] Memoization (useMemo, useCallback)
- [ ] React.lazy для routes

---

### Web Vitals Targets

**Метрики:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Monitoring:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Checklist:**
- [ ] Install @vercel/analytics
- [ ] Setup monitoring
- [ ] Baseline measurements
- [ ] Optimize до targets
- [ ] Monitor в production

---

### Testing Strategy

#### Unit Tests (Vitest + React Testing Library)

**Coverage target:** ≥ 80%

**Test categories:**
- UI components (rendering, interactions)
- Hooks (custom hooks logic)
- Utils (pure functions)
- Services (API calls, mocked)

**Checklist:**
- [ ] Setup Vitest
- [ ] Test UI components
- [ ] Test custom hooks
- [ ] Test utilities
- [ ] Test services
- [ ] Setup coverage reports
- [ ] CI integration

---

#### Integration Tests

**Focus:**
- Form submissions
- Navigation flows
- API integration
- State management

**Checklist:**
- [ ] Agent creation flow
- [ ] Agent editing flow
- [ ] Knowledge upload flow
- [ ] Integration connection flow

---

#### E2E Tests (Playwright)

**Critical paths:**
1. Login → Dashboard
2. Create Agent → Configure → Test
3. Upload Knowledge → Process → Search
4. Connect Integration → Sync

**Checklist:**
- [ ] Setup Playwright
- [ ] Login flow test
- [ ] Agent CRUD tests
- [ ] Knowledge base tests
- [ ] Integration tests
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] CI integration

---

## Timeline & Milestones

### Milestone 1: Foundation (Week 1-2)
**Deliverables:**
- ✅ Breadcrumbs component
- ✅ Empty states component
- ✅ Skeleton loaders
- ✅ Toast system
- ✅ Form validation setup

**Definition of Done:**
- Все компоненты в Storybook
- Тесты написаны
- Используются на ≥ 3 страницах

---

### Milestone 2: Integration (Week 3-4)
**Deliverables:**
- ✅ API integration (remove mocks)
- ✅ Workspace selector
- ✅ Real-time notifications
- ✅ Complete forms with validation

**Definition of Done:**
- No mock data
- All forms validated
- Error handling implemented
- Success feedback working

---

### Milestone 3: Polish (Week 5-6)
**Deliverables:**
- ✅ Performance optimization
- ✅ Accessibility fixes
- ✅ Responsive design fixes
- ✅ Testing suite complete

**Definition of Done:**
- Web Vitals meet targets
- WCAG AA compliance
- Works on all breakpoints
- Test coverage ≥ 80%

---

### Milestone 4: Production (Week 7-8)
**Deliverables:**
- ✅ Storybook deployed
- ✅ Documentation complete
- ✅ Monitoring setup
- ✅ Final QA

**Definition of Done:**
- All docs updated
- Monitoring live
- QA checklist complete
- Ready for production

---

## Daily Standup Template

**What I did yesterday:**
- [ ] Component X completed
- [ ] Feature Y integrated
- [ ] Bug Z fixed

**What I'm doing today:**
- [ ] Component A
- [ ] Feature B
- [ ] Testing C

**Blockers:**
- None / [описание блокера]

---

## Success Criteria

### Functional
- [ ] Все страницы работают без mock данных
- [ ] Все формы с validation
- [ ] Все async операции с loading states
- [ ] Все ошибки обрабатываются gracefully

### Design
- [ ] 100% соответствие с KWID референсом
- [ ] Consistent spacing/typography
- [ ] Dark mode работает везде
- [ ] Responsive на всех breakpoints

### Quality
- [ ] Test coverage ≥ 80%
- [ ] WCAG AA compliant
- [ ] Lighthouse score ≥ 90
- [ ] No console errors/warnings

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 500KB

---

**Следующий шаг:** Начать с Milestone 1, Day 1-2 (Breadcrumbs)

**Вопросы?** Обращайтесь к:
- `FRONTEND_ANALYSIS_REPORT.md` - полный анализ
- `references-kwid/` - детальные спецификации
- `docs/design-system.md` - дизайн-система

---

**Документ создан:** 2025-11-14
**Версия:** 1.0
**Статус:** Ready to Execute
