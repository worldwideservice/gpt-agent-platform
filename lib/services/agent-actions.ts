import { KommoActionsService } from './kommo-actions'
import { generateChatResponse } from './llm'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { retryApiCall } from '@/lib/utils/retry'
import { ActivityLogger } from './activity-logger'
import { logger } from '@/lib/utils/logger'

export interface AgentActionContext {
 organizationId: string
 agentId: string
 leadId?: number
 conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
 userMessage: string
 userIntent?: string
 leadContext?: any
}

export interface SuggestedAction {
 type: 'kommo_action' | 'send_message' | 'create_sequence' | 'none'
 confidence: number // 0-1
 reason: string
 data?: any
 kommoAction?: {
 type: string
 data: Record<string, any>
 entityId?: number
 entityType?: 'leads' | 'contacts' | 'companies'
 }
}

export class AgentActionsService {
 private kommoService: KommoActionsService

 constructor(organizationId: string) {
 this.kommoService = new KommoActionsService(organizationId)
 }

 /**
  * Анализирует ситуацию и предлагает действия агента
  */
 async analyzeAndSuggestActions(context: AgentActionContext): Promise<SuggestedAction[]> {
 const suggestions: SuggestedAction[] = []

 try {
   // Получаем контекст сделки если есть leadId (с retry)
   let leadContext = null
   if (context.leadId) {
     try {
       leadContext = await retryApiCall(
         () => this.kommoService.getLeadContext(context.leadId!),
         {
           maxRetries: 2,
           initialDelay: 500,
         }
       )
       if (leadContext?.lead?.name) {
         logger.info('Получен контекст сделки:', leadContext.lead.name)
       }
     } catch (error) {
       logger.error('Failed to fetch lead context (non-critical):', error)
       // Не критично - продолжаем без контекста
     }
   }

   // Анализируем сообщение пользователя для определения намерений (с retry)
   const userIntent = await retryApiCall(
     () => this.analyzeUserIntent(context.userMessage, context.conversationHistory, context.organizationId),
     {
       maxRetries: 2,
       initialDelay: 500,
     }
   ).catch(() => 'other') // Fallback на 'other' если не удалось определить

   // Определяем возможные действия на основе анализа
   const actions = await this.determinePossibleActions({
     ...context,
     userIntent,
     leadContext,
   })

   suggestions.push(...actions)

   // Сортируем по уверенности
   suggestions.sort((a, b) => b.confidence - a.confidence)

 } catch (error) {
   logger.error('Failed to analyze actions:', error)
   
   // Логируем ошибку в Activity Logger
   ActivityLogger.errorOccurred(
     context.organizationId,
     'action_analysis_failed',
     error instanceof Error ? error.message : 'Unknown error',
     { agent_id: context.agentId }
   ).catch(() => {
     // Игнорируем ошибки логирования
   })
 }

 return suggestions
 }

 /**
 * Анализирует намерение пользователя
 */
 private async analyzeUserIntent(
 message: string,
 history: Array<{ role: 'user' | 'assistant'; content: string }>,
 organizationId: string
 ): Promise<string> {
 const prompt = `
Проанализируй сообщение пользователя и определи его основное намерение.
История разговора: ${JSON.stringify(history.slice(-5))}
Текущее сообщение: "${message}"

Определи основное намерение пользователя из следующих вариантов:
- inquiry (запрос информации)
- complaint (жалоба)
- request_callback (просьба перезвонить)
- booking (запись на услугу/встречу)
- payment (вопросы оплаты)
- support (техническая поддержка)
- feedback (отзыв/предложение)
- unsubscribe (отписка)
- other (другое)

Верни только название намерения в нижнем регистре без объяснений.
`

 try {
 const response = await generateChatResponse(organizationId, prompt, {
 model: 'gpt-4',
 temperature: 0.1,
 })

 return response.content.toLowerCase().trim()
 } catch (error) {
 logger.error('Failed to analyze user intent:', error)
 return 'other'
 }
 }

