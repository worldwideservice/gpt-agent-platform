// Универсальные типы для всех CRM систем
export interface UniversalPipeline {
  id: string
  name: string
  isActive: boolean
  stages: UniversalStage[]
}

export interface UniversalStage {
  id: string
  name: string
  pipelineId: string
  order: number
  isActive: boolean
}

export interface UniversalChannel {
  id: string
  name: string
  type: 'email' | 'phone' | 'chat' | 'social' | 'web' | 'other'
  isActive: boolean
}

export interface UniversalContact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  createdAt: Date
  updatedAt: Date
}

export interface UniversalDeal {
  id: string
  name: string
  pipelineId: string
  stageId: string
  contactId: string
  value?: number
  currency?: string
  createdAt: Date
  updatedAt: Date
}

export interface UniversalTask {
  id: string
  title: string
  description?: string
  dealId?: string
  contactId?: string
  dueDate?: Date
  isCompleted: boolean
  createdAt: Date
}

// Конфигурация CRM системы
export interface CRMConfig {
  id: string
  name: string
  logo: string
  description: string
  authType: 'oauth2' | 'api_key' | 'basic'
  baseUrl: string
  scopes: string[]
  fields: CRMFieldMapping[]
}

export interface CRMFieldMapping {
  universalField: string
  crmField: string
  required: boolean
  type: 'string' | 'number' | 'date' | 'boolean' | 'array'
}

// Состояние подключения CRM
export interface CRMConnection {
  id: string
  crmType: string
  accessToken: string
  domain?: string // для Kommo
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  refreshToken?: string
  isConnected: boolean
  lastSyncAt?: Date
  config: CRMConfig
}

// Результат синхронизации
export interface SyncResult {
  success: boolean
  pipelines: UniversalPipeline[]
  channels: UniversalChannel[]
  contacts: UniversalContact[]
  deals: UniversalDeal[]
  tasks: UniversalTask[]
  errors: string[]
  lastSyncAt: Date
}
