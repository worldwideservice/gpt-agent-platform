# Accessibility Components and Utilities

Comprehensive accessibility (a11y) implementation following WCAG 2.1 Level AA standards.

## Overview

This platform is built with accessibility as a core principle. We provide:
- **WCAG 2.1 Level AA compliance**
- **Keyboard navigation** for all interactive elements
- **Screen reader support** with proper ARIA labels
- **Focus management** for modals and dynamic content
- **Color contrast** meeting WCAG AA standards
- **Accessible forms** with proper labeling and error messages

## Components

### SkipLink

Allows keyboard users to bypass navigation and jump to main content.

```tsx
import { SkipLink } from '@/components/ui/skip-link'

export function Layout() {
  return (
    <>
      <SkipLink contentId="main-content" />
      <nav>...</nav>
      <main id="main-content">...</main>
    </>
  )
}
```

**WCAG:** 2.4.1 (Level A) - Bypass Blocks

### KeyboardShortcuts

Displays and manages keyboard shortcuts throughout the application.

```tsx
import { KeyboardShortcuts, KeyboardShortcut } from '@/components/accessibility/keyboard-shortcuts'

const shortcuts: KeyboardShortcut[] = [
  {
    key: 'k',
    modifiers: ['Ctrl'],
    description: 'Открыть поиск',
    action: () => openSearch(),
    category: 'Навигация',
  },
  {
    key: 'n',
    modifiers: ['Ctrl'],
    description: 'Создать агента',
    action: () => createAgent(),
    category: 'Действия',
  },
]

export function App() {
  return <KeyboardShortcuts shortcuts={shortcuts} />
}
```

**Built-in shortcuts:**
- `?` - Show keyboard shortcuts help
- Custom shortcuts can be added per page

### FocusTrap

Traps focus within a container (essential for modals/dialogs).

```tsx
import { FocusTrap } from '@/components/accessibility/focus-trap'

export function Modal({ isOpen, onClose }) {
  return (
    <FocusTrap active={isOpen} onEscape={onClose}>
      <div role="dialog" aria-modal="true">
        {/* Modal content */}
      </div>
    </FocusTrap>
  )
}
```

**WCAG:** 2.1.2 (Level A) - No Keyboard Trap

### VisuallyHidden / SROnly

Hides content visually while keeping it accessible to screen readers.

```tsx
import { VisuallyHidden, SROnly } from '@/components/accessibility/visually-hidden'

export function Icon() {
  return (
    <button>
      <IconSvg />
      <SROnly>Удалить элемент</SROnly>
    </button>
  )
}
```

**WCAG:** 1.3.1 (Level A) - Info and Relationships

### ErrorBoundary

Component-level error handling with accessible error messages.

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

export function Dashboard() {
  return (
    <ErrorBoundary
      title="Ошибка загрузки дашборда"
      onError={(error, info) => logError(error, info)}
    >
      <DashboardContent />
    </ErrorBoundary>
  )
}
```

## Utilities

### Screen Reader Announcements

```tsx
import { announceToScreenReader } from '@/lib/utils/accessibility'

// Polite announcement (waits for pause)
announceToScreenReader('Данные успешно сохранены', 'polite')

// Assertive announcement (interrupts)
announceToScreenReader('Ошибка! Проверьте форму', 'assertive')
```

### Focus Management

```tsx
import { FocusManager } from '@/lib/utils/accessibility'

const focusManager = new FocusManager()

// Before opening modal
focusManager.capture()

// When closing modal
focusManager.restore()

// Move focus to specific element
focusManager.moveTo(element)
```

### Get Focusable Elements

```tsx
import { getFocusableElements } from '@/lib/utils/accessibility'

const container = document.querySelector('.modal')
const focusable = getFocusableElements(container)

// Focus first element
focusable[0]?.focus()
```

### ARIA ID Generation

```tsx
import { generateAriaId } from '@/lib/utils/accessibility'

const labelId = generateAriaId('label') // 'label-x7k2m9p'
const descId = generateAriaId('desc') // 'desc-a4j8n3q'

<label id={labelId}>Name</label>
<input aria-labelledby={labelId} aria-describedby={descId} />
<span id={descId}>Enter your full name</span>
```

### Color Contrast Checking

```tsx
import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from '@/lib/utils/accessibility'

