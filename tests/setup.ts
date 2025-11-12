import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Мокаем ResizeObserver для тестов
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(callback: ResizeObserverCallback) {}
} as any

// Мокаем IntersectionObserver для тестов
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {}
} as any

// Мокаем scrollIntoView
if (typeof Element !== 'undefined' && Element.prototype) {
  Element.prototype.scrollIntoView = vi.fn()
}

// Мокаем window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Очистка после каждого теста
afterEach(() => {
  cleanup()
})

// Расширяем expect для jest-dom матчеров
expect.extend({
  // Можно добавить кастомные матчеры если нужно
})
