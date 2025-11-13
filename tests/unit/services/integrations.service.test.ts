import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetCrmConnectionData = vi.fn()

vi.mock('@/lib/repositories/crm-connection', () => ({
  getCrmConnectionData: mockGetCrmConnectionData,
}))

const { getIntegrationOverview } = await import('@/lib/services/integrations')

describe('IntegrationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('требует идентификатор организации', async () => {
    await expect(getIntegrationOverview('', {})).rejects.toThrow('Требуется идентификатор организации')
  })

  it('использует kommo по умолчанию и вычисляет флаг connected', async () => {
    mockGetCrmConnectionData.mockResolvedValueOnce({
      connection: { access_token: 'token' },
      credentials: { base_domain: 'demo.kommo.com' },
    })

    const overview = await getIntegrationOverview('org-1')

    expect(mockGetCrmConnectionData).toHaveBeenCalledWith('org-1', 'kommo')
    expect(overview.connected).toBe(true)
    expect(overview.provider).toBe('kommo')
    expect(overview.credentials).toEqual({ base_domain: 'demo.kommo.com' })
  })

  it('поддерживает переопределение провайдера', async () => {
    mockGetCrmConnectionData.mockResolvedValueOnce({ connection: {}, credentials: {} })

    await getIntegrationOverview('org-1', { provider: 'custom' })

    expect(mockGetCrmConnectionData).toHaveBeenCalledWith('org-1', 'custom')
  })

  it('оборачивает ошибки CRM в бизнес-исключение', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetCrmConnectionData.mockRejectedValueOnce(new Error('crm down'))

    await expect(getIntegrationOverview('org-1')).rejects.toThrow('Не удалось загрузить данные интеграции')
    consoleSpy.mockRestore()
  })
})
