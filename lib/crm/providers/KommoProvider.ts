import { BaseCRMProvider } from './BaseCRMProvider'
import { kommoConfig, kommoOAuthConfig } from '../config/kommo.config'
import type { 
  UniversalPipeline, 
  UniversalStage, 
  UniversalChannel, 
  UniversalContact, 
  UniversalDeal, 
  UniversalTask,
  CRMConnection 
} from '@/types/crm'
import type { 
  KommoPipeline, 
  KommoStatus, 
  KommoContact, 
  KommoLead, 
  KommoTask,
  KommoApiResponse,
  KommoOAuthResponse 
} from '@/types/kommo'

export class KommoProvider extends BaseCRMProvider {
  constructor(connection: CRMConnection) {
    super(kommoConfig, connection)
  }

  async authenticate(): Promise<CRMConnection> {
    try {
      const authUrl = new URL(kommoOAuthConfig.authUrl)
      authUrl.searchParams.set('client_id', kommoOAuthConfig.clientId)
      authUrl.searchParams.set('redirect_uri', kommoOAuthConfig.redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', kommoOAuthConfig.scope)

      // В реальном приложении здесь будет редирект на OAuth
      // Пока возвращаем mock данные
      return {
        ...this.connection,
        isConnected: true,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: new Date(Date.now() + 3600000) // 1 час
      }
    } catch (error) {
      throw new Error(`Ошибка аутентификации Kommo: ${error}`)
    }
  }

  async refreshToken(): Promise<CRMConnection> {
    try {
      const response = await fetch(kommoOAuthConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.connection.refreshToken || '',
          client_id: kommoOAuthConfig.clientId,
          client_secret: kommoOAuthConfig.clientSecret,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ошибка обновления токена: ${response.statusText}`)
      }

      const data: KommoOAuthResponse = await response.json()
      
      return {
        ...this.connection,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000)
      }
    } catch (error) {
      throw new Error(`Ошибка обновления токена Kommo: ${error}`)
    }
  }

  async getPipelines(): Promise<UniversalPipeline[]> {
    try {
      const response = await this.makeRequest<KommoApiResponse<KommoPipeline>>('/leads/pipelines')
      const pipelines = response._embedded.pipelines || []

      // Получаем статусы для каждой воронки
      const pipelinesWithStages = await Promise.all(
        pipelines.map(async (pipeline) => {
          const stages = await this.getStages(pipeline.id.toString())
          return {
            id: pipeline.id.toString(),
            name: pipeline.name,
            isActive: !pipeline.is_archive,
            stages
          }
        })
      )

      return pipelinesWithStages
    } catch (error) {
      throw new Error(`Ошибка получения воронок Kommo: ${error}`)
    }
  }

  async getStages(pipelineId: string): Promise<UniversalStage[]> {
    try {
      const response = await this.makeRequest<KommoApiResponse<KommoStatus>>(`/leads/pipelines/${pipelineId}/statuses`)
      const statuses = response._embedded.statuses || []

      return statuses.map((status, index) => ({
        id: status.id.toString(),
        name: status.name,
        pipelineId: pipelineId,
        order: status.sort,
        isActive: true
      }))
    } catch (error) {
      throw new Error(`Ошибка получения статусов Kommo: ${error}`)
    }
  }

  async getChannels(): Promise<UniversalChannel[]> {
    try {
      // В Kommo каналы могут быть настроены через custom fields или интеграции
      // Возвращаем базовые каналы
      return [
        {
          id: 'email',
          name: 'Email',
          type: 'email',
          isActive: true
        },
        {
          id: 'phone',
          name: 'Телефон',
          type: 'phone',
          isActive: true
        },
        {
          id: 'chat',
          name: 'Чат',
          type: 'chat',
          isActive: true
        },
        {
          id: 'social',
          name: 'Социальные сети',
          type: 'social',
          isActive: true
        }
      ]
    } catch (error) {
      throw new Error(`Ошибка получения каналов Kommo: ${error}`)
    }
  }

  async getContacts(): Promise<UniversalContact[]> {
    try {
      const response = await this.makeRequest<KommoApiResponse<KommoContact>>('/contacts')
      const contacts = response._embedded.contacts || []

      return contacts.map(contact => ({
        id: contact.id.toString(),
        name: contact.name,
        email: this.getCustomFieldValue(contact.custom_fields_values, 'email'),
        phone: this.getCustomFieldValue(contact.custom_fields_values, 'phone'),
        company: this.getCustomFieldValue(contact.custom_fields_values, 'company'),
        createdAt: new Date(contact.created_at * 1000),
        updatedAt: new Date(contact.updated_at * 1000)
      }))
    } catch (error) {
      throw new Error(`Ошибка получения контактов Kommo: ${error}`)
    }
  }

  async getDeals(): Promise<UniversalDeal[]> {
    try {
      const response = await this.makeRequest<KommoApiResponse<KommoLead>>('/leads')
      const leads = response._embedded.leads || []

      return leads.map(lead => ({
        id: lead.id.toString(),
        name: lead.name,
        pipelineId: lead.pipeline_id.toString(),
        stageId: lead.status_id.toString(),
        contactId: lead.id.toString(), // В Kommo лид может быть контактом
        value: this.getCustomFieldValue(lead.custom_fields_values, 'price'),
        currency: this.getCustomFieldValue(lead.custom_fields_values, 'currency'),
        createdAt: new Date(lead.created_at * 1000),
        updatedAt: new Date(lead.updated_at * 1000)
      }))
    } catch (error) {
      throw new Error(`Ошибка получения сделок Kommo: ${error}`)
    }
  }

  async getTasks(): Promise<UniversalTask[]> {
    try {
      const response = await this.makeRequest<KommoApiResponse<KommoTask>>('/tasks')
      const tasks = response._embedded.tasks || []

      return tasks.map(task => ({
        id: task.id.toString(),
        title: task.text,
        description: task.result?.text,
        dealId: task.entity_type === 'leads' ? task.entity_id.toString() : undefined,
        contactId: task.entity_type === 'contacts' ? task.entity_id.toString() : undefined,
        dueDate: task.complete_till ? new Date(task.complete_till * 1000) : undefined,
        isCompleted: task.is_completed,
        createdAt: new Date(task.created_at * 1000)
      }))
    } catch (error) {
      throw new Error(`Ошибка получения задач Kommo: ${error}`)
    }
  }

  async createTask(task: Omit<UniversalTask, 'id' | 'createdAt'>): Promise<UniversalTask> {
    try {
      const response = await this.makeRequest<KommoTask>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          text: task.title,
          complete_till: task.dueDate ? Math.floor(task.dueDate.getTime() / 1000) : undefined,
          entity_id: task.dealId || task.contactId,
          entity_type: task.dealId ? 'leads' : 'contacts',
          task_type_id: 1 // Базовый тип задачи
        })
      })

      return {
        id: response.id.toString(),
        title: response.text,
        description: response.result?.text,
        dealId: response.entity_type === 'leads' ? response.entity_id.toString() : undefined,
        contactId: response.entity_type === 'contacts' ? response.entity_id.toString() : undefined,
        dueDate: response.complete_till ? new Date(response.complete_till * 1000) : undefined,
        isCompleted: response.is_completed,
        createdAt: new Date(response.created_at * 1000)
      }
    } catch (error) {
      throw new Error(`Ошибка создания задачи Kommo: ${error}`)
    }
  }

  async updateDealStage(dealId: string, stageId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/leads/${dealId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status_id: parseInt(stageId)
        })
      })
      return true
    } catch (error) {
      throw new Error(`Ошибка обновления этапа сделки Kommo: ${error}`)
    }
  }

  // Вспомогательные методы
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.connection.accessToken) {
      throw new Error('Нет токена доступа')
    }

    const url = `${this.config.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.connection.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API ошибка: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private getCustomFieldValue(fields: any[] | undefined, fieldName: string): any {
    if (!fields) return undefined
    
    const field = fields.find(f => f.field_code === fieldName)
    return field?.values?.[0]?.value
  }
}
