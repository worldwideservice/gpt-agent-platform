# 📚 Storybook Setup Guide

> **Создание документации для новых компонентов**

---

## 🎯 Цель

Создать Storybook stories для всех новых дизайн-компонентов, чтобы:
- Документировать использование
- Показывать примеры
- Тестировать компоненты изолированно
- Делиться компонентами с командой

---

## 📦 Компоненты для документирования

1. ✅ `ScrollAnimation` - Scroll animations
2. ✅ `AnimatedCounter` - Animated counters
3. ✅ `ThemeToggle` - Dark mode toggle
4. ✅ `GlassCard` - Glassmorphism cards
5. ✅ `SkipLink` - Accessibility skip link
6. ✅ `ProgressRing` - Circular progress
7. ✅ `AchievementBadge` - Achievement badges

---

## 🚀 Быстрый старт

### 1. Запустить Storybook:
```bash
npm run storybook
```

### 2. Создать stories:
Скопировать шаблоны из `components/ui/storybook-stories.tsx` и создать файлы:
- `.storybook/stories/ScrollAnimation.stories.tsx`
- `.storybook/stories/AnimatedCounter.stories.tsx`
- `.storybook/stories/ThemeToggle.stories.tsx`
- `.storybook/stories/GlassCard.stories.tsx`
- `.storybook/stories/ProgressRing.stories.tsx`
- `.storybook/stories/AchievementBadge.stories.tsx`

### 3. Просмотр:
Открыть http://localhost:6006

---

## 📝 Структура Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@/components/ui/component-name'

const meta = {
  title: 'UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Описать props
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const Variant1: Story = {
  args: {
    // Variant props
  },
}
```

---

## ✅ Чеклист

- [ ] ScrollAnimation.stories.tsx
- [ ] AnimatedCounter.stories.tsx
- [ ] ThemeToggle.stories.tsx
- [ ] GlassCard.stories.tsx
- [ ] ProgressRing.stories.tsx
- [ ] AchievementBadge.stories.tsx
- [ ] SkipLink.stories.tsx (опционально)

---

**Status:** ⏳ **Pending** - Templates готовы, нужно создать stories

