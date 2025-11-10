/**
 * Kommo CRM API Integration
 * Документация: https://www.amocrm.ru/developers/content/crm_platform/platform-abilities
 */

export interface KommoConfig {
  domain: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string | null;
}

export interface KommoLead {
  id?: number;
  name: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  responsible_user_id?: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{ value: string }>;
  }>;
  _embedded?: {
    contacts?: Array<{ id: number }>;
    companies?: Array<{ id: number }>;
  };
}

export interface KommoContact {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  custom_fields_values?: Array<{
    field_id: number;
    field_name?: string;
    values: Array<{
      value: string;
      enum_id?: number;
      enum_code?: string;
    }>;
  }>;
}

export interface KommoTask {
  id?: number;
  text: string;
  complete_till: number; // timestamp
  task_type_id: number;
  responsible_user_id: number;
  entity_id: number;
  entity_type: "leads" | "contacts" | "companies";
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  is_completed?: boolean;
}

export interface KommoEmailMessage {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    file_name: string;
    content: string; // base64
    content_type: string;
  }>;
}

export interface KommoNote {
  id?: number;
  entity_id: number;
  entity_type: "leads" | "contacts" | "companies";
  note_type:
    | "common"
    | "call_in"
    | "call_out"
    | "meeting"
    | "mail_message"
    | "outgoing_email"
    | "incoming_email"
    | "sms_in"
    | "sms_out"
    | "whatsapp_message";
  params: {
    text?: string;
    html?: string;
    subject?: string;
    from?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    status?: number;
    duration?: number;
    source?: string;
    link?: string;
    phone?: string;
    uniq?: string;
    attachments?: Array<{
      url: string;
      name: string;
    }>;
  };
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
}

export interface KommoCompany {
  id?: number;
  name: string;
  responsible_user_id?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: Array<{
    field_id: number;
    field_name?: string;
    values: Array<{
      value: string;
      enum_id?: number;
      enum_code?: string;
    }>;
  }>;
  _embedded?: {
    contacts?: Array<{ id: number; is_main?: boolean }>;
    leads?: Array<{ id: number; is_main?: boolean }>;
    tags?: Array<{ id: number; name: string }>;
  };
}

export interface KommoTag {
  id: number;
  name: string;
  color?: string;
}

export interface KommoAccount {
  id: number;
  name: string;
  subdomain: string;
  created_at: number;
  currency?: string;
  timezone?: string;
  timezone_offset?: number;
}

export interface KommoIncomingLead {
  uid: string;
  source_uid?: string;
  source_type?: "form" | "sip" | "other";
  pipeline_id?: number;
  status_id?: number;
  created_at?: number;
  metadata?: Record<string, unknown>;
}

export interface KommoSource {
  id: number;
  name: string;
  type?: string;
  external_id?: string;
}

export interface KommoTemplate {
  id?: number;
  name: string;
  type: "email" | "sms" | "whatsapp";
  subject?: string;
  text?: string;
  html?: string;
  status?: string;
}

export interface KommoConversation {
  id: number;
  entity_id: number;
  entity_type: "leads" | "contacts" | "companies";
  channel: string;
  status: "open" | "closed";
  messages?: Array<{
    id: number;
    text: string;
    created_at: number;
  }>;
}

export interface KommoEvent {
  id: number;
  type: string;
  entity_id: number;
  entity_type: "leads" | "contacts" | "companies" | "tasks";
  created_at: number;
  user_id?: number;
}

export interface KommoList {
  id?: number;
  name: string;
  type?: string;
  elements?: Array<{
    id: number;
    name: string;
    [key: string]: unknown;
  }>;
}

export interface KommoListElement {
  id?: number;
  name: string;
  [key: string]: unknown;
}

export interface KommoLink {
  to_entity_id: number;
  to_entity_type: "leads" | "contacts" | "companies";
}

export interface KommoRole {
  id?: number;
  name: string;
  rights?: Record<string, unknown>;
}

export interface KommoWidget {
  code: string;
  name: string;
  version?: string;
  settings?: Record<string, unknown>;
}

export interface KommoSalesbotLaunch {
  bot_id: number;
  entity_id: number;
  entity_type: "leads" | "contacts" | "companies";
}

export interface KommoCustomField {
  id?: number;
  name: string;
  type:
    | "text"
    | "numeric"
    | "checkbox"
    | "select"
    | "multiselect"
    | "date"
    | "url"
    | "textarea"
    | "radiobutton"
    | "streetaddress"
    | "smart_address"
    | "birthday"
    | "legal_entity"
    | "items"
    | "org_legal_name"
    | "linked_entity";
  element_type: "contact" | "lead" | "company" | "task";
  sort?: number;
  code?: string;
  is_required?: boolean;
  is_deletable?: boolean;
  is_visible?: boolean;
  is_api_only?: boolean;
  enums?: Record<string, string>;
  nested?: Array<{
    id: number;
    name: string;
    sort: number;
  }>;
}

export class KommoAPI {
  private config: KommoConfig;
  private baseUrl: string;
  private isDemoMode: boolean;

