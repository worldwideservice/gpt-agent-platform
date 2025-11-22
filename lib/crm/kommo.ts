import { logger } from '@/lib/utils/logger'

/**
 * Kommo CRM API Integration
 * Документация: https://www.amocrm.ru/developers/content/crm_platform/platform-abilities
 */

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export interface KommoConfig {
 domain: string
 clientId: string
 clientSecret: string
 redirectUri: string
 accessToken?: string
 refreshToken?: string | null
}

export interface KommoLead {
 id?: number
 name: string
 price?: number
 status_id?: number
 pipeline_id?: number
 responsible_user_id?: number
 custom_fields_values?: Array<{
 field_id: number
 values: Array<{ value: string }>
 }>
 _embedded?: {
 contacts?: Array<{ id: number }>
 companies?: Array<{ id: number }>
 }
}

export interface KommoContact {
 id?: number
 name: string
 first_name?: string
 last_name?: string
 custom_fields_values?: Array<{
 field_id: number
 field_name?: string
 values: Array<{
 value: string
 enum_id?: number
 enum_code?: string
 }>
 }>
}

export interface KommoTask {
 id?: number
 text: string
 complete_till: number // timestamp
 task_type_id: number
 responsible_user_id: number
 entity_id: number
 entity_type: 'leads' | 'contacts' | 'companies'
 created_by?: number
 updated_by?: number
 created_at?: number
 updated_at?: number
 is_completed?: boolean
}

export interface KommoEmailMessage {
 from?: string
 to: string
 subject: string
 html: string
 text?: string
 reply_to?: string
 cc?: string[]
 bcc?: string[]
 attachments?: Array<{
 file_name: string
 content: string // base64
 content_type: string
 }>
}

export interface KommoNote {
 id?: number
 entity_id: number
 entity_type: 'leads' | 'contacts' | 'companies'
 note_type: 'common' | 'call_in' | 'call_out' | 'meeting' | 'mail_message' | 'sms_in' | 'sms_out' | 'whatsapp_message'
 params: {
 text?: string
 html?: string
 subject?: string
 from?: string
 to?: string
 status?: number
 duration?: number
 source?: string
 link?: string
 phone?: string
 uniq?: string
 }
 created_by?: number
 updated_by?: number
 created_at?: number
 updated_at?: number
}

export interface KommoCustomField {
 id?: number
 name: string
 type: 'text' | 'numeric' | 'checkbox' | 'select' | 'multiselect' | 'date' | 'url' | 'textarea' | 'radiobutton' | 'streetaddress' | 'smart_address' | 'birthday' | 'legal_entity' | 'items' | 'org_legal_name' | 'linked_entity'
 element_type: 'contact' | 'lead' | 'company' | 'task'
 sort?: number
 code?: string
 is_required?: boolean
 is_deletable?: boolean
 is_visible?: boolean
 is_api_only?: boolean
 enums?: Record<string, string>
 nested?: Array<{
 id: number
 name: string
 sort: number
 }>
}

export class KommoAPI {
  private config: KommoConfig
  private baseUrl: string
  private isDemoMode: boolean

