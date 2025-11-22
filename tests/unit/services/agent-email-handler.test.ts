import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleIncomingEmailForAgent } from '@/lib/services/agent-email-handler'
import type { IncomingEmailData } from '@/lib/services/agent-email-handler'

// Мокаем все зависимости
vi.mock('@/lib/repositories/crm-connection', () => ({
  getCrmConnectionData: vi.fn(),
}))

vi.mock('@/lib/repositories/agent-pipeline-settings', () => ({
  getAgentsForPipelineStage: vi.fn(),
}))

vi.mock('@/lib/repositories/agents', () => ({
  getAgentById: vi.fn(),
}))

vi.mock('@/lib/services/agent-context-builder', () => ({
  buildFullSystemPrompt: vi.fn(),
}))

vi.mock('@/lib/services/llm', () => ({
  generateChatResponse: vi.fn(),
}))

// Мокаем KommoAPI
const mockKommoAPI = {
  getLead: vi.fn(),
  getNotesByEntity: vi.fn(),
  sendEmailFromLead: vi.fn(),
}

vi.mock('@/lib/crm/kommo', () => {
  // Создаем класс-мок для KommoAPI внутри мока
  class MockKommoAPI {
    constructor() {
      return mockKommoAPI
    }
  }
  return {
    KommoAPI: MockKommoAPI,
  }
})

import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { getAgentsForPipelineStage } from '@/lib/repositories/agent-pipeline-settings'
import { getAgentById } from '@/lib/repositories/agents'
import { buildFullSystemPrompt } from '@/lib/services/agent-context-builder'
import { generateChatResponse } from '@/lib/services/llm'
import { KommoAPI } from '@/lib/crm/kommo'

describe('Agent Email Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleIncomingEmailForAgent', () => {
    const mockEmailData: IncomingEmailData = {
      leadId: 123,
      from: 'client@example.com',
      to: 'company@example.com',
      subject: 'Test Email',
      body: 'Test message',
    }

    it('should return error if CRM connection not found', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: null,
        credentials: null,
      })

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('CRM connection not found')
    })

    it('should return error if lead not found', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue(null)

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Lead not found')
    })

    it('should return error if lead has no pipeline or stage', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({
        id: 123,
        pipeline_id: null,
        status_id: null,
      })

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Lead pipeline or stage not found')
    })

    it('should return error if no agents configured for pipeline stage', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({
        id: 123,
        pipeline_id: 1,
        status_id: 2,
      })
      vi.mocked(getAgentsForPipelineStage).mockResolvedValue([])

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('No agents configured for this pipeline stage')
    })

    it('should return error if agent not found or inactive', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({
        id: 123,
        pipeline_id: 1,
        status_id: 2,
      })
      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue(null)

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Agent not found or inactive')
    })

    it('should return error if agent is inactive', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({
        id: 123,
        pipeline_id: 1,
        status_id: 2,
      })
      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        status: 'inactive',
      } as any)

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Agent not found or inactive')
    })

    it('should successfully handle email and generate response', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({ 
        id: 123, 
        name: 'Test Lead',
        pipeline_id: 1,
        status_id: 10,
      } as any)
      mockKommoAPI.getNotesByEntity.mockResolvedValue([]) // Возвращаем пустой массив по умолчанию
      mockKommoAPI.sendEmailFromLead.mockResolvedValue({ success: true } as any)

      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        status: 'active',
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
      } as any)
      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt')
      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'AI response',
      } as any)

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(true)
      expect(result.agentId).toBe('agent-123')
      expect(result.response).toBe('AI response')
      expect(mockKommoAPI.sendEmailFromLead).toHaveBeenCalled()
    })

    it('should handle string leadId', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({ 
        id: 123, 
        name: 'Test Lead',
        pipeline_id: 1,
        status_id: 10,
      } as any)
      mockKommoAPI.getNotesByEntity.mockResolvedValue([]) // Возвращаем пустой массив по умолчанию
      mockKommoAPI.sendEmailFromLead.mockResolvedValue({ success: true } as any)

      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        status: 'active',
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
      } as any)
      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt')
      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'AI response',
      } as any)

      const emailDataWithStringLeadId: IncomingEmailData = {
        ...mockEmailData,
        leadId: '123',
      }

      const result = await handleIncomingEmailForAgent('org-123', emailDataWithStringLeadId)

      expect(result.success).toBe(true)
      expect(mockKommoAPI.getLead).toHaveBeenCalledWith(123)
    })

    it('should handle email notes and format conversation history', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      mockKommoAPI.getLead.mockResolvedValue({
        id: 123,
        pipeline_id: 1,
        status_id: 2,
      })
      mockKommoAPI.getNotesByEntity.mockResolvedValue([
        {
          note_type: 'mail_message',
          params: {
            from: 'client@example.com',
            text: 'Previous message',
          },
        },
        {
          note_type: 'mail_message',
          params: {
            from: 'other@example.com',
            html: '<p>Other message</p>',
          },
        },
      ])
      mockKommoAPI.sendEmailFromLead.mockResolvedValue({})
      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        status: 'active',
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
      } as any)
      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt')
      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'AI response',
      } as any)

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(true)
      expect(buildFullSystemPrompt).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationHistory: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: 'Previous message',
            }),
          ]),
        })
      )
    })

    it('should handle subject with Re: prefix', async () => {
      vi.mocked(getCrmConnectionData).mockResolvedValue({
        connection: {
          id: 'conn-1',
          org_id: 'org-123',
          provider: 'kommo',
          base_domain: 'test.kommo.com',
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          expires_at: null,
        },
        credentials: {
          client_id: 'client-id',
          client_secret: 'secret',
          redirect_uri: null,
        },
      })

      vi.mocked(getAgentsForPipelineStage).mockResolvedValue(['agent-123'])
      vi.mocked(getAgentById).mockResolvedValue({
        id: 'agent-123',
        status: 'active',
        model: 'openai/gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
      } as any)
      vi.mocked(buildFullSystemPrompt).mockResolvedValue('System prompt')
      vi.mocked(generateChatResponse).mockResolvedValue({
        content: 'AI response',
      } as any)

      const emailDataWithRe: IncomingEmailData = {
        ...mockEmailData,
        subject: 'Re: Test Email',
      }

      const result = await handleIncomingEmailForAgent('org-123', emailDataWithRe)

      expect(result.success).toBe(true)
      expect(mockKommoAPI.sendEmailFromLead).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          subject: 'Re: Test Email',
        })
      )
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(getCrmConnectionData).mockRejectedValue(new Error('Database error'))

      const result = await handleIncomingEmailForAgent('org-123', mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })
})

