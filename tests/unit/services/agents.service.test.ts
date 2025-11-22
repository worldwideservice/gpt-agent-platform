import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetAgents = vi.fn()
const mockCreateAgentRepository = vi.fn()
const mockUpdateAgentRepository = vi.fn()
const mockDeleteAgentRepository = vi.fn()
const mockGetAgentById = vi.fn()

vi.mock('@/lib/repositories/agents', () => ({
  getAgents: mockGetAgents,
  createAgent: mockCreateAgentRepository,
  updateAgent: mockUpdateAgentRepository,
  deleteAgent: mockDeleteAgentRepository,
  getAgentById: mockGetAgentById,
}))

const {
  listAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgent,
  getAgentOrThrow,
} = await import('@/lib/services/agents')

describe('AgentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('требует идентификатор организации для списков', async () => {
    await expect(listAgents('', {} as any)).rejects.toThrow('Требуется идентификатор организации')
  })

  it('валидирует входные параметры и проксирует в репозиторий', async () => {
    mockGetAgents.mockResolvedValueOnce({ agents: [], total: 0 })

    await listAgents('org-1', { limit: 10, status: 'active' })

    expect(mockGetAgents).toHaveBeenCalledWith({
      organizationId: 'org-1',
      search: undefined,
      status: 'active',
      page: undefined,
      limit: 10,
    })
  })

  it('оборачивает ошибки чтения списка', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetAgents.mockRejectedValueOnce(new Error('fail'))

    await expect(listAgents('org-1')).rejects.toThrow('Не удалось получить список агентов')
    consoleSpy.mockRestore()
  })

  it('создаёт агента после валидации', async () => {
    const agent = { id: 'a1', name: 'Agent', status: 'draft' }
    mockCreateAgentRepository.mockResolvedValueOnce(agent)

    const result = await createAgent('org-1', {
      name: 'Agent',
      status: 'draft',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 512,
    })

    expect(result).toEqual(agent)
    expect(mockCreateAgentRepository).toHaveBeenCalledWith('org-1', {
      name: 'Agent',
      status: 'draft',
      model: 'gpt-4',
      instructions: undefined,
      temperature: 0.7,
      maxTokens: 512,
      responseDelaySeconds: undefined,
      settings: {},
    })
  })

  it('отклоняет создание с неверными данными', async () => {
    await expect(createAgent('org-1', { name: '' })).rejects.toThrow()
  })

  it('требует идентификатор агента при обновлении', async () => {
    await expect(updateAgent('org-1', '', {})).rejects.toThrow('Требуется идентификатор агента')
  })

  it('обновляет агента и проксирует только разрешённые поля', async () => {
    mockUpdateAgentRepository.mockResolvedValueOnce({ id: 'a1' })

    await updateAgent('org-1', 'a1', {
      name: 'Updated',
      temperature: 1,
      maxTokens: 1024,
    })

    expect(mockUpdateAgentRepository).toHaveBeenCalledWith('a1', 'org-1', {
      name: 'Updated',
      status: undefined,
      model: undefined,
      instructions: undefined,
      temperature: 1,
      maxTokens: 1024,
      responseDelaySeconds: undefined,
      settings: undefined,
    })
  })

  it('делегирует удаление в репозиторий', async () => {
    await deleteAgent('org-1', 'a1')
    expect(mockDeleteAgentRepository).toHaveBeenCalledWith('a1', 'org-1')
  })

  it('получает агента и обрабатывает ошибки', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetAgentById.mockRejectedValueOnce(new Error('fail'))

    await expect(getAgent('org-1', 'a1')).rejects.toThrow('Не удалось получить данные агента')
    consoleSpy.mockRestore()
  })

  it('возвращает null если агент не найден', async () => {
    mockGetAgentById.mockResolvedValueOnce(null)
    await expect(getAgent('org-1', 'missing')).resolves.toBeNull()
  })

  it('бросает исключение, если агент не найден в getAgentOrThrow', async () => {
    mockGetAgentById.mockResolvedValueOnce(null)
    await expect(getAgentOrThrow('org-1', 'missing')).rejects.toThrow('Агент не найден')
  })
})
