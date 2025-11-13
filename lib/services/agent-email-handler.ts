/**
 * Сервис для автоматической обработки входящих email и генерации ответов агентом
 * Работает в контексте сделок Kommo на определенных этапах воронки
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getAgentsForPipelineStage } from '@/lib/repositories/agent-pipeline-settings'
import { getAgentById } from '@/lib/repositories/agents'
import { buildFullSystemPrompt } from './agent-context-builder'
import { generateChatResponse } from './llm'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { KommoAPI } from '@/lib/crm/kommo'
import { logger } from '@/lib/utils'

export interface IncomingEmailData {
  leadId: string | number
  contactId?: string | number
  from: string // email отправителя
  to: string // email получателя
  subject: string
  body: string // текст письма (HTML или plain text)
  messageId?: string
  threadId?: string
  timestamp?: string
}

export interface AgentEmailResponse {
  success: boolean
  agentId?: string
  response?: string
  error?: string
}

/**
 * Обрабатывает входящее email и генерирует ответ через агента
 */
export const handleIncomingEmailForAgent = async (
  orgId: string,
  emailData: IncomingEmailData
): Promise<AgentEmailResponse> => {
  try {
    // 1. Получаем информацию о сделке из Kommo
    const crmConnection = await getCrmConnectionData(orgId, 'kommo')
    if (!crmConnection.connection) {
      return {
        success: false,
        error: 'CRM connection not found',
      }
    }

    const kommoApi = new KommoAPI({
      domain: crmConnection.connection.base_domain,
      clientId: crmConnection.credentials?.client_id || '',
      clientSecret: '', // Не нужно для чтения
      redirectUri: '',
      accessToken: crmConnection.connection.access_token,
      refreshToken: crmConnection.connection.refresh_token,
    })

    // Получаем информацию о сделке
    const leadId = typeof emailData.leadId === 'string' ? parseInt(emailData.leadId, 10) : emailData.leadId
    const lead = await kommoApi.getLead(leadId)

    if (!lead) {
      return {
        success: false,
        error: 'Lead not found',
      }
    }

    if (!lead.pipeline_id || !lead.status_id) {
      return {
        success: false,
        error: 'Lead pipeline or stage not found',
      }
    }

    const pipelineId = lead.pipeline_id.toString()
    const stageId = lead.status_id.toString()

    // 2. Получаем агентов, настроенных для этого этапа
    const agentIds = await getAgentsForPipelineStage(orgId, pipelineId, stageId)

    if (agentIds.length === 0) {
      logger.info('handleIncomingEmailForAgent: No agents configured for this pipeline stage', { pipelineId, stageId })
      return {
        success: false,
        error: 'No agents configured for this pipeline stage',
      }
    }

    // Используем первого доступного агента (или можно выбрать по приоритету)
    const agentId = agentIds[0]
    const agent = await getAgentById(agentId, orgId)

    if (!agent || agent.status !== 'active') {
      return {
        success: false,
        error: 'Agent not found or inactive',
      }
    }

    // 3. Собираем контекст для агента
    const clientIdentifier = emailData.from // используем email как идентификатор клиента

    // Получаем историю писем из заметок сделки (последние 10)
    const notes = await kommoApi.getNotesByEntity(leadId, 'leads')
    const emailNotes: Array<{ role: 'user' | 'assistant'; content: string }> = notes
      .filter(note => note.note_type === 'mail_message')
      .slice(-10) // последние 10 писем
      .map(note => ({
        role: (note.params?.from === emailData.from ? 'user' : 'assistant') as 'user' | 'assistant',
        content: (typeof note.params?.text === 'string' ? note.params.text : '') || 
                 (typeof note.params?.html === 'string' ? stripHtml(note.params.html) : '') || '',
      }))

    // Формируем системный промпт с полным контекстом
    const systemPrompt = await buildFullSystemPrompt({
      organizationId: orgId,
      agentId,
      pipelineStageId: stageId,
      userMessage: emailData.body,
      conversationHistory: emailNotes,
      clientIdentifier,
      agentInstructions: 'instructions' in agent ? agent.instructions ?? null : null,
    })

    // 4. Генерируем ответ через LLM
    const llmResponse = await generateChatResponse(orgId, emailData.body, {
      model: agent.model || 'openai/gpt-4o-mini',
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      systemPrompt,
      conversationHistory: emailNotes,
    })

    // 5. Отправляем ответ через Kommo API
    const responseSubject = emailData.subject.startsWith('Re:') 
      ? emailData.subject 
      : `Re: ${emailData.subject}`

    await kommoApi.sendEmailFromLead(leadId, {
      to: [emailData.from],
      subject: responseSubject,
      html: formatEmailResponse(llmResponse.content),
      text: llmResponse.content, // plain text версия
    })

    logger.info('handleIncomingEmailForAgent: Agent responded to email', { agentId, from: emailData.from, leadId })

    return {
      success: true,
      agentId,
      response: llmResponse.content,
    }
  } catch (error) {
    logger.error('handleIncomingEmailForAgent: Error handling incoming email for agent', error as Error, { orgId, leadId: emailData.leadId })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Форматирует ответ агента в HTML для email
 */
function formatEmailResponse(text: string): string {
  // Простое форматирование текста в HTML
  // Можно улучшить с помощью markdown-to-html библиотеки
  let html = text
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

  return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>${html}</p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #666;">Это автоматический ответ от AI-агента</p>
  </div>`
}

/**
 * Удаляет HTML теги из текста
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

