'use client'

import { useEffect, useState, useCallback } from 'react'
import { CRMSync } from '@/components/crm/CRMSync'
import { KwidSection } from '@/components/kwid'
import type { CRMConnection } from '@/types/crm'

interface PipelineSettings {
  id: string
  name: string
  isActive: boolean
  allStages: boolean
  selectedStages: string[]
  stageInstructions?: Record<string, string>
}

interface PipelinesSettingsSectionProps {
  agentId: string
  orgId: string
}

export const PipelinesSettingsSection = ({ agentId, orgId }: PipelinesSettingsSectionProps) => {
  const [connection, setConnection] = useState<CRMConnection | null>(null)
  const [pipelineSettings, setPipelineSettings] = useState<PipelineSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем CRM connection
  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/crm-connection`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setConnection(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch CRM connection', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConnection()
  }, [agentId])

  // Загружаем pipeline settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/pipeline-settings`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setPipelineSettings(
              data.data.map((s: any) => ({
                id: s.pipeline_id,
                name: s.name || 'Неизвестная воронка',
                isActive: s.is_active,
                allStages: s.all_stages,
                selectedStages: s.selected_stages || [],
                stageInstructions: s.stage_instructions || {},
              }))
            )
          }
        }
      } catch (error) {
        console.error('Failed to fetch pipeline settings', error)
      }
    }

    if (!isLoading) {
      fetchSettings()
    }
  }, [agentId, isLoading])

  // Обновление настроек воронки
  const handlePipelineUpdate = useCallback(
    async (pipelineId: string, updates: Partial<PipelineSettings>) => {
      const updatedSettings = pipelineSettings.map((s) =>
        s.id === pipelineId ? { ...s, ...updates } : s
      )

      // Если воронка еще не в списке, добавляем её
      if (!pipelineSettings.find((s) => s.id === pipelineId)) {
        updatedSettings.push({
          id: pipelineId,
          name: 'Новая воронка',
          isActive: false,
          allStages: false,
          selectedStages: [],
          ...updates,
        } as PipelineSettings)
      }

      setPipelineSettings(updatedSettings)

      // Сохраняем на сервер
      try {
        const response = await fetch(`/api/agents/${agentId}/pipeline-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            updatedSettings.map((s) => ({
              pipelineId: s.id,
              isActive: s.isActive,
              allStages: s.allStages,
              selectedStages: s.selectedStages,
              stageInstructions: s.stageInstructions || {},
            }))
          ),
        })

        if (!response.ok) {
          throw new Error('Failed to save pipeline settings')
        }
      } catch (error) {
        console.error('Failed to save pipeline settings', error)
        // Откатываем изменения в случае ошибки
        // Можно добавить уведомление пользователю
      }
    },
    [agentId, pipelineSettings]
  )

  if (isLoading) {
    return (
      <div className="fi-fo-component-ctn">
        <KwidSection
          title="Настройки воронок"
          description="Выберите воронки и этапы сделок, в которых агент должен работать"
        >
          <div className="fi-section-content p-6">
            <div className="text-center text-sm text-gray-500">Загрузка настроек воронок...</div>
          </div>
        </KwidSection>
      </div>
    )
  }

  if (!connection) {
    return (
      <div className="fi-fo-component-ctn">
        <KwidSection
          title="Настройки воронок"
          description="Выберите воронки и этапы сделок, в которых агент должен работать"
        >
          <div className="fi-section-content p-6">
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              CRM не подключен. Подключите интеграцию в разделе "Интеграции".
            </div>
          </div>
        </KwidSection>
      </div>
    )
  }

  return (
    <div className="fi-fo-component-ctn">
      <KwidSection
        title="Настройки воронок"
        description="Выберите воронки и этапы сделок, в которых агент должен работать"
      >
        <div className="fi-section-content p-6">
          <CRMSync
            connection={connection}
            pipelineSettings={pipelineSettings}
            onPipelineUpdate={handlePipelineUpdate}
          />
        </div>
      </KwidSection>
    </div>
  )
}

