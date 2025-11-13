import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useServiceWorker } from '@/hooks/useServiceWorker'

describe('useServiceWorker', () => {
  const originalEnv = process.env.NODE_ENV
  const originalNavigator = navigator.serviceWorker
  const originalLocation = window.location
  let confirmSpy: ReturnType<typeof vi.spyOn> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NODE_ENV = 'production'
    confirmSpy = undefined
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    if (confirmSpy) {
      confirmSpy.mockRestore()
    }
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    })
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: originalNavigator,
    })
  })

  it('регистрирует сервис-воркер в production среде', async () => {
    const register = vi.fn().mockResolvedValue({ addEventListener: vi.fn() })
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: { register },
    })

    renderHook(() => useServiceWorker())

    await vi.waitFor(() => {
      expect(register).toHaveBeenCalledWith('/sw.js')
    })
  })

  it('не регистрирует сервис-воркер вне production', async () => {
    process.env.NODE_ENV = 'development'
    const register = vi.fn()
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: { register },
    })

    renderHook(() => useServiceWorker())

    expect(register).not.toHaveBeenCalled()
  })

  it('предлагает обновление и перезагружает страницу при подтверждении', async () => {
    const updateListeners: Array<() => void> = []
    const stateListeners: Array<() => void> = []

    const newWorker = {
      state: 'installing' as const,
      addEventListener: (_event: string, callback: () => void) => {
        stateListeners.push(callback)
      },
    }

    const registration = {
      scope: '/manage',
      installing: newWorker,
      addEventListener: (event: string, callback: () => void) => {
        if (event === 'updatefound') {
          updateListeners.push(callback)
        }
      },
    }

    const register = vi.fn().mockResolvedValue(registration)

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: {
        controller: {},
        register,
      },
    })

    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { reload },
    })

    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderHook(() => useServiceWorker())

    await vi.waitFor(() => {
      expect(register).toHaveBeenCalled()
    })

    expect(updateListeners).toHaveLength(1)

    updateListeners[0]()
    expect(stateListeners).toHaveLength(1)

    stateListeners[0]()

    expect(window.confirm).toHaveBeenCalled()
    expect(reload).toHaveBeenCalled()
  })
})
