'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/shadcn/badge'
import { useCRMData } from '@/hooks/useCRMData'
import type { UniversalPipeline, UniversalStage, CRMConnection } from '@/types/crm'

interface PipelineSettings {
 id: string
 name: string
 isActive: boolean
 allStages: boolean
 selectedStages: string[]
 stageInstructions?: Record<string, string>
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
 selectedStages: [],
 stageInstructions: {},
 }
 }

 return (
 <div className="space-y-6">
 {/* Кнопка синхронизации и описание */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex-1"></div>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
 Синхронизировать настройки CRM
 </Button>
 </div>

 <div className="space-y-4">
 {pipelines.map((pipeline) => {
 const settings = getPipelineSettings(pipeline.id)
 return (
      <div key={pipeline.id} className="rounded-lg border border-gray-200">
        {/* Pipeline Header */}
        <div className="flex items-center justify-between bg-gray-50 p-4">
          <div className="flex flex-1 items-center space-x-3">
            <button
              onClick={() => togglePipeline(pipeline.id)}
              className="text-gray-400 transition-colors hover:text-gray-600"
              aria-label={expandedPipelines.has(pipeline.id) ? 'Свернуть' : 'Развернуть'}
            >
              {expandedPipelines.has(pipeline.id) ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <h3 className="font-medium uppercase text-gray-900">{pipeline.name}</h3>
          </div>
 
 <Switch
 checked={settings.isActive}
 onCheckedChange={(checked) => onPipelineUpdate(pipeline.id, { isActive: checked })}
 />
 </div>

        {/* Pipeline Content */}
        {expandedPipelines.has(pipeline.id) && (
          <div className="space-y-4 border-t border-gray-100 px-4 pb-4">
 {/* All Stages Toggle */}
 <div className="flex items-center justify-between">
 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
   <Switch
     checked={settings.allStages}
     onCheckedChange={(checked) => onPipelineUpdate(pipeline.id, { 
       allStages: checked,
       selectedStages: checked ? pipeline.stages.map(s => s.id) : []
     })}
   />
   Все этапы сделок
 </label>
 </div>

 {/* Selected Stages */}
 {!settings.allStages && (
 <div>
            <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
              Выберите этапы сделок
              <span className="text-red-500">*</span>
              <button
                type="button"
                className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                title="Информация о выборе этапов сделок"
              >
                <span className="text-xs">i</span>
              </button>
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
 <Select
 options={[
 { value: '', label: 'Выбрать вариант' },
 ...pipeline.stages
 .filter(stage => !settings.selectedStages.includes(stage.id))
 .map((stage) => ({ value: stage.id, label: stage.name })),
 ]}
 value=""
 onChange={(value) => {
 if (value) {
 toggleStage(pipeline.id, value)
 }
 }}
 />
 </div>
 )}

 {/* Instructions for Deal Stage */}
 {settings.selectedStages.length > 0 && (
 <div className="space-y-3">
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-2">
 Инструкции для этапа сделки
 </h4>
 <p className="text-sm text-gray-600 mb-3">
 Настройте, как агент отвечает на каждом этапе сделки
 </p>
 </div>
 {settings.selectedStages.map((stageId) => {
 const stage = pipeline.stages.find(s => s.id === stageId)
 if (!stage) return null

 const instructions = (settings.stageInstructions as Record<string, string>) || {}
 const currentInstruction = instructions[stageId] || ''

            return (
              <div key={stageId} className="rounded-lg border border-gray-200 p-3">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {stage.name}
                </label>
                <Textarea
                  placeholder="Введите инструкции для этого этапа..."
                  value={currentInstruction}
                  onChange={(e) => {
                    const newInstructions = {
                      ...instructions,
                      [stageId]: e.target.value,
                    }
                    onPipelineUpdate(pipeline.id, {
                      stageInstructions: newInstructions,
                    })
                  }}
                  className="min-h-[80px]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Эти инструкции будут использоваться агентом при работе с этой стадией сделки
                </p>
              </div>
            )
 })}
 </div>
 )}
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>
 )
}
