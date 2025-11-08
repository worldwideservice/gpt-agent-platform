import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLoading, useSimpleLoading } from '@/hooks/useLoading'

describe('useLoading Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLoading())
    
    expect(result.current.loadingStates).toEqual({})
    expect(result.current.anyLoading).toBe(false)
  })

  it('should initialize with custom state', () => {
    const { result } = renderHook(() => useLoading({ 'key1': true, 'key2': false }))
    
    expect(result.current.loadingStates).toEqual({ 'key1': true, 'key2': false })
    expect(result.current.anyLoading).toBe(true)
  })

  it('should start loading for a key', () => {
    const { result } = renderHook(() => useLoading())
    
    act(() => {
      result.current.startLoading('test')
    })
    
    expect(result.current.isLoading('test')).toBe(true)
    expect(result.current.anyLoading).toBe(true)
  })

  it('should stop loading for a key', () => {
    const { result } = renderHook(() => useLoading({ 'test': true }))
    
    act(() => {
      result.current.stopLoading('test')
    })
    
    expect(result.current.isLoading('test')).toBe(false)
    expect(result.current.anyLoading).toBe(false)
  })

  it('should execute async function with loading', async () => {
    const { result } = renderHook(() => useLoading())
    const asyncFn = vi.fn().mockResolvedValue('result')
    
    let promise: Promise<string>
    act(() => {
      promise = result.current.withLoading('test', asyncFn)
    })
    
    expect(result.current.isLoading('test')).toBe(true)
    
    const value = await promise!
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(value).toBe('result')
    expect(result.current.isLoading('test')).toBe(false)
    expect(asyncFn).toHaveBeenCalled()
  })

  it('should reset all loading states', () => {
    const { result } = renderHook(() => useLoading({ 'key1': true, 'key2': true }))
    
    act(() => {
      result.current.resetLoading()
    })
    
    expect(result.current.loadingStates).toEqual({})
    expect(result.current.anyLoading).toBe(false)
  })
})

describe('useSimpleLoading Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSimpleLoading())
    
    expect(result.current.isLoading).toBe(false)
  })

  it('should initialize with custom state', () => {
    const { result } = renderHook(() => useSimpleLoading(true))
    
    expect(result.current.isLoading).toBe(true)
  })

  it('should start loading', () => {
    const { result } = renderHook(() => useSimpleLoading())
    
    act(() => {
      result.current.startLoading()
    })
    
    expect(result.current.isLoading).toBe(true)
  })

  it('should stop loading', () => {
    const { result } = renderHook(() => useSimpleLoading(true))
    
    act(() => {
      result.current.stopLoading()
    })
    
    expect(result.current.isLoading).toBe(false)
  })

  it('should execute async function with loading', async () => {
    const { result } = renderHook(() => useSimpleLoading())
    const asyncFn = vi.fn().mockResolvedValue('result')
    
    let promise: Promise<string>
    act(() => {
      promise = result.current.withLoading(asyncFn)
    })
    
    expect(result.current.isLoading).toBe(true)
    
    const value = await promise!
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(value).toBe('result')
    expect(result.current.isLoading).toBe(false)
    expect(asyncFn).toHaveBeenCalled()
  })
})

