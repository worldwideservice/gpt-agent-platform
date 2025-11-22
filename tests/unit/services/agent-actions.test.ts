import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AgentActionsService } from '@/lib/services/agent-actions'

// Мокаем зависимости
vi.mock('@/lib/services/kommo-actions', () => ({
  KommoActionsService: class MockKommoActionsService {
    constructor(organizationId: string) {
      // Mock constructor
    }
    getLeadContext = vi.fn()
    executeAction = vi.fn()
    getAvailableActions = vi.fn()
  },
}))

vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn().mockResolvedValue({
    content: 'inquiry',
  }),
}))

vi.mock('@/lib/utils/retry', () => ({
  retryApiCall: vi.fn((fn) => fn()),
}))

vi.mock('@/lib/services/activity-logger', () => ({
  ActivityLogger: {
    errorOccurred: vi.fn().mockResolvedValue(undefined),
    actionExecuted: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('@/lib/services/sequences', () => ({
  createSequence: vi.fn().mockResolvedValue('seq-123'),
}))

describe('Agent Actions Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AgentActionsService', () => {
    it('should create instance', () => {
      const service = new AgentActionsService('org-123')
      expect(service).toBeDefined()
    })

    describe('analyzeAndSuggestActions', () => {
      it('should suggest actions based on context', async () => {
        const service = new AgentActionsService('org-123')
        const { generateChatResponse } = await import('@/lib/services/llm')
        vi.mocked(generateChatResponse).mockResolvedValue({
          content: 'inquiry',
        } as any)

        const result = await service.analyzeAndSuggestActions({
          organizationId: 'org-123',
          agentId: 'agent-123',
          userMessage: 'Hello',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
      })

      it('should handle lead context when leadId provided', async () => {
        const service = new AgentActionsService('org-123')
        // Мокируем методы экземпляра kommoService через vi.spyOn
        const mockGetLeadContext = vi.fn().mockResolvedValue({
          lead: { name: 'Test Lead' },
        })
        vi.spyOn(service['kommoService'], 'getLeadContext').mockImplementation(mockGetLeadContext)

        const { generateChatResponse } = await import('@/lib/services/llm')
        vi.mocked(generateChatResponse).mockResolvedValue({
          content: 'inquiry',
        } as any)

        const result = await service.analyzeAndSuggestActions({
          organizationId: 'org-123',
          agentId: 'agent-123',
          leadId: 123,
          userMessage: 'Hello',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
      })

      it('should handle errors gracefully', async () => {
        const service = new AgentActionsService('org-123')
        const { generateChatResponse } = await import('@/lib/services/llm')
        vi.mocked(generateChatResponse).mockRejectedValue(new Error('LLM error'))

        const result = await service.analyzeAndSuggestActions({
          organizationId: 'org-123',
          agentId: 'agent-123',
          userMessage: 'Hello',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
      })
    })

    describe('executeSuggestedAction', () => {
      it('should execute kommo action successfully', async () => {
        const service = new AgentActionsService('org-123')
        // Мокируем методы экземпляра kommoService через vi.spyOn
        const mockExecuteAction = vi.fn().mockResolvedValue({ id: 'task-123' })
        vi.spyOn(service['kommoService'], 'executeAction').mockImplementation(mockExecuteAction)

        const { ActivityLogger } = await import('@/lib/services/activity-logger')
        vi.mocked(ActivityLogger.actionExecuted).mockResolvedValue(undefined)

        const action = {
          type: 'kommo_action' as const,
          confidence: 0.9,
          reason: 'Test',
          kommoAction: {
            type: 'create_task',
            data: { text: 'Test task' },
            entityId: 123,
            entityType: 'leads' as const,
          },
        }

        const result = await service.executeSuggestedAction(action, {
          organizationId: 'org-123',
          agentId: 'agent-123',
          userMessage: 'Test',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
        expect(mockExecuteAction).toHaveBeenCalled()
      })

      it('should execute send_message action', async () => {
        const service = new AgentActionsService('org-123')
        const { ActivityLogger } = await import('@/lib/services/activity-logger')
        vi.mocked(ActivityLogger.actionExecuted).mockResolvedValue(undefined)

        const action = {
          type: 'send_message' as const,
          confidence: 0.8,
          reason: 'Test',
          data: {
            message: 'Test message',
          },
        }

        const result = await service.executeSuggestedAction(action, {
          organizationId: 'org-123',
          agentId: 'agent-123',
          userMessage: 'Test',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
        expect(result.message_sent).toBe(true)
      })

      it('should handle errors gracefully for low confidence actions', async () => {
        const service = new AgentActionsService('org-123')
        // Мокируем методы экземпляра kommoService через vi.spyOn
        const mockExecuteAction = vi.fn().mockRejectedValue(new Error('Action failed'))
        vi.spyOn(service['kommoService'], 'executeAction').mockImplementation(mockExecuteAction)

        const { ActivityLogger } = await import('@/lib/services/activity-logger')
        vi.mocked(ActivityLogger.errorOccurred).mockResolvedValue(undefined)

        const action = {
          type: 'kommo_action' as const,
          confidence: 0.5, // низкая уверенность
          reason: 'Test',
          kommoAction: {
            type: 'create_task',
            data: { text: 'Test task' },
            entityId: 123,
            entityType: 'leads' as const,
          },
        }

        const result = await service.executeSuggestedAction(action, {
          organizationId: 'org-123',
          agentId: 'agent-123',
          userMessage: 'Test',
          conversationHistory: [],
        })

        expect(result).toBeDefined()
        expect(result.executed).toBe(false)
      })

      it('should throw error for high confidence failed actions', async () => {
        const service = new AgentActionsService('org-123')
        // Мокируем методы экземпляра kommoService через vi.spyOn
        const mockExecuteAction = vi.fn().mockRejectedValue(new Error('Action failed'))
        vi.spyOn(service['kommoService'], 'executeAction').mockImplementation(mockExecuteAction)

        const { ActivityLogger } = await import('@/lib/services/activity-logger')
        vi.mocked(ActivityLogger.errorOccurred).mockResolvedValue(undefined)

        const action = {
          type: 'kommo_action' as const,
          confidence: 0.9, // высокая уверенность
          reason: 'Test',
          kommoAction: {
            type: 'create_task',
            data: { text: 'Test task' },
            entityId: 123,
            entityType: 'leads' as const,
          },
        }

        await expect(
          service.executeSuggestedAction(action, {
            organizationId: 'org-123',
            agentId: 'agent-123',
            userMessage: 'Test',
            conversationHistory: [],
          })
        ).rejects.toThrow()
      })
    })

    describe('getAvailableActions', () => {
      it('should return available actions from kommo service', () => {
        const service = new AgentActionsService('org-123')
        // Мокируем методы экземпляра kommoService через vi.spyOn
        const mockGetAvailableActions = vi.fn().mockReturnValue(['create_task', 'send_email'])
        vi.spyOn(service['kommoService'], 'getAvailableActions').mockImplementation(mockGetAvailableActions)

        const result = service.getAvailableActions()

        expect(result).toEqual(['create_task', 'send_email'])
      })
    })
  })
})

