import { KommoAPI, KommoLead, KommoContact, KommoTask, KommoNote } from '@/lib/crm/kommo'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface AgentAction {
  type: 'create_lead' | 'update_lead' | 'create_contact' | 'update_contact' | 'create_task' | 'send_email' | 'create_call_note' | 'create_meeting_note' | 'add_note'
  data: Record<string, any>
  entityId?: number
  entityType?: 'leads' | 'contacts' | 'companies'
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  variables: string[]
}

export class KommoActionsService {
  private kommoApi: KommoAPI | null = null
  private organizationId: string

  constructor(organizationId: string) {
    this.organizationId = organizationId
  }

  /**
   * Инициализация Kommo API с учетными данными организации
   */
  async initializeKommoApi(): Promise<boolean> {
    try {
      const supabase = getSupabaseServiceRoleClient()

      // Получаем настройки Kommo для организации
      const { data: settings } = await supabase
        .from('crm_settings')
        .select('*')
        .eq('org_id', this.organizationId)
        .eq('crm_type', 'kommo')
        .single()

      if (!settings?.config) {
        return false
      }

      const config = settings.config as any

      this.kommoApi = new KommoAPI({
        domain: config.domain,
        clientId: config.client_id,
        clientSecret: config.client_secret,
        redirectUri: config.redirect_uri,
        accessToken: config.access_token,
        refreshToken: config.refresh_token,
      })

      return true
    } catch (error) {
      console.error('Failed to initialize Kommo API:', error)
      return false
    }
  }

  /**
   * Выполнение действия агента
   */
  async executeAction(action: AgentAction): Promise<any> {
    if (!this.kommoApi) {
      const initialized = await this.initializeKommoApi()
      if (!initialized) {
        throw new Error('Kommo API не инициализирован')
      }
    }

    switch (action.type) {
      case 'create_lead':
        return this.createLead(action.data)

      case 'update_lead':
        return this.updateLead(action.entityId!, action.data)

      case 'create_contact':
        return this.createContact(action.data)

      case 'update_contact':
        return this.updateContact(action.entityId!, action.data)

      case 'create_task':
        return this.createTask(action.data as any, action.entityId!, action.entityType!)

      case 'send_email':
        return this.sendEmail(action.data as any, action.entityId!)

      case 'create_call_note':
        return this.createCallNote(action.data as any, action.entityId!, action.entityType!)

      case 'create_meeting_note':
        return this.createMeetingNote(action.data as any, action.entityId!, action.entityType!)

      case 'add_note':
        return this.addNote(action.data as any, action.entityId!, action.entityType!)

      default:
        throw new Error(`Неизвестный тип действия: ${action.type}`)
    }
  }

  /**
   * Создание сделки
   */
  private async createLead(data: Record<string, any>): Promise<KommoLead> {
    const lead: KommoLead = {
      name: data.name,
      price: data.price,
      status_id: data.status_id,
      pipeline_id: data.pipeline_id,
      responsible_user_id: data.responsible_user_id,
    }

    // Если есть контактные данные, создаем контакт и связываем
    if (data.contact_name || data.contact_phone || data.contact_email) {
      const contact = await this.createContact({
        name: data.contact_name || 'Новый контакт',
        phone: data.contact_phone,
        email: data.contact_email,
        custom_fields: data.custom_fields,
      })

      lead._embedded = {
        contacts: [{ id: contact.id! }],
      }
    } else {
      // Добавляем кастомные поля только если нет контакта
      if (data.custom_fields) {
        lead.custom_fields_values = Object.entries(data.custom_fields).map(([fieldId, value]) => ({
          field_id: parseInt(fieldId),
          values: [{ value: String(value) }],
        }))
      }
    }

    return this.kommoApi!.createLead(lead)
  }

  /**
   * Обновление сделки
   */
  private async updateLead(leadId: number, data: Partial<KommoLead>): Promise<KommoLead> {
    return this.kommoApi!.updateLead(leadId, data)
  }