  constructor(config: KommoConfig) {
    this.config = config
    this.isDemoMode = isDemoEnvironment()
 // Используем правильный формат: subdomain.kommo.com для API вызовов
 // Если domain уже содержит полный URL, используем его, иначе формируем из subdomain
 let apiDomain: string
 if (config.domain.includes('http://') || config.domain.includes('https://')) {
 apiDomain = config.domain.replace(/^https?:\/\//, '').replace(/\/api\/v4.*$/, '')
 } else if (config.domain.includes('.kommo.com') || config.domain.includes('.amocrm.ru')) {
 apiDomain = config.domain
 } else {
 // Используем формат subdomain.kommo.com (новый формат Kommo)
 apiDomain = `${config.domain}.kommo.com`
 }
 this.baseUrl = `https://${apiDomain}/api/v4`
 }

 /**
 * Получить базовый URL API (для отладки и тестирования)
 */
 public getBaseUrl(): string {
 return this.baseUrl
 }

  /**
   * Получить конфигурацию API (копия для безопасности)
   */
  public getConfig(): KommoConfig {
    return { ...this.config }
  }

  private demoTimestamp(): number {
    return Date.now()
  }

 /**
 * Получение access token через OAuth
 */
 async getAccessToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
 const response = await fetch(`https://${this.config.domain}.amocrm.ru/oauth2/access_token`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 client_id: this.config.clientId,
 client_secret: this.config.clientSecret,
 grant_type: 'authorization_code',
 code,
 redirect_uri: this.config.redirectUri,
 }),
 })

 if (!response.ok) {
 throw new Error(`Kommo API Error: ${response.statusText}`)
 }

 return response.json()
 }

 /**
 * Обновление access token
 */
 async refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }> {
 if (!this.config.refreshToken) {
 throw new Error('Refresh token not provided')
 }

 const response = await fetch(`https://${this.config.domain}.amocrm.ru/oauth2/access_token`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 client_id: this.config.clientId,
 client_secret: this.config.clientSecret,
 grant_type: 'refresh_token',
 refresh_token: this.config.refreshToken,
 redirect_uri: this.config.redirectUri,
 }),
 })

 if (!response.ok) {
 throw new Error(`Kommo API Error: ${response.statusText}`)
 }

 const data = await response.json()
 this.config.accessToken = data.access_token
 this.config.refreshToken = data.refresh_token

 return data
 }

 /**
 * Выполнение запроса к API
 */
 private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
 if (!this.config.accessToken) {
 throw new Error('Access token not provided')
 }

 const response = await fetch(`${this.baseUrl}${endpoint}`, {
 ...options,
 headers: {
 'Authorization': `Bearer ${this.config.accessToken}`,
 'Content-Type': 'application/json',
 ...options.headers,
 },
 })

 if (response.status === 401) {
 // Token expired, try to refresh if refresh token is available
 if (this.config.refreshToken) {
 await this.refreshAccessToken()
 return this.request<T>(endpoint, options)
 } else {
 throw new Error('Access token expired and no refresh token available')
 }
 }

 if (!response.ok) {
 const error = await response.json().catch(() => ({ message: response.statusText }))
 throw new Error(`Kommo API Error: ${error.message || response.statusText}`)
 }

 return response.json()
 }

 /**
 * Создание сделки
 */
  async createLead(lead: KommoLead): Promise<KommoLead> {
    if (this.isDemoMode) {
      return {
        id: Number(this.demoTimestamp()),
        ...lead,
      }
    }

    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>('/leads', {
      method: 'POST',
      body: JSON.stringify([lead]),
    })

    return response._embedded.leads[0]
  }

 /**
 * Обновление сделки
 */
  async updateLead(leadId: number, lead: Partial<KommoLead>): Promise<KommoLead> {
    if (this.isDemoMode) {
      return {
        id: leadId,
        ...lead,
      } as KommoLead
    }

    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>('/leads', {
      method: 'PATCH',
      body: JSON.stringify([{ id: leadId, ...lead }]),
    })

    return response._embedded.leads[0]
  }

 /**
 * Поиск сделок
 */
 async searchLeads(query: string): Promise<KommoLead[]> {
 const response = await this.request<{ _embedded: { leads: KommoLead[] } }>(
 `/leads?query=${encodeURIComponent(query)}`
 )

 return response._embedded?.leads || []
 }

 /**
 * Создание контакта
 */
 async createContact(contact: KommoContact): Promise<KommoContact> {
 const response = await this.request<{ _embedded: { contacts: KommoContact[] } }>('/contacts', {
 method: 'POST',
 body: JSON.stringify([contact]),
 })

 return response._embedded.contacts[0]
 }

 /**
 * Обновление контакта
 */
 async updateContact(contactId: number, contact: Partial<KommoContact>): Promise<KommoContact> {
 const response = await this.request<{ _embedded: { contacts: KommoContact[] } }>('/contacts', {
 method: 'PATCH',
 body: JSON.stringify([{ id: contactId, ...contact }]),
 })

 return response._embedded.contacts[0]
 }

 /**
 * Получение контакта
 */
 async getContact(contactId: number): Promise<KommoContact> {
 return this.request<KommoContact>(`/contacts/${contactId}`)
 }

 /**
 * Поиск контактов
 */
 async searchContacts(query: string): Promise<KommoContact[]> {
 const response = await this.request<{ _embedded: { contacts: KommoContact[] } }>(
 `/contacts?query=${encodeURIComponent(query)}`
 )

 return response._embedded?.contacts || []
 }

 /**
 * Добавление примечания к сделке
 */
  async addNoteToLead(
    leadId: number,
    note: { note_type: string; params: { text: string } }
  ): Promise<unknown> {
    if (this.isDemoMode) {
      return Promise.resolve({
        id: Number(this.demoTimestamp()),
        entity_id: leadId,
        entity_type: 'leads',
        note_type: note.note_type,
        params: note.params,
      } as KommoNote)
    }

    return this.request(`/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify([{
        entity_id: leadId,
 ...note,
 }]),
 })
 }

 /**
 * Получение воронок продаж
 */
 async getPipelines(): Promise<Array<{
 id: number
 name: string
 _embedded: {
 statuses: Array<{
 id: number
 name: string
 sort: number
 }>
 }
 }>> {
 if (this.isDemoMode) {
 return [{
 id: 1,
 name: 'Основная воронка продаж',
 _embedded: {
 statuses: [
 { id: 142, name: 'Первичный контакт', sort: 1 },
 { id: 143, name: 'Переговоры', sort: 2 },
 { id: 144, name: 'Сделка заключена', sort: 3 },
 { id: 145, name: 'Отказ', sort: 4 }
 ]
 }
 }, {
 id: 2,
 name: 'Техническая поддержка',
 _embedded: {
 statuses: [
 { id: 146, name: 'Новая заявка', sort: 1 },
 { id: 147, name: 'В работе', sort: 2 },
 { id: 148, name: 'Решена', sort: 3 }
 ]
 }
 }];
 }

 const response = await this.request<{
 _embedded: {
 pipelines: Array<{
 id: number
 name: string
 _embedded: {
 statuses: Array<{
 id: number
 name: string
 sort: number
 }>
 }
 }>
 }
 }>('/leads/pipelines')

 return response._embedded.pipelines
 }

 /**
 * Получение пользователей
 */
 /**
  * Получение сделки по ID
  */
 async getLead(leadId: number): Promise<KommoLead> {
  if (this.isDemoMode) {
   return {
    id: leadId,
    name: `Демо сделка ${leadId}`,
    price: 50000,
    status_id: 142,
    pipeline_id: 1,
   }
  }

  const response = await this.request<{
   _embedded: {
    leads: KommoLead[]
   }
  }>(`/leads?id=${leadId}`)

  const lead = response._embedded?.leads?.[0]

  if (!lead) {
   throw new Error(`Lead ${leadId} not found`)
  }

  return lead
 }

 async getLeads(): Promise<Array<{
  id: number
  name: string
  price: number
  status_id: number
 }>> {
  if (this.isDemoMode) {
   return [{
    id: 1,
    name: 'Демо сделка 1 - Консультация',
    price: 50000,
    status_id: 142
   }, {
    id: 2,
    name: 'Демо сделка 2 - Разработка сайта',
    price: 150000,
    status_id: 143
   }, {
    id: 3,
    name: 'Демо сделка 3 - Техническая поддержка',
    price: 25000,
    status_id: 142
   }, {
    id: 4,
    name: 'Демо сделка 4 - Аудит системы',
    price: 75000,
    status_id: 144
   }];
  }

  const response = await this.request<{
   _embedded: {
    leads: KommoLead[]
   }
  }>(
   '/leads?limit=10'
  )

  return response._embedded?.leads?.map(lead => ({
   id: lead.id || 0,
   name: lead.name,
   price: lead.price || 0,
   status_id: lead.status_id || 0
  })) || []
 }

 async getUsers(): Promise<Array<{
 id: number
 name: string
 email: string
 lang: string
 }>> {
 if (this.isDemoMode) {
 return [{
 id: 12760383,
 name: 'Admin',
 email: 'admin@worldwideservice.eu',
 lang: 'en'
 }];
 }

 const response = await this.request<{
 _embedded: {
 users: Array<{
 id: number
 name: string
 email: string
 lang: string
 }>
 }
 }>('/users')

 return response._embedded.users
 }

  /**
   * Создание задачи
   */
  async createTask(task: Omit<KommoTask, 'id' | 'created_at' | 'updated_at'>): Promise<KommoTask> {
    if (this.isDemoMode) {
      return {
        ...task,
        id: Number(this.demoTimestamp()),
      }
    }

    const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>('/tasks', {
      method: 'POST',
      body: JSON.stringify([task]),
    })

    return response._embedded.tasks[0]
  }

 /**
 * Обновление задачи
 */
  async updateTask(taskId: number, task: Partial<KommoTask>): Promise<KommoTask> {
    if (this.isDemoMode) {
      return {
        id: taskId,
        ...task,
      } as KommoTask
    }

    const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>('/tasks', {
      method: 'PATCH',
      body: JSON.stringify([{ id: taskId, ...task }]),
    })

    return response._embedded.tasks[0]
  }

 /**
 * Получение задач по сущности
 */
 async getTasksByEntity(entityId: number, entityType: 'leads' | 'contacts' | 'companies'): Promise<KommoTask[]> {
 const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>(
 `/tasks?filter[entity_id]=${entityId}&filter[entity_type]=${entityType}`
 )

 return response._embedded?.tasks || []
 }

 /**
 * Создание заметки
 */
 async createNote(note: Omit<KommoNote, 'id' | 'created_at' | 'updated_at'>): Promise<KommoNote> {
 const response = await this.request<{ _embedded: { notes: KommoNote[] } }>(
 `/${note.entity_type}/${note.entity_id}/notes`,
 {
 method: 'POST',
 body: JSON.stringify([note]),
 }
 )

 return response._embedded.notes[0]
 }

 /**
 * Получение заметок по сущности
 */
 async getNotesByEntity(entityId: number, entityType: 'leads' | 'contacts' | 'companies'): Promise<KommoNote[]> {
 const response = await this.request<{ _embedded: { notes: KommoNote[] } }>(
 `/${entityType}/${entityId}/notes`
 )

 return response._embedded?.notes || []
 }

 /**
 * Отправка email через сделку
 */
 async sendEmailFromLead(leadId: number, emailData: {
 to: string[]
 subject: string
 html: string
 text?: string
 from?: string
 cc?: string[]
 bcc?: string[]
 }): Promise<unknown> {
 const note: Omit<KommoNote, 'id' | 'created_at' | 'updated_at'> = {
 entity_id: leadId,
 entity_type: 'leads',
 note_type: 'mail_message',
 params: {
 html: emailData.html,
 text: emailData.text || '',
 subject: emailData.subject,
 from: emailData.from || 'noreply@domain.com',
 to: emailData.to.join(', '),
 status: 1, // отправлено
 }
 }

 return this.createNote(note)
 }

 /**
 * Создание звонка/встречи
 */
 async createCallNote(
 entityId: number,
 entityType: 'leads' | 'contacts' | 'companies',
 callData: {
 phone: string
 duration?: number
 direction: 'in' | 'out'
 status: 'success' | 'failed' | 'busy' | 'no_answer'
 text?: string
 }
 ): Promise<KommoNote> {
 const noteType = callData.direction === 'in' ? 'call_in' : 'call_out'

 const note: Omit<KommoNote, 'id' | 'created_at' | 'updated_at'> = {
 entity_id: entityId,
 entity_type: entityType,
 note_type: noteType,
 params: {
 text: callData.text || `Звонок ${callData.direction === 'in' ? 'входящий' : 'исходящий'}`,
 phone: callData.phone,
 duration: callData.duration || 0,
 uniq: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
 }
 }

 return this.createNote(note)
 }

 /**
 * Создание встречи
 */
 async createMeetingNote(
 entityId: number,
 entityType: 'leads' | 'contacts' | 'companies',
 meetingData: {
 text: string
 date: string // ISO date string
 duration?: number
 }
 ): Promise<KommoNote> {
 const note: Omit<KommoNote, 'id' | 'created_at' | 'updated_at'> = {
 entity_id: entityId,
 entity_type: entityType,
 note_type: 'meeting',
 params: {
 text: meetingData.text,
 uniq: `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
 }
 }

 return this.createNote(note)
 }

 /**
 * Получение кастомных полей
 * @deprecated Используйте getCustomFieldsByEntity для получения полей по типу сущности
 */
 async getCustomFields(): Promise<KommoCustomField[]> {
 const response = await this.request<{ _embedded: { custom_fields: KommoCustomField[] } }>(
 '/custom_fields'
 )

 return response._embedded?.custom_fields || []
 }

 /**
 * Получение кастомных полей по типу сущности
 */
 async getCustomFieldsByEntity(entityType: 'leads' | 'contacts' | 'companies' | 'customers'): Promise<KommoCustomField[]> {
 if (this.isDemoMode) {
 return this.getDemoCustomFields(entityType)
 }

 const response = await this.request<{ _embedded: { custom_fields: KommoCustomField[] } }>(
 `/${entityType}/custom_fields`
 )

 return response._embedded?.custom_fields || []
 }

 /**
 * Получение всех кастомных полей для всех типов сущностей
 */
 async getAllCustomFields(): Promise<{
 leads: KommoCustomField[]
 contacts: KommoCustomField[]
 companies: KommoCustomField[]
 customers: KommoCustomField[]
 }> {
 const [leads, contacts, companies, customers] = await Promise.all([
 this.getCustomFieldsByEntity('leads'),
 this.getCustomFieldsByEntity('contacts'),
 this.getCustomFieldsByEntity('companies'),
 this.getCustomFieldsByEntity('customers'),
 ])

 return { leads, contacts, companies, customers }
 }

 /**
 * Демо-данные кастомных полей для режима демо
 */
 private getDemoCustomFields(entityType: 'leads' | 'contacts' | 'companies' | 'customers'): KommoCustomField[] {
 const commonFields: KommoCustomField[] = [
 {
 id: 1,
 name: 'Телефон',
 type: 'text',
 element_type: entityType.slice(0, -1) as 'lead' | 'contact' | 'company',
 code: 'PHONE',
 is_required: false,
 is_deletable: false,
 is_visible: true,
 is_api_only: false,
 sort: 1
 },
 {
 id: 2,
 name: 'Email',
 type: 'text',
 element_type: entityType.slice(0, -1) as 'lead' | 'contact' | 'company',
 code: 'EMAIL',
 is_required: false,
 is_deletable: false,
 is_visible: true,
 is_api_only: false,
 sort: 2
 }
 ]

 if (entityType === 'leads') {
 return [
 ...commonFields,
 {
 id: 10,
 name: 'Источник',
 type: 'select',
 element_type: 'lead',
 is_required: false,
 is_deletable: true,
 is_visible: true,
 is_api_only: false,
 sort: 3,
 enums: {
 '100': 'Сайт',
 '101': 'Реклама',
 '102': 'Рекомендация'
 }
 },
 {
 id: 11,
 name: 'Бюджет',
 type: 'numeric',
 element_type: 'lead',
 is_required: false,
 is_deletable: true,
 is_visible: true,
 is_api_only: false,
 sort: 4
 }
 ]
 }

 if (entityType === 'contacts') {
 return [
 ...commonFields,
 {
 id: 20,
 name: 'Должность',
 type: 'text',
 element_type: 'contact',
 is_required: false,
 is_deletable: true,
 is_visible: true,
 is_api_only: false,
 sort: 3
 },
 {
 id: 21,
 name: 'Дата рождения',
 type: 'birthday',
 element_type: 'contact',
 is_required: false,
 is_deletable: true,
 is_visible: true,
 is_api_only: false,
 sort: 4
 }
 ]
 }

 return commonFields
 }

 /**
 * Создание кастомного поля
 */
 async createCustomField(field: Omit<KommoCustomField, 'id'>): Promise<KommoCustomField> {
 const response = await this.request<{ _embedded: { custom_fields: KommoCustomField[] } }>(
 '/custom_fields',
 {
 method: 'POST',
 body: JSON.stringify([field]),
 }
 )

 return response._embedded.custom_fields[0]
 }

 /**
 * Получение шаблонов писем (если поддерживается)
 */
 async getEmailTemplates(): Promise<Array<{
 id: number
 name: string
 subject: string
 html: string
 text?: string
 }>> {
 // В Kommo могут быть шаблоны через настройки
 // Пока возвращаем пустой массив, можно расширить позже
 return []
 }

 /**
 * Получение статистики по сделкам
 */
 async getLeadsStats(): Promise<{
 total: number
 by_status: Record<number, number>
 by_pipeline: Record<number, number>
 }> {
 if (this.isDemoMode) {
 return {
 total: 4,
 by_status: { 142: 2, 143: 1, 144: 1 },
 by_pipeline: { 1: 3, 2: 1 }
 };
 }

 const leads = await this.request<{ _embedded: { leads: KommoLead[] } }>(
 '/leads?limit=500'
 )

 const stats = {
 total: leads._embedded?.leads?.length || 0,
 by_status: {} as Record<number, number>,
 by_pipeline: {} as Record<number, number>,
 }

 leads._embedded?.leads?.forEach(lead => {
 if (lead.status_id) {
 stats.by_status[lead.status_id] = (stats.by_status[lead.status_id] || 0) + 1
 }
 if (lead.pipeline_id) {
 stats.by_pipeline[lead.pipeline_id] = (stats.by_pipeline[lead.pipeline_id] || 0) + 1
 }
 })

 return stats
 }

 /**
  * Webhook для входящих событий от Kommo
  * Поддерживает все типы событий: leads, contacts, tasks, messages, calls, customers, companies
  */
 static parseWebhook(payload: Record<string, unknown>): {
 type: string
 data: unknown
 } {
 // Kommo отправляет события в разных форматах:
 // 1. { leads: { status: [{ id, status_id, ... }] } }
 // 2. { tasks: { add: [{ id, entity_id, entity_type, ... }] } }
 // 3. { messages: [{ id, entity_id, ... }] }
 // 4. { calls: [{ id, entity_id, ... }] }
 // 5. { account: { base_domain: '...' }, leads: {...} } - с метаданными аккаунта
   
 // Ищем тип события в ключах payload
 const eventTypes = ['leads', 'contacts', 'customers', 'tasks', 'messages', 'calls', 'companies']
 const eventType = Object.keys(payload).find(key => eventTypes.includes(key))

 if (!eventType) {
 // Если тип не найден, пробуем определить по структуре
    logger.warn('Unknown webhook event format', { keys: Object.keys(payload) })
 return {
   type: 'unknown',
   data: payload,
 }
 }

 const eventData = payload[eventType]

 return {
 type: eventType,
 data: eventData,
 }
 }
}

