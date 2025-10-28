import type { 
  UniversalPipeline, 
  UniversalStage, 
  UniversalChannel, 
  UniversalContact, 
  UniversalDeal, 
  UniversalTask,
  CRMConfig,
  CRMConnection,
  SyncResult 
} from '@/types/crm'

export abstract class BaseCRMProvider {
  protected config: CRMConfig
  protected connection: CRMConnection

  constructor(config: CRMConfig, connection: CRMConnection) {
    this.config = config
    this.connection = connection
  }

  // Абстрактные методы, которые должны быть реализованы в конкретных провайдерах
  abstract authenticate(): Promise<CRMConnection>
  abstract refreshToken(): Promise<CRMConnection>
  abstract getPipelines(): Promise<UniversalPipeline[]>
  abstract getStages(pipelineId: string): Promise<UniversalStage[]>
  abstract getChannels(): Promise<UniversalChannel[]>
  abstract getContacts(): Promise<UniversalContact[]>
  abstract getDeals(): Promise<UniversalDeal[]>
  abstract getTasks(): Promise<UniversalTask[]>
  abstract createTask(task: Omit<UniversalTask, 'id' | 'createdAt'>): Promise<UniversalTask>
  abstract updateDealStage(dealId: string, stageId: string): Promise<boolean>

  // Универсальный метод синхронизации
  async syncAll(): Promise<SyncResult> {
    const errors: string[] = []
    let pipelines: UniversalPipeline[] = []
    let channels: UniversalChannel[] = []
    let contacts: UniversalContact[] = []
    let deals: UniversalDeal[] = []
    let tasks: UniversalTask[] = []

    try {
      // Проверяем соединение
      if (!this.connection.isConnected) {
        await this.authenticate()
      }

      // Синхронизируем данные параллельно
      const [pipelinesResult, channelsResult, contactsResult, dealsResult, tasksResult] = await Promise.allSettled([
        this.getPipelines(),
        this.getChannels(),
        this.getContacts(),
        this.getDeals(),
        this.getTasks()
      ])

      // Обрабатываем результаты
      if (pipelinesResult.status === 'fulfilled') {
        pipelines = pipelinesResult.value
      } else {
        errors.push(`Ошибка получения воронок: ${pipelinesResult.reason}`)
      }

      if (channelsResult.status === 'fulfilled') {
        channels = channelsResult.value
      } else {
        errors.push(`Ошибка получения каналов: ${channelsResult.reason}`)
      }

      if (contactsResult.status === 'fulfilled') {
        contacts = contactsResult.value
      } else {
        errors.push(`Ошибка получения контактов: ${contactsResult.reason}`)
      }

      if (dealsResult.status === 'fulfilled') {
        deals = dealsResult.value
      } else {
        errors.push(`Ошибка получения сделок: ${dealsResult.reason}`)
      }

      if (tasksResult.status === 'fulfilled') {
        tasks = tasksResult.value
      } else {
        errors.push(`Ошибка получения задач: ${tasksResult.reason}`)
      }

      // Обновляем время последней синхронизации
      this.connection.lastSyncAt = new Date()

      return {
        success: errors.length === 0,
        pipelines,
        channels,
        contacts,
        deals,
        tasks,
        errors,
        lastSyncAt: new Date()
      }

    } catch (error) {
      errors.push(`Общая ошибка синхронизации: ${error}`)
      return {
        success: false,
        pipelines: [],
        channels: [],
        contacts: [],
        deals: [],
        tasks: [],
        errors,
        lastSyncAt: new Date()
      }
    }
  }

  // Проверка валидности токена
  isTokenValid(): boolean {
    if (!this.connection.accessToken) return false
    if (!this.connection.expiresAt) return true
    
    return new Date() < this.connection.expiresAt
  }

  // Получение конфигурации
  getConfig(): CRMConfig {
    return this.config
  }

  // Получение состояния соединения
  getConnection(): CRMConnection {
    return this.connection
  }
}
