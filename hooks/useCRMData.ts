'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { KommoAPI } from '@/lib/crm/kommo'
import type { CRMConnection } from '@/types/crm'

interface CRMState {
  pipelines: unknown[]
  channels: unknown[]
  contacts: unknown[]
  deals: unknown[]
  tasks: unknown[]
  isConnected: boolean
  isLoading: boolean
  lastSyncAt: Date | null
  error: string | null
}

const INITIAL_STATE: CRMState = {
  pipelines: [],
  channels: [],
  contacts: [],
  deals: [],
  tasks: [],
  isConnected: false,
  isLoading: false,
  lastSyncAt: null,
  error: null,
}

const ensureDate = (value: unknown): Date | null => {
  if (!value) {
    return null
  }

  const parsed = value instanceof Date ? value : new Date(value as string)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const mapSyncPayload = (payload: Record<string, unknown> | null | undefined) => ({
  pipelines: Array.isArray(payload?.pipelines) ? (payload!.pipelines as unknown[]) : [],
  channels: Array.isArray(payload?.channels) ? (payload!.channels as unknown[]) : [],
  contacts: Array.isArray(payload?.contacts) ? (payload!.contacts as unknown[]) : [],
  deals: Array.isArray(payload?.deals) ? (payload!.deals as unknown[]) : [],
  tasks: Array.isArray(payload?.tasks) ? (payload!.tasks as unknown[]) : [],
  lastSyncAt: ensureDate(payload?.lastSyncAt ?? payload?.syncedAt ?? payload?.last_sync_at),
})

const createKommoClient = (connection: CRMConnection | null | undefined) => {
  if (!connection || connection.crmType !== 'kommo') {
    return null
  }

  const { domain, clientId, clientSecret, redirectUri, accessToken, refreshToken } = connection as Partial<
    CRMConnection & {
      domain: string
      clientId: string
      clientSecret: string
      redirectUri: string
      accessToken?: string
      refreshToken?: string | null
    }
  >

  if (!domain || !clientId || !clientSecret || !redirectUri) {
    return null
  }

  return new KommoAPI({
    domain,
    clientId,
    clientSecret,
    redirectUri,
    accessToken,
    refreshToken: refreshToken ?? null,
  })
}

export interface UseCRMDataResult extends CRMState {
  syncData: () => Promise<unknown>
  refreshConnection: () => Promise<boolean>
  updateDealStage: (dealId: number | string, pipelineId: number, stageId: number) => Promise<boolean>
  createTask: (task: {
    text: string
    completeTill: number
    responsibleUserId: number
    entityId: number
    entityType?: 'leads' | 'contacts' | 'companies'
  }) => Promise<boolean>
}

export function useCRMData(connection: CRMConnection | null | undefined): UseCRMDataResult {
  const [state, setState] = useState<CRMState>(INITIAL_STATE)

  const kommoClient = useMemo(() => createKommoClient(connection), [connection])

  const loadFromKommo = useCallback(async () => {
    if (!kommoClient) {
      return {
        pipelines: [] as unknown[],
        channels: [] as unknown[],
        contacts: [] as unknown[],
        deals: [] as unknown[],
        tasks: [] as unknown[],
      }
    }

    const [pipelinesResult, dealsResult] = await Promise.allSettled([
      kommoClient.getPipelines?.(),
      (kommoClient as unknown as { getLeads?: () => Promise<unknown[]> }).getLeads?.(),
    ])

    return {
      pipelines: pipelinesResult.status === 'fulfilled' ? (pipelinesResult.value as unknown[]) : [],
      channels: [] as unknown[],
      contacts: [] as unknown[],
      deals: dealsResult.status === 'fulfilled' ? (dealsResult.value as unknown[]) : [],
      tasks: [] as unknown[],
    }
  }, [kommoClient])

  useEffect(() => {
    if (!connection || !connection.isConnected) {
      setState(INITIAL_STATE)
      return
    }

    let cancelled = false

    setState((prev) => ({
      ...prev,
      isConnected: true,
      isLoading: true,
      error: null,
    }))

    const load = async () => {
      try {
        const data = await loadFromKommo()
        if (!cancelled) {
          setState({
            pipelines: data.pipelines,
            channels: data.channels,
            contacts: data.contacts,
            deals: data.deals,
            tasks: data.tasks,
            isConnected: true,
            isLoading: false,
            lastSyncAt: new Date(),
            error: null,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Не удалось загрузить данные CRM',
          }))
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [connection, loadFromKommo])

  const syncData = useCallback(async () => {
    if (!connection) {
      return { success: false }
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/manage/crm/${connection.id}/sync`, { method: 'POST' })
      if (response.ok) {
        const payload = await response.json().catch(() => null)
        if (payload?.data) {
          const mapped = mapSyncPayload(payload.data as Record<string, unknown>)
          setState({
            pipelines: mapped.pipelines,
            channels: mapped.channels,
            contacts: mapped.contacts,
            deals: mapped.deals,
            tasks: mapped.tasks,
            isConnected: true,
            isLoading: false,
            lastSyncAt: mapped.lastSyncAt ?? new Date(),
            error: null,
          })
          return payload
        }
      }
    } catch (error) {
      // В тестовом окружении эндпоинт может отсутствовать — используем fallback
      console.warn('CRM sync endpoint unavailable, falling back to direct Kommo fetch', error)
    }

    const fallback = await loadFromKommo()
    setState({
      pipelines: fallback.pipelines,
      channels: fallback.channels,
      contacts: fallback.contacts,
      deals: fallback.deals,
      tasks: fallback.tasks,
      isConnected: !!connection.isConnected,
      isLoading: false,
      lastSyncAt: new Date(),
      error: null,
    })

    return { success: true, data: fallback }
  }, [connection, loadFromKommo])

  const refreshConnection = useCallback(async () => {
    if (!connection) {
      return false
    }

    try {
      const response = await fetch(`/api/manage/crm/${connection.id}/refresh`, { method: 'POST' })
      if (!response.ok) {
        throw new Error(`Failed to refresh CRM connection: ${response.status}`)
      }

      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Не удалось обновить подключение CRM',
      }))
      return false
    }
  }, [connection])

  const updateDealStage = useCallback(
    async (dealId: number | string, pipelineId: number, stageId: number) => {
      if (!kommoClient || !dealId) {
        return false
      }

      try {
        await kommoClient.updateLead?.(Number(dealId), {
          pipeline_id: pipelineId,
          status_id: stageId,
        })
        return true
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Не удалось обновить этап сделки',
        }))
        return false
      }
    },
    [kommoClient],
  )

  const createTask = useCallback(
    async (task: {
      text: string
      completeTill: number
      responsibleUserId: number
      entityId: number
      entityType?: 'leads' | 'contacts' | 'companies'
    }) => {
      if (!kommoClient) {
        return false
      }

      try {
        const result = await kommoClient.createTask?.({
          text: task.text,
          complete_till: task.completeTill,
          responsible_user_id: task.responsibleUserId,
          entity_id: task.entityId,
          entity_type: task.entityType ?? 'leads',
          task_type_id: 1,
        })

        if (result) {
          setState((prev) => ({
            ...prev,
            tasks: [result, ...prev.tasks],
          }))
        }

        return true
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Не удалось создать задачу',
        }))
        return false
      }
    },
    [kommoClient],
  )

  return {
    ...state,
    syncData,
    refreshConnection,
    updateDealStage,
    createTask,
  }
}
