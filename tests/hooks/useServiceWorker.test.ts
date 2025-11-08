import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useServiceWorker } from '@/hooks/useServiceWorker'

describe('useServiceWorker Hook', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Устанавливаем production режим для тестирования
    process.env.NODE_ENV = 'production'
    
    // Мокаем navigator.serviceWorker
    const mockRegister = vi.fn().mockResolvedValue({
      update: vi.fn(),
      unregister: vi.fn(),
      addEventListener: vi.fn(),
    })
    
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: mockRegister,
        ready: Promise.resolve({
          register: vi.fn(),
        }),
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    vi.restoreAllMocks()
  })

  it('should register service worker when available', async () => {
    const { result } = renderHook(() => useServiceWorker())
    
    // Hook должен выполниться без ошибок
    expect(result.current).toBeUndefined()
    
    // Проверяем что serviceWorker.register был вызван (может быть асинхронно)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (navigator.serviceWorker?.register) {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')
    }
  })

  it('should handle service worker registration errors gracefully', async () => {
    const mockRegister = vi.fn().mockRejectedValue(new Error('Registration failed'))
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: mockRegister,
      },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useServiceWorker())
    
    // Hook должен выполниться без ошибок даже при ошибке регистрации
    expect(result.current).toBeUndefined()
    
    await new Promise(resolve => setTimeout(resolve, 100))
  })
})

