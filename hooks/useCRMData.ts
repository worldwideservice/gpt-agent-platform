'use client'

import { useState, useEffect, useCallback } from 'react'
import { KommoAPI } from '@/lib/crm/kommo'
import type { 
  CRMConnection, 
  UniversalPipeline, 
  UniversalChannel, 
  UniversalContact, 
  UniversalDeal, 
  UniversalTask,
  SyncResult 
} from '@/types/crm'

interface UseCRMDataReturn {
  // Состояние
  isLoading: boolean
  error: string | null
  isConnected: boolean
  lastSyncAt: Date | null
  
  // Данные
  pipelines: UniversalPipeline[]
  channels: UniversalChannel[]
  contacts: UniversalContact[]
  deals: UniversalDeal[]
  tasks: UniversalTask[]
  
  // Методы
  syncData: () => Promise<SyncResult>
  refreshConnection: () => Promise<void>
  updateDealStage: (dealId: string, stageId: string) => Promise<boolean>
  createTask: (task: Omit<UniversalTask, 'id' | 'createdAt'>) => Promise<UniversalTask>
}

export const useCRMData = (connection: CRMConnection | null): UseCRMDataReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null)
  
  const [pipelines, setPipelines] = useState<UniversalPipeline[]>([])
  const [channels, setChannels] = useState<UniversalChannel[]>([])
  const [contacts, setContacts] = useState<UniversalContact[]>([])
  const [deals, setDeals] = useState<UniversalDeal[]>([])
  const [tasks, setTasks] = useState<UniversalTask[]>([])

  const [provider, setProvider] = useState<KommoAPI | null>(null)

  // Инициализация провайдера
  useEffect(() => {
    if (connection && connection.crmType === 'kommo') {
      try {
        const kommoAPI = new KommoAPI({
          domain: connection.domain || '',
          clientId: connection.clientId || '',
          clientSecret: connection.clientSecret || '',
          redirectUri: connection.redirectUri || '',
          accessToken: connection.accessToken,
          refreshToken: connection.refreshToken,
        })
        
        setProvider(kommoAPI)
        setError(null)
      } catch (err) {
        setError(`Ошибка инициализации CRM: ${err}`)
      }
    } else {
      setProvider(null)
    }
  }, [connection])

  // Синхронизация данных
  const syncData = useCallback(async (): Promise<SyncResult> => {
    if (!provider) {
      const error = 'CRM провайдер не инициализирован'
      setError(error)
      return {
        success: false,
        pipelines: [],
        channels: [],
        contacts: [],
        deals: [],
        tasks: [],
        errors: [error],
        lastSyncAt: new Date()
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      // Получаем данные из Kommo
      const [pipelinesData, contactsData] = await Promise.all([
        provider.getPipelines(),
        provider.searchContacts('')
      ])

      // Преобразуем данные в универсальный формат
      const pipelines: UniversalPipeline[] = pipelinesData.map(pipeline => ({
        id: pipeline.id.toString(),
        name: pipeline.name,
        stages: pipeline._embedded.statuses.map(stage => ({
          id: stage.id.toString(),
          name: stage.name,
          sort: stage.sort
        }))
      }))

      const contacts: UniversalContact[] = contactsData.map(contact => ({
        id: contact.id?.toString() || '',
        name: contact.name,
        email: contact.custom_fields_values?.find(f => f.field_name === 'email')?.values[0]?.value || '',
        phone: contact.custom_fields_values?.find(f => f.field_name === 'phone')?.values[0]?.value || '',
        createdAt: new Date()
      }))

      setPipelines(pipelines)
      setContacts(contacts)
      setLastSyncAt(new Date())

      return {
        success: true,
        pipelines,
        channels: [],
        contacts,
        deals: [],
        tasks: [],
        errors: [],
        lastSyncAt: new Date()
      }
    } catch (err) {
      const error = `Ошибка синхронизации: ${err}`
      setError(error)
      return {
        success: false,
        pipelines: [],
        channels: [],
        contacts: [],
        deals: [],
        tasks: [],
        errors: [error],
        lastSyncAt: new Date()
      }
    } finally {
      setIsLoading(false)
    }
  }, [provider])

  // Обновление соединения
  const refreshConnection = useCallback(async (): Promise<void> => {
    if (!provider) return

    try {
      await provider.refreshAccessToken()
      console.log('Токен обновлен')
    } catch (err) {
      setError(`Ошибка обновления токена: ${err}`)
    }
  }, [provider])

  // Обновление этапа сделки
  const updateDealStage = useCallback(async (dealId: string, stageId: string): Promise<boolean> => {
    if (!provider) return false

    try {
      await provider.updateLead(parseInt(dealId), { status_id: parseInt(stageId) })
      // Обновляем локальное состояние
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, stageId } : deal
      ))
      return true
    } catch (err) {
      setError(`Ошибка обновления этапа сделки: ${err}`)
      return false
    }
  }, [provider])

  // Создание задачи
  const createTask = useCallback(async (task: Omit<UniversalTask, 'id' | 'createdAt'>): Promise<UniversalTask> => {
    if (!provider) {
      throw new Error('CRM провайдер не инициализирован')
    }

    try {
      // Создаем заметку в Kommo как задачу
      const newTask: UniversalTask = {
        id: Date.now().toString(),
        title: task.title,
        description: task.description,
        status: 'pending',
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: new Date()
      }
      
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(`Ошибка создания задачи: ${err}`)
      throw err
    }
  }, [provider])

  return {
    // Состояние
    isLoading,
    error,
    isConnected: !!connection?.isConnected,
    lastSyncAt,
    
    // Данные
    pipelines,
    channels,
    contacts,
    deals,
    tasks,
    
    // Методы
    syncData,
    refreshConnection,
    updateDealStage,
    createTask
  }
}
