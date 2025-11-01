import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'
import { getAgentsForPipelineStage } from '@/lib/repositories/agent-pipeline-settings'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * Webhook endpoint для получения событий от Kommo CRM
 * Настройка в Kommo: Настройки -> Интеграции -> Webhooks
 * 
 * ВАЖНО: Агент обрабатывает события только для воронок и этапов, где он настроен!
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Парсинг события от Kommo
    const event = KommoAPI.parseWebhook(body)

    if (process.env.NODE_ENV === 'development') {
      console.log('Kommo Webhook Event:', event.type, event.data)
    }

    // Обработка различных типов событий
    switch (event.type) {
      case 'leads': {
        // Событие изменения сделки
        await handleLeadEvent(event.data)
        break
      }

      case 'contacts': {
        // Событие изменения контакта
        await handleContactEvent(event.data)
        break
      }

      case 'customers': {
        // Событие изменения покупателя
        await handleCustomerEvent(event.data)
        break
      }

      default:
        if (process.env.NODE_ENV === 'development') {
          console.log('Unknown event type:', event.type)
        }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook Error:', error)
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Обработчики событий

/**
 * Обрабатывает события сделок (leads) от Kommo
 * КРИТИЧНО: Проверяет настройки агентов - обрабатывает только если агент настроен для воронки и этапа!
 */
async function handleLeadEvent(data: unknown) {
  try {
    // Парсим данные события от Kommo
    // Формат: { leads: { status: [{ id, pipeline_id, status_id, ... }] } }
    if (!data || typeof data !== 'object') {
      return
    }

    const leadData = data as Record<string, unknown>
    
    // Kommo отправляет события в разных форматах, обрабатываем основные
    let leads: Array<{
      id?: number
      pipeline_id?: number
      status_id?: number
    }> = []

    // Формат 1: { leads: { status: [{ id, pipeline_id, status_id }] } }
    if ('status' in leadData && Array.isArray(leadData.status)) {
      leads = leadData.status as Array<{ id?: number; pipeline_id?: number; status_id?: number }>
    }
    // Формат 2: { leads: { add: [{ id, pipeline_id, status_id }] } } - создание
    else if ('add' in leadData && Array.isArray(leadData.add)) {
      leads = leadData.add as Array<{ id?: number; pipeline_id?: number; status_id?: number }>
    }
    // Формат 3: { leads: { update: [{ id, pipeline_id, status_id }] } } - обновление
    else if ('update' in leadData && Array.isArray(leadData.update)) {
      leads = leadData.update as Array<{ id?: number; pipeline_id?: number; status_id?: number }>
    }
    // Формат 4: Прямой массив сделок
    else if (Array.isArray(leadData)) {
      leads = leadData
    }

    if (leads.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Lead Event: No leads found in webhook data')
      }
      return
    }

    // Получаем organization_id из данных webhook или определяем по base_domain
    // В реальной реализации это должно приходить из headers или метаданных запроса
    // Пока используем логику определения организации по CRM подключению
    
    const supabase = getSupabaseServiceRoleClient()
    
    // Для каждой сделки находим организации и проверяем настройки агентов
    for (const lead of leads) {
      if (!lead.pipeline_id || !lead.status_id || !lead.id) {
        continue
      }

      const pipelineId = lead.pipeline_id.toString()
      const stageId = lead.status_id.toString()
      const leadId = lead.id

      // Находим все организации, у которых есть активные агенты для этой воронки и этапа
      // Получаем все настройки агентов для этой воронки
      const { data: pipelineSettings, error } = await supabase
        .from('agent_pipeline_settings')
        .select('org_id, agent_id, all_stages, selected_stages')
        .eq('pipeline_id', pipelineId)
        .eq('is_active', true)

      if (error || !pipelineSettings || pipelineSettings.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Lead ${leadId}: No agents configured for pipeline ${pipelineId}`)
        }
        continue
      }

      // Группируем по организациям и проверяем настройки этапов
      const orgAgentMap = new Map<string, string[]>()

      for (const setting of pipelineSettings) {
        const orgId = setting.org_id as string
        const agentId = setting.agent_id as string
        const allStages = setting.all_stages as boolean
        const selectedStages = (setting.selected_stages as string[]) || []

        // Проверяем, должен ли этот агент обработать событие на этом этапе
        let shouldProcess = false

        if (allStages) {
          // Все этапы разрешены
          shouldProcess = true
        } else if (selectedStages.length > 0 && selectedStages.includes(stageId)) {
          // Этап в списке разрешенных
          shouldProcess = true
        }

        if (shouldProcess) {
          if (!orgAgentMap.has(orgId)) {
            orgAgentMap.set(orgId, [])
          }
          orgAgentMap.get(orgId)!.push(agentId)
        }
      }

      // Если нет агентов, настроенных для этого этапа - пропускаем обработку
      if (orgAgentMap.size === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Lead ${leadId}: No agents configured for pipeline ${pipelineId} stage ${stageId} - skipping processing`
          )
        }
        continue
      }

      // Обрабатываем событие для каждой организации с настроенными агентами
      for (const [orgId, agentIds] of orgAgentMap.entries()) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Lead ${leadId}: Processing for org ${orgId} with agents ${agentIds.join(', ')} on pipeline ${pipelineId} stage ${stageId}`
          )
        }

        // Здесь можно:
        // 1. Уведомить AI-агентов об изменении сделки
        // 2. Обновить локальную базу данных
        // 3. Запустить триггеры и автоматизации
        // 4. Отправить уведомления пользователям
        
        // TODO: Реализовать обработку события для каждого агента
        // await processLeadEventForAgents(orgId, agentIds, leadId, pipelineId, stageId)
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error processing lead event:', error)
    }
    // Не выбрасываем ошибку, чтобы не нарушить webhook от Kommo
  }
}

async function handleContactEvent(data: unknown) {
  console.log('Contact Event:', data)
  
  // Обработка событий контакта
  // Синхронизация данных контакта с локальной БД
}

async function handleCustomerEvent(data: unknown) {
  console.log('Customer Event:', data)
  
  // Обработка событий покупателя
}

// Проверка подписи webhook (если настроена в Kommo)
function verifyWebhookSignature(request: NextRequest): boolean {
  const signature = request.headers.get('X-Kommo-Signature')
  const secret = process.env.KOMMO_WEBHOOK_SECRET

  if (!signature || !secret) {
    return false
  }

  // Здесь должна быть логика проверки подписи
  // В зависимости от настроек Kommo
  
  return true
}