  /**
   * Создание контакта
   */
  private async createContact(data: Record<string, any>): Promise<KommoContact> {
    const [firstName, ...lastNameParts] = data.name.split(' ')

    const contact: KommoContact = {
      name: data.name,
      first_name: firstName,
      last_name: lastNameParts.join(' '),
    }

    // Добавляем кастомные поля
    if (data.phone || data.email || data.custom_fields) {
      contact.custom_fields_values = []

      if (data.phone) {
        // Предполагаем, что поле телефона имеет ID 1 (нужно настроить)
        contact.custom_fields_values.push({
          field_id: 1,
          values: [{ value: data.phone }],
        })
      }

      if (data.email) {
        // Предполагаем, что поле email имеет ID 2
        contact.custom_fields_values.push({
          field_id: 2,
          values: [{ value: data.email }],
        })
      }

      if (data.custom_fields) {
        Object.entries(data.custom_fields).forEach(([fieldId, value]) => {
          contact.custom_fields_values!.push({
            field_id: parseInt(fieldId),
            values: [{ value: String(value) }],
          })
        })
      }
    }

    return this.kommoApi!.createContact(contact)
  }

  /**
   * Обновление контакта
   */
  private async updateContact(contactId: number, data: Partial<KommoContact>): Promise<KommoContact> {
    return this.kommoApi!.updateContact(contactId, data)
  }

  /**
   * Создание задачи
   */
  private async createTask(
    data: {
      text: string
      complete_till?: string // ISO date
      task_type_id?: number
      responsible_user_id?: number
    },
    entityId: number,
    entityType: 'leads' | 'contacts' | 'companies'
  ): Promise<KommoTask> {
    const taskData = {
      text: data.text,
      complete_till: data.complete_till ? new Date(data.complete_till).getTime() / 1000 : Date.now() + 86400, // завтра по умолчанию
      task_type_id: data.task_type_id || 1, // звонок по умолчанию
      responsible_user_id: data.responsible_user_id || 0,
      entity_id: entityId,
      entity_type: entityType,
    }

    return this.kommoApi!.createTask(taskData)
  }

  /**
   * Отправка email через сделку
   */
  private async sendEmail(
    data: {
      to: string[]
      subject: string
      html: string
      text?: string
      from?: string
      cc?: string[]
      bcc?: string[]
      template_id?: string
      variables?: Record<string, string>
    },
    leadId: number
  ): Promise<unknown> {
    let html = data.html
    let subject = data.subject

    // Если указан шаблон, загружаем его
    if (data.template_id) {
      const template = await this.getEmailTemplate(data.template_id)
      if (template) {
        html = this.processTemplate(template.html, data.variables || {})
        subject = this.processTemplate(template.subject, data.variables || {})
      }
    }

    return this.kommoApi!.sendEmailFromLead(leadId, {
      to: data.to,
      subject,
      html,
      text: data.text,
      from: data.from,
      cc: data.cc,
      bcc: data.bcc,
    })
  }

  /**
   * Создание заметки о звонке
   */
  private async createCallNote(
    data: {
      phone: string
      duration?: number
      direction: 'in' | 'out'
      status: 'success' | 'failed' | 'busy' | 'no_answer'
      text?: string
    },
    entityId: number,
    entityType: 'leads' | 'contacts' | 'companies'
  ): Promise<KommoNote> {
    return this.kommoApi!.createCallNote(entityId, entityType, data)
  }

  /**
   * Создание заметки о встрече
   */
  private async createMeetingNote(
    data: {
      text: string
      date: string
      duration?: number
    },
    entityId: number,
    entityType: 'leads' | 'contacts' | 'companies'
  ): Promise<KommoNote> {
    return this.kommoApi!.createMeetingNote(entityId, entityType, data)
  }

  /**
   * Добавление обычной заметки
   */
  private async addNote(
    data: {
      text: string
      note_type?: 'common' | 'call_in' | 'call_out' | 'meeting' | 'mail_message'
    },
    entityId: number,
    entityType: 'leads' | 'contacts' | 'companies'
  ): Promise<KommoNote> {
    const note = {
      entity_id: entityId,
      entity_type: entityType,
      note_type: data.note_type || 'common',
      params: {
        text: data.text,
      },
    }

    return this.kommoApi!.createNote(note)
  }

