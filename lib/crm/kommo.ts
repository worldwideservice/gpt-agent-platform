/**
 * Kommo CRM API Integration
 * Документация: https://www.amocrm.ru/developers/content/crm_platform/platform-abilities
 */

export interface KommoConfig {
  domain: string
  clientId: string
  clientSecret: string
  redirectUri: string
  accessToken?: string
  refreshToken?: string
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

export class KommoAPI {
  private config: KommoConfig
  private baseUrl: string

  constructor(config: KommoConfig) {
    this.config = config
    this.baseUrl = `https://${config.domain}.amocrm.ru/api/v4`
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
      // Token expired, try to refresh
      await this.refreshAccessToken()
      return this.request<T>(endpoint, options)
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
    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>('/leads', {
      method: 'PATCH',
      body: JSON.stringify([{ id: leadId, ...lead }]),
    })

    return response._embedded.leads[0]
  }

  /**
   * Получение сделки
   */
  async getLead(leadId: number): Promise<KommoLead> {
    return this.request<KommoLead>(`/leads/${leadId}?with=contacts,companies`)
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
  async getUsers(): Promise<Array<{
    id: number
    name: string
    email: string
    lang: string
  }>> {
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
   * Webhook для входящих событий от Kommo
   */
  static parseWebhook(payload: Record<string, unknown>): {
    type: string
    data: unknown
  } {
    // Kommo отправляет события в формате:
    // { leads: { status: [{ id, status_id, ... }] } }
    const eventType = Object.keys(payload)[0]
    const eventData = payload[eventType]

    return {
      type: eventType,
      data: eventData,
    }
  }
}

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

