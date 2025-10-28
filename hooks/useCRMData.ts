'use client'

import { useState, useEffect, useCallback } from 'react'
import { KommoProvider } from '@/lib/crm/providers/KommoProvider'
import { ZohoProvider } from '@/lib/crm/providers/ZohoProvider'
import type { 
  CRMConnection, 
  UniversalPipeline, 
  UniversalChannel, 
  UniversalContact, 
  UniversalDeal, 
  UniversalTask,
  SyncResult 
} from '@/types/crm'
import type { BaseCRMProvider } from '@/lib/crm/providers/BaseCRMProvider'

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

  const [provider, setProvider] = useState<BaseCRMProvider | null>(null)

  // Инициализация провайдера
  useEffect(() => {
    if (connection) {
      try {
        let crmProvider: BaseCRMProvider
        
        switch (connection.crmType) {
          case 'kommo':
            crmProvider = new KommoProvider(connection)
            break
          case 'zoho':
            crmProvider = new ZohoProvider(connection)
            break
          default:
            throw new Error(`Неподдерживаемый тип CRM: ${connection.crmType}`)
        }
        
        setProvider(crmProvider)
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
      const result = await provider.syncAll()
      
      if (result.success) {
        setPipelines(result.pipelines)
        setChannels(result.channels)
        setContacts(result.contacts)
        setDeals(result.deals)
        setTasks(result.tasks)
        setLastSyncAt(result.lastSyncAt)
      } else {
        setError(result.errors.join(', '))
      }

      return result
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
      const newConnection = await provider.refreshToken()
      // Здесь нужно обновить соединение в родительском компоненте
      console.log('Токен обновлен:', newConnection)
    } catch (err) {
      setError(`Ошибка обновления токена: ${err}`)
    }
  }, [provider])

  // Обновление этапа сделки
  const updateDealStage = useCallback(async (dealId: string, stageId: string): Promise<boolean> => {
    if (!provider) return false

    try {
      const success = await provider.updateDealStage(dealId, stageId)
      if (success) {
        // Обновляем локальное состояние
        setDeals(prev => prev.map(deal => 
          deal.id === dealId ? { ...deal, stageId } : deal
        ))
      }
      return success
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
      const newTask = await provider.createTask(task)
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
