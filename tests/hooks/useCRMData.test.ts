import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCRMData } from '@/hooks/useCRMData'

// Мокаем KommoAPI
vi.mock('@/lib/crm/kommo', () => ({
  KommoAPI: vi.fn().mockImplementation(() => ({
    getPipelines: vi.fn().mockResolvedValue([]),
    getChannels: vi.fn().mockResolvedValue([]),
    getContacts: vi.fn().mockResolvedValue([]),
    getDeals: vi.fn().mockResolvedValue([]),
    getTasks: vi.fn().mockResolvedValue([]),
  })),
}))

// Мокаем fetch
global.fetch = vi.fn()

describe('useCRMData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { pipelines: [], stages: [] } }),
    } as Response)
  })

  it('should return initial state when connection is null', () => {
    const { result } = renderHook(() => useCRMData(null))
    
    expect(result.current.isConnected).toBe(false)
    expect(result.current.pipelines).toEqual([])
    expect(result.current.error).toBeNull()
    // isLoading может быть true если идет загрузка fallback данных
  })

  it('should initialize when connection is provided', () => {
    const mockConnection = {
      id: '1',
      provider: 'kommo' as const,
      crmType: 'kommo' as const,
      accessToken: 'token',
      domain: 'test.kommo.com',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'redirect-uri',
      isConnected: true,
    }

    const { result } = renderHook(() => useCRMData(mockConnection))
    
    // Проверяем что хук инициализируется
    expect(result.current.pipelines).toBeDefined()
    expect(result.current.channels).toBeDefined()
    expect(result.current.contacts).toBeDefined()
    expect(result.current.deals).toBeDefined()
    expect(result.current.tasks).toBeDefined()
  })

  it('should provide syncData method', () => {
    const mockConnection: any = {
      id: '1',
      provider: 'kommo',
      crmType: 'kommo',
      accessToken: 'token',
      domain: 'test.kommo.com',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'redirect-uri',
      isConnected: true,
    }

    const { result } = renderHook(() => useCRMData(mockConnection))
    
    // Проверяем что методы доступны
    expect(typeof result.current.syncData).toBe('function')
    expect(typeof result.current.refreshConnection).toBe('function')
    expect(typeof result.current.updateDealStage).toBe('function')
    expect(typeof result.current.createTask).toBe('function')
  })
})