  constructor(config: KommoConfig) {
    this.config = config;
    // Отключаем демо-режим для использования реальных токенов
    this.isDemoMode = false;
    // Используем правильный формат: subdomain.kommo.com для API вызовов
    // Если domain уже содержит полный URL, используем его, иначе формируем из subdomain
    let apiDomain: string;
    if (
      config.domain.includes("http://") ||
      config.domain.includes("https://")
    ) {
      apiDomain = config.domain
        .replace(/^https?:\/\//, "")
        .replace(/\/api\/v4.*$/, "");
    } else if (
      config.domain.includes(".kommo.com") ||
      config.domain.includes(".amocrm.ru")
    ) {
      apiDomain = config.domain;
    } else {
      // Используем формат subdomain.kommo.com (новый формат Kommo)
      apiDomain = `${config.domain}.kommo.com`;
    }
    this.baseUrl = `https://${apiDomain}/api/v4`;
  }

  /**
   * Получить базовый URL API (для отладки и тестирования)
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Получить конфигурацию API (копия для безопасности)
   */
  public getConfig(): KommoConfig {
    return { ...this.config };
  }

  /**
   * Получение access token через OAuth
   */
  async getAccessToken(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const response = await fetch(
      `https://${this.config.domain}.amocrm.ru/oauth2/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: this.config.redirectUri,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Kommo API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Обновление access token
   */
  async refreshAccessToken(): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    if (!this.config.refreshToken) {
      throw new Error("Refresh token not provided");
    }

    const response = await fetch(
      `https://${this.config.domain}.amocrm.ru/oauth2/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "refresh_token",
          refresh_token: this.config.refreshToken,
          redirect_uri: this.config.redirectUri,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Kommo API Error: ${response.statusText}`);
    }

    const data = await response.json();
    this.config.accessToken = data.access_token;
    this.config.refreshToken = data.refresh_token;

    return data;
  }

  /**
   * Выполнение запроса к API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!this.config.accessToken) {
      throw new Error("Access token not provided");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh if refresh token is available
      if (this.config.refreshToken) {
        await this.refreshAccessToken();
        return this.request<T>(endpoint, options);
      } else {
        throw new Error("Access token expired and no refresh token available");
      }
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        `Kommo API Error: ${error.message || response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Создание сделки
   */
  async createLead(lead: KommoLead): Promise<KommoLead> {
    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>(
      "/leads",
      {
        method: "POST",
        body: JSON.stringify([lead]),
      },
    );

    return response._embedded.leads[0];
  }

  /**
   * Обновление сделки
   */
  async updateLead(
    leadId: number,
    lead: Partial<KommoLead>,
  ): Promise<KommoLead> {
    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>(
      "/leads",
      {
        method: "PATCH",
        body: JSON.stringify([{ id: leadId, ...lead }]),
      },
    );

    return response._embedded.leads[0];
  }

  /**
   * Поиск сделок
   */
  async searchLeads(query: string): Promise<KommoLead[]> {
    const response = await this.request<{ _embedded: { leads: KommoLead[] } }>(
      `/leads?query=${encodeURIComponent(query)}`,
    );

    return response._embedded?.leads || [];
  }

  /**
   * Создание контакта
   */
  async createContact(contact: KommoContact): Promise<KommoContact> {
    const response = await this.request<{
      _embedded: { contacts: KommoContact[] };
    }>("/contacts", {
      method: "POST",
      body: JSON.stringify([contact]),
    });

    return response._embedded.contacts[0];
  }

  /**
   * Обновление контакта
   */
  async updateContact(
    contactId: number,
    contact: Partial<KommoContact>,
  ): Promise<KommoContact> {
    const response = await this.request<{
      _embedded: { contacts: KommoContact[] };
    }>("/contacts", {
      method: "PATCH",
      body: JSON.stringify([{ id: contactId, ...contact }]),
    });

    return response._embedded.contacts[0];
  }

  /**
   * Получение контакта
   */
  async getContact(contactId: number): Promise<KommoContact> {
    return this.request<KommoContact>(`/contacts/${contactId}`);
  }

  /**
   * Поиск контактов
   */
  async searchContacts(query: string): Promise<KommoContact[]> {
    const response = await this.request<{
      _embedded: { contacts: KommoContact[] };
    }>(`/contacts?query=${encodeURIComponent(query)}`);

    return response._embedded?.contacts || [];
  }

  /**
   * Добавление примечания к сделке
   */
  async addNoteToLead(
    leadId: number,
    note: { note_type: string; params: { text: string } },
  ): Promise<unknown> {
    return this.request(`/leads/${leadId}/notes`, {
      method: "POST",
      body: JSON.stringify([
        {
          entity_id: leadId,
          ...note,
        },
      ]),
    });
  }

  /**
   * Получение воронок продаж
   */
  async getPipelines(): Promise<
    Array<{
      id: number;
      name: string;
      _embedded: {
        statuses: Array<{
          id: number;
          name: string;
          sort: number;
        }>;
      };
    }>
  > {
    if (this.isDemoMode) {
      return [
        {
          id: 1,
          name: "Основная воронка продаж",
          _embedded: {
            statuses: [
              { id: 142, name: "Первичный контакт", sort: 1 },
              { id: 143, name: "Переговоры", sort: 2 },
              { id: 144, name: "Сделка заключена", sort: 3 },
              { id: 145, name: "Отказ", sort: 4 },
            ],
          },
        },
        {
          id: 2,
          name: "Техническая поддержка",
          _embedded: {
            statuses: [
              { id: 146, name: "Новая заявка", sort: 1 },
              { id: 147, name: "В работе", sort: 2 },
              { id: 148, name: "Решена", sort: 3 },
            ],
          },
        },
      ];
    }

    const response = await this.request<{
      _embedded: {
        pipelines: Array<{
          id: number;
          name: string;
          _embedded: {
            statuses: Array<{
              id: number;
              name: string;
              sort: number;
            }>;
          };
        }>;
      };
    }>("/leads/pipelines");

    return response._embedded.pipelines;
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
      };
    }

    const response = await this.request<{
      _embedded: {
        leads: KommoLead[];
      };
    }>(`/leads?id=${leadId}`);

    const lead = response._embedded?.leads?.[0];

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    return lead;
  }

  async getLeads(): Promise<
    Array<{
      id: number;
      name: string;
      price: number;
      status_id: number;
    }>
  > {
    if (this.isDemoMode) {
      return [
        {
          id: 1,
          name: "Демо сделка 1 - Консультация",
          price: 50000,
          status_id: 142,
        },
        {
          id: 2,
          name: "Демо сделка 2 - Разработка сайта",
          price: 150000,
          status_id: 143,
        },
        {
          id: 3,
          name: "Демо сделка 3 - Техническая поддержка",
          price: 25000,
          status_id: 142,
        },
        {
          id: 4,
          name: "Демо сделка 4 - Аудит системы",
          price: 75000,
          status_id: 144,
        },
      ];
    }

    const response = await this.request<{
      _embedded: {
        leads: KommoLead[];
      };
    }>("/leads?limit=10");

    return (
      response._embedded?.leads?.map((lead) => ({
        id: lead.id || 0,
        name: lead.name,
        price: lead.price || 0,
        status_id: lead.status_id || 0,
      })) || []
    );
  }

  async getUsers(): Promise<
    Array<{
      id: number;
      name: string;
      email: string;
      lang: string;
    }>
  > {
    if (this.isDemoMode) {
      return [
        {
          id: 12760383,
          name: "Admin",
          email: "admin@worldwideservice.eu",
          lang: "en",
        },
      ];
    }

    const response = await this.request<{
      _embedded: {
        users: Array<{
          id: number;
          name: string;
          email: string;
          lang: string;
        }>;
      };
    }>("/users");

    return response._embedded.users;
  }

  /**
   * Создание задачи
   */
  async createTask(
    task: Omit<KommoTask, "id" | "created_at" | "updated_at">,
  ): Promise<KommoTask> {
    const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>(
      "/tasks",
      {
        method: "POST",
        body: JSON.stringify([task]),
      },
    );

    return response._embedded.tasks[0];
  }

  /**
   * Обновление задачи
   */
  async updateTask(
    taskId: number,
    task: Partial<KommoTask>,
  ): Promise<KommoTask> {
    const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>(
      "/tasks",
      {
        method: "PATCH",
        body: JSON.stringify([{ id: taskId, ...task }]),
      },
    );

    return response._embedded.tasks[0];
  }

  /**
   * Получение задач по сущности
   */
  async getTasksByEntity(
    entityId: number,
    entityType: "leads" | "contacts" | "companies",
  ): Promise<KommoTask[]> {
    const response = await this.request<{ _embedded: { tasks: KommoTask[] } }>(
      `/tasks?filter[entity_id]=${entityId}&filter[entity_type]=${entityType}`,
    );

    return response._embedded?.tasks || [];
  }

  /**
   * Создание заметки
   */
  async createNote(
    note: Omit<KommoNote, "id" | "created_at" | "updated_at">,
  ): Promise<KommoNote> {
    const response = await this.request<{ _embedded: { notes: KommoNote[] } }>(
      `/${note.entity_type}/${note.entity_id}/notes`,
      {
        method: "POST",
        body: JSON.stringify([note]),
      },
    );

    return response._embedded.notes[0];
  }

  /**
   * Получение заметок по сущности
   */
  async getNotesByEntity(
    entityId: number,
    entityType: "leads" | "contacts" | "companies",
  ): Promise<KommoNote[]> {
    const response = await this.request<{ _embedded: { notes: KommoNote[] } }>(
      `/${entityType}/${entityId}/notes`,
    );

    return response._embedded?.notes || [];
  }

  /**
   * Отправка email через сделку
   */
  async sendEmailFromLead(
    leadId: number,
    emailData: {
      to: string[];
      subject: string;
      html: string;
      text?: string;
      from?: string;
      cc?: string[];
      bcc?: string[];
    },
  ): Promise<unknown> {
    const note: Omit<KommoNote, "id" | "created_at" | "updated_at"> = {
      entity_id: leadId,
      entity_type: "leads",
      note_type: "mail_message",
      params: {
        html: emailData.html,
        text: emailData.text || "",
        subject: emailData.subject,
        from: emailData.from || "noreply@domain.com",
        to: emailData.to.join(", "),
        status: 1, // отправлено
      },
    };

    return this.createNote(note);
  }

  /**
   * Создание звонка/встречи
   */
  async createCallNote(
    entityId: number,
    entityType: "leads" | "contacts" | "companies",
    callData: {
      phone: string;
      duration?: number;
      direction: "in" | "out";
      status: "success" | "failed" | "busy" | "no_answer";
      text?: string;
    },
  ): Promise<KommoNote> {
    const noteType = callData.direction === "in" ? "call_in" : "call_out";

    const note: Omit<KommoNote, "id" | "created_at" | "updated_at"> = {
      entity_id: entityId,
      entity_type: entityType,
      note_type: noteType,
      params: {
        text:
          callData.text ||
          `Звонок ${callData.direction === "in" ? "входящий" : "исходящий"}`,
        phone: callData.phone,
        duration: callData.duration || 0,
        uniq: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    };

    return this.createNote(note);
  }

  /**
   * Создание встречи
   */
  async createMeetingNote(
    entityId: number,
    entityType: "leads" | "contacts" | "companies",
    meetingData: {
      text: string;
      date: string; // ISO date string
      duration?: number;
    },
  ): Promise<KommoNote> {
    const note: Omit<KommoNote, "id" | "created_at" | "updated_at"> = {
      entity_id: entityId,
      entity_type: entityType,
      note_type: "meeting",
      params: {
        text: meetingData.text,
        uniq: `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    };

    return this.createNote(note);
  }

  /**
   * Получение кастомных полей
   */
  async getCustomFields(): Promise<KommoCustomField[]> {
    const response = await this.request<{
      _embedded: { custom_fields: KommoCustomField[] };
    }>("/custom_fields");

    return response._embedded?.custom_fields || [];
  }

  /**
   * Создание кастомного поля
   */
  async createCustomField(
    field: Omit<KommoCustomField, "id">,
  ): Promise<KommoCustomField> {
    const response = await this.request<{
      _embedded: { custom_fields: KommoCustomField[] };
    }>("/custom_fields", {
      method: "POST",
      body: JSON.stringify([field]),
    });

    return response._embedded.custom_fields[0];
  }

  /**
   * Получение шаблонов писем (если поддерживается)
   */
  async getEmailTemplates(): Promise<
    Array<{
      id: number;
      name: string;
      subject: string;
      html: string;
      text?: string;
    }>
  > {
    // В Kommo могут быть шаблоны через настройки
    // Пока возвращаем пустой массив, можно расширить позже
    return [];
  }

  // ==================== КОМПАНИИ (COMPANIES) ====================

  /**
   * Получение списка компаний
   */
  async getCompanies(): Promise<KommoCompany[]> {
    const response = await this.request<{
      _embedded: { companies: KommoCompany[] };
    }>("/companies");
    return response._embedded?.companies || [];
  }

  /**
   * Получение компании по ID
   */
  async getCompany(companyId: number): Promise<KommoCompany> {
    const response = await this.request<{
      _embedded: { companies: KommoCompany[] };
    }>(`/companies?id=${companyId}`);
    const company = response._embedded?.companies?.[0];
    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }
    return company;
  }

  /**
   * Создание компании
   */
  async createCompany(
    company: Omit<KommoCompany, "id" | "created_at" | "updated_at">,
  ): Promise<KommoCompany> {
    const response = await this.request<{
      _embedded: { companies: KommoCompany[] };
    }>("/companies", {
      method: "POST",
      body: JSON.stringify([company]),
    });
    return response._embedded.companies[0];
  }

  /**
   * Обновление компании
   */
  async updateCompany(
    companyId: number,
    company: Partial<KommoCompany>,
  ): Promise<KommoCompany> {
    const response = await this.request<{
      _embedded: { companies: KommoCompany[] };
    }>("/companies", {
      method: "PATCH",
      body: JSON.stringify([{ id: companyId, ...company }]),
    });
    return response._embedded.companies[0];
  }

  // ==================== ТЕГИ (TAGS) ====================

  /**
   * Получение списка тегов для типа сущности
   */
  async getTags(
    entityType?: "leads" | "contacts" | "companies",
  ): Promise<KommoTag[]> {
    const endpoint = entityType ? `/tags?entity_type=${entityType}` : "/tags";
    const response = await this.request<{ _embedded: { tags: KommoTag[] } }>(
      endpoint,
    );
    return response._embedded?.tags || [];
  }

  /**
   * Добавление тегов для типа сущности
   */
  async addTags(
    entityType: "leads" | "contacts" | "companies",
    tags: Array<{ name: string; color?: string }>,
  ): Promise<KommoTag[]> {
    const response = await this.request<{ _embedded: { tags: KommoTag[] } }>(
      "/tags",
      {
        method: "POST",
        body: JSON.stringify([{ entity_type: entityType, tags }]),
      },
    );
    return response._embedded?.tags || [];
  }

  /**
   * Обновление тегов одной сущности
   */
  async updateEntityTags(
    entityType: "leads" | "contacts" | "companies",
    entityId: number,
    tags: Array<{ id?: number; name: string }>,
  ): Promise<KommoTag[]> {
    const response = await this.request<{ _embedded: { tags: KommoTag[] } }>(
      `/${entityType}/${entityId}/tags`,
      {
        method: "PATCH",
        body: JSON.stringify(tags),
      },
    );
    return response._embedded?.tags || [];
  }

  /**
   * Обновление тегов нескольких сущностей
   */
  async updateMultipleEntityTags(
    entityType: "leads" | "contacts" | "companies",
    updates: Array<{ id: number; tags: Array<{ id?: number; name: string }> }>,
  ): Promise<KommoTag[]> {
    const response = await this.request<{ _embedded: { tags: KommoTag[] } }>(
      `/${entityType}/tags`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
    return response._embedded?.tags || [];
  }

  // ==================== АККАУНТ (ACCOUNT) ====================

  /**
   * Получение информации об аккаунте
   */
  async getAccount(): Promise<KommoAccount> {
    return this.request<KommoAccount>("/account");
  }

  // ==================== ВХОДЯЩИЕ ЛИДЫ (INCOMING LEADS) ====================

  /**
   * Получение списка входящих лидов
   */
  async getIncomingLeads(): Promise<KommoIncomingLead[]> {
    const response = await this.request<{
      _embedded: { incoming_leads: KommoIncomingLead[] };
    }>("/incoming_leads");
    return response._embedded?.incoming_leads || [];
  }

  /**
   * Получение входящего лида по UID
   */
  async getIncomingLead(uid: string): Promise<KommoIncomingLead> {
    return this.request<KommoIncomingLead>(`/incoming_leads/${uid}`);
  }

  /**
   * Добавление входящего лида
   */
  async addIncomingLead(
    lead: Omit<KommoIncomingLead, "uid" | "created_at">,
  ): Promise<KommoIncomingLead> {
    const response = await this.request<{
      _embedded: { incoming_leads: KommoIncomingLead[] };
    }>("/incoming_leads", {
      method: "POST",
      body: JSON.stringify([lead]),
    });
    return response._embedded.incoming_leads[0];
  }

  /**
   * Добавление входящего лида из звонка (SIP)
   */
  async addIncomingLeadFromSip(sipData: {
    phone: string;
    pipeline_id?: number;
    status_id?: number;
    metadata?: Record<string, unknown>;
  }): Promise<KommoIncomingLead> {
    const response = await this.request<{
      _embedded: { incoming_leads: KommoIncomingLead[] };
    }>("/incoming_leads/sip", {
      method: "POST",
      body: JSON.stringify([sipData]),
    });
    return response._embedded.incoming_leads[0];
  }

  /**
   * Добавление входящего лида из формы
   */
  async addIncomingLeadFromForm(formData: {
    form_id: number;
    pipeline_id?: number;
    status_id?: number;
    fields: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): Promise<KommoIncomingLead> {
    const response = await this.request<{
      _embedded: { incoming_leads: KommoIncomingLead[] };
    }>("/incoming_leads/form", {
      method: "POST",
      body: JSON.stringify([formData]),
    });
    return response._embedded.incoming_leads[0];
  }

  /**
   * Принятие входящего лида
   */
  async acceptIncomingLead(
    uid: string,
    leadData?: { pipeline_id?: number; status_id?: number },
  ): Promise<KommoIncomingLead> {
    const response = await this.request<{
      _embedded: { incoming_leads: KommoIncomingLead[] };
    }>(`/incoming_leads/${uid}/accept`, {
      method: "POST",
      body: leadData ? JSON.stringify([leadData]) : undefined,
    });
    return response._embedded.incoming_leads[0];
  }

  /**
   * Отклонение входящего лида
   */
  async declineIncomingLead(uid: string): Promise<void> {
    await this.request(`/incoming_leads/${uid}/decline`, {
      method: "POST",
    });
  }

  /**
   * Привязка входящего лида к сделке/контакту
   */
  async linkIncomingLead(
    uid: string,
    entityType: "leads" | "contacts",
    entityId: number,
  ): Promise<void> {
    await this.request(`/incoming_leads/${uid}/link`, {
      method: "POST",
      body: JSON.stringify([{ entity_type: entityType, entity_id: entityId }]),
    });
  }

  // ==================== ИСТОЧНИКИ (SOURCES) ====================

  /**
   * Получение списка источников
   */
  async getSources(): Promise<KommoSource[]> {
    const response = await this.request<{
      _embedded: { sources: KommoSource[] };
    }>("/leads/sources");
    return response._embedded?.sources || [];
  }

  /**
   * Получение источника по ID
   */
  async getSource(sourceId: number): Promise<KommoSource> {
    return this.request<KommoSource>(`/leads/sources/${sourceId}`);
  }

  /**
   * Добавление источника
   */
  async addSource(source: Omit<KommoSource, "id">): Promise<KommoSource> {
    const response = await this.request<{
      _embedded: { sources: KommoSource[] };
    }>("/leads/sources", {
      method: "POST",
      body: JSON.stringify([source]),
    });
    return response._embedded.sources[0];
  }

  /**
   * Обновление источника
   */
  async updateSource(
    sourceId: number,
    source: Partial<KommoSource>,
  ): Promise<KommoSource> {
    const response = await this.request<{
      _embedded: { sources: KommoSource[] };
    }>("/leads/sources", {
      method: "PATCH",
      body: JSON.stringify([{ id: sourceId, ...source }]),
    });
    return response._embedded.sources[0];
  }

  /**
   * Массовое обновление источников
   */
  async updateSources(
    updates: Array<{ id: number } & Partial<KommoSource>>,
  ): Promise<KommoSource[]> {
    const response = await this.request<{
      _embedded: { sources: KommoSource[] };
    }>("/leads/sources", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return response._embedded.sources;
  }

  /**
   * Удаление источника
   */
  async deleteSource(sourceId: number): Promise<void> {
    await this.request(`/leads/sources/${sourceId}`, {
      method: "DELETE",
    });
  }

  /**
   * Массовое удаление источников
   */
  async deleteSources(sourceIds: number[]): Promise<void> {
    await this.request("/leads/sources", {
      method: "DELETE",
      body: JSON.stringify(sourceIds.map((id) => ({ id }))),
    });
  }

  // ==================== ШАБЛОНЫ (TEMPLATES) ====================

  /**
   * Получение списка шаблонов
   */
  async getTemplates(): Promise<KommoTemplate[]> {
    const response = await this.request<{
      _embedded: { templates: KommoTemplate[] };
    }>("/templates");
    return response._embedded?.templates || [];
  }

  /**
   * Получение шаблона по ID
   */
  async getTemplate(templateId: number): Promise<KommoTemplate> {
    return this.request<KommoTemplate>(`/templates/${templateId}`);
  }

  /**
   * Добавление шаблона
   */
  async addTemplate(
    template: Omit<KommoTemplate, "id">,
  ): Promise<KommoTemplate> {
    const response = await this.request<{
      _embedded: { templates: KommoTemplate[] };
    }>("/templates", {
      method: "POST",
      body: JSON.stringify([template]),
    });
    return response._embedded.templates[0];
  }

  /**
   * Обновление шаблона
   */
  async updateTemplate(
    templateId: number,
    template: Partial<KommoTemplate>,
  ): Promise<KommoTemplate> {
    const response = await this.request<{
      _embedded: { templates: KommoTemplate[] };
    }>("/templates", {
      method: "PATCH",
      body: JSON.stringify([{ id: templateId, ...template }]),
    });
    return response._embedded.templates[0];
  }

  /**
   * Массовое обновление шаблонов
   */
  async updateTemplates(
    updates: Array<{ id: number } & Partial<KommoTemplate>>,
  ): Promise<KommoTemplate[]> {
    const response = await this.request<{
      _embedded: { templates: KommoTemplate[] };
    }>("/templates", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return response._embedded.templates;
  }

  /**
   * Отправка WhatsApp шаблона на модерацию
   */
  async submitTemplate(templateId: number): Promise<void> {
    await this.request(`/templates/${templateId}/submit`, {
      method: "POST",
    });
  }

  /**
   * Изменение статуса WhatsApp шаблона
   */
  async updateTemplateStatus(
    templateId: number,
    status: string,
  ): Promise<void> {
    await this.request(`/templates/${templateId}/status`, {
      method: "PATCH",
      body: JSON.stringify([{ status }]),
    });
  }

  /**
   * Удаление шаблона
   */
  async deleteTemplate(templateId: number): Promise<void> {
    await this.request(`/templates/${templateId}`, {
      method: "DELETE",
    });
  }

  /**
   * Массовое удаление шаблонов
   */
  async deleteTemplates(templateIds: number[]): Promise<void> {
    await this.request("/templates", {
      method: "DELETE",
      body: JSON.stringify(templateIds.map((id) => ({ id }))),
    });
  }

  // ==================== РАЗГОВОРЫ (CONVERSATIONS) ====================

  /**
   * Получение разговора по ID
   */
  async getConversation(conversationId: number): Promise<KommoConversation> {
    return this.request<KommoConversation>(`/conversations/${conversationId}`);
  }

  /**
   * Закрытие разговора
   */
  async closeConversation(conversationId: number): Promise<void> {
    await this.request(`/conversations/${conversationId}/close`, {
      method: "POST",
    });
  }

  // ==================== СОБЫТИЯ (EVENTS) ====================

  /**
   * Получение списка событий
   */
  async getEvents(filters?: {
    entity_type?: "leads" | "contacts" | "companies" | "tasks";
    entity_id?: number;
    type?: string;
    user_id?: number;
  }): Promise<KommoEvent[]> {
    const params = new URLSearchParams();
    if (filters?.entity_type)
      params.append("filter[entity_type]", filters.entity_type);
    if (filters?.entity_id)
      params.append("filter[entity_id]", String(filters.entity_id));
    if (filters?.type) params.append("filter[type]", filters.type);
    if (filters?.user_id)
      params.append("filter[user_id]", String(filters.user_id));

    const endpoint = params.toString()
      ? `/events?${params.toString()}`
      : "/events";
    const response = await this.request<{
      _embedded: { events: KommoEvent[] };
    }>(endpoint);
    return response._embedded?.events || [];
  }

  /**
   * Получение события по ID
   */
  async getEvent(eventId: number): Promise<KommoEvent> {
    return this.request<KommoEvent>(`/events/${eventId}`);
  }

  /**
   * Получение типов событий
   */
  async getEventTypes(): Promise<Array<{ id: string; name: string }>> {
    const response = await this.request<{
      _embedded: { event_types: Array<{ id: string; name: string }> };
    }>("/events/types");
    return response._embedded?.event_types || [];
  }

  // ==================== СПИСКИ (LISTS) ====================

  /**
   * Получение списка списков
   */
  async getLists(): Promise<KommoList[]> {
    const response = await this.request<{ _embedded: { lists: KommoList[] } }>(
      "/lists",
    );
    return response._embedded?.lists || [];
  }

  /**
   * Получение списка по ID
   */
  async getList(listId: number): Promise<KommoList> {
    return this.request<KommoList>(`/lists/${listId}`);
  }

  /**
   * Добавление списка
   */
  async addList(list: Omit<KommoList, "id">): Promise<KommoList> {
    const response = await this.request<{ _embedded: { lists: KommoList[] } }>(
      "/lists",
      {
        method: "POST",
        body: JSON.stringify([list]),
      },
    );
    return response._embedded.lists[0];
  }

  /**
   * Обновление списка
   */
  async updateList(
    listId: number,
    list: Partial<KommoList>,
  ): Promise<KommoList> {
    const response = await this.request<{ _embedded: { lists: KommoList[] } }>(
      "/lists",
      {
        method: "PATCH",
        body: JSON.stringify([{ id: listId, ...list }]),
      },
    );
    return response._embedded.lists[0];
  }

  /**
   * Массовое обновление списков
   */
  async updateLists(
    updates: Array<{ id: number } & Partial<KommoList>>,
  ): Promise<KommoList[]> {
    const response = await this.request<{ _embedded: { lists: KommoList[] } }>(
      "/lists",
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
    return response._embedded.lists;
  }

  /**
   * Получение элементов списка
   */
  async getListElements(listId: number): Promise<KommoListElement[]> {
    const response = await this.request<{
      _embedded: { elements: KommoListElement[] };
    }>(`/lists/${listId}/elements`);
    return response._embedded?.elements || [];
  }

  /**
   * Получение элемента списка по ID
   */
  async getListElement(
    listId: number,
    elementId: number,
  ): Promise<KommoListElement> {
    return this.request<KommoListElement>(
      `/lists/${listId}/elements/${elementId}`,
    );
  }

  /**
   * Добавление элементов в список
   */
  async addListElements(
    listId: number,
    elements: Array<Omit<KommoListElement, "id">>,
  ): Promise<KommoListElement[]> {
    const response = await this.request<{
      _embedded: { elements: KommoListElement[] };
    }>(`/lists/${listId}/elements`, {
      method: "POST",
      body: JSON.stringify(elements),
    });
    return response._embedded.elements;
  }

  /**
   * Обновление элементов списка (массово)
   */
  async updateListElements(
    listId: number,
    updates: Array<{ id: number } & Partial<KommoListElement>>,
  ): Promise<KommoListElement[]> {
    const response = await this.request<{
      _embedded: { elements: KommoListElement[] };
    }>(`/lists/${listId}/elements`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return response._embedded.elements;
  }

  /**
   * Обновление элемента списка
   */
  async updateListElement(
    listId: number,
    elementId: number,
    element: Partial<KommoListElement>,
  ): Promise<KommoListElement> {
    const response = await this.request<{
      _embedded: { elements: KommoListElement[] };
    }>(`/lists/${listId}/elements`, {
      method: "PATCH",
      body: JSON.stringify([{ id: elementId, ...element }]),
    });
    return response._embedded.elements[0];
  }

  // ==================== СВЯЗИ МЕЖДУ СУЩНОСТЯМИ (LINKS) ====================

  /**
   * Получение списка связей сущности
   */
  async getLinks(
    entityType: "leads" | "contacts" | "companies",
    entityId: number,
  ): Promise<KommoLink[]> {
    const response = await this.request<{ _embedded: { links: KommoLink[] } }>(
      `/${entityType}/${entityId}/links`,
    );
    return response._embedded?.links || [];
  }

  /**
   * Создание связи между сущностями
   */
  async createLink(
    entityType: "leads" | "contacts" | "companies",
    entityId: number,
    link: KommoLink,
  ): Promise<void> {
    await this.request(`/${entityType}/${entityId}/links`, {
      method: "POST",
      body: JSON.stringify([link]),
    });
  }

  /**
   * Удаление связи между сущностями
   */
  async deleteLink(
    entityType: "leads" | "contacts" | "companies",
    entityId: number,
    link: KommoLink,
  ): Promise<void> {
    await this.request(`/${entityType}/${entityId}/links`, {
      method: "DELETE",
      body: JSON.stringify([link]),
    });
  }

  // ==================== РОЛИ ПОЛЬЗОВАТЕЛЕЙ (ROLES) ====================

  /**
   * Получение списка ролей
   */
  async getRoles(): Promise<KommoRole[]> {
    const response = await this.request<{ _embedded: { roles: KommoRole[] } }>(
      "/users/roles",
    );
    return response._embedded?.roles || [];
  }

  /**
   * Получение роли по ID
   */
  async getRole(roleId: number): Promise<KommoRole> {
    return this.request<KommoRole>(`/users/roles/${roleId}`);
  }

  /**
   * Добавление роли
   */
  async addRole(role: Omit<KommoRole, "id">): Promise<KommoRole> {
    const response = await this.request<{ _embedded: { roles: KommoRole[] } }>(
      "/users/roles",
      {
        method: "POST",
        body: JSON.stringify([role]),
      },
    );
    return response._embedded.roles[0];
  }

  /**
   * Обновление роли
   */
  async updateRole(
    roleId: number,
    role: Partial<KommoRole>,
  ): Promise<KommoRole> {
    const response = await this.request<{ _embedded: { roles: KommoRole[] } }>(
      "/users/roles",
      {
        method: "PATCH",
        body: JSON.stringify([{ id: roleId, ...role }]),
      },
    );
    return response._embedded.roles[0];
  }

  /**
   * Удаление роли
   */
  async deleteRole(roleId: number): Promise<void> {
    await this.request(`/users/roles/${roleId}`, {
      method: "DELETE",
    });
  }

  // ==================== ВИДЖЕТЫ (WIDGETS) ====================

  /**
   * Получение списка виджетов
   */
  async getWidgets(): Promise<KommoWidget[]> {
    const response = await this.request<{
      _embedded: { widgets: KommoWidget[] };
    }>("/widgets");
    return response._embedded?.widgets || [];
  }

  /**
   * Получение виджета по коду
   */
  async getWidget(widgetCode: string): Promise<KommoWidget> {
    return this.request<KommoWidget>(`/widgets/${widgetCode}`);
  }

  /**
   * Установка виджета в аккаунт
   */
  async installWidget(
    widgetCode: string,
    settings?: Record<string, unknown>,
  ): Promise<void> {
    await this.request(`/widgets/${widgetCode}/install`, {
      method: "POST",
      body: settings ? JSON.stringify([settings]) : undefined,
    });
  }

  /**
   * Удаление виджета из аккаунта
   */
  async uninstallWidget(widgetCode: string): Promise<void> {
    await this.request(`/widgets/${widgetCode}/uninstall`, {
      method: "POST",
    });
  }

  // ==================== SALESBOT ====================

  /**
   * Запуск Salesbot
   */
  async launchSalesbot(launchData: KommoSalesbotLaunch): Promise<void> {
    await this.request("/salesbot/launch", {
      method: "POST",
      body: JSON.stringify([launchData]),
    });
  }

  /**
   * Получение статистики по сделкам
   */
  async getLeadsStats(): Promise<{
    total: number;
    by_status: Record<number, number>;
    by_pipeline: Record<number, number>;
  }> {
    if (this.isDemoMode) {
      return {
        total: 4,
        by_status: { 142: 2, 143: 1, 144: 1 },
        by_pipeline: { 1: 3, 2: 1 },
      };
    }

    const leads = await this.request<{ _embedded: { leads: KommoLead[] } }>(
      "/leads?limit=500",
    );

    const stats = {
      total: leads._embedded?.leads?.length || 0,
      by_status: {} as Record<number, number>,
      by_pipeline: {} as Record<number, number>,
    };

    leads._embedded?.leads?.forEach((lead) => {
      if (lead.status_id) {
        stats.by_status[lead.status_id] =
          (stats.by_status[lead.status_id] || 0) + 1;
      }
      if (lead.pipeline_id) {
        stats.by_pipeline[lead.pipeline_id] =
          (stats.by_pipeline[lead.pipeline_id] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Webhook для входящих событий от Kommo
   * Поддерживает все типы событий: leads, contacts, tasks, messages, calls, customers, companies
   */
  static parseWebhook(payload: Record<string, unknown>): {
    type: string;
    data: unknown;
  } {
    // Kommo отправляет события в разных форматах:
    // 1. { leads: { status: [{ id, status_id, ... }] } }
    // 2. { tasks: { add: [{ id, entity_id, entity_type, ... }] } }
    // 3. { messages: [{ id, entity_id, ... }] }
    // 4. { calls: [{ id, entity_id, ... }] }
    // 5. { account: { base_domain: '...' }, leads: {...} } - с метаданными аккаунта

    // Ищем тип события в ключах payload
    const eventTypes = [
      "leads",
      "contacts",
      "customers",
      "tasks",
      "messages",
      "calls",
      "companies",
    ];
    const eventType = Object.keys(payload).find((key) =>
      eventTypes.includes(key),
    );

    if (!eventType) {
      // Если тип не найден, пробуем определить по структуре
      console.warn("Unknown webhook event format:", Object.keys(payload));
      return {
        type: "unknown",
        data: payload,
      };
    }

    const eventData = payload[eventType];

    return {
      type: eventType,
      data: eventData,
    };
  }
}

/**
 * Вспомогательные функции для работы с Kommo
 */

export const createLeadFromChat = (
  name: string,
  phone: string,
  email: string,
  message: string,
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
  };
};

export const createContactFromChat = (
  name: string,
  phone: string,
  email: string,
): KommoContact => {
  const [firstName, ...lastNameParts] = name.split(" ");

  return {
    name,
    first_name: firstName,
    last_name: lastNameParts.join(" "),
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
  };
};
