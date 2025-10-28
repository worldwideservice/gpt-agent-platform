'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/shadcn/badge'
import { useCRMData } from '@/hooks/useCRMData'
import type { UniversalPipeline, UniversalStage, CRMConnection } from '@/types/crm'

interface PipelineSettings {
  id: string
  name: string
  isActive: boolean
  allStages: boolean
  selectedStages: string[]
}

interface CRMSyncProps {
  connection: CRMConnection | null
  pipelineSettings: PipelineSettings[]
  onPipelineUpdate: (pipelineId: string, updates: Partial<PipelineSettings>) => void
}

export const CRMSync = ({ connection, pipelineSettings, onPipelineUpdate }: CRMSyncProps) => {
  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set())
  
  const { 
    pipelines, 
    isLoading, 
    error, 
    syncData, 
    isConnected 
  } = useCRMData(connection)

  // Автоматически разворачиваем первую активную воронку
  useEffect(() => {
    if (pipelines.length > 0 && expandedPipelines.size === 0) {
      const firstActivePipeline = pipelines.find(p => p.isActive)
      if (firstActivePipeline) {
        setExpandedPipelines(new Set([firstActivePipeline.id]))
      }
    }
  }, [pipelines, expandedPipelines.size])

  const handleSync = async () => {
    await syncData()
  }

  const togglePipeline = (pipelineId: string) => {
    const newExpanded = new Set(expandedPipelines)
    if (newExpanded.has(pipelineId)) {
      newExpanded.delete(pipelineId)
    } else {
      newExpanded.add(pipelineId)
    }
    setExpandedPipelines(newExpanded)
  }

  const toggleStage = (pipelineId: string, stageId: string) => {
    const settings = pipelineSettings.find(p => p.id === pipelineId)
    if (!settings) return

    const newSelectedStages = settings.selectedStages.includes(stageId)
      ? settings.selectedStages.filter(id => id !== stageId)
      : [...settings.selectedStages, stageId]

    onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
  }

  const removeStage = (pipelineId: string, stageId: string) => {
    const settings = pipelineSettings.find(p => p.id === pipelineId)
    if (!settings) return

    const newSelectedStages = settings.selectedStages.filter(id => id !== stageId)
    onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
  }

  // Получаем настройки для воронки или создаем дефолтные
  const getPipelineSettings = (pipelineId: string): PipelineSettings => {
    const settings = pipelineSettings.find(p => p.id === pipelineId)
    if (settings) return settings

    // Создаем дефолтные настройки
    const pipeline = pipelines.find(p => p.id === pipelineId)
    return {
      id: pipelineId,
      name: pipeline?.name || 'Неизвестная воронка',
      isActive: false,
      allStages: false,
      selectedStages: []
    }
  }

  return (
    <div className="space-y-6">
      {/* Настройки воронок */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Настройки воронок</h2>
          </div>
          <Button 
            onClick={handleSync} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Синхронизировать настройки CRM
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Выберите воронки и этапы сделок, в которых агент должен работать
        </p>

        <div className="space-y-4">
          {pipelines.map((pipeline) => {
            const settings = getPipelineSettings(pipeline.id)
            return (
              <div key={pipeline.id} className="border border-gray-200 rounded-lg">
                {/* Pipeline Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => togglePipeline(pipeline.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedPipelines.has(pipeline.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <h3 className="font-medium text-gray-900">{pipeline.name}</h3>
                  </div>
                  
                  <Toggle
                    checked={settings.isActive}
                    onChange={(checked) => onPipelineUpdate(pipeline.id, { isActive: checked })}
                    label="Активно"
                  />
                </div>

                {/* Pipeline Content */}
                {expandedPipelines.has(pipeline.id) && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* All Stages Toggle */}
                    <Toggle
                      checked={settings.allStages}
                      onChange={(checked) => onPipelineUpdate(pipeline.id, { 
                        allStages: checked,
                        selectedStages: checked ? pipeline.stages.map(s => s.id) : []
                      })}
                      label="Все этапы сделок"
                    />

                    {/* Selected Stages */}
                    {!settings.allStages && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Выберите этапы сделок
                        </label>
                        
                        {/* Selected Stages Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {settings.selectedStages.map((stageId) => {
                            const stage = pipeline.stages.find(s => s.id === stageId)
                            return stage ? (
                              <Badge key={stageId} variant="secondary" className="flex items-center space-x-1">
                                <span>{stage.name}</span>
                                <button
                                  onClick={() => removeStage(pipeline.id, stageId)}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null
                          })}
                        </div>

                        {/* Available Stages Dropdown */}
                        <div className="relative">
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onChange={(e) => {
                              if (e.target.value) {
                                toggleStage(pipeline.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                          >
                            <option value="">Выбрать вариант</option>
                            {pipeline.stages
                              .filter(stage => !settings.selectedStages.includes(stage.id))
                              .map((stage) => (
                                <option key={stage.id} value={stage.id}>
                                  {stage.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Instructions for Deal Stage */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Инструкции для этапа сделки
                      </h4>
                      <p className="text-sm text-gray-600">
                        Настройте, как агент отвечает на каждом этапе сделки
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