const ratio = getContrastRatio('#000000', '#FFFFFF') // 21
const isAccessible = meetsWCAGAA('#333333', '#FFFFFF') // true
const isHighlyAccessible = meetsWCAGAAA('#333333', '#FFFFFF', false) // true
```

**WCAG Standards:**
- **AA Normal Text:** 4.5:1 minimum
- **AA Large Text:** 3:1 minimum
- **AAA Normal Text:** 7:1 minimum
- **AAA Large Text:** 4.5:1 minimum

### Roving Tabindex

For keyboard navigation in lists (toolbars, menus, grids).

```tsx
import { RovingTabIndex } from '@/lib/utils/accessibility'

useEffect(() => {
  const container = document.querySelector('[role="toolbar"]')
  const rovingTabIndex = new RovingTabIndex(container, 'button')

  return () => rovingTabIndex.destroy()
}, [])
```

**Navigation:**
- `Arrow keys` - Navigate between items
- `Home` - First item
- `End` - Last item

## Best Practices

### 1. Semantic HTML

✅ **DO:**
```tsx
<button onClick={handleClick}>Submit</button>
<nav>...</nav>
<main>...</main>
<article>...</article>
```

❌ **DON'T:**
```tsx
<div onClick={handleClick}>Submit</div>
<div className="nav">...</div>
<div className="main">...</div>
```

### 2. ARIA Labels

✅ **DO:**
```tsx
<button aria-label="Закрыть модальное окно">
  <X />
</button>

<input
  type="text"
  aria-label="Поиск"
  aria-describedby="search-hint"
/>
<span id="search-hint">Введите минимум 3 символа</span>
```

❌ **DON'T:**
```tsx
<button>
  <X />
</button>

<input type="text" placeholder="Поиск" />
```

### 3. Keyboard Navigation

✅ **DO:**
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Action
</button>
```

❌ **DON'T:**
```tsx
<div onClick={handleClick}>Action</div>
```

### 4. Focus Indicators

✅ **DO:**
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary"
```

❌ **DON'T:**
```tsx
className="focus:outline-none" // No alternative focus indicator
```

### 5. Alternative Text

✅ **DO:**
```tsx
<img src="chart.png" alt="Revenue growth chart showing 25% increase" />
<img src="decorative.png" alt="" role="presentation" />
```

❌ **DON'T:**
```tsx
<img src="chart.png" />
<img src="decorative.png" alt="image" />
```

### 6. Form Labels

✅ **DO:**
```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && <span id="email-error" role="alert">Invalid email</span>}
```

❌ **DON'T:**
```tsx
<input type="email" placeholder="Email" />
{hasError && <span>Invalid email</span>}
```

### 7. Modal Dialogs

✅ **DO:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure?</p>
  <FocusTrap>...</FocusTrap>
</div>
```

### 8. Loading States

✅ **DO:**
```tsx
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Spinner />
      <VisuallyHidden>Загрузка...</VisuallyHidden>
    </>
  ) : (
    content
  )}
</div>
```

### 9. Error Messages

✅ **DO:**
```tsx
<div role="alert" aria-live="assertive">
  <AlertTriangle />
  Ошибка: {errorMessage}
</div>
```

## Testing Accessibility

### 1. Keyboard Navigation

- [ ] All interactive elements reachable by Tab
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] Modal focus trap works
- [ ] Escape closes modals

### 2. Screen Reader

- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All images have alt text
- [ ] Forms properly labeled
- [ ] ARIA landmarks used correctly
- [ ] Dynamic content announced

### 3. Automated Testing

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Add to your app
import { axe } from '@axe-core/react'

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000)
}
```

### 4. Manual Checks

- [ ] Color contrast meets WCAG AA
- [ ] Text resizes to 200% without breaking
- [ ] Works without CSS
- [ ] Works without JavaScript (where possible)
- [ ] Captions for video/audio

## WCAG 2.1 Level AA Compliance

Our implementation covers:

**Perceivable:**
- 1.1.1 Non-text Content (A)
- 1.3.1 Info and Relationships (A)
- 1.4.3 Contrast (Minimum) (AA)
- 1.4.11 Non-text Contrast (AA)

**Operable:**
- 2.1.1 Keyboard (A)
- 2.1.2 No Keyboard Trap (A)
- 2.4.1 Bypass Blocks (A)
- 2.4.3 Focus Order (A)
- 2.4.7 Focus Visible (AA)

**Understandable:**
- 3.1.1 Language of Page (A)
- 3.2.1 On Focus (A)
- 3.2.2 On Input (A)
- 3.3.1 Error Identification (A)
- 3.3.2 Labels or Instructions (A)

**Robust:**
- 4.1.1 Parsing (A)
- 4.1.2 Name, Role, Value (A)
- 4.1.3 Status Messages (AA)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
