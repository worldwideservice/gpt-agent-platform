# ⚡ Performance Optimization Guide

> **Цель:** Lighthouse Performance Score ≥ 90

---

## 📊 Текущие метрики (целевые)

### Core Web Vitals:
- **LCP (Largest Contentful Paint):** < 2.5s ✅
- **FID (First Input Delay):** < 100ms ✅
- **CLS (Cumulative Layout Shift):** < 0.1 ✅

### Lighthouse Scores:
- **Performance:** ≥ 90 (target)
- **Accessibility:** ≥ 90 (target)
- **Best Practices:** ≥ 90 (target)
- **SEO:** ≥ 90 (target)

---

## 🎯 Оптимизации для анимаций

### 1. CSS Animations
✅ **Уже реализовано:**
- Используются CSS transitions (GPU-accelerated)
- `will-change` можно добавить для критичных элементов
- `transform` и `opacity` вместо `top/left` (GPU-accelerated)

### 2. Intersection Observer
✅ **Уже реализовано:**
- Lazy loading для scroll animations
- Эффективное использование для счетчиков

### 3. Рекомендации по улучшению:

```css
/* Добавить в globals.css для критичных анимаций */
.animate-element {
  will-change: transform, opacity;
}

/* После анимации убрать will-change */
.animate-element.done {
  will-change: auto;
}
```

---

## 🔍 Проверка производительности

### 1. Lighthouse Audit
```bash
# Запустить dev сервер
npm run dev

# В другом терминале
npm run check:performance
```

### 2. Chrome DevTools
1. Открыть DevTools (F12)
2. Performance tab
3. Record performance
4. Проверить:
   - FPS (должно быть 60fps)
   - Main thread activity
   - Layout shifts
   - Paint times

### 3. Web Vitals
```bash
# Установить web-vitals
npm install web-vitals

# Добавить в код для мониторинга
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Отправить в аналитику
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🚀 Оптимизации

### 1. Code Splitting
✅ **Уже реализовано:**
- Next.js автоматически делает code splitting
- Динамические импорты для логгера

### 2. Image Optimization
- [ ] Использовать Next.js Image component
- [ ] Lazy loading для изображений
- [ ] WebP формат для изображений

### 3. Font Optimization
- [ ] Preload критичных шрифтов
- [ ] Использовать font-display: swap
- [ ] Subset шрифтов (только нужные символы)

### 4. CSS Optimization
✅ **Уже реализовано:**
- Tailwind CSS (purge unused styles в production)
- Минификация CSS в production

### 5. JavaScript Optimization
✅ **Уже реализовано:**
- Next.js автоматическая минификация
- Tree shaking
- Dead code elimination

---

## 📈 Мониторинг

### Production Monitoring:
1. **Sentry** - уже настроен
2. **Web Vitals** - можно добавить
3. **Lighthouse CI** - для автоматических проверок

### Добавить в CI/CD:
```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://localhost:3000
    uploadArtifacts: true
    temporaryPublicStorage: true
```

---

## ✅ Чеклист оптимизации

### Performance:
- [x] CSS transitions вместо JS animations
- [x] GPU-accelerated properties (transform, opacity)
- [x] Intersection Observer для lazy animations
- [ ] Add will-change для критичных элементов
- [ ] Preload критичных ресурсов
- [ ] Optimize images (WebP, lazy load)

### Code:
- [x] Code splitting (Next.js автоматически)
- [x] Tree shaking
- [x] Минификация в production
- [ ] Remove unused CSS (Tailwind purge)

### Network:
- [ ] HTTP/2 или HTTP/3
- [ ] Gzip/Brotli compression
- [ ] CDN для статических ресурсов
- [ ] Service Worker для caching

---

## 🎯 Быстрые улучшения

### 1. Добавить will-change для анимаций:
```css
/* В globals.css */
.group.hover\:scale-105 {
  will-change: transform;
}

.animate-gradient {
  will-change: background-position;
}
```

### 2. Preload критичных ресурсов:
```html
<!-- В app/layout.tsx -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

### 3. Lazy load невидимых секций:
```tsx
// Уже реализовано через ScrollAnimation
// Компоненты не рендерятся до появления в viewport
```

---

## 📊 Результаты

После оптимизаций ожидается:
- **Lighthouse Performance:** 90-95
- **FPS:** 60fps стабильно
- **CLS:** < 0.1
- **LCP:** < 2.5s

---

**Last Updated:** 2025-01-26