 /**
 * Определяет возможные действия на основе контекста
 */
 private async determinePossibleActions(context: AgentActionContext & {
 userIntent: string
 leadContext?: any
 }): Promise<SuggestedAction[]> {
 const actions: SuggestedAction[] = []

 const { userIntent, leadContext, leadId, organizationId } = context

 // Действия на основе намерения пользователя
 switch (userIntent) {
 case 'request_callback':
 actions.push({
 type: 'kommo_action',
 confidence: 0.9,
 reason: 'Пользователь просит перезвонить',
 kommoAction: {
 type: 'create_task',
 data: {
 text: 'Перезвонить клиенту',
 complete_till: Date.now() / 1000 + 3600, // через час
 task_type_id: 1, // звонок
 responsible_user_id: 0,
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })
 break

 case 'booking':
 actions.push({
 type: 'kommo_action',
 confidence: 0.8,
 reason: 'Пользователь хочет записаться на услугу',
 kommoAction: {
 type: 'create_meeting_note',
 data: {
 text: 'Клиент хочет записаться на услугу',
 date: new Date(Date.now() + 86400000).toISOString(), // завтра
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })
 break

 case 'complaint':
 actions.push({
 type: 'kommo_action',
 confidence: 0.7,
 reason: 'Пользователь выражает недовольство',
 kommoAction: {
 type: 'add_note',
 data: {
 text: `Жалоба клиента: ${context.userMessage}`,
 note_type: 'common',
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })

 // Также создать задачу для обработки жалобы
 actions.push({
 type: 'kommo_action',
 confidence: 0.8,
 reason: 'Необходимо обработать жалобу клиента',
 kommoAction: {
 type: 'create_task',
 data: {
 text: 'Обработать жалобу клиента',
 complete_till: Date.now() / 1000 + 7200, // через 2 часа
 task_type_id: 2, // обработка жалобы
 responsible_user_id: 0,
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })
 break

 case 'payment':
 // Проверить статус оплаты и предложить действия
 if (leadContext?.lead?.price && leadContext.lead.price > 0) {
 actions.push({
 type: 'send_message',
 confidence: 0.6,
 reason: 'Вопросы оплаты - предложить варианты оплаты',
 data: {
 message: 'Я вижу у вас есть неоплаченная сумма. Могу помочь с процессом оплаты или ответить на вопросы.',
 },
 })
 }
 break
 }

 // Общие действия на основе контекста сделки
 if (leadContext) {
 // Если сделка новая и нет контакта
 if (!leadContext.contacts || leadContext.contacts.length === 0) {
 actions.push({
 type: 'kommo_action',
 confidence: 0.5,
 reason: 'У сделки нет привязанного контакта',
 kommoAction: {
 type: 'create_contact',
 data: {
 name: 'Новый контакт из чата',
 // Попробуем извлечь данные из сообщения
 },
 },
 })
 }

 // Если мало активности в сделке
 if (!leadContext.notes || leadContext.notes.length < 2) {
 actions.push({
 type: 'kommo_action',
 confidence: 0.4,
 reason: 'Мало активности в сделке - добавить заметку',
 kommoAction: {
 type: 'add_note',
 data: {
 text: `Активность в чате: ${context.userMessage}`,
 note_type: 'common',
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })
 }
 }

 // Если действий мало, добавить отправку email с информацией
 if (actions.length === 0 && leadContext?.contacts?.[0]?.custom_fields_values) {
 // Найдем email контакт
 const emailField = leadContext.contacts[0].custom_fields_values.find(
 (field: any) => field.field_name?.toLowerCase().includes('email') ||
 field.field_name?.toLowerCase().includes('почта')
 )

 if (emailField?.values?.[0]?.value) {
 actions.push({
 type: 'kommo_action',
 confidence: 0.3,
 reason: 'Отправить информационное письмо клиенту',
 kommoAction: {
 type: 'send_email',
 data: {
 to: [emailField.values[0].value],
 subject: 'Информация по вашему запросу',
 html: `<p>Здравствуйте!</p><p>Спасибо за ваш запрос. Мы обработали ваше сообщение и свяжемся с вами в ближайшее время.</p><p>С уважением,<br>Ваша команда поддержки</p>`,
 text: 'Здравствуйте! Спасибо за ваш запрос. Мы обработали ваше сообщение и свяжемся с вами в ближайшее время.',
 },
 entityId: leadId,
 entityType: 'leads',
 },
 })
 }
 }

 return actions
 }

 /**
  * Выполняет предложенное действие с retry и логированием
  */
 async executeSuggestedAction(action: SuggestedAction, context: AgentActionContext): Promise<any> {
 const startTime = Date.now()
 let result: any = null
 let error: Error | null = null

 try {
   if (action.type === 'kommo_action' && action.kommoAction) {
     // Выполняем с retry для надежности
     result = await retryApiCall(
       () => this.kommoService.executeAction({
         type: action.kommoAction!.type as any,
         data: action.kommoAction!.data,
         entityId: action.kommoAction!.entityId,
         entityType: action.kommoAction!.entityType,
       }),
       {
         maxRetries: 3,
         initialDelay: 1000,
         retryableErrors: [/network/i, /timeout/i, /503/i, /502/i, /500/i],
       }
     )

     // Логируем успешное выполнение действия
     await ActivityLogger.actionExecuted(
       context.organizationId,
       context.agentId,
       action.kommoAction.type,
       {
         entity_id: action.kommoAction.entityId,
         entity_type: action.kommoAction.entityType,
         confidence: action.confidence,
         reason: action.reason,
         duration_ms: Date.now() - startTime,
       }
     ).catch(() => {
       // Игнорируем ошибки логирования
     })

     return result
   }

   if (action.type === 'send_message' && action.data?.message) {
     // Отправить сообщение через существующий чат
     result = { message_sent: true, content: action.data.message }
     
     // Логируем отправку сообщения
     await ActivityLogger.actionExecuted(
       context.organizationId,
       context.agentId,
       'send_message',
       {
         message_length: action.data.message.length,
         duration_ms: Date.now() - startTime,
       }
     ).catch(() => {
       // Игнорируем ошибки логирования
     })

     return result
   }

   result = { executed: true }
   return result
 } catch (err) {
   error = err instanceof Error ? err : new Error(String(err))
   const duration = Date.now() - startTime

   logger.error('Failed to execute suggested action:', error)

   // Логируем ошибку выполнения действия
   await ActivityLogger.errorOccurred(
     context.organizationId,
     'action_execution_failed',
     error.message,
     {
       agent_id: context.agentId,
       action_type: action.type,
       action_data: action.kommoAction || action.data,
       confidence: action.confidence,
       duration_ms: duration,
     }
   ).catch(() => {
     // Игнорируем ошибки логирования
   })

   // Для критичных ошибок выбрасываем дальше
   // Для некритичных - возвращаем информацию об ошибке
   if (action.confidence > 0.8) {
     throw error
   }

   return {
     executed: false,
     error: error.message,
     action_type: action.type,
   }
 }
 }

 /**
 * Получает доступные действия для агента
 */
 getAvailableActions() {
 return this.kommoService.getAvailableActions()
 }
}
