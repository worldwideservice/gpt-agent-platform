'use client'

import { useState } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/shadcn/badge'

interface DealStage {
  id: string
  name: string
  pipelineId: string
}

interface Pipeline {
  id: string
  name: string
  isActive: boolean
  allStages: boolean
  selectedStages: string[]
  stages: DealStage[]
}

interface CRMSyncProps {
  onSync: () => Promise<void>
  pipelines: Pipeline[]
  onPipelineUpdate: (pipelineId: string, updates: Partial<Pipeline>) => void
}

export const CRMSync = ({ onSync, pipelines, onPipelineUpdate }: CRMSyncProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set(['1']))

  const handleSync = async () => {
    setIsLoading(true)
    try {
      await onSync()
    } finally {
      setIsLoading(false)
    }
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
    const pipeline = pipelines.find(p => p.id === pipelineId)
    if (!pipeline) return

    const newSelectedStages = pipeline.selectedStages.includes(stageId)
      ? pipeline.selectedStages.filter(id => id !== stageId)
      : [...pipeline.selectedStages, stageId]

    onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
  }

  const removeStage = (pipelineId: string, stageId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId)
    if (!pipeline) return

    const newSelectedStages = pipeline.selectedStages.filter(id => id !== stageId)
    onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
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
          {pipelines.map((pipeline) => (
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
                  checked={pipeline.isActive}
                  onChange={(checked) => onPipelineUpdate(pipeline.id, { isActive: checked })}
                  label="Активно"
                />
              </div>

              {/* Pipeline Content */}
              {expandedPipelines.has(pipeline.id) && (
                <div className="px-4 pb-4 space-y-4">
                  {/* All Stages Toggle */}
                  <Toggle
                    checked={pipeline.allStages}
                    onChange={(checked) => onPipelineUpdate(pipeline.id, { 
                      allStages: checked,
                      selectedStages: checked ? pipeline.stages.map(s => s.id) : []
                    })}
                    label="Все этапы сделок"
                  />

                  {/* Selected Stages */}
                  {!pipeline.allStages && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Выберите этапы сделок
                      </label>
                      
                      {/* Selected Stages Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pipeline.selectedStages.map((stageId) => {
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
                            .filter(stage => !pipeline.selectedStages.includes(stage.id))
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
          ))}
        </div>
      </div>
    </div>
  )
}
