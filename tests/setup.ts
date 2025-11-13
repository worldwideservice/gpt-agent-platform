import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

if (typeof (globalThis as any).Element === 'undefined') {
  ;(globalThis as any).Element = class {}
}

if (typeof (globalThis as any).window === 'undefined') {
  ;(globalThis as any).window = globalThis
}

// Базовые значения окружения для Supabase, чтобы сервисы корректно инициализировались в тестах
const supabaseEnvDefaults = {
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
}

for (const [key, value] of Object.entries(supabaseEnvDefaults)) {
  if (!process.env[key]) {
    process.env[key] = value
  }
}

// Простейшая реализация localStorage для Node-окружения
const createStorage = () => {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

if (typeof (globalThis as any).localStorage === 'undefined') {
  const storage = createStorage()
  ;(globalThis as any).localStorage = storage
  if (typeof window !== 'undefined') {
    ;(window as any).localStorage = storage
  }
}

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