  /**
   * Получение шаблона письма
   */
  private async getEmailTemplate(templateId: string): Promise<EmailTemplate | null> {
    try {
      const supabase = getSupabaseServiceRoleClient()

      const { data } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .eq('org_id', this.organizationId)
        .single()

      return data as EmailTemplate
    } catch (error) {
      console.error('Failed to get email template:', error)
      return null
    }
  }

  /**
   * Обработка шаблона с переменными
   */
  private processTemplate(template: string, variables: Record<string, string>): string {
    let result = template

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, value)
    })

    return result
  }

  /**
   * Получение доступных действий для агента
   */
  getAvailableActions(): Array<{
    type: AgentAction['type']
    name: string
    description: string
    required_fields: string[]
    optional_fields: string[]
  }> {
    return [
      {
        type: 'create_lead',
        name: 'Создать сделку',
        description: 'Создает новую сделку в Kommo',
        required_fields: ['name'],
        optional_fields: ['price', 'status_id', 'pipeline_id', 'responsible_user_id', 'contact_name', 'contact_phone', 'contact_email', 'custom_fields'],
      },
      {
        type: 'update_lead',
        name: 'Обновить сделку',
        description: 'Обновляет существующую сделку',
        required_fields: ['entityId'],
        optional_fields: ['name', 'price', 'status_id', 'pipeline_id', 'responsible_user_id', 'custom_fields_values'],
      },
      {
        type: 'create_contact',
        name: 'Создать контакт',
        description: 'Создает новый контакт',
        required_fields: ['name'],
        optional_fields: ['phone', 'email', 'custom_fields'],
      },
      {
        type: 'update_contact',
        name: 'Обновить контакт',
        description: 'Обновляет существующий контакт',
        required_fields: ['entityId'],
        optional_fields: ['name', 'first_name', 'last_name', 'custom_fields_values'],
      },
      {
        type: 'create_task',
        name: 'Создать задачу',
        description: 'Создает задачу для сущности',
        required_fields: ['entityId', 'entityType', 'text'],
        optional_fields: ['complete_till', 'task_type_id', 'responsible_user_id'],
      },
      {
        type: 'send_email',
        name: 'Отправить email',
        description: 'Отправляет email через сделку',
        required_fields: ['entityId', 'to', 'subject', 'html'],
        optional_fields: ['text', 'from', 'cc', 'bcc', 'template_id', 'variables'],
      },
      {
        type: 'create_call_note',
        name: 'Создать заметку о звонке',
        description: 'Добавляет заметку о звонке',
        required_fields: ['entityId', 'entityType', 'phone', 'direction', 'status'],
        optional_fields: ['duration', 'text'],
      },
      {
        type: 'create_meeting_note',
        name: 'Создать заметку о встрече',
        description: 'Добавляет заметку о встрече',
        required_fields: ['entityId', 'entityType', 'text', 'date'],
        optional_fields: ['duration'],
      },
      {
        type: 'add_note',
        name: 'Добавить заметку',
        description: 'Добавляет обычную заметку',
        required_fields: ['entityId', 'entityType', 'text'],
        optional_fields: ['note_type'],
      },
    ]
  }

  /**
   * Получение информации о сделке для контекста агента
   */
  async getLeadContext(leadId: number): Promise<{
    lead: KommoLead
    contacts: KommoContact[]
    tasks: KommoTask[]
    notes: KommoNote[]
  }> {
    if (!this.kommoApi) {
      await this.initializeKommoApi()
    }

    const [lead, tasks, notes] = await Promise.all([
      this.kommoApi!.getLead(leadId),
      this.kommoApi!.getTasksByEntity(leadId, 'leads'),
      this.kommoApi!.getNotesByEntity(leadId, 'leads'),
    ])

    const contacts: KommoContact[] = []
    if (lead._embedded?.contacts) {
      for (const contactRef of lead._embedded.contacts) {
        try {
          const contact = await this.kommoApi!.getContact(contactRef.id)
          contacts.push(contact)
        } catch (error) {
          console.error(`Failed to load contact ${contactRef.id}:`, error)
        }
      }
    }

    return {
      lead,
      contacts,
      tasks,
      notes,
    }
  }
}
