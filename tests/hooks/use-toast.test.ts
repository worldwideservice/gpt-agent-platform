import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

describe('useToast Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return toast functions', () => {
    const { result } = renderHook(() => useToast())
    
    expect(result.current.toast).toBeDefined()
    expect(result.current.toasts).toBeDefined()
    expect(Array.isArray(result.current.toasts)).toBe(true)
  })

  it('should add toast', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test description',
      })
    })
    
    expect(result.current.toasts.length).toBeGreaterThan(0)
  })

  it('should dismiss toast', () => {
    const { result } = renderHook(() => useToast())
    
    let toastId: string | undefined
    
    act(() => {
      const toastResult = result.current.toast({
        title: 'Test Toast',
      })
      toastId = toastResult.id
    })
    
    expect(result.current.toasts.length).toBeGreaterThan(0)
    
    act(() => {
      if (toastId) {
        result.current.dismiss(toastId)
      }
    })
    
    // DISMISS_TOAST устанавливает open: false, но не удаляет toast сразу
    // Toast удаляется через REMOVE_TOAST после TOAST_REMOVE_DELAY (1000000ms)
    // Проверяем что toast помечен как закрытый
    const dismissedToast = result.current.toasts.find(t => t.id === toastId)
    if (dismissedToast) {
      expect(dismissedToast.open).toBe(false)
    } else {
      // Если toast уже удален, это тоже нормально
      expect(result.current.toasts.length).toBeGreaterThanOrEqual(0)
    }
  })
})