/**
 * Доступные действия в Kommo CRM для автоматизации
 */
export interface KommoAction {
 code: string
 name: string
 description: string
 entityTypes: Array<'lead' | 'contact' | 'company'>
 requiredParams: string[]
 optionalParams: string[]
}

export const KOMMO_AVAILABLE_ACTIONS: KommoAction[] = [
 {
 code: 'generate_message',
 name: 'Сгенерировать сообщение',
 description: 'Генерирует персонализированное сообщение для клиента',
 entityTypes: ['lead', 'contact'],
 requiredParams: ['text'],
 optionalParams: ['template_id', 'variables']
 },
 {
 code: 'create_task',
 name: 'Создать задачу',
 description: 'Создает задачу для ответственного менеджера',
 entityTypes: ['lead', 'contact', 'company'],
 requiredParams: ['text', 'task_type_id'],
 optionalParams: ['complete_till', 'responsible_user_id']
 },
 {
 code: 'run_salesbot',
 name: 'Запустить Salesbot',
 description: 'Запускает цифрового сотрудника (Salesbot)',
 entityTypes: ['lead'],
 requiredParams: ['salesbot_id'],
 optionalParams: []
 },
 {
 code: 'add_lead_tags',
 name: 'Добавить теги сделки',
 description: 'Добавляет теги к сделке',
 entityTypes: ['lead'],
 requiredParams: ['tags'],
 optionalParams: []
 },
 {
 code: 'add_contact_tags',
 name: 'Добавить теги контакта',
 description: 'Добавляет теги к контакту',
 entityTypes: ['contact'],
 requiredParams: ['tags'],
 optionalParams: []
 },
 {
 code: 'add_lead_note',
 name: 'Добавить примечание к сделке',
 description: 'Добавляет примечание к сделке',
 entityTypes: ['lead'],
 requiredParams: ['text'],
 optionalParams: ['note_type']
 },
 {
 code: 'add_contact_note',
 name: 'Добавить примечание к контакту',
 description: 'Добавляет примечание к контакту',
 entityTypes: ['contact'],
 requiredParams: ['text'],
 optionalParams: ['note_type']
 },
 {
 code: 'change_responsible',
 name: 'Изменить ответственного',
 description: 'Меняет ответственного менеджера',
 entityTypes: ['lead', 'contact', 'company'],
 requiredParams: ['responsible_user_id'],
 optionalParams: []
 },
 {
 code: 'update_field',
 name: 'Обновить поле',
 description: 'Обновляет значение кастомного поля',
 entityTypes: ['lead', 'contact', 'company'],
 requiredParams: ['field_id', 'value'],
 optionalParams: []
 },
 {
 code: 'send_email',
 name: 'Отправить email',
 description: 'Отправляет email клиенту',
 entityTypes: ['lead', 'contact'],
 requiredParams: ['to', 'subject', 'body'],
 optionalParams: ['from', 'cc', 'bcc', 'template_id']
 },
 {
 code: 'change_pipeline_stage',
 name: 'Изменить этап воронки',
 description: 'Перемещает сделку на другой этап',
 entityTypes: ['lead'],
 requiredParams: ['status_id'],
 optionalParams: ['pipeline_id']
 },
 {
 code: 'webhook',
 name: 'Отправить вебхук',
 description: 'Отправляет вебхук на внешний URL',
 entityTypes: ['lead', 'contact', 'company'],
 requiredParams: ['url'],
 optionalParams: ['method', 'headers', 'body']
 }
]

/**
 * Вспомогательные функции для работы с Kommo
 */

export const createLeadFromChat = (
 name: string,
 phone: string,
 email: string,
 message: string
): KommoLead => {
 return {
 name: `Лид из чата: ${name}`,
 price: 0,
 custom_fields_values: [
 {
 field_id: 0, // ID поля телефона (нужно получить из CRM)
 values: [{ value: phone }],
 },
 {
 field_id: 0, // ID поля email
 values: [{ value: email }],
 },
 ],
 }
}

export const createContactFromChat = (
 name: string,
 phone: string,
 email: string
): KommoContact => {
 const [firstName, ...lastNameParts] = name.split(' ')
 
 return {
 name,
 first_name: firstName,
 last_name: lastNameParts.join(' '),
 custom_fields_values: [
 {
 field_id: 0, // ID поля телефона
 values: [{ value: phone }],
 },
 {
 field_id: 0, // ID поля email
 values: [{ value: email }],
 },
 ],
 }
}
