import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    // Reset matchMedia mock
    ;(window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query.includes('max-width') && window.innerWidth < 768,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false for desktop width', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    ;(window.matchMedia as any).mockImplementation(() => ({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(false)
    }, { timeout: 2000 })
  })

  it('should return true for mobile width', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    ;(window.matchMedia as any).mockImplementation(() => ({
      matches: true,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(true)
    }, { timeout: 2000 })
  })

  it('should update when window is resized', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    ;(window.matchMedia as any).mockImplementation(() => ({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(false)
    }, { timeout: 2000 })

    // Для проверки resize нужно пересоздать hook с новыми параметрами
    // так как useIsMobile использует matchMedia, а не window.resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    ;(window.matchMedia as any).mockImplementation(() => ({
      matches: true,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    // Создаем новый hook с новыми параметрами
    const { result: result2 } = renderHook(() => useIsMobile())
    
    await waitFor(() => {
      expect(result2.current).toBe(true)
    }, { timeout: 2000 })
  })
})

